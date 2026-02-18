// JS/staff-profile.js

// 全局变量
let currentStaff = {};
let passwordStrength = 0;
let selectedAvatar = 'user-tie';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeProfilePage();
    setupEventListeners();
    loadNavigation();
    loadStaffInfo();
});

// 初始化个人中心页面
function initializeProfilePage() {
    updateProfileStats();
    initializePasswordStrength();
    loadSavedSettings();
}

// 设置事件监听器
function setupEventListeners() {
    // 标签页切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // 密码强度检测
    document.getElementById('new-password').addEventListener('input', checkPasswordStrength);
    
    // 头像选项点击
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', function() {
            selectAvatar(this.dataset.avatar);
        });
    });
    
    // 主题选择
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', function() {
            previewTheme(this.value);
        });
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
            <a href="staff-profile.html" class="active"><i class="fas fa-user-cog"></i> 員工中心</a>
            <button class="logout-btn" onclick="logout()">
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
        department: '銷售部門',
        avatar: 'user-tie',
        stats: {
            orders: 128,
            customers: 45
        },
        performance: {
            completedQuotes: 24,
            pendingTasks: 8,
            achievementRate: 85
        },
        systemInfo: {
            lastLogin: '2024-12-15 10:30',
            loginCount: 156
        }
    };
    
    currentStaff = staffData;
    
    // 更新员工信息显示
    document.getElementById('staff-name').textContent = staffData.name;
    document.getElementById('profile-name').textContent = staffData.name;
    document.getElementById('profile-role').textContent = staffData.role;
    document.getElementById('profile-department').textContent = staffData.department;
    
    // 更新头像
    const avatarElement = document.querySelector('.avatar-image i');
    if (avatarElement) {
        avatarElement.className = `fas fa-${staffData.avatar}`;
    }
    
    // 更新侧边栏头像
    const sidebarAvatar = document.querySelector('.staff-avatar i');
    if (sidebarAvatar) {
        sidebarAvatar.className = `fas fa-${staffData.avatar}`;
    }
    
    // 填充表单数据
    document.getElementById('staff-fullname').value = staffData.name;
    document.getElementById('staff-english-name').value = staffData.englishName || 'Manager Zhang';
    document.getElementById('staff-department').value = staffData.departmentCode || 'sales';
    document.getElementById('staff-position').value = staffData.position || 'manager';
    document.getElementById('staff-level').value = staffData.level || 'senior';
    document.getElementById('staff-email').value = staffData.email || 'manager.zhang@smilesunshine.com';
    document.getElementById('staff-phone').value = staffData.phone || '0912-345-678';
    document.getElementById('staff-extension').value = staffData.extension || '123';
    document.getElementById('staff-bio').value = staffData.bio || '專注於客戶關係管理和銷售策略規劃，擁有5年以上玩具產業經驗。';
    
    // 更新系统信息
    document.getElementById('last-login').textContent = staffData.systemInfo.lastLogin;
    document.getElementById('login-count').textContent = staffData.systemInfo.loginCount;
}

// 更新个人资料统计
function updateProfileStats() {
    // 更新个人资料卡片统计
    document.getElementById('profile-orders').textContent = currentStaff.stats.orders;
    document.getElementById('profile-customers').textContent = currentStaff.stats.customers;
    
    // 更新快速数据
    document.querySelector('.quick-data-grid .data-item:nth-child(1) .data-value').textContent = 
        currentStaff.performance.completedQuotes;
    document.querySelector('.quick-data-grid .data-item:nth-child(2) .data-value').textContent = 
        currentStaff.performance.pendingTasks;
    document.querySelector('.quick-data-grid .data-item:nth-child(3) .data-value').textContent = 
        currentStaff.performance.achievementRate + '%';
    
    // 更新侧边栏统计
    document.getElementById('work-days').textContent = Math.floor(Math.random() * 20) + 10; // 模拟数据
    document.getElementById('completed-tasks').textContent = Math.floor(Math.random() * 50) + 30; // 模拟数据
}

// 标签页切换
function switchTab(tabName) {
    // 更新标签按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
    
    // 更新标签内容
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// 编辑头像
function editAvatar() {
    document.getElementById('avatar-modal').style.display = 'flex';
}

// 选择头像
function selectAvatar(avatarType) {
    selectedAvatar = avatarType;
    
    // 更新头像选项状态
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`.avatar-option[data-avatar="${avatarType}"]`).classList.add('active');
    
    // 更新预览
    const previewIcon = document.getElementById('avatar-preview-icon');
    previewIcon.className = `fas fa-${avatarType}`;
}

// 保存头像
function saveAvatar() {
    // 更新员工头像
    currentStaff.avatar = selectedAvatar;
    
    // 更新显示的头像
    const avatarElements = document.querySelectorAll('.avatar-image i, .staff-avatar i');
    avatarElements.forEach(element => {
        element.className = `fas fa-${selectedAvatar}`;
    });
    
    // 保存到本地存储
    localStorage.setItem('currentStaff', JSON.stringify(currentStaff));
    
    closeAvatarModal();
    showNotification('頭像更新成功！', 'success');
}

// 关闭头像模态框
function closeAvatarModal() {
    document.getElementById('avatar-modal').style.display = 'none';
}

// 保存个人信息
function savePersonalInfo() {
    const form = document.getElementById('personal-form');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // 收集表单数据
    const formData = {
        name: document.getElementById('staff-fullname').value,
        englishName: document.getElementById('staff-english-name').value,
        departmentCode: document.getElementById('staff-department').value,
        position: document.getElementById('staff-position').value,
        level: document.getElementById('staff-level').value,
        email: document.getElementById('staff-email').value,
        phone: document.getElementById('staff-phone').value,
        extension: document.getElementById('staff-extension').value,
        bio: document.getElementById('staff-bio').value
    };
    
    // 更新员工信息
    currentStaff = { ...currentStaff, ...formData };
    
    // 更新显示
    document.getElementById('profile-name').textContent = formData.name;
    document.getElementById('staff-name').textContent = formData.name;
    document.getElementById('profile-role').textContent = 
        document.querySelector('#staff-position option:checked').textContent;
    document.getElementById('profile-department').textContent = 
        document.querySelector('#staff-department option:checked').textContent;
    
    // 保存到本地存储
    localStorage.setItem('currentStaff', JSON.stringify(currentStaff));
    
    showNotification('個人資料更新成功！', 'success');
}

// 重设个人信息表单
function resetPersonalForm() {
    if (confirm('確定要重設個人資料嗎？所有未儲存的變更將會遺失。')) {
        loadStaffInfo();
        showNotification('表單已重設', 'info');
    }
}

// 初始化密码强度检测
function initializePasswordStrength() {
    const requirements = document.querySelectorAll('#password-requirements li');
    requirements.forEach(req => {
        req.classList.remove('valid');
    });
}

// 检查密码强度
function checkPasswordStrength() {
    const password = document.getElementById('new-password').value;
    let strength = 0;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    // 更新要求状态
    Object.keys(requirements).forEach(key => {
        const element = document.getElementById(`req-${key}`);
        if (element) {
            if (requirements[key]) {
                element.classList.add('valid');
                strength++;
            } else {
                element.classList.remove('valid');
            }
        }
    });
    
    // 更新强度条
    const strengthFill = document.getElementById('password-strength-fill');
    const strengthText = document.getElementById('password-strength-text');
    
    let strengthPercent = (strength / 5) * 100;
    let strengthLabel = '';
    let strengthColor = '';
    
    if (strengthPercent === 0) {
        strengthLabel = '密碼強度';
        strengthColor = '#e53e3e';
    } else if (strengthPercent <= 40) {
        strengthLabel = '弱';
        strengthColor = '#e53e3e';
    } else if (strengthPercent <= 70) {
        strengthLabel = '中等';
        strengthColor = '#d69e2e';
    } else {
        strengthLabel = '強';
        strengthColor = '#38a169';
    }
    
    strengthFill.style.width = `${strengthPercent}%`;
    strengthFill.style.background = strengthColor;
    strengthText.textContent = strengthLabel;
    strengthText.style.color = strengthColor;
    
    passwordStrength = strengthPercent;
}

// 更改密码
function changePassword() {
    const form = document.getElementById('security-form');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // 验证当前密码（这里应该与服务器验证）
    if (currentPassword !== 'demo123') { // 示例密码
        showNotification('目前密碼不正確', 'error');
        return;
    }
    
    // 验证新密码强度
    if (passwordStrength < 70) {
        showNotification('新密碼強度不足，請使用更複雜的密碼', 'warning');
        return;
    }
    
    // 验证密码匹配
    if (newPassword !== confirmPassword) {
        showNotification('新密碼與確認密碼不相符', 'error');
        return;
    }
    
    // 模拟密码更改成功
    setTimeout(() => {
        resetSecurityForm();
        showNotification('密碼更新成功！', 'success');
    }, 1000);
}

// 重设安全表单
function resetSecurityForm() {
    document.getElementById('security-form').reset();
    initializePasswordStrength();
    document.getElementById('password-strength-fill').style.width = '0%';
    document.getElementById('password-strength-text').textContent = '密碼強度';
    document.getElementById('password-strength-text').style.color = '#718096';
}

// 查看会话
function viewSessions() {
    document.getElementById('sessions-modal').style.display = 'flex';
}

// 关闭会话模态框
function closeSessionsModal() {
    document.getElementById('sessions-modal').style.display = 'none';
}

// 登出会话
function logoutSession(button) {
    const sessionItem = button.closest('.session-item');
    if (sessionItem && confirm('確定要登出這個工作階段嗎？')) {
        sessionItem.style.opacity = '0.5';
        button.disabled = true;
        button.textContent = '已登出';
        showNotification('工作階段已登出', 'success');
    }
}

// 登出所有其他会话
function logoutAllSessions() {
    if (confirm('確定要登出所有其他工作階段嗎？')) {
        const otherSessions = document.querySelectorAll('.session-item:not(.current)');
        otherSessions.forEach(session => {
            session.style.opacity = '0.5';
            const button = session.querySelector('button');
            if (button) {
                button.disabled = true;
                button.textContent = '已登出';
            }
        });
        showNotification('所有其他工作階段已登出', 'success');
    }
}

// 保存通知设置
function saveNotificationSettings() {
    // 收集所有开关状态
    const settings = {
        system: {
            maintenance: document.getElementById('sys-maintenance').checked,
            security: document.getElementById('sys-security').checked
        },
        business: {
            newOrders: document.getElementById('biz-new-orders').checked,
            lowStock: document.getElementById('biz-low-stock').checked,
            customerMessages: document.getElementById('biz-customer-messages').checked
        },
        email: {
            dailyReport: document.getElementById('email-daily-report').checked,
            weeklyReport: document.getElementById('email-weekly-report').checked
        }
    };
    
    // 保存到本地存储
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    
    showNotification('通知設定已儲存！', 'success');
}

// 重设通知设置
function resetNotificationSettings() {
    if (confirm('確定要重設為預設通知設定嗎？')) {
        // 重置所有开关为默认值
        document.getElementById('sys-maintenance').checked = true;
        document.getElementById('sys-security').checked = true;
        document.getElementById('biz-new-orders').checked = true;
        document.getElementById('biz-low-stock').checked = true;
        document.getElementById('biz-customer-messages').checked = true;
        document.getElementById('email-daily-report').checked = true;
        document.getElementById('email-weekly-report').checked = false;
        
        showNotification('通知設定已重設為預設值', 'info');
    }
}

// 预览主题
function previewTheme(theme) {
    // 在实际应用中，这里会即时应用主题预览
    // 现在只是记录选择
    console.log('Selected theme:', theme);
}

// 保存偏好设置
function savePreferences() {
    const preferences = {
        theme: document.querySelector('input[name="theme"]:checked').value,
        language: document.getElementById('language-preference').value,
        timezone: document.getElementById('timezone-preference').value,
        defaultPage: document.getElementById('default-page').value,
        pageSize: document.getElementById('page-size').value,
        autoRefresh: document.getElementById('auto-refresh').value
    };
    
    // 保存到本地存储
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    showNotification('偏好設定已儲存！', 'success');
}

// 重设偏好设置
function resetPreferences() {
    if (confirm('確定要重設為預設偏好設定嗎？')) {
        // 重置所有设置为默认值
        document.querySelector('input[name="theme"][value="light"]').checked = true;
        document.getElementById('language-preference').value = 'zh-TW';
        document.getElementById('timezone-preference').value = 'Asia/Taipei';
        document.getElementById('default-page').value = 'dashboard';
        document.getElementById('page-size').value = '25';
        document.getElementById('auto-refresh').value = '60000';
        
        showNotification('偏好設定已重設為預設值', 'info');
    }
}

// 加载保存的设置
function loadSavedSettings() {
    // 加载通知设置
    const notificationSettings = JSON.parse(localStorage.getItem('notificationSettings'));
    if (notificationSettings) {
        document.getElementById('sys-maintenance').checked = notificationSettings.system.maintenance;
        document.getElementById('sys-security').checked = notificationSettings.system.security;
        document.getElementById('biz-new-orders').checked = notificationSettings.business.newOrders;
        document.getElementById('biz-low-stock').checked = notificationSettings.business.lowStock;
        document.getElementById('biz-customer-messages').checked = notificationSettings.business.customerMessages;
        document.getElementById('email-daily-report').checked = notificationSettings.email.dailyReport;
        document.getElementById('email-weekly-report').checked = notificationSettings.email.weeklyReport;
    }
    
    // 加载安全设置
    const securitySettings = JSON.parse(localStorage.getItem('securitySettings'));
    if (securitySettings) {
        document.getElementById('two-factor-auth').checked = securitySettings.twoFactorAuth;
        document.getElementById('login-notifications').checked = securitySettings.loginNotifications;
    }
    
    // 加载偏好设置
    const userPreferences = JSON.parse(localStorage.getItem('userPreferences'));
    if (userPreferences) {
        document.querySelector(`input[name="theme"][value="${userPreferences.theme}"]`).checked = true;
        document.getElementById('language-preference').value = userPreferences.language;
        document.getElementById('timezone-preference').value = userPreferences.timezone;
        document.getElementById('default-page').value = userPreferences.defaultPage;
        document.getElementById('page-size').value = userPreferences.pageSize;
        document.getElementById('auto-refresh').value = userPreferences.autoRefresh;
    }
}

// 关闭所有模态框
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
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