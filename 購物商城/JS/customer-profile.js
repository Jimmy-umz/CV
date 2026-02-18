// 圖標映射
const iconMap = {
    robot: "fas fa-robot",
    blocks: "fas fa-cubes",
    car: "fas fa-car",
    drawing: "fas fa-palette",
    adventure: "fas fa-binoculars",
    science: "fas fa-flask",
};

// 用戶數據結構
let userData = {
    personalInfo: {},
    orders: [],
    wishlist: [],
    addresses: [],
    preferences: {},
    security: {}
};

$(document).ready(function () {
    // 初始化主題
    const currentTheme = ThemeManager.init();
    
    // 更新界面顯示
    updateHeaderDisplay();
    
    // 檢查登入狀態
    if (ThemeManager.isLoggedIn()) {
        loadUserData();
        setupEventListeners();
        updateProfileDisplay();
    } else {
        showLoginPrompt();
    }
});

// 更新頭部顯示
function updateHeaderDisplay() {
    const $navLinks = $("#nav-links");
    const $loginPrompt = $("#login-prompt");
    const $profileContent = $("#profile-content");

    if (ThemeManager.isLoggedIn()) {
        // 已登入，顯示完整導航
        $navLinks.html(`
            <a href="index.html"><i class="fas fa-store"></i> 玩具瀏覽</a>
                <a href="wishlist.html"><i class="fas fa-heart"></i> 願望清單</a>
                <a href="checkout.html"><i class="fas fa-shopping-cart"></i> 結帳</a>
                <a href="order-tracking.html"><i class="fas fa-clipboard-list"></i> 我的訂單</a>
                <a href="customer-profile.html"  class="active"><i class="fas fa-user"></i> 個人資料</a>
                <a href="custom-toy-design.html"><i class="fas fa-cog"></i> 自訂玩具設計</a>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> 登出
                </button>
        `);
        $loginPrompt.hide();
        $profileContent.show();
    } 
}

// 顯示登入提示
function showLoginPrompt() {
    $("#login-prompt").show();
    $("#profile-content").hide();
}

// 設置事件監聽器
function setupEventListeners() {
    // 導航選單點擊
    $(".nav-item").on("click", function(e) {
        e.preventDefault();
        const tabId = $(this).data("tab");
        switchTab(tabId);
    });

    // 表單提交
    $("#personal-info-form").on("submit", savePersonalInfo);
    $("#add-address-form").on("submit", saveNewAddress);
    $("#change-password-form").on("submit", changePassword);

    // 主題切換
    $('input[name="theme"]').on("change", function() {
        const theme = $(this).val();
        ThemeManager.setTheme(theme);
        saveUserData();
    });

    // 偏好設定
    $("#pref-newsletter, #pref-sms, #pref-product-updates").on("change", savePreferences);
    $("#notif-email, #notif-sms, #notif-push").on("change", saveNotificationPreferences);
    $("#language, #currency").on("change", savePreferences);

    // 兩步驟驗證
    $("#two-factor-auth").on("change", toggleTwoFactorAuth);
}

// 切換頁籤
function switchTab(tabId) {
    // 更新導航選單
    $(".nav-item").removeClass("active");
    $(`.nav-item[data-tab="${tabId}"]`).addClass("active");

    // 更新內容區域
    $(".tab-content").removeClass("active");
    $(`#${tabId}`).addClass("active");

    // 根據頁籤加載對應數據
    switch(tabId) {
        case "order-history":
            loadOrderHistory();
            break;
        case "wishlist":
            loadWishlist();
            break;
        case "address-book":
            loadAddresses();
            break;
    }
}

// 加載用戶數據
function loadUserData() {
    // 從本地存儲加載用戶數據
    const savedUserData = JSON.parse(localStorage.getItem('userProfileData')) || {};
    
    if (Object.keys(savedUserData).length === 0) {
        // 如果沒有數據，生成示例數據
        generateSampleUserData();
    } else {
        userData = savedUserData;
    }

    // 從其他本地存儲加載相關數據
    loadOrdersFromStorage();
    loadWishlistFromStorage();
}

// 生成示例用戶數據
function generateSampleUserData() {
    userData = {
        personalInfo: {
            name: "張小明",
            email: "xiaoming@example.com",
            phone: "0912345678",
            birthday: "1990-05-15"
        },
        orders: [],
        wishlist: [],
        addresses: [
            {
                id: 1,
                name: "家裡",
                recipient: "張小明",
                phone: "0912345678",
                city: "台北市",
                district: "信義區",
                street: "信義路五段7號",
                postalCode: "110",
                isDefault: true
            },
            {
                id: 2,
                name: "公司",
                recipient: "張小明",
                phone: "0922334455",
                city: "新北市",
                district: "板橋區",
                street: "文化路一段100號",
                postalCode: "220",
                isDefault: false
            }
        ],
        preferences: {
            newsletter: true,
            sms: false,
            productUpdates: true,
            notifications: {
                email: true,
                sms: false,
                push: true
            },
            language: "zh-TW",
            currency: "TWD",
            theme: "client"
        },
        security: {
            lastPasswordChange: null,
            twoFactorAuth: false,
            loginActivity: []
        }
    };

    saveUserData();
}

// 從本地存儲加載訂單數據
function loadOrdersFromStorage() {
    const savedOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
    userData.orders = savedOrders;
}

// 從本地存儲加載願望清單數據
function loadWishlistFromStorage() {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    userData.wishlist = savedWishlist;
}

// 保存用戶數據
function saveUserData() {
    localStorage.setItem('userProfileData', JSON.stringify(userData));
}

// 更新個人資料顯示
function updateProfileDisplay() {
    // 更新用戶基本信息
    $("#user-name").text(userData.personalInfo.name || "未設定");
    $("#user-email").text(userData.personalInfo.email || "未設定");

    // 更新個人資料表單
    $("#profile-name").val(userData.personalInfo.name || "");
    $("#profile-phone").val(userData.personalInfo.phone || "");
    $("#profile-email").val(userData.personalInfo.email || "");
    $("#profile-birthday").val(userData.personalInfo.birthday || "");

    // 更新偏好設定
    $("#pref-newsletter").prop("checked", userData.preferences.newsletter || false);
    $("#pref-sms").prop("checked", userData.preferences.sms || false);
    $("#pref-product-updates").prop("checked", userData.preferences.productUpdates || false);

    // 更新通知設定
    $("#notif-email").prop("checked", userData.preferences.notifications?.email || false);
    $("#notif-sms").prop("checked", userData.preferences.notifications?.sms || false);
    $("#notif-push").prop("checked", userData.preferences.notifications?.push || false);

    // 更新語言和貨幣
    $("#language").val(userData.preferences.language || "zh-TW");
    $("#currency").val(userData.preferences.currency || "TWD");

    // 更新主題
    $(`input[name="theme"][value="${userData.preferences.theme || 'client'}"]`).prop("checked", true);

    // 更新安全設定
    $("#two-factor-auth").prop("checked", userData.security.twoFactorAuth || false);
    updateLastPasswordChange();

    // 更新徽章計數
    updateBadgeCounts();
}

// 更新徽章計數
function updateBadgeCounts() {
    $("#order-count").text(userData.orders.length);
    $("#wishlist-count").text(userData.wishlist.length);
}

// 保存個人資訊
function savePersonalInfo(e) {
    e.preventDefault();
    
    userData.personalInfo = {
        name: $("#profile-name").val(),
        phone: $("#profile-phone").val(),
        email: $("#profile-email").val(),
        birthday: $("#profile-birthday").val()
    };

    userData.preferences.newsletter = $("#pref-newsletter").is(":checked");
    userData.preferences.sms = $("#pref-sms").is(":checked");
    userData.preferences.productUpdates = $("#pref-product-updates").is(":checked");

    saveUserData();
    updateProfileDisplay();
    
    showNotification("個人資料已更新", "success");
}

// 保存偏好設定
function savePreferences() {
    userData.preferences.language = $("#language").val();
    userData.preferences.currency = $("#currency").val();
    userData.preferences.theme = $('input[name="theme"]:checked').val();

    saveUserData();
    showNotification("偏好設定已更新", "success");
}

// 保存通知偏好設定
function saveNotificationPreferences() {
    userData.preferences.notifications = {
        email: $("#notif-email").is(":checked"),
        sms: $("#notif-sms").is(":checked"),
        push: $("#notif-push").is(":checked")
    };

    saveUserData();
}

// 加載訂單歷史
function loadOrderHistory() {
    const totalOrders = userData.orders.length;
    const totalSpent = userData.orders.reduce((sum, order) => sum + order.totals.total, 0);
    const averageOrder = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

    $("#total-orders").text(totalOrders);
    $("#total-spent").text("$" + totalSpent);
    $("#average-order").text("$" + averageOrder);

    displayRecentOrders();
}

// 顯示最近訂單
function displayRecentOrders() {
    const $recentOrdersList = $("#recent-orders-list");
    $recentOrdersList.empty();

    const recentOrders = userData.orders.slice(0, 5); // 顯示最近5筆訂單

    if (recentOrders.length === 0) {
        $recentOrdersList.html(`
            <div class="empty-state">
                <p>還沒有任何訂單記錄</p>
            </div>
        `);
        return;
    }

    recentOrders.forEach(order => {
        const orderDate = formatDate(order.date);
        const orderItem = `
            <div class="order-item">
                <div class="order-info">
                    <div class="order-number">${order.id}</div>
                    <div class="order-date">${orderDate}</div>
                </div>
                <div class="order-amount">$${order.totals.total}</div>
                <div class="order-status status-${order.status}">
                    ${getStatusText(order.status)}
                </div>
            </div>
        `;
        $recentOrdersList.append(orderItem);
    });
}

// 加載願望清單
function loadWishlist() {
    const $wishlistContainer = $("#profile-wishlist");
    const $emptyWishlist = $("#empty-profile-wishlist");

    $wishlistContainer.empty();

    if (userData.wishlist.length === 0) {
        $wishlistContainer.hide();
        $emptyWishlist.show();
        return;
    }

    $wishlistContainer.show();
    $emptyWishlist.hide();

    userData.wishlist.forEach(item => {
        const wishlistItem = `
            <div class="wishlist-item">
                <div class="wishlist-image">
                    <i class="${iconMap[item.image] || "fas fa-gift"}"></i>
                </div>
                <div class="wishlist-name">${item.name}</div>
                <div class="wishlist-price">$${item.price}</div>
                <button class="btn-primary" onclick="addToCart(${item.id})">
                    <i class="fas fa-shopping-cart"></i> 加入購物車
                </button>
            </div>
        `;
        $wishlistContainer.append(wishlistItem);
    });
}

// 加載地址簿
function loadAddresses() {
    const $addressesList = $("#addresses-list");
    $addressesList.empty();

    if (userData.addresses.length === 0) {
        $addressesList.html(`
            <div class="empty-state">
                <p>還沒有任何地址</p>
            </div>
        `);
        return;
    }

    userData.addresses.forEach(address => {
        const addressCard = `
            <div class="address-card ${address.isDefault ? 'default' : ''}">
                <div class="address-header">
                    <div class="address-name">${address.name}</div>
                    ${address.isDefault ? '<div class="default-badge">預設地址</div>' : ''}
                </div>
                <div class="address-details">
                    <div><strong>${address.recipient}</strong></div>
                    <div>${address.phone}</div>
                    <div>${address.city}${address.district}${address.street}</div>
                    <div>郵遞區號: ${address.postalCode}</div>
                </div>
                <div class="address-actions">
                    <button class="btn-small btn-edit" onclick="editAddress(${address.id})">
                        <i class="fas fa-edit"></i> 編輯
                    </button>
                    ${!address.isDefault ? `
                        <button class="btn-small btn-delete" onclick="deleteAddress(${address.id})">
                            <i class="fas fa-trash"></i> 刪除
                        </button>
                    ` : ''}
                    ${!address.isDefault ? `
                        <button class="btn-small btn-edit" onclick="setDefaultAddress(${address.id})">
                            <i class="fas fa-star"></i> 設為預設
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        $addressesList.append(addressCard);
    });
}

// 顯示新增地址表單
function showAddAddressForm() {
    $("#add-address-form")[0].reset();
    $("#add-address-modal").show();
}

// 關閉新增地址模態框
function closeAddAddressModal() {
    $("#add-address-modal").hide();
}

// 保存新地址
function saveNewAddress(e) {
    e.preventDefault();

    const newAddress = {
        id: Date.now(),
        name: $("#address-name").val(),
        recipient: $("#address-recipient").val(),
        phone: $("#address-phone").val(),
        city: $("#address-city").val(),
        district: $("#address-district").val(),
        street: $("#address-street").val(),
        postalCode: $("#address-postal").val(),
        isDefault: userData.addresses.length === 0 // 如果是第一個地址，設為預設
    };

    userData.addresses.push(newAddress);
    saveUserData();
    loadAddresses();
    closeAddAddressModal();
    
    showNotification("地址已新增", "success");
}

// 編輯地址
function editAddress(addressId) {
    const address = userData.addresses.find(addr => addr.id === addressId);
    if (!address) return;

    // 填充表單
    $("#address-name").val(address.name);
    $("#address-recipient").val(address.recipient);
    $("#address-phone").val(address.phone);
    $("#address-city").val(address.city);
    $("#address-district").val(address.district);
    $("#address-street").val(address.street);
    $("#address-postal").val(address.postalCode);

    // 顯示編輯模式
    $("#add-address-modal").show();

    // 暫時保存編輯的地址ID
    $("#add-address-form").data("editing-id", addressId);
}

// 刪除地址
function deleteAddress(addressId) {
    if (!confirm("確定要刪除這個地址嗎？")) return;

    userData.addresses = userData.addresses.filter(addr => addr.id !== addressId);
    saveUserData();
    loadAddresses();
    
    showNotification("地址已刪除", "success");
}

// 設為預設地址
function setDefaultAddress(addressId) {
    userData.addresses.forEach(addr => {
        addr.isDefault = addr.id === addressId;
    });
    saveUserData();
    loadAddresses();
    
    showNotification("預設地址已更新", "success");
}

// 顯示更改密碼表單
function showChangePasswordForm() {
    $("#change-password-form")[0].reset();
    $("#change-password-modal").show();
}

// 關閉更改密碼模態框
function closeChangePasswordModal() {
    $("#change-password-modal").hide();
}

// 更改密碼
function changePassword(e) {
    e.preventDefault();

    const currentPassword = $("#current-password").val();
    const newPassword = $("#new-password").val();
    const confirmPassword = $("#confirm-password").val();

    if (newPassword !== confirmPassword) {
        showNotification("新密碼與確認密碼不一致", "error");
        return;
    }

    if (newPassword.length < 6) {
        showNotification("密碼長度至少需要6個字符", "error");
        return;
    }

    // 模擬密碼更改成功
    userData.security.lastPasswordChange = new Date().toISOString();
    saveUserData();
    updateLastPasswordChange();
    closeChangePasswordModal();
    
    showNotification("密碼已成功更改", "success");
}

// 更新最後密碼更改時間
function updateLastPasswordChange() {
    const lastChange = userData.security.lastPasswordChange;
    const displayText = lastChange ? 
        formatDate(lastChange, true) : "從未更改";
    $("#last-password-change").text(displayText);
}

// 切換兩步驟驗證
function toggleTwoFactorAuth() {
    const enabled = $("#two-factor-auth").is(":checked");
    userData.security.twoFactorAuth = enabled;
    saveUserData();
    
    showNotification(`兩步驟驗證已${enabled ? '啟用' : '停用'}`, "success");
}

// 顯示登入活動
function showLoginActivity() {
    alert("登入活動記錄功能（演示用）");
}

// 加入購物車
function addToCart(itemId) {
    const item = userData.wishlist.find(item => item.id === itemId);
    if (!item) return;

    // 這裡可以實現加入購物車的邏輯
    showNotification(`"${item.name}" 已加入購物車`, "success");
}

// 重設表單
function resetForm() {
    if (confirm("確定要重設表單嗎？所有未儲存的變更將會遺失。")) {
        updateProfileDisplay();
        showNotification("表單已重設", "info");
    }
}

// 輔助函數
function getStatusText(status) {
    const statusMap = {
        'pending': '處理中',
        'confirmed': '已確認',
        'shipped': '已發貨',
        'delivered': '已送達',
        'cancelled': '已取消'
    };
    return statusMap[status] || status;
}

function formatDate(dateString, includeTime = false) {
    if (!dateString) return "未知日期";
    
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        ...(includeTime && { hour: '2-digit', minute: '2-digit' })
    };
    return date.toLocaleDateString('zh-TW', options);
}

// 顯示通知
function showNotification(message, type = 'info') {
    const bgColor = type === 'success' ? '#38a169' : 
                   type === 'warning' ? '#d69e2e' : 
                   type === 'error' ? '#e53e3e' : '#3182ce';
    
    const icon = type === 'success' ? 'check' : 
                type === 'warning' ? 'exclamation-triangle' : 
                type === 'error' ? 'times-circle' : 'info-circle';
    
    const notification = $(`
        <div class="notification" style="
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
            display: flex;
            align-items: center;
            gap: 0.75rem;
        ">
            <i class="fas fa-${icon}"></i>
            ${message}
        </div>
    `);
    
    $('body').append(notification);
    
    setTimeout(() => {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 3000);
}

function logout() {
    ThemeManager.logout();
    window.location.href = 'index.html';
}

// 點擊模態框外部關閉
$(document).on('click', function(event) {
    if ($(event.target).hasClass('modal')) {
        closeAddAddressModal();
        closeChangePasswordModal();
    }
});