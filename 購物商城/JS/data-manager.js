// data-manager.js - 完整更新版
// 统一数据管理
class DataManager {
    static STORAGE_KEY = 'toyshop_products';
    static CATEGORY_KEY = 'toyshop_categories';
    static PRODUCT_IMAGES_KEY = 'toyshop_product_images';

    // 获取所有商品
    static getProducts() {
        const savedProducts = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
        if (savedProducts && savedProducts.length > 0) {
            return savedProducts;
        }
        // 如果没有保存的数据，返回示例数据
        return this.getDefaultProducts();
    }

    // 保存所有商品
    static saveProducts(products) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    }

    // 获取所有分类
    static getCategories() {
        const savedCategories = JSON.parse(localStorage.getItem(this.CATEGORY_KEY));
        if (savedCategories && savedCategories.length > 0) {
            return savedCategories;
        }
        return this.getDefaultCategories();
    }

    // 保存分类
    static saveCategories(categories) {
        localStorage.setItem(this.CATEGORY_KEY, JSON.stringify(categories));
    }

    // 保存商品多张图片
    static saveProductImages(productId, imagesData) {
        const images = JSON.parse(localStorage.getItem(this.PRODUCT_IMAGES_KEY)) || {};
        images[productId] = imagesData;
        localStorage.setItem(this.PRODUCT_IMAGES_KEY, JSON.stringify(images));
    }

    // 获取商品所有图片
    static getProductImages(productId) {
        const images = JSON.parse(localStorage.getItem(this.PRODUCT_IMAGES_KEY)) || {};
        return images[productId] || [];
    }

    // 获取商品主图（第一张）
    static getProductMainImage(productId) {
        const images = this.getProductImages(productId);
        return images.length > 0 ? images[0] : null;
    }

    // 添加单张图片到商品
    static addProductImage(productId, imageData) {
        const images = this.getProductImages(productId);
        images.push(imageData);
        this.saveProductImages(productId, images);
        return images;
    }

    // 删除商品特定图片
    static deleteProductImageByIndex(productId, index) {
        const images = this.getProductImages(productId);
        if (index >= 0 && index < images.length) {
            images.splice(index, 1);
            this.saveProductImages(productId, images);
        }
        return images;
    }

    // 删除商品所有图片
    static deleteProductImages(productId) {
        const images = JSON.parse(localStorage.getItem(this.PRODUCT_IMAGES_KEY)) || {};
        delete images[productId];
        localStorage.setItem(this.PRODUCT_IMAGES_KEY, JSON.stringify(images));
    }

    // 默认商品数据
    static getDefaultProducts() {
    return [
        {
            id: 1,
            sku: "TOY001",
            name: "智能編程機器人",
            price: 299,
            category: "educational",
            description: "培養孩子編程思維的智能機器人，支持圖形化編程界面",
            stock: 15,
            status: "active",
            sales: 42
        },
        {
            id: 2,
            sku: "TOY002",
            name: "創意積木套裝",
            price: 199,
            category: "creative",
            description: "200片多彩積木，激發孩子創造力和空間想象力",
            stock: 25,
            status: "active",
            sales: 35
        },
        {
            id: 3,
            sku: "TOY003",
            name: "遙控越野賽車",
            price: 399,
            category: "outdoor",
            description: "四輪驅動遙控賽車，適合戶外玩耍，續航時間2小時",
            stock: 8,
            status: "active",
            sales: 28
        },
        {
            id: 4,
            sku: "TOY004",
            name: "電子繪圖板",
            price: 259,
            category: "electronic",
            description: "兒童專用電子繪圖板，可保存和分享作品",
            stock: 12,
            status: "active",
            sales: 22
        }
    ];
}

    // 默认分类数据
    static getDefaultCategories() {
        return [
            {
                id: "educational",
                name: "教育玩具",
                icon: "robot",
                status: "active"
            },
            {
                id: "creative",
                name: "創意玩具",
                icon: "cubes",
                status: "active"
            },
            {
                id: "outdoor",
                name: "戶外玩具",
                icon: "car",
                status: "active"
            },
            {
                id: "electronic",
                name: "電子玩具",
                icon: "gamepad",
                status: "active"
            }
        ];
    }

    // 获取上架的商品（客户端用）
    static getActiveProducts() {
        const products = this.getProducts();
        return products.filter(product => product.status === 'active');
    }

    // 根据ID获取商品
    static getProductById(id) {
        const products = this.getProducts();
        return products.find(product => product.id === id);
    }

    // 在 DataManager 类中添加
    static getProductSpecs(productId) {
    const product = this.getProductById(productId);
    return product.specs || {};
    }

    static getProductFeatures(productId) {
    const product = this.getProductById(productId);
    return product.features || [];
    }

    // 添加新商品
    static addProduct(productData) {
        const products = this.getProducts();
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        const newProduct = {
            ...productData,
            id: newId,
            sales: 0
        };
        products.push(newProduct);
        this.saveProducts(products);
        return newProduct;
    }

    // 更新商品
    static updateProduct(productId, productData) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            this.saveProducts(products);
            return true;
        }
        return false;
    }

    // 下架商品
    static deactivateProduct(productId) {
        return this.updateProduct(productId, { status: 'inactive' });
    }

    // 上架商品
    static activateProduct(productId) {
        return this.updateProduct(productId, { status: 'active' });
    }

    // 删除商品
    static deleteProduct(productId) {
        const products = this.getProducts();
        const filteredProducts = products.filter(p => p.id !== productId);
        this.saveProducts(filteredProducts);
        // 同时删除商品图片
        this.deleteProductImages(productId);
        return true;
    }
}