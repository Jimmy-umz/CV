// 商品详情页逻辑
$(document).ready(function () {
    // 初始化主题
    const currentTheme = ThemeManager.init();
    
    // 更新界面显示
    updateHeaderDisplay();
    
    // 从URL参数获取商品ID
    const urlParams = new URLSearchParams(window.location.search);
    const toyId = parseInt(urlParams.get('id')) || 1;
    
    // 加载商品详情
    loadToyDetail(toyId);
    
    // 加载相关商品
    loadRelatedToys(toyId);
    
    // 事件监听
    $("#add-to-wishlist").on("click", addToWishlist);
    $("#buy-now").on("click", buyNow);
    $(".tab-header").on("click", handleTabSwitch);
});

// 更新头部显示
function updateHeaderDisplay() {
    const $navLinks = $("#nav-links");
    const $loginPrompt = $("#login-prompt");

    if (ThemeManager.isLoggedIn()) {
        // 已登入，显示完整导航
        $navLinks.html(`
            <a href="index.html" class="active"><i class="fas fa-store"></i> 玩具浏览</a>
            <a href="wishlist.html"><i class="fas fa-heart"></i> 愿望清单</a>
            <a href="checkout.html"><i class="fas fa-shopping-cart"></i> 结帐</a>
            <a href="order-tracking.html"><i class="fas fa-clipboard-list"></i> 我的订单</a>
            <a href="customer-profile.html"><i class="fas fa-user"></i> 个人资料</a>
            <a href="custom-toy-design.html"><i class="fas fa-cog"></i> 自订玩具设计</a>
            <button class="logout-btn" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> 登出
            </button>
        `);
        $loginPrompt.hide();
    } else {
        // 未登入，只显示基本导航
        $navLinks.html(`
            <a href="index.html"><i class="fas fa-store"></i> 玩具浏览</a>
            <a href="login.html" class="login-btn"><i class="fas fa-sign-in-alt"></i> 登入</a>
            <a href="login.html" class="login-btn"><i class="fas fa-user-plus"></i> 注册</a>
        `);
        $loginPrompt.show();
    }
}

// 加载商品详情
function loadToyDetail(toyId) {
    // 从统一数据源获取商品数据
    const toy = DataManager.getProductById(toyId);
    
    if (!toy) {
        // 商品不存在，跳转回首页
        window.location.href = "index.html";
        return;
    }
    
    // 更新页面内容
    $("#current-toy-name").text(toy.name);
    $("#toy-title").text(toy.name);
    $("#toy-price").text("$" + toy.price);
    $("#toy-description").text(toy.description);
    $("#toy-category").text(getCategoryName(toy.category));
    
    // 更新图片显示
    updateToyImages(toy);
    
    // 更新库存状态
    updateStockStatus(toy.stock);
    
    // 更新标签页内容
    updateTabContent(toy);
    
    // 更新面包屑
    updateBreadcrumb(toy.name);
    
    // 检查愿望清单状态
    checkWishlistStatus(toyId);
}

// 更新商品图片显示
function updateToyImages(toy) {
    const $mainImage = $("#main-image");
    const $thumbnails = $(".image-thumbnails");
    
    // 获取保存的图片数据
    const savedImage = DataManager.getProductImage(toy.id);
    
    if (savedImage) {
        // 有上传的图片，显示图片
        $mainImage.html(`<img src="${savedImage}" alt="${toy.name}" style="width: 100%; height: 100%; object-fit: cover;">`);
        
        // 生成缩略图
        $thumbnails.html(`
            <div class="thumbnail active" onclick="changeMainImage('${savedImage}')">
                <img src="${savedImage}" alt="${toy.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
            </div>
            <div class="thumbnail" onclick="changeMainImage('img/${toy.image}_angle.png')">
                <i class="${getIconClass(toy.image)}"></i>
            </div>
            <div class="thumbnail" onclick="changeMainImage('img/${toy.image}_action.png')">
                <i class="${getIconClass(toy.image)}"></i>
            </div>
        `);
    } else {
        // 没有上传图片，显示默认图标
        $mainImage.html(`<i class="${getIconClass(toy.image)}" id="toy-icon"></i>`);
        
        // 生成默认缩略图
        $thumbnails.html(`
            <div class="thumbnail active" onclick="changeMainImage('default')">
                <i class="${getIconClass(toy.image)}"></i>
            </div>
            <div class="thumbnail" onclick="changeMainImage('angle')">
                <i class="${getIconClass(toy.image)}"></i>
            </div>
            <div class="thumbnail" onclick="changeMainImage('action')">
                <i class="${getIconClass(toy.image)}"></i>
            </div>
        `);
    }
}

// 切换主图
function changeMainImage(imageType) {
    const $mainImage = $("#main-image");
    const $thumbnails = $(".thumbnail");
    
    // 移除所有active类
    $thumbnails.removeClass("active");
    
    if (imageType === 'default') {
        // 显示默认图标
        const toyId = getCurrentToyId();
        const toy = DataManager.getProductById(toyId);
        $mainImage.html(`<i class="${getIconClass(toy.image)}" id="toy-icon"></i>`);
        $thumbnails.first().addClass("active");
    } else if (imageType.startsWith('img/')) {
        // 显示图片文件（模拟多角度图片）
        $mainImage.html(`<img src="${imageType}" alt="商品图片" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`);
        $thumbnails.eq(1).addClass("active");
    } else if (imageType.includes('data:')) {
        // 显示上传的图片数据
        $mainImage.html(`<img src="${imageType}" alt="商品图片" style="width: 100%; height: 100%; object-fit: cover;">`);
        $thumbnails.first().addClass("active");
    } else {
        // 显示其他角度的默认图标
        const toyId = getCurrentToyId();
        const toy = DataManager.getProductById(toyId);
        $mainImage.html(`<i class="${getIconClass(toy.image)}" id="toy-icon"></i>`);
        $thumbnails.last().addClass("active");
    }
}

// 更新库存状态
function updateStockStatus(stock) {
    const $stockStatus = $("#stock-status");
    const $buyNowBtn = $("#buy-now");
    
    if (stock > 10) {
        $stockStatus.html('<i class="fas fa-check-circle"></i><span>有现货</span>');
        $stockStatus.css("color", "#38a169");
        $buyNowBtn.prop("disabled", false).html('<i class="fas fa-shopping-cart"></i>立即购买');
    } else if (stock > 0) {
        $stockStatus.html('<i class="fas fa-exclamation-circle"></i><span>库存紧张</span>');
        $stockStatus.css("color", "#d69e2e");
        $buyNowBtn.prop("disabled", false).html('<i class="fas fa-shopping-cart"></i>立即购买');
    } else {
        $stockStatus.html('<i class="fas fa-times-circle"></i><span>缺货中</span>');
        $stockStatus.css("color", "#e53e3e");
        $buyNowBtn.prop("disabled", true).html('<i class="fas fa-clock"></i>暂时缺货');
    }
}

// 更新标签页内容
function updateTabContent(toy) {
    // 更新描述标签页
    let featuresHtml = "<h3>产品特色</h3><ul>";
    if (toy.features && toy.features.length > 0) {
        toy.features.forEach(feature => {
            featuresHtml += `<li>${feature}</li>`;
        });
    } else {
        // 默认特色描述
        featuresHtml += `
            <li>高品质材料制造</li>
            <li>安全无毒环保设计</li>
            <li>促进儿童智力发展</li>
            <li>易于操作和使用</li>
        `;
    }
    featuresHtml += "</ul>";
    $("#description").html(featuresHtml);
    
    // 更新规格标签页
    let specsHtml = "<div class='specs-detail'>";
    const specs = getToySpecs(toy);
    Object.entries(specs).forEach(([key, value]) => {
        const specName = getSpecName(key);
        specsHtml += `
            <div class="spec-row">
                <span class="spec-name">${specName}</span>
                <span class="spec-value">${value}</span>
            </div>
        `;
    });
    specsHtml += "</div>";
    $("#specs").html(specsHtml);
}

// 获取商品规格
function getToySpecs(toy) {
    if (toy.specs) {
        return toy.specs;
    }
    
    // 默认规格
    return {
        age: "3-12岁",
        weight: "0.5-2.0 kg",
        dimensions: "15-35 cm",
        battery: "锂电池 (包含)",
        material: "环保ABS塑料",
        safety: "通过安全认证"
    };
}

// 加载相关商品
function loadRelatedToys(currentToyId) {
    // 从统一数据源获取上架商品
    const activeToys = DataManager.getActiveProducts();
    const currentToy = DataManager.getProductById(currentToyId);
    
    const relatedToys = activeToys
        .filter(t => t.id !== currentToyId && t.category === currentToy.category)
        .slice(0, 4);
    
    const $relatedGrid = $("#related-toys");
    $relatedGrid.empty();
    
    if (relatedToys.length === 0) {
        $relatedGrid.html('<div class="empty-state"><i class="fas fa-gift"></i><p>暂无相关商品</p></div>');
        return;
    }
    
    relatedToys.forEach(toy => {
        const savedImage = DataManager.getProductImage(toy.id);
        const imageContent = savedImage ? 
            `<img src="${savedImage}" alt="${toy.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
            `<i class="${getIconClass(toy.image)}"></i>`;
        
        const toyCard = `
            <div class="related-toy-card">
                <div class="related-toy-image">
                    ${imageContent}
                </div>
                <div class="related-toy-content">
                    <h3 class="related-toy-name">${toy.name}</h3>
                    <div class="related-toy-price">$${toy.price}</div>
                    <button class="related-view-btn" onclick="viewToyDetail(${toy.id})">
                        <i class="fas fa-eye"></i> 查看详情
                    </button>
                </div>
            </div>
        `;
        $relatedGrid.append(toyCard);
    });
}

// 查看商品详情
function viewToyDetail(toyId) {
    window.location.href = `toy-detail.html?id=${toyId}`;
}

// 标签页切换
function handleTabSwitch() {
    const tabId = $(this).data("tab");
    
    $(".tab-header").removeClass("active");
    $(this).addClass("active");
    
    $(".tab-pane").removeClass("active");
    $(`#${tabId}`).addClass("active");
}

// 检查愿望清单状态
function checkWishlistStatus(toyId) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const inWishlist = wishlist.find(item => item.id === toyId);
    
    if (inWishlist) {
        $("#add-to-wishlist")
            .html('<i class="fas fa-check"></i> 已加入愿望清单')
            .prop("disabled", true)
            .css("background", "#38a169")
            .css("border-color", "#38a169")
            .css("color", "white");
    }
}

// 加入愿望清单
function addToWishlist() {
    if (!checkLoginAndProceed("addToWishlist")) {
        return;
    }
    
    const toyId = getCurrentToyId();
    const toy = DataManager.getProductById(toyId);
    
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    if (!wishlist.find(item => item.id === toyId)) {
        wishlist.push({
            ...toy,
            quantity: 1,
            addedAt: new Date().toISOString(),
        });
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        
        showNotification(`"${toy.name}" 已加入愿望清单！`);
        
        // 更新按钮状态
        $("#add-to-wishlist")
            .html('<i class="fas fa-check"></i> 已加入愿望清单')
            .prop("disabled", true)
            .css("background", "#38a169")
            .css("border-color", "#38a169")
            .css("color", "white");
    } else {
        showNotification(`"${toy.name}" 已在愿望清单中！`, "warning");
    }
}

// 立即购买
function buyNow() {
    if (!checkLoginAndProceed("buyNow")) {
        return;
    }
    
    const toyId = getCurrentToyId();
    const toy = DataManager.getProductById(toyId);
    
    // 检查库存
    if (toy.stock <= 0) {
        showNotification("此商品暂时缺货，无法购买", "error");
        return;
    }
    
    // 跳转到结帐页面
    window.location.href = `checkout.html?toyId=${toyId}`;
}

// 检查登入并执行操作
function checkLoginAndProceed(action) {
    if (!ThemeManager.isLoggedIn()) {
        localStorage.setItem("pendingAction", action);
        localStorage.setItem("returnUrl", window.location.href);
        window.location.href = "login.html?from=detail";
        return false;
    }
    return true;
}

// 显示通知
function showNotification(message, type = "success") {
    const bgColor = type === "success" ? "#38a169" : 
                   type === "warning" ? "#d69e2e" : 
                   type === "info" ? "#3182ce" : "#e53e3e";
    
    const icon = type === "success" ? "check" : 
                type === "warning" ? "exclamation-triangle" : 
                type === "info" ? "info-circle" : "times-circle";
    
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
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            min-width: 300px;
        ">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
    `);
    
    $("body").append(notification);
    
    setTimeout(() => {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 3000);
}

// 辅助函数
function getCurrentToyId() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
}

function getCategoryName(category) {
    const names = {
        educational: "教育玩具",
        outdoor: "户外玩具",
        creative: "创意玩具",
        electronic: "电子玩具",
    };
    return names[category] || category;
}

function getIconClass(imageType) {
    const iconMap = {
        robot: "fas fa-robot",
        blocks: "fas fa-cubes",
        car: "fas fa-car",
        drawing: "fas fa-palette",
        adventure: "fas fa-binoculars",
        science: "fas fa-flask",
    };
    return iconMap[imageType] || "fas fa-gift";
}

function getSpecName(key) {
    const names = {
        age: "适合年龄",
        weight: "产品重量",
        dimensions: "产品尺寸",
        battery: "电池类型",
        batteryLife: "电池续航",
        chargeTime: "充电时间",
        pieces: "积木数量",
        material: "材料",
        controlRange: "遥控范围",
        safety: "安全认证"
    };
    return names[key] || key;
}

function updateBreadcrumb(toyName) {
    $("#current-toy-name").text(toyName);
}

function logout() {
    ThemeManager.logout();
    window.location.href = "index.html";
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);