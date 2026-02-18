// 玩具数据 - 从 DataManager 获取
let toys = [];

// 图标映射
const iconMap = {
  robot: "fas fa-robot",
  blocks: "fas fa-cubes",
  car: "fas fa-car",
  drawing: "fas fa-palette",
  adventure: "fas fa-binoculars",
  science: "fas fa-flask",
};

$(document).ready(function () {
  // 初始化主题
  ThemeManager.init();

  // 从统一数据源加载商品
  loadProductsFromStorage();
  
  // 更新界面显示
  updateHeaderDisplay();
  loadToys();
  updateStats();

  // 事件监听
  $("#category-filter").on("change", filterToys);
  $("#price-filter").on("change", filterToys);
  $("#search-input").on("input", filterToys);
});

// 从localStorage加载商品数据
function loadProductsFromStorage() {
    toys = DataManager.getActiveProducts(); // 只获取上架的商品
}

// 檢查登入並執行操作
function checkLoginAndProceed(action) {
  if (!ThemeManager.isLoggedIn()) {
    // 未登入，保存當前操作並跳轉到登入頁面
    localStorage.setItem("pendingAction", action);
    localStorage.setItem("returnUrl", window.location.href);
    window.location.href = "login.html?from=catalog";
    return false;
  }
  return true;
}

// 更新頭部顯示
function updateHeaderDisplay() {
  const $navLinks = $("#nav-links");
  const $loginPrompt = $("#login-prompt");

  if (ThemeManager.isLoggedIn()) {
    // 已登入，顯示完整導航
    $navLinks.html(`
                <a href="index.html" class="active"><i class="fas fa-store"></i> 玩具瀏覽</a>
                <a href="wishlist.html"><i class="fas fa-heart"></i> 願望清單</a>
                <a href="checkout.html"><i class="fas fa-shopping-cart"></i> 結帳</a>
                <a href="order-tracking.html"><i class="fas fa-clipboard-list"></i> 我的訂單</a>
                <a href="customer-profile.html"><i class="fas fa-user"></i> 個人資料</a>
                <a href="custom-toy-design.html"><i class="fas fa-cog"></i> 自訂玩具設計</a>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> 登出
                </button>
            `);
    $loginPrompt.hide();
  } else {
    // 未登入，只顯示基本導航
    $navLinks.html(`
                <a href="login.html" class="login-btn"><i class="fas fa-sign-in-alt"></i> 登入</a>
                <a href="login.html" class="login-btn"><i class="fas fa-user-plus"></i> 註冊</a>
            `);
    $loginPrompt.show();
  }
}

function loadToys(filteredToys = toys) {
  const $container = $("#toy-container");
  $container.empty();

  if (filteredToys.length === 0) {
    $container.html(`
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>找不到符合條件的玩具</h3>
                <p>請嘗試調整篩選條件或搜尋關鍵字</p>
            </div>
          `);
    return;
  }

  filteredToys.forEach((toy) => {
    const toyCard = `
            <div class="toy-card" data-id="${toy.id}" data-category="${toy.category}">
              <div class="toy-image" onclick="viewToyDetail(${toy.id})">
                <img src="img/${toy.image}.png" alt="${toy.name}" 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="icon-fallback" style="display: none;">
                  <i class="${iconMap[toy.image] || "fas fa-gift"}"></i>
                </div>
              </div>
              <div class="toy-content">
                <h3 class="toy-name" onclick="viewToyDetail(${toy.id})">${toy.name}</h3>
                <span class="toy-category">${getCategoryName(toy.category)}</span>
                <div class="toy-price">$${toy.price}</div>
                <p class="toy-description">${toy.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <span style="color: #718096; font-size: 0.9rem;">
                    <i class="fas fa-box"></i> 庫存: ${toy.stock}
                  </span>
                  <button class="view-detail-btn" onclick="event.stopPropagation(); viewToyDetail(${toy.id})">
                    <i class="fas fa-eye"></i> 查看詳情
                  </button>
                </div>
                <button class="wishlist-btn" onclick="event.stopPropagation(); addToWishlist(${toy.id})">
                  <i class="fas fa-heart"></i> 加入願望清單
                </button>
              </div>
            </div>
          `;
    $container.append(toyCard);
  });
}

function filterToys() {
  const category = $("#category-filter").val();
  const priceRange = $("#price-filter").val();
  const searchTerm = $("#search-input").val().toLowerCase();

  let filtered = toys.filter((toy) => {
    // 分類篩選
    if (category && toy.category !== category) return false;

    // 價格篩選
    if (priceRange) {
      const [min, max] =
        priceRange === "500+"
          ? [500, Infinity]
          : priceRange.split("-").map(Number);
      if (toy.price < min || toy.price > max) return false;
    }

    // 搜尋篩選
    if (
      searchTerm &&
      !toy.name.toLowerCase().includes(searchTerm) &&
      !toy.description.toLowerCase().includes(searchTerm)
    ) {
      return false;
    }

    return true;
  });

  loadToys(filtered);
  updateStats(filtered);
}

function clearFilters() {
  $("#category-filter").val("");
  $("#price-filter").val("");
  $("#search-input").val("");
  loadProductsFromStorage(); // 重新加载数据
  loadToys();
  updateStats();
}

function updateStats(filteredToys = toys) {
  $("#total-toys").text(filteredToys.length);

  // 願望清單數量
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  $("#wishlist-count").text(wishlist.length);

  // 分類數量
  const categories = [...new Set(filteredToys.map((toy) => toy.category))];
  $("#available-categories").text(categories.length);
}

function getCategoryName(category) {
  const names = {
    educational: "教育玩具",
    outdoor: "戶外玩具",
    creative: "創意玩具",
    electronic: "電子玩具",
  };
  return names[category] || category;
}

function addToWishlist(toyId) {
  if (!checkLoginAndProceed("addToWishlist")) {
    return;
  }

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const toy = toys.find((t) => t.id === toyId);

  if (!wishlist.find((item) => item.id === toyId)) {
    wishlist.push({
      ...toy,
      quantity: 1,
      addedAt: new Date().toISOString(),
    });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    // 顯示成功消息
    showNotification(`"${toy.name}" 已加入願望清單！`);
    updateStats();
  } else {
    showNotification(`"${toy.name}" 已在願望清單中！`, "warning");
  }
}

function showNotification(message, type = "success") {
  // 簡單的通知實現
  alert(message);
}

function logout() {
  ThemeManager.logout();
  window.location.reload();
}

// 查看商品詳情
function viewToyDetail(toyId) {
  window.location.href = `toy-detail.html?id=${toyId}`;
}

// 為整個玩具卡片添加點擊事件
$(document).on('click', '.toy-card', function(e) {
  // 防止點擊按鈕時觸發卡片點擊
  if (!$(e.target).closest('.wishlist-btn').length && 
      !$(e.target).closest('.view-detail-btn').length) {
    const toyId = $(this).data('id');
    viewToyDetail(toyId);
  }
});