// gsap-animations.js - Premium 3D Scroll Animations
document.addEventListener("DOMContentLoaded", () => {
    // Make sure GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- LENIS SMOOTH SCROLL (Optimized for Apple/Stripe feel) ---
    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    
    // Global GSAP Defaults
    gsap.config({ force3D: true });


    // 1. Navbar Scroll Effect
    const navbar = document.querySelector("#navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. Mesh Gradient Mouse Movement
    const meshContainer = document.querySelector(".mesh-gradient-container");
    if (meshContainer) {
        window.addEventListener("mousemove", (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 50;
            const yPos = (clientY / window.innerHeight - 0.5) * 50;
            
            gsap.to(".mesh-orb", {
                x: xPos,
                y: yPos,
                duration: 2,
                ease: "power2.out",
                stagger: 0.1
            });
        });
    }

    // 6. Text Scramble Reveal
    const scrambleTexts = document.querySelectorAll(".section-title-3d, .hero-cinematic h1");
    scrambleTexts.forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                onEnter: () => {
                    const originalText = el.innerText;
                    const chars = "!<>-_\\/[]{}—=+*^?#________";
                    let iteration = 0;
                    const interval = setInterval(() => {
                        el.innerText = originalText.split("")
                            .map((char, index) => {
                                if (index < iteration) return originalText[index];
                                return chars[Math.floor(Math.random() * chars.length)];
                            })
                            .join("");
                        if (iteration >= originalText.length) clearInterval(interval);
                        iteration += 1 / 3;
                    }, 30);
                }
            }
        });
    });

    // 4. Premium Custom Cursor (Optimized with QuickSetter)
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorRing = document.querySelector(".cursor-ring");

    if (cursorDot && cursorRing) {
        const xDotSetter = gsap.quickSetter(cursorDot, "x", "px");
        const yDotSetter = gsap.quickSetter(cursorDot, "y", "px");
        const xRingSetter = gsap.quickSetter(cursorRing, "x", "px");
        const yRingSetter = gsap.quickSetter(cursorRing, "y", "px");

        window.addEventListener("mousemove", (e) => {
            xDotSetter(e.clientX);
            yDotSetter(e.clientY);
            
            gsap.to({}, {
                duration: 0.15,
                onUpdate: () => {
                    xRingSetter(e.clientX);
                    yRingSetter(e.clientY);
                }
            });
        });

        // Global Hover Effect System
        const handleHover = (isHovering, el) => {
            gsap.to(cursorRing, {
                scale: isHovering ? 1.5 : 1,
                width: isHovering ? 60 : 40,
                height: isHovering ? 60 : 40,
                borderColor: isHovering ? "rgba(0, 212, 255, 1)" : "rgba(0, 212, 255, 0.5)",
                backgroundColor: isHovering ? "rgba(0, 212, 255, 0.1)" : "transparent",
                duration: 0.4,
                ease: "power2.out"
            });
            gsap.to(cursorDot, {
                scale: isHovering ? 0 : 1,
                duration: 0.3
            });
        };

        // All interactive elements across the site
        const interactSelectors = "a, button, .feature-card-3d, .product-card-compact, .timeline-card, .nav-links a, .btn-neon, .social-links a";
        const interactables = document.querySelectorAll(interactSelectors);
        
        interactables.forEach(el => {
            el.addEventListener("mouseenter", () => handleHover(true, el));
            el.addEventListener("mouseleave", () => handleHover(false, el));
        });
    }

    // 5. Magnetic Buttons Effect (Enhanced)
    const magneticBtns = document.querySelectorAll(".btn-primary-platinum, .btn-outline-platinum");
    magneticBtns.forEach(btn => {
        btn.addEventListener("mousemove", (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = btn.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            
            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3,
                ease: "power2.out"
            });
            // Also pull the cursor ring
            gsap.to(cursorRing, {
                x: clientX,
                y: clientY,
                duration: 0.1
            });
        });

        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });


    const section = document.querySelector("#services-offer-3d");
    if (!section) return;

    const heading = section.querySelector(".section-title-3d");
    const tag = section.querySelector(".section-tag");
    const cards = section.querySelectorAll(".service-tilt");
    const container = section.querySelector(".container");
    
    // Check for mobile to disable heavy 3D effects
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (!isMobile) {
        // Desktop Premium 3D Animations

        // 1. Section Depth & Perspective setup
        gsap.set(section, { perspective: 1200 });
        gsap.set(container, { transformStyle: "preserve-3d" });

        // 2. Parallax and 3D effect on entire section content wrapping
        gsap.to(container, {
            z: 80,
            rotationY: 3,
            rotationX: 2,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            }
        });
        
        // 3. Heading & Tag subtle 3D parallax
        gsap.fromTo(tag,
            { y: 50, z: -50, opacity: 0 },
            {
                y: 0, z: 0, opacity: 1, ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    end: "top 40%",
                    scrub: 1.5
                }
            }
        );

        gsap.fromTo(heading, 
            { y: 80, z: -150, rotationX: -15, opacity: 0 },
            { 
                y: 0, 
                z: 0, 
                rotationX: 0, 
                opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "top 30%",
                    scrub: 2
                }
            }
        );

        // 4. Cards 3D stagger animation (from bottom to top, translateZ, rotation)
        // Group cards into a stagger timeline
        const cardsTl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 65%",
                end: "center 30%",
                scrub: 1.5
            }
        });

        cardsTl.fromTo(cards, 
            { 
                opacity: 0, 
                y: 120, 
                z: -200, 
                rotationX: 20,
                rotationY: -10,
                scale: 0.9
            },
            {
                opacity: 1,
                y: 0,
                z: 0,
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                stagger: 0.15,
                ease: "power2.out",
                clearProps: "transform" // allow tilt to work smoothly after animation
            }
        );

    } else {
        // Mobile Simple Animation (Fade + Slide)
        const mobileTl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 85%"
            }
        });

        mobileTl.fromTo([tag, heading], 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                stagger: 0.2,
                ease: "power2.out"
            }
        ).fromTo(cards, 
            { opacity: 0, y: 40 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.4"
        );
    }

    // --- TIMELINE SECTION ANIMATIONS ---
    const timeline = document.querySelector('.timeline-container');
    if (timeline) {
        // Ensure ScrollTrigger is registered and ready
        ScrollTrigger.refresh();

        // 1. Central Axis Drawing & Energizing Effect
        const timelineAxis = gsap.timeline({
            scrollTrigger: {
                trigger: '.timeline-container',
                start: 'top 85%',
                end: 'bottom 85%',
                scrub: 0.5,
                invalidateOnRefresh: true
            }
        });

        timelineAxis
            .to('.timeline-progress-line', {
                clipPath: 'inset(0 0 0% 0)',
                backgroundPosition: '0 100%',
                ease: 'none'
            }, 0)
            .fromTo('.timeline-progress-tip', 
                { top: '0%', opacity: 0 },
                { top: '100%', opacity: 1, ease: 'none' }, 
            0);

        // 2. Staggered Item Floating Entry (Using .from for default visibility fallback)
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            gsap.from(item, {
                opacity: 0,
                y: 60,
                duration: 1.5,
                ease: 'power3.out', // Smooth Anti-Gravity drift
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // 3. Magnetic Hover for Timeline Dots
        const dots = document.querySelectorAll('.timeline-dot');
        dots.forEach(dot => {
            dot.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = dot.getBoundingClientRect();
                const x = clientX - (left + width / 2);
                const y = clientY - (top + height / 2);
                
                gsap.to(dot, {
                    x: x * 0.8,
                    y: y * 0.8,
                    duration: 0.3,
                    ease: "power2.out",
                    backgroundColor: "var(--neon-blue)",
                    boxShadow: "0 0 20px var(--neon-blue)"
                });
            });

            dot.addEventListener('mouseleave', () => {
                gsap.to(dot, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)",
                    backgroundColor: "transparent",
                    boxShadow: "none"
                });
            });
        });

        // 4. Mouse-tracking Card Glow
        const cards = document.querySelectorAll('.timeline-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = card.getBoundingClientRect();
                const x = ((e.clientX - left) / width) * 100;
                const y = ((e.clientY - top) / height) * 100;
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
            });
        });

        // Safety Refresh after all images/content load
        window.addEventListener('load', () => {
        // 5. Impact Numbers & Expertise: Stable Stagger Reveal
        const animateSection = (sectionSelector, cardSelector) => {
            const section = document.querySelector(sectionSelector);
            if (!section) return;

            const cards = section.querySelectorAll(cardSelector);
            const statNumbers = section.querySelectorAll(".stat-number");

            // Stagger Reveal for Cards
            gsap.from(cards, {
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%"
                }
            });

            // Count-up Animation for Numbers
            statNumbers.forEach(num => {
                const target = parseInt(num.getAttribute("data-target"));
                const suffix = num.getAttribute("data-suffix") || "";
                
                gsap.to(num, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    scrollTrigger: {
                        trigger: num,
                        start: "top 90%",
                        onEnter: () => {
                            gsap.to(num, {
                                duration: 2,
                                onUpdate: function() {
                                    num.innerText = Math.ceil(this.targets()[0].innerText) + suffix;
                                }
                            });
                        }
                    }
                });
            });
        };

        // 5. Impact Numbers (standard reveal, no horizontal pin overflow)
        const impactSection = document.querySelector(".impact-numbers");
        if (impactSection) {
            animateSection(".impact-numbers", '[class*="stat-card-"]');
        }

        ScrollTrigger.refresh();
    });
});
