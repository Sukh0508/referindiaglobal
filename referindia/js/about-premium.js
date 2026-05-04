// ===== COUNTER ANIMATION WITH INTERSECTION OBSERVER =====

// Select the stats container to observe
const statsContainer = document.querySelector('.stats-container');

if (statsContainer) {
  // Create IntersectionObserver to trigger animation when section is visible
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Only trigger when the element enters the viewport
      if (entry.isIntersecting) {
        // Animate all counters inside this section
        const counters = statsContainer.querySelectorAll('.counter');
        
        counters.forEach(counter => {
          // Only animate if not already animated
          if (!counter.classList.contains('animated')) {
            animateCounter(counter);
            counter.classList.add('animated');
          }
        });
        
        // Unobserve to prevent re-triggering
        counterObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,  // Trigger when 30% of element is visible
    rootMargin: '0px'
  });

  // Observe the stats container
  counterObserver.observe(statsContainer);
}

/**
 * Animate a single counter from 0 to target value
 * @param {HTMLElement} counter - The counter element to animate
 */
function animateCounter(counter) {
  const target = parseInt(counter.getAttribute('data-target'), 10);
  
  if (isNaN(target)) return; // Exit if target is invalid
  
  let current = 0;
  const increment = target / 60; // Distribute over 60 steps
  
  const updateCounter = () => {
    current += increment;
    
    if (current < target) {
      counter.innerText = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      counter.innerText = target; // Set to exact target value
    }
  };
  
  updateCounter();
}

// Fallback for direct counter animation if stats-container not found
// This ensures counters animate even if observer doesn't trigger
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length && !statsContainer) {
    counters.forEach(counter => {
      if (!counter.classList.contains('animated')) {
        animateCounter(counter);
        counter.classList.add('animated');
      }
    });
  }
});
