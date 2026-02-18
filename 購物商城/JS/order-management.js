// JS/order-management.js

// 全局变量
let orders = [];
let returns = [];
let filteredOrders = [];
let selectedOrders = [];
let currentEditingOrder = null;
let currentEditingReturn = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeOrderManagement();
    setupEventListeners();
    loadNavigation();
    loadStaffInfo();
});

// 初始化订单管理
function initializeOrderManagement() {
    loadOrders();
    loadReturns();
    updateOrderStats();
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    document.getElementById('order-search').addEventListener('input', debounce(filterOrders, 300));
    
    // 筛选功能
    document.getElementById('status-filter').addEventListener('change', filterOrders);
    document.getElementById('date-filter').addEventListener('change', filterOrders);
    document.getElementById('payment-filter').addEventListener('change', filterOrders);
}

// 加载导航
function loadNavigation() {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
        navLinks.innerHTML = `
            <a href="staff-profile.html" class="active"><i class="fas fa-user-cog"></i> 員工中心</a>
            <a href="login.html"><button class="logout-btn" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> 登出
            </button>
        `;
    }
}

// 加载员工信息
function loadStaffInfo() {
    const staffData = JSON.parse(localStorage.getItem('currentStaff')) || {
        name: '張經理',
        role: '銷售經理',
        avatar: 'user-tie'
    };
    
    document.getElementById('staff-name').textContent = staffData.name;
}

// 加载订单数据
function loadOrders() {
    // 从本地存储获取订单数据或使用示例数据
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (savedOrders.length > 0) {
        orders = savedOrders;
    } else {
        // 生成示例订单数据
        orders = generateSampleOrders();
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    filterOrders();
}

// 生成示例订单数据
function generateSampleOrders() {
    return [
        {
            id: "SS20241215001",
            customer: {
                name: "張小明",
                phone: "0912345678",
                email: "xiaoming@example.com"
            },
            items: [
                { name: "智能編程機器人", sku: "TOY001", price: 299, quantity: 1 },
                { name: "創意積木套裝", sku: "TOY002", price: 199, quantity: 2 }
            ],
            totals: {
                subtotal: 697,
                shipping: 0,
                discount: 0,
                total: 697
            },
            shipping: {
                address: "台北市信義區信義路五段7號",
                method: "標準配送"
            },
            payment: {
                method: "信用卡",
                status: "paid",
                transactionId: "TXN001234"
            },
            status: "pending",
            date: "2024-12-15T10:30:00Z",
            notes: ""
        },
        {
            id: "SS20241214002",
            customer: {
                name: "李美華",
                phone: "0923456789",
                email: "meihua@example.com"
            },
            items: [
                { name: "遙控越野賽車", sku: "TOY003", price: 399, quantity: 1 }
            ],
            totals: {
                subtotal: 399,
                shipping: 50,
                discount: 0,
                total: 449
            },
            shipping: {
                address: "台中市西區公益路二段100號",
                method: "快速配送"
            },
            payment: {
                method: "PayPal",
                status: "paid",
                transactionId: "TXN001235"
            },
            status: "confirmed",
            date: "2024-12-14T14:20:00Z",
            notes: "客戶要求週六配送"
        },
        {
            id: "SS20241213003",
            customer: {
                name: "王大明",
                phone: "0934567890",
                email: "daming@example.com"
            },
            items: [
                { name: "電子繪圖板", sku: "TOY004", price: 259, quantity: 1 },
                { name: "戶外探險套裝", sku: "TOY005", price: 189, quantity: 1 }
            ],
            totals: {
                subtotal: 448,
                shipping: 0,
                discount: 44,
                total: 404
            },
            shipping: {
                address: "高雄市前金區中山二路500號",
                method: "標準配送"
            },
            payment: {
                method: "銀行轉帳",
                status: "paid",
                transactionId: "TXN001236"
            },
            status: "processing",
            date: "2024-12-13T09:15:00Z",
            notes: ""
        },
        {
            id: "SS20241212004",
            customer: {
                name: "陳小玉",
                phone: "0945678901",
                email: "xiaoyu@example.com"
            },
            items: [
                { name: "科學實驗套裝", sku: "TOY006", price: 349, quantity: 1 }
            ],
            totals: {
                subtotal: 349,
                shipping: 0,
                discount: 0,
                total: 349
            },
            shipping: {
                address: "新北市板橋區文化路一段100號",
                method: "標準配送"
            },
            payment: {
                method: "信用卡",
                status: "paid",
                transactionId: "TXN001237"
            },
            status: "shipped",
            date: "2024-12-12T16:45:00Z",
            shippingInfo: {
                company: "黑貓宅急便",
                trackingNumber: "1234567890",
                estimatedDelivery: "2024-12-15"
            },
            notes: ""
        },
        {
            id: "SS20241211005",
            customer: {
                name: "林志明",
                phone: "0956789012",
                email: "zhiming@example.com"
            },
            items: [
                { name: "智能遊戲機", sku: "TOY008", price: 599, quantity: 1 },
                { name: "3D立體拼圖", sku: "TOY007", price: 129, quantity: 1 }
            ],
            totals: {
                subtotal: 728,
                shipping: 0,
                discount: 50,
                total: 678
            },
            shipping: {
                address: "桃園市中壢區中央西路一段100號",
                method: "標準配送"
            },
            payment: {
                method: "信用卡",
                status: "pending",
                transactionId: ""
            },
            status: "pending",
            date: "2024-12-11T11:20:00Z",
            notes: "等待付款確認"
        }
    ];
}

// 加载退换货数据
function loadReturns() {
    // 从本地存储获取退换货数据或使用示例数据
    const savedReturns = JSON.parse(localStorage.getItem('returns')) || [];
    
    if (savedReturns.length > 0) {
        returns = savedReturns;
    } else {
        // 生成示例退换货数据
        returns = generateSampleReturns();
        localStorage.setItem('returns', JSON.stringify(returns));
    }
    
    displayReturns();
}

// 生成示例退换货数据
function generateSampleReturns() {
    return [
        {
            id: "RET20241215001",
            orderId: "SS20241212004",
            customer: {
                name: "陳小玉",
                phone: "0945678901",
                email: "xiaoyu@example.com"
            },
            items: [
                { name: "科學實驗套裝", sku: "TOY006", price: 349, quantity: 1 }
            ],
            type: "refund",
            reason: "商品與描述不符",
            description: "實際收到的商品與網站圖片有差異，部分零件缺失",
            status: "pending",
            date: "2024-12-15T14:30:00Z",
            images: []
        },
        {
            id: "RET20241214001",
            orderId: "SS20241213003",
            customer: {
                name: "王大明",
                phone: "0934567890",
                email: "daming@example.com"
            },
            items: [
                { name: "電子繪圖板", sku: "TOY004", price: 259, quantity: 1 }
            ],
            type: "exchange",
            reason: "商品損壞",
            description: "收到時螢幕有裂痕，無法正常使用",
            status: "processing",
            date: "2024-12-14T10:15:00Z",
            images: []
        }
    ];
}

// 筛选订单
function filterOrders() {
    const searchTerm = document.getElementById('order-search').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    const paymentFilter = document.getElementById('payment-filter').value;
    
    filteredOrders = orders.filter(order => {
        // 搜索筛选
        if (searchTerm) {
            const matchesOrderId = order.id.toLowerCase().includes(searchTerm);
            const matchesCustomer = order.customer.name.toLowerCase().includes(searchTerm);
            if (!matchesOrderId && !matchesCustomer) return false;
        }
        
        // 状态筛选
        if (statusFilter && order.status !== statusFilter) return false;
        
        // 时间筛选
        if (dateFilter) {
            const orderDate = new Date(order.date);
            const now = new Date();
            
            switch (dateFilter) {
                case "today":
                    if (orderDate.toDateString() !== now.toDateString()) return false;
                    break;
                case "week":
                    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
                    if (orderDate < weekAgo) return false;
                    break;
                case "month":
                    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
                    if (orderDate < monthAgo) return false;
                    break;
            }
        }
        
        // 付款状态筛选
        if (paymentFilter && order.payment.status !== paymentFilter) return false;
        
        return true;
    });
    
    displayOrders();
    updateOrderCount();
}

// 显示订单
function displayOrders() {
    const tbody = document.getElementById('orders-table');
    
    if (filteredOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem; color: #718096;">
                    <i class="fas fa-clipboard-list" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    沒有找到符合條件的訂單
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredOrders.map(order => {
        const statusText = getOrderStatusText(order.status);
        const statusClass = `status-${order.status}`;
        const paymentText = getPaymentStatusText(order.payment.status);
        const paymentClass = `status-${order.payment.status === 'paid' ? 'delivered' : 'pending'}`;
        const formattedDate = formatDate(order.date);
        const isSelected = selectedOrders.includes(order.id);
        
        return `
            <tr>
                <td>
                    <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleOrderSelection('${order.id}', this.checked)">
                </td>
                <td style="font-weight: 600;">${order.id}</td>
                <td>
                    <div>${order.customer.name}</div>
                    <div style="font-size: 0.8rem; color: #718096;">${order.customer.phone}</div>
                </td>
                <td>
                    <div>${order.items[0].name}</div>
                    <div style="font-size: 0.8rem; color: #718096;">
                        ${order.items.length} 件商品
                        ${order.items.length > 1 ? ` +${order.items.length - 1} 其他` : ''}
                    </div>
                </td>
                <td style="font-weight: 700; color: var(--primary-color);">$${order.totals.total}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td><span class="status-badge ${paymentClass}">${paymentText}</span></td>
                <td>${formattedDate}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="action-btn view" onclick="viewOrderDetail('${order.id}')">
                            <i class="fas fa-eye"></i> 查看
                        </button>
                        ${getOrderActionButton(order)}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 获取订单操作按钮
function getOrderActionButton(order) {
    switch (order.status) {
        case 'pending':
            return `
                <button class="action-btn process" onclick="confirmOrder('${order.id}')">
                    <i class="fas fa-check"></i> 確認
                </button>
                <button class="action-btn cancel" onclick="cancelOrder('${order.id}')">
                    <i class="fas fa-times"></i> 取消
                </button>
            `;
        case 'confirmed':
            return `
                <button class="action-btn process" onclick="processOrder('${order.id}')">
                    <i class="fas fa-cog"></i> 處理
                </button>
            `;
        case 'processing':
            return `
                <button class="action-btn ship" onclick="shipOrder('${order.id}')">
                    <i class="fas fa-truck"></i> 出貨
                </button>
            `;
        case 'shipped':
            return `
                <button class="action-btn process" onclick="completeOrder('${order.id}')">
                    <i class="fas fa-check-circle"></i> 完成
                </button>
            `;
        default:
            return '';
    }
}

// 显示退换货
function displayReturns() {
    const tbody = document.getElementById('returns-table');
    const pendingReturns = returns.filter(r => r.status === 'pending');
    
    document.getElementById('return-count-badge').textContent = `${pendingReturns.length} 個待處理申請`;
    
    if (returns.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem; color: #718096;">
                    <i class="fas fa-exchange-alt" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    暫無退換貨申請
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = returns.map(returnItem => {
        const typeText = returnItem.type === 'refund' ? '退款' : '換貨';
        const statusText = getReturnStatusText(returnItem.status);
        const statusClass = `status-${returnItem.status}`;
        const formattedDate = formatDate(returnItem.date);
        
        return `
            <tr>
                <td style="font-weight: 600;">${returnItem.id}</td>
                <td>${returnItem.orderId}</td>
                <td>${returnItem.customer.name}</td>
                <td>${returnItem.items[0].name}</td>
                <td><span class="status-badge ${returnItem.type === 'refund' ? 'status-refund' : 'status-exchange'}">${typeText}</span></td>
                <td>${returnItem.reason}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${formattedDate}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-btn view" onclick="viewReturnDetail('${returnItem.id}')">
                            <i class="fas fa-eye"></i> 查看
                        </button>
                        ${returnItem.status === 'pending' ? `
                        <button class="action-btn process" onclick="processReturnRequest('${returnItem.id}')">
                            <i class="fas fa-cog"></i> 處理
                        </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 更新订单统计
function updateOrderStats() {
    const totalOrders = orders.length;
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const shippingCount = orders.filter(o => o.status === 'shipped').length;
    const returnCount = returns.filter(r => r.status === 'pending').length;
    
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-count').textContent = pendingCount;
    document.getElementById('shipping-count').textContent = shippingCount;
    document.getElementById('return-count').textContent = returnCount;
    
    // 更新快速统计
    document.getElementById('pending-orders').textContent = pendingCount;
    document.getElementById('shipping-orders').textContent = shippingCount;
}

// 更新订单计数
function updateOrderCount() {
    document.getElementById('order-count').textContent = `共 ${filteredOrders.length} 筆訂單`;
}

// 查看订单详情
function viewOrderDetail(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    currentEditingOrder = orderId;
    const modal = document.getElementById('order-detail-modal');
    const content = document.getElementById('order-detail-content');
    const actionBtn = document.getElementById('order-action-btn');
    
    document.getElementById('order-detail-title').textContent = `訂單詳情 - ${order.id}`;
    
    // 根据订单状态设置操作按钮
    let actionText = '';
    let actionHandler = '';
    
    switch (order.status) {
        case 'pending':
            actionText = '確認訂單';
            actionHandler = 'confirmOrder';
            break;
        case 'confirmed':
            actionText = '開始處理';
            actionHandler = 'processOrder';
            break;
        case 'processing':
            actionText = '出貨處理';
            actionHandler = 'shipOrder';
            break;
        case 'shipped':
            actionText = '標記完成';
            actionHandler = 'completeOrder';
            break;
        default:
            actionText = '查看詳情';
            actionHandler = 'closeOrderModal';
    }
    
    actionBtn.innerHTML = `<i class="fas fa-cog"></i> ${actionText}`;
    actionBtn.onclick = function() { window[actionHandler](orderId); };
    
    content.innerHTML = createOrderDetailContent(order);
    modal.style.display = 'flex';
}

// 创建订单详情内容
function createOrderDetailContent(order) {
    const statusText = getOrderStatusText(order.status);
    const paymentText = getPaymentStatusText(order.payment.status);
    const formattedDate = formatDate(order.date, true);
    
    return `
        <div class="order-detail-section">
            <h4><i class="fas fa-info-circle"></i> 訂單資訊</h4>
            <div class="order-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">訂單編號</span>
                    <span class="detail-value">${order.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">訂單狀態</span>
                    <span class="detail-value"><span class="status-badge status-${order.status}">${statusText}</span></span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">訂單日期</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">付款狀態</span>
                    <span class="detail-value"><span class="status-badge status-${order.payment.status === 'paid' ? 'delivered' : 'pending'}">${paymentText}</span></span>
                </div>
            </div>
        </div>
        
        <div class="order-detail-section">
            <h4><i class="fas fa-user"></i> 客戶資訊</h4>
            <div class="order-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">客戶姓名</span>
                    <span class="detail-value">${order.customer.name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">聯絡電話</span>
                    <span class="detail-value">${order.customer.phone}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">電子郵件</span>
                    <span class="detail-value">${order.customer.email}</span>
                </div>
            </div>
        </div>
        
        <div class="order-detail-section">
            <h4><i class="fas fa-truck"></i> 配送資訊</h4>
            <div class="order-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">配送地址</span>
                    <span class="detail-value">${order.shipping.address}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">配送方式</span>
                    <span class="detail-value">${order.shipping.method}</span>
                </div>
                ${order.shippingInfo ? `
                <div class="detail-item">
                    <span class="detail-label">物流公司</span>
                    <span class="detail-value">${order.shippingInfo.company}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">運單號碼</span>
                    <span class="detail-value">${order.shippingInfo.trackingNumber}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">預計送達</span>
                    <span class="detail-value">${formatDate(order.shippingInfo.estimatedDelivery)}</span>
                </div>
                ` : ''}
            </div>
        </div>
        
        <div class="order-detail-section">
            <h4><i class="fas fa-boxes"></i> 商品明細</h4>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div class="item-image">
                            <i class="fas fa-gift"></i>
                        </div>
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-sku">SKU: ${item.sku}</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="item-price">$${item.price} x ${item.quantity}</div>
                            <div style="font-weight: 700; color: var(--primary-color);">$${item.price * item.quantity}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="border-top: 2px solid #e2e8f0; margin-top: 1rem; padding-top: 1rem;">
                <div class="detail-item">
                    <span class="detail-label">商品小計</span>
                    <span class="detail-value">$${order.totals.subtotal}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">運費</span>
                    <span class="detail-value">$${order.totals.shipping}</span>
                </div>
                ${order.totals.discount > 0 ? `
                <div class="detail-item">
                    <span class="detail-label">折扣</span>
                    <span class="detail-value" style="color: var(--success-color);">-$${order.totals.discount}</span>
                </div>
                ` : ''}
                <div class="detail-item" style="font-weight: 700; font-size: 1.1rem; border-top: 1px solid #e2e8f0; padding-top: 0.5rem;">
                    <span class="detail-label">總計</span>
                    <span class="detail-value" style="color: var(--primary-color);">$${order.totals.total}</span>
                </div>
            </div>
        </div>
        
        ${order.notes ? `
        <div class="order-detail-section">
            <h4><i class="fas fa-sticky-note"></i> 備註</h4>
            <p>${order.notes}</p>
        </div>
        ` : ''}
    `;
}

// 订单操作函数
function confirmOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order && order.status === 'pending') {
        order.status = 'confirmed';
        localStorage.setItem('orders', JSON.stringify(orders));
        filterOrders();
        updateOrderStats();
        closeOrderModal();
        showNotification('訂單已確認', 'success');
    }
}

function processOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order && order.status === 'confirmed') {
        order.status = 'processing';
        localStorage.setItem('orders', JSON.stringify(orders));
        filterOrders();
        updateOrderStats();
        closeOrderModal();
        showNotification('訂單處理中', 'success');
    }
}

function shipOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    currentEditingOrder = orderId;
    document.getElementById('shipping-order-id').value = orderId;
    document.getElementById('shipping-modal').style.display = 'flex';
}

function completeOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order && order.status === 'shipped') {
        order.status = 'delivered';
        localStorage.setItem('orders', JSON.stringify(orders));
        filterOrders();
        updateOrderStats();
        closeOrderModal();
        showNotification('訂單已完成', 'success');
    }
}

function cancelOrder(orderId) {
    if (confirm('確定要取消此訂單嗎？此操作無法復原。')) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'cancelled';
            localStorage.setItem('orders', JSON.stringify(orders));
            filterOrders();
            updateOrderStats();
            showNotification('訂單已取消', 'success');
        }
    }
}

// 出貨確認
function confirmShipping() {
    const form = document.getElementById('shipping-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const orderId = document.getElementById('shipping-order-id').value;
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        order.status = 'shipped';
        order.shippingInfo = {
            company: document.getElementById('shipping-company').value,
            trackingNumber: document.getElementById('tracking-number').value,
            estimatedDelivery: document.getElementById('estimated-delivery').value
        };
        
        localStorage.setItem('orders', JSON.stringify(orders));
        filterOrders();
        updateOrderStats();
        closeShippingModal();
        closeOrderModal();
        showNotification('訂單已出貨', 'success');
    }
}

// 退换货处理
function viewReturnDetail(returnId) {
    const returnItem = returns.find(r => r.id === returnId);
    if (!returnItem) return;
    
    currentEditingReturn = returnId;
    const modal = document.getElementById('return-modal');
    const content = document.getElementById('return-detail-content');
    
    document.getElementById('return-modal-title').textContent = `退換貨處理 - ${returnItem.id}`;
    
    content.innerHTML = createReturnDetailContent(returnItem);
    modal.style.display = 'flex';
}

function createReturnDetailContent(returnItem) {
    const typeText = returnItem.type === 'refund' ? '退款' : '換貨';
    const statusText = getReturnStatusText(returnItem.status);
    const formattedDate = formatDate(returnItem.date, true);
    
    return `
        <div class="order-detail-section">
            <h4><i class="fas fa-info-circle"></i> 申請資訊</h4>
            <div class="order-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">申請編號</span>
                    <span class="detail-value">${returnItem.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">原訂單編號</span>
                    <span class="detail-value">${returnItem.orderId}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">申請類型</span>
                    <span class="detail-value"><span class="status-badge ${returnItem.type === 'refund' ? 'status-refund' : 'status-exchange'}">${typeText}</span></span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">申請狀態</span>
                    <span class="detail-value"><span class="status-badge status-${returnItem.status}">${statusText}</span></span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">申請日期</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">申請原因</span>
                    <span class="detail-value">${returnItem.reason}</span>
                </div>
            </div>
        </div>
        
        <div class="order-detail-section">
            <h4><i class="fas fa-user"></i> 客戶資訊</h4>
            <div class="order-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">客戶姓名</span>
                    <span class="detail-value">${returnItem.customer.name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">聯絡電話</span>
                    <span class="detail-value">${returnItem.customer.phone}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">電子郵件</span>
                    <span class="detail-value">${returnItem.customer.email}</span>
                </div>
            </div>
        </div>
        
        <div class="order-detail-section">
            <h4><i class="fas fa-box"></i> 退換貨商品</h4>
            <div class="order-items">
                ${returnItem.items.map(item => `
                    <div class="order-item">
                        <div class="item-image">
                            <i class="fas fa-gift"></i>
                        </div>
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-sku">SKU: ${item.sku}</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="item-price">$${item.price} x ${item.quantity}</div>
                            <div style="font-weight: 700; color: var(--primary-color);">$${item.price * item.quantity}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="order-detail-section">
            <h4><i class="fas fa-file-alt"></i> 問題描述</h4>
            <p>${returnItem.description}</p>
        </div>
    `;
}

function processReturn() {
    const form = document.getElementById('return-action-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const returnId = currentEditingReturn;
    const returnItem = returns.find(r => r.id === returnId);
    const action = document.getElementById('return-action').value;
    
    if (returnItem) {
        returnItem.status = 'completed';
        returnItem.processedBy = document.getElementById('staff-name').textContent;
        returnItem.processedAt = new Date().toISOString();
        returnItem.processNotes = document.getElementById('return-notes').value;
        
        if (action === 'refund') {
            returnItem.refundAmount = parseFloat(document.getElementById('refund-amount').value) || returnItem.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        
        localStorage.setItem('returns', JSON.stringify(returns));
        displayReturns();
        updateOrderStats();
        closeReturnModal();
        showNotification('退換貨申請已處理', 'success');
    }
}

// 批量处理
function toggleSelectAll() {
    const selectAll = document.getElementById('select-all').checked;
    const checkboxes = document.querySelectorAll('#orders-table input[type="checkbox"]');
    
    selectedOrders = [];
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll;
        if (selectAll) {
            const orderId = checkbox.getAttribute('onchange').match(/'([^']+)'/)[1];
            selectedOrders.push(orderId);
        }
    });
    
    updateBatchCount();
}

function toggleOrderSelection(orderId, isSelected) {
    if (isSelected) {
        if (!selectedOrders.includes(orderId)) {
            selectedOrders.push(orderId);
        }
    } else {
        selectedOrders = selectedOrders.filter(id => id !== orderId);
        document.getElementById('select-all').checked = false;
    }
    
    updateBatchCount();
}

function updateBatchCount() {
    document.getElementById('batch-count').textContent = selectedOrders.length;
}

function batchProcess() {
    if (selectedOrders.length === 0) {
        showNotification('請先選擇要處理的訂單', 'warning');
        return;
    }
    
    document.getElementById('batch-modal').style.display = 'flex';
}

function confirmBatchAction() {
    const action = document.getElementById('batch-action').value;
    if (!action) {
        showNotification('請選擇處理操作', 'warning');
        return;
    }
    
    selectedOrders.forEach(orderId => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            switch (action) {
                case 'confirm':
                    if (order.status === 'pending') order.status = 'confirmed';
                    break;
                case 'ship':
                    if (order.status === 'processing') order.status = 'shipped';
                    break;
                case 'complete':
                    if (order.status === 'shipped') order.status = 'delivered';
                    break;
                case 'cancel':
                    order.status = 'cancelled';
                    break;
            }
        }
    });
    
    localStorage.setItem('orders', JSON.stringify(orders));
    filterOrders();
    updateOrderStats();
    closeBatchModal();
    showNotification(`已批量處理 ${selectedOrders.length} 筆訂單`, 'success');
    
    // 清空选择
    selectedOrders = [];
    document.getElementById('select-all').checked = false;
    document.querySelectorAll('#orders-table input[type="checkbox"]').forEach(cb => cb.checked = false);
}

// 辅助函数
function getOrderStatusText(status) {
    const statusMap = {
        'pending': '待處理',
        'confirmed': '已確認',
        'processing': '處理中',
        'shipped': '已發貨',
        'delivered': '已送達',
        'cancelled': '已取消'
    };
    return statusMap[status] || status;
}

function getPaymentStatusText(status) {
    const statusMap = {
        'paid': '已付款',
        'pending': '待付款',
        'failed': '付款失敗'
    };
    return statusMap[status] || status;
}

function getReturnStatusText(status) {
    const statusMap = {
        'pending': '待處理',
        'processing': '處理中',
        'completed': '已完成',
        'rejected': '已拒絕'
    };
    return statusMap[status] || status;
}

function formatDate(dateString, includeTime = false) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        ...(includeTime && { hour: '2-digit', minute: '2-digit' })
    };
    return date.toLocaleDateString('zh-TW', options);
}

// 模态框控制
function closeOrderModal() {
    document.getElementById('order-detail-modal').style.display = 'none';
    currentEditingOrder = null;
}

function closeShippingModal() {
    document.getElementById('shipping-modal').style.display = 'none';
    document.getElementById('shipping-form').reset();
}

function closeReturnModal() {
    document.getElementById('return-modal').style.display = 'none';
    currentEditingReturn = null;
    document.getElementById('return-action-form').reset();
}

function closeBatchModal() {
    document.getElementById('batch-modal').style.display = 'none';
    document.getElementById('batch-action').value = '';
}

// 其他功能
function exportOrders() {
    showNotification('正在匯出訂單報表...', 'info');
    setTimeout(() => {
        showNotification('訂單報表匯出成功！', 'success');
    }, 2000);
}

function refreshData() {
    showNotification('正在更新數據...', 'info');
    setTimeout(() => {
        loadOrders();
        loadReturns();
        showNotification('數據更新完成！', 'success');
    }, 1000);
}

// 防抖函数
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

// 显示通知
function showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.dashboard-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const bgColor = type === 'success' ? '#38a169' : 
                   type === 'warning' ? '#d69e2e' : 
                   type === 'error' ? '#e53e3e' : '#3182ce';
    
    const icon = type === 'success' ? 'check-circle' : 
                type === 'warning' ? 'exclamation-triangle' : 
                type === 'error' ? 'times-circle' : 'info-circle';
    
    const notification = document.createElement('div');
    notification.className = 'dashboard-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2001;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            min-width: 300px;
        ">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// 登出
function logout() {
    if (confirm('確定要登出嗎？')) {
        localStorage.removeItem('currentStaff');
        showNotification('已成功登出', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
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
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);