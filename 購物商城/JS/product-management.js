// product-management.js - 完整版本
let products = [];
let categories = [];

$(document).ready(function () {
    // 初始化主題
    ThemeManager.init();
    
    // 載入數據
    loadData();
    
    // 更新員工顯示
    updateStaffDisplay();
    
    // 事件監聽
    $('#product-search').on('input', filterProducts);
    $('#category-filter').on('change', filterProducts);
    $('#status-filter').on('change', filterProducts);
    $('#stock-filter').on('change', filterProducts);
});

// 載入數據
// 修復後的 loadData 函數
function loadData() {
    try {
        console.log('開始載入數據...');
        
        // 確保 DataManager 存在
        if (typeof DataManager === 'undefined') {
            console.error('DataManager 未定義');
            showNotification('系統錯誤: DataManager 未加載', 'error');
            return;
        }
        
        products = DataManager.getProducts();
        categories = DataManager.getCategories();
        
        console.log('載入的商品:', products);
        console.log('載入的分類:', categories);
        
        loadProducts();
        loadCategories();
        updateQuickStats();
        populateCategoryFilters();
        
    } catch (error) {
        console.error('載入數據失敗:', error);
        showNotification('載入數據失敗: ' + error.message, 'error');
    }
}

// 修復後的 saveProduct 函數
async function saveProduct() {
    console.log('開始保存商品...');
    
    // 獲取表單數據
    const formData = {
        name: $('#product-name').val().trim(),
        category: $('#product-category').val(),
        price: parseFloat($('#product-price').val()),
        stock: parseInt($('#product-stock').val()),
        sku: $('#product-sku').val().trim(),
        status: $('#product-status').val(),
        description: $('#product-description').val().trim()
    };

    const imageFile = document.getElementById('product-image').files[0];
    const editingProductId = $('#product-form').data('editing-id');

    console.log('表單數據:', formData);
    console.log('編輯商品ID:', editingProductId);

    // 加強表單驗證
    const errors = [];
    
    if (!formData.name) errors.push('商品名稱');
    if (!formData.category) errors.push('商品分類');
    if (isNaN(formData.price) || formData.price <= 0) errors.push('有效價格');
    if (isNaN(formData.stock) || formData.stock < 0) errors.push('有效庫存數量');
    if (!formData.sku) errors.push('商品編號');

    if (errors.length > 0) {
        showNotification(`請填寫以下必填字段: ${errors.join(', ')}`, 'error');
        return;
    }

    try {
        let productId;
        let result;
        
        if (editingProductId) {
            // 編輯現有商品
            console.log('編輯商品:', editingProductId);
            result = DataManager.updateProduct(editingProductId, formData);
            if (!result) {
                throw new Error('更新商品失敗');
            }
            productId = editingProductId;
        } else {
            // 新增商品
            console.log('新增商品');
            const newProduct = DataManager.addProduct(formData);
            if (!newProduct) {
                throw new Error('新增商品失敗');
            }
            productId = newProduct.id;
            console.log('新商品ID:', productId);
        }

        // 保存圖片
        if (imageFile) {
            console.log('保存圖片');
            await saveProductImage(productId, imageFile);
        }

        closeProductModal();
        loadData(); // 重新載入所有數據
        showNotification('商品保存成功！', 'success');
        
    } catch (error) {
        console.error('保存商品失敗:', error);
        showNotification(`保存失敗: ${error.message}`, 'error');
    }
}

// 修復生成SKU函數
function generateSKU() {
    const skuPrefix = 'TOY';
    const existingSKUs = products.map(p => p.sku);
    let newSKU;
    let counter = 1;
    
    do {
        newSKU = `${skuPrefix}${counter.toString().padStart(3, '0')}`;
        counter++;
    } while (existingSKUs.includes(newSKU));
    
    $('#product-sku').val(newSKU);
    console.log('生成的SKU:', newSKU);
}

// 更新員工顯示
function updateStaffDisplay() {
    const $navLinks = $("#nav-links");
    $navLinks.html(`
        <a href="staff-profile.html" class="active"><i class="fas fa-user-cog"></i> 員工中心</a>
        <button class="logout-btn" onclick="logout()">
            <i class="fas fa-sign-out-alt"></i> 登出
        </button>
    `);
}

// 載入商品列表
function loadProducts(filteredProducts = products) {
    const $tableBody = $('#products-table');
    $tableBody.empty();

    filteredProducts.forEach(product => {
        // 獲取商品圖片
        const productImages = DataManager.getProductImages(product.id);
        const hasCustomImage = productImages.length > 0;
        
        const statusBadge = product.status === 'active' 
            ? '<span class="status-badge status-active">已上架</span>'
            : '<span class="status-badge status-inactive">已下架</span>';

        const stockBadge = product.stock === 0 
            ? '<span class="status-badge status-out-of-stock">缺貨</span>'
            : product.stock < 10 
            ? '<span class="status-badge status-low-stock">低庫存</span>'
            : '';

        const row = `
            <tr>
                <td>${product.sku}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="product-image-small" style="width: 40px; height: 40px; border-radius: 6px; background: var(--theme-gradient); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
                            ${hasCustomImage 
                                ? '<i class="fas fa-image"></i>' 
                                : `<i class="${getCategoryIcon(product.category)}"></i>`
                            }
                        </div>
                        <div>
                            <div class="product-name">${product.name}</div>
                            <div class="product-description-small" style="font-size: 0.8rem; color: #718096; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${product.description}
                            </div>
                        </div>
                    </div>
                </td>
                <td>${getCategoryName(product.category)}</td>
                <td>$${product.price}</td>
                <td>
                    <div>${product.stock}</div>
                    ${stockBadge}
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit" onclick="editProduct(${product.id})">
                            <i class="fas fa-edit"></i> 編輯
                        </button>
                        ${product.status === 'active' 
                            ? `<button class="action-btn delete" onclick="toggleProductStatus(${product.id}, 'inactive')">
                                  <i class="fas fa-eye-slash"></i> 下架
                               </button>`
                            : `<button class="action-btn toggle" onclick="toggleProductStatus(${product.id}, 'active')">
                                  <i class="fas fa-eye"></i> 上架
                               </button>`
                        }
                    </div>
                </td>
            </tr>
        `;
        $tableBody.append(row);
    });

    $('#product-count').text(`共 ${filteredProducts.length} 件商品`);
}

// 載入分類列表
function loadCategories() {
    const $tableBody = $('#categories-table');
    $tableBody.empty();

    categories.forEach(category => {
        const productCount = products.filter(p => p.category === category.id).length;
        const statusBadge = category.status === 'active' 
            ? '<span class="status-badge status-active">啟用</span>'
            : '<span class="status-badge status-inactive">停用</span>';

        const row = `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="category-icon-small" style="width: 40px; height: 40px; border-radius: 6px; background: var(--theme-gradient); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
                            <i class="${getCategoryIcon(category.id)}"></i>
                        </div>
                        <div>
                            <div class="category-name">${category.name}</div>
                            <div class="category-id" style="font-size: 0.8rem; color: #718096;">ID: ${category.id}</div>
                        </div>
                    </div>
                </td>
                <td>${productCount}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit" onclick="editCategory('${category.id}')">
                            <i class="fas fa-edit"></i> 編輯
                        </button>
                        <button class="action-btn delete" onclick="deleteCategory('${category.id}')">
                            <i class="fas fa-trash"></i> 刪除
                        </button>
                    </div>
                </td>
            </tr>
        `;
        $tableBody.append(row);
    });
}

// 篩選商品
function filterProducts() {
    const searchTerm = $('#product-search').val().toLowerCase();
    const categoryFilter = $('#category-filter').val();
    const statusFilter = $('#status-filter').val();
    const stockFilter = $('#stock-filter').val();

    const filtered = products.filter(product => {
        // 搜尋篩選
        if (searchTerm && 
            !product.name.toLowerCase().includes(searchTerm) && 
            !product.sku.toLowerCase().includes(searchTerm) &&
            !product.description.toLowerCase().includes(searchTerm)) {
            return false;
        }

        // 分類篩選
        if (categoryFilter && product.category !== categoryFilter) {
            return false;
        }

        // 狀態篩選
        if (statusFilter && product.status !== statusFilter) {
            return false;
        }

        // 庫存篩選
        if (stockFilter) {
            if (stockFilter === 'low' && product.stock >= 10) return false;
            if (stockFilter === 'out' && product.stock > 0) return false;
            if (stockFilter === 'normal' && (product.stock < 10 || product.stock === 0)) return false;
        }

        return true;
    });

    loadProducts(filtered);
}

// 填充分類篩選器
function populateCategoryFilters() {
    const $categoryFilter = $('#category-filter');
    const $productCategory = $('#product-category');
    
    // 清空選項（保留第一個選項）
    $categoryFilter.find('option:not(:first)').remove();
    $productCategory.find('option:not(:first)').remove();

    // 添加活躍的分類
    categories.filter(cat => cat.status === 'active').forEach(category => {
        $categoryFilter.append(`<option value="${category.id}">${category.name}</option>`);
        $productCategory.append(`<option value="${category.id}">${category.name}</option>`);
    });
}

// 更新快速統計
function updateQuickStats() {
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    $('#total-products').text(totalProducts);
    $('#low-stock-count').text(lowStockCount);
}

// 獲取分類對應的圖標
function getCategoryIcon(category) {
    const iconMap = {
        educational: 'fas fa-robot',
        creative: 'fas fa-cubes',
        outdoor: 'fas fa-car',
        electronic: 'fas fa-gamepad'
    };
    return iconMap[category] || 'fas fa-gift';
}

// 獲取分類名稱
function getCategoryName(category) {
    const names = {
        educational: "教育玩具",
        outdoor: "戶外玩具", 
        creative: "創意玩具",
        electronic: "電子玩具"
    };
    return names[category] || category;
}

// 圖片預覽功能
function previewImage(input) {
    const preview = document.getElementById('image-preview');
    const previewImg = preview.querySelector('.preview-image');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

// 保存圖片到 DataManager
function saveProductImage(productId, imageFile) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = {
                data: e.target.result,
                name: imageFile.name,
                type: imageFile.type,
                uploadedAt: new Date().toISOString()
            };
            DataManager.addProductImage(productId, imageData);
            resolve(imageData);
        };
        reader.readAsDataURL(imageFile);
    });
}

// 打開商品模態框
function openProductModal() {
    $('#product-modal').show();
}

// 關閉商品模態框
function closeProductModal() {
    $('#product-modal').hide();
    resetProductForm();
}

// 重置商品表單
function resetProductForm() {
    $('#product-form')[0].reset();
    $('#product-form').removeData('editing-id');
    $('#image-preview').hide();
    $('#product-modal-title').text('新增商品');
    
    // 重新生成SKU
    generateSKU();
}

// 生成SKU
function generateSKU() {
    const skuPrefix = 'TOY';
    const existingSKUs = products.map(p => p.sku);
    let newSKU;
    let counter = products.length + 1;
    
    do {
        newSKU = `${skuPrefix}${counter.toString().padStart(3, '0')}`;
        counter++;
    } while (existingSKUs.includes(newSKU));
    
    $('#product-sku').val(newSKU);
}

// 保存商品
async function saveProduct() {
    const formData = {
        name: $('#product-name').val(),
        category: $('#product-category').val(),
        price: parseFloat($('#product-price').val()),
        stock: parseInt($('#product-stock').val()),
        sku: $('#product-sku').val(),
        status: $('#product-status').val(),
        description: $('#product-description').val(),
        image: $('#product-category').val() // 使用分類作為預設圖片標識
    };

    const imageFile = document.getElementById('product-image').files[0];
    const editingProductId = $('#product-form').data('editing-id');

    // 驗證表單
    if (!formData.name || !formData.category || !formData.price || !formData.stock || !formData.sku) {
        showNotification('請填寫所有必填字段', 'error');
        return;
    }

    try {
        let productId;
        
        if (editingProductId) {
            // 編輯現有商品
            DataManager.updateProduct(editingProductId, formData);
            productId = editingProductId;
        } else {
            // 新增商品
            const newProduct = DataManager.addProduct(formData);
            productId = newProduct.id;
        }

        // 保存圖片
        if (imageFile) {
            await saveProductImage(productId, imageFile);
        }

        closeProductModal();
        loadData(); // 重新載入所有數據
        showNotification('商品保存成功！', 'success');
        
    } catch (error) {
        console.error('保存商品失敗:', error);
        showNotification('保存失敗，請重試', 'error');
    }
}

// 編輯商品
function editProduct(productId) {
    const product = DataManager.getProductById(productId);
    if (!product) return;

    // 填充表單數據
    $('#product-name').val(product.name);
    $('#product-category').val(product.category);
    $('#product-price').val(product.price);
    $('#product-stock').val(product.stock);
    $('#product-sku').val(product.sku);
    $('#product-status').val(product.status);
    $('#product-description').val(product.description);

    // 載入商品圖片
    const productImages = DataManager.getProductImages(productId);
    const preview = document.getElementById('image-preview');
    const previewImg = preview.querySelector('.preview-image');
    
    if (productImages.length > 0) {
        previewImg.src = productImages[0].data;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }

    // 設置編輯模式
    $('#product-form').data('editing-id', productId);
    $('#product-modal-title').text('編輯商品');
    
    openProductModal();
}

// 切換商品狀態
function toggleProductStatus(productId, newStatus) {
    const product = DataManager.getProductById(productId);
    if (!product) return;

    const action = newStatus === 'active' ? '上架' : '下架';
    
    showConfirmModal(
        `確認${action}`,
        `您確定要${action}商品 "${product.name}" 嗎？`,
        function() {
            if (newStatus === 'active') {
                DataManager.activateProduct(productId);
            } else {
                DataManager.deactivateProduct(productId);
            }
            loadData();
            showNotification(`商品已${action}`, 'success');
        }
    );
}

// 打開分類模態框
function openCategoryModal() {
    $('#category-modal').show();
}

// 關閉分類模態框
function closeCategoryModal() {
    $('#category-modal').hide();
    resetCategoryForm();
}

// 重置分類表單
function resetCategoryForm() {
    $('#category-form')[0].reset();
    $('#category-form').removeData('editing-id');
    $('#category-modal-title').text('新增分類');
}

// 保存分類
function saveCategory() {
    const formData = {
        name: $('#category-name').val(),
        icon: $('#category-icon').val(),
        status: $('#category-status').val()
    };

    const editingCategoryId = $('#category-form').data('editing-id');

    // 生成分類ID（基於名稱的拼音或英文）
    const categoryId = formData.name.toLowerCase().replace(/\s+/g, '-');

    // 驗證表單
    if (!formData.name) {
        showNotification('請填寫分類名稱', 'error');
        return;
    }

    try {
        if (editingCategoryId) {
            // 編輯現有分類
            const existingCategory = categories.find(cat => cat.id === editingCategoryId);
            if (existingCategory) {
                existingCategory.name = formData.name;
                existingCategory.icon = formData.icon;
                existingCategory.status = formData.status;
            }
        } else {
            // 新增分類
            // 檢查是否已存在相同ID的分類
            if (categories.find(cat => cat.id === categoryId)) {
                showNotification('分類名稱已存在', 'error');
                return;
            }

            categories.push({
                id: categoryId,
                name: formData.name,
                icon: formData.icon,
                status: formData.status
            });
        }

        DataManager.saveCategories(categories);
        closeCategoryModal();
        loadData();
        showNotification('分類保存成功！', 'success');
        
    } catch (error) {
        console.error('保存分類失敗:', error);
        showNotification('保存失敗，請重試', 'error');
    }
}

// 編輯分類
function editCategory(categoryId) {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    // 填充表單數據
    $('#category-name').val(category.name);
    $('#category-icon').val(category.icon);
    $('#category-status').val(category.status);

    // 設置編輯模式
    $('#category-form').data('editing-id', categoryId);
    $('#category-modal-title').text('編輯分類');
    
    openCategoryModal();
}

// 刪除分類
function deleteCategory(categoryId) {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    // 檢查是否有商品使用此分類
    const productsUsingCategory = products.filter(p => p.category === categoryId);
    if (productsUsingCategory.length > 0) {
        showNotification(`無法刪除分類，有 ${productsUsingCategory.length} 個商品正在使用此分類`, 'error');
        return;
    }

    showConfirmModal(
        '確認刪除',
        `您確定要刪除分類 "${category.name}" 嗎？此操作無法復原。`,
        function() {
            categories = categories.filter(cat => cat.id !== categoryId);
            DataManager.saveCategories(categories);
            loadData();
            showNotification('分類已刪除', 'success');
        }
    );
}

// 顯示確認模態框
function showConfirmModal(title, message, confirmCallback) {
    $('#confirm-title').text(title);
    $('#confirm-message').text(message);
    $('#confirm-action-btn').off('click').on('click', function() {
        confirmCallback();
        closeConfirmModal();
    });
    $('#confirm-modal').show();
}

// 關閉確認模態框
function closeConfirmModal() {
    $('#confirm-modal').hide();
}

// 顯示通知
function showNotification(message, type = 'success') {
    // 簡單的通知實現 - 可以替換為更漂亮的UI
    alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
}

// 重新整理數據
function refreshData() {
    loadData();
    showNotification('數據已更新', 'success');
}

// 登出
function logout() {
    ThemeManager.logout();
    window.location.href = 'login.html';
}

// 模態框點擊外部關閉
$(document).on('click', function(e) {
    if ($(e.target).hasClass('modal')) {
        $(e.target).hide();
    }
});

// 阻止模態框內容點擊關閉
$(document).on('click', '.modal-content', function(e) {
    e.stopPropagation();
});