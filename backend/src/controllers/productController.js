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
    console.log('DEBUG createProduct - req.body:', req.body);
    console.log('DEBUG createProduct - req.files:', req.files?.length);
    
    let { name, description, price, discount, category, stock, sku, tags } = req.body;
    let petTypes = req.body.petTypes;
    
    // Log the received values for debugging
    console.log('DEBUG - Received fields:', { name, description, price, category, stock, petTypes });
    
    // Handle FormData array notation: petTypes[] comes as array or string
    if (Array.isArray(petTypes)) {
      // Already an array - good
    } else if (petTypes && typeof petTypes === 'string') {
      // Convert single string to array
      petTypes = [petTypes];
    } else if (!petTypes) {
      petTypes = ['dog', 'cat']; // default
    }
    
    // Parse tags if it's a JSON string
    let tagsArray = [];
    if (tags) {
      try {
        if (typeof tags === 'string' && tags.startsWith('[')) {
          tagsArray = JSON.parse(tags);
        } else if (typeof tags === 'string') {
          tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
        } else if (Array.isArray(tags)) {
          tagsArray = tags;
        }
      } catch (e) {
        console.error('Error parsing tags:', e);
        tagsArray = [];
      }
    }
    
    // Convert stock and price to numbers
    price = parseFloat(price);
    stock = parseInt(stock);
    discount = parseFloat(discount || 0);
    
    // Log after conversion for debugging
    console.log('DEBUG - After conversion:', { name, description, price, stock, category, discount });
    
    // Validation with detailed error messages
    const errors = [];
    if (!name || name.trim() === '') errors.push('Tên sản phẩm');
    if (!description || description.trim() === '') errors.push('Mô tả sản phẩm');
    if (!price || isNaN(price)) errors.push('Giá sản phẩm (phải là số)');
    if (!category || category.trim() === '') errors.push('Danh mục');
    if (!stock || isNaN(stock)) errors.push('Tồn kho (phải là số)');
    
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      return res.status(400).json({ 
        success: false, 
        message: 'Thông tin sản phẩm không đầy đủ. Thiếu: ' + errors.join(', ') 
      });
    }

    // Process images from multer
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(f => ({ 
        url: f.path || f.filename, 
        public_id: f.filename 
      }));
    }

    const product = new Product({
      name,
      description,
      price,
      discount,
      category,
      petTypes,
      stock,
      sku: sku || `SKU-${Date.now()}`,
      tags: tagsArray,
      seller: req.user._id,
      images,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
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

    // Parse FormData fields
    let { name, description, price, discount, category, stock, sku, tags } = req.body;
    let petTypes = req.body.petTypes;
    
    // Handle FormData array notation
    if (petTypes) {
      if (!Array.isArray(petTypes)) {
        petTypes = [petTypes];
      }
    }
    
    // Parse tags if it's a JSON string
    let tagsArray = tags;
    if (tags && typeof tags === 'string') {
      try {
        if (tags.startsWith('[')) {
          tagsArray = JSON.parse(tags);
        } else {
          tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
        }
      } catch (e) {
        tagsArray = [];
      }
    }
    
    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (discount !== undefined) updateData.discount = parseFloat(discount);
    if (category) updateData.category = category;
    if (stock) updateData.stock = parseInt(stock);
    if (sku) updateData.sku = sku;
    if (tagsArray) updateData.tags = tagsArray;
    if (petTypes) updateData.petTypes = petTypes;
    
    // Handle new images from multer
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => ({ 
        url: f.path || f.filename, 
        public_id: f.filename 
      }));
      updateData.images = newImages;
    }

    Object.assign(product, updateData);
    await product.save();

    res.json({ success: true, message: 'Cập nhật sản phẩm thành công', data: product });
  } catch (error) {
    console.error('Error updating product:', error);
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
