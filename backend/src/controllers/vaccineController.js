import Vaccine from '../models/Vaccine.js';
import Pet from '../models/Pet.js';

/**
 * Controller: Quản lý lịch tiêm chủng (Vaccine)
 */

/**
 * GET /api/pets/:petId/vaccines
 * Lấy danh sách lịch tiêm của thú cưng
 */
export const getVaccines = async (req, res, next) => {
  try {
    const { petId } = req.params;
    const userId = req.user.id;

    // Kiểm tra pet tồn tại và là của user
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thú cưng',
      });
    }

    if (pet.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem lịch tiêm này',
      });
    }

    // Lấy danh sách vaccine, sắp xếp theo dueDate
    const vaccines = await Vaccine.find({ pet: petId })
      .select('-__v')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: vaccines,
      message: `Lấy ${vaccines.length} lịch tiêm thành công`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/pets/:petId/vaccines
 * Thêm lịch tiêm mới cho thú cưng
 */
export const createVaccine = async (req, res, next) => {
  try {
    const { petId } = req.params;
    const userId = req.user.id;
    const {
      name,
      description,
      manufacturer,
      dueDate,
      notes,
      veterinarian,
      batchNumber,
    } = req.body;

    // Kiểm tra pet
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thú cưng',
      });
    }

    if (pet.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thêm lịch tiêm cho thú cưng này',
      });
    }

    // Validation
    if (!name || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên vaccine và ngày tiêm',
      });
    }

    // Kiểm tra dueDate là ngày trong tương lai
    const dueDateObj = new Date(dueDate);
    if (dueDateObj < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Ngày tiêm phải là ngày trong tương lai',
      });
    }

    // Tạo vaccine mới
    const vaccine = new Vaccine({
      pet: petId,
      name,
      description,
      manufacturer,
      batchNumber,
      dueDate: dueDateObj,
      notes,
      veterinarian,
      status: 'pending',
    });

    await vaccine.save();

    res.status(201).json({
      success: true,
      data: vaccine,
      message: 'Thêm lịch tiêm thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/vaccines/:id
 * Cập nhật trạng thái lịch tiêm (mark as done, etc.)
 */
export const updateVaccine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status, completedDate, notes, reactions, veterinarian } = req.body;

    // Tìm vaccine
    const vaccine = await Vaccine.findById(id).populate('pet');
    if (!vaccine) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch tiêm',
      });
    }

    // Kiểm tra quyền - chỉ owner của pet mới có thể update
    if (vaccine.pet.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật lịch tiêm này',
      });
    }

    // Cập nhật các field
    if (status) {
      if (!['pending', 'done', 'overdue', 'skipped'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái không hợp lệ',
        });
      }
      vaccine.status = status;

      // Nếu mark as done, set completedDate
      if (status === 'done') {
        vaccine.completedDate = completedDate || new Date();
      }
    }

    if (notes !== undefined) vaccine.notes = notes;
    if (veterinarian !== undefined) vaccine.veterinarian = veterinarian;
    if (reactions) vaccine.reactions = reactions;

    await vaccine.save();

    res.json({
      success: true,
      data: vaccine,
      message: 'Cập nhật lịch tiêm thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/vaccines/:id
 * Xoá lịch tiêm
 */
export const deleteVaccine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Tìm vaccine
    const vaccine = await Vaccine.findById(id).populate('pet');
    if (!vaccine) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch tiêm',
      });
    }

    // Kiểm tra quyền
    if (vaccine.pet.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xoá lịch tiêm này',
      });
    }

    // Xoá
    await Vaccine.findByIdAndDelete(id);

    res.json({
      success: true,
      data: null,
      message: 'Xoá lịch tiêm thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/vaccines/upcoming
 * Lấy danh sách vaccine sắp tới (dueDate <= 7 ngày)
 */
export const getUpcomingVaccines = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const daysAhead = parseInt(req.query.days) || 7;

    // Lấy pets của user
    const pets = await Pet.find({ owner: userId });
    const petIds = pets.map(p => p._id);

    // Lấy vaccines sắp tới
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const vaccines = await Vaccine.find({
      pet: { $in: petIds },
      status: { $in: ['pending', 'overdue'] },
      dueDate: { $gte: today, $lte: futureDate },
    })
      .populate('pet', 'name avatar')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: vaccines,
      message: `Lấy ${vaccines.length} lịch tiêm sắp tới`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/vaccines/:id/skip
 * Bỏ qua lịch tiêm
 */
export const skipVaccine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reason } = req.body;

    const vaccine = await Vaccine.findById(id).populate('pet');
    if (!vaccine) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch tiêm',
      });
    }

    if (vaccine.pet.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền bỏ qua lịch tiêm này',
      });
    }

    vaccine.status = 'skipped';
    vaccine.isSkipped = true;
    vaccine.skipReason = reason || '';

    await vaccine.save();

    res.json({
      success: true,
      data: vaccine,
      message: 'Bỏ qua lịch tiêm thành công',
    });
  } catch (error) {
    next(error);
  }
};
