import Pet from '../models/Pet.js';
import User from '../models/User.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import mongoose from 'mongoose';

/**
 * Controller: Quản lý thú cưng (Pet)
 * Các hàm xử lý CRUD operations cho Pet
 */

/**
 * GET /api/pets
 * Lấy danh sách toàn bộ thú cưng của user hiện tại
 * Chỉ user là chủ sở hữu mới có thể xem thú cưng của mình
 */
export const getPets = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Tìm tất cả pets của user này
    const pets = await Pet.find({ owner: userId })
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: pets,
      message: `Lấy ${pets.length} pets thành công`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/pets/:id
 * Lấy chi tiết một thú cưng
 * Chỉ chủ sở hữu hoặc admin mới có thể xem
 */
export const getPetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Tìm pet
    const pet = await Pet.findById(id)
      .populate('owner', 'fullName email phone')
      .select('-__v');

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thú cưng',
      });
    }

    // Kiểm tra quyền: chỉ owner hoặc admin có thể xem
    if (pet.owner._id.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem thú cưng này',
      });
    }

    res.json({
      success: true,
      data: pet,
      message: 'Lấy chi tiết thú cưng thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/pets
 * Tạo thú cưng mới
 * Upload ảnh lên Cloudinary nếu có
 */
export const createPet = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, type, breed, age, weight, color, gender, notes } = req.body;

    // Validation
    if (!name || !type || !breed || age == null || weight == null) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tên, loài, giống, tuổi, cân nặng',
      });
    }

    // Kiểm tra type hợp lệ
    const validTypes = ['dog', 'cat', 'bird', 'rabbit', 'other'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Loài thú cưng không hợp lệ',
      });
    }

    // Kiểm tra dữ liệu số hợp lệ
    if (age < 0 || weight <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Tuổi hoặc cân nặng không hợp lệ',
      });
    }

    // Upload ảnh nếu có
    let avatar = null;
    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file.buffer, `pets/${userId}`);
        avatar = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Upload lỗi:', uploadError);
        // Tiếp tục nếu upload thất bại, không phải lỗi fatal
      }
    }

    // Tạo pet mới
    const pet = new Pet({
      name,
      type,
      breed,
      age,
      weight,
      color: color || '',
      gender: gender || 'unknown',
      notes: notes || '',
      avatar,
      owner: userId,
    });

    await pet.save();

    // Populate owner info
    await pet.populate('owner', 'fullName email');

    res.status(201).json({
      success: true,
      data: pet,
      message: 'Tạo thú cưng thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/pets/:id
 * Cập nhật thông tin thú cưng
 * Chỉ chủ sở hữu có thể cập nhật
 */
export const updatePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    // Tìm pet
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thú cưng',
      });
    }

    // Kiểm tra quyền: chỉ owner có thể cập nhật
    if (pet.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật thú cưng này',
      });
    }

    // Các field có thể update
    const allowedUpdates = ['name', 'breed', 'age', 'weight', 'color', 'gender', 'notes', 'isActive'];
    const updateKeys = Object.keys(updates).filter(key => allowedUpdates.includes(key));

    // Update từng field
    updateKeys.forEach(key => {
      pet[key] = updates[key];
    });

    // Nếu có file upload, update avatar
    if (req.file) {
      try {
        // Xoá ảnh cũ nếu có
        if (pet.avatar) {
          try {
            await deleteImage(pet.avatar);
          } catch (err) {
            console.error('Xoá ảnh cũ lỗi:', err);
          }
        }

        // Upload ảnh mới
        const uploadResult = await uploadImage(req.file.buffer, `pets/${userId}`);
        pet.avatar = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Upload ảnh lỗi:', uploadError);
      }
    }

    // Validation
    if (updates.age != null && updates.age < 0) {
      return res.status(400).json({
        success: false,
        message: 'Tuổi không hợp lệ',
      });
    }

    if (updates.weight != null && updates.weight <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Cân nặng phải lớn hơn 0',
      });
    }

    await pet.save();

    res.json({
      success: true,
      data: pet,
      message: 'Cập nhật thú cưng thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/pets/:id
 * Xoá thú cưng
 * Chỉ chủ sở hữu hoặc admin có thể xoá
 */
export const deletePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Tìm pet
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thú cưng',
      });
    }

    // Kiểm tra quyền
    if (pet.owner.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xoá thú cưng này',
      });
    }

    // Xoá ảnh trên Cloudinary nếu có
    if (pet.avatar) {
      try {
        await deleteImage(pet.avatar);
      } catch (deleteError) {
        console.error('Xoá ảnh lỗi:', deleteError);
        // Tiếp tục xoá pet mặc dù xoá ảnh thất bại
      }
    }

    // Xoá pet
    await Pet.findByIdAndDelete(id);

    res.json({
      success: true,
      data: null,
      message: 'Xoá thú cưng thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/pets/stats/count
 * Lấy số lượng thú cưng của user
 */
export const getPetStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const count = await Pet.countDocuments({ owner: userId });
    const types = await Pet.aggregate([
      { $match: { owner: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        total: count,
        byType: types,
      },
      message: 'Lấy thống kê thú cưng thành công',
    });
  } catch (error) {
    next(error);
  }
};
