import Product from '../models/Product.js';

/**
 * PUBLIC: Lấy danh sách sản phẩm (với filter, search, pagination)
 */
export const getProducts = async (req, res) => {
  try {
    const { search, category, petType, sort = '-createdAt', page = 1, limit = 12 } = req.query;
    
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (petType) filter.petTypes = petType;
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('seller', 'fullName');
    
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải danh sách sản phẩm',
      error: error.message,
    });
  }
};

/**
 * PUBLIC: Lấy chi tiết sản phẩm
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'fullName email phone');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * SELLER: Tạo sản phẩm mới
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, petTypes, stock, sku, tags } = req.body;
    
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ success: false, message: 'Thông tin sản phẩm không đầy đủ' });
    }

    const product = new Product({
      name,
      description,
      price,
      discount: discount || 0,
      category,
      petTypes: petTypes || ['dog', 'cat'],
      stock,
      sku: sku || `SKU-${Date.now()}`,
      tags: tags || [],
      seller: req.user._id,
      images: req.files?.length > 0 
        ? req.files.map(f => ({ url: f.path, public_id: f.filename }))
        : [],
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * SELLER: Cập nhật sản phẩm
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    // Kiểm tra quyền (chỉ owner hoặc admin)
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền cập nhật' });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({ success: true, message: 'Cập nhật sản phẩm thành công', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * SELLER: Xóa sản phẩm
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUBLIC: Đánh giá sản phẩm
 */
export const reviewProduct = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating phải từ 1-5' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    // Kiểm tra user đã review chưa
    const existingReview = product.reviews.find(r => r.userId?.toString() === req.user._id.toString());
    
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      product.reviews.push({
        userId: req.user._id,
        userName: req.user.fullName,
        rating,
        comment,
      });
    }

    // Tính lại rating trung bình
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / product.reviews.length;
    product.reviewCount = product.reviews.length;

    await product.save();

    res.json({ success: true, message: 'Đánh giá sản phẩm thành công', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
