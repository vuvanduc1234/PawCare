// Controller xử lý Provider
import Provider from '../models/Provider.js';

/**
 * Tạo hồ sơ Provider mới
 * POST /providers
 */
export const createProvider = async (req, res, next) => {
  try {
    const {
      businessName,
      description,
      category,
      email,
      phone,
      address,
      workingHours,
    } = req.body;

    // Kiểm tra email đã tồn tại
    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được đăng ký',
      });
    }

    const newProvider = new Provider({
      businessName,
      description,
      category,
      email,
      phone,
      address,
      workingHours,
      owner: req.user.id,
    });

    await newProvider.save();

    res.status(201).json({
      success: true,
      message: 'Tạo hồ sơ Provider thành công',
      data: newProvider,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách Provider có phân trang
 * GET /providers
 */
export const getProviders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, city, search } = req.query;

    // Xây dựng filter
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (city) filter['address.city'] = city;
    if (search) {
      filter.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const providers = await Provider.find(filter)
      .populate('owner', 'fullName phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'rating.average': -1 });

    const total = await Provider.countDocuments(filter);

    res.json({
      success: true,
      data: providers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết Provider
 * GET /providers/:id
 */
export const getProviderById = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id).populate(
      'owner',
      'fullName phone email'
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider không tồn tại',
      });
    }

    res.json({
      success: true,
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật hồ sơ Provider
 * PUT /providers/:id
 */
export const updateProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Kiểm tra quyền (chỉ chủ Provider hoặc admin)
    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider không tồn tại',
      });
    }

    if (
      provider.owner.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật Provider này',
      });
    }

    // Cập nhật
    const updatedProvider = await Provider.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Cập nhật Provider thành công',
      data: updatedProvider,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa Provider
 * DELETE /providers/:id
 */
export const deleteProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider không tồn tại',
      });
    }

    // Kiểm tra quyền
    if (
      provider.owner.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa Provider này',
      });
    }

    await Provider.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Xóa Provider thành công',
    });
  } catch (error) {
    next(error);
  }
};