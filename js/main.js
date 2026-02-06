'use strict';
const App = {
    currentPage: 0,
    pages: ['page-password', 'page-welcome', 'page-question', 'page-celebrate'],
    PASSWORD: 'teiubescmult',
    TOGETHER_DATE: new Date(2024, 11, 1),

    noClickCount: 0,
    MAX_NO_CLICKS: 5,
    noTexts: [
        'gandeste-te din nou',
        'esti sigura? 🥺',
        'hai, te rog! 💕',
        'nu se accepta nu! 😤',
        'ultimul click, promit 🤞',
    ],

    petalSystem: null,
    celebrationStop: null,
    isTransitioning: false,
    initializedPages: new Set(),
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

App.init = function () {
    const canvas = document.getElementById('particle-canvas');
    App.petalSystem = new RosePetalSystem(canvas, {
        maxPetals: window.innerWidth < 480 ? 20 : 40,
        spawnRate: 0.25,
    });
    App.petalSystem.start();

    App.setupPasswordPage();
    App.setupWelcomePage();
    App.setupQuestionPage();

    App.initializedPages.add('page-password');

    App.animatePageEntrance('page-password');
};
App.transitionTo = function (targetPageId, delay = 100) {
    if (App.isTransitioning) return;
    App.isTransitioning = true;

    const currentPageEl = document.getElementById(App.pages[App.currentPage]);
    const targetPageEl = document.getElementById(targetPageId);
    const targetIndex = App.pages.indexOf(targetPageId);

    if (!currentPageEl || !targetPageEl || targetIndex === -1) {
        App.isTransitioning = false;
        return;
    }

    currentPageEl.classList.add('exiting');
    currentPageEl.classList.remove('active');
    setTimeout(() => {
        currentPageEl.classList.remove('exiting');
        targetPageEl.classList.add('active');
        App.currentPage = targetIndex;
        if (!App.initializedPages.has(targetPageId)) {
            App.initializedPages.add(targetPageId);
            App.initPage(targetPageId);
        }
        App.animatePageEntrance(targetPageId);
        setTimeout(() => {
            App.isTransitioning = false;
        }, 700);
    }, delay + 500);
};
App.initPage = function (pageId) {
    switch (pageId) {
        case 'page-welcome':
            RoseFlower.initPageRoses('page-welcome', 500);
            break;
        case 'page-question':
            RoseFlower.initPageRoses('page-question', 400);
            break;
        case 'page-celebrate':
            RoseFlower.initPageRoses('page-celebrate', 300);
            App.startCelebration();
            App.updateDaysCounter();
            break;
    }
};

App.animatePageEntrance = function (pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;

    const animElements = page.querySelectorAll('.title-anim, .subtitle-anim');
    animElements.forEach((el, i) => {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = `fadeSlideUp 0.8s ease-out ${i * 0.15}s forwards`;
    });
};

App.setupPasswordPage = function () {
    const input = document.getElementById('password-input');
    const errorEl = document.getElementById('password-error');

    if (!input) return;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            App.checkPassword(input.value.trim().toLowerCase());
        }
    });

    input.addEventListener('input', () => {
        if (!errorEl.classList.contains('hidden')) {
            errorEl.classList.add('hidden');
        }
    });
};

App.checkPassword = function (value) {
    const errorEl = document.getElementById('password-error');
    const card = document.querySelector('.password-card');

    if (value === App.PASSWORD) {
        card.classList.add('success');

        EmojiCelebration.burst({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            count: 15,
            emojis: ['💖', '💕', '✨', '🔓', '💗'],
        });

        setTimeout(() => {
            App.transitionTo('page-welcome', 200);
        }, 400);
    } else {
        errorEl.classList.remove('hidden');

        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'shakeError 0.5s ease, cardFloat 6s ease-in-out infinite';
    }
};

App.setupWelcomePage = function () {
    const page = document.getElementById('page-welcome');
    if (!page) return;

    page.addEventListener('click', () => {
        if (App.currentPage !== 1) return;
        App.transitionTo('page-question');
    });
};


App.setupQuestionPage = function () {
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');

    if (!btnYes || !btnNo) return;

    btnYes.addEventListener('click', (e) => {
        e.stopPropagation();

        const rect = btnYes.getBoundingClientRect();
        EmojiCelebration.burst({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            count: 40,
            emojis: ['🎉', '🥳', '💕', '💖', '🌹', '✨', '💗', '🎊', '❤️'],
            duration: 2500,
        });

        btnYes.style.transform = 'scale(1.3)';
        btnYes.style.boxShadow = '0 0 60px rgba(200, 80, 122, 0.5)';

        setTimeout(() => {
            App.transitionTo('page-celebrate', 300);
        }, 800);
    });

    btnNo.addEventListener('click', (e) => {
        e.stopPropagation();
        App.handleNoClick(btnYes, btnNo);
    });
};


App.handleNoClick = function (btnYes, btnNo) {
    App.noClickCount++;

    const growLevel = Math.min(App.noClickCount, App.MAX_NO_CLICKS);

    for (let i = 1; i <= App.MAX_NO_CLICKS; i++) {
        btnYes.classList.remove(`grow-${i}`);
    }
    btnYes.classList.add(`grow-${growLevel}`);

    const textIndex = Math.min(App.noClickCount - 1, App.noTexts.length - 1);
    btnNo.textContent = App.noTexts[textIndex];
    btnNo.classList.add('shrink');

    const rect = btnNo.getBoundingClientRect();
    EmojiCelebration.burst({
        x: rect.left + rect.width / 2,
        y: rect.top,
        count: 3,
        emojis: ['🥺', '💔', '😢'],
        duration: 1500,
    });

    if (App.noClickCount >= App.MAX_NO_CLICKS) {
        setTimeout(() => {
            btnNo.style.opacity = '0';
            btnNo.style.pointerEvents = 'none';
        }, 300);
    }
};


App.startCelebration = function () {
    setTimeout(() => {
        EmojiCelebration.burst({
            x: window.innerWidth / 2,
            y: window.innerHeight * 0.3,
            count: 50,
            emojis: ['🎉', '🥳', '💕', '💖', '🌹', '✨', '💗', '🎊', '❤️', '💘'],
            duration: 3500,
        });
    }, 500);

    App.celebrationStop = EmojiCelebration.continuous({
        interval: 2000,
        burstCount: 5,
        emojis: ['💕', '💖', '🌹', '✨', '💗', '❤️'],
    });
};

App.updateDaysCounter = function () {
    const counterEl = document.getElementById('days-counter');
    if (!counterEl) return;

    const now = new Date();
    const diff = now - App.TOGETHER_DATE;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    counterEl.textContent = `${days} zile de cand suntem impreuna 💕`;
};

window.ValentineApp = App;
