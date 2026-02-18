// 設計數據結構
let designData = {
    id: generateDesignId(),
    base: 'bear',
    colors: {
        body: '#FF6B6B',
        accent: '#2D3748'
    },
    accessories: {
        hat: 'none',
        clothing: 'none',
        glasses: false,
        bowtie: false,
        wings: false,
        magicWand: false
    },
    personalization: {
        expression: 'happy',
        name: '',
        message: '',
        size: 'small'
    },
    price: 299,
    createdAt: new Date().toISOString()
};

// 價格配置
const priceConfig = {
    base: {
        bear: 0,
        robot: 50,
        dragon: 30,
        unicorn: 40
    },
    accessories: {
        hat: {
            none: 0,
            baseball: 20,
            party: 15,
            crown: 25
        },
        clothing: {
            none: 0,
            't-shirt': 30,
            dress: 35,
            superhero: 40
        },
        glasses: 15,
        bowtie: 10,
        wings: 25,
        magicWand: 20
    },
    size: {
        small: 0,
        medium: 100,
        large: 200
    }
};

$(document).ready(function () {
    // 初始化主題
    const currentTheme = ThemeManager.init();
    
    // 更新界面顯示
    updateHeaderDisplay();
    
    // 檢查登入狀態
    if (ThemeManager.isLoggedIn()) {
        loadDesignData();
        setupEventListeners();
        updateDesignPreview();
        updateDesignSummary();
    } else {
        showLoginPrompt();
    }
});

// 更新頭部顯示
function updateHeaderDisplay() {
    const $navLinks = $("#nav-links");
    const $loginPrompt = $("#login-prompt");
    const $customDesignContent = $("#custom-design-content");

    if (ThemeManager.isLoggedIn()) {
        // 已登入，顯示完整導航
        $navLinks.html(`
            <a href="index.html"><i class="fas fa-store"></i> 玩具瀏覽</a>
                <a href="wishlist.html"><i class="fas fa-heart"></i> 願望清單</a>
                <a href="checkout.html"><i class="fas fa-shopping-cart"></i> 結帳</a>
                <a href="order-tracking.html"><i class="fas fa-clipboard-list"></i> 我的訂單</a>
                <a href="customer-profile.html"><i class="fas fa-user"></i> 個人資料</a>
                <a href="custom-toy-design.html"  class="active"><i class="fas fa-cog"></i> 自訂玩具設計</a>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> 登出
                </button>
        `);
        $loginPrompt.hide();
        $customDesignContent.show();
    } 
}

// 顯示登入提示
function showLoginPrompt() {
    $("#login-prompt").show();
    $("#custom-design-content").hide();
}

// 設置事件監聽器
function setupEventListeners() {
    // 頁籤切換
    $(".tab-btn").on("click", function() {
        const tabId = $(this).data("tab");
        switchTab(tabId);
    });

    // 基礎樣式選擇
    $(".option-card").on("click", function() {
        const baseType = $(this).data("base");
        selectBaseType(baseType);
    });

    // 顏色選擇
    $(".color-option").on("click", function() {
        const color = $(this).data("color");
        const part = $(this).data("part");
        selectColor(color, part);
    });

    // 自訂顏色選擇
    $("#custom-color-picker").on("input", function() {
        const color = $(this).val();
        selectColor(color, 'body');
    });

    // 配件選擇
    $('input[name="hat"]').on("change", function() {
        designData.accessories.hat = $(this).val();
        updateDesignPreview();
        updatePrice();
    });

    $('input[name="clothing"]').on("change", function() {
        designData.accessories.clothing = $(this).val();
        updateDesignPreview();
        updatePrice();
    });

    $('input[name="glasses"]').on("change", function() {
        designData.accessories.glasses = $(this).is(":checked");
        updateDesignPreview();
        updatePrice();
    });

    $('input[name="bowtie"]').on("change", function() {
        designData.accessories.bowtie = $(this).is(":checked");
        updateDesignPreview();
        updatePrice();
    });

    $('input[name="wings"]').on("change", function() {
        designData.accessories.wings = $(this).is(":checked");
        updateDesignPreview();
        updatePrice();
    });

    $('input[name="magic-wand"]').on("change", function() {
        designData.accessories.magicWand = $(this).is(":checked");
        updateDesignPreview();
        updatePrice();
    });

    // 表情選擇
    $('input[name="expression"]').on("change", function() {
        designData.personalization.expression = $(this).val();
        updateDesignPreview();
    });

    // 個性化文字
    $("#toy-name").on("input", function() {
        designData.personalization.name = $(this).val();
        updateCharCount(this);
        updateDesignSummary();
    });

    $("#special-message").on("input", function() {
        designData.personalization.message = $(this).val();
        updateCharCount(this);
        updateDesignSummary();
    });

    // 尺寸選擇
    $('input[name="size"]').on("change", function() {
        designData.personalization.size = $(this).val();
        updatePrice();
        updateDesignSummary();
    });
}

// 切換頁籤
function switchTab(tabId) {
    // 更新按鈕狀態
    $(".tab-btn").removeClass("active");
    $(`.tab-btn[data-tab="${tabId}"]`).addClass("active");

    // 更新內容區域
    $(".tab-content").removeClass("active");
    $(`#${tabId}-tab`).addClass("active");
}

// 生成設計ID
function generateDesignId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `CD-${timestamp}${random}`;
}

// 加載設計數據
function loadDesignData() {
    const savedDesign = JSON.parse(localStorage.getItem('currentDesign'));
    if (savedDesign) {
        designData = { ...designData, ...savedDesign };
    }
    
    // 更新設計資訊顯示
    $("#design-id").text(designData.id);
    $("#design-date").text(formatDate(designData.createdAt));
    
    // 更新表單狀態
    updateFormState();
}

// 更新表單狀態
function updateFormState() {
    // 基礎樣式
    $(`.option-card[data-base="${designData.base}"]`).addClass("active").siblings().removeClass("active");
    
    // 顏色
    $(`.color-option[data-color="${designData.colors.body}"][data-part="body"]`).addClass("active").siblings().removeClass("active");
    $(`.color-option[data-color="${designData.colors.accent}"][data-part="accent"]`).addClass("active").siblings().removeClass("active");
    $("#custom-color-picker").val(designData.colors.body);
    
    // 配件
    $(`input[name="hat"][value="${designData.accessories.hat}"]`).prop("checked", true);
    $(`input[name="clothing"][value="${designData.accessories.clothing}"]`).prop("checked", true);
    $(`input[name="glasses"]`).prop("checked", designData.accessories.glasses);
    $(`input[name="bowtie"]`).prop("checked", designData.accessories.bowtie);
    $(`input[name="wings"]`).prop("checked", designData.accessories.wings);
    $(`input[name="magic-wand"]`).prop("checked", designData.accessories.magicWand);
    
    // 個性化
    $(`input[name="expression"][value="${designData.personalization.expression}"]`).prop("checked", true);
    $("#toy-name").val(designData.personalization.name);
    $("#special-message").val(designData.personalization.message);
    $(`input[name="size"][value="${designData.personalization.size}"]`).prop("checked", true);
    
    // 更新字符計數
    updateCharCount($("#toy-name")[0]);
    updateCharCount($("#special-message")[0]);
}

// 選擇基礎樣式
function selectBaseType(baseType) {
    designData.base = baseType;
    
    // 更新UI狀態
    $(".option-card").removeClass("active");
    $(`.option-card[data-base="${baseType}"]`).addClass("active");
    
    // 根據基礎樣式調整默認顏色
    switch(baseType) {
        case 'robot':
            designData.colors.body = '#45B7D1';
            break;
        case 'dragon':
            designData.colors.body = '#96CEB4';
            break;
        case 'unicorn':
            designData.colors.body = '#DDA0DD';
            break;
        default:
            designData.colors.body = '#FF6B6B';
    }
    
    // 更新顏色選擇狀態
    $(`.color-option[data-part="body"]`).removeClass("active");
    $(`.color-option[data-color="${designData.colors.body}"][data-part="body"]`).addClass("active");
    $("#custom-color-picker").val(designData.colors.body);
    
    updateDesignPreview();
    updatePrice();
    updateDesignSummary();
}

// 選擇顏色
function selectColor(color, part) {
    designData.colors[part] = color;
    
    // 更新UI狀態
    $(`.color-option[data-part="${part}"]`).removeClass("active");
    $(`.color-option[data-color="${color}"][data-part="${part}"]`).addClass("active");
    
    // 如果是主體顏色，更新自訂顏色選擇器
    if (part === 'body') {
        $("#custom-color-picker").val(color);
    }
    
    updateDesignPreview();
    updateDesignSummary();
}

// 更新設計預覽
function updateDesignPreview() {
    const $toyBody = $("#toy-body");
    const $toyFace = $("#toy-face");
    const $toyAccessories = $("#toy-accessories");
    
    // 更新基礎樣式
    $toyBody.removeClass("bear robot dragon unicorn").addClass(designData.base);
    
    // 更新顏色
    $toyBody.css('background-color', designData.colors.body);
    
    // 更新表情
    $toyFace.removeClass("happy wink surprised sleepy").addClass(designData.personalization.expression);
    
    // 清空配件
    $toyAccessories.empty();
    
    // 添加帽子
    if (designData.accessories.hat !== 'none') {
        const $hat = $('<div class="accessory-hat"></div>');
        $hat.addClass(designData.accessories.hat);
        $hat.css('background-color', designData.colors.accent);
        $toyAccessories.append($hat);
    }
    
    // 添加服裝
    if (designData.accessories.clothing !== 'none') {
        const $clothing = $('<div class="accessory-clothing"></div>');
        $clothing.addClass(designData.accessories.clothing);
        $clothing.css('background-color', designData.colors.accent);
        $toyAccessories.append($clothing);
    }
    
    // 添加其他配件
    if (designData.accessories.glasses) {
        const $glasses = $('<div class="accessory-glasses"></div>');
        $glasses.css('background-color', designData.colors.accent);
        $toyAccessories.append($glasses);
    }
    
    if (designData.accessories.bowtie) {
        const $bowtie = $('<div class="accessory-bowtie"></div>');
        $bowtie.css('background-color', designData.colors.accent);
        $toyAccessories.append($bowtie);
    }
    
    if (designData.accessories.wings) {
        const $wings = $('<div class="accessory-wings"></div>');
        $wings.css('background-color', designData.colors.accent);
        $toyAccessories.append($wings);
    }
    
    if (designData.accessories.magicWand) {
        const $magicWand = $('<div class="accessory-magic-wand"></div>');
        $toyAccessories.append($magicWand);
    }
}

// 更新價格
function updatePrice() {
    let total = 0;
    
    // 基礎價格
    total += priceConfig.base[designData.base];
    
    // 配件價格
    total += priceConfig.accessories.hat[designData.accessories.hat];
    total += priceConfig.accessories.clothing[designData.accessories.clothing];
    if (designData.accessories.glasses) total += priceConfig.accessories.glasses;
    if (designData.accessories.bowtie) total += priceConfig.accessories.bowtie;
    if (designData.accessories.wings) total += priceConfig.accessories.wings;
    if (designData.accessories.magicWand) total += priceConfig.accessories.magicWand;
    
    // 尺寸價格
    total += priceConfig.size[designData.personalization.size];
    
    // 基礎價格（最小價格）
    total += 299;
    
    designData.price = total;
    
    // 更新顯示
    $("#design-price").text('$' + total);
    $("#summary-total").text('$' + total);
    
    // 更新製作時間（根據複雜度）
    updateProductionTime();
}

// 更新製作時間
function updateProductionTime() {
    let baseTime = 7;
    let complexity = 0;
    
    // 根據配件數量增加複雜度
    if (designData.accessories.hat !== 'none') complexity++;
    if (designData.accessories.clothing !== 'none') complexity++;
    if (designData.accessories.glasses) complexity++;
    if (designData.accessories.bowtie) complexity++;
    if (designData.accessories.wings) complexity++;
    if (designData.accessories.magicWand) complexity++;
    
    const totalDays = baseTime + Math.floor(complexity / 2);
    $("#production-time").text(totalDays + '-10 個工作天');
}

// 更新設計摘要
function updateDesignSummary() {
    // 基礎樣式
    const baseNames = {
        bear: '泰迪熊',
        robot: '機器人',
        dragon: '小恐龍',
        unicorn: '獨角獸'
    };
    $("#summary-base").text(baseNames[designData.base]);
    
    // 主體顏色
    const colorNames = {
        '#FF6B6B': '粉紅色',
        '#4ECDC4': '青綠色',
        '#45B7D1': '藍色',
        '#96CEB4': '綠色',
        '#FFEAA7': '黃色',
        '#DDA0DD': '紫色',
        '#2D3748': '深灰色'
    };
    $("#summary-body-color").text(colorNames[designData.colors.body] || '自訂顏色');
    
    // 配件摘要
    const accessories = [];
    if (designData.accessories.hat !== 'none') {
        const hatNames = {
            baseball: '棒球帽',
            party: '派對帽',
            crown: '皇冠'
        };
        accessories.push(hatNames[designData.accessories.hat]);
    }
    if (designData.accessories.clothing !== 'none') {
        const clothingNames = {
            't-shirt': 'T恤',
            dress: '裙子',
            superhero: '超級英雄裝'
        };
        accessories.push(clothingNames[designData.accessories.clothing]);
    }
    if (designData.accessories.glasses) accessories.push('眼鏡');
    if (designData.accessories.bowtie) accessories.push('領結');
    if (designData.accessories.wings) accessories.push('翅膀');
    if (designData.accessories.magicWand) accessories.push('魔法棒');
    
    $("#summary-accessories").text(accessories.length > 0 ? accessories.join(', ') : '無');
    
    // 個性化摘要
    const personalizations = [];
    if (designData.personalization.name) personalizations.push('名字: ' + designData.personalization.name);
    if (designData.personalization.message) personalizations.push('特別訊息');
    
    const expressionNames = {
        happy: '開心',
        wink: '眨眼',
        surprised: '驚訝',
        sleepy: '想睡'
    };
    personalizations.push('表情: ' + expressionNames[designData.personalization.expression]);
    
    $("#summary-personalization").text(personalizations.join(', '));
    
    // 尺寸
    const sizeNames = {
        small: '小 (20cm)',
        medium: '中 (30cm)',
        large: '大 (40cm)'
    };
    $("#summary-size").text(sizeNames[designData.personalization.size]);
}

// 更新字符計數
function updateCharCount(input) {
    const $count = $(input).siblings('.char-count');
    const currentLength = $(input).val().length;
    const maxLength = $(input).attr('maxlength');
    $count.text(currentLength + '/' + maxLength);
    
    if (currentLength > maxLength * 0.8) {
        $count.css('color', '#E53E3E');
    } else {
        $count.css('color', '#718096');
    }
}

// 旋轉玩具
function rotateToy() {
    const $toyBase = $("#toy-base");
    const currentRotation = parseInt($toyBase.css('transform').split('(')[1]) || 0;
    const newRotation = (currentRotation + 90) % 360;
    
    $toyBase.css('transform', `rotate(${newRotation}deg)`);
}

// 重設設計
function resetDesign() {
    if (confirm('確定要重設設計嗎？所有目前的設定將會遺失。')) {
        designData = {
            id: generateDesignId(),
            base: 'bear',
            colors: {
                body: '#FF6B6B',
                accent: '#2D3748'
            },
            accessories: {
                hat: 'none',
                clothing: 'none',
                glasses: false,
                bowtie: false,
                wings: false,
                magicWand: false
            },
            personalization: {
                expression: 'happy',
                name: '',
                message: '',
                size: 'small'
            },
            price: 299,
            createdAt: new Date().toISOString()
        };
        
        updateFormState();
        updateDesignPreview();
        updatePrice();
        updateDesignSummary();
        
        showNotification('設計已重設', 'success');
    }
}

// 保存設計
function saveDesign() {
    // 保存到本地存儲
    localStorage.setItem('currentDesign', JSON.stringify(designData));
    
    // 保存到設計庫
    let designLibrary = JSON.parse(localStorage.getItem('designLibrary')) || [];
    designLibrary.push({
        ...designData,
        savedAt: new Date().toISOString()
    });
    localStorage.setItem('designLibrary', JSON.stringify(designLibrary));
    
    // 顯示成功模態框
    $("#save-success-modal").show();
    
    showNotification('設計已成功保存', 'success');
}

// 關閉保存模態框
function closeSaveModal() {
    $("#save-success-modal").hide();
}

// 查看我的設計
function viewMyDesigns() {
    window.location.href = 'customer-profile.html#wishlist';
}

// 分享設計
function shareDesign() {
    // 生成分享連結
    const designLink = `https://smilesunshine.com/design/${designData.id}`;
    $("#design-link").text(designLink);
    
    $("#share-modal").show();
}

// 關閉分享模態框
function closeShareModal() {
    $("#share-modal").hide();
}

// 分享到社交媒體
function shareToSocial(platform) {
    const designLink = encodeURIComponent(`https://smilesunshine.com/design/${designData.id}`);
    const text = encodeURIComponent('看看我設計的可愛玩具！');
    
    let shareUrl = '';
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${designLink}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${designLink}`;
            break;
        case 'instagram':
            // Instagram 需要通過其他方式分享
            showNotification('請使用 Instagram App 分享圖片', 'info');
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    showNotification(`正在分享到${getPlatformName(platform)}`, 'success');
}

// 複製設計連結
function copyDesignLink() {
    const designLink = `https://smilesunshine.com/design/${designData.id}`;
    
    navigator.clipboard.writeText(designLink).then(() => {
        showNotification('設計連結已複製到剪貼簿', 'success');
    }).catch(() => {
        // 降級方案
        const tempInput = document.createElement('input');
        tempInput.value = designLink;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showNotification('設計連結已複製到剪貼簿', 'success');
    });
}

// 請求報價
function requestQuotation() {
    // 保存當前設計
    localStorage.setItem('currentDesign', JSON.stringify(designData));
    
    // 這裡可以跳轉到報價頁面或顯示報價模態框
    showNotification('報價請求已發送！我們將很快與您聯繫。', 'success');
    
    // 模擬發送報價請求
    setTimeout(() => {
        showNotification('報價詳情已發送到您的郵箱', 'info');
    }, 2000);
}

// 加入購物車
function addToCart() {
    // 保存當前設計
    localStorage.setItem('currentDesign', JSON.stringify(designData));
    
    // 獲取當前購物車
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    
    // 添加設計到購物車
    cart.push({
        type: 'custom',
        design: designData,
        quantity: 1,
        addedAt: new Date().toISOString()
    });
    
    // 保存購物車
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    
    showNotification('客製化玩具已加入購物車！', 'success');
}

// 輔助函數
function getPlatformName(platform) {
    const names = {
        facebook: 'Facebook',
        twitter: 'Twitter',
        instagram: 'Instagram'
    };
    return names[platform] || platform;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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
        closeSaveModal();
        closeShareModal();
    }
});

// 初始化價格和製作時間
updatePrice();