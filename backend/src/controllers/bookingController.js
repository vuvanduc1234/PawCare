import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Pet from '../models/Pet.js';
import User from '../models/User.js';
import Provider from '../models/Provider.js';

/**
 * Utility: Kiểm tra trùng lịch
 */
const checkBookingConflict = async (providerId, bookingDate, startTime, duration, excludeBookingId = null) => {
  const bookingStart = new Date(`${bookingDate}T${startTime}`);
  const bookingEnd = new Date(bookingStart.getTime() + duration * 60000);

  const query = {
    provider: providerId,
    bookingDate: new Date(bookingDate),
    status: { $in: ['pending', 'confirmed'] },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const existingBookings = await Booking.find(query);

  for (const booking of existingBookings) {
    const existingStart = new Date(`${booking.bookingDate.toISOString().split('T')[0]}T${booking.startTime}`);
    const existingEnd = new Date(existingStart.getTime() + (booking.duration || 60) * 60000);

    if (bookingStart < existingEnd && bookingEnd > existingStart) {
      return true; // Có trùng lịch
    }
  }

  return false;
};

/**
 * POST /api/bookings
 * Tạo booking mới
 */
export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      serviceId,
      petId,
      bookingDate,
      timeSlot,
      notes,
    } = req.body;

    if (!serviceId || !petId || !bookingDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp serviceId, petId, bookingDate, timeSlot',
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dịch vụ' });
    }

    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thú cưng' });
    }

    if (pet.owner.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Bạn không sở hữu thú cưng này' });
    }

    // Kiểm tra ngày booking - parse với timezone local
    const [year, month, day] = bookingDate.split('-').map(Number);
    const bookingDateObj = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDateObj < today) {
      return res.status(400).json({ success: false, message: 'Ngày đặt lịch phải là ngày trong tương lai' });
    }

    // Kiểm tra trùng lịch
    const hasConflict = await checkBookingConflict(
      service.provider,
      bookingDate,
      timeSlot,
      service.duration
    );

    if (hasConflict) {
      return res.status(400).json({
        success: false,
        message: 'Thời gian này đã có lịch khác. Vui lòng chọn thời gian khác',
      });
    }

    const bookingCode = `BK${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const totalPrice = service.price;

    console.log('Creating booking with data:', {
      bookingCode,
      user: userId,
      provider: service.provider,
      pet: petId,
      bookingDate: bookingDateObj,
      startTime: timeSlot,
      endTime: new Date(`${bookingDate}T${timeSlot}`),
    });

    const booking = new Booking({
      bookingCode,
      user: userId,
      provider: service.provider,
      pet: petId,
      service: {
        name: service.name,
        price: service.price,
        duration: service.duration,
      },
      bookingDate: bookingDateObj,
      startTime: timeSlot,
      endTime: (() => {
        try {
          const duration = service.duration || 60;
          const start = new Date(`${bookingDate}T${timeSlot}:00`);
          if (isNaN(start.getTime())) return '';
          return new Date(start.getTime() + duration * 60000)
            .toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        } catch { return ''; }
      })(),
      notes,
      totalAmount: totalPrice,
      status: 'pending',
    });

    await booking.save();

    // Populate sau khi save
    await booking.populate('user', 'fullName email phone');
    await booking.populate('provider', 'fullName email');
    await booking.populate('pet', 'name avatar');

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Đặt lịch thành công. Chờ xác nhận từ cơ sở dịch vụ!',
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    next(error);
  }
};

/**
 * GET /api/bookings/my
 * Lấy danh sách booking của user hiện tại
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để xem danh sách booking',
      });
    }

    const filter = { user: userId };

    if (status && ['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      filter.status = status;
    }

    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit)));

    const skip = (pageNum - 1) * pageSize;

    const bookings = await Booking.find(filter)
      .populate('provider', 'fullName email phone avatar')
      .populate('pet', 'name avatar type')
      .populate('service', 'name price duration')
      .sort({ bookingDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('❌ Error in getMyBookings:', error.message);
    console.error('Stack:', error.stack);
    next(error);
  }
};

/**
 * GET /api/bookings/provider
 * Lấy danh sách booking của provider hiện tại
 */
export const getProviderBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const providerId = req.user.id;

    const user = await User.findById(providerId);
    if (!user || user.role !== 'provider') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ provider mới có thể xem lịch hẹn của họ',
      });
    }

    const filter = { provider: providerId };
    if (status && ['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      filter.status = status;
    }

    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * pageSize;

    const bookings = await Booking.find(filter)
      .populate('user', 'fullName email phone avatar')
      .populate('pet', 'name avatar type')
      .populate('service', 'name price duration')
      .sort({ bookingDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('❌ Error in getProviderBookings:', error.message);
    next(error);
  }
};

/**
 * GET /api/bookings/:id
 * Lấy chi tiết booking
 */
export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(id)
      .populate('user', 'fullName email phone avatar')
      .populate('provider', 'fullName email phone avatar')
      .populate('pet', 'name avatar type')
      .populate('service', 'name price duration');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy booking',
      });
    }

    // Kiểm tra quyền xem
    if (booking.user._id.toString() !== userId && booking.provider.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem booking này',
      });
    }

    res.json({
      success: true,
      data: booking,
      message: 'Lấy chi tiết booking thành công',
    });
  } catch (error) {
    console.error('Error in getBookingById:', error);
    next(error);
  }
};

/**
 * PUT /api/bookings/:id/status
 * Cập nhật trạng thái booking
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, cancelReason } = req.body;
    const userId = req.user.id;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy booking' });
    }

    if (booking.provider.toString() !== userId && booking.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền cập nhật booking này' });
    }

    if (status === 'cancelled' && !cancelReason) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập lý do huỷ' });
    }

    booking.status = status;
    if (status === 'cancelled') booking.cancelReason = cancelReason;

    await booking.save();

    res.json({
      success: true,
      data: booking,
      message: `Cập nhật trạng thái thành ${status} thành công`,
    });
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    next(error);
  }
};

/**
 * POST /api/bookings/:id/review
 * Thêm đánh giá cho booking
 */
export const addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating phải từ 1 đến 5' });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        review: {
          rating: parseInt(rating),
          comment,
          reviewDate: new Date(),
        },
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking không tồn tại' });
    }

    res.json({
      success: true,
      message: 'Thêm đánh giá thành công',
      data: booking,
    });
  } catch (error) {
    console.error('Error in addReview:', error);
    next(error);
  }
};