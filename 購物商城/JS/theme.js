// 主題管理
const ThemeManager = {
  init: function () {
    const savedTheme = localStorage.getItem("userTheme") || "client";
    this.applyTheme(savedTheme);
    return savedTheme;
  },

  applyTheme: function (themeType) {
    $("body")
      .removeClass("client-mode staff-mode")
      .addClass(themeType + "-mode");
  },

  setTheme: function (themeType) {
    localStorage.setItem("userTheme", themeType);
    this.applyTheme(themeType);
  },

  getCurrentTheme: function () {
    return localStorage.getItem("userTheme") || "client";
  },

  isLoggedIn: function () {
    return !!localStorage.getItem("userTheme");
  },

  logout: function () {
    localStorage.removeItem("userTheme");
    localStorage.removeItem("pendingAction");
    localStorage.removeItem("returnUrl");
    this.applyTheme("client");
  },
};
