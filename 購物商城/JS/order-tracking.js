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
let allOrders = [];
let filteredOrders = [];
let currentPage = 1;
const ordersPerPage = 5;

$(document).ready(function () {
    // 初始化主題
    const currentTheme = ThemeManager.init();
    
    // 更新界面顯示
    updateHeaderDisplay();
    
    // 檢查登入狀態
    if (ThemeManager.isLoggedIn()) {
        loadOrders();
        setupEventListeners();
    } else {
        showLoginPrompt();
    }
});

// 更新頭部顯示
function updateHeaderDisplay() {
    const $navLinks = $("#nav-links");
    const $loginPrompt = $("#login-prompt");
    const $orderTrackingContent = $("#order-tracking-content");

    if (ThemeManager.isLoggedIn()) {
        // 已登入，顯示完整導航
        $navLinks.html(`
            <a href="index.html"><i class="fas fa-store"></i> 玩具瀏覽</a>
                <a href="wishlist.html"><i class="fas fa-heart"></i> 願望清單</a>
                <a href="checkout.html"><i class="fas fa-shopping-cart"></i> 結帳</a>
                <a href="order-tracking.html" class="active"><i class="fas fa-clipboard-list"></i> 我的訂單</a>
                <a href="customer-profile.html"><i class="fas fa-user"></i> 個人資料</a>
                <a href="custom-toy-design.html"><i class="fas fa-cog"></i> 自訂玩具設計</a>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> 登出
                </button>
        `);
        $loginPrompt.hide();
        $orderTrackingContent.show();
    } 
}

// 顯示登入提示
function showLoginPrompt() {
    $("#login-prompt").show();
    $("#order-tracking-content").hide();
}

// 設置事件監聽器
function setupEventListeners() {
    // 搜索功能
    $("#order-search").on("input", debounce(filterOrders, 300));
    
    // 篩選功能
    $("#status-filter, #time-filter").on("change", filterOrders);
    
    // 加載更多
    $("#load-more-btn").on("click", loadMoreOrders);
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

// 加載訂單數據
function loadOrders() {
    // 從本地存儲獲取訂單數據
    const savedOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
    
    if (savedOrders.length > 0) {
        allOrders = savedOrders;
    } else {
        // 生成示例訂單數據
        allOrders = generateSampleOrders();
        localStorage.setItem('userOrders', JSON.stringify(allOrders));
    }
    
    // 按日期排序（最新的在前）
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    filterOrders();
    updateStats();
}

// 生成示例訂單數據
function generateSampleOrders() {
    const sampleOrders = [
        {
            id: "SS20241215001",
            date: "2024-12-15T10:30:00Z",
            status: "delivered",
            shipping: {
                name: "張小明",
                phone: "0912345678",
                email: "xiaoming@example.com",
                address: "台北市信義區信義路五段7號",
                city: "台北市",
                district: "信義區",
                postalCode: "110",
                method: "標準配送"
            },
            payment: {
                method: "信用卡/金融卡",
                details: "信用卡 **** 1234"
            },
            items: [
                {
                    id: 1,
                    name: "智能編程機器人",
                    price: 299,
                    category: "educational",
                    description: "培養孩子編程思維的智能機器人",
                    image: "robot",
                    quantity: 1
                },
                {
                    id: 2,
                    name: "創意積木套裝",
                    price: 199,
                    category: "creative",
                    description: "200片多彩積木，激發創造力",
                    image: "blocks",
                    quantity: 2
                }
            ],
            totals: {
                subtotal: 697,
                shipping: 0,
                discount: 0,
                total: 697
            },
            timeline: [
                {
                    status: "pending",
                    title: "訂單已建立",
                    date: "2024-12-15T10:30:00Z",
                    description: "您的訂單已成功建立"
                },
                {
                    status: "confirmed",
                    title: "訂單已確認",
                    date: "2024-12-15T11:15:00Z",
                    description: "訂單已確認，準備出貨"
                },
                {
                    status: "shipped",
                    title: "商品已發貨",
                    date: "2024-12-16T09:20:00Z",
                    description: "商品已從倉庫發出"
                },
                {
                    status: "delivered",
                    title: "訂單已完成",
                    date: "2024-12-18T14:30:00Z",
                    description: "商品已送達指定地址"
                }
            ]
        },
        {
            id: "SS20241212001",
            date: "2024-12-12T14:20:00Z",
            status: "shipped",
            shipping: {
                name: "李美華",
                phone: "0923456789",
                email: "meihua@example.com",
                address: "台中市西區公益路二段100號",
                city: "台中市",
                district: "西區",
                postalCode: "403",
                method: "快速配送"
            },
            payment: {
                method: "PayPal",
                details: "PayPal 付款"
            },
            items: [
                {
                    id: 3,
                    name: "遙控越野賽車",
                    price: 399,
                    category: "outdoor",
                    description: "四輪驅動遙控賽車，適合戶外",
                    image: "car",
                    quantity: 1
                }
            ],
            totals: {
                subtotal: 399,
                shipping: 50,
                discount: 0,
                total: 449
            },
            timeline: [
                {
                    status: "pending",
                    title: "訂單已建立",
                    date: "2024-12-12T14:20:00Z",
                    description: "您的訂單已成功建立"
                },
                {
                    status: "confirmed",
                    title: "訂單已確認",
                    date: "2024-12-12T15:05:00Z",
                    description: "訂單已確認，準備出貨"
                },
                {
                    status: "shipped",
                    title: "商品已發貨",
                    date: "2024-12-13T10:15:00Z",
                    description: "商品已從倉庫發出，預計2天內送達"
                }
            ]
        },
        {
            id: "SS20241210001",
            date: "2024-12-10T09:15:00Z",
            status: "confirmed",
            shipping: {
                name: "王大明",
                phone: "0934567890",
                email: "daming@example.com",
                address: "高雄市前金區中山二路500號",
                city: "高雄市",
                district: "前金區",
                postalCode: "801",
                method: "標準配送"
            },
            payment: {
                method: "銀行轉帳",
                details: "銀行轉帳付款"
            },
            items: [
                {
                    id: 4,
                    name: "電子繪圖板",
                    price: 259,
                    category: "electronic",
                    description: "兒童專用電子繪圖板",
                    image: "drawing",
                    quantity: 1
                },
                {
                    id: 5,
                    name: "戶外探險套裝",
                    price: 189,
                    category: "outdoor",
                    description: "包含望遠鏡、指南針等工具",
                    image: "adventure",
                    quantity: 1
                }
            ],
            totals: {
                subtotal: 448,
                shipping: 0,
                discount: 44,
                total: 404
            },
            timeline: [
                {
                    status: "pending",
                    title: "訂單已建立",
                    date: "2024-12-10T09:15:00Z",
                    description: "您的訂單已成功建立"
                },
                {
                    status: "confirmed",
                    title: "訂單已確認",
                    date: "2024-12-10T10:30:00Z",
                    description: "訂單已確認，準備出貨"
                }
            ]
        },
        {
            id: "SS20241205001",
            date: "2024-12-05T16:45:00Z",
            status: "pending",
            shipping: {
                name: "陳小玉",
                phone: "0945678901",
                email: "xiaoyu@example.com",
                address: "新北市板橋區文化路一段100號",
                city: "新北市",
                district: "板橋區",
                postalCode: "220",
                method: "標準配送"
            },
            payment: {
                method: "信用卡/金融卡",
                details: "信用卡 **** 5678"
            },
            items: [
                {
                    id: 6,
                    name: "科學實驗套裝",
                    price: 349,
                    category: "educational",
                    description: "30個有趣的科學實驗",
                    image: "science",
                    quantity: 1
                }
            ],
            totals: {
                subtotal: 349,
                shipping: 0,
                discount: 0,
                total: 349
            },
            timeline: [
                {
                    status: "pending",
                    title: "訂單已建立",
                    date: "2024-12-05T16:45:00Z",
                    description: "您的訂單已成功建立，等待確認"
                }
            ]
        }
    ];
    
    return sampleOrders;
}

// 篩選訂單
function filterOrders() {
    const searchTerm = $("#order-search").val().toLowerCase();
    const statusFilter = $("#status-filter").val();
    const timeFilter = $("#time-filter").val();
    
    filteredOrders = allOrders.filter(order => {
        // 搜索篩選
        if (searchTerm) {
            const matchesOrderId = order.id.toLowerCase().includes(searchTerm);
            const matchesProductName = order.items.some(item => 
                item.name.toLowerCase().includes(searchTerm)
            );
            if (!matchesOrderId && !matchesProductName) return false;
        }
        
        // 狀態篩選
        if (statusFilter && order.status !== statusFilter) return false;
        
        // 時間篩選
        if (timeFilter) {
            const orderDate = new Date(order.date);
            const now = new Date();
            let timeDiff;
            
            switch (timeFilter) {
                case "7days":
                    timeDiff = 7 * 24 * 60 * 60 * 1000;
                    break;
                case "30days":
                    timeDiff = 30 * 24 * 60 * 60 * 1000;
                    break;
                case "3months":
                    timeDiff = 90 * 24 * 60 * 60 * 1000;
                    break;
                case "6months":
                    timeDiff = 180 * 24 * 60 * 60 * 1000;
                    break;
                default:
                    timeDiff = 0;
            }
            
            if (orderDate < new Date(now - timeDiff)) return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    displayOrders();
    updateStats();
}

// 顯示訂單
function displayOrders() {
    const $ordersList = $("#orders-list");
    const $emptyState = $("#empty-state");
    const $loadMore = $("#load-more");
    
    if (filteredOrders.length === 0) {
        $ordersList.hide();
        $emptyState.show();
        $loadMore.hide();
        return;
    }
    
    $ordersList.show();
    $emptyState.hide();
    $ordersList.empty();
    
    const startIndex = 0;
    const endIndex = Math.min(currentPage * ordersPerPage, filteredOrders.length);
    const ordersToShow = filteredOrders.slice(startIndex, endIndex);
    
    ordersToShow.forEach(order => {
        const orderCard = createOrderCard(order);
        $ordersList.append(orderCard);
    });
    
    // 顯示加載更多按鈕
    if (endIndex < filteredOrders.length) {
        $loadMore.show();
    } else {
        $loadMore.hide();
    }
}

// 創建訂單卡片
function createOrderCard(order) {
    const statusText = getStatusText(order.status);
    const statusClass = `status-${order.status}`;
    const formattedDate = formatDate(order.date);
    const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // 生成商品預覽
    const itemsPreview = order.items.slice(0, 2).map(item => `
        <div class="order-item-preview">
            <div class="item-preview-image">
                <i class="${iconMap[item.image] || "fas fa-gift"}"></i>
            </div>
            <div class="item-preview-info">
                <div class="item-preview-name">${item.name}</div>
                <div class="item-preview-quantity">數量: ${item.quantity}</div>
            </div>
        </div>
    `).join('');
    
    // 如果商品超過2個，顯示更多提示
    const moreItems = order.items.length > 2 ? 
        `<div class="order-item-preview">
            <div class="item-preview-info">
                <div class="item-preview-name">和其他 ${order.items.length - 2} 件商品</div>
            </div>
        </div>` : '';
    
    return `
        <div class="order-card" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-info">
                    <div class="order-number">${order.id}</div>
                    <div class="order-date">${formattedDate} • ${itemsCount} 件商品</div>
                </div>
                <div class="order-status ${statusClass}">${statusText}</div>
            </div>
            <div class="order-body">
                <div class="order-items-preview">
                    ${itemsPreview}
                    ${moreItems}
                </div>
                <div class="order-totals">
                    <div class="order-amount">$${order.totals.total}</div>
                    <div class="order-actions">
                        <button class="btn-view" onclick="viewOrderDetail('${order.id}')">
                            <i class="fas fa-eye"></i> 查看詳情
                        </button>
                        <button class="btn-track" onclick="trackOrder('${order.id}')">
                            <i class="fas fa-map-marker-alt"></i> 追蹤訂單
                        </button>
                        ${order.status === 'delivered' ? `
                            <button class="btn-reorder" onclick="reorder('${order.id}')">
                                <i class="fas fa-redo"></i> 再次購買
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 加載更多訂單
function loadMoreOrders() {
    currentPage++;
    displayOrders();
}

// 更新統計數據
function updateStats() {
    const pendingCount = filteredOrders.filter(order => order.status === 'pending').length;
    const shippedCount = filteredOrders.filter(order => order.status === 'shipped').length;
    const deliveredCount = filteredOrders.filter(order => order.status === 'delivered').length;
    const totalCount = filteredOrders.length;
    
    $("#pending-count").text(pendingCount);
    $("#shipped-count").text(shippedCount);
    $("#delivered-count").text(deliveredCount);
    $("#total-count").text(totalCount);
}

// 查看訂單詳情
function viewOrderDetail(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modalContent = createOrderDetailContent(order);
    $("#order-detail-content").html(modalContent);
    $("#order-detail-modal").show();
}

// 創建訂單詳情內容
function createOrderDetailContent(order) {
    const statusText = getStatusText(order.status);
    const formattedDate = formatDate(order.date, true);
    
    // 商品列表
    const itemsList = order.items.map(item => `
        <div class="order-item-preview" style="margin-bottom: 1rem;">
            <div class="item-preview-image">
                <i class="${iconMap[item.image] || "fas fa-gift"}"></i>
            </div>
            <div class="item-preview-info" style="flex: 1;">
                <div class="item-preview-name">${item.name}</div>
                <div class="item-preview-quantity">數量: ${item.quantity} • 單價: $${item.price}</div>
                <div style="color: #718096; font-size: 0.9rem;">小計: $${item.price * item.quantity}</div>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="order-detail-section">
            <h3><i class="fas fa-info-circle"></i> 訂單資訊</h3>
            <div class="order-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">訂單編號</span>
                    <span class="detail-value">${order.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">訂單日期</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">訂單狀態</span>
                    <span class="detail-value" style="color: ${getStatusColor(order.status)}; font-weight: 600;">
                        ${statusText}
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">總金額</span>
                    <span class="detail-value" style="font-weight: 700; color: var(--primary-color);">$${order.totals.total}</span>
                </div>
            </div>
        </div>
        
        <div class="order-detail-section">
            <h3><i class="fas fa-truck"></i> 配送資訊</h3>
            <div class="order-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">收貨人</span>
                    <span class="detail-value">${order.shipping.name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">電話</span>
                    <span class="detail-value">${order.shipping.phone}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">電子郵件</span>
                    <span class="detail-value">${order.shipping.email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">配送地址</span>
                    <span class="detail-value">${order.shipping.city}${order.shipping.district}${order.shipping.address}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">配送方式</span>
                    <span class="detail-value">${order.shipping.method}</span>
                </div>
            </div>
        </div>
        
        <div class="order-detail-section">
            <h3><i class="fas fa-credit-card"></i> 付款資訊</h3>
            <div class="order-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">付款方式</span>
                    <span class="detail-value">${order.payment.method}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">付款詳情</span>
                    <span class="detail-value">${order.payment.details}</span>
                </div>
            </div>
        </div>
        
        <div class="order-detail-section">
            <h3><i class="fas fa-boxes"></i> 商品明細</h3>
            <div>
                ${itemsList}
            </div>
            <div style="border-top: 2px solid #e2e8f0; margin-top: 1rem; padding-top: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>商品小計:</span>
                    <span>$${order.totals.subtotal}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>運費:</span>
                    <span>$${order.totals.shipping}</span>
                </div>
                ${order.totals.discount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: var(--success-color);">
                    <span>折扣:</span>
                    <span>-$${order.totals.discount}</span>
                </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; border-top: 1px solid #e2e8f0; padding-top: 0.5rem;">
                    <span>總計:</span>
                    <span style="color: var(--primary-color);">$${order.totals.total}</span>
                </div>
            </div>
        </div>
        
        <div class="order-detail-section">
            <h3><i class="fas fa-history"></i> 訂單時間軸</h3>
            <div class="timeline">
                ${order.timeline.map((event, index) => {
                    const isCompleted = index < order.timeline.length - 1 || order.status === 'delivered';
                    const isCurrent = index === order.timeline.length - 1 && order.status !== 'delivered';
                    const eventClass = isCompleted ? 'completed' : isCurrent ? 'current' : '';
                    const eventDate = formatDate(event.date, true);
                    
                    return `
                        <div class="timeline-item ${eventClass}">
                            <div class="timeline-content">
                                <div class="timeline-title">${event.title}</div>
                                <div class="timeline-date">${eventDate}</div>
                                <div class="timeline-description">${event.description}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// 追蹤訂單
function trackOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    viewOrderDetail(orderId);
}

// 再次購買
function reorder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    // 將商品加入購物車或願望清單
    const selectedProducts = order.items.map(item => ({
        ...item,
        quantity: 1 // 重置數量為1
    }));
    
    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    
    showNotification(`已將 ${order.items.length} 件商品加入購物車`, 'success');
    
    // 可以跳轉到結帳頁面
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 1500);
}

// 關閉訂單模態框
function closeOrderModal() {
    $("#order-detail-modal").hide();
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

function getStatusColor(status) {
    const colorMap = {
        'pending': '#d69e2e',
        'confirmed': '#319795',
        'shipped': '#3182ce',
        'delivered': '#38a169',
        'cancelled': '#e53e3e'
    };
    return colorMap[status] || '#718096';
}

function formatDate(dateString, includeTime = false) {
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
        closeOrderModal();
    }
});