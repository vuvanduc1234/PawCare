import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';
import Post from '../models/Post.js';

const buildMonthlyBuckets = (monthsBack = 6) => {
  const now = new Date();
  const buckets = [];
  for (let i = monthsBack - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    buckets.push({ key, total: 0 });
  }
  return buckets;
};

export const getOverviewStats = async (req, res, next) => {
  try {
    const [userCount, providerCount, bookingCount] = await Promise.all([
      User.countDocuments({}),
      Provider.countDocuments({}),
      Booking.countDocuments({}),
    ]);

    const buckets = buildMonthlyBuckets(6);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const revenueAgg = await Booking.aggregate([
      {
        $match: {
          status: 'completed',
          bookingDate: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$bookingDate' },
            month: { $month: '$bookingDate' },
          },
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    revenueAgg.forEach((row) => {
      const key = `${row._id.year}-${String(row._id.month).padStart(2, '0')}`;
      const bucket = buckets.find((item) => item.key === key);
      if (bucket) {
        bucket.total = row.total;
      }
    });

    res.json({
      success: true,
      data: {
        userCount,
        providerCount,
        bookingCount,
        monthlyRevenue: buckets,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingProviders = async (req, res, next) => {
  try {
    const providers = await Provider.find({ isVerified: false })
      .populate('owner', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: providers,
    });
  } catch (error) {
    next(error);
  }
};

export const approveProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { isVerified: true, isActive: true },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider không tồn tại',
      });
    }

    res.json({
      success: true,
      message: 'Duyệt cơ sở thành công',
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { isVerified: false, isActive: false },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider không tồn tại',
      });
    }

    res.json({
      success: true,
      message: 'Từ chối cơ sở thành công',
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, includeDeleted = 'false' } = req.query;
    const filter = includeDeleted === 'true' ? {} : { isDeleted: false };

    const posts = await Post.find(filter)
      .populate('author', 'fullName avatar')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const bookingByMonth = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$bookingDate' },
            month: { $month: '$bookingDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const bookingByDay = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$bookingDate' },
            month: { $month: '$bookingDate' },
            day: { $dayOfMonth: '$bookingDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
      { $limit: 30 },
    ]);

    const topServices = await Booking.aggregate([
      {
        $group: {
          _id: '$service.name',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: {
        bookingByMonth: bookingByMonth.map((item) => ({
          label: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
          count: item.count,
        })),
        bookingByDay: bookingByDay.map((item) => ({
          label: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(
            item._id.day
          ).padStart(2, '0')}`,
          count: item.count,
        })),
        topServices: topServices.map((item) => ({
          name: item._id || 'Unknown',
          count: item.count,
          revenue: item.revenue,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
