/* ============================================================================
   ING. RALDY LOPEZ — INTERACTIONS & ANIMATIONS
   Stack: GSAP 3 + ScrollTrigger, Lenis, Vanilla Tilt, Custom 3D Profile Card
   ============================================================================ */

// ============================================================
// PRELOADER
// ============================================================
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
    setTimeout(() => {
        if (preloader) preloader.classList.add('hidden');
    }, 300);
});

// ============================================================
// LENIS SMOOTH SCROLL
// ============================================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
});

gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ============================================================
// CUSTOM CURSOR + AMBIENT SPOTLIGHT
// ============================================================
const cursorDot = document.getElementById('cursorDot');
const cursorCircle = document.getElementById('cursorCircle');
const isTouch = window.matchMedia('(hover: none)').matches;

if (!isTouch && cursorDot && cursorCircle) {
    document.body.style.cursor = 'none';
    const interactiveSelector = 'a, button, .project-card, .service-card, .pc-card';
    document.querySelectorAll(interactiveSelector).forEach(el => {
        el.style.cursor = 'none';
    });

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.08, ease: 'none' });
        document.documentElement.style.setProperty('--mx', mouseX + 'px');
        document.documentElement.style.setProperty('--my', mouseY + 'px');
    });

    (function animateCircle() {
        circleX += (mouseX - circleX) * 0.1;
        circleY += (mouseY - circleY) * 0.1;
        cursorCircle.style.left = circleX + 'px';
        cursorCircle.style.top = circleY + 'px';
        requestAnimationFrame(animateCircle);
    })();

    document.querySelectorAll(interactiveSelector).forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorCircle.classList.add('expanded');
            cursorDot.classList.add('hidden');
        });
        el.addEventListener('mouseleave', () => {
            cursorCircle.classList.remove('expanded');
            cursorDot.classList.remove('hidden');
        });
    });

    document.addEventListener('mouseleave', () => {
        gsap.to([cursorDot, cursorCircle], { opacity: 0, duration: 0.2 });
    });
    document.addEventListener('mouseenter', () => {
        gsap.to([cursorDot, cursorCircle], { opacity: 1, duration: 0.2 });
    });
}

// ============================================================
// HEADER — SCROLL GLASSMORPHISM, ACTIVE NAV & MOBILE MENU
// ============================================================
const header = document.getElementById('header');
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navLinksList = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

if (hamburgerMenu && navLinksList) {
    hamburgerMenu.addEventListener('click', () => {
        const isOpen = navLinksList.classList.toggle('open');
        hamburgerMenu.classList.toggle('open', isOpen);
        hamburgerMenu.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (isOpen) lenis.stop();
        else lenis.start();
    });
}

const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const navSections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

function updateActiveNav() {
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40;
    let currentId = navSections[0]?.id || '';

    if (atBottom && navSections.length) {
        currentId = navSections[navSections.length - 1].id;
    } else {
        const triggerLine = Math.max(header.offsetHeight + 40, window.innerHeight * 0.32);
        for (const sec of navSections) {
            if (sec.getBoundingClientRect().top <= triggerLine) {
                currentId = sec.id;
            }
        }
    }

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('resize', updateActiveNav, { passive: true });
lenis.on('scroll', updateActiveNav);
updateActiveNav();

// Smooth scroll via Lenis for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            if (navLinksList && navLinksList.classList.contains('open')) {
                navLinksList.classList.remove('open');
                hamburgerMenu.classList.remove('open');
                hamburgerMenu.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                lenis.start();
            }
            lenis.scrollTo(target, { offset: -80, duration: 1.35 });
        }
    });
});

// ============================================================
// REACTBITS-STYLE 3D PROFILE CARD (TILT + HOLO FOIL + GLARE)
// ============================================================
const profileCard = document.getElementById('profileCard');

if (profileCard) {
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;
    let isHovering = false;

    const updateCardPointer = (clientX, clientY) => {
        const rect = profileCard.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;

        // Tilt toward cursor (max ±12deg)
        targetRotY = ((px - 50) / 50) * 12;
        targetRotX = -((py - 50) / 50) * 12;

        profileCard.style.setProperty('--pointer-x', `${px.toFixed(2)}%`);
        profileCard.style.setProperty('--pointer-y', `${py.toFixed(2)}%`);
        profileCard.style.setProperty('--bg-x', `${(25 + px * 0.5).toFixed(2)}%`);
        profileCard.style.setProperty('--bg-y', `${(25 + py * 0.5).toFixed(2)}%`);
        profileCard.style.setProperty('--holo-opacity', '1');
    };

    const resetCardPointer = () => {
        isHovering = false;
        targetRotX = 0;
        targetRotY = 0;
        profileCard.style.setProperty('--holo-opacity', '0');
    };

    profileCard.addEventListener('mouseenter', () => { isHovering = true; });
    profileCard.addEventListener('mousemove', (e) => updateCardPointer(e.clientX, e.clientY));
    profileCard.addEventListener('mouseleave', resetCardPointer);

    // Smooth touch tilt on mobile without blocking scroll
    profileCard.addEventListener('touchstart', (e) => {
        if (!e.touches[0]) return;
        isHovering = true;
        updateCardPointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    profileCard.addEventListener('touchmove', (e) => {
        if (!e.touches[0]) return;
        updateCardPointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    profileCard.addEventListener('touchend', resetCardPointer, { passive: true });
    profileCard.addEventListener('touchcancel', resetCardPointer, { passive: true });

    (function animateProfileCard() {
        const ease = isHovering ? 0.14 : 0.08;
        currentRotX += (targetRotX - currentRotX) * ease;
        currentRotY += (targetRotY - currentRotY) * ease;

        profileCard.style.setProperty('--rotate-x', `${currentRotX.toFixed(3)}deg`);
        profileCard.style.setProperty('--rotate-y', `${currentRotY.toFixed(3)}deg`);
        requestAnimationFrame(animateProfileCard);
    })();
}

// ============================================================
// HERO — FLOATING PROJECT CARDS (ALL 13 PROJECTS AROUND CENTER)
// ============================================================
const getCardConfigs = () => {
    const mobile = window.innerWidth <= 768;
    const scale = mobile ? 0.64 : 1;

    if (mobile) {
        return [
            { left: '-4%', top: '8%',  rot: -10, w: Math.round(145 * scale), depth: 0 },
            { left: '72%', top: '7%',  rot:   9, w: Math.round(145 * scale), depth: 0 },
            { left: '-6%', top: '34%', rot:   7, w: Math.round(140 * scale), depth: 0 },
            { left: '78%', top: '32%', rot:  -8, w: Math.round(145 * scale), depth: 0 },
            { left: '-5%', top: '62%', rot: -11, w: Math.round(145 * scale), depth: 0 },
            { left: '74%', top: '60%', rot:  10, w: Math.round(145 * scale), depth: 0 },
            { left: '4%',  top: '84%', rot:   6, w: Math.round(140 * scale), depth: 0 },
            { left: '68%', top: '84%', rot:  -7, w: Math.round(140 * scale), depth: 0 },
            { left: '34%', top: '4%',  rot:  -4, w: Math.round(130 * scale), depth: 0 },
            { left: '16%', top: '19%', rot:  11, w: Math.round(130 * scale), depth: 0 },
            { left: '62%', top: '18%', rot: -12, w: Math.round(130 * scale), depth: 0 },
            { left: '14%', top: '76%', rot:  -8, w: Math.round(130 * scale), depth: 0 },
            { left: '62%', top: '75%', rot:   8, w: Math.round(130 * scale), depth: 0 },
            { left: '36%', top: '88%', rot:   5, w: Math.round(130 * scale), depth: 0 },
            { left: '4%',  top: '48%', rot:  -6, w: Math.round(126 * scale), depth: 0 },
            { left: '78%', top: '48%', rot:   7, w: Math.round(126 * scale), depth: 0 },
            { left: '26%', top: '86%', rot:  -7, w: Math.round(126 * scale), depth: 0 },
        ];
    }

    // Perimeter ring framing the centered Profile Card (avoiding 36%–64% center band)
    return [
        // Left side (8 cards)
        { left: '2%',  top: '10%', rot: -10, w: Math.round(168 * scale), depth: 1.15 },
        { left: '17%', top: '16%', rot:   7, w: Math.round(156 * scale), depth: 0.85 },
        { left: '1%',  top: '39%', rot:   6, w: Math.round(176 * scale), depth: 1.40 },
        { left: '16%', top: '49%', rot: -11, w: Math.round(162 * scale), depth: 1.05 },
        { left: '3%',  top: '72%', rot:  -8, w: Math.round(170 * scale), depth: 1.25 },
        { left: '20%', top: '79%', rot:   9, w: Math.round(154 * scale), depth: 0.90 },
        { left: '24%', top: '6%',  rot:  -6, w: Math.round(148 * scale), depth: 0.75 },
        { left: '12%', top: '87%', rot:  -5, w: Math.round(146 * scale), depth: 0.80 },

        // Right side (9 cards)
        { left: '84%', top: '9%',  rot:   9, w: Math.round(168 * scale), depth: 1.10 },
        { left: '68%', top: '14%', rot:  -8, w: Math.round(156 * scale), depth: 0.85 },
        { left: '86%', top: '36%', rot:  -6, w: Math.round(178 * scale), depth: 1.45 },
        { left: '70%', top: '44%', rot:  10, w: Math.round(160 * scale), depth: 1.00 },
        { left: '83%', top: '67%', rot:  11, w: Math.round(170 * scale), depth: 1.30 },
        { left: '67%', top: '76%', rot:  -9, w: Math.round(158 * scale), depth: 0.95 },
        { left: '44%', top: '5%',  rot:  -4, w: Math.round(148 * scale), depth: 0.65 },
        { left: '74%', top: '86%', rot:   6, w: Math.round(146 * scale), depth: 0.80 },
        { left: '78%', top: '23%', rot:  -5, w: Math.round(150 * scale), depth: 0.90 },
    ];
};

let cardConfigs = getCardConfigs();
const floatCards = document.querySelectorAll('.hero-card-float');

floatCards.forEach((card, i) => {
    const cfg = cardConfigs[i % cardConfigs.length];
    if (!cfg) return;

    gsap.set(card, { left: cfg.left, top: cfg.top, rotation: cfg.rot, width: cfg.w, opacity: 0, y: 24 });

    gsap.to(card, {
        opacity: 0.14 + (i % 4) * 0.04,
        y: 0,
        duration: 1,
        delay: 0.65 + i * 0.07,
        ease: 'power3.out'
    });

    // Continuous organic float (y + rotation; x reserved for mouse parallax)
    const floatY = -12 + Math.random() * 24;
    const floatRot = cfg.rot + (Math.random() - 0.5) * 8;
    const floatDur = 2.6 + Math.random() * 2.4;
    gsap.timeline({ repeat: -1, yoyo: true, delay: Math.random() * 2 })
        .to(card, { y: floatY, rotation: floatRot, duration: floatDur, ease: 'sine.inOut' });
});

window.addEventListener('resize', () => {
    cardConfigs = getCardConfigs();
    floatCards.forEach((card, i) => {
        const cfg = cardConfigs[i];
        if (!cfg) return;
        gsap.set(card, { left: cfg.left, top: cfg.top, width: cfg.w });
    });
});

document.addEventListener('mousemove', (e) => {
    if (isTouch) return;
    const mx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    floatCards.forEach((card, i) => {
        if (!cardConfigs[i] || !cardConfigs[i].depth) return;
        gsap.to(card, { x: mx * cardConfigs[i].depth * 24, duration: 1.4, ease: 'power2.out' });
    });
});

// ============================================================
// HERO ENTRANCE TIMELINE (GSAP)
// ============================================================
const heroTl = gsap.timeline({ delay: 0.35 });
heroTl
    .from('.hero-deco', { opacity: 0, scale: 0.88, duration: 2.2, ease: 'power2.out' }, 0)
    .from('.pc-wrapper', { y: 42, opacity: 0, scale: 0.94, duration: 1.0, ease: 'power4.out' }, 0.25)
    .from('.word-slide', { y: '115%', stagger: 0.1, duration: 0.95, ease: 'power4.out' }, 0.55)
    .from('.pc-role', { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.95)
    .from('.hero-subtitle', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' }, 1.05)
    .from('.hero-scroll-indicator', { opacity: 0, duration: 0.6 }, 1.35);

// ============================================================
// CANVAS PARTICLES — HERO FIELD
// ============================================================
const heroCanvas = document.getElementById('heroCanvas');
if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let W = heroCanvas.width = window.innerWidth;
    let H = heroCanvas.height = window.innerHeight;

    const DOTS = 65;
    const CONNECT_DIST = 110;

    class Dot {
        constructor() { this.init(); }
        init() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.r = Math.random() * 1.2 + 0.4;
            this.a = Math.random() * 0.35 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W) this.vx *= -1;
            if (this.y < 0 || this.y > H) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.a})`;
            ctx.fill();
        }
    }

    const dots = Array.from({ length: DOTS }, () => new Dot());
    let heroVisible = true;

    function drawParticles() {
        ctx.clearRect(0, 0, W, H);
        dots.forEach(d => { d.update(); d.draw(); });

        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.07 * (1 - dist / CONNECT_DIST)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        if (heroVisible) requestAnimationFrame(drawParticles);
    }
    drawParticles();

    new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        if (heroVisible) drawParticles();
    }, { threshold: 0.08 }).observe(document.querySelector('.hero'));

    window.addEventListener('resize', () => {
        W = heroCanvas.width = window.innerWidth;
        H = heroCanvas.height = window.innerHeight;
    });
}

// ============================================================
// SCROLL REVEALS (SECTION HEADERS, SERVICES, PROJECT CARDS, CONTACT)
// ============================================================
gsap.utils.toArray('.section-header').forEach(headerEl => {
    const label = headerEl.querySelector('.section-label');
    const title = headerEl.querySelector('.section-title');
    const subtitle = headerEl.querySelector('.section-subtitle');

    if (label) {
        gsap.from(label, {
            scrollTrigger: { trigger: headerEl, start: 'top 84%', once: true },
            opacity: 0, y: 18, duration: 0.6
        });
    }
    if (title) {
        gsap.from(title, {
            scrollTrigger: { trigger: headerEl, start: 'top 82%', once: true },
            opacity: 0, y: 45, duration: 0.85, ease: 'power3.out', delay: 0.08
        });
    }
    if (subtitle) {
        gsap.from(subtitle, {
            scrollTrigger: { trigger: headerEl, start: 'top 80%', once: true },
            opacity: 0, y: 24, duration: 0.75, ease: 'power3.out', delay: 0.16
        });
    }
});

gsap.from('.services-hero-copy > *', {
    scrollTrigger: { trigger: '.services-showcase', start: 'top 80%', once: true },
    opacity: 0,
    y: 35,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out'
});

// Project cards — stagger per row
gsap.utils.toArray('.projects-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.project-card');
    cards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
            opacity: 0,
            y: 60,
            duration: 0.7,
            ease: 'power3.out',
            delay: (i % 3) * 0.08
        });
    });
});

gsap.from('.contact-copy > *', {
    scrollTrigger: { trigger: '.contact', start: 'top 80%', once: true },
    opacity: 0, y: 35, stagger: 0.1, duration: 0.75, ease: 'power3.out'
});

gsap.from('.feature-item', {
    scrollTrigger: { trigger: '.contact-features', start: 'top 82%', once: true },
    opacity: 0, y: 30, stagger: 0.12, duration: 0.7, ease: 'power3.out'
});

// ============================================================
// VANILLA TILT — 3D PROJECT CARDS + MOBILE TOUCH SUPPORT
// ============================================================
const projectCards = document.querySelectorAll('.project-card');
if (typeof VanillaTilt !== 'undefined' && projectCards.length) {
    VanillaTilt.init(projectCards, {
        max: 10,
        speed: 500,
        glare: true,
        'max-glare': 0.12,
        scale: 1.03,
        perspective: 900,
        gyroscope: false
    });

    projectCards.forEach(card => {
        card.addEventListener('touchstart', (e) => {
            if (!card.vanillaTilt || !e.touches[0]) return;
            const touch = e.touches[0];
            card.vanillaTilt.onMouseEnter();
            card.vanillaTilt.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }, { passive: true });

        card.addEventListener('touchmove', (e) => {
            if (!card.vanillaTilt || !e.touches[0]) return;
            const touch = e.touches[0];
            card.vanillaTilt.updateElementPosition();
            card.vanillaTilt.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }, { passive: true });

        const resetTilt = () => {
            if (card.vanillaTilt) card.vanillaTilt.onMouseLeave();
        };
        card.addEventListener('touchend', resetTilt, { passive: true });
        card.addEventListener('touchcancel', resetTilt, { passive: true });
    });
}

// ============================================================
// MAGNETIC BUTTONS
// ============================================================
if (!isTouch) {
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
            gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        });
    });
}
