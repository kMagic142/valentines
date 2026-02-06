'use strict';

class RoseFlower {
    static PALETTES = {
        red: {
            petal:    '#C8507A',
            petalDk:  '#A63D62',
            petalDp:  '#8B2252',
            glow:     '#FFB6C1',
            stem:     '#2d6a3f',
            stemLt:   '#3d8a55',
            leaf:     '#2d6a3f',
            leafIn:   '#3d8a55',
        },
        pink: {
            petal:    '#E8809A',
            petalDk:  '#D4728C',
            petalDp:  '#C8507A',
            glow:     '#FFD1DC',
            stem:     '#3d8a55',
            stemLt:   '#4a9c62',
            leaf:     '#3d8a55',
            leafIn:   '#4a9c62',
        },
        pastel: {
            petal:    '#FFB6C1',
            petalDk:  '#E8809A',
            petalDp:  '#D4728C',
            glow:     '#FFD1DC',
            stem:     '#4a9c62',
            stemLt:   '#5aad72',
            leaf:     '#4a9c62',
            leafIn:   '#5aad72',
        },
    };

    static create(container, options = {}) {
        const {
            palette    = 'red',
            bloomDelay = 0,
            small      = false,
        } = options;

        const C = RoseFlower.PALETTES[palette] || RoseFlower.PALETTES.red;

        container.innerHTML = '';
        container.style.setProperty('--rose-delay', `${bloomDelay}ms`);

        const petals = document.createElement('div');
        petals.className = 'cp-petals';
        for (let i = 0; i < 7; i++) {
            const p = document.createElement('div');
            if (i === 0) {
                p.style.background = C.petal;
                p.style.boxShadow  = `0 0 ${small ? 12 : 20}px ${C.glow}`;
            } else if (i === 1 || i === 2) {
                p.style.background = C.petalDk;
                p.style.boxShadow  = `0 0 ${small ? 18 : 30}px ${C.glow}80`;
            } else if (i === 3 || i === 4) {
                p.style.background = C.petalDk;
                p.style.boxShadow  = `0 0 ${small ? 18 : 30}px ${C.glow}80`;
            } else {
                p.style.background = C.petalDp;
                p.style.boxShadow  = `0 0 ${small ? 18 : 30}px ${C.glow}4D`;
            }
            petals.appendChild(p);
        }
        container.appendChild(petals);
        const stem = document.createElement('div');
        stem.className = 'cp-stem';
        stem.style.background = C.stem;
        container.appendChild(stem);
        const leaves = document.createElement('div');
        leaves.className = 'cp-leaves';
        for (let i = 0; i < 2; i++) {
            const l = document.createElement('div');
            l.style.background = C.leaf;
            l.style.boxShadow  = `inset ${i === 0 ? '3px' : '-3px'} 3px ${C.leafIn}`;
            leaves.appendChild(l);
        }
        container.appendChild(leaves);
        const thorns = document.createElement('div');
        thorns.className = 'cp-thorns';
        for (let i = 0; i < 3; i++) {
            const t = document.createElement('div');
            if (i % 2 === 0) {
                t.style.borderLeft = `4px solid ${C.stem}`;
            } else {
                t.style.borderRight = `4px solid ${C.stem}`;
            }
            thorns.appendChild(t);
        }
        container.appendChild(thorns);
        const calyx = document.createElement('div');
        calyx.className = 'cp-calyx';
        calyx.style.background = C.stem;
        container.appendChild(calyx);

        container._roseReady = true;
        return container;
    }

    static bloom(container) {
        if (!container._roseReady) return;
        container.classList.add('bloom');
    }
    static initPageRoses(pageId, delay = 300) {
        const page = document.getElementById(pageId);
        if (!page) return;

        const roses    = page.querySelectorAll('.rose');
        const palettes = ['red', 'pink', 'pastel'];

        roses.forEach((rose, index) => {
            const palette = palettes[index % palettes.length];
            const isSmall = rose.classList.contains('rose-small');

            RoseFlower.create(rose, {
                palette,
                bloomDelay: delay + index * 200,
                small:      isSmall,
            });

            setTimeout(() => {
                RoseFlower.bloom(rose);
            }, delay + 100 + index * 200);
        });
    }
}

window.RoseFlower = RoseFlower;

window.RoseFlower = RoseFlower;
