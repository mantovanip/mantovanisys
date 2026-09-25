document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTOS
       ========================================================= */

    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const backToTop = document.getElementById("backToTop");


    /* =========================================================
       HEADER + VOLTAR AO TOPO
       ========================================================= */

    const updateScrollElements = () => {

        if (header) {
            header.classList.toggle(
                "scrolled",
                window.scrollY > 20
            );
        }

        if (backToTop) {
            backToTop.classList.toggle(
                "visible",
                window.scrollY > 600
            );
        }

    };

    window.addEventListener(
        "scroll",
        updateScrollElements,
        { passive: true }
    );

    updateScrollElements();


    /* =========================================================
       MENU MOBILE
       ========================================================= */

    if (menuToggle && mainNav) {

        const closeMenu = () => {

            mainNav.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Abrir menu"
            );

        };


        menuToggle.addEventListener("click", () => {

            const isActive =
                mainNav.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isActive)
            );

            menuToggle.setAttribute(
                "aria-label",
                isActive
                    ? "Fechar menu"
                    : "Abrir menu"
            );

        });


        mainNav.querySelectorAll("a").forEach((link) => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });


        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

    }


    /* =========================================================
       SCROLL SUAVE
       ========================================================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener("click", (event) => {

                const targetId =
                    link.getAttribute("href");

                if (!targetId || targetId === "#") {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });


    /* =========================================================
       FAQ
       ========================================================= */

    document
        .querySelectorAll(".faq-question")
        .forEach((question) => {

            question.addEventListener("click", () => {

                const currentItem =
                    question.closest(".faq-item");

                if (!currentItem) {
                    return;
                }

                const isCurrentlyActive =
                    currentItem.classList.contains("active");


                document
                    .querySelectorAll(".faq-item")
                    .forEach((item) => {

                        item.classList.remove("active");

                        const button =
                            item.querySelector(".faq-question");

                        if (button) {

                            button.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }

                    });


                if (!isCurrentlyActive) {

                    currentItem.classList.add("active");

                    question.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }

            });

        });


    /* =========================================================
       VOLTAR AO TOPO
       ========================================================= */

    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =========================================================
       WHATSAPP — RASTREAMENTO
       ========================================================= */

    document
        .querySelectorAll(".whatsapp-link")
        .forEach((link) => {

            link.addEventListener("click", () => {

                if (typeof window.gtag === "function") {

                    window.gtag(
                        "event",
                        "whatsapp_click",
                        {
                            event_category: "engagement",
                            event_label: "WhatsApp"
                        }
                    );

                }

            });

        });


    /* =========================================================
       PROJETOS — RASTREAMENTO
       ========================================================= */

    document
        .querySelectorAll(".case-link")
        .forEach((link) => {

            link.addEventListener("click", () => {

                if (typeof window.gtag === "function") {

                    window.gtag(
                        "event",
                        "case_click",
                        {
                            event_category: "portfolio",
                            event_label: link.href
                        }
                    );

                }

            });

        });


    /* =========================================================
       ACESSIBILIDADE — LINKS EXTERNOS
       ========================================================= */

    document
        .querySelectorAll('a[target="_blank"]')
        .forEach((link) => {

            if (!link.rel.includes("noopener")) {

                link.rel =
                    `${link.rel} noopener noreferrer`
                        .trim();

            }

        });


    /* =========================================================
       FECHA MENU AO REDIMENSIONAR
       ========================================================= */

    window.addEventListener("resize", () => {

        if (
            window.innerWidth > 800 &&
            mainNav
        ) {

            mainNav.classList.remove("active");

            if (menuToggle) {

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Abrir menu"
                );

            }

        }

    });


    /* =========================================================
       PROJETOS — CARROSSEL INFINITO
       ========================================================= */

    const casesTrack = document.getElementById("casesTrack");
    const casesPrev = document.querySelector(".cases-prev");
    const casesNext = document.querySelector(".cases-next");

    if (casesTrack) {
        const originalCards = [...casesTrack.querySelectorAll(".case-card")];
        const count = originalCards.length;

        // Clones nas duas pontas criam a sensação de carrossel infinito.
        const before = originalCards.map((card) => card.cloneNode(true)).reverse();
        const after = originalCards.map((card) => card.cloneNode(true));

        before.forEach((card) => casesTrack.insertBefore(card, casesTrack.firstChild));
        after.forEach((card) => casesTrack.appendChild(card));

        const getStep = () => {
            const card = casesTrack.querySelector(".case-card");
            if (!card) return 0;
            const styles = getComputedStyle(casesTrack);
            return card.getBoundingClientRect().width + parseFloat(styles.columnGap || styles.gap || 0);
        };

        const jumpToMiddle = () => {
            const step = getStep();
            if (step) {
                casesTrack.scrollLeft = step * count;
            }
        };

        requestAnimationFrame(jumpToMiddle);

        const moveCases = (direction) => {
            const step = getStep();
            if (step) {
                casesTrack.scrollBy({
                    left: direction * step,
                    behavior: "smooth"
                });
            }
        };

        casesPrev?.addEventListener("click", () => moveCases(-1));
        casesNext?.addEventListener("click", () => moveCases(1));

        let correcting = false;
        casesTrack.addEventListener("scroll", () => {
            if (correcting) return;

            const step = getStep();
            if (!step) return;

            const min = step * 0.75;
            const max = step * (count * 2 + 0.25);

            if (casesTrack.scrollLeft <= min) {
                correcting = true;
                casesTrack.scrollLeft += step * count;
                requestAnimationFrame(() => { correcting = false; });
            } else if (casesTrack.scrollLeft >= max) {
                correcting = true;
                casesTrack.scrollLeft -= step * count;
                requestAnimationFrame(() => { correcting = false; });
            }
        }, { passive: true });

        // Entrada suave dos projetos.
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("case-visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });

            casesTrack.querySelectorAll(".case-card").forEach((card) => observer.observe(card));
        } else {
            casesTrack.querySelectorAll(".case-card").forEach((card) => card.classList.add("case-visible"));
        }

        window.addEventListener("resize", () => {
            const step = getStep();
            if (step) {
                casesTrack.scrollLeft = step * count;
            }
        });
    }

    /* =========================================================
       NAVEGAÇÃO LATERAL — PONTOS POR SEÇÃO
       ========================================================= */

    const sectionDots = [...document.querySelectorAll(".section-dot")];
    const sections = sectionDots
        .map((dot) => document.getElementById(dot.dataset.section))
        .filter(Boolean);

    const activateSectionDot = (id) => {
        sectionDots.forEach((dot) => {
            const active = dot.dataset.section === id;
            dot.classList.toggle("active", active);
            dot.setAttribute("aria-current", active ? "true" : "false");
        });
    };

    sectionDots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const target = document.getElementById(dot.dataset.section);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                activateSectionDot(dot.dataset.section);
            }
        });
    });

    if ("IntersectionObserver" in window && sections.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible) activateSectionDot(visible.target.id);
        }, {
            rootMargin: "-25% 0px -55% 0px",
            threshold: [0.1, 0.25, 0.5, 0.75]
        });

        sections.forEach((section) => sectionObserver.observe(section));
    }

});