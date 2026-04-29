// Controller xử lý Booking
import Booking from '../models/Booking.js';

/**
 * Tạo booking mới
 * POST /bookings
 */
export const createBooking = async (req, res, next) => {
  try {
    const {
      provider,
      pet,
      service,
      bookingDate,
      startTime,
      notes,
    } = req.body;

    // Tạo booking code
    const bookingCode = `BK${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    const newBooking = new Booking({
      bookingCode,
      user: req.user.userId,
      provider,
      pet,
      service,
      bookingDate,
      startTime,
      notes,
      status: 'pending',
    });

    await newBooking.save();
    await newBooking.populate('user provider pet');

    res.status(201).json({
      success: true,
      message: 'Tạo đặt lịch thành công',
      data: newBooking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách booking của user
 * GET /bookings/my-bookings
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user.userId;

    const filter = { user: userId };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('provider', 'businessName category')
      .populate('pet', 'name type')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ bookingDate: -1 });

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
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
 * Lấy danh sách booking của Provider
 * GET /bookings/provider-bookings
 */
export const getProviderBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const providerId = req.query.providerId;

    const filter = { provider: providerId };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('user', 'fullName phone')
      .populate('pet', 'name type')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ bookingDate: -1 });

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
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
 * Lấy chi tiết booking
 * GET /bookings/:id
 */
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user')
      .populate('provider')
      .populate('pet');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking không tồn tại',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật trạng thái booking
 * PUT /bookings/:id/status
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, cancelReason } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status,
        cancelReason: status === 'cancelled' ? cancelReason : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking không tồn tại',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Thêm đánh giá cho booking
 * POST /bookings/:id/review
 */
export const addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        review: {
          rating,
          comment,
          reviewDate: new Date(),
        },
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking không tồn tại',
      });
    }

    res.json({
      success: true,
      message: 'Thêm đánh giá thành công',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
