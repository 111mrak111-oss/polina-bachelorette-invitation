// Все персональные тексты и данные приглашения редактируются здесь.
const invitationConfig = {
  introTitle: "Полина, для тебя кое-что приготовили…",
  inviteKicker: "особенное приглашение",
  inviteTitle: "Дорогая Полина! Это приглашение на твой девичник!",
  inviteText: "Совсем скоро мы соберёмся вместе, чтобы смеяться, обнимать тебя и создавать воспоминания, которые останутся с нами надолго.",
  programTitle: "Что тебя ждёт?",
  programOneTitle: "Любимые подруги",
  programOneText: "Те самые разговоры, искренний смех и много тёплых объятий.",
  programTwoTitle: "Сюрпризы",
  programTwoText: "Немного волшебства, которое мы бережно приготовили только для тебя.",
  programThreeTitle: "Наш вечер",
  programThreeText: "Красивый, уютный и совершенно незабываемый — такой, как ты.",
  prepTitle: "Маленькая подготовка к большому празднику",
  prepBring: "Бери с собой купальник и вещи для ночёвки.",
  prepOutfit: "Наряд на вечер уже будет ждать тебя на месте!",
  date: "7 ноября",
  time: "Вечернее",
  place: "Карета приедет за тобой — просто будь готова вовремя ♡",
  finalTitle: "Полина, этот вечер будет особенным!",
  signature: "С любовью, твои подружки ♡"
};

document.querySelectorAll("[data-config]").forEach((element) => {
  const value = invitationConfig[element.dataset.config];
  if (typeof value === "string") element.textContent = value;
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const openButton = document.querySelector("#open-invitation");
const body = document.body;
let isOpened = false;

function revealInvitation() {
  if (isOpened) return;
  isOpened = true;
  openButton.setAttribute("aria-expanded", "true");
  body.classList.remove("intro-locked");
  body.classList.add("invitation-opened");
  document.querySelector(".cat--intro").style.zIndex = "10";
  hidePeek();

  if (reduceMotion || !window.gsap) {
    document.querySelector(".seal").style.opacity = "0";
    document.querySelector(".envelope__flap").style.transform = "rotateX(180deg)";
    document.querySelector(".envelope__letter").style.transform = "translateY(-45%)";
    document.querySelector(".cat--reach").style.opacity = "1";
    document.querySelector("#invitation").scrollIntoView();
    return;
  }

  const timeline = gsap.timeline({
    defaults: { ease: "power3.inOut" },
    onComplete: () => document.querySelector("#invitation").scrollIntoView({ behavior: "smooth" })
  });

  timeline
    .to(".seal", { scale: 0, rotate: 22, opacity: 0, duration: .38 })
    .to(".envelope__flap", { rotateX: 180, duration: .7, transformOrigin: "top center" }, "<.08")
    .set(".envelope__flap", { zIndex: 1 })
    .to(".envelope__letter", { yPercent: -48, duration: .85 })
    .to(".cat--reach", { x: 0, rotate: 0, opacity: 1, duration: .55 }, "<.28")
    .to(".envelope-scene", { y: -8, duration: .35, yoyo: true, repeat: 1 }, "<")
    .to(".open-label, .intro__hint", { opacity: 0, duration: .25 }, "<");
}

function showPeek() {
  if (isOpened) return;
  const peek = document.querySelector(".cat--peek");
  if (window.gsap && !reduceMotion) {
    gsap.to(peek, { opacity: 1, x: 0, y: 0, rotate: 2, scale: 1, duration: .35, ease: "back.out(1.8)" });
  } else {
    peek.style.opacity = "1";
    peek.style.transform = "none";
  }
}

function hidePeek() {
  const peek = document.querySelector(".cat--peek");
  if (window.gsap && !reduceMotion) {
    gsap.to(peek, { opacity: 0, xPercent: 25, yPercent: 25, rotate: 8, scale: .7, duration: .25 });
  } else {
    peek.style.opacity = "0";
    peek.style.transform = "translate(25%, 25%) rotate(8deg) scale(.7)";
  }
}

openButton.addEventListener("click", revealInvitation);
openButton.addEventListener("pointerdown", showPeek);
openButton.addEventListener("pointerup", hidePeek);
openButton.addEventListener("pointercancel", hidePeek);
openButton.addEventListener("pointerleave", hidePeek);
openButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") showPeek();
});
openButton.addEventListener("keyup", (event) => {
  if (event.key === "Enter" || event.key === " ") hidePeek();
});

if (reduceMotion) {
  body.classList.remove("intro-locked");
} else if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".intro__eyebrow, .intro__title", { y: 18, duration: .8, stagger: .12, ease: "power2.out", clearProps: "transform" });
  gsap.from(".envelope-scene", { y: 25, scale: .96, duration: 1, delay: .2, ease: "power3.out", clearProps: "transform" });

  gsap.utils.toArray(".reveal").forEach((element) => {
    gsap.from(element, {
      y: 34,
      duration: .9,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: { trigger: element, start: "top 88%", once: true }
    });
  });

  gsap.utils.toArray(".program-card__cat").forEach((cat, index) => {
    gsap.fromTo(cat,
      { autoAlpha: 0, xPercent: -50, y: -38, scale: .82, rotate: index === 1 ? 7 : -7 },
      {
        autoAlpha: 1,
        xPercent: -50,
        y: 0,
        scale: 1,
        rotate: 0,
        duration: .85,
        delay: index * .18,
        ease: "back.out(1.35)",
        scrollTrigger: { trigger: cat.closest(".program-card"), start: "top 84%", once: true }
      }
    );
  });

  gsap.utils.toArray(".float-cat").forEach((cat) => {
    gsap.to(cat, {
      y: -16,
      rotate: 1.5,
      ease: "none",
      scrollTrigger: { trigger: cat, start: "top bottom", end: "bottom top", scrub: 1.5 }
    });
  });

  gsap.to(".cats-together", {
    y: -12,
    ease: "none",
    scrollTrigger: { trigger: ".finale", start: "top bottom", end: "bottom bottom", scrub: 1.5 }
  });
}

// Проверяем загрузку всех котиков, не прерывая показ сайта при ошибке.
const catImages = [...document.querySelectorAll("img[src^='./images/cats/']")];
Promise.all(catImages.map((image) => image.complete
  ? Promise.resolve(image.naturalWidth > 0)
  : new Promise((resolve) => {
      image.addEventListener("load", () => resolve(true), { once: true });
      image.addEventListener("error", () => resolve(false), { once: true });
    })
)).then((results) => {
  const failed = results.filter((loaded) => !loaded).length;
  if (failed) console.warn(`Не удалось загрузить изображений: ${failed}`);
  if (window.ScrollTrigger) ScrollTrigger.refresh();
});
