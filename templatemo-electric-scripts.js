// JavaScript Document

/*

TemplateMo 596 Electric Xtra

https://templatemo.com/tm-596-electric-xtra

*/

// Create floating particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 30;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
                
                // Randomly assign orange or blue color
                if (Math.random() > 0.5) {
                    particle.style.setProperty('--particle-color', '#00B2FF');
                    const before = particle.style.getPropertyValue('--particle-color');
                    particle.style.background = '#00B2FF';
                }
                
                particlesContainer.appendChild(particle);
            }
        }

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Active navigation highlighting
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-link');

        function updateActiveNav() {
            const scrollPosition = window.pageYOffset + 100;

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navItems.forEach(item => item.classList.remove('active'));
                    const currentNav = document.querySelector(`.nav-link[href="#${section.id}"]`);
                    if (currentNav) currentNav.classList.add('active');
                }
            });
        }

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            updateActiveNav();
        });

        // Initial active nav update
        updateActiveNav();

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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

        function renderFeatures(data) {
            const tabsContainer = document.querySelector('.feature-tabs');
            const contentContainer = document.querySelector('.feature-content');
            if (!tabsContainer || !contentContainer) return;
            tabsContainer.innerHTML = data
                .map(
                    (f, i) =>
                        `<div class="tab-item${i === 0 ? ' active' : ''}" data-tab="${f.id}"><span class="tab-icon">${
                            f.icon || ''
                        }</span><span>${f.name}</span></div>`
                )
                .join('');
            contentContainer.innerHTML = data
                .map(
                    (f, i) =>
                        `<div class="content-panel${i === 0 ? ' active' : ''}" id="${f.id}"><h3>${
                            f.title
                        }</h3><p>${f.description}</p><ul class="feature-list">${f.items
                            .map(li => `<li>${li}</li>`)
                            .join('')}</ul></div>`
                )
                .join('');
        }

        function initFeatureTabs() {
            const tabs = document.querySelectorAll('.tab-item');
            const panels = document.querySelectorAll('.content-panel');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabId = tab.getAttribute('data-tab');
                    tabs.forEach(t => t.classList.remove('active'));
                    panels.forEach(p => p.classList.remove('active'));
                    tab.classList.add('active');
                    const target = document.getElementById(tabId);
                    if (target) target.classList.add('active');
                });
            });
        }

        fetch('/api/features')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (Array.isArray(data) && data.length) {
                    renderFeatures(data);
                    initFeatureTabs();
                } else {
                    initFeatureTabs();
                }
            })
            .catch(() => {
                initFeatureTabs();
            });

        document.getElementById('contactForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const payload = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const json = await res.json();
                if (res.ok && json && json.ok) {
                    alert('Message sent! We\'ll get back to you soon.');
                    this.reset();
                } else {
                    alert('Unable to send message. Please try again.');
                }
            } catch (err) {
                alert('Network error. Please try again later.');
            }
        });

        // Initialize particles
        createParticles();

        let textSets = document.querySelectorAll('.text-set');
        let currentIndex = 0;
        let isAnimating = false;

        function wrapTextInSpans(element) {
            const text = element.textContent;
            element.innerHTML = text.split('').map((char, i) => 
                `<span class="char" style="animation-delay: ${i * 0.05}s">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
        }

        function animateTextIn(textSet) {
            const glitchText = textSet.querySelector('.glitch-text');
            const subtitle = textSet.querySelector('.subtitle');
            
            // Wrap text in spans for animation
            wrapTextInSpans(glitchText);
            
            // Update data attribute for glitch effect
            glitchText.setAttribute('data-text', glitchText.textContent);
            
            // Show subtitle after main text
            setTimeout(() => {
                subtitle.classList.add('visible');
            }, 800);
        }

        function animateTextOut(textSet) {
            const chars = textSet.querySelectorAll('.char');
            const subtitle = textSet.querySelector('.subtitle');
            
            // Animate characters out
            chars.forEach((char, i) => {
                char.style.animationDelay = `${i * 0.02}s`;
                char.classList.add('out');
            });
            
            // Hide subtitle
            subtitle.classList.remove('visible');
        }

        function rotateText() {
            if (isAnimating) return;
            isAnimating = true;

            const currentSet = textSets[currentIndex];
            const nextIndex = (currentIndex + 1) % textSets.length;
            const nextSet = textSets[nextIndex];

            // Animate out current text
            animateTextOut(currentSet);

            // After out animation, switch sets
            setTimeout(() => {
                currentSet.classList.remove('active');
                nextSet.classList.add('active');
                animateTextIn(nextSet);
                
                currentIndex = nextIndex;
                isAnimating = false;
            }, 600);
        }

        function initHeroRotation() {
            if (!textSets.length) return;
            textSets[0].classList.add('active');
            animateTextIn(textSets[0]);
            setTimeout(() => {
                setInterval(rotateText, 5000);
            }, 4000);
        }

        function renderHeroSets(data) {
            const rotator = document.querySelector('.text-rotator');
            if (!rotator) return;
            rotator.innerHTML = data
                .map(
                    (s, i) =>
                        `<div class="text-set${i === 0 ? ' active' : ''}"><h1 class="glitch-text" data-text="${s.title}">${s.title}</h1><p class="subtitle">${s.subtitle}</p></div>`
                )
                .join('');
            textSets = document.querySelectorAll('.text-set');
        }

        fetch('/api/hero')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (Array.isArray(data) && data.length) {
                    renderHeroSets(data);
                }
                initHeroRotation();
            })
            .catch(() => {
                initHeroRotation();
            });

        // Add random glitch effect
        setInterval(() => {
            const glitchTexts = document.querySelectorAll('.glitch-text');
            glitchTexts.forEach(text => {
                if (Math.random() > 0.95) {
                    text.style.animation = 'none';
                    setTimeout(() => {
                        text.style.animation = '';
                    }, 200);
                }
            });
        }, 3000);
