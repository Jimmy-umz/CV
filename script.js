// 取得 DOM 元素
const navs = document.querySelectorAll(".nav-list li"); // 所有導航項目
const cube = document.querySelector(".box"); // 3D 立方體
const sections = document.querySelectorAll(".section"); // 所有區段（立方體的面）

const resumeLists = document.querySelectorAll(".resume-list"); // 履歷標籤
const resumeBoxs = document.querySelectorAll(".resume-box"); // 履歷標籤內容

const portfolioLists = document.querySelectorAll(".portfolio-list"); // 作品集標籤
const portfolioBoxs = document.querySelectorAll(".portfolio-box"); // 作品集標籤內容

// 導航欄點擊事件：切換導航項目、旋轉立方體、切換區段
navs.forEach((nav, idx) => {
  nav.addEventListener("click", (_) => {
    // 移除當前啟用的導航項目
    document.querySelector(".nav-list li.active").classList.remove("active");
    // 為點擊的導航項目添加啟用狀態
    nav.classList.add("active");

    // 根據點擊的導航項目索引旋轉立方體（每個項目旋轉 -90 度）
    cube.style.transform = `rotateY(${idx * -90}deg)`;

    // 移除當前啟用的區段
    document.querySelector(".section.active").classList.remove("active");
    // 根據導航項目索引顯示對應的區段
    sections[idx].classList.add("active");

    // 將 sections 轉換為陣列，並取出索引 1、2、3 的區段（關於、履歷、作品集）
    const array = Array.from(sections);
    const arrSecs = array.slice(1, -1); // 排除首尾（首頁和聯絡區段）

    // 檢查是否切換到關於、履歷或作品集區段
    arrSecs.forEach((arrSecs) => {
      if (arrSecs.classList.contains("active")) {
        // 如果是，為聯絡區段添加特殊類別（延遲顯示）
        sections[4].classList.add("action-contact");
      }
    });

    // 如果切換回首頁，移除聯絡區段的特殊類別
    if (sections[0].classList.contains("active")) {
      sections[4].classList.remove("action-contact");
    }
  });
});

// 履歷標籤點擊事件：切換履歷內容
resumeLists.forEach((list, idx) => {
  list.addEventListener("click", () => {
    // 移除當前啟用的履歷標籤
    document.querySelector(".resume-list.active").classList.remove("active");
    // 為點擊的履歷標籤添加啟用狀態
    list.classList.add("active");

    // 移除當前顯示的履歷內容
    document.querySelector(".resume-box.active").classList.remove("active");
    // 顯示對應索引的履歷內容
    resumeBoxs[idx].classList.add("active");
  });
});

// 作品集標籤點擊事件：切換作品集內容
portfolioLists.forEach((list, index) => {
  list.addEventListener("click", (_) => {
    // 移除當前啟用的作品集標籤
    document.querySelector(".portfolio-list.active").classList.remove("active");
    // 為點擊的作品集標籤添加啟用狀態
    list.classList.add("active");

    // 移除當前顯示的作品集內容
    document.querySelector(".portfolio-box.active").classList.remove("active");
    // 顯示對應索引的作品集內容
    portfolioBoxs[index].classList.add("active");
  });
});

// 頁面載入時處理聯絡區段的可見性（配合立方體載入動畫）
setTimeout(() => {
  sections[4].classList.remove("active"); // 移除聯絡區段的啟用狀態
}, 1500); // 延遲 1.5 秒執行（等待立方體動畫完成）




// 技能進度條動畫初始化
function initSkillProgressBars() {
  const skillBars = document.querySelectorAll('.skill-progress-bar');

  skillBars.forEach(bar => {
    // 獲取寬度百分比
    const width = bar.style.width;
    // 設置 CSS 變量
    bar.parentElement.style.setProperty('--target-width', width);
    // 初始狀態為 0
    bar.style.width = '0%';
  });
}

// 當技能標籤激活時觸發動畫
document.querySelectorAll('.resume-list').forEach((list, index) => {
  list.addEventListener('click', () => {
    if (index === 1) { // 假設技能標籤是第二個
      setTimeout(() => {
        const skillBox = document.querySelector('.resume-box.skills.active');
        if (skillBox) {
          const bars = skillBox.querySelectorAll('.skill-progress-bar');
          bars.forEach(bar => {
            bar.style.width = '0%';
            // 觸發重排
            void bar.offsetWidth;
            // 獲取目標寬度
            const targetWidth = bar.parentElement.style.getPropertyValue('--target-width');
            if (targetWidth) {
              bar.style.width = targetWidth;
            }
          });
        }
      }, 300);
    }
  });
});

// 頁面加載時初始化
document.addEventListener('DOMContentLoaded', initSkillProgressBars);

// 當切換到技能標籤時觸發動畫
// 作品集標籤點擊事件：切換作品集內容
portfolioLists.forEach((list, index) => {
  list.addEventListener("click", (_) => {
    // 移除當前啟用的作品集標籤
    document.querySelector(".portfolio-list.active").classList.remove("active");
    // 為點擊的作品集標籤添加啟用狀態
    list.classList.add("active");

    // 移除當前顯示的作品集內容
    document.querySelector(".portfolio-box.active").classList.remove("active");
    // 顯示對應索引的作品集內容
    portfolioBoxs[index].classList.add("active");
  });
});