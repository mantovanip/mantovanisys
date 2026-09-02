document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const backToTop = document.getElementById("backToTop");

  /* =========================
     HEADER + BOTÃO VOLTAR AO TOPO
  ========================= */

  const updateScrollElements = () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 600);
    }
  };

  window.addEventListener("scroll", updateScrollElements, {
    passive: true
  });

  updateScrollElements();


  /* =========================
     MENU MOBILE
  ========================= */

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isActive = mainNav.classList.toggle("active");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isActive)
      );

      menuToggle.setAttribute(
        "aria-label",
        isActive ? "Fechar menu" : "Abrir menu"
      );
    });

    // Fecha o menu ao clicar em um link
    document.querySelectorAll("#mainNav a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("active");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.setAttribute(
          "aria-label",
          "Abrir menu"
        );
      });
    });

    // Fecha o menu ao apertar ESC
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        mainNav.classList.remove("active");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.setAttribute(
          "aria-label",
          "Abrir menu"
        );
      }
    });
  }


  /* =========================
     SCROLL SUAVE
  ========================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

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


  /* =========================
     FAQ
  ========================= */

  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      const currentItem = question.closest(".faq-item");

      if (!currentItem) {
        return;
      }

      const isCurrentlyActive =
        currentItem.classList.contains("active");

      // Fecha todos
      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active");

        const button = item.querySelector(".faq-question");

        if (button) {
          button.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      });

      // Abre o selecionado
      if (!isCurrentlyActive) {
        currentItem.classList.add("active");

        question.setAttribute(
          "aria-expanded",
          "true"
        );
      }
    });
  });


  /* =========================
     VOLTAR AO TOPO
  ========================= */

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }


  /* =========================
     WHATSAPP — RASTREAMENTO
  ========================= */

  document.querySelectorAll(".whatsapp-link").forEach((link) => {
    link.addEventListener("click", () => {

      // Só funciona quando o Google Analytics estiver instalado.
      if (typeof window.gtag === "function") {
        window.gtag("event", "whatsapp_click", {
          event_category: "engagement",
          event_label: "WhatsApp"
        });
      }
    });
  });


  /* =========================
     PORTFÓLIO — RASTREAMENTO
  ========================= */

  document.querySelectorAll(".case-link").forEach((link) => {
    link.addEventListener("click", () => {

      if (typeof window.gtag === "function") {
        window.gtag("event", "case_click", {
          event_category: "portfolio",
          event_label: link.href
        });
      }
    });
  });

});