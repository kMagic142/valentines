'use strict';

const SanrioCharacters = (() => {
    function helloKittySVG(stroke = '#5A1A3A') {
        return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="52" rx="38" ry="34" fill="#fff" stroke="${stroke}" stroke-width="1.5"/>
            <ellipse cx="22" cy="26" rx="14" ry="16" fill="#fff" stroke="${stroke}" stroke-width="1.5"/>
            <ellipse cx="22" cy="26" rx="9" ry="11" fill="#FFD1DC"/>
            <ellipse cx="78" cy="26" rx="14" ry="16" fill="#fff" stroke="${stroke}" stroke-width="1.5"/>
            <ellipse cx="78" cy="26" rx="9" ry="11" fill="#FFD1DC"/>
            <ellipse cx="88" cy="18" rx="10" ry="7" fill="#C8507A" transform="rotate(-20,88,18)"/>
            <ellipse cx="72" cy="14" rx="10" ry="7" fill="#C8507A" transform="rotate(20,72,14)"/>
            <circle cx="80" cy="18" r="4" fill="#E8809A"/>
            <ellipse cx="36" cy="52" rx="4" ry="4.5" fill="${stroke}"/>
            <ellipse cx="64" cy="52" rx="4" ry="4.5" fill="${stroke}"/>
            <ellipse cx="50" cy="58" rx="3" ry="2.5" fill="#FFB347"/>
            <line x1="8" y1="48" x2="30" y2="52" stroke="${stroke}" stroke-width="1" opacity="0.5"/>
            <line x1="8" y1="56" x2="30" y2="56" stroke="${stroke}" stroke-width="1" opacity="0.5"/>
            <line x1="10" y1="64" x2="30" y2="60" stroke="${stroke}" stroke-width="1" opacity="0.5"/>
            <line x1="70" y1="52" x2="92" y2="48" stroke="${stroke}" stroke-width="1" opacity="0.5"/>
            <line x1="70" y1="56" x2="92" y2="56" stroke="${stroke}" stroke-width="1" opacity="0.5"/>
            <line x1="70" y1="60" x2="90" y2="64" stroke="${stroke}" stroke-width="1" opacity="0.5"/>
        </svg>`;
    }
    function kuromiSVG(stroke = '#5A1A3A') {
        return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="
                M 12 55
                Q 12 18, 50 14
                Q 88 18, 88 55
                Q 88 52, 50 52
                Q 12 52, 12 55 Z
            " fill="#2D2D2D" stroke="${stroke}" stroke-width="1.2"/>
            <ellipse cx="20" cy="28" rx="13" ry="18" fill="#2D2D2D" stroke="${stroke}" stroke-width="1.2"/>
            <ellipse cx="20" cy="22" rx="6" ry="8" fill="#E8809A" opacity="0.6"/>
            <ellipse cx="80" cy="28" rx="13" ry="18" fill="#2D2D2D" stroke="${stroke}" stroke-width="1.2"/>
            <ellipse cx="80" cy="22" rx="6" ry="8" fill="#E8809A" opacity="0.6"/>
            <path d="M 8 20 Q 4 6, 16 14" fill="#2D2D2D" stroke="${stroke}" stroke-width="1"/>
            <circle cx="6" cy="10" r="3.5" fill="#E8809A"/>
            <path d="M 92 20 Q 96 6, 84 14" fill="#2D2D2D" stroke="${stroke}" stroke-width="1"/>
            <circle cx="94" cy="10" r="3.5" fill="#E8809A"/>
            <ellipse cx="50" cy="62" rx="32" ry="26" fill="#fff" stroke="${stroke}" stroke-width="1.5"/>
            <path d="
                M 18 55
                Q 18 42, 50 38
                Q 82 42, 82 55
                Q 82 50, 50 48
                Q 18 50, 18 55 Z
            " fill="#2D2D2D"/>
            <circle cx="50" cy="36" r="7" fill="#E8809A"/>
            <circle cx="46" cy="34" r="2" fill="#2D2D2D"/>
            <circle cx="54" cy="34" r="2" fill="#2D2D2D"/>
            <ellipse cx="50" cy="39" rx="3" ry="2" fill="#2D2D2D" opacity="0.6"/>
            <line x1="40" y1="40" x2="60" y2="32" stroke="#E8809A" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="40" y1="32" x2="60" y2="40" stroke="#E8809A" stroke-width="1.8" stroke-linecap="round"/>
            <ellipse cx="38" cy="60" rx="5" ry="5.5" fill="${stroke}"/>
            <ellipse cx="62" cy="60" rx="5" ry="5.5" fill="${stroke}"/>
            <circle cx="36" cy="58" r="1.5" fill="#fff" opacity="0.8"/>
            <circle cx="60" cy="58" r="1.5" fill="#fff" opacity="0.8"/>
            <ellipse cx="50" cy="66" rx="2.5" ry="2" fill="#E8809A"/>
            <path d="M 43 71 Q 50 76, 57 71" fill="none" stroke="${stroke}" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M 50 14 Q 56 4, 62 8 Q 66 12, 60 14" fill="none" stroke="#2D2D2D" stroke-width="3" stroke-linecap="round"/>
            <path d="M 50 14 Q 56 4, 62 8 Q 66 12, 60 14" fill="none" stroke="#E8809A" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`;
    }
    function init() {
        const containers = document.querySelectorAll('.hello-kitty');
        containers.forEach(el => {
            const isCard = el.classList.contains('hk-card');
            const stroke = isCard ? '#C8507A' : '#5A1A3A';
            if (Math.random() < 0.5) {
                el.innerHTML = helloKittySVG(stroke);
            } else {
                el.innerHTML = kuromiSVG(stroke);
            }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { init, helloKittySVG, kuromiSVG };
})();

window.SanrioCharacters = SanrioCharacters;
