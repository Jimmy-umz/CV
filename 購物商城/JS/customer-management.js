// JS/customer-management.js

// 全局变量
let customers = [];
let filteredCustomers = [];
let currentEditingCustomer = null;
let chartInstances = {};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeCustomerManagement();
    setupEventListeners();
    loadNavigation();
    loadStaffInfo();
});

// 初始化客户管理
function initializeCustomerManagement() {
    loadCustomers();
    initializeCharts();
    updateCustomerStats();
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    document.getElementById('customer-search').addEventListener('input', debounce(filterCustomers, 300));
    
    // 筛选功能
    document.getElementById('tier-filter').addEventListener('change', filterCustomers);
    document.getElementById('status-filter').addEventListener('change', filterCustomers);
    document.getElementById('region-filter').addEventListener('change', filterCustomers);
    
    // 标签页切换
    document.querySelectorAll('.tab-header').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // 群发消息目标变化
    document.getElementById('message-target').addEventListener('change', updateRecipientCount);
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

// 加载客户数据
function loadCustomers() {
    // 从本地存储获取客户数据或使用示例数据
    const savedCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    
    if (savedCustomers.length > 0) {
        customers = savedCustomers;
    } else {
        // 生成示例客户数据
        customers = generateSampleCustomers();
        localStorage.setItem('customers', JSON.stringify(customers));
    }
    
    filterCustomers();
}

// 生成示例客户数据
function generateSampleCustomers() {
    return [
        {
            id: "CUST001",
            name: "張小明",
            phone: "0912345678",
            email: "xiaoming@example.com",
            address: "台北市信義區信義路五段7號",
            region: "north",
            tier: "vip",
            status: "active",
            joinDate: "2023-05-15T10:30:00Z",
            totalOrders: 12,
            totalSpent: 8560,
            avgOrderValue: 713,
            lastOrderDate: "2024-12-15T10:30:00Z",
            notes: [
                {
                    id: 1,
                    author: "張經理",
                    date: "2024-12-01T14:30:00Z",
                    content: "客戶對智能玩具特別感興趣，可推薦新上市的編程機器人"
                },
                {
                    id: 2,
                    author: "李專員",
                    date: "2024-11-20T11:15:00Z",
                    content: "詢問聖誕節促銷活動，已提供相關資訊"
                }
            ],
            serviceRecords: [
                {
                    id: 1,
                    type: "售前諮詢",
                    date: "2024-12-01T14:30:00Z",
                    staff: "張經理",
                    description: "客戶詢問兒童編程玩具的適合年齡和功能"
                },
                {
                    id: 2,
                    type: "售後服務",
                    date: "2024-11-20T11:15:00Z",
                    staff: "李專員",
                    description: "處理產品使用問題，遠端指導操作"
                }
            ]
        },
        {
            id: "CUST002",
            name: "李美華",
            phone: "0923456789",
            email: "meihua@example.com",
            address: "台中市西區公益路二段100號",
            region: "central",
            tier: "vip",
            status: "active",
            joinDate: "2023-08-22T14:20:00Z",
            totalOrders: 8,
            totalSpent: 5245,
            avgOrderValue: 656,
            lastOrderDate: "2024-12-14T14:20:00Z",
            notes: [
                {
                    id: 1,
                    author: "王顧問",
                    date: "2024-12-10T16:45:00Z",
                    content: "客戶偏好教育類玩具，有兩個孩子（5歲和8歲）"
                }
            ],
            serviceRecords: [
                {
                    id: 1,
                    type: "產品推薦",
                    date: "2024-12-10T16:45:00Z",
                    staff: "王顧問",
                    description: "根據孩子年齡推薦適合的科學實驗套裝"
                }
            ]
        },
        {
            id: "CUST003",
            name: "王大明",
            phone: "0934567890",
            email: "daming@example.com",
            address: "高雄市前金區中山二路500號",
            region: "south",
            tier: "regular",
            status: "active",
            joinDate: "2024-01-10T09:15:00Z",
            totalOrders: 5,
            totalSpent: 2890,
            avgOrderValue: 578,
            lastOrderDate: "2024-12-13T09:15:00Z",
            notes: [],
            serviceRecords: []
        },
        {
            id: "CUST004",
            name: "陳小玉",
            phone: "0945678901",
            email: "xiaoyu@example.com",
            address: "新北市板橋區文化路一段100號",
            region: "north",
            tier: "regular",
            status: "active",
            joinDate: "2024-03-05T16:45:00Z",
            totalOrders: 3,
            totalSpent: 1520,
            avgOrderValue: 507,
            lastOrderDate: "2024-12-12T16:45:00Z",
            notes: [],
            serviceRecords: []
        },
        {
            id: "CUST005",
            name: "林志明",
            phone: "0956789012",
            email: "zhiming@example.com",
            address: "桃園市中壢區中央西路一段100號",
            region: "north",
            tier: "new",
            status: "active",
            joinDate: "2024-11-20T11:20:00Z",
            totalOrders: 1,
            totalSpent: 678,
            avgOrderValue: 678,
            lastOrderDate: "2024-12-11T11:20:00Z",
            notes: [
                {
                    id: 1,
                    author: "張經理",
                    date: "2024-11-20T11:20:00Z",
                    content: "新客戶，首次購買金額較高，有潛力發展為VIP客戶"
                }
            ],
            serviceRecords: []
        },
        {
            id: "CUST006",
            name: "黃美麗",
            phone: "0967890123",
            email: "meili@example.com",
            address: "台南市東區大學路一段100號",
            region: "south",
            tier: "regular",
            status: "inactive",
            joinDate: "2023-11-15T13:10:00Z",
            totalOrders: 2,
            totalSpent: 890,
            avgOrderValue: 445,
            lastOrderDate: "2024-06-10T13:10:00Z",
            notes: [
                {
                    id: 1,
                    author: "李專員",
                    date: "2024-08-15T10:20:00Z",
                    content: "客戶超過3個月未消費，需主動聯繫了解需求"
                }
            ],
            serviceRecords: []
        },
        {
            id: "CUST007",
            name: "劉建國",
            phone: "0978901234",
            email: "jianguo@example.com",
            address: "花蓮縣花蓮市中山路100號",
            region: "east",
            tier: "regular",
            status: "active",
            joinDate: "2024-02-28T15:40:00Z",
            totalOrders: 4,
            totalSpent: 2310,
            avgOrderValue: 578,
            lastOrderDate: "2024-11-28T15:40:00Z",
            notes: [],
            serviceRecords: []
        },
        {
            id: "CUST008",
            name: "吳曉芬",
            phone: "0989012345",
            email: "xiaofen@example.com",
            address: "新竹市東區光復路一段100號",
            region: "north",
            tier: "vip",
            status: "active",
            joinDate: "2023-09-10T12:25:00Z",
            totalOrders: 15,
            totalSpent: 12450,
            avgOrderValue: 830,
            lastOrderDate: "2024-12-10T12:25:00Z",
            notes: [
                {
                    id: 1,
                    author: "張經理",
                    date: "2024-12-05T14:15:00Z",
                    content: "重要VIP客戶，經常購買高單價商品，需提供專屬服務"
                }
            ],
            serviceRecords: [
                {
                    id: 1,
                    type: "VIP服務",
                    date: "2024-12-05T14:15:00Z",
                    staff: "張經理",
                    description: "提供新品優先體驗和專屬折扣"
                }
            ]
        }
    ];
}

// 筛选客户
function filterCustomers() {
    const searchTerm = document.getElementById('customer-search').value.toLowerCase();
    const tierFilter = document.getElementById('tier-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const regionFilter = document.getElementById('region-filter').value;
    
    filteredCustomers = customers.filter(customer => {
        // 搜索筛选
        if (searchTerm) {
            const matchesName = customer.name.toLowerCase().includes(searchTerm);
            const matchesPhone = customer.phone.includes(searchTerm);
            const matchesEmail = customer.email.toLowerCase().includes(searchTerm);
            if (!matchesName && !matchesPhone && !matchesEmail) return false;
        }
        
        // 等级筛选
        if (tierFilter && customer.tier !== tierFilter) return false;
        
        // 状态筛选
        if (statusFilter && customer.status !== statusFilter) return false;
        
        // 地区筛选
        if (regionFilter && customer.region !== regionFilter) return false;
        
        return true;
    });
    
    displayCustomers();
    updateCustomerCount();
    updateCharts();
}

// 显示客户
function displayCustomers() {
    const tbody = document.getElementById('customers-table');
    
    if (filteredCustomers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #718096;">
                    <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    沒有找到符合條件的客戶
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredCustomers.map(customer => {
        const tierText = getTierText(customer.tier);
        const tierClass = `tier-${customer.tier}`;
        const statusText = customer.status === 'active' ? '活躍' : '非活躍';
        const statusClass = customer.status === 'active' ? 'status-active' : 'status-inactive';
        const regionText = getRegionText(customer.region);
        const joinDate = formatDate(customer.joinDate);
        const lastOrder = customer.lastOrderDate ? formatDate(customer.lastOrderDate) : '無消費紀錄';
        
        return `
            <tr>
                <td style="font-weight: 600;">${customer.id}</td>
                <td>
                    <div style="font-weight: 600;">${customer.name}</div>
                    <div style="font-size: 0.8rem; color: #718096;">加入日期: ${joinDate}</div>
                </td>
                <td>
                    <div>${customer.phone}</div>
                    <div style="font-size: 0.8rem; color: #718096;">${customer.email}</div>
                </td>
                <td>${regionText}</td>
                <td>
                    <div style="font-weight: 600; color: var(--primary-color);">$${customer.totalSpent}</div>
                    <div style="font-size: 0.8rem; color: #718096;">
                        ${customer.totalOrders} 筆訂單 • 平均 $${customer.avgOrderValue}
                    </div>
                    <div style="font-size: 0.8rem; color: #718096;">最後消費: ${lastOrder}</div>
                </td>
                <td><span class="status-badge ${tierClass}">${tierText}</span></td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="action-btn view" onclick="viewCustomerDetail('${customer.id}')">
                            <i class="fas fa-eye"></i> 查看
                        </button>
                        <button class="action-btn edit" onclick="editCustomer('${customer.id}')">
                            <i class="fas fa-edit"></i> 編輯
                        </button>
                        <button class="action-btn message" onclick="sendMessage('${customer.id}')">
                            <i class="fas fa-envelope"></i> 訊息
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 初始化图表
function initializeCharts() {
    // 销毁现有图表实例
    Object.values(chartInstances).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    chartInstances = {};
    
    // 初始化地区分布图
    initRegionChart();
    
    // 初始化客户等级分布图
    initTierChart();
    
    // 初始化消费金额分布图
    initSpendingChart();
    
    // 初始化客户增长趋势图
    initGrowthChart();
}

// 初始化地区分布图
function initRegionChart() {
    const ctx = document.getElementById('region-chart').getContext('2d');
    
    const data = getRegionDistributionData();
    
    chartInstances.region = new Chart(ctx, {
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

// 初始化客户等级分布图
function initTierChart() {
    const ctx = document.getElementById('tier-chart').getContext('2d');
    
    const data = getTierDistributionData();
    
    chartInstances.tier = new Chart(ctx, {
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

// 初始化消费金额分布图
function initSpendingChart() {
    const ctx = document.getElementById('spending-chart').getContext('2d');
    
    const data = getSpendingDistributionData();
    
    chartInstances.spending = new Chart(ctx, {
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

// 初始化客户增长趋势图
function initGrowthChart() {
    const ctx = document.getElementById('growth-chart').getContext('2d');
    
    const data = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        datasets: [{
            label: '新增客戶',
            data: [45, 52, 48, 65, 72, 68, 75, 82, 78, 85, 92, 88],
            borderColor: '#b684e2',
            backgroundColor: 'rgba(182, 132, 226, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    };
    
    chartInstances.growth = new Chart(ctx, {
        type: 'line',
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

// 获取地区分布数据
function getRegionDistributionData() {
    const regionCount = {
        north: filteredCustomers.filter(c => c.region === 'north').length,
        central: filteredCustomers.filter(c => c.region === 'central').length,
        south: filteredCustomers.filter(c => c.region === 'south').length,
        east: filteredCustomers.filter(c => c.region === 'east').length
    };
    
    return {
        labels: ['北部', '中部', '南部', '東部'],
        datasets: [{
            data: [regionCount.north, regionCount.central, regionCount.south, regionCount.east],
            backgroundColor: [
                '#b684e2',
                '#a928e6',
                '#8e44ad',
                '#6c3483'
            ],
            borderWidth: 0
        }]
    };
}

// 获取等级分布数据
function getTierDistributionData() {
    const tierCount = {
        vip: filteredCustomers.filter(c => c.tier === 'vip').length,
        regular: filteredCustomers.filter(c => c.tier === 'regular').length,
        new: filteredCustomers.filter(c => c.tier === 'new').length
    };
    
    return {
        labels: ['VIP客戶', '一般客戶', '新客戶'],
        datasets: [{
            data: [tierCount.vip, tierCount.regular, tierCount.new],
            backgroundColor: [
                '#f6e05e',
                '#3182ce',
                '#d69e2e'
            ],
            borderWidth: 0
        }]
    };
}

// 获取消费金额分布数据
function getSpendingDistributionData() {
    const spendingRanges = {
        low: filteredCustomers.filter(c => c.totalSpent < 1000).length,
        medium: filteredCustomers.filter(c => c.totalSpent >= 1000 && c.totalSpent < 5000).length,
        high: filteredCustomers.filter(c => c.totalSpent >= 5000).length
    };
    
    return {
        labels: ['$1,000以下', '$1,000-$5,000', '$5,000以上'],
        datasets: [{
            label: '客戶數量',
            data: [spendingRanges.low, spendingRanges.medium, spendingRanges.high],
            backgroundColor: [
                '#b684e2',
                '#a928e6',
                '#8e44ad'
            ],
            borderWidth: 0
        }]
    };
}

// 更新图表数据
function updateCharts() {
    if (chartInstances.region) {
        chartInstances.region.data = getRegionDistributionData();
        chartInstances.region.update();
    }
    
    if (chartInstances.tier) {
        chartInstances.tier.data = getTierDistributionData();
        chartInstances.tier.update();
    }
    
    if (chartInstances.spending) {
        chartInstances.spending.data = getSpendingDistributionData();
        chartInstances.spending.update();
    }
}

// 更新客户统计
function updateCustomerStats() {
    const totalCustomers = customers.length;
    const vipCustomers = customers.filter(c => c.tier === 'vip').length;
    
    // 计算本月新增客户（示例数据）
    const newCustomersThisMonth = customers.filter(c => {
        const joinDate = new Date(c.joinDate);
        const now = new Date();
        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    }).length;
    
    // 计算平均客单价
    const totalSpent = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const totalOrders = customers.reduce((sum, customer) => sum + customer.totalOrders, 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;
    
    document.getElementById('total-customers-kpi').textContent = totalCustomers;
    document.getElementById('new-customers').textContent = newCustomersThisMonth;
    document.getElementById('vip-count').textContent = vipCustomers;
    document.getElementById('avg-order-value').textContent = `$${avgOrderValue}`;
    
    // 更新快速统计
    document.getElementById('total-customers').textContent = totalCustomers;
    document.getElementById('vip-customers').textContent = vipCustomers;
}

// 更新客户计数
function updateCustomerCount() {
    document.getElementById('customer-count').textContent = `共 ${filteredCustomers.length} 位客戶`;
}

// 查看客户详情
function viewCustomerDetail(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    currentEditingCustomer = customerId;
    const modal = document.getElementById('customer-detail-modal');
    
    document.getElementById('customer-detail-title').textContent = `客戶詳情 - ${customer.name}`;
    
    // 加载各标签页内容
    loadCustomerProfileContent(customer);
    loadCustomerOrdersContent(customer);
    loadCustomerServiceContent(customer);
    loadCustomerNotesContent(customer);
    
    modal.style.display = 'flex';
}

// 加载客户基本资料内容
function loadCustomerProfileContent(customer) {
    const content = document.getElementById('customer-profile-content');
    const regionText = getRegionText(customer.region);
    const tierText = getTierText(customer.tier);
    const statusText = customer.status === 'active' ? '活躍' : '非活躍';
    const joinDate = formatDate(customer.joinDate, true);
    const lastOrderDate = customer.lastOrderDate ? formatDate(customer.lastOrderDate, true) : '無消費紀錄';
    
    content.innerHTML = `
        <div class="customer-profile-section">
            <h4><i class="fas fa-info-circle"></i> 基本資訊</h4>
            <div class="profile-grid">
                <div class="profile-item">
                    <span class="profile-label">客戶編號</span>
                    <span class="profile-value">${customer.id}</span>
                </div>
                <div class="profile-item">
                    <span class="profile-label">客戶姓名</span>
                    <span class="profile-value">${customer.name}</span>
                </div>
                <div class="profile-item">
                    <span class="profile-label">電話號碼</span>
                    <span class="profile-value">${customer.phone}</span>
                </div>
                <div class="profile-item">
                    <span class="profile-label">電子郵件</span>
                    <span class="profile-value">${customer.email}</span>
                </div>
                <div class="profile-item">
                    <span class="profile-label">地區</span>
                    <span class="profile-value">${regionText}</span>
                </div>
                <div class="profile-item">
                    <span class="profile-label">客戶等級</span>
                    <span class="profile-value"><span class="status-badge tier-${customer.tier}">${tierText}</span></span>
                </div>
                <div class="profile-item">
                    <span class="profile-label">狀態</span>
                    <span class="profile-value"><span class="status-badge status-${customer.status}">${statusText}</span></span>
                </div>
                <div class="profile-item">
                    <span class="profile-label">加入日期</span>
                    <span class="profile-value">${joinDate}</span>
                </div>
            </div>
        </div>
        
        <div class="customer-profile-section">
            <h4><i class="fas fa-map-marker-alt"></i> 地址資訊</h4>
            <p>${customer.address}</p>
        </div>
        
        <div class="customer-profile-section">
            <h4><i class="fas fa-chart-line"></i> 消費統計</h4>
            <div class="profile-grid">
                <div class="profile-item">
                    <span class="profile-label">總訂單數</span>
                    <span class="profile-value">${customer.totalOrders} 筆</span>
                </div>
                <div class="profile-item">
                    <span class="profile-label">總消費金額</span>
                    <span class="profile-value" style="color: var(--primary-color); font-weight: 700;">$${customer.totalSpent}</span>
                </div>
                <div class="profile-item">
                    <span class="profile-label">平均客單價</span>
                    <span class="profile-value">$${customer.avgOrderValue}</span>
                </div>
                <div class="profile-item">
                    <span class="profile-label">最後消費日期</span>
                    <span class="profile-value">${lastOrderDate}</span>
                </div>
            </div>
        </div>
    `;
}

// 加载客户消费纪录内容
function loadCustomerOrdersContent(customer) {
    const content = document.getElementById('customer-orders-content');
    
    // 从订单数据中获取该客户的订单（这里使用模拟数据）
    const customerOrders = generateCustomerOrders(customer.id);
    
    if (customerOrders.length === 0) {
        content.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #718096;">
                <i class="fas fa-shopping-cart" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                <p>暫無消費紀錄</p>
            </div>
        `;
        return;
    }
    
    content.innerHTML = `
        <h4><i class="fas fa-history"></i> 消費紀錄</h4>
        <div class="order-history">
            ${customerOrders.map(order => `
                <div class="order-item">
                    <div class="order-info">
                        <div class="order-number">${order.id}</div>
                        <div class="order-date">${formatDate(order.date, true)}</div>
                        <div class="order-products">${order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}</div>
                        <div class="order-status">
                            <span class="status-badge status-${order.status}">${getOrderStatusText(order.status)}</span>
                        </div>
                    </div>
                    <div class="order-amount">$${order.total}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// 加载客户服务纪录内容
function loadCustomerServiceContent(customer) {
    const content = document.getElementById('customer-service-content');
    
    if (customer.serviceRecords.length === 0) {
        content.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #718096;">
                <i class="fas fa-headset" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                <p>暫無服務紀錄</p>
            </div>
        `;
        return;
    }
    
    content.innerHTML = `
        <h4><i class="fas fa-headset"></i> 服務紀錄</h4>
        ${customer.serviceRecords.map(record => `
            <div class="service-record">
                <h5>${record.type}</h5>
                <div class="service-date">${formatDate(record.date, true)} • 服務人員: ${record.staff}</div>
                <div class="service-description">${record.description}</div>
            </div>
        `).join('')}
    `;
}

// 加载客户备注内容
function loadCustomerNotesContent(customer) {
    const content = document.getElementById('customer-notes-list');
    
    if (customer.notes.length === 0) {
        content.innerHTML = `
            <div style="text-align: center; padding: 1rem; color: #718096;">
                <i class="fas fa-sticky-note" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
                <p>暫無備註</p>
            </div>
        `;
        return;
    }
    
    content.innerHTML = customer.notes.map(note => `
        <div class="note-item">
            <div class="note-header">
                <span class="note-author">${note.author}</span>
                <span class="note-date">${formatDate(note.date, true)}</span>
            </div>
            <div class="note-content">${note.content}</div>
        </div>
    `).join('');
}

// 生成客户订单数据（模拟）
function generateCustomerOrders(customerId) {
    // 这里应该从订单数据中筛选，现在使用模拟数据
    const sampleOrders = [
        {
            id: "SS20241215001",
            date: "2024-12-15T10:30:00Z",
            status: "delivered",
            items: [
                { name: "智能編程機器人", quantity: 1 },
                { name: "創意積木套裝", quantity: 2 }
            ],
            total: 697
        },
        {
            id: "SS20241120001",
            date: "2024-11-20T14:15:00Z",
            status: "delivered",
            items: [
                { name: "遙控越野賽車", quantity: 1 }
            ],
            total: 399
        }
    ];
    
    return sampleOrders;
}

// 编辑客户
function editCustomer(customerId = null) {
    if (customerId) {
        // 编辑现有客户
        const customer = customers.find(c => c.id === customerId);
        if (!customer) return;
        
        currentEditingCustomer = customerId;
        document.getElementById('edit-customer-title').textContent = `編輯客戶資料 - ${customer.name}`;
        
        // 填充表单数据
        document.getElementById('edit-customer-name').value = customer.name;
        document.getElementById('edit-customer-phone').value = customer.phone;
        document.getElementById('edit-customer-email').value = customer.email;
        document.getElementById('edit-customer-tier').value = customer.tier;
        document.getElementById('edit-customer-region').value = customer.region;
        document.getElementById('edit-customer-address').value = customer.address;
        document.getElementById('edit-customer-notes').value = customer.notes.map(note => note.content).join('\n');
    } else {
        // 新增客户（这里可以扩展）
        currentEditingCustomer = null;
        document.getElementById('edit-customer-title').textContent = '新增客戶';
        document.getElementById('edit-customer-form').reset();
    }
    
    closeCustomerModal();
    document.getElementById('edit-customer-modal').style.display = 'flex';
}

// 保存客户
function saveCustomer() {
    const form = document.getElementById('edit-customer-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const customerData = {
        name: document.getElementById('edit-customer-name').value,
        phone: document.getElementById('edit-customer-phone').value,
        email: document.getElementById('edit-customer-email').value,
        tier: document.getElementById('edit-customer-tier').value,
        region: document.getElementById('edit-customer-region').value,
        address: document.getElementById('edit-customer-address').value,
        status: 'active'
    };
    
    if (currentEditingCustomer) {
        // 更新现有客户
        const index = customers.findIndex(c => c.id === currentEditingCustomer);
        if (index !== -1) {
            customers[index] = { ...customers[index], ...customerData };
        }
    } else {
        // 新增客户
        const newId = `CUST${String(customers.length + 1).padStart(3, '0')}`;
        customerData.id = newId;
        customerData.joinDate = new Date().toISOString();
        customerData.totalOrders = 0;
        customerData.totalSpent = 0;
        customerData.avgOrderValue = 0;
        customerData.notes = [];
        customerData.serviceRecords = [];
        
        customers.push(customerData);
    }
    
    // 保存到本地存储
    localStorage.setItem('customers', JSON.stringify(customers));
    
    // 更新UI
    filterCustomers();
    updateCustomerStats();
    closeEditCustomerModal();
    
    showNotification(currentEditingCustomer ? '客戶資料更新成功！' : '客戶新增成功！', 'success');
}

// 添加客户备注
function addCustomerNote() {
    const noteContent = document.getElementById('new-customer-note').value.trim();
    if (!noteContent) {
        showNotification('請輸入備註內容', 'warning');
        return;
    }
    
    const customer = customers.find(c => c.id === currentEditingCustomer);
    if (!customer) return;
    
    const newNote = {
        id: customer.notes.length + 1,
        author: document.getElementById('staff-name').textContent,
        date: new Date().toISOString(),
        content: noteContent
    };
    
    customer.notes.unshift(newNote);
    localStorage.setItem('customers', JSON.stringify(customers));
    
    // 更新备注显示
    loadCustomerNotesContent(customer);
    document.getElementById('new-customer-note').value = '';
    
    showNotification('備註新增成功', 'success');
}

// 发送消息给客户
function sendMessage(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    showNotification(`準備發送訊息給 ${customer.name}`, 'info');
    // 这里可以实现具体的消息发送逻辑
}

// 群发消息
function sendBulkMessage() {
    document.getElementById('bulk-message-modal').style.display = 'flex';
    updateRecipientCount();
}

// 更新收件人计数
function updateRecipientCount() {
    const target = document.getElementById('message-target').value;
    let recipientCount = 0;
    
    switch (target) {
        case 'all':
            recipientCount = customers.length;
            break;
        case 'vip':
            recipientCount = customers.filter(c => c.tier === 'vip').length;
            break;
        case 'regular':
            recipientCount = customers.filter(c => c.tier === 'regular').length;
            break;
        case 'inactive':
            recipientCount = customers.filter(c => c.status === 'inactive').length;
            break;
    }
    
    document.getElementById('recipient-count').textContent = recipientCount;
}

// 确认发送群发消息
function sendBulkMessageConfirm() {
    const form = document.getElementById('bulk-message-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const target = document.getElementById('message-target').value;
    const title = document.getElementById('message-title').value;
    const content = document.getElementById('message-content').value;
    const recipientCount = parseInt(document.getElementById('recipient-count').textContent);
    
    showNotification(`訊息已發送給 ${recipientCount} 位客戶`, 'success');
    closeBulkMessageModal();
}

// 标签页切换
function switchTab(tabName) {
    // 更新标签页头部
    document.querySelectorAll('.tab-header').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.tab-header[data-tab="${tabName}"]`).classList.add('active');
    
    // 更新标签页内容
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// 导出客户报表
function exportCustomerReport() {
    showNotification('正在匯出客戶報表...', 'info');
    setTimeout(() => {
        showNotification('客戶報表匯出成功！', 'success');
    }, 2000);
}

// 刷新数据
function refreshData() {
    showNotification('正在更新數據...', 'info');
    setTimeout(() => {
        loadCustomers();
        updateCustomerStats();
        showNotification('數據更新完成！', 'success');
    }, 1000);
}

// 辅助函数
function getTierText(tier) {
    const tierMap = {
        'vip': 'VIP客戶',
        'regular': '一般客戶',
        'new': '新客戶'
    };
    return tierMap[tier] || tier;
}

function getRegionText(region) {
    const regionMap = {
        'north': '北部',
        'central': '中部',
        'south': '南部',
        'east': '東部'
    };
    return regionMap[region] || region;
}

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
function closeCustomerModal() {
    document.getElementById('customer-detail-modal').style.display = 'none';
    currentEditingCustomer = null;
}

function closeEditCustomerModal() {
    document.getElementById('edit-customer-modal').style.display = 'none';
    currentEditingCustomer = null;
}

function closeBulkMessageModal() {
    document.getElementById('bulk-message-modal').style.display = 'none';
    document.getElementById('bulk-message-form').reset();
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