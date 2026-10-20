/**
 * NEERAJ KUMAR - PORTFOLIO INTERACTIVITY (script.js)
 * Fully functional search, filter, form validation, smooth scrolling, and UI animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Dynamic Typing Effect in Hero
    // -------------------------------------------------------------
    const typingElement = document.getElementById('typingText');
    const words = [
        'Junior Frontend Developer',
        'React & Modern JavaScript Web Apps',
        'WordPress & Custom CMS Websites',
        'AuraBite Full-Stack MERN Project',
        'Responsive & High-Performance UI'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        if (!typingElement) return;
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 110;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 400; // Pause before next word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    typeEffect();

    // -------------------------------------------------------------
    // 2. Sticky Header & Active Nav on Scroll (ScrollSpy)
    // -------------------------------------------------------------
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Sticky header styling
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // Active link highlighting
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -------------------------------------------------------------
    // 3. Mobile Navigation Drawer Toggle
    // -------------------------------------------------------------
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when any nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // -------------------------------------------------------------
    // 4. Live Search Engine
    // -------------------------------------------------------------
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');

    // Build searchable index from the resume and portfolio
    const searchItems = [
        { title: 'AuraBite (React, Node, Express, MongoDB, Socket.IO)', type: 'Featured Project', targetId: 'projects', category: 'project' },
        { title: 'Coffee With Us (Mobile-First WordPress & SEO)', type: 'Project', targetId: 'projects', category: 'project' },
        { title: 'Cyber Core Client Web Pages & UI', type: 'Project', targetId: 'projects', category: 'project' },
        { title: 'Maa Diagnostic Centre Online Presence', type: 'Project', targetId: 'projects', category: 'project' },
        { title: 'Order Operations Management System', type: 'Project', targetId: 'projects', category: 'project' },
        { title: 'Interactive Developer Portfolio & Digital Resume', type: 'Project', targetId: 'projects', category: 'project' },
        { title: 'React (Hooks, Components, State)', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'JavaScript ES6+ & DOM Manipulation', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'HTML5 Semantic & Accessibility', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'CSS3 / Vanilla CSS Responsive Design', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'Node.js & Express.js REST APIs', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'MongoDB & Mongoose Schemas', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'Socket.IO (Real-Time Websockets)', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'JWT Authentication & Security', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'WordPress Setup, Custom Themes & Plugins', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'PHP (basic) Backend Logic', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'On-Page SEO & Page Speed Optimization', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'Git & GitHub Version Control', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'Google Ads & Meta Ads Campaigns', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'Cyber Core Technology (Web Dev Intern - 6 Mos)', type: 'Experience', targetId: 'experience', category: 'experience' },
        { title: 'Maa Diagnostic Centre (Growth & Digital Presence)', type: 'Experience', targetId: 'experience', category: 'experience' },
        { title: 'Flipkart Process (IT Operations - 6 Mos)', type: 'Experience', targetId: 'experience', category: 'experience' },
        { title: 'B.Tech CSE - SBS State University (CGPA 7.2)', type: 'Education', targetId: 'about', category: 'about' },
        { title: 'Verified Resume & Full Preview', type: 'Resume', targetId: 'resume', category: 'resume' },
        { title: 'Download Resume (PDF 12.pdf)', type: 'Document', targetId: 'resume', category: 'resume' },
        { title: 'Contact Neeraj (+91 7070878442)', type: 'Contact', targetId: 'contact', category: 'contact' },
        { title: 'Website Development Services', type: 'Service', targetId: 'services', category: 'service' }
    ];

    function performSearch(query) {
        if (!query.trim()) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }

        const normalized = query.toLowerCase().trim();
        const matches = searchItems.filter(item => 
            item.title.toLowerCase().includes(normalized) || 
            item.type.toLowerCase().includes(normalized)
        );

        if (matches.length > 0) {
            searchResults.innerHTML = matches.map(item => `
                <div class="search-result-item" data-target="${item.targetId}" data-title="${item.title}">
                    <i class="fa-solid fa-arrow-right"></i>
                    <div class="item-text">
                        <h5>${item.title}</h5>
                        <span>${item.type}</span>
                    </div>
                </div>
            `).join('');
            searchResults.classList.add('active');

            // Attach click handler to each result item
            searchResults.querySelectorAll('.search-result-item').forEach(el => {
                el.addEventListener('click', () => {
                    const targetId = el.getAttribute('data-target');
                    navigateToTarget(targetId);
                    searchResults.classList.remove('active');
                    searchInput.value = '';
                });
            });
        } else {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    No exact match found. Try "React", "AuraBite", "WordPress", "Resume", or "Contact".
                </div>
            `;
            searchResults.classList.add('active');
        }
    }

    function navigateToTarget(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            targetElement.classList.add('search-highlight');
            setTimeout(() => {
                targetElement.classList.remove('search-highlight');
            }, 2500);
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const firstResult = searchResults.querySelector('.search-result-item');
                if (firstResult) {
                    firstResult.click();
                } else if (searchInput.value.trim()) {
                    performSearch(searchInput.value);
                }
            }
        });

        // Close dropdown when clicked outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target) && !searchBtn.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (searchInput.value.trim()) {
                performSearch(searchInput.value);
            }
        });
    }

    // -------------------------------------------------------------
    // 5. Project Category Filtering
    // -------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = (card.getAttribute('data-category') || '').toLowerCase();
                const matches = filterValue === 'all' || category.split(/\s+/).includes(filterValue) || category.includes(filterValue);
                if (matches) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------
    // 6. Interactive Terminal Code Snippet Copy
    // -------------------------------------------------------------
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', () => {
            const codeSnippet = document.getElementById('codeSnippet');
            if (codeSnippet) {
                const text = codeSnippet.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    const origIcon = copyCodeBtn.innerHTML;
                    copyCodeBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i>';
                    showToast('Code Copied!', 'Neeraj\'s developer profile object copied to clipboard.');
                    setTimeout(() => {
                        copyCodeBtn.innerHTML = origIcon;
                    }, 2000);
                }).catch(() => {
                    showToast('Info', 'Profile snippet ready to review.');
                });
            }
        });
    }

    // -------------------------------------------------------------
    // 7. Contact Form & Tab Switching
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const signupForm = document.getElementById('signupForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('senderName');
            const emailInput = document.getElementById('senderEmail');
            const subjectInput = document.getElementById('senderSubject');
            const messageInput = document.getElementById('senderMessage');

            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const messageError = document.getElementById('messageError');

            let isValid = true;

            // Reset errors
            nameError.textContent = '';
            emailError.textContent = '';
            messageError.textContent = '';

            // Name validation
            if (!nameInput.value.trim()) {
                nameError.textContent = 'Please provide your name or organization name.';
                isValid = false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                emailError.textContent = 'Please enter your email address.';
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                emailError.textContent = 'Please enter a valid email format (e.g., name@domain.com).';
                isValid = false;
            }

            // Message validation
            if (!messageInput.value.trim()) {
                messageError.textContent = 'Please write a brief message or project inquiry.';
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                messageError.textContent = 'Please provide at least 10 characters so Neeraj can assist you.';
                isValid = false;
            }

            if (!isValid) return;

            // Show real sending state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            const btnSpinner = submitBtn.querySelector('.btn-spinner');
            const btnText = submitBtn.querySelector('.btn-text');
            if (btnSpinner) btnSpinner.style.display = 'inline-block';
            if (btnText) btnText.style.display = 'none';

            const senderName = nameInput.value.trim();
            const senderEmail = emailInput.value.trim();
            const subjectField = document.getElementById('senderSubject');
            const senderSubject = (subjectField ? subjectField.value.trim() : '') || 'Website Developer Inquiry';
            const senderMessage = messageInput.value.trim();

            // Real email dispatch to Neeraj's inbox via FormSubmit
            const payload = {
                name: senderName,
                email: senderEmail,
                _replyto: senderEmail,
                _subject: `New Portfolio Message from ${senderName}: ${senderSubject}`,
                subject: senderSubject,
                message: senderMessage,
                _template: 'table',
                _captcha: 'false'
            };

            fetch('https://formsubmit.co/ajax/kumarnk15122002@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                if (btnSpinner) btnSpinner.style.display = 'none';
                if (btnText) btnText.style.display = 'inline-block';

                showToast(
                    'Email Delivered to Neeraj!',
                    `Thank you, ${senderName}! Your message was sent directly to kumarnk15122002@gmail.com. Neeraj will reply to you soon.`
                );
                contactForm.reset();
            })
            .catch(err => {
                console.warn('FormSubmit AJAX fallback:', err);
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                if (btnSpinner) btnSpinner.style.display = 'none';
                if (btnText) btnText.style.display = 'inline-block';

                showToast(
                    'Opening Email Client...',
                    'Redirecting to your email app so you can send the message directly to kumarnk15122002@gmail.com.'
                );
                window.location.href = `mailto:kumarnk15122002@gmail.com?subject=${encodeURIComponent(senderSubject)}&body=${encodeURIComponent("From: " + senderName + " (" + senderEmail + ")\n\n" + senderMessage)}`;
            });
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const subEmail = document.getElementById('subscribeEmail');
            const subError = document.getElementById('subError');
            const subBtn = document.getElementById('subBtn');

            subError.textContent = '';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!subEmail.value.trim() || !emailRegex.test(subEmail.value.trim())) {
                subError.textContent = 'Please enter a valid email address.';
                return;
            }

            subBtn.disabled = true;
            subBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...';

            fetch('https://formsubmit.co/ajax/kumarnk15122002@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: subEmail.value.trim(),
                    _subject: `New Newsletter Subscriber: ${subEmail.value.trim()}`,
                    interest: document.getElementById('subscribeInterest') ? document.getElementById('subscribeInterest').value : 'General'
                })
            })
            .finally(() => {
                subBtn.disabled = false;
                subBtn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed!';
                showToast('Subscribed!', 'You are now registered for Neeraj\'s developer updates.');
                signupForm.reset();
                setTimeout(() => {
                    subBtn.innerHTML = '<i class="fa-solid fa-check"></i> Keep Me Updated';
                }, 2500);
            });
        });
    }

    // -------------------------------------------------------------
    // 8. Toast Notifications
    // -------------------------------------------------------------
    const toast = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.getElementById('toastClose');
    let toastTimeout;

    window.showToast = function(title, message) {
        if (!toast) return;
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        toast.classList.add('active');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('active');
        }, 6000);
    };

    if (toastClose) {
        toastClose.addEventListener('click', () => {
            toast.classList.remove('active');
        });
    }

    // -------------------------------------------------------------
    // 9. Interactive Project Showcase Data & Modal
    // -------------------------------------------------------------
    const projectsData = {
        'aurabite': {
            title: 'AuraBite - Real-Time Food Ordering Web Application',
            category: 'Full-Stack MERN & WebSockets',
            icon: 'fa-solid fa-utensils',
            image: 'assets/projects/aurabite.jpg',
            desc: 'AuraBite is a comprehensive, production-grade food ordering web application engineered with the MERN stack. Features dynamic menu browsing with real-time category filtering, secure JWT-based authentication and protected API routes, seamless cart state management via Axios, and instant bidirectional order status tracking powered by Socket.IO WebSockets.',
            tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Socket.IO', 'Axios', 'JWT', 'CSS3'],
            features: [
                'Real-time order tracking and kitchen notifications powered by Socket.IO',
                'Secure user authentication and token authorization using JSON Web Tokens (JWT)',
                'Full RESTful API backend built with Express.js and structured Mongoose schemas',
                'Modular React component architecture with clean state management and responsive CSS'
            ],
            liveUrl: 'https://aurabite-ten.vercel.app/',
            liveLabel: 'Launch Live Food App',
            sourceUrl: 'https://github.com/kumar-neeraj995/AuraBite'
        },
        'coffee': {
            title: 'Coffee With Us - Specialty Cafe & Coffee Shop',
            category: 'WordPress & Responsive UI',
            icon: 'fa-solid fa-mug-hot',
            image: 'assets/projects/coffee.jpg',
            desc: 'A fast-loading, mobile-first coffee shop web experience designed for high conversion and local customer discovery. Integrated on-page SEO meta tags, structured business schema, speed-optimized asset delivery, and mobile-friendly drink menu.',
            tech: ['WordPress', 'HTML5', 'CSS3', 'Mobile-First', 'On-Page SEO', 'Page Speed'],
            features: [
                'Mobile-first drink catalog and promotional hero banner',
                'On-page SEO optimization with meta descriptions and header hierarchy',
                'Lightweight CSS animations and optimized image assets',
                'Direct WhatsApp & phone order inquiry integration'
            ],
            liveUrl: 'https://neeraj-kumar-portfolio-ashy.vercel.app/#projects',
            liveLabel: 'View in Portfolio Showcase',
            sourceUrl: 'https://github.com/kumar-neeraj995/My-Portfolio-'
        },
        'diagnostic': {
            title: 'Maa Diagnostic Centre - 360° Digital Healthcare Growth',
            category: 'Healthcare Growth & Digital Operations',
            icon: 'fa-solid fa-bullhorn',
            image: 'assets/projects/diagnostic.jpg',
            desc: 'Independently conceptualized, built, and executed a complete 360-degree digital presence for a diagnostic healthcare centre from scratch. Combined Google Business Profile setup, targeted Google & Meta ad campaigns, and automated WhatsApp broadcast lists to scale local patient appointments.',
            tech: ['Google Business Profile', 'Google Ads', 'Meta Ads', 'Local SEO', 'WhatsApp Broadcasts', 'Canva'],
            features: [
                '150%+ increase in local phone calls and patient inquiries within 90 days',
                'Google Ads search campaigns targeting diagnostic tests and health packages',
                'Hyper-targeted Meta Ads for family health checkups',
                'Organized WhatsApp broadcast lists for patient report updates and offers'
            ],
            liveUrl: 'https://neeraj-kumar-portfolio-ashy.vercel.app/#experience',
            liveLabel: 'View Experience Case Study',
            sourceUrl: 'https://github.com/kumar-neeraj995/My-Portfolio-'
        },
        'cybercore': {
            title: 'Cyber Core Technology - Frontend Client Solutions',
            category: 'Frontend Development Internship',
            icon: 'fa-solid fa-laptop-code',
            image: 'assets/projects/cybercore.jpg',
            desc: 'Developed, styled, and maintained diverse client-facing web pages and landing pages during a 6-month developer internship at Cyber Core Technology. Translated Figma/PSD mockups into clean semantic HTML5 and CSS3, resolving cross-browser display bugs and ensuring 90+ Lighthouse speed scores.',
            tech: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Responsive Design', 'Lighthouse 90+', 'Git'],
            features: [
                'Built responsive landing pages from client UI specifications',
                'Standardized responsive breakpoints for tablets (768px) and mobile (390px)',
                'Fixed legacy cross-browser rendering inconsistencies across Safari & Firefox',
                'Minified CSS/JS and compressed images for instant page load times'
            ],
            liveUrl: 'https://neeraj-kumar-portfolio-ashy.vercel.app/#experience',
            liveLabel: 'View Experience Details',
            sourceUrl: 'https://github.com/kumar-neeraj995/My-Portfolio-'
        },
        'flipkart': {
            title: 'Order Operations Management & Resolution Workflow',
            category: 'Web Operations & Customer Resolution',
            icon: 'fa-solid fa-boxes-packing',
            desc: 'Streamlined web-based order tracking, escalation logging, and return investigation workflow inspired by Flipkart process operations. Enforced strict SOP conformance, tracked turn-around-time (TAT) SLAs, and maintained a 98%+ customer satisfaction rating.',
            tech: ['Web Operations', 'Order Management', 'SOP Compliance', 'TAT Tracking', 'Resolution Workflow'],
            features: [
                'Daily case management handling return requests and logistics escalations',
                'Systematic investigation of logistics delays with 99% SLA adherence',
                'Collaborated across logistics and warehouse portals to expedite deliveries',
                'Maintained rigorous audit trail and case logs for management reporting'
            ],
            liveUrl: 'https://neeraj-kumar-portfolio-ashy.vercel.app/#experience',
            liveLabel: 'View Experience Details',
            sourceUrl: 'https://github.com/kumar-neeraj995/My-Portfolio-'
        },
        'portfolio': {
            title: 'Interactive Website Developer Portfolio & ATS Resume',
            category: 'Personal Portfolio & Production System',
            icon: 'fa-solid fa-code',
            desc: 'A production-grade portfolio featuring instant client-side search index, dynamic ambient glow styling, interactive project showcase modal, dedicated ATS-compliant printable PDF resume, and live FormSubmit email integration delivering inquiries straight to Neeraj Kumar.',
            tech: ['HTML5', 'CSS3 Vanilla', 'JavaScript ES6+', 'Vercel Edge', 'FormSubmit', 'SEO Schema'],
            features: [
                'Ultra-fast Edge CDN deployment with zero runtime dependencies',
                'Real-time form submission directly delivering emails to kumarnk15122002@gmail.com',
                'Full responsive compliance across iPhone, Android, iPad, and 4K desktop',
                'Interactive ATS-friendly resume with 1-click printable & download modes'
            ],
            liveUrl: 'https://neeraj-kumar-portfolio-ashy.vercel.app/resume.html',
            liveLabel: 'Open Dedicated Resume Page',
            sourceUrl: 'https://github.com/kumar-neeraj995/My-Portfolio-'
        }
    };

    const demoModal = document.getElementById('demoModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCategoryBadge = document.getElementById('modalCategoryBadge');
    const modalBannerIcon = document.getElementById('modalBannerIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalTechList = document.getElementById('modalTechList');
    const modalFeaturesList = document.getElementById('modalFeaturesList');
    const modalLiveLink = document.getElementById('modalLiveLink');
    const modalGithubLink = document.getElementById('modalGithubLink');
    const modalImageWrap = document.getElementById('modalImageWrap');
    const modalImg = document.getElementById('modalImg');

    window.openProjectModal = function(projectKey) {
        if (!demoModal) return;
        const project = projectsData[projectKey] || projectsData['portfolio'];

        if (modalCategoryBadge) modalCategoryBadge.textContent = project.category;
        if (modalTitle) modalTitle.textContent = project.title;
        if (modalDesc) modalDesc.textContent = project.desc;
        if (modalBannerIcon) modalBannerIcon.innerHTML = `<i class="${project.icon}"></i>`;

        if (modalImageWrap && modalImg) {
            if (project.image) {
                modalImg.src = project.image;
                modalImg.alt = project.title;
                modalImageWrap.style.display = 'block';
            } else {
                modalImageWrap.style.display = 'none';
            }
        }

        if (modalTechList) {
            modalTechList.innerHTML = project.tech.map(t => `<span>${t}</span>`).join('');
        }

        if (modalFeaturesList) {
            modalFeaturesList.innerHTML = project.features.map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join('');
        }

        if (modalLiveLink) {
            modalLiveLink.href = project.liveUrl;
            modalLiveLink.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> ${project.liveLabel || 'Open Live Showcase'}`;
        }

        if (modalGithubLink) {
            modalGithubLink.href = project.sourceUrl;
            modalGithubLink.innerHTML = '<i class="fa-brands fa-github"></i> View GitHub Repo';
        }

        demoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Backward-compatible alias
    window.openDemoModal = function(title, desc, githubUrl) {
        // Find matching key by title prefix
        const lower = (title || '').toLowerCase();
        let key = 'portfolio';
        if (lower.includes('aura')) key = 'aurabite';
        else if (lower.includes('coffee')) key = 'coffee';
        else if (lower.includes('diagnostic')) key = 'diagnostic';
        else if (lower.includes('cyber')) key = 'cybercore';
        else if (lower.includes('flipkart') || lower.includes('order')) key = 'flipkart';
        window.openProjectModal(key);
    };

    function closeModal() {
        if (demoModal) {
            demoModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (demoModal) {
        demoModal.addEventListener('click', (e) => {
            if (e.target === demoModal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && demoModal && demoModal.classList.contains('active')) {
            closeModal();
        }
    });

    // -------------------------------------------------------------
    // 10. Helper: Tab Switcher & Clipboard Copy
    // -------------------------------------------------------------
    window.switchFormTab = function(tabName) {
        const tabContact = document.getElementById('tabContact');
        const tabInfo = document.getElementById('tabInfo');
        const contactForm = document.getElementById('contactForm');
        const signupForm = document.getElementById('signupForm');

        if (tabName === 'contact') {
            tabContact.classList.add('active');
            tabInfo.classList.remove('active');
            contactForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            tabInfo.classList.add('active');
            tabContact.classList.remove('active');
            signupForm.classList.add('active');
            contactForm.classList.remove('active');
        }
    };

    window.copyToClipboard = function(text, btnElement) {
        navigator.clipboard.writeText(text).then(() => {
            const originalIcon = btnElement.innerHTML;
            btnElement.innerHTML = '<i class="fa-solid fa-check" style="color:#10b981;"></i>';
            const label = text.includes('@') ? 'Email Copied!' : 'Copied to Clipboard!';
            showToast(label, `${text} copied to your clipboard.`);
            setTimeout(() => {
                btnElement.innerHTML = originalIcon;
            }, 2000);
        }).catch(() => {
            showToast('Copied', text);
        });
    };

    // -------------------------------------------------------------
    // 11. Footer Auto-Year
    // -------------------------------------------------------------
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
