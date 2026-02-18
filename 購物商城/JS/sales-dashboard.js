// JS/sales-dashboard.js

// 全局变量
let currentTimeRange = 'week';
let chartInstances = {};
let salesData = {};
let currentStaff = {};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadNavigation();
    loadStaffInfo();
});

// 初始化仪表板
function initializeDashboard() {
    // 加载销售数据
    loadSalesData();
    
    // 初始化图表
    initializeCharts();
    
    // 加载最近订单
    loadRecentOrders();
    
    // 加载库存警报
    loadInventoryAlerts();
    
    // 加载通知
    loadNotifications();
    
    // 更新快速统计
    updateQuickStats();
}

// 设置事件监听器
function setupEventListeners() {
    // 时间范围选择
    document.getElementById('time-range').addEventListener('change', function(e) {
        currentTimeRange = e.target.value;
        refreshData();
    });
    
    // 图表指标切换
    document.querySelectorAll('.btn-chart').forEach(btn => {
        btn.addEventListener('click', function() {
            switchChartMetric(this.dataset.metric);
        });
    });
    
    // 产品排行筛选
    document.getElementById('product-rank-filter').addEventListener('change', function() {
        updateProductChart(this.value);
    });
    
    // 模态框外部点击关闭
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// 加载导航
function loadNavigation() {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
        navLinks.innerHTML = `
            <a href="staff-profile.html"><i class="fas fa-user-cog"></i> 員工中心</a>
             <a href="login.html"> <button class="logout-btn" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> 登出
            </button>
        `;
    }
}

// 加载员工信息
function loadStaffInfo() {
    // 从本地存储获取员工信息或使用默认值
    const staffData = JSON.parse(localStorage.getItem('currentStaff')) || {
        name: '張經理',
        role: '銷售經理',
        avatar: 'user-tie'
    };
    
    currentStaff = staffData;
    document.getElementById('staff-name').textContent = staffData.name;
}

// 加载销售数据
function loadSalesData() {
    // 模拟销售数据
    salesData = {
        today: {
            orders: 24,
            revenue: 3250,
            newCustomers: 8
        },
        week: {
            orders: 324,
            revenue: 48256,
            newCustomers: 42,
            conversionRate: 3.2
        },
        month: {
            orders: 1289,
            revenue: 189245,
            newCustomers: 156,
            conversionRate: 3.5
        },
        quarter: {
            orders: 3845,
            revenue: 562189,
            newCustomers: 428,
            conversionRate: 3.4
        },
        year: {
            orders: 15236,
            revenue: 2189456,
            newCustomers: 1689,
            conversionRate: 3.6
        }
    };
    
    updateKPICards();
}

// 更新KPI指标卡片
function updateKPICards() {
    const data = salesData[currentTimeRange];
    if (!data) return;
    
    document.getElementById('total-revenue').textContent = `$${data.revenue.toLocaleString()}`;
    document.getElementById('total-orders').textContent = data.orders.toLocaleString();
    document.getElementById('new-customers').textContent = data.newCustomers.toLocaleString();
    document.getElementById('conversion-rate').textContent = `${data.conversionRate}%`;
}

// 更新快速统计
function updateQuickStats() {
    const todayData = salesData.today;
    document.getElementById('quick-orders').textContent = todayData.orders;
    document.getElementById('quick-revenue').textContent = `$${todayData.revenue}`;
}

// 初始化图表
function initializeCharts() {
    // 销毁现有图表实例
    Object.values(chartInstances).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    chartInstances = {};
    
    // 初始化营收趋势图
    initRevenueChart();
    
    // 初始化产品销售排行图
    initProductChart();
    
    // 初始化客户分布图
    initCustomerChart();
    
    // 初始化销售渠道图
    initChannelChart();
}

// 初始化营收趋势图
function initRevenueChart() {
    const ctx = document.getElementById('revenue-chart').getContext('2d');
    
    const data = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
        datasets: [{
            label: '营收',
            data: [12500, 19000, 15000, 22000, 18000, 25000, 30000],
            borderColor: '#b684e2',
            backgroundColor: 'rgba(182, 132, 226, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    };
    
    chartInstances.revenue = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
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

// 初始化产品销售排行图
function initProductChart() {
    const ctx = document.getElementById('product-chart').getContext('2d');
    
    const data = {
        labels: ['智能编程机器人', '遥控越野赛车', '创意积木套装', '电子绘图板', '科学实验套装'],
        datasets: [{
            label: '营收',
            data: [12500, 9800, 7600, 5400, 3200],
            backgroundColor: [
                '#b684e2',
                '#a928e6',
                '#8e44ad',
                '#6c3483',
                '#4a235a'
            ],
            borderWidth: 0
        }]
    };
    
    chartInstances.product = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
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
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 初始化客户分布图
function initCustomerChart() {
    const ctx = document.getElementById('customer-chart').getContext('2d');
    
    const data = {
        labels: ['新客户', '回头客', 'VIP客户', '企业客户'],
        datasets: [{
            data: [35, 25, 20, 20],
            backgroundColor: [
                '#b684e2',
                '#a928e6',
                '#8e44ad',
                '#6c3483'
            ],
            borderWidth: 0
        }]
    };
    
    chartInstances.customer = new Chart(ctx, {
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

// 初始化销售渠道图
function initChannelChart() {
    const ctx = document.getElementById('channel-chart').getContext('2d');
    
    const data = {
        labels: ['线上商城', '实体门店', '经销商', '企业采购'],
        datasets: [{
            data: [45, 30, 15, 10],
            backgroundColor: [
                '#b684e2',
                '#a928e6',
                '#8e44ad',
                '#6c3483'
            ],
            borderWidth: 0
        }]
    };
    
    chartInstances.channel = new Chart(ctx, {
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

// 切换图表指标
function switchChartMetric(metric) {
    // 更新按钮状态
    document.querySelectorAll('.btn-chart').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 更新图表数据
    const chart = chartInstances.revenue;
    if (!chart) return;
    
    const newData = getChartDataForMetric(metric);
    chart.data.datasets[0].data = newData.data;
    chart.data.datasets[0].label = newData.label;
    chart.update();
}

// 获取图表数据
function getChartDataForMetric(metric) {
    const dataMap = {
        revenue: {
            label: '营收',
            data: [12500, 19000, 15000, 22000, 18000, 25000, 30000]
        },
        orders: {
            label: '订单数',
            data: [45, 68, 52, 79, 62, 88, 105]
        },
        customers: {
            label: '客户数',
            data: [28, 42, 35, 51, 38, 62, 75]
        }
    };
    
    return dataMap[metric] || dataMap.revenue;
}

// 更新产品图表
function updateProductChart(metric) {
    const chart = chartInstances.product;
    if (!chart) return;
    
    const dataMap = {
        revenue: [12500, 9800, 7600, 5400, 3200],
        quantity: [42, 35, 28, 22, 15]
    };
    
    chart.data.datasets[0].data = dataMap[metric] || dataMap.revenue;
    chart.update();
}

// 加载最近订单
function loadRecentOrders() {
    const recentOrders = [
        {
            id: 'SS20241215001',
            customer: '張小明',
            amount: 697,
            status: 'completed',
            date: '2024-12-15'
        },
        {
            id: 'SS20241214002',
            customer: '李美華',
            amount: 449,
            status: 'shipped',
            date: '2024-12-14'
        },
        {
            id: 'SS20241213003',
            customer: '王大明',
            amount: 404,
            status: 'processing',
            date: '2024-12-13'
        },
        {
            id: 'SS20241212004',
            customer: '陳小玉',
            amount: 349,
            status: 'pending',
            date: '2024-12-12'
        },
        {
            id: 'SS20241211005',
            customer: '林志明',
            amount: 899,
            status: 'completed',
            date: '2024-12-11'
        }
    ];
    
    const tbody = document.getElementById('recent-orders-table');
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>$${order.amount}</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>${formatDate(order.date)}</td>
        </tr>
    `).join('');
}

// 加载库存警报
function loadInventoryAlerts() {
    const inventoryAlerts = [
        {
            product: '遥控越野赛车',
            currentStock: 5,
            safeStock: 10,
            status: 'low'
        },
        {
            product: '科学实验套装',
            currentStock: 8,
            safeStock: 15,
            status: 'low'
        },
        {
            product: '电子绘图板',
            currentStock: 12,
            safeStock: 20,
            status: 'warning'
        }
    ];
    
    const tbody = document.getElementById('inventory-alerts-table');
    tbody.innerHTML = inventoryAlerts.map(item => `
        <tr>
            <td>${item.product}</td>
            <td>${item.currentStock}</td>
            <td>${item.safeStock}</td>
            <td><span class="status-badge status-${item.status}">${getStockStatusText(item.status)}</span></td>
            <td>
                <button class="btn-action small" onclick="reorderProduct('${item.product}')">
                    <i class="fas fa-sync-alt"></i> 补货
                </button>
            </td>
        </tr>
    `).join('');
}

// 加载通知
function loadNotifications() {
    const notifications = [
        {
            type: 'info',
            title: '系统维护通知',
            message: '系统将于本周六凌晨2:00-4:00进行维护',
            time: '2小时前'
        },
        {
            type: 'warning',
            title: '库存警报',
            message: '遥控越野赛车库存低于安全水平',
            time: '4小时前'
        },
        {
            type: 'success',
            title: '新订单完成',
            message: '订单 SS20241215001 已完成支付',
            time: '6小时前'
        },
        {
            type: 'info',
            title: '销售目标达成',
            message: '本月销售目标已完成85%',
            time: '1天前'
        }
    ];
    
    const notificationsList = document.getElementById('notifications-list');
    notificationsList.innerHTML = notifications.map(notification => `
        <div class="notification-item">
            <div class="notification-icon ${notification.type}">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
        </div>
    `).join('');
}

// 导出报表
function exportReport() {
    document.getElementById('export-modal').style.display = 'flex';
}

// 确认导出
function confirmExport() {
    const format = document.querySelector('input[name="export-format"]:checked').value;
    const dateRange = document.getElementById('export-date-range').value;
    const metrics = Array.from(document.querySelectorAll('input[name="metrics"]:checked'))
        .map(input => input.value);
    
    showNotification(`正在导出 ${format.toUpperCase()} 格式报表...`, 'info');
    
    // 模拟导出过程
    setTimeout(() => {
        closeExportModal();
        showNotification('报表导出成功！', 'success');
    }, 2000);
}

// 关闭导出模态框
function closeExportModal() {
    document.getElementById('export-modal').style.display = 'none';
}

// 查看通知
function viewNotifications() {
    document.getElementById('notifications-modal').style.display = 'flex';
}

// 关闭通知模态框
function closeNotificationsModal() {
    document.getElementById('notifications-modal').style.display = 'none';
}

// 关闭所有模态框
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// 刷新数据
function refreshData() {
    showNotification('正在更新数据...', 'info');
    
    // 模拟数据更新
    setTimeout(() => {
        loadSalesData();
        updateQuickStats();
        showNotification('数据更新完成！', 'success');
    }, 1000);
}

// 创建新订单
function createNewOrder() {
    showNotification('正在跳转到订单创建页面...', 'info');
    setTimeout(() => {
        window.location.href = 'order-management.html?action=create';
    }, 500);
}

// 创建报价单
function createQuotation() {
    showNotification('正在跳转到报价单创建页面...', 'info');
    setTimeout(() => {
        window.location.href = 'quotation-management.html?action=create';
    }, 500);
}

// 生成报告
function generateReport() {
    exportReport();
}

// 产品补货
function reorderProduct(productName) {
    if (confirm(`确定要为 "${productName}" 发起补货申请吗？`)) {
        showNotification(`已为 "${productName}" 发起补货申请`, 'success');
    }
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
    if (confirm('确定要登出吗？')) {
        localStorage.removeItem('currentStaff');
        showNotification('已成功登出', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// 辅助函数
function getStatusText(status) {
    const statusMap = {
        'pending': '待处理',
        'processing': '处理中',
        'shipped': '已发货',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    return statusMap[status] || status;
}

function getStockStatusText(status) {
    const statusMap = {
        'low': '库存不足',
        'warning': '库存警告',
        'normal': '库存正常'
    };
    return statusMap[status] || status;
}

function getNotificationIcon(type) {
    const iconMap = {
        'info': 'info-circle',
        'warning': 'exclamation-triangle',
        'success': 'check-circle',
        'error': 'times-circle'
    };
    return iconMap[type] || 'info-circle';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
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
    
    .btn-action.small {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }
`;
document.head.appendChild(style);