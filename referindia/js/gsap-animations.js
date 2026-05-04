// gsap-animations.js - Premium 3D Scroll Animations
document.addEventListener("DOMContentLoaded", () => {
    // Make sure GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

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
});
