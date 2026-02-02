const navs = document.querySelectorAll(".nav-list li");
const cube = document.querySelector(".box");
const sections = document.querySelectorAll(".section");

const resumeLists = document.querySelectorAll(".resume-list");
const resumeBoxs = document.querySelectorAll(".resume-box");

const portfolioLists = document.querySelectorAll(".portfolio-list");
const portfolioBoxs = document.querySelectorAll(".portfolio-box");

// navbar actions and all section actions along with cube rotation when navbar is clicked
navs.forEach((nav, idx) => {
  nav.addEventListener("click", (_) => {
    document.querySelector(".nav-list li.active").classList.remove("active");
    nav.classList.add("active");

    cube.style.transform = `rotateY(${idx * -90}deg)`;

    document.querySelector(".section.active").classList.remove("active");
    sections[idx].classList.add("active");

    const array = Array.from(sections);
    const arrSecs = array.slice(1, -1); // 只需要索引1、2、3或者不需要开始和结束索引
    arrSecs.forEach((arrSecs) => {
      if (arrSecs.classList.contains("active")) {
        sections[4].classList.add("action-contact");
      }
    });

    if (sections[0].classList.contains("active")) {
      sections[4].classList.remove("action-contact");
    }
  });
});

// resume section when clicking tab-list
resumeLists.forEach((list, idx) => {
  list.addEventListener("click", () => {
    // 找出当前存在active类的元素，把它身上的active删掉
    document.querySelector(".resume-list.active").classList.remove("active");
    list.classList.add("active");

    document.querySelector(".resume-box.active").classList.remove("active");
    resumeBoxs[idx].classList.add("active");
  });
});

// portfolio section when clicking tab-list
portfolioLists.forEach((list, index) => {
  list.addEventListener("click", (_) => {
    document.querySelector(".portfolio-list.active").classList.remove("active");
    list.classList.add("active");

    document.querySelector(".portfolio-box.active").classList.remove("active");
    portfolioBoxs[index].classList.add("active");
  });
});

// visibility for contact section when reloading (cube reloading animation)
setTimeout(() => {
  sections[4].classList.remove("active");
}, 1500);
