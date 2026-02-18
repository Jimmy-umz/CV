$(document).ready(function () {
  // Initialize test user data
  initializeTestUsers();

  // Identity selector toggle
  $(".identity-radio").on("change", function () {
    const isStaffMode = $("#staff-radio").is(":checked");
    updateInterface(isStaffMode);
    showLoginForm();
  });

  // Password show/hide functionality
  $(".password-toggle").on("click", function () {
    const $passwordInput = $(this).siblings('input[type="password"]');
    const $icon = $(this).find("i");

    if ($passwordInput.attr("type") === "password") {
      $passwordInput.attr("type", "text");
      $icon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
      $passwordInput.attr("type", "password");
      $icon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
  });

  // Form switching
  $("#switch-to-register").on("click", function (e) {
    e.preventDefault();
    showRegisterForm();
  });

  $("#switch-to-login").on("click", function (e) {
    e.preventDefault();
    showLoginForm();
  });

  // Login form submit
  $("#login-form-content").on("submit", function (e) {
    e.preventDefault();
    handleLogin();
  });

  // Registration form submit
  $("#register-form-content").on("submit", function (e) {
    e.preventDefault();
    handleRegistration();
  });

  // Real-time form validation
  $("#reg-email").on("blur", function () {
    validateEmail($(this).val(), $("#reg-email-error"));
  });

  $("#reg-phone").on("blur", function () {
    validatePhone($(this).val(), $("#reg-phone-error"));
  });

  $("#reg-password").on("blur", function () {
    validatePassword($(this).val(), $("#reg-password-error"));
  });

  $("#reg-confirm-password").on("blur", function () {
    validateConfirmPassword(
      $("#reg-password").val(),
      $(this).val(),
      $("#reg-confirm-password-error")
    );
  });
});

// Update interface to reflect the currently selected identity
function updateInterface(isStaffMode) {
  const $body = $("body");
  const $selectorSlider = $(".selector-slider");

  if (isStaffMode) {
    $body.removeClass("client-mode").addClass("staff-mode");

    // update selector slider position
    $("#panel-title").text("Welcome, dear colleague");
    $("#panel-description").text(
      "Thank you for your dedication. Let's achieve great results together."
    );
    $("#form-title").text("Staff Login");
    $("#form-subtitle").text("Sign in to the internal system to start working efficiently");
    $("#username-label").text("Employee Account");
    $("#submit-btn").text("Go to Dashboard");
    $("#register-title").text("Staff Account Request");
    $("#register-subtitle").text("Request access to the internal system");
    $("#register-btn").text("Submit Request");

    // Show staff-specific fields
    $("#staff-field").show();

    // Update features list
    $(".features-list").html(`
      <li><i class="fas fa-tachometer-alt"></i> Efficient dashboard</li>
      <li><i class="fas fa-users"></i> Customer relationship management</li>
      <li><i class="fas fa-chart-bar"></i> Data analytics reports</li>
      <li><i class="fas fa-cog"></i> System administration tools</li>
    `);
  } else {
    $body.removeClass("staff-mode").addClass("client-mode");

    // Restore client-side text content
    $("#panel-title").text("Welcome, valued customer");
    $("#panel-description").text(
      "Thank you for choosing our services. We are committed to offering top-quality products and excellent customer experience."
    );
    $("#form-title").text("Customer Login");
    $("#form-subtitle").text("Sign in to your account to enjoy personalized services");
    $("#username-label").text("Email / Username");
    $("#submit-btn").text("Sign In");
    $("#register-title").text("Customer Registration");
    $("#register-subtitle").text("Create a new account to get started");
    $("#register-btn").text("Register Account");

    // Hide staff-specific fields
    $("#staff-field").hide();

    // Restore features list
    $(".features-list").html(`
      <li><i class="fas fa-rocket"></i> Fast and easy account management</li>
      <li><i class="fas fa-shield-alt"></i> Bank-level security protection</li>
      <li><i class="fas fa-headset"></i> 24/7 customer support</li>
      <li><i class="fas fa-chart-line"></i> Personalized data reports</li>
    `);
  }
}

// Show login form
function showLoginForm() {
  $("#login-form").show();
  $("#register-form").hide();
  $("#success-message").hide();
  clearAllErrors();
}

// Show registration form
function showRegisterForm() {
  $("#login-form").hide();
  $("#register-form").show();
  $("#success-message").hide();
  clearAllErrors();
}

// Show success message
function showSuccessMessage() {
  $("#login-form").hide();
  $("#register-form").hide();
  $("#success-message").show();
}

// Show loading spinner
function showLoading() {
  $("#loading-spinner").show();
  $(".submit-btn").prop("disabled", true);
}

// Hide loading spinner
function hideLoading() {
  $("#loading-spinner").hide();
  $(".submit-btn").prop("disabled", false);
}

// Show error message
function showError($element, message) {
  $element.addClass("error");
  $element.siblings(".error-message").text(message).show();
}

// Clear error message
function clearError($element) {
  $element.removeClass("error");
  $element.siblings(".error-message").hide();
}

// Clear all error messages
function clearAllErrors() {
  $(".form-control").removeClass("error");
  $(".error-message").hide();
}

// Validate email
function validateEmail(email, $errorElement) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError($("#reg-email"), "Please enter a valid email address");
    return false;
  } else {
    clearError($("#reg-email"));
    return true;
  }
}

// Validate phone number
function validatePhone(phone, $errorElement) {
  const phoneRegex = /^[2-9]\d{7}$/;
  if (!phoneRegex.test(phone)) {
    showError($("#reg-phone"), "Please enter a valid Hong Kong phone number");
    return false;
  } else {
    clearError($("#reg-phone"));
    return true;
  }
}

// Validate password
function validatePassword(password, $errorElement) {
  if (password.length < 6) {
    showError($("#reg-password"), "Password must be at least 6 characters");
    return false;
  } else if (!/[0-9]/.test(password)) {
    showError($("#reg-password"), "Password must contain at least one number");
    return false;
  } else {
    clearError($("#reg-password"));
    return true;
  }
}

// Validate confirm password
function validateConfirmPassword(password, confirmPassword, $errorElement) {
  if (password !== confirmPassword) {
    showError($("#reg-confirm-password"), "Passwords do not match");
    return false;
  } else {
    clearError($("#reg-confirm-password"));
    return true;
  }
}

// Handle login
function handleLogin() {
  const isStaffMode = $("body").hasClass("staff-mode");
  const username = $("#username").val().trim();
  const password = $("#password").val();
  const employeeId = isStaffMode ? $("#employee-id").val().trim() : null;

  // 基本驗證
  if (!username) {
    showError($("#username"), "Please enter username or email");
    return;
  }

  if (!password) {
    showError($("#password"), "Please enter password");
    return;
  }

  if (isStaffMode && !employeeId) {
    showError($("#employee-id"), "Please enter employee ID");
    return;
  }

  showLoading();

  // 模擬API請求
  setTimeout(() => {
    hideLoading();

    const users = JSON.parse(localStorage.getItem("smileSunshineUsers")) || [];
    const user = users.find(
      (u) =>
        (u.email === username || u.username === username) &&
        u.password === password &&
        u.isStaff === isStaffMode &&
        (!isStaffMode || u.employeeId === employeeId)
    );

    if (user) {
      // 設置主題
      const themeType = isStaffMode ? "staff" : "client";
      setTheme(themeType);

      // 檢查是否有未完成的操作
      const pendingAction = localStorage.getItem("pendingAction");
      const returnUrl = localStorage.getItem("returnUrl");
      const urlParams = new URLSearchParams(window.location.search);
      const from = urlParams.get("from");

      // 清除暫存的操作信息
      localStorage.removeItem("pendingAction");
      localStorage.removeItem("returnUrl");

      // 根據來源決定跳轉位置
      if (from === "catalog" || pendingAction) {
        // 返回之前的頁面
        window.location.href = returnUrl || "index.html";
      } else if (isStaffMode) {
        window.location.href = "sales-dashboard.html";
      } else {
        window.location.href = "index.html";
      }
    } else {
      alert("Login failed: incorrect username or password");
    }
  }, 1500);
}

// Set theme
function setTheme(themeType) {
  localStorage.setItem("userTheme", themeType);
  applyTheme(themeType);
}

function applyTheme(themeType) {
  $("body")
    .removeClass("client-mode staff-mode")
    .addClass(themeType + "-mode");
}

// Handle registration
function handleRegistration() {
  const isStaffMode = $("body").hasClass("staff-mode");
  const name = $("#reg-username").val().trim();
  const email = $("#reg-email").val().trim();
  const phone = $("#reg-phone").val().trim();
  const password = $("#reg-password").val();
  const confirmPassword = $("#reg-confirm-password").val();
  const agreeTerms = $("#agree-terms").is(":checked");
  const employeeId = isStaffMode ? $("#employee-id").val().trim() : null;

  // 驗證所有字段
  const isEmailValid = validateEmail(email, $("#reg-email-error"));
  const isPhoneValid = validatePhone(phone, $("#reg-phone-error"));
  const isPasswordValid = validatePassword(password, $("#reg-password-error"));
  const isConfirmPasswordValid = validateConfirmPassword(
    password,
    confirmPassword,
    $("#reg-confirm-password-error")
  );

  if (!name) {
    showError($("#reg-username"), "Please enter your name");
    return;
  }

  if (!agreeTerms) {
    alert("Please agree to the Terms of Service and Privacy Policy");
    return;
  }

  if (isStaffMode && !employeeId) {
    showError($("#employee-id"), "Please enter employee ID");
    return;
  }

  if (
    !isEmailValid ||
    !isPhoneValid ||
    !isPasswordValid ||
    !isConfirmPasswordValid
  ) {
    return;
  }

  showLoading();

  // 模擬API請求
  setTimeout(() => {
    hideLoading();

    // 檢查郵箱是否已存在
    const users = JSON.parse(localStorage.getItem("smileSunshineUsers")) || [];
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      showError($("#reg-email"), "This email is already registered");
      return;
    }

    // 創建新用戶
    const newUser = {
      id: Date.now().toString(),
      name: name,
      email: email,
      phone: phone,
      password: password,
      isStaff: isStaffMode,
      employeeId: employeeId,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("smileSunshineUsers", JSON.stringify(users));

    showSuccessMessage();

    // After 3 seconds, automatically return to login form
    setTimeout(() => {
      showLoginForm();
      // 自動填充登入表單
      $("#username").val(email);
    }, 3000);
  }, 1500);
}

// Initialize test users data
function initializeTestUsers() {
  const existingUsers = localStorage.getItem("smileSunshineUsers");
  if (!existingUsers) {
    const testUsers = [
      {
        id: "1",
        name: "Test Customer",
        email: "customer@mail.com",
        phone: "23456789",
        password: "customer123",
        isStaff: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Test Staff",
        email: "staff@smilesunshine.com",
        phone: "27654321",
        password: "staff123",
        isStaff: true,
        employeeId: "EMP001",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("smileSunshineUsers", JSON.stringify(testUsers));

    // 生成 USERS.TXT 文件內容
    const userText = testUsers
      .map(
        (user) =>
          `${user.email} | ${user.password} | ${
            user.isStaff ? "Staff" : "Customer"
          }${user.employeeId ? " | " + user.employeeId : ""}`
      )
      .join("\n");

    console.log("Test users created. Save the following content to USERS.TXT:");
    console.log(userText);
  }
}
