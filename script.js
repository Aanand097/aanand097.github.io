document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initStats();
    initForm();
    initScrollSpy();
    initModal();
    initImageAnimation();
});

function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            const spans = this.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            if (menuBtn) {
                const spans = menuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
}


function toggleCV() {
    const cv = document.getElementById("cvPreview");
    cv.classList.toggle("show");
}

function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.getAttribute('data-target'));
                let count = 0;
                
                const updateCount = () => {
                    if (count < target) {
                        count++;
                        stat.innerText = count;
                        setTimeout(updateCount, 50);
                    } else {
                        stat.innerText = target;
                    }
                };
                
                updateCount();
                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function initForm() {
    const form = document.querySelector('.contact-form');
    const submitBtn = document.getElementById('submit-btn');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showThankYouModal();
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                alert('Something went wrong. Please try again or email me directly.');
                console.error('Error:', error);
            })
            .finally(() => {
                submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
                submitBtn.disabled = false;
            });
        });
    }
}

function initModal() {
    const modal = document.getElementById('thankyou-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function showThankYouModal() {
    const modal = document.getElementById('thankyou-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 5000);
    }
}

function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Image Animation Effect
function initImageAnimation() {
    const container = document.getElementById('imageContainer');
    const track = document.getElementById('imageTrack');
    
    if (!container) return;
    
    // Initial state - looking to the side
    gsap.set(track, { rotationY: 0 });
    
    // Mouse move effect
    container.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left; // mouse x relative to container
        const y = e.clientY - rect.top; // mouse y relative to container
        
        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20; // Max 10deg rotation
        const rotateY = (x - centerX) / 15; // Max 15deg rotation
        
        // Apply 3D rotation to container
        gsap.to(container, {
            rotateX: -rotateX,
            rotateY: rotateY,
            duration: 0.3,
            ease: "power2.out"
        });
        
        // Add parallax effect to track
        gsap.to(track, {
            x: (x - centerX) / 8,
            y: (y - centerY) / 8,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    // Reset on mouse leave
    container.addEventListener('mouseleave', function() {
        gsap.to(container, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power2.out"
        });
        
        gsap.to(track, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    });
    
    // Add hover effect for the flip
    container.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    container.addEventListener('mouseleave', function() {
        gsap.to(this, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
}