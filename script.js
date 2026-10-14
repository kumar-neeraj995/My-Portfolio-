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
        'Responsive & Fast Websites',
        'HTML5, CSS3 & JavaScript',
        'WordPress Setup & Custom Themes',
        'On-Page SEO & Page Speed Basics',
        'Mobile-First Clean Web Interfaces'
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
        { title: 'Aura Bite (WordPress Project)', type: 'Project', targetId: 'projects', category: 'project' },
        { title: 'Coffee With Us (Mobile-First WordPress)', type: 'Project', targetId: 'projects', category: 'project' },
        { title: 'Maa Diagnostic Centre Online Presence', type: 'Project', targetId: 'projects', category: 'project' },
        { title: 'Cyber Core Client Web Pages', type: 'Project', targetId: 'projects', category: 'project' },
        { title: 'Order Operations Management System', type: 'Project', targetId: 'projects', category: 'project' },
        { title: 'Interactive Developer Portfolio', type: 'Project', targetId: 'projects', category: 'project' },
        { title: 'Cyber Core Technology (Web Dev Intern - 6 Mos)', type: 'Experience', targetId: 'experience', category: 'experience' },
        { title: 'Maa Diagnostic Centre (Digital Marketing Handler)', type: 'Experience', targetId: 'experience', category: 'experience' },
        { title: 'Flipkart Process (IT Operations - 6 Mos)', type: 'Experience', targetId: 'experience', category: 'experience' },
        { title: 'WordPress Setup, Themes & Plugins', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'HTML5, CSS3 & JavaScript', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'PHP (basic) Backend Logic', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'On-Page SEO & Page Speed Optimization', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'Google Ads & Meta Ads Growth', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'Git & GitHub Version Control', type: 'Skill', targetId: 'skills', category: 'skill' },
        { title: 'Canva & Figma Design Tools', type: 'Skill', targetId: 'skills', category: 'skill' },
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
                    No exact match found. Try "React", "Node", "Projects", "Resume", or "Contact".
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
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
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

            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate server network dispatch
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                const senderName = nameInput.value.trim();
                showToast(
                    'Message Sent Successfully!',
                    `Thank you, ${senderName}! Neeraj has received your message and will reply shortly.`
                );

                contactForm.reset();
            }, 1200);
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
            subBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

            setTimeout(() => {
                subBtn.disabled = false;
                subBtn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed!';
                showToast('Subscribed!', 'You are now on Neeraj\'s developer project update list.');
                signupForm.reset();
                setTimeout(() => {
                    subBtn.innerHTML = '<i class="fa-solid fa-check"></i> Keep Me Updated';
                }, 2500);
            }, 1000);
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
        }, 5000);
    };

    if (toastClose) {
        toastClose.addEventListener('click', () => {
            toast.classList.remove('active');
        });
    }

    // -------------------------------------------------------------
    // 9. Interactive Demo Modal
    // -------------------------------------------------------------
    const demoModal = document.getElementById('demoModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalGithubLink = document.getElementById('modalGithubLink');

    window.openDemoModal = function(title, desc, githubUrl) {
        if (!demoModal) return;
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        if (githubUrl.startsWith('#')) {
            modalGithubLink.href = 'https://github.com/neerajkumar43';
            modalGithubLink.innerHTML = '<i class="fa-brands fa-github"></i> GitHub Profile';
        } else {
            modalGithubLink.href = githubUrl;
            modalGithubLink.innerHTML = '<i class="fa-brands fa-github"></i> View GitHub Repo';
        }
        demoModal.classList.add('active');
    };

    function closeModal() {
        if (demoModal) demoModal.classList.remove('active');
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', closeModal);
    if (demoModal) {
        demoModal.addEventListener('click', (e) => {
            if (e.target === demoModal) closeModal();
        });
    }

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
