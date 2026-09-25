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
       PROJETOS — CARROSSEL + REVEAL
       ========================================================= */

    const casesTrack = document.getElementById("casesTrack");
    const casesPrev = document.querySelector(".cases-prev");
    const casesNext = document.querySelector(".cases-next");

    if (casesTrack) {
        const caseCards = [...casesTrack.querySelectorAll(".case-card")];

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("case-visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.16 });
            caseCards.forEach((card) => observer.observe(card));
        } else {
            caseCards.forEach((card) => card.classList.add("case-visible"));
        }

        const moveCases = (direction) => {
            const amount = Math.min(casesTrack.clientWidth * 0.82, 560);
            casesTrack.scrollBy({ left: direction * amount, behavior: "smooth" });
        };

        casesPrev?.addEventListener("click", () => moveCases(-1));
        casesNext?.addEventListener("click", () => moveCases(1));

        // Mobile uses native touch scrolling. Desktop uses the arrow controls.
        // Keeping links free of pointer-capture guarantees every project button remains clickable.
    }

});