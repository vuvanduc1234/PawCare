import Service from '../models/Service.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';

/**
 * GET /api/services
 * Tìm kiếm dịch vụ với filters - ĐÃ SỬA HOÀN CHỈNH
 */
export const searchServices = async (req, res, next) => {
  try {
    const {
      category = '',
      city = '',
      search = '',
      lat,
      lng,
      radius = 50,
      minPrice,
      maxPrice,
      minRating = 0,
      page = 1,
      limit = 12,
      sortBy = 'distance',
    } = req.query;

    console.log('🔍 Search Filters received:', req.query);

    const query = {
      isApproved: true,
      isActive: true,
    };

    // ==================== FILTER CƠ BẢN ====================
    if (category && category.trim() !== '') {
      query.category = category;
    }

    if (city && city.trim() !== '') {
      query.city = city;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter theo giá
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Filter theo rating
    if (minRating && parseFloat(minRating) > 0) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * pageSize;

    // Lấy dịch vụ theo filter cơ bản
    let services = await Service.find(query)
      .populate('provider', 'fullName email avatar')
      .lean();

    console.log(`📊 Found ${services.length} services before distance filter`);

    // ==================== XỬ LÝ KHOẢNG CÁCH ====================
    if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      services = services.map((service) => {
        if (!service.latitude || !service.longitude) {
          return { ...service, distance: 9999 };
        }

        const distance = calculateDistance(
          userLat,
          userLng,
          service.latitude,
          service.longitude
        );

        return {
          ...service,
          distance: Math.round(distance * 10) / 10,
        };
      });

      // Sắp xếp
      if (sortBy === 'distance') {
        services.sort((a, b) => a.distance - b.distance);
      } else if (sortBy === 'rating' || sortBy === '-rating') {
        services.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'price_asc' || sortBy === 'price') {
        services.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        services.sort((a, b) => b.price - a.price);
      }
    }

    // Pagination
    const paginatedServices = services.slice(skip, skip + pageSize);
    const total = services.length;

    res.json({
      success: true,
      data: paginatedServices,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        pages: Math.ceil(total / pageSize),
      },
      message: `Tìm thấy ${paginatedServices.length} dịch vụ`,
    });
  } catch (error) {
    console.error('❌ Error in searchServices:', error.message);
    console.error('Stack:', error.stack);
    next(error);
  }
};

// Hàm tính khoảng cách Haversine
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos((lat2 * Math.PI) / 180);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/* ====================== CÁC HÀM KHÁC ====================== */

export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate('provider', 'fullName email avatar rating reviews')
      .populate('reviews.user', 'fullName avatar');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ',
      });
    }

    res.json({
      success: true,
      data: service,
      message: 'Lấy chi tiết dịch vụ thành công',
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== 'provider' && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ nhà cung cấp mới có thể tạo dịch vụ',
      });
    }

    const {
      name, category, description, price, duration, address,
      latitude, longitude, city, district, workingHours,
      phone, email, website,
    } = req.body;

    // Parse petTypes: hỗ trợ FormData array (petTypes[]) lẫn JSON string
    let petTypes = req.body['petTypes[]'] || req.body.petTypes || [];
    if (typeof petTypes === 'string') {
      try { petTypes = JSON.parse(petTypes); } catch { petTypes = [petTypes]; }
    }
    if (!Array.isArray(petTypes)) petTypes = [petTypes];

    // Parse tags tương tự
    let tags = req.body.tags || [];
    if (typeof tags === 'string') {
      try { tags = JSON.parse(tags); } catch { tags = [tags]; }
    }
    if (!Array.isArray(tags)) tags = [tags];

    const requiredFields = ['name', 'category', 'description', 'price', 'duration', 'address', 'city'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `Vui lòng nhập ${field}`,
        });
      }
    }

    const validCategories = ['grooming', 'hotel', 'clinic', 'training', 'daycare', 'walking', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục không hợp lệ',
      });
    }

    if (price <= 0) return res.status(400).json({ success: false, message: 'Giá phải lớn hơn 0' });
    if (duration < 15) return res.status(400).json({ success: false, message: 'Thời lượng phải ít nhất 15 phút' });

    let images = [];
    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const uploadResult = await uploadImage(file.buffer, `services/${userId}`);
          images.push({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
          });
        }
      } catch (uploadError) {
        console.error('Upload ảnh lỗi:', uploadError);
      }
    }

    const service = new Service({
      provider: userId,
      name,
      category,
      description,
      price,
      duration,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      city,
      district,
      petTypes,
      workingHours,
      phone,
      email,
      website,
      tags,
      images,
      isApproved: true, // Provider tạo dịch vụ được duyệt tự động
    });

    await service.save();

    res.status(201).json({
      success: true,
      data: service,
      message: 'Tạo dịch vụ thành công!',
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ',
      });
    }

    // Kiểm tra quyền sửa
    if (userRole !== 'admin' && service.provider.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền sửa dịch vụ này',
      });
    }

    const {
      name, category, description, price, duration, address,
      latitude, longitude, city, district, petTypes, workingHours,
      phone, email, website, tags,
    } = req.body;

    // Cập nhật các trường
    if (name) service.name = name;
    if (category) service.category = category;
    if (description) service.description = description;
    if (price) service.price = price;
    if (duration) service.duration = duration;
    if (address) service.address = address;
    if (latitude) service.latitude = parseFloat(latitude);
    if (longitude) service.longitude = parseFloat(longitude);
    if (city) service.city = city;
    if (district) service.district = district;
    if (petTypes) service.petTypes = petTypes;
    if (workingHours) service.workingHours = workingHours;
    if (phone) service.phone = phone;
    if (email) service.email = email;
    if (website) service.website = website;
    if (tags) service.tags = tags;

    // Upload ảnh mới nếu có
    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const uploadResult = await uploadImage(file.buffer, `services/${userId}`);
          service.images.push({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
          });
        }
      } catch (uploadError) {
        console.error('Upload ảnh lỗi:', uploadError);
      }
    }

    await service.save();

    res.json({
      success: true,
      data: service,
      message: 'Cập nhật dịch vụ thành công',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ',
      });
    }

    // Kiểm tra quyền xoá
    if (userRole !== 'admin' && service.provider.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xoá dịch vụ này',
      });
    }

    // Xoá ảnh từ Cloudinary
    if (service.images && service.images.length > 0) {
      try {
        for (const image of service.images) {
          await deleteImage(image.url);
        }
      } catch (deleteError) {
        console.error('Xoá ảnh lỗi:', deleteError);
      }
    }

    await Service.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Xoá dịch vụ thành công',
    });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Đánh giá phải từ 1 đến 5 sao',
      });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ',
      });
    }

    // Kiểm tra đã đánh giá chưa
    const existingReview = service.reviews.find(
      (r) => r.user.toString() === userId
    );
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đánh giá dịch vụ này',
      });
    }

    service.reviews.push({
      user: userId,
      rating,
      comment: comment || '',
    });

    // Tính rating trung bình
    const totalRating = service.reviews.reduce((sum, r) => sum + r.rating, 0);
    service.rating = Math.round((totalRating / service.reviews.length) * 10) / 10;

    await service.save();

    res.json({
      success: true,
      data: service,
      message: 'Đánh giá dịch vụ thành công',
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderServices = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * pageSize;

    const services = await Service.find({ provider: providerId })
      .skip(skip)
      .limit(pageSize)
      .populate('provider', 'fullName email avatar')
      .populate('reviews.user', 'fullName avatar');

    const total = await Service.countDocuments({ provider: providerId });

    res.json({
      success: true,
      data: services,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        pages: Math.ceil(total / pageSize),
      },
      message: `Tìm thấy ${services.length} dịch vụ`,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  searchServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  addReview,
  getProviderServices,
};