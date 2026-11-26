
(() => {
    "use strict";

    // ELEMENTS
    const menuButton = document.getElementById("menu-toggle");
    const navigation = document.getElementById("primary-navigation");
    const progressBar = document.getElementById("scroll-progress");
    const contactForm = document.getElementById("contact-form");
    const yearElement = document.getElementById("current-year");
    const navLinks = [...document.querySelectorAll(".nav-link")];
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // MOBILE NAVIGATION
    const setMenuOpen = open => {
        if (!menuButton || !navigation) return;

        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute(
            "aria-label",
            open ? "Tutup menu navigasi" : "Buka menu navigasi"
        );
        navigation.classList.toggle("is-open", open);
    };

    menuButton?.addEventListener("click", () => {
        setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
    });

    navLinks.forEach(link =>
        link.addEventListener("click", () => setMenuOpen(false))
    );

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") setMenuOpen(false);
    });

    document.addEventListener("click", event => {
        if (
            menuButton && navigation &&
            !menuButton.contains(event.target) &&
            !navigation.contains(event.target)
        ) setMenuOpen(false);
    });

    // ACTIVE NAVIGATION
    const setActiveLink = id => {
        const activeLink = navLinks.find(
            link => link.getAttribute("href") === `#${id}`
        );

        if (!activeLink) return;

        navLinks.forEach(link => {
            const active = link === activeLink;
            link.classList.toggle("is-active", active);

            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    };

    if ("IntersectionObserver" in window && sections.length) {
        const sectionObserver = new IntersectionObserver(entries => {
            const visible = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (visible.length) setActiveLink(visible[0].target.id);
        }, {
            rootMargin: "-30% 0px -55% 0px",
            threshold: [0, 0.1, 0.25, 0.5]
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // SCROLL PROGRESS
    let progressFrameRequested = false;

    const updateScrollProgress = () => {
        if (progressBar) {
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const progress = height > 0 ? window.scrollY / height : 0;

            progressBar.style.transform =
                `scaleX(${Math.min(1, Math.max(0, progress))})`;
        }

        progressFrameRequested = false;
    };

    const requestProgressUpdate = () => {
        if (progressFrameRequested) return;

        progressFrameRequested = true;
        requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", requestProgressUpdate);
    updateScrollProgress();

    // SCROLL REVEAL
    const revealSelectors = [
        ".hero-copy", ".hero-visual", ".section-heading",
        ".about-content", ".skill-card", ".hobby-card",
        ".timeline-item", ".contact-intro", ".contact-method",
        ".contact-form-panel", ".footer-inner"
    ];

    const revealElements = document.querySelectorAll(revealSelectors.join(", "));

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach(element => element.classList.add("is-visible"));
    } else {
        const staggerGroups = [
            ".skills-grid .skill-card",
            ".hobby-grid .hobby-card",
            ".contact-methods .contact-method"
        ];

        staggerGroups.forEach(selector => {
            document.querySelectorAll(selector).forEach((element, index) => {
                element.style.setProperty("--reveal-delay", `${index * 90}ms`);
            });
        });

        revealElements.forEach(element => element.classList.add("reveal"));

        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle("is-visible", entry.isIntersecting);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -45px 0px"
        });

        revealElements.forEach(element => revealObserver.observe(element));
    }

    // AUTOMATIC FOOTER YEAR
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // CONTACT FORM
    contactForm?.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("sender-name")?.value.trim();
        const email = document.getElementById("sender-email")?.value.trim();
        const message = document.getElementById("sender-message")?.value.trim();

        if (!name || !email || !message) {
            contactForm.reportValidity();
            return;
        }

        const recipient = "ahmad.firdaus@gmail.com";
        const subject = encodeURIComponent(`Pesan Portofolio dari ${name}`);
        const body = encodeURIComponent(
            `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`
        );

        window.location.href =
            `mailto:${recipient}?subject=${subject}&body=${body}`;
    });

})();
