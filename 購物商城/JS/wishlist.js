// 圖標映射
const iconMap = {
    robot: "fas fa-robot",
    blocks: "fas fa-cubes",
    car: "fas fa-car",
    drawing: "fas fa-palette",
    adventure: "fas fa-binoculars",
    science: "fas fa-flask",
};

// 全局變量
let selectedItems = [];

$(document).ready(function () {
    // 初始化主題
    const currentTheme = ThemeManager.init();
    
    // 更新界面顯示
    updateHeaderDisplay();
    
    // 檢查登入狀態
    if (ThemeManager.isLoggedIn()) {
        loadWishlist();
    } else {
        showLoginPrompt();
    }
    
    // 事件監聽
    $("#clear-all").on("click", clearAllWishlist);
    $("#select-all").on("click", toggleSelectAll);
    $("#batch-buy").on("click", batchBuySelected);
});

// 更新頭部顯示
function updateHeaderDisplay() {
    const $navLinks = $("#nav-links");
    const $loginPrompt = $("#login-prompt");
    const $wishlistContent = $("#wishlist-content");

    if (ThemeManager.isLoggedIn()) {
        // 已登入，顯示完整導航
        $navLinks.html(`
            <a href="index.html"><i class="fas fa-store"></i> 玩具瀏覽</a>
            <a href="wishlist.html" class="active"><i class="fas fa-heart"></i> 願望清單</a>
            <a href="checkout.html"><i class="fas fa-shopping-cart"></i> 結帳</a>
            <a href="order-tracking.html"><i class="fas fa-clipboard-list"></i> 我的訂單</a>
            <a href="customer-profile.html"><i class="fas fa-user"></i> 個人資料</a>
            <a href="custom-toy-design.html"><i class="fas fa-cog"></i> 自訂玩具設計</a>
            <button class="logout-btn" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> 登出
                </button>
        `);
        $loginPrompt.hide();
        $wishlistContent.show();
    } 
}

// 顯示登入提示
function showLoginPrompt() {
    $("#login-prompt").show();
    $("#wishlist-content").hide();
}

// 加載願望清單
function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const $wishlistItems = $("#wishlist-items");
    const $emptyWishlist = $("#empty-wishlist");
    const $recommendations = $("#recommendations");
    
    // 重置選擇狀態
    selectedItems = [];
    updateBatchActions();
    
    // 更新數量顯示
    $("#wishlist-count").text(`共 ${wishlist.length} 件商品`);
    
    if (wishlist.length === 0) {
        $wishlistItems.hide();
        $emptyWishlist.show();
        $recommendations.hide();
        return;
    }
    
    $wishlistItems.show();
    $emptyWishlist.hide();
    $wishlistItems.empty();
    
    // 顯示推薦商品
    loadRecommendations();
    $recommendations.show();
    
    // 加載願望清單商品
    wishlist.forEach((item, index) => {
        const wishlistItem = createWishlistItem(item, index);
        $wishlistItems.append(wishlistItem);
    });
}

// 創建願望清單商品元素
function createWishlistItem(item, index) {
    const stockStatus = getStockStatus(item.stock);
    const stockClass = getStockClass(item.stock);
    const isSelectable = item.stock > 0; // 只有有庫存的商品可以選擇
    
    return `
        <div class="wishlist-item" data-id="${item.id}" data-index="${index}">
            <!-- 選擇框 -->
            <div class="select-checkbox">
                <input type="checkbox" id="select-${index}" 
                       onchange="toggleSelectItem(${index}, this.checked)"
                       ${isSelectable ? '' : 'disabled'}>
            </div>
            
            <button class="remove-btn" onclick="removeFromWishlist(${index})" title="移除商品">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="item-image">
                <i class="${iconMap[item.image] || "fas fa-gift"}"></i>
            </div>
            
            <div class="item-details">
                <h3 class="item-name">
                    <a href="toy-detail.html?id=${item.id}">${item.name}</a>
                </h3>
                <span class="item-category">${getCategoryName(item.category)}</span>
                <p class="item-description">${item.description}</p>
                
                <div class="item-price">$${item.price}</div>
                
                <div class="item-stock ${stockClass}">
                    <i class="fas fa-box"></i>
                    <span>${stockStatus}</span>
                    ${!isSelectable ? '<span style="margin-left: 0.5rem; color: #e53e3e;">(無法購買)</span>' : ''}
                </div>
                
                <div class="item-actions">
                    <button class="action-btn view-detail-btn" onclick="viewToyDetail(${item.id})">
                        <i class="fas fa-eye"></i> 查看詳情
                    </button>
                    <button class="action-btn buy-now-btn" onclick="buyNow(${item.id})" ${!isSelectable ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> ${!isSelectable ? '暫時缺貨' : '立即購買'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 切換選擇商品
function toggleSelectItem(index, isSelected) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const item = wishlist[index];
    
    if (isSelected) {
        // 添加到選中列表
        if (!selectedItems.includes(index)) {
            selectedItems.push(index);
            $(`.wishlist-item[data-index="${index}"]`).addClass('selected');
        }
    } else {
        // 從選中列表移除
        selectedItems = selectedItems.filter(i => i !== index);
        $(`.wishlist-item[data-index="${index}"]`).removeClass('selected');
    }
    
    updateBatchActions();
}

// 全選/取消全選
function toggleSelectAll() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const $batchActions = $("#batch-actions");
    const $selectAll = $("#select-all");
    
    if (selectedItems.length === wishlist.length) {
        // 取消全選
        selectedItems = [];
        $('.wishlist-item').removeClass('selected');
        $('.select-checkbox input[type="checkbox"]').prop('checked', false);
        $selectAll.html('<i class="fas fa-check-double"></i> 全選');
    } else {
        // 全選
        selectedItems = [];
        wishlist.forEach((item, index) => {
            if (item.stock > 0) { // 只選擇有庫存的商品
                selectedItems.push(index);
                $(`.wishlist-item[data-index="${index}"]`).addClass('selected');
                $(`#select-${index}`).prop('checked', true);
            }
        });
        $selectAll.html('<i class="fas fa-times"></i> 取消全選');
    }
    
    updateBatchActions();
}

// 更新批量操作欄
function updateBatchActions() {
    const $batchActions = $("#batch-actions");
    const $selectedCount = $("#selected-count");
    const $batchBuy = $("#batch-buy");
    const $selectAll = $("#select-all");
    
    if (selectedItems.length > 0) {
        $batchActions.show();
        $selectedCount.text(`已選擇 ${selectedItems.length} 件商品`);
        $batchBuy.prop('disabled', false);
        
        // 更新全選按鈕文字
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const availableItems = wishlist.filter(item => item.stock > 0).length;
        
        if (selectedItems.length === availableItems && availableItems > 0) {
            $selectAll.html('<i class="fas fa-times"></i> 取消全選');
        } else {
            $selectAll.html('<i class="fas fa-check-double"></i> 全選');
        }
    } else {
        $batchActions.hide();
        $batchBuy.prop('disabled', true);
        $selectAll.html('<i class="fas fa-check-double"></i> 全選');
    }
}

// 批量購買選中商品
function batchBuySelected() {
    if (selectedItems.length === 0) {
        showNotification("請先選擇要購買的商品", "warning");
        return;
    }
    
    if (!ThemeManager.isLoggedIn()) {
        showNotification("請先登入以進行購買", "warning");
        return;
    }
    
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const selectedProducts = selectedItems.map(index => wishlist[index]);
    
    // 計算總價
    const totalPrice = selectedProducts.reduce((sum, product) => sum + product.price, 0);
    
    // 顯示確認對話框
    const productList = selectedProducts.map(product => `• ${product.name} - $${product.price}`).join('\n');
    
    if (confirm(`確定要購買以下商品嗎？\n\n${productList}\n\n總計: $${totalPrice}`)) {
        // 這裡可以實現跳轉到結帳頁面的邏輯
        // 可以將選中的商品ID傳遞給結帳頁面
        const selectedIds = selectedProducts.map(product => product.id);
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
        
        showNotification(`已選擇 ${selectedItems.length} 件商品，即將跳轉到結帳頁面`, "success");
        
        // 模擬跳轉到結帳頁面
        // window.location.href = `checkout.html?items=${selectedIds.join(',')}`;
        
        // 清空選擇狀態
        selectedItems = [];
        updateBatchActions();
        $('.wishlist-item').removeClass('selected');
        $('.select-checkbox input[type="checkbox"]').prop('checked', false);
    }
}

// 從願望清單移除商品
function removeFromWishlist(index) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    if (index >= 0 && index < wishlist.length) {
        const removedItem = wishlist[index];
        
        // 從選中列表中移除
        selectedItems = selectedItems.filter(i => i !== index);
        // 更新大於當前索引的選中項目的索引
        selectedItems = selectedItems.map(i => i > index ? i - 1 : i);
        
        wishlist.splice(index, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        
        showNotification(`"${removedItem.name}" 已從願望清單移除`);
        loadWishlist(); // 重新加載清單
    }
}

// 清空願望清單
function clearAllWishlist() {
    if (confirm("確定要清空整個願望清單嗎？此操作無法復原。")) {
        localStorage.removeItem("wishlist");
        selectedItems = [];
        updateBatchActions();
        showNotification("願望清單已清空");
        loadWishlist(); // 重新加載清單
    }
}

// 加載推薦商品
function loadRecommendations() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const allToys = [
        {
            id: 1,
            name: "智能編程機器人",
            price: 299,
            category: "educational",
            description: "培養孩子編程思維的智能機器人",
            image: "robot",
            stock: 15,
        },
        {
            id: 2,
            name: "創意積木套裝",
            price: 199,
            category: "creative",
            description: "200片多彩積木，激發創造力",
            image: "blocks",
            stock: 25,
        },
        {
            id: 3,
            name: "遙控越野賽車",
            price: 399,
            category: "outdoor",
            description: "四輪驅動遙控賽車，適合戶外",
            image: "car",
            stock: 8,
        },
        {
            id: 4,
            name: "電子繪圖板",
            price: 259,
            category: "electronic",
            description: "兒童專用電子繪圖板",
            image: "drawing",
            stock: 12,
        },
        {
            id: 5,
            name: "戶外探險套裝",
            price: 189,
            category: "outdoor",
            description: "包含望遠鏡、指南針等工具",
            image: "adventure",
            stock: 18,
        },
        {
            id: 6,
            name: "科學實驗套裝",
            price: 349,
            category: "educational",
            description: "30個有趣的科學實驗",
            image: "science",
            stock: 10,
        }
    ];
    
    // 過濾掉已在願望清單中的商品
    const wishlistIds = wishlist.map(item => item.id);
    const recommendations = allToys
        .filter(toy => !wishlistIds.includes(toy.id))
        .slice(0, 4);
    
    const $recommendationGrid = $("#recommendation-grid");
    $recommendationGrid.empty();
    
    if (recommendations.length === 0) {
        $recommendationGrid.html('<p style="text-align: center; color: #718096; grid-column: 1 / -1;">暫無推薦商品</p>');
        return;
    }
    
    recommendations.forEach(toy => {
        const recommendationCard = `
            <div class="recommendation-card">
                <div class="recommendation-image">
                    <i class="${iconMap[toy.image] || "fas fa-gift"}"></i>
                </div>
                <h4 class="recommendation-name">${toy.name}</h4>
                <div class="recommendation-price">$${toy.price}</div>
                <div class="recommendation-actions">
                    <button class="recommendation-btn add-wishlist-btn" onclick="addToWishlist(${toy.id})">
                        <i class="fas fa-heart"></i> 加入
                    </button>
                    <button class="recommendation-btn view-btn" onclick="viewToyDetail(${toy.id})">
                        <i class="fas fa-eye"></i> 查看
                    </button>
                </div>
            </div>
        `;
        $recommendationGrid.append(recommendationCard);
    });
}

// 加入願望清單
function addToWishlist(toyId) {
    if (!ThemeManager.isLoggedIn()) {
        showNotification("請先登入以使用願望清單功能", "warning");
        return;
    }
    
    const allToys = [
        { id: 1, name: "智能編程機器人", price: 299, category: "educational", description: "培養孩子編程思維的智能機器人", image: "robot", stock: 15 },
        { id: 2, name: "創意積木套裝", price: 199, category: "creative", description: "200片多彩積木，激發創造力", image: "blocks", stock: 25 },
        { id: 3, name: "遙控越野賽車", price: 399, category: "outdoor", description: "四輪驅動遙控賽車，適合戶外", image: "car", stock: 8 },
        { id: 4, name: "電子繪圖板", price: 259, category: "electronic", description: "兒童專用電子繪圖板", image: "drawing", stock: 12 },
        { id: 5, name: "戶外探險套裝", price: 189, category: "outdoor", description: "包含望遠鏡、指南針等工具", image: "adventure", stock: 18 },
        { id: 6, name: "科學實驗套裝", price: 349, category: "educational", description: "30個有趣的科學實驗", image: "science", stock: 10 }
    ];
    
    const toy = allToys.find(t => t.id === toyId);
    if (!toy) return;
    
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    if (!wishlist.find(item => item.id === toyId)) {
        wishlist.push({
            ...toy,
            quantity: 1,
            addedAt: new Date().toISOString(),
        });
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        
        showNotification(`"${toy.name}" 已加入願望清單！`);
        loadWishlist(); // 重新加載清單
    } else {
        showNotification(`"${toy.name}" 已在願望清單中！`, "warning");
    }
}

// 查看商品詳情
function viewToyDetail(toyId) {
    window.location.href = `toy-detail.html?id=${toyId}`;
}

// 立即購買
function buyNow(toyId) {
    if (!ThemeManager.isLoggedIn()) {
        showNotification("請先登入以進行購買", "warning");
        return;
    }
    
    // 這裡可以實現跳轉到結帳頁面的邏輯
    showNotification("即將跳轉到結帳頁面", "info");
    // window.location.href = `checkout.html?toyId=${toyId}`;
}

// 輔助函數
function getCategoryName(category) {
    const names = {
        educational: "教育玩具",
        outdoor: "戶外玩具",
        creative: "創意玩具",
        electronic: "電子玩具",
    };
    return names[category] || category;
}

function getStockStatus(stock) {
    if (stock > 10) return "有現貨";
    if (stock > 0) return "庫存緊張";
    return "暫時缺貨";
}

function getStockClass(stock) {
    if (stock > 10) return "stock-available";
    if (stock > 0) return "stock-low";
    return "stock-out";
}

// 顯示通知
function showNotification(message, type = "success") {
    const bgColor = type === "success" ? "#38a169" : 
                   type === "warning" ? "#d69e2e" : 
                   type === "info" ? "#3182ce" : "#e53e3e";
    
    const notification = $(`
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        ">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${message}
        </div>
    `);
    
    $("body").append(notification);
    
    setTimeout(() => {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 3000);
}

function logout() {
    ThemeManager.logout();
    window.location.href = "index.html";
}