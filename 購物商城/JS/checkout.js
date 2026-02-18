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
let currentStep = 1;
let orderData = {
    shipping: {},
    payment: {},
    items: [],
    totals: {
        subtotal: 0,
        shipping: 0,
        discount: 0,
        total: 0
    }
};

$(document).ready(function () {
    // 初始化主題
    const currentTheme = ThemeManager.init();
    
    // 更新界面顯示
    updateHeaderDisplay();
    
    // 檢查登入狀態
    if (ThemeManager.isLoggedIn()) {
        loadCheckoutData();
        setupEventListeners();
    } else {
        showLoginPrompt();
    }
});

// 更新頭部顯示
function updateHeaderDisplay() {
    const $navLinks = $("#nav-links");
    const $loginPrompt = $("#login-prompt");
    const $checkoutContent = $("#checkout-content");

    if (ThemeManager.isLoggedIn()) {
        // 已登入，顯示完整導航
        $navLinks.html(`
            <a href="index.html" "><i class="fas fa-store"></i> 玩具瀏覽</a>
                <a href="wishlist.html"><i class="fas fa-heart"></i> 願望清單</a>
                <a href="checkout.html" class="active"><i class="fas fa-shopping-cart"></i> 結帳</a>
                <a href="order-tracking.html"><i class="fas fa-clipboard-list"></i> 我的訂單</a>
                <a href="customer-profile.html"><i class="fas fa-user"></i> 個人資料</a>
                <a href="custom-toy-design.html"><i class="fas fa-cog"></i> 自訂玩具設計</a>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> 登出
                </button>
        `);
        $loginPrompt.hide();
        $checkoutContent.show();
    } 
}

// 顯示登入提示
function showLoginPrompt() {
    $("#login-prompt").show();
    $("#checkout-content").hide();
}

// 設置事件監聽器
function setupEventListeners() {
    // 配送方式變更
    $('input[name="shipping-method"]').on('change', updateShippingFee);
    
    // 付款方式變更
    $('input[name="payment-method"]').on('change', function() {
        updatePaymentDetails($(this).val());
    });
    
    // 優惠碼應用
    $('#apply-promo').on('click', applyPromoCode);
    
    // 表單輸入實時更新
    $('#shipping-form input').on('input', debounce(updateOrderSummary, 300));
    $('#payment-form input').on('input', debounce(updateOrderSummary, 300));
}

// 防抖函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 加載結帳數據
function loadCheckoutData() {
    // 從本地存儲或URL參數獲取商品數據
    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('itemId');
    
    if (selectedProducts.length > 0) {
        orderData.items = selectedProducts;
    } else if (itemId) {
        // 單個商品購買
        const toy = getToyById(parseInt(itemId));
        if (toy) {
            orderData.items = [{
                ...toy,
                quantity: 1
            }];
        }
    } else {
        // 默認演示數據
        orderData.items = [
            {
                id: 1,
                name: "智能編程機器人",
                price: 299,
                category: "educational",
                description: "培養孩子編程思維的智能機器人",
                image: "robot",
                stock: 15,
                quantity: 1
            },
            {
                id: 2,
                name: "創意積木套裝",
                price: 199,
                category: "creative",
                description: "200片多彩積木，激發創造力",
                image: "blocks",
                stock: 25,
                quantity: 1
            }
        ];
    }
    
    updateOrderDisplay();
    calculateTotals();
}

// 獲取玩具數據
function getToyById(id) {
    const allToys = [
        { id: 1, name: "智能編程機器人", price: 299, category: "educational", description: "培養孩子編程思維的智能機器人", image: "robot", stock: 15 },
        { id: 2, name: "創意積木套裝", price: 199, category: "creative", description: "200片多彩積木，激發創造力", image: "blocks", stock: 25 },
        { id: 3, name: "遙控越野賽車", price: 399, category: "outdoor", description: "四輪驅動遙控賽車，適合戶外", image: "car", stock: 8 },
        { id: 4, name: "電子繪圖板", price: 259, category: "electronic", description: "兒童專用電子繪圖板", image: "drawing", stock: 12 },
        { id: 5, name: "戶外探險套裝", price: 189, category: "outdoor", description: "包含望遠鏡、指南針等工具", image: "adventure", stock: 18 },
        { id: 6, name: "科學實驗套裝", price: 349, category: "educational", description: "30個有趣的科學實驗", image: "science", stock: 10 }
    ];
    
    return allToys.find(toy => toy.id === id);
}

// 更新訂單顯示
function updateOrderDisplay() {
    updateOrderItems();
    updateOrderSummary();
}

// 更新訂單商品列表
function updateOrderItems() {
    const $orderItems = $('#order-items');
    const $orderItemsSummary = $('#order-items-summary');
    
    $orderItems.empty();
    $orderItemsSummary.empty();
    
    if (orderData.items.length === 0) {
        $orderItems.html('<p class="empty-message">購物車是空的</p>');
        $orderItemsSummary.html('<p class="empty-message">沒有商品</p>');
        return;
    }
    
    orderData.items.forEach(item => {
        const orderItem = `
            <div class="order-item">
                <div class="item-image">
                    <i class="${iconMap[item.image] || "fas fa-gift"}"></i>
                </div>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">$${item.price}</div>
                    <div class="item-quantity">數量: ${item.quantity}</div>
                </div>
            </div>
        `;
        $orderItems.append(orderItem);
        
        const summaryItem = `
            <div class="summary-line">
                <span>${item.name} × ${item.quantity}</span>
                <span>$${item.price * item.quantity}</span>
            </div>
        `;
        $orderItemsSummary.append(summaryItem);
    });
}

// 計算總金額
function calculateTotals() {
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = orderData.totals.shipping;
    const discount = orderData.totals.discount;
    
    orderData.totals.subtotal = subtotal;
    orderData.totals.total = subtotal + shipping - discount;
    
    updateTotalsDisplay();
}

// 更新金額顯示
function updateTotalsDisplay() {
    $('#subtotal').text('$' + orderData.totals.subtotal);
    $('#shipping-fee').text('$' + orderData.totals.shipping);
    $('#discount').text('-$' + orderData.totals.discount);
    $('#total-amount').text('$' + orderData.totals.total);
}

// 更新運費
function updateShippingFee() {
    const shippingMethod = $('input[name="shipping-method"]:checked').val();
    const shippingFee = shippingMethod === 'express' ? 50 : 0;
    
    orderData.totals.shipping = shippingFee;
    orderData.shipping.method = shippingMethod === 'express' ? '快速配送' : '標準配送';
    orderData.shipping.cost = shippingFee;
    
    calculateTotals();
}

// 更新付款詳情顯示
function updatePaymentDetails(method) {
    // 隱藏所有付款詳情
    $('.payment-details').hide();
    
    // 顯示對應的付款詳情
    switch(method) {
        case 'credit-card':
            $('#credit-card-details').show();
            orderData.payment.method = '信用卡/金融卡';
            break;
        case 'paypal':
            $('#paypal-details').show();
            orderData.payment.method = 'PayPal';
            break;
        case 'bank-transfer':
            $('#bank-transfer-details').show();
            orderData.payment.method = '銀行轉帳';
            break;
    }
}

// 應用優惠碼
function applyPromoCode() {
    const promoCode = $('#promo-code').val().trim();
    
    if (!promoCode) {
        showNotification('請輸入優惠碼', 'warning');
        return;
    }
    
    // 模擬優惠碼驗證
    const validPromoCodes = {
        'WELCOME10': 0.1,    // 10% 折扣
        'TOYS20': 0.2,       // 20% 折扣
        'FREESHIP': 'free-shipping' // 免運費
    };
    
    if (validPromoCodes[promoCode]) {
        const discount = validPromoCodes[promoCode];
        
        if (discount === 'free-shipping') {
            orderData.totals.shipping = 0;
            orderData.totals.discount = 0;
            showNotification('免運費優惠已應用！', 'success');
        } else {
            const discountAmount = Math.round(orderData.totals.subtotal * discount);
            orderData.totals.discount = discountAmount;
            showNotification(`優惠碼已應用！節省 $${discountAmount}`, 'success');
        }
        
        calculateTotals();
        $('#promo-code').val('').prop('disabled', true);
        $('#apply-promo').text('已應用').prop('disabled', true);
    } else {
        showNotification('無效的優惠碼', 'error');
    }
}

// 下一步
function nextStep(step) {
    if (!validateCurrentStep()) {
        return;
    }
    
    // 隱藏當前步驟
    $(`#step-${currentStep}`).removeClass('active');
    $(`.step[data-step="${currentStep}"]`).removeClass('active');
    
    // 顯示新步驟
    currentStep = step;
    $(`#step-${currentStep}`).addClass('active');
    $(`.step[data-step="${currentStep}"]`).addClass('active');
    
    // 更新訂單摘要
    updateOrderSummary();
}

// 上一步
function prevStep(step) {
    // 隱藏當前步驟
    $(`#step-${currentStep}`).removeClass('active');
    $(`.step[data-step="${currentStep}"]`).removeClass('active');
    
    // 顯示上一步
    currentStep = step;
    $(`#step-${currentStep}`).addClass('active');
    $(`.step[data-step="${currentStep}"]`).addClass('active');
}

// 驗證當前步驟
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return validateShippingForm();
        case 2:
            return validatePaymentForm();
        default:
            return true;
    }
}

// 驗證配送表單
function validateShippingForm() {
    const requiredFields = ['full-name', 'phone', 'email', 'address', 'city', 'district', 'postal-code'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const value = $(`#${field}`).val().trim();
        if (!value) {
            isValid = false;
            showFieldError(field, '此為必填欄位');
        } else {
            clearFieldError(field);
        }
    });
    
    // 驗證電子郵件格式
    const email = $('#email').val().trim();
    if (email && !isValidEmail(email)) {
        isValid = false;
        showFieldError('email', '請輸入有效的電子郵件地址');
    }
    
    // 驗證電話格式
    const phone = $('#phone').val().trim();
    if (phone && !isValidPhone(phone)) {
        isValid = false;
        showFieldError('phone', '請輸入有效的電話號碼');
    }
    
    if (!isValid) {
        showNotification('請填寫所有必填欄位', 'warning');
    }
    
    return isValid;
}

// 驗證付款表單
function validatePaymentForm() {
    const paymentMethod = $('input[name="payment-method"]:checked').val();
    
    if (paymentMethod === 'credit-card') {
        const requiredFields = ['card-number', 'card-holder', 'expiry-date', 'cvv'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const value = $(`#${field}`).val().trim();
            if (!value) {
                isValid = false;
                showFieldError(field, '此為必填欄位');
            } else {
                clearFieldError(field);
            }
        });
        
        if (!isValid) {
            showNotification('請填寫所有付款資訊', 'warning');
            return false;
        }
    }
    
    return true;
}

// 顯示欄位錯誤
function showFieldError(fieldId, message) {
    $(`#${fieldId}`).addClass('error');
    // 可以添加錯誤消息顯示邏輯
}

// 清除欄位錯誤
function clearFieldError(fieldId) {
    $(`#${fieldId}`).removeClass('error');
}

// 驗證電子郵件格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 驗證電話格式
function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{8,15}$/;
    return phoneRegex.test(phone);
}

// 更新訂單摘要
function updateOrderSummary() {
    // 更新配送資訊摘要
    updateShippingSummary();
    
    // 更新付款資訊摘要
    updatePaymentSummary();
}

// 更新配送資訊摘要
function updateShippingSummary() {
    const shippingSummary = `
        <div class="summary-line">
            <span>收貨人</span>
            <span>${$('#full-name').val() || '未填寫'}</span>
        </div>
        <div class="summary-line">
            <span>電話</span>
            <span>${$('#phone').val() || '未填寫'}</span>
        </div>
        <div class="summary-line">
            <span>地址</span>
            <span>${$('#address').val() || '未填寫'}</span>
        </div>
        <div class="summary-line">
            <span>配送方式</span>
            <span>${orderData.shipping.method || '標準配送'}</span>
        </div>
    `;
    
    $('#shipping-summary').html(shippingSummary);
    
    // 保存配送數據
    orderData.shipping = {
        name: $('#full-name').val(),
        phone: $('#phone').val(),
        email: $('#email').val(),
        address: $('#address').val(),
        city: $('#city').val(),
        district: $('#district').val(),
        postalCode: $('#postal-code').val(),
        method: orderData.shipping.method || '標準配送'
    };
}

// 更新付款資訊摘要
function updatePaymentSummary() {
    const paymentMethod = $('input[name="payment-method"]:checked').val();
    let paymentDetails = '';
    
    switch(paymentMethod) {
        case 'credit-card':
            paymentDetails = `信用卡 **** ${$('#card-number').val().slice(-4)}`;
            break;
        case 'paypal':
            paymentDetails = 'PayPal';
            break;
        case 'bank-transfer':
            paymentDetails = '銀行轉帳';
            break;
    }
    
    const paymentSummary = `
        <div class="summary-line">
            <span>付款方式</span>
            <span>${paymentDetails}</span>
        </div>
    `;
    
    $('#payment-summary').html(paymentSummary);
}

// 確認訂單
function confirmOrder() {
    if (!validateCurrentStep()) {
        return;
    }
    
    // 生成訂單數據
    const order = {
        id: generateOrderId(),
        date: new Date().toISOString(),
        status: 'processing',
        ...orderData,
        totals: { ...orderData.totals }
    };
    
    // 保存訂單到本地存儲
    saveOrder(order);
    
    // 顯示成功模態框
    showSuccessModal(order);
    
    // 清空購物車數據
    localStorage.removeItem('selectedProducts');
}

// 生成訂單ID
function generateOrderId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `SS${timestamp}${random}`;
}

// 保存訂單
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('userOrders')) || [];
    orders.push(order);
    localStorage.setItem('userOrders', JSON.stringify(orders));
}

// 顯示成功模態框
function showSuccessModal(order) {
    $('#order-number').text(order.id);
    
    // 計算預計送達日期
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (order.shipping.method === '快速配送' ? 2 : 5));
    const formattedDate = deliveryDate.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    $('#delivery-date').text(formattedDate);
    $('#success-modal').show();
}

// 前往訂單追蹤
function goToOrderTracking() {
    window.location.href = 'order-tracking.html';
}

// 返回首頁
function goToHome() {
    window.location.href = 'index.html';
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

// 初始化付款詳情顯示
updatePaymentDetails('credit-card');