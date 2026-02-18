// JS/quotation-management.js

// 全局变量
let quotations = [];
let filteredQuotations = [];
let currentEditingQuotation = null;
let chartInstances = {};
let products = []; // 从产品管理加载

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeQuotationManagement();
    setupEventListeners();
    loadNavigation();
    loadStaffInfo();
});

// 初始化报价管理
function initializeQuotationManagement() {
    loadProducts();
    loadQuotations();
    initializeCharts();
    updateQuotationStats();
    loadCustomerOptions();
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    document.getElementById('quotation-search').addEventListener('input', debounce(filterQuotations, 300));
    
    // 筛选功能
    document.getElementById('status-filter').addEventListener('change', filterQuotations);
    document.getElementById('date-filter').addEventListener('change', filterQuotations);
    document.getElementById('salesperson-filter').addEventListener('change', filterQuotations);
}

// 加载导航
function loadNavigation() {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
        navLinks.innerHTML = `
            <a href="staff-profile.html" class="active"><i class="fas fa-user-cog"></i> 員工中心</a>
            <a href="login.html"> <button class="logout-btn" onclick="logout()">
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

// 加载产品数据
function loadProducts() {
    // 从本地存储获取产品数据或使用示例数据
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
    
    if (savedProducts.length > 0) {
        products = savedProducts;
    } else {
        // 生成示例产品数据
        products = generateSampleProducts();
    }
}

// 生成示例产品数据
function generateSampleProducts() {
    return [
        {
            id: 1,
            name: "智能編程機器人",
            price: 299,
            sku: "TOY001",
            category: "educational"
        },
        {
            id: 2,
            name: "創意積木套裝",
            price: 199,
            sku: "TOY002",
            category: "creative"
        },
        {
            id: 3,
            name: "遙控越野賽車",
            price: 399,
            sku: "TOY003",
            category: "outdoor"
        },
        {
            id: 4,
            name: "電子繪圖板",
            price: 259,
            sku: "TOY004",
            category: "electronic"
        },
        {
            id: 5,
            name: "戶外探險套裝",
            price: 189,
            sku: "TOY005",
            category: "outdoor"
        },
        {
            id: 6,
            name: "科學實驗套裝",
            price: 349,
            sku: "TOY006",
            category: "educational"
        }
    ];
}

// 加载客户选项
function loadCustomerOptions() {
    const customerSelect = document.getElementById('quotation-customer');
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = `${customer.name} (${customer.phone})`;
        customerSelect.appendChild(option);
    });
}

// 加载报价数据
function loadQuotations() {
    // 从本地存储获取报价数据或使用示例数据
    const savedQuotations = JSON.parse(localStorage.getItem('quotations')) || [];
    
    if (savedQuotations.length > 0) {
        quotations = savedQuotations;
    } else {
        // 生成示例报价数据
        quotations = generateSampleQuotations();
        localStorage.setItem('quotations', JSON.stringify(quotations));
    }
    
    filterQuotations();
}

// 生成示例报价数据
function generateSampleQuotations() {
    return [
        {
            id: "QT20241215001",
            customer: {
                id: "CUST001",
                name: "張小明",
                phone: "0912345678",
                email: "xiaoming@example.com"
            },
            salesperson: "張經理",
            status: "pending",
            items: [
                { productId: 1, name: "智能編程機器人", quantity: 2, unitPrice: 299, total: 598 },
                { productId: 2, name: "創意積木套裝", quantity: 1, unitPrice: 199, total: 199 }
            ],
            calculations: {
                subtotal: 797,
                discountPercent: 10,
                discountAmount: 79.7,
                shippingCost: 0,
                total: 717.3
            },
            paymentTerms: "net30",
            validity: "2024-12-31",
            notes: "客戶需要教育類玩具，可提供教學指導服務",
            createdDate: "2024-12-15T10:30:00Z",
            sentDate: "2024-12-15T11:00:00Z",
            expiresIn: 16
        },
        {
            id: "QT20241214001",
            customer: {
                id: "CUST002",
                name: "李美華",
                phone: "0923456789",
                email: "meihua@example.com"
            },
            salesperson: "李專員",
            status: "accepted",
            items: [
                { productId: 3, name: "遙控越野賽車", quantity: 1, unitPrice: 399, total: 399 }
            ],
            calculations: {
                subtotal: 399,
                discountPercent: 5,
                discountAmount: 19.95,
                shippingCost: 50,
                total: 429.05
            },
            paymentTerms: "advance50",
            validity: "2024-12-28",
            notes: "客戶要求週六配送，已確認可安排",
            createdDate: "2024-12-14T14:20:00Z",
            sentDate: "2024-12-14T15:00:00Z",
            acceptedDate: "2024-12-15T09:30:00Z",
            expiresIn: 13
        },
        {
            id: "QT20241213001",
            customer: {
                id: "CUST003",
                name: "王大明",
                phone: "0934567890",
                email: "daming@example.com"
            },
            salesperson: "王顧問",
            status: "sent",
            items: [
                { productId: 4, name: "電子繪圖板", quantity: 1, unitPrice: 259, total: 259 },
                { productId: 5, name: "戶外探險套裝", quantity: 1, unitPrice: 189, total: 189 }
            ],
            calculations: {
                subtotal: 448,
                discountPercent: 0,
                discountAmount: 0,
                shippingCost: 0,
                total: 448
            },
            paymentTerms: "net15",
            validity: "2024-12-27",
            notes: "客戶對藝術和探險類玩具有興趣",
            createdDate: "2024-12-13T09:15:00Z",
            sentDate: "2024-12-13T10:00:00Z",
            expiresIn: 12
        },
        {
            id: "QT20241212001",
            customer: {
                id: "CUST008",
                name: "吳曉芬",
                phone: "0989012345",
                email: "xiaofen@example.com"
            },
            salesperson: "張經理",
            status: "draft",
            items: [
                { productId: 6, name: "科學實驗套裝", quantity: 3, unitPrice: 349, total: 1047 }
            ],
            calculations: {
                subtotal: 1047,
                discountPercent: 15,
                discountAmount: 157.05,
                shippingCost: 0,
                total: 889.95
            },
            paymentTerms: "net30",
            validity: "2024-12-26",
            notes: "VIP客戶，需提供專屬折扣",
            createdDate: "2024-12-12T16:45:00Z",
            expiresIn: 11
        },
        {
            id: "QT20241210001",
            customer: {
                id: "CUST004",
                name: "陳小玉",
                phone: "0945678901",
                email: "xiaoyu@example.com"
            },
            salesperson: "李專員",
            status: "rejected",
            items: [
                { productId: 1, name: "智能編程機器人", quantity: 1, unitPrice: 299, total: 299 }
            ],
            calculations: {
                subtotal: 299,
                discountPercent: 0,
                discountAmount: 0,
                shippingCost: 0,
                total: 299
            },
            paymentTerms: "net30",
            validity: "2024-12-24",
            notes: "客戶認為價格過高，已提供替代方案",
            createdDate: "2024-12-10T11:20:00Z",
            sentDate: "2024-12-10T12:00:00Z",
            rejectedDate: "2024-12-11T14:30:00Z",
            rejectionReason: "價格超出預算",
            expiresIn: 9
        },
        {
            id: "QT20241205001",
            customer: {
                id: "CUST005",
                name: "林志明",
                phone: "0956789012",
                email: "zhiming@example.com"
            },
            salesperson: "王顧問",
            status: "expired",
            items: [
                { productId: 2, name: "創意積木套裝", quantity: 2, unitPrice: 199, total: 398 },
                { productId: 5, name: "戶外探險套裝", quantity: 1, unitPrice: 189, total: 189 }
            ],
            calculations: {
                subtotal: 587,
                discountPercent: 8,
                discountAmount: 46.96,
                shippingCost: 50,
                total: 590.04
            },
            paymentTerms: "net15",
            validity: "2024-12-19",
            notes: "客戶未在有效期內回覆",
            createdDate: "2024-12-05T14:30:00Z",
            sentDate: "2024-12-05T15:00:00Z",
            expiresIn: -2
        }
    ];
}

// 筛选报价
function filterQuotations() {
    const searchTerm = document.getElementById('quotation-search').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    const salespersonFilter = document.getElementById('salesperson-filter').value;
    
    filteredQuotations = quotations.filter(quotation => {
        // 搜索筛选
        if (searchTerm) {
            const matchesQuotationId = quotation.id.toLowerCase().includes(searchTerm);
            const matchesCustomer = quotation.customer.name.toLowerCase().includes(searchTerm);
            if (!matchesQuotationId && !matchesCustomer) return false;
        }
        
        // 状态筛选
        if (statusFilter && quotation.status !== statusFilter) return false;
        
        // 时间筛选
        if (dateFilter) {
            const createdDate = new Date(quotation.createdDate);
            const now = new Date();
            
            switch (dateFilter) {
                case "today":
                    if (createdDate.toDateString() !== now.toDateString()) return false;
                    break;
                case "week":
                    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
                    if (createdDate < weekAgo) return false;
                    break;
                case "month":
                    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
                    if (createdDate < monthAgo) return false;
                    break;
                case "expiring":
                    if (quotation.expiresIn > 3 || quotation.expiresIn < 0) return false;
                    break;
            }
        }
        
        // 销售人员筛选
        if (salespersonFilter && quotation.salesperson !== salespersonFilter) return false;
        
        return true;
    });
    
    displayQuotations();
    updateQuotationCount();
    updateCharts();
}

// 显示报价
function displayQuotations() {
    const tbody = document.getElementById('quotations-table');
    
    if (filteredQuotations.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem; color: #718096;">
                    <i class="fas fa-file-invoice-dollar" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    沒有找到符合條件的報價
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredQuotations.map(quotation => {
        const statusText = getQuotationStatusText(quotation.status);
        const statusClass = `status-${quotation.status}`;
        const createdDate = formatDate(quotation.createdDate);
        const validityDate = formatDate(quotation.validity);
        const itemsCount = quotation.items.length;
        const mainItem = quotation.items[0]?.name || '無項目';
        
        let statusIndicator = '';
        if (quotation.expiresIn <= 3 && quotation.expiresIn > 0) {
            statusIndicator = '<i class="fas fa-exclamation-triangle" style="color: #d69e2e; margin-left: 0.5rem;"></i>';
        } else if (quotation.expiresIn < 0) {
            statusIndicator = '<i class="fas fa-clock" style="color: #718096; margin-left: 0.5rem;"></i>';
        }
        
        return `
            <tr>
                <td style="font-weight: 600;">${quotation.id}</td>
                <td>
                    <div style="font-weight: 600;">${quotation.customer.name}</div>
                    <div style="font-size: 0.8rem; color: #718096;">${quotation.customer.phone}</div>
                </td>
                <td>${quotation.salesperson}</td>
                <td>
                    <div>${mainItem}</div>
                    <div style="font-size: 0.8rem; color: #718096;">
                        ${itemsCount} 個項目
                        ${itemsCount > 1 ? ` +${itemsCount - 1} 其他` : ''}
                    </div>
                </td>
                <td style="font-weight: 700; color: var(--primary-color);">$${quotation.calculations.total}</td>
                <td>
                    <div>${validityDate}</div>
                    <div style="font-size: 0.8rem; color: #718096;">
                        ${quotation.expiresIn > 0 ? `剩 ${quotation.expiresIn} 天` : '已過期'}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${statusText}
                        ${statusIndicator}
                    </span>
                </td>
                <td>${createdDate}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="action-btn view" onclick="viewQuotationDetail('${quotation.id}')">
                            <i class="fas fa-eye"></i> 查看
                        </button>
                        ${getQuotationActionButtons(quotation)}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 获取报价操作按钮
function getQuotationActionButtons(quotation) {
    let buttons = '';
    
    if (quotation.status === 'draft') {
        buttons += `
            <button class="action-btn edit" onclick="editQuotation('${quotation.id}')">
                <i class="fas fa-edit"></i> 編輯
            </button>
            <button class="action-btn send" onclick="sendQuotation('${quotation.id}')">
                <i class="fas fa-paper-plane"></i> 發送
            </button>
        `;
    } else if (quotation.status === 'sent' || quotation.status === 'pending') {
        buttons += `
            <button class="action-btn duplicate" onclick="duplicateQuotation('${quotation.id}')">
                <i class="fas fa-copy"></i> 複製
            </button>
        `;
    } else if (quotation.status === 'expired') {
        buttons += `
            <button class="action-btn edit" onclick="renewQuotation('${quotation.id}')">
                <i class="fas fa-redo"></i> 更新
            </button>
        `;
    }
    
    return buttons;
}

// 初始化图表
function initializeCharts() {
    // 销毁现有图表实例
    Object.values(chartInstances).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    chartInstances = {};
    
    // 初始化状态分布图
    initStatusChart();
    
    // 初始化月度趋势图
    initTrendChart();
    
    // 初始化销售人员绩效图
    initPerformanceChart();
    
    // 初始化转换率图
    initConversionChart();
}

// 初始化状态分布图
function initStatusChart() {
    const ctx = document.getElementById('status-chart').getContext('2d');
    
    const data = getStatusDistributionData();
    
    chartInstances.status = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '60%'
        }
    });
}

// 初始化月度趋势图
function initTrendChart() {
    const ctx = document.getElementById('trend-chart').getContext('2d');
    
    const data = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        datasets: [
            {
                label: '報價數量',
                data: [45, 52, 48, 65, 72, 68, 75, 82, 78, 85, 92, 88],
                borderColor: '#b684e2',
                backgroundColor: 'rgba(182, 132, 226, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            },
            {
                label: '接受數量',
                data: [12, 15, 14, 18, 22, 20, 25, 28, 26, 30, 32, 35],
                borderColor: '#38a169',
                backgroundColor: 'rgba(56, 161, 105, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }
        ]
    };
    
    chartInstances.trend = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 初始化销售人员绩效图
function initPerformanceChart() {
    const ctx = document.getElementById('performance-chart').getContext('2d');
    
    const data = {
        labels: ['張經理', '李專員', '王顧問'],
        datasets: [{
            label: '報價金額',
            data: [12500, 8900, 6700],
            backgroundColor: [
                '#b684e2',
                '#a928e6',
                '#8e44ad'
            ],
            borderWidth: 0
        }]
    };
    
    chartInstances.performance = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 初始化转换率图
function initConversionChart() {
    const ctx = document.getElementById('conversion-chart').getContext('2d');
    
    const data = {
        labels: ['已接受', '已拒絕', '待回覆', '已過期'],
        datasets: [{
            data: [35, 25, 20, 20],
            backgroundColor: [
                '#38a169',
                '#e53e3e',
                '#d69e2e',
                '#718096'
            ],
            borderWidth: 0
        }]
    };
    
    chartInstances.conversion = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// 获取状态分布数据
function getStatusDistributionData() {
    const statusCount = {
        draft: filteredQuotations.filter(q => q.status === 'draft').length,
        sent: filteredQuotations.filter(q => q.status === 'sent').length,
        pending: filteredQuotations.filter(q => q.status === 'pending').length,
        accepted: filteredQuotations.filter(q => q.status === 'accepted').length,
        rejected: filteredQuotations.filter(q => q.status === 'rejected').length,
        expired: filteredQuotations.filter(q => q.status === 'expired').length
    };
    
    return {
        labels: ['草稿', '已發送', '待確認', '已接受', '已拒絕', '已過期'],
        datasets: [{
            data: [
                statusCount.draft,
                statusCount.sent,
                statusCount.pending,
                statusCount.accepted,
                statusCount.rejected,
                statusCount.expired
            ],
            backgroundColor: [
                '#f7fafc',
                '#ebf8ff',
                '#fef5e7',
                '#f0fff4',
                '#fed7d7',
                '#e2e8f0'
            ],
            borderWidth: 0
        }]
    };
}

// 更新图表数据
function updateCharts() {
    if (chartInstances.status) {
        chartInstances.status.data = getStatusDistributionData();
        chartInstances.status.update();
    }
}

// 更新报价统计
function updateQuotationStats() {
    const totalQuotations = quotations.length;
    const pendingCount = quotations.filter(q => q.status === 'pending' || q.status === 'sent').length;
    const acceptedCount = quotations.filter(q => q.status === 'accepted').length;
    
    // 计算转换率
    const sentQuotations = quotations.filter(q => q.status === 'accepted' || q.status === 'rejected' || q.status === 'expired').length;
    const conversionRate = sentQuotations > 0 ? Math.round((acceptedCount / sentQuotations) * 100) : 0;
    
    // 计算即将到期的报价
    const expiringCount = quotations.filter(q => q.expiresIn <= 3 && q.expiresIn > 0 && (q.status === 'sent' || q.status === 'pending')).length;
    
    document.getElementById('total-quotations').textContent = totalQuotations;
    document.getElementById('pending-count').textContent = pendingCount;
    document.getElementById('accepted-count').textContent = acceptedCount;
    document.getElementById('conversion-rate').textContent = `${conversionRate}%`;
    
    // 更新快速统计
    document.getElementById('pending-quotations').textContent = pendingCount;
    document.getElementById('expiring-quotations').textContent = expiringCount;
}

// 更新报价计数
function updateQuotationCount() {
    document.getElementById('quotation-count').textContent = `共 ${filteredQuotations.length} 筆報價`;
}

// 查看报价详情
function viewQuotationDetail(quotationId) {
    const quotation = quotations.find(q => q.id === quotationId);
    if (!quotation) return;
    
    currentEditingQuotation = quotationId;
    const modal = document.getElementById('quotation-detail-modal');
    const content = document.getElementById('quotation-detail-content');
    const actionBtn = document.getElementById('quotation-action-btn');
    
    document.getElementById('quotation-detail-title').textContent = `報價詳情 - ${quotation.id}`;
    
    // 根据报价状态设置操作按钮
    let actionText = '';
    let actionHandler = '';
    
    switch (quotation.status) {
        case 'draft':
            actionText = '編輯報價';
            actionHandler = 'editQuotation';
            break;
        case 'sent':
        case 'pending':
            actionText = '發送提醒';
            actionHandler = 'sendReminder';
            break;
        case 'expired':
            actionText = '更新報價';
            actionHandler = 'renewQuotation';
            break;
        default:
            actionText = '複製報價';
            actionHandler = 'duplicateQuotation';
    }
    
    actionBtn.innerHTML = `<i class="fas fa-cog"></i> ${actionText}`;
    actionBtn.onclick = function() { window[actionHandler](quotationId); };
    
    content.innerHTML = createQuotationDetailContent(quotation);
    modal.style.display = 'flex';
}

// 创建报价详情内容
function createQuotationDetailContent(quotation) {
    const statusText = getQuotationStatusText(quotation.status);
    const paymentTermsText = getPaymentTermsText(quotation.paymentTerms);
    const createdDate = formatDate(quotation.createdDate, true);
    const sentDate = quotation.sentDate ? formatDate(quotation.sentDate, true) : '未發送';
    const validityDate = formatDate(quotation.validity);
    const acceptedDate = quotation.acceptedDate ? formatDate(quotation.acceptedDate, true) : '-';
    const rejectedDate = quotation.rejectedDate ? formatDate(quotation.rejectedDate, true) : '-';
    
    return `
        <div class="quotation-detail-section">
            <h4><i class="fas fa-info-circle"></i> 基本資訊</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">報價單號</span>
                    <span class="detail-value">${quotation.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">報價狀態</span>
                    <span class="detail-value"><span class="status-badge status-${quotation.status}">${statusText}</span></span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">客戶姓名</span>
                    <span class="detail-value">${quotation.customer.name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">聯絡電話</span>
                    <span class="detail-value">${quotation.customer.phone}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">電子郵件</span>
                    <span class="detail-value">${quotation.customer.email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">銷售人員</span>
                    <span class="detail-value">${quotation.salesperson}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">建立日期</span>
                    <span class="detail-value">${createdDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">發送日期</span>
                    <span class="detail-value">${sentDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">有效期限</span>
                    <span class="detail-value">${validityDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">付款條件</span>
                    <span class="detail-value">${paymentTermsText}</span>
                </div>
                ${quotation.status === 'accepted' ? `
                <div class="detail-item">
                    <span class="detail-label">接受日期</span>
                    <span class="detail-value">${acceptedDate}</span>
                </div>
                ` : ''}
                ${quotation.status === 'rejected' ? `
                <div class="detail-item">
                    <span class="detail-label">拒絕日期</span>
                    <span class="detail-value">${rejectedDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">拒絕原因</span>
                    <span class="detail-value">${quotation.rejectionReason || '未提供原因'}</span>
                </div>
                ` : ''}
            </div>
        </div>
        
        <div class="quotation-detail-section">
            <h4><i class="fas fa-list"></i> 報價項目</h4>
            <table class="quotation-items-table">
                <thead>
                    <tr>
                        <th>商品名稱</th>
                        <th>數量</th>
                        <th>單價</th>
                        <th>小計</th>
                    </tr>
                </thead>
                <tbody>
                    ${quotation.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.unitPrice}</td>
                            <td>$${item.total}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr class="items-total">
                        <td colspan="3" style="text-align: right;">商品小計</td>
                        <td>$${quotation.calculations.subtotal}</td>
                    </tr>
                    ${quotation.calculations.discountAmount > 0 ? `
                    <tr class="items-total">
                        <td colspan="3" style="text-align: right;">折扣 (${quotation.calculations.discountPercent}%)</td>
                        <td style="color: var(--success-color);">-$${quotation.calculations.discountAmount}</td>
                    </tr>
                    ` : ''}
                    ${quotation.calculations.shippingCost > 0 ? `
                    <tr class="items-total">
                        <td colspan="3" style="text-align: right;">運費</td>
                        <td>$${quotation.calculations.shippingCost}</td>
                    </tr>
                    ` : ''}
                    <tr class="items-total">
                        <td colspan="3" style="text-align: right; font-weight: 700;">總計</td>
                        <td style="font-weight: 700; color: var(--primary-color);">$${quotation.calculations.total}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        
        ${quotation.notes ? `
        <div class="quotation-detail-section">
            <h4><i class="fas fa-sticky-note"></i> 備註</h4>
            <p>${quotation.notes}</p>
        </div>
        ` : ''}
    `;
}

// 创建新报价
function createNewQuotation() {
    currentEditingQuotation = null;
    document.getElementById('edit-quotation-title').textContent = '新增報價單';
    
    // 重置表单
    document.getElementById('quotation-form').reset();
    document.getElementById('quotation-items-list').innerHTML = '';
    document.getElementById('quotation-validity').value = getDefaultValidityDate();
    
    // 添加一个空的报价项目
    addQuotationItem();
    
    // 更新计算
    updateCalculations();
    
    document.getElementById('edit-quotation-modal').style.display = 'flex';
}

// 编辑报价
function editQuotation(quotationId) {
    const quotation = quotations.find(q => q.id === quotationId);
    if (!quotation) return;
    
    currentEditingQuotation = quotationId;
    document.getElementById('edit-quotation-title').textContent = `編輯報價單 - ${quotation.id}`;
    
    // 填充表单数据
    document.getElementById('quotation-customer').value = quotation.customer.id;
    document.getElementById('quotation-salesperson').value = quotation.salesperson;
    document.getElementById('quotation-validity').value = quotation.validity;
    document.getElementById('quotation-payment-terms').value = quotation.paymentTerms;
    document.getElementById('quotation-notes').value = quotation.notes || '';
    
    // 填充报价项目
    const itemsList = document.getElementById('quotation-items-list');
    itemsList.innerHTML = '';
    
    quotation.items.forEach((item, index) => {
        const itemHtml = createQuotationItemHtml(index, item);
        itemsList.innerHTML += itemHtml;
    });
    
    // 填充计算数据
    document.getElementById('discount-percent').value = quotation.calculations.discountPercent;
    document.getElementById('shipping-cost').value = quotation.calculations.shippingCost;
    
    updateCalculations();
    
    document.getElementById('edit-quotation-modal').style.display = 'flex';
}

// 添加报价项目
function addQuotationItem(itemData = null) {
    const itemsList = document.getElementById('quotation-items-list');
    const itemCount = itemsList.children.length;
    const itemHtml = createQuotationItemHtml(itemCount, itemData);
    itemsList.innerHTML += itemHtml;
    updateCalculations();
}

// 创建报价项目HTML
function createQuotationItemHtml(index, itemData = null) {
    const productOptions = products.map(product => 
        `<option value="${product.id}" ${itemData && itemData.productId === product.id ? 'selected' : ''}>
            ${product.name} - $${product.price}
        </option>`
    ).join('');
    
    return `
        <div class="quotation-item" data-index="${index}">
            <div class="form-group">
                <select class="form-select product-select" onchange="updateProductPrice(this, ${index})" required>
                    <option value="">選擇商品</option>
                    ${productOptions}
                </select>
            </div>
            <div class="form-group">
                <input type="number" class="form-input quantity-input" min="1" value="${itemData ? itemData.quantity : 1}" 
                       onchange="updateItemTotal(${index})" required>
            </div>
            <div class="form-group">
                <input type="number" class="form-input price-input" min="0" step="0.01" 
                       value="${itemData ? itemData.unitPrice : 0}" onchange="updateItemTotal(${index})" required>
            </div>
            <div class="form-group">
                <input type="text" class="form-input total-input" value="${itemData ? itemData.total : 0}" readonly>
            </div>
            <button type="button" class="remove-item-btn" onclick="removeQuotationItem(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

// 移除报价项目
function removeQuotationItem(index) {
    const itemElement = document.querySelector(`.quotation-item[data-index="${index}"]`);
    if (itemElement) {
        itemElement.remove();
        updateCalculations();
    }
}

// 更新产品价格
function updateProductPrice(selectElement, index) {
    const productId = selectElement.value;
    const product = products.find(p => p.id == productId);
    
    if (product) {
        const priceInput = document.querySelector(`.quotation-item[data-index="${index}"] .price-input`);
        priceInput.value = product.price;
        updateItemTotal(index);
    }
}

// 更新项目总计
function updateItemTotal(index) {
    const itemElement = document.querySelector(`.quotation-item[data-index="${index}"]`);
    const quantity = parseInt(itemElement.querySelector('.quantity-input').value) || 0;
    const price = parseFloat(itemElement.querySelector('.price-input').value) || 0;
    const total = quantity * price;
    
    itemElement.querySelector('.total-input').value = total.toFixed(2);
    updateCalculations();
}

// 更新计算
function updateCalculations() {
    const items = document.querySelectorAll('.quotation-item');
    let subtotal = 0;
    
    items.forEach(item => {
        const total = parseFloat(item.querySelector('.total-input').value) || 0;
        subtotal += total;
    });
    
    const discountPercent = parseInt(document.getElementById('discount-percent').value) || 0;
    const discountAmount = subtotal * (discountPercent / 100);
    const shippingCost = parseFloat(document.getElementById('shipping-cost').value) || 0;
    const total = subtotal - discountAmount + shippingCost;
    
    document.getElementById('subtotal-amount').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('discount-amount').textContent = `$${discountAmount.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
}

// 保存报价
function saveQuotation() {
    const form = document.getElementById('quotation-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // 收集报价项目数据
    const items = [];
    const itemElements = document.querySelectorAll('.quotation-item');
    
    itemElements.forEach(itemElement => {
        const productSelect = itemElement.querySelector('.product-select');
        const productId = productSelect.value;
        const product = products.find(p => p.id == productId);
        
        if (product) {
            const quantity = parseInt(itemElement.querySelector('.quantity-input').value);
            const unitPrice = parseFloat(itemElement.querySelector('.price-input').value);
            const total = quantity * unitPrice;
            
            items.push({
                productId: product.id,
                name: product.name,
                quantity: quantity,
                unitPrice: unitPrice,
                total: total
            });
        }
    });
    
    if (items.length === 0) {
        showNotification('請至少添加一個報價項目', 'warning');
        return;
    }
    
    const quotationData = {
        customer: {
            id: document.getElementById('quotation-customer').value,
            name: document.getElementById('quotation-customer').selectedOptions[0].text.split(' (')[0],
            phone: document.getElementById('quotation-customer').selectedOptions[0].text.match(/\(([^)]+)\)/)[1],
            email: '' // 这里应该从客户数据中获取
        },
        salesperson: document.getElementById('quotation-salesperson').value,
        status: 'draft',
        items: items,
        calculations: {
            subtotal: parseFloat(document.getElementById('subtotal-amount').textContent.replace('$', '')),
            discountPercent: parseInt(document.getElementById('discount-percent').value),
            discountAmount: parseFloat(document.getElementById('discount-amount').textContent.replace('$', '')),
            shippingCost: parseFloat(document.getElementById('shipping-cost').value),
            total: parseFloat(document.getElementById('total-amount').textContent.replace('$', ''))
        },
        paymentTerms: document.getElementById('quotation-payment-terms').value,
        validity: document.getElementById('quotation-validity').value,
        notes: document.getElementById('quotation-notes').value,
        createdDate: new Date().toISOString()
    };
    
    // 计算剩余天数
    const validityDate = new Date(quotationData.validity);
    const today = new Date();
    const diffTime = validityDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    quotationData.expiresIn = diffDays;
    
    if (currentEditingQuotation) {
        // 更新现有报价
        const index = quotations.findIndex(q => q.id === currentEditingQuotation);
        if (index !== -1) {
            quotations[index] = { ...quotations[index], ...quotationData };
        }
    } else {
        // 新增报价
        const newId = generateQuotationId();
        quotationData.id = newId;
        quotations.push(quotationData);
    }
    
    // 保存到本地存储
    localStorage.setItem('quotations', JSON.stringify(quotations));
    
    // 更新UI
    filterQuotations();
    updateQuotationStats();
    closeEditQuotationModal();
    
    showNotification(currentEditingQuotation ? '報價更新成功！' : '報價新增成功！', 'success');
}

// 保存并发送报价
function saveAndSendQuotation() {
    saveQuotation();
    
    if (currentEditingQuotation) {
        // 稍等保存完成后再发送
        setTimeout(() => {
            sendQuotation(currentEditingQuotation);
        }, 100);
    }
}

// 发送报价
function sendQuotation(quotationId) {
    const quotation = quotations.find(q => q.id === quotationId);
    if (!quotation) return;
    
    // 填充发送表单
    document.getElementById('customer-email').value = quotation.customer.email || '';
    document.getElementById('customer-phone').value = quotation.customer.phone;
    
    currentEditingQuotation = quotationId;
    document.getElementById('send-quotation-modal').style.display = 'flex';
}

// 确认发送报价
function confirmSendQuotation() {
    const form = document.getElementById('send-quotation-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const quotation = quotations.find(q => q.id === currentEditingQuotation);
    if (quotation) {
        quotation.status = 'sent';
        quotation.sentDate = new Date().toISOString();
        
        localStorage.setItem('quotations', JSON.stringify(quotations));
        filterQuotations();
        updateQuotationStats();
        
        closeSendQuotationModal();
        closeEditQuotationModal();
        
        showNotification('報價已發送給客戶', 'success');
    }
}

// 复制报价
function duplicateQuotation(quotationId) {
    const quotation = quotations.find(q => q.id === quotationId);
    if (!quotation) return;
    
    const newQuotation = JSON.parse(JSON.stringify(quotation));
    newQuotation.id = generateQuotationId();
    newQuotation.status = 'draft';
    newQuotation.createdDate = new Date().toISOString();
    newQuotation.sentDate = null;
    newQuotation.acceptedDate = null;
    newQuotation.rejectedDate = null;
    newQuotation.rejectionReason = null;
    
    // 更新有效期
    newQuotation.validity = getDefaultValidityDate();
    const validityDate = new Date(newQuotation.validity);
    const today = new Date();
    const diffTime = validityDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    newQuotation.expiresIn = diffDays;
    
    quotations.push(newQuotation);
    localStorage.setItem('quotations', JSON.stringify(quotations));
    
    filterQuotations();
    updateQuotationStats();
    showNotification('報價已複製成功', 'success');
}

// 更新报价
function renewQuotation(quotationId) {
    const quotation = quotations.find(q => q.id === quotationId);
    if (!quotation) return;
    
    quotation.status = 'draft';
    quotation.validity = getDefaultValidityDate();
    
    const validityDate = new Date(quotation.validity);
    const today = new Date();
    const diffTime = validityDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    quotation.expiresIn = diffDays;
    
    localStorage.setItem('quotations', JSON.stringify(quotations));
    filterQuotations();
    updateQuotationStats();
    showNotification('報價已更新，現在可以重新編輯和發送', 'success');
}

// 发送提醒
function sendReminder(quotationId) {
    showNotification('提醒訊息已發送給客戶', 'info');
}

// 处理报价操作
function processQuotationAction() {
    // 这个函数由详情模态框的操作按钮调用
    // 具体操作在 viewQuotationDetail 中设置
}

// 导出报价
function exportQuotations() {
    showNotification('正在匯出報價報表...', 'info');
    setTimeout(() => {
        showNotification('報價報表匯出成功！', 'success');
    }, 2000);
}

// 刷新数据
function refreshData() {
    showNotification('正在更新數據...', 'info');
    setTimeout(() => {
        loadQuotations();
        updateQuotationStats();
        showNotification('數據更新完成！', 'success');
    }, 1000);
}

// 辅助函数
function getQuotationStatusText(status) {
    const statusMap = {
        'draft': '草稿',
        'sent': '已發送',
        'pending': '待客戶確認',
        'accepted': '已接受',
        'rejected': '已拒絕',
        'expired': '已過期'
    };
    return statusMap[status] || status;
}

function getPaymentTermsText(terms) {
    const termsMap = {
        'net15': '貨到付款',
        'net30': '月結30天',
        'net45': '月結45天',
        'advance50': '預付50%'
    };
    return termsMap[terms] || terms;
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

function getDefaultValidityDate() {
    const date = new Date();
    date.setDate(date.getDate() + 14); // 默认14天有效期
    return date.toISOString().split('T')[0];
}

function generateQuotationId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const count = quotations.filter(q => q.id.startsWith(`QT${year}${month}${day}`)).length + 1;
    return `QT${year}${month}${day}${String(count).padStart(3, '0')}`;
}

// 模态框控制
function closeQuotationModal() {
    document.getElementById('quotation-detail-modal').style.display = 'none';
    currentEditingQuotation = null;
}

function closeEditQuotationModal() {
    document.getElementById('edit-quotation-modal').style.display = 'none';
    currentEditingQuotation = null;
}

function closeSendQuotationModal() {
    document.getElementById('send-quotation-modal').style.display = 'none';
    document.getElementById('send-quotation-form').reset();
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').style.display = 'none';
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