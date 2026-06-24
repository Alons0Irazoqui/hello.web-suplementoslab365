/* ============================================================
   LAB 365 — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------
       1. ENTERPRISE LOADER
    ---------------------------------------------------------- */
    const loader      = document.getElementById('loader-wrapper');
    const mainContent = document.getElementById('main-content');
    const progressFill = document.querySelector('.loader-progress-fill');

    // Simulate realistic loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        const step = Math.random() * 14 + 4;
        progress = Math.min(92, progress + step); // Stops at 92 until we force 100
        progressFill.style.width = progress + '%';
    }, 130);

    // Minimum display time = 2000ms for a polished enterprise feel
    setTimeout(() => {
        clearInterval(progressInterval);
        progressFill.style.width = '100%';

        // Brief pause at 100%, then fade out
        setTimeout(() => {
            loader.classList.add('hide-loader');

            setTimeout(() => {
                loader.style.display = 'none';
                mainContent.classList.add('visible');

                // Trigger hero WOW animations
                document.body.classList.add('page-loaded');

                // Init canvas particles, H1 typewriter and stat counters
                initHeroCanvas();
                initTypewriter();
                animateCounters();
            }, 900);
        }, 320);
    }, 2000);


    /* ----------------------------------------------------------
       2. NAVBAR SCROLL EFFECT
    ---------------------------------------------------------- */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });


    /* ----------------------------------------------------------
       3. MOBILE MENU TOGGLE
    ---------------------------------------------------------- */
    const mobileBtn  = document.getElementById('mobile-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            mobileBtn.innerHTML = isOpen
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });
    }


    /* ----------------------------------------------------------
       4. INTERSECTION OBSERVER — SCROLL REVEAL
    ---------------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));


    /* ----------------------------------------------------------
       5. WHATSAPP FORM HANDLER
    ---------------------------------------------------------- */
    const waForm = document.getElementById('whatsapp-form');

    if (waForm) {
        waForm.addEventListener('submit', e => {
            e.preventDefault();

            const name    = document.getElementById('field-name').value.trim();
            const product = document.getElementById('field-product').value;
            const details = document.getElementById('field-details').value.trim();
            const phone   = '526645865756'; // LAB 365 — Tijuana

            const lines = [
                '*🌿 NUEVO PEDIDO — LAB 365*',
                '',
                `*Nombre:* ${name}`,
                `*Producto:* ${product}`,
                details ? `*Detalles:* ${details}` : '',
                '',
                '_Hola, estoy interesado en recibir más información para concretar mi compra. ¡Gracias!_'
            ].filter(l => l !== undefined).join('\n');

            const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(lines)}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
            waForm.reset();
        });
    }


    /* ----------------------------------------------------------
       6. PRODUCT "PEDIR" BUTTONS → WhatsApp
    ---------------------------------------------------------- */
    document.querySelectorAll('.product-btn[data-product]').forEach(btn => {
        btn.addEventListener('click', () => {
            const productName = btn.getAttribute('data-product');
            const phone       = '526645865756';
            const text        = `*🌿 CONSULTA DE PRODUCTO — LAB 365*\n\nHola, me interesa: *${productName}*\n\n¿Podría darme más información y disponibilidad? ¡Gracias!`;
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
        });
    });


    /* ----------------------------------------------------------
       7. H1 TYPEWRITER — rota la palabra dorada del título
    ---------------------------------------------------------- */
    function initTypewriter() {
        const target = document.getElementById('h1-tw');
        if (!target) return;

        // Palabras que van después de "QUE TE " → mantiene coherencia gramatical
        const words = [
            'HACE BIEN.',
            'DA FUERZA.',
            'CUIDA.',
            'TRANSFORMA.',
            'MEJORA.',
            'FORTALECE.',
        ];

        // Start with first word shown; immediately begin cycling
        let wIdx = 0, cIdx = words[0].length, deleting = true;
        target.textContent = words[0];

        function tick() {
            const word = words[wIdx];

            if (deleting) {
                cIdx--;
            } else {
                cIdx++;
            }

            target.textContent = word.slice(0, cIdx);

            let delay = deleting ? 52 : 95;

            if (!deleting && cIdx === word.length) {
                delay = 2200;     // pause while word is fully visible
                deleting = true;
            } else if (deleting && cIdx === 0) {
                deleting = false;
                wIdx = (wIdx + 1) % words.length;
                delay = 320;      // brief pause before typing next word
            }

            setTimeout(tick, delay);
        }

        // Start right after hero entry animations finish (~1s)
        setTimeout(tick, 1000);
    }


    /* ----------------------------------------------------------
       8. COUNTER ANIMATION — stats count up from 0
    ---------------------------------------------------------- */
    function animateCounters() {
        document.querySelectorAll('.hero-stat-num[data-to]').forEach(el => {
            const to       = parseFloat(el.getAttribute('data-to'));
            const prefix   = el.getAttribute('data-prefix')  || '';
            const suffix   = el.getAttribute('data-suffix')  || '';
            const duration = 1600;
            const startTs  = performance.now();

            const step = (now) => {
                const elapsed  = now - startTs;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased    = 1 - Math.pow(1 - progress, 3);
                const value    = Math.floor(eased * to);
                el.textContent = prefix + value + suffix;
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = prefix + to + suffix;
            };

            // Small delay so counters fire after the hero animates in
            setTimeout(() => requestAnimationFrame(step), 900);
        });
    }


    /* ----------------------------------------------------------
       9. HERO CANVAS — ENHANCED PARTICLE SYSTEM
    ---------------------------------------------------------- */
    function initHeroCanvas() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 180 };

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            buildParticles();
        };

        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        window.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        window.addEventListener('resize', resize, { passive: true });

        // Gold palette variants
        const GOLD_COLORS = [
            (a) => `rgba(212, 175, 55, ${a})`,
            (a) => `rgba(184, 134, 11, ${a * 0.85})`,
            (a) => `rgba(243, 229, 171, ${a * 1.2})`,
            (a) => `rgba(200, 160, 40, ${a})`,
        ];

        class Particle {
            constructor() { this.reset(); }

            reset() {
                this.x  = Math.random() * canvas.width;
                this.y  = Math.random() * canvas.height;

                // 18% chance of being a larger "node" particle
                this.isNode = Math.random() < 0.18;
                this.size   = this.isNode
                    ? Math.random() * 2.2 + 2.2   // nodes: 2.2–4.4 px
                    : Math.random() * 1.4 + 0.3;   // dots : 0.3–1.7 px

                // Slightly faster nodes so they feel "alive"
                const speed = this.isNode ? 0.55 : 0.42;
                this.dx = (Math.random() - 0.5) * speed;
                this.dy = (Math.random() - 0.5) * speed;

                const alpha    = Math.random() * 0.38 + 0.12;
                const colorFn  = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
                this.color     = colorFn(alpha);
                this.glowColor = colorFn(alpha * 0.22);
            }

            draw() {
                // Glow halo for node particles
                if (this.isNode) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 3.2, 0, Math.PI * 2);
                    const gradient = ctx.createRadialGradient(
                        this.x, this.y, 0,
                        this.x, this.y, this.size * 3.2
                    );
                    gradient.addColorStop(0,   this.glowColor);
                    gradient.addColorStop(1,   'rgba(212,175,55,0)');
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }

                // Core dot
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x < 0 || this.x > canvas.width)  this.dx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

                // Mouse repulsion — stronger push radius
                if (mouse.x !== undefined) {
                    const ddx  = mouse.x - this.x;
                    const ddy  = mouse.y - this.y;
                    const dist = Math.sqrt(ddx * ddx + ddy * ddy);
                    if (dist < mouse.radius + this.size) {
                        const push = this.isNode ? 3.2 : 2.4;
                        if (mouse.x < this.x && this.x < canvas.width  - 14) this.x += push;
                        if (mouse.x > this.x && this.x > 14)                 this.x -= push;
                        if (mouse.y < this.y && this.y < canvas.height - 14) this.y += push;
                        if (mouse.y > this.y && this.y > 14)                 this.y -= push;
                    }
                }

                this.x += this.dx;
                this.y += this.dy;
                this.draw();
            }
        }

        function buildParticles() {
            particles = [];
            // ~2.5× more particles than before
            const count = Math.floor((canvas.width * canvas.height) / 4800);
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        function connectParticles() {
            // Slightly larger connection radius
            const maxDist = (canvas.width / 6.2) * (canvas.height / 6.2);

            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx   = particles[a].x - particles[b].x;
                    const dy   = particles[a].y - particles[b].y;
                    const dist = dx * dx + dy * dy;

                    if (dist < maxDist) {
                        const t = 1 - dist / maxDist;

                        // Gold connections between nodes, dark between regular particles
                        const bothNodes = particles[a].isNode && particles[b].isNode;
                        if (bothNodes) {
                            ctx.strokeStyle = `rgba(212, 175, 55, ${t * 0.22})`;
                            ctx.lineWidth   = 0.9;
                        } else {
                            ctx.strokeStyle = `rgba(17, 24, 39, ${t * 0.09})`;
                            ctx.lineWidth   = 0.6;
                        }

                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.update());
            connectParticles();
        }

        resize();
        animate();
    }

}); // end DOMContentLoaded
