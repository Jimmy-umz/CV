// 取得 DOM 元素
const navs = document.querySelectorAll(".nav-list li");
const cube = document.querySelector(".box");
const sections = document.querySelectorAll(".section");

const resumeLists = document.querySelectorAll(".resume-list");
const resumeBoxs = document.querySelectorAll(".resume-box");

const portfolioLists = document.querySelectorAll(".portfolio-list");
const portfolioBoxs = document.querySelectorAll(".portfolio-box");

// 導航欄點擊事件
navs.forEach((nav, idx) => {
  nav.addEventListener("click", () => {
    document.querySelector(".nav-list li.active").classList.remove("active");
    nav.classList.add("active");

    cube.style.transform = `rotateY(${idx * -90}deg)`;

    document.querySelector(".section.active").classList.remove("active");
    sections[idx].classList.add("active");
  });
});

// 履歷標籤點擊事件
resumeLists.forEach((list, idx) => {
  list.addEventListener("click", () => {
    // 切換標籤
    document.querySelector(".resume-list.active").classList.remove("active");
    list.classList.add("active");

    document.querySelector(".resume-box.active").classList.remove("active");
    resumeBoxs[idx].classList.add("active");

    // 如果是技能標籤，重新執行動畫
    if (idx === 1) {
      animateSkillBars();
    }
  });
});

// 作品集標籤點擊事件
portfolioLists.forEach((list, index) => {
  list.addEventListener("click", () => {
    document.querySelector(".portfolio-list.active").classList.remove("active");
    list.classList.add("active");

    document.querySelector(".portfolio-box.active").classList.remove("active");
    portfolioBoxs[index].classList.add("active");
  });
});

// 技能進度條動畫函數
function animateSkillBars() {
  setTimeout(() => {
    const skillBox = document.querySelector('.resume-box.skills.active');
    if (!skillBox) return;

    const bars = skillBox.querySelectorAll('.skill-progress-bar');
    bars.forEach(bar => {
      // 獲取儲存的目標寬度
      const targetWidth = bar.getAttribute('data-target-width') || bar.style.width;

      // 先設為 0%
      bar.style.width = '0%';
      bar.style.transition = 'none';

      // 強制重排
      void bar.offsetWidth;

      // 恢復過渡效果並設定目標寬度
      bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
      bar.style.width = targetWidth;
    });
  }, 100);
}

// 技能進度條動畫
function animateSkillBars() {
  setTimeout(() => {
    const skillBox = document.querySelector('.resume-box.skills.active');
    if (!skillBox) return;

    const bars = skillBox.querySelectorAll('.skill-progress-bar');
    bars.forEach(bar => {
      // 獲取目標寬度
      const targetWidth = bar.getAttribute('data-target-width') || '0%';

      // 重設動畫
      bar.style.transition = 'none';
      bar.style.width = '0%';

      // 強制重排
      void bar.offsetWidth;

      // 恢復過渡並設定目標寬度
      bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
      bar.style.width = targetWidth;
    });
  }, 100);
}

// 初始化
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-progress-bar');
  bars.forEach(bar => {
    const width = bar.style.width;
    if (width) {
      bar.setAttribute('data-target-width', width);
    }
    bar.style.width = '0%';
  });

  // 如果技能標籤是啟用的，執行動畫
  if (document.querySelector('.resume-list.active')?.textContent.includes('Skills')) {
    setTimeout(animateSkillBars, 300);
  }
}

document.addEventListener('DOMContentLoaded', initSkillBars);


// ===== 全螢幕照片檢視功能 =====
function openFullscreen(imgSrc) {
  const modal = document.getElementById('fullscreen-modal');
  const modalImg = document.getElementById('fullscreen-img');

  modal.style.display = 'block';
  modalImg.src = imgSrc;
  document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
  const modal = document.getElementById('fullscreen-modal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeFullscreen();
});

document.getElementById('fullscreen-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeFullscreen();
});


// ===== 職業規劃標籤切換 =====
const careerTabs = document.querySelectorAll('.career-tab-list');
const devTimeline = document.getElementById('dev-timeline');
const networkTimeline = document.getElementById('network-timeline');

if (careerTabs.length > 0) {
  careerTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 移除所有 active
      careerTabs.forEach(t => t.classList.remove('active'));

      // 加上 active
      tab.classList.add('active');

      // 切換時間線
      const path = tab.getAttribute('data-path');
      if (path === 'dev') {
        devTimeline.classList.add('active');
        networkTimeline.classList.remove('active');
      } else {
        networkTimeline.classList.add('active');
        devTimeline.classList.remove('active');
      }
    });
  });
}