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


    /* =========================================================
       IDIOMAS — PT / EN / ES
       ========================================================= */

    const languageButtons = [...document.querySelectorAll(".language-btn")];

    const translations = {
        en: {
            "Início":"Home","Problema":"Problem","Análise":"Analysis","Solução":"Solution","Serviços":"Services","Projetos":"Projects","Planos":"Plans","Processo":"Process","FAQ":"FAQ","Como funciona":"How it works",
            "Analisar minha empresa":"Analyze my business","SITE + GOOGLE + PRESENÇA DIGITAL":"WEBSITE + GOOGLE + DIGITAL PRESENCE",
            "Seu cliente já está procurando.":"Your customer is already searching.",
            "A questão é: ele encontra sua empresa?":"The question is: will they find your business?",
            "Criamos a estrutura digital que sua empresa precisa para ser encontrada, transmitir confiança e transformar visitas em contatos: site profissional, presença no Google e caminhos claros para o cliente falar com você.":"We build the digital structure your business needs to be found, build trust and turn visits into contacts: a professional website, Google presence and clear paths for customers to reach you.",
            "Quero analisar minha empresa":"I want to analyze my business","Ver projetos":"View projects",
            "Entrega em até 48h":"Delivery within 48h","Após o briefing e recebimento do material":"After the briefing and receipt of your materials",
            "1 ano online":"1 year online","Seu projeto publicado e disponível":"Your project published and available",
            "Atendimento direto":"Direct support","Você fala com quem desenvolve":"You speak directly with the developer",
            "Conheça nossa empresa":"Discover our business","Sua empresa":"Your business","merece ser encontrada.":"deserves to be found.",
            "experiência em projetos digitais":"years of experience in digital projects","prazo de entrega":"delivery time","entrega após o briefing":"delivery after briefing","site online incluído":"website online included","Direto":"Direct","sem equipe intermediária":"no middle team",
            "O QUE ESTÁ IMPEDINDO O CONTATO":"WHAT IS PREVENTING THE CONTACT",
            "Se o cliente procura sua empresa e não encontra,":"If a customer searches for your business and cannot find it,","ele encontra outra.":"they find another one.",
            "Seu cliente compara opções antes de entrar em contato. Se sua empresa não tem uma presença digital clara, profissional e fácil de encontrar, você pode perder a oportunidade antes mesmo de começar a conversa.":"Customers compare options before getting in touch. If your business does not have a clear, professional and easy-to-find digital presence, you can lose the opportunity before the conversation even starts.",
            "Você não tem uma casa própria na internet":"You do not have a digital home of your own",
            "Instagram ajuda a divulgar. Seu site é o endereço próprio da empresa — disponível para apresentar serviços, informações e formas de contato.":"Instagram helps with promotion. Your website is your business's own address — available to present services, information and contact options.",
            "Seu cliente precisa confiar antes de entrar em contato":"Your customer needs to trust you before getting in touch",
            "Um site profissional organiza suas informações e reduz a dúvida de quem está avaliando sua empresa.":"A professional website organizes your information and reduces uncertainty for people evaluating your business.",
            "Seu concorrente já está sendo encontrado":"Your competitor is already being found",
            "Quando outra empresa aparece primeiro e transmite mais confiança, a conversa pode começar com ela — não com você.":"When another business appears first and inspires more confidence, the conversation may start with them — not you.",
            "A SOLUÇÃO":"THE SOLUTION","Sua empresa precisa ser encontrada,":"Your business needs to be found,","convencer e facilitar o contato.":"build confidence and make contact easy.",
            "A MantovaniSys constrói a presença digital da sua empresa para três objetivos: ser encontrada, apresentar valor e facilitar o próximo passo do cliente.":"MantovaniSys builds your business's digital presence around three goals: being found, showing value and making the customer's next step easy.",
            "Site bonito é o ponto de partida. A estrutura precisa responder uma pergunta simples: o cliente encontrou sua empresa — e agora consegue entrar em contato?":"A beautiful website is the starting point. The structure needs to answer one simple question: the customer found your business — can they contact you now?",
            "Veja como podemos melhorar sua presença →":"See how we can improve your presence →",
            "Ser levado a sério":"Be taken seriously","Uma apresentação digital alinhada à imagem da sua empresa.":"A digital presentation aligned with your business image.",
            "Ser encontrado":"Be found","Estrutura técnica preparada para mecanismos de busca.":"Technical structure prepared for search engines.",
            "Gerar contato":"Generate contacts","Caminhos claros para o visitante entrar em contato com sua empresa.":"Clear paths for visitors to contact your business.",
            "O QUE FAZEMOS":"WHAT WE DO","Soluções digitais para":"Digital solutions to","ser encontrada e gerar contatos.":"help you get found and generate contacts.",
            "Site, Google e presença digital organizados para transformar procura em contato.":"Website, Google and digital presence organized to turn searches into contacts.",
            "Criação de Sites":"Website Development","Sites profissionais, rápidos, responsivos e desenvolvidos para apresentar sua empresa de forma clara e confiável.":"Professional, fast and responsive websites built to present your business clearly and credibly.",
            "Design profissional":"Professional design","Responsivo para celular":"Mobile responsive","SEO técnico":"Technical SEO","Botões de contato":"Contact buttons",
            "Presença no Google":"Google Presence","Estrutura digital preparada para ajudar sua empresa a ser encontrada por pessoas que já estão procurando pelos seus serviços.":"A digital structure designed to help your business be found by people already searching for your services.",
            "Estrutura SEO":"SEO structure","Google Search Console":"Google Search Console","Indexação":"Indexing","SEO local":"Local SEO",
            "Presença Digital":"Digital Presence","Organizamos os principais pontos da presença digital para que sua empresa tenha uma apresentação consistente e caminhos claros para o cliente.":"We organize the key parts of your digital presence so your business has a consistent presentation and clear paths for customers.",
            "Presença digital integrada":"Integrated digital presence","WhatsApp e contatos":"WhatsApp and contacts","Conteúdo e informações":"Content and information","Estrutura para conversão":"Conversion structure",
            "PROVA DO TRABALHO":"SELECTED WORK","Empresas que já colocaram":"Businesses that have put","sua presença digital no ar.":"their digital presence online.",
            "Não mostramos conceitos. Mostramos projetos que já foram colocados no ar.":"We do not show concepts. We show projects that have actually gone live.",
            "ABRIR PROJETO":"OPEN PROJECT","Abrir projeto":"Open project","SITE INSTITUCIONAL":"CORPORATE WEBSITE","SITE EMPRESARIAL":"BUSINESS WEBSITE","PET SHOP":"PET SHOP","PROJETO DIGITAL":"DIGITAL PROJECT",
            "Presença digital profissional para uma empresa do segmento de lubrificantes.":"Professional digital presence for a company in the lubricants sector.",
            "Site profissional para apresentar os serviços e fortalecer a presença digital da empresa.":"Professional website to present services and strengthen the company's digital presence.",
            "Presença digital para apresentar a marca, serviços e produtos da empresa.":"Digital presence to present the brand, services and products.",
            "Projeto digital desenvolvido com identidade visual própria e apresentação personalizada.":"Digital project developed with a distinctive visual identity and personalized presentation.",
            "Site profissional desenvolvido para apresentar o trabalho e fortalecer a presença digital.":"Professional website developed to present the work and strengthen digital presence.",
            "ANÁLISE GRATUITA":"FREE ANALYSIS","Descubra como sua empresa está sendo vista":"Discover how your business is being seen","antes de perder o próximo cliente.":"before losing the next customer.",
            "Envie seu site, Instagram ou apenas o nome da empresa. Nós analisamos os pontos que mais influenciam a primeira impressão, a descoberta no Google e o contato com o cliente.":"Send us your website, Instagram or simply your business name. We analyze the factors that most influence first impressions, Google discovery and customer contact.",
            "Quero minha análise gratuita":"I want my free analysis","Google e presença local":"Google and local presence","Site e experiência no celular":"Website and mobile experience","Clareza e credibilidade":"Clarity and credibility","Facilidade para gerar contato":"Easy contact",
            "PLANOS":"PLANS","Escolha a estrutura certa para":"Choose the right structure for","o seu negócio.":"your business.","Comece pelo essencial ou construa uma presença digital mais completa.":"Start with the essentials or build a more complete digital presence.",
            "PROJETOS":"PROJECTS","Do essencial ao sob medida.":"From essential to fully custom.","Todos os projetos são desenvolvidos após o preenchimento do briefing e entregues em até 48 horas.":"All projects are developed after the briefing is completed and delivered within 48 hours.",
            "PLANO 1":"PLAN 1","SITE PROFISSIONAL":"PROFESSIONAL WEBSITE","A partir de R$ 697":"Starting at R$ 697",
            "Para empresas que precisam de um site profissional para apresentar serviços, transmitir confiança e facilitar o contato.":"For businesses that need a professional website to present services, build trust and make contact easy.",
            "Site responsivo":"Responsive website","Design personalizado":"Custom design","Versão para celular":"Mobile version","WhatsApp e canais de contato":"WhatsApp and contact channels","Estrutura preparada para Google":"Google-ready structure","1 ano de site online":"1 year of website online","Entrega em até 48 horas após o briefing":"Delivery within 48 hours after the briefing","Quero meu site":"I want my website",
            "MAIS PROCURADO":"MOST POPULAR","SITE + GOOGLE":"WEBSITE + GOOGLE","A partir de R$ 997":"Starting at R$ 997",
            "Para empresas que precisam de site + presença no Google para serem encontradas quando clientes procuram por seus serviços.":"For businesses that need a website + Google presence to be found when customers search for their services.",
            "Tudo do Site Profissional":"Everything in Professional Website","Configuração do Google Business Profile":"Google Business Profile setup","Google Maps":"Google Maps","SEO local inicial":"Initial local SEO","Otimização para buscas":"Search optimization","Estrutura preparada para gerar contatos":"Structure designed to generate contacts","Quero site + Google":"I want website + Google",
            "PLANO 3":"PLAN 3","A partir de R$ 1.497":"Starting at R$ 1,497",
            "Para empresas que querem uma apresentação diferenciada, com design sob medida e uma experiência digital que valorize a marca.":"For businesses that want a distinctive presentation, custom design and a digital experience that elevates the brand.",
            "Tudo do Site + Google":"Everything in Website + Google","Layout premium sob medida":"Custom premium layout","Páginas internas personalizadas":"Custom internal pages","Animações e efeitos visuais avançados":"Advanced animations and visual effects","Efeitos parallax e interações":"Parallax effects and interactions","Experiências interativas conforme o projeto":"Interactive experiences tailored to the project","Estrutura visual exclusiva":"Exclusive visual structure","Quero um projeto sob medida":"I want a custom project",
            "DEPOIS DA ENTREGA":"AFTER DELIVERY","Quer deixar o site com a gente?":"Want us to keep your website updated?","Planos mensais para manter seu site atualizado e funcionando.":"Monthly plans to keep your website updated and running.",
            "ESSENCIAL":"ESSENTIAL","MANUTENÇÃO":"MAINTENANCE","R$ 47":"R$ 47","/mês":"/month","Para quem quer manter o site funcionando e fazer pequenas atualizações ao longo do ano.":"For those who want to keep the website running and make small updates throughout the year.",
            "Site mantido no ar":"Website kept online","Correções técnicas":"Technical fixes","Até 3 alterações por mês":"Up to 3 changes per month","Troca de textos e imagens":"Text and image changes","Atualização de informações":"Information updates","Suporte durante o contrato":"Support during the contract","Quero manutenção":"I want maintenance",
            "Para empresas que precisam fazer alterações frequentes e manter site e Google atualizados.":"For businesses that need frequent changes and want their website and Google presence kept up to date.",
            "Tudo do plano Manutenção":"Everything in Maintenance","Alterações ilimitadas no site":"Unlimited website changes","Atualizações no Google":"Google updates","Ajustes básicos de SEO":"Basic SEO adjustments","1 atualização de conteúdo por mês":"1 content update per month","Ajustes de conteúdo":"Content adjustments","Atualizações da presença digital":"Digital presence updates","Quero presença digital":"I want digital presence",
            "CRESCIMENTO":"GROWTH","EVOLUÇÃO DIGITAL":"DIGITAL GROWTH","R$ 197":"R$ 197","Para empresas que querem produção e melhorias contínuas sem precisar cuidar disso internamente.":"For businesses that want ongoing production and improvements without managing them internally.",
            "Mais conteúdos e criativos":"More content and creatives","Atualizações e melhorias contínuas":"Ongoing updates and improvements","Otimizações de SEO":"SEO optimization","Preparação técnica para campanhas":"Technical campaign preparation","Atualizações estratégicas":"Strategic updates","Acompanhamento mensal":"Monthly support","Quero evoluir":"I want to grow",
            "Os planos recorrentes são opcionais e contratados separadamente da entrega inicial.":"Recurring plans are optional and contracted separately from the initial delivery.","Investimentos em anúncios e serviços de terceiros não estão incluídos.":"Advertising spend and third-party services are not included.","Falar com a MantovaniSys":"Talk to MantovaniSys","5 anos":"5 years","48h":"48h","1 ano":"1 year","PRESENÇA DIGITAL":"DIGITAL PRESENCE","Tudo do plano Presença Digital":"Everything from the Digital Presence plan","R$ 97":"R$ 97","© 2026 MantovaniSys. Todos os direitos reservados.":"© 2026 MantovaniSys. All rights reserved.",
            "POR QUE MANTOVANISYS":"WHY MANTOVANISYS","Não é só sobre":"It is not just about","ter um site.":"having a website.","É sobre ter uma estrutura digital que trabalhe pela imagem da sua empresa todos os dias.":"It is about having a digital structure that works for your business image every day.",
            "Credibilidade":"Credibility","Uma presença profissional ajuda a transmitir confiança antes mesmo do primeiro contato.":"A professional presence helps build trust before the first contact.",
            "Disponibilidade":"Availability","Seu site pode apresentar sua empresa 24 horas por dia.":"Your website can present your business 24 hours a day.",
            "Mais oportunidades":"More opportunities","Clientes podem encontrar informações sobre sua empresa e entrar em contato com mais facilidade.":"Customers can find information about your business and get in touch more easily.",
            "Ativo próprio":"Owned asset","Você constrói uma presença digital em um endereço que pertence ao seu negócio.":"You build a digital presence at an address that belongs to your business.",
            "COMO FUNCIONA":"HOW IT WORKS","Do primeiro contato ao":"From first contact to","cliente encontrando você.":"customers finding you.",
            "Diagnóstico":"Diagnosis","Entendemos seu negócio, seu público e onde sua presença digital pode melhorar.":"We understand your business, your audience and where your digital presence can improve.",
            "Estratégia":"Strategy","Definimos a estrutura, a mensagem e o caminho que o cliente deve seguir.":"We define the structure, message and path the customer should follow.",
            "Construção":"Build","Construímos o site, ajustamos a experiência no celular e configuramos os pontos essenciais.":"We build the website, refine the mobile experience and configure the essentials.",
            "Ativação":"Launch","Publicamos, testamos os contatos e entregamos sua presença digital pronta para receber clientes.":"We publish, test the contact paths and deliver a digital presence ready to receive customers.",
            "DÚVIDAS":"QUESTIONS","Perguntas":"Frequently","frequentes.":"asked questions.",
            "Vocês garantem que minha empresa vai aparecer no Google?":"Do you guarantee my business will appear on Google?",
            "Não prometemos posição específica. Configuramos a estrutura técnica e a presença local seguindo boas práticas, mas os resultados de busca dependem de diversos fatores.":"We do not promise a specific position. We configure the technical structure and local presence following best practices, but search results depend on several factors.",
            "Por que minha empresa precisa de um site?":"Why does my business need a website?",
            "Um site profissional funciona como uma presença digital própria da empresa, ajuda clientes a conhecer seus serviços e facilita o contato.":"A professional website acts as your business's own digital presence, helps customers learn about your services and makes contact easier.",
            "O site funciona no celular?":"Does the website work on mobile?",
            "Sim. Os projetos são desenvolvidos com design responsivo para funcionar em celulares, tablets e computadores.":"Yes. Projects are built with responsive design for phones, tablets and computers.",
            "Meu site pode aparecer no Google?":"Can my website appear on Google?",
            "A estrutura é desenvolvida seguindo boas práticas técnicas de SEO para facilitar o rastreamento e a indexação pelos mecanismos de busca. A posição nos resultados depende de diversos fatores.":"The structure follows technical SEO best practices to help search engines crawl and index the website. Ranking depends on several factors.",
            "Vocês criam sites para pequenos negócios?":"Do you build websites for small businesses?",
            "Sim. A MantovaniSys desenvolve soluções digitais para pequenos negócios e empresas que precisam construir ou melhorar sua presença na internet.":"Yes. MantovaniSys builds digital solutions for small businesses and companies that need to build or improve their online presence.",
            "QUER SABER COMO SUA EMPRESA APARECE?":"WANT TO KNOW HOW YOUR BUSINESS APPEARS?",
            "Agora faça sua empresa ser encontrada.":"Now make your business easy to find.",
            "Eu analiso sua presença digital e mostro onde sua empresa pode melhorar.":"I analyze your digital presence and show where your business can improve.",
            "Criação de sites profissionais e soluções digitais para empresas que querem ser encontradas.":"Professional websites and digital solutions for businesses that want to be found.",
            "Navegação":"Navigation","Contato":"Contact","WhatsApp":"WhatsApp","E-mail":"Email","Instagram":"Instagram",
            "Todos os direitos reservados.":"All rights reserved.","Desenvolvido por":"Developed by"
        },
        es: {
            "Início":"Inicio","Problema":"Problema","Análise":"Análisis","Solução":"Solución","Serviços":"Servicios","Projetos":"Proyectos","Planos":"Planes","Processo":"Proceso","FAQ":"FAQ","Como funciona":"Cómo funciona",
            "Analisar minha empresa":"Analizar mi empresa","SITE + GOOGLE + PRESENÇA DIGITAL":"SITIO WEB + GOOGLE + PRESENCIA DIGITAL",
            "Seu cliente já está procurando.":"Tu cliente ya está buscando.","A questão é: ele encontra sua empresa?":"La pregunta es: ¿encontrará tu empresa?",
            "Criamos a estrutura digital que sua empresa precisa para ser encontrada, transmitir confiança e transformar visitas em contatos: site profissional, presença no Google e caminhos claros para o cliente falar com você.":"Creamos la estructura digital que tu empresa necesita para ser encontrada, transmitir confianza y convertir visitas en contactos: sitio web profesional, presencia en Google y caminos claros para que el cliente se comunique contigo.",
            "Quero analisar minha empresa":"Quiero analizar mi empresa","Ver projetos":"Ver proyectos","Entrega em até 48h":"Entrega en hasta 48 h","Após o briefing e recebimento do material":"Después del briefing y de recibir el material","1 ano online":"1 año online","Seu projeto publicado e disponível":"Tu proyecto publicado y disponible","Atendimento direto":"Atención directa","Você fala com quem desenvolve":"Hablas directamente con quien desarrolla",
            "Conheça nossa empresa":"Conoce nuestra empresa","Sua empresa":"Tu empresa","merece ser encontrada.":"merece ser encontrada.","experiência em projetos digitais":"años de experiencia en proyectos digitales","prazo de entrega":"plazo de entrega","entrega após o briefing":"entrega después del briefing","site online incluído":"sitio web online incluido","Direto":"Directo","sem equipe intermediária":"sin equipo intermediario",
            "O QUE ESTÁ IMPEDINDO O CONTATO":"QUÉ ESTÁ IMPIDIENDO EL CONTACTO","Se o cliente procura sua empresa e não encontra,":"Si el cliente busca tu empresa y no la encuentra,","ele encontra outra.":"encontrará otra.",
            "Seu cliente compara opções antes de entrar em contato. Se sua empresa não tem uma presença digital clara, profissional e fácil de encontrar, você pode perder a oportunidade antes mesmo de começar a conversa.":"Tu cliente compara opciones antes de contactarte. Si tu empresa no tiene una presencia digital clara, profesional y fácil de encontrar, puedes perder la oportunidad antes de iniciar la conversación.",
            "Você não tem uma casa própria na internet":"No tienes una casa digital propia","Instagram ajuda a divulgar. Seu site é o endereço próprio da empresa — disponível para apresentar serviços, informações e formas de contato.":"Instagram ayuda a divulgar. Tu sitio web es la dirección propia de la empresa — disponible para presentar servicios, información y formas de contacto.",
            "Seu cliente precisa confiar antes de entrar em contato":"Tu cliente necesita confiar antes de contactarte","Um site profissional organiza suas informações e reduz a dúvida de quem está avaliando sua empresa.":"Un sitio web profesional organiza tu información y reduce las dudas de quien evalúa tu empresa.",
            "Seu concorrente já está sendo encontrado":"Tu competencia ya está siendo encontrada","Quando outra empresa aparece primeiro e transmite mais confiança, a conversa pode começar com ela — não com você.":"Cuando otra empresa aparece primero y transmite más confianza, la conversación puede comenzar con ella — no contigo.",
            "A SOLUÇÃO":"LA SOLUCIÓN","Sua empresa precisa ser encontrada,":"Tu empresa necesita ser encontrada,","convencer e facilitar o contato.":"convencer y facilitar el contacto.",
            "A MantovaniSys constrói a presença digital da sua empresa para três objetivos: ser encontrada, apresentar valor e facilitar o próximo passo do cliente.":"MantovaniSys construye la presencia digital de tu empresa con tres objetivos: ser encontrada, mostrar valor y facilitar el siguiente paso del cliente.",
            "Site bonito é o ponto de partida. A estrutura precisa responder uma pergunta simples: o cliente encontrou sua empresa — e agora consegue entrar em contato?":"Un sitio bonito es el punto de partida. La estructura debe responder una pregunta simple: el cliente encontró tu empresa — ¿y ahora puede contactarte?",
            "Veja como podemos melhorar sua presença →":"Mira cómo podemos mejorar tu presencia →",
            "Ser levado a sério":"Ser tomado en serio","Uma apresentação digital alinhada à imagem da sua empresa.":"Una presentación digital alineada con la imagen de tu empresa.","Ser encontrado":"Ser encontrado","Estrutura técnica preparada para mecanismos de busca.":"Estructura técnica preparada para buscadores.","Gerar contato":"Generar contactos","Caminhos claros para o visitante entrar em contato com sua empresa.":"Caminos claros para que el visitante contacte a tu empresa.",
            "O QUE FAZEMOS":"QUÉ HACEMOS","Soluções digitais para":"Soluciones digitales para","ser encontrada e gerar contatos.":"ser encontrada y generar contactos.","Site, Google e presença digital organizados para transformar procura em contato.":"Sitio web, Google y presencia digital organizados para convertir búsquedas en contactos.",
            "Criação de Sites":"Creación de Sitios","Sites profissionais, rápidos, responsivos e desenvolvidos para apresentar sua empresa de forma clara e confiável.":"Sitios profesionales, rápidos y responsivos, desarrollados para presentar tu empresa de forma clara y confiable.","Design profissional":"Diseño profesional","Responsivo para celular":"Adaptado a móviles","SEO técnico":"SEO técnico","Botões de contato":"Botones de contacto",
            "Presença no Google":"Presencia en Google","Estrutura digital preparada para ajudar sua empresa a ser encontrada por pessoas que já estão procurando pelos seus serviços.":"Estructura digital preparada para ayudar a que tu empresa sea encontrada por personas que ya buscan tus servicios.","Estrutura SEO":"Estructura SEO","Indexação":"Indexación","SEO local":"SEO local",
            "Presença Digital":"Presencia Digital","Organizamos os principais pontos da presença digital para que sua empresa tenha uma apresentação consistente e caminhos claros para o cliente.":"Organizamos los principales puntos de la presencia digital para que tu empresa tenga una presentación consistente y caminos claros para el cliente.","Presença digital integrada":"Presencia digital integrada","WhatsApp e contatos":"WhatsApp y contactos","Conteúdo e informações":"Contenido e información","Estrutura para conversão":"Estructura para conversión",
            "PROVA DO TRABALHO":"TRABAJOS SELECCIONADOS","Empresas que já colocaram":"Empresas que ya pusieron","sua presença digital no ar.":"su presencia digital online.","Não mostramos conceitos. Mostramos projetos que já foram colocados no ar.":"No mostramos conceptos. Mostramos proyectos que ya están online.","ABRIR PROJETO":"ABRIR PROYECTO","Abrir projeto":"Abrir proyecto","SITE INSTITUCIONAL":"SITIO INSTITUCIONAL","SITE EMPRESARIAL":"SITIO EMPRESARIAL","PROJETO DIGITAL":"PROYECTO DIGITAL",
            "Presença digital profissional para uma empresa do segmento de lubrificantes.":"Presencia digital profesional para una empresa del sector de lubricantes.","Site profissional para apresentar os serviços e fortalecer a presença digital da empresa.":"Sitio profesional para presentar los servicios y fortalecer la presencia digital de la empresa.","Presença digital para apresentar a marca, serviços e produtos da empresa.":"Presencia digital para presentar la marca, servicios y productos.","Projeto digital desenvolvido com identidade visual própria e apresentação personalizada.":"Proyecto digital desarrollado con identidad visual propia y presentación personalizada.","Site profissional desenvolvido para apresentar o trabalho e fortalecer a presença digital.":"Sitio profesional desarrollado para presentar el trabajo y fortalecer la presencia digital.",
            "ANÁLISE GRATUITA":"ANÁLISIS GRATUITO","Descubra como sua empresa está sendo vista":"Descubre cómo se está viendo tu empresa","antes de perder o próximo cliente.":"antes de perder al próximo cliente.","Envie seu site, Instagram ou apenas o nome da empresa. Nós analisamos os pontos que mais influenciam a primeira impressão, a descoberta no Google e o contato com o cliente.":"Envíanos tu sitio web, Instagram o simplemente el nombre de la empresa. Analizamos los factores que más influyen en la primera impresión, el descubrimiento en Google y el contacto con el cliente.","Quero minha análise gratuita":"Quiero mi análisis gratuito","Google e presença local":"Google y presencia local","Site e experiência no celular":"Sitio y experiencia móvil","Clareza e credibilidade":"Claridad y credibilidad","Facilidade para gerar contato":"Facilidad para generar contactos",
            "PLANOS":"PLANES","Escolha a estrutura certa para":"Elige la estructura adecuada para","o seu negócio.":"tu negocio.","Comece pelo essencial ou construa uma presença digital mais completa.":"Empieza por lo esencial o construye una presencia digital más completa.","PROJETOS":"PROYECTOS","Do essencial ao sob medida.":"De lo esencial a lo personalizado.","Todos os projetos são desenvolvidos após o preenchimento do briefing e entregues em até 48 horas.":"Todos los proyectos se desarrollan después de completar el briefing y se entregan en hasta 48 horas.",
            "PLANO 1":"PLAN 1","SITE PROFISSIONAL":"SITIO PROFESIONAL","A partir de R$ 697":"Desde R$ 697","Para empresas que precisam de um site profissional para apresentar serviços, transmitir confiança e facilitar o contato.":"Para empresas que necesitan un sitio profesional para presentar servicios, transmitir confianza y facilitar el contacto.","Site responsivo":"Sitio responsivo","Design personalizado":"Diseño personalizado","Versão para celular":"Versión móvil","WhatsApp e canais de contato":"WhatsApp y canales de contacto","Estrutura preparada para Google":"Estructura preparada para Google","1 ano de site online":"1 año de sitio online","Entrega em até 48 horas após o briefing":"Entrega en hasta 48 horas después del briefing","Quero meu site":"Quiero mi sitio",
            "MAIS PROCURADO":"MÁS ELEGIDO","SITE + GOOGLE":"SITIO + GOOGLE","A partir de R$ 997":"Desde R$ 997","Para empresas que precisam de site + presença no Google para serem encontradas quando clientes procuram por seus serviços.":"Para empresas que necesitan sitio + presencia en Google para ser encontradas cuando los clientes buscan sus servicios.","Tudo do Site Profissional":"Todo lo del Sitio Profesional","Configuração do Google Business Profile":"Configuración de Google Business Profile","Google Maps":"Google Maps","SEO local inicial":"SEO local inicial","Otimização para buscas":"Optimización para búsquedas","Estrutura preparada para gerar contatos":"Estructura preparada para generar contactos","Quero site + Google":"Quiero sitio + Google",
            "PLANO 3":"PLAN 3","A partir de R$ 1.497":"Desde R$ 1.497","Para empresas que querem uma apresentação diferenciada, com design sob medida e uma experiência digital que valorize a marca.":"Para empresas que quieren una presentación diferenciada, diseño personalizado y una experiencia digital que valore la marca.","Tudo do Site + Google":"Todo lo del Sitio + Google","Layout premium sob medida":"Diseño premium personalizado","Páginas internas personalizadas":"Páginas internas personalizadas","Animações e efeitos visuais avançados":"Animaciones y efectos visuales avanzados","Efeitos parallax e interações":"Efectos parallax e interacciones","Experiências interativas conforme o projeto":"Experiencias interactivas según el proyecto","Estrutura visual exclusiva":"Estructura visual exclusiva","Quero um projeto sob medida":"Quiero un proyecto personalizado",
            "DEPOIS DA ENTREGA":"DESPUÉS DE LA ENTREGA","Quer deixar o site com a gente?":"¿Quieres que mantengamos tu sitio?","Planos mensais para manter seu site atualizado e funcionando.":"Planes mensuales para mantener tu sitio actualizado y funcionando.","ESSENCIAL":"ESENCIAL","MANUTENÇÃO":"MANTENIMIENTO","Para quem quer manter o site funcionando e fazer pequenas atualizações ao longo do ano.":"Para quienes quieren mantener el sitio funcionando y hacer pequeñas actualizaciones durante el año.","Site mantido no ar":"Sitio mantenido online","Correções técnicas":"Correcciones técnicas","Até 3 alterações por mês":"Hasta 3 cambios al mes","Troca de textos e imagens":"Cambio de textos e imágenes","Atualização de informações":"Actualización de información","Suporte durante o contrato":"Soporte durante el contrato","Quero manutenção":"Quiero mantenimiento",
            "Para empresas que precisam fazer alterações frequentes e manter site e Google atualizados.":"Para empresas que necesitan cambios frecuentes y mantener el sitio y Google actualizados.","Tudo do plano Manutenção":"Todo lo del plan Mantenimiento","Alterações ilimitadas no site":"Cambios ilimitados en el sitio","Atualizações no Google":"Actualizaciones en Google","Ajustes básicos de SEO":"Ajustes básicos de SEO","1 atualização de conteúdo por mês":"1 actualización de contenido al mes","Ajustes de conteúdo":"Ajustes de contenido","Atualizações da presença digital":"Actualizaciones de la presencia digital","Quero presença digital":"Quiero presencia digital",
            "CRESCIMENTO":"CRECIMIENTO","EVOLUÇÃO DIGITAL":"EVOLUCIÓN DIGITAL","Para empresas que querem produção e melhorias contínuas sem precisar cuidar disso internamente.":"Para empresas que quieren producción y mejoras continuas sin tener que gestionarlas internamente.","Mais conteúdos e criativos":"Más contenidos y creatividades","Atualizações e melhorias contínuas":"Actualizaciones y mejoras continuas","Otimizações de SEO":"Optimización SEO","Preparação técnica para campanhas":"Preparación técnica para campañas","Atualizações estratégicas":"Actualizaciones estratégicas","Acompanhamento mensal":"Seguimiento mensual","Quero evoluir":"Quiero evolucionar",
            "Os planos recorrentes são opcionais e contratados separadamente da entrega inicial.":"Los planes recurrentes son opcionales y se contratan por separado de la entrega inicial.","Investimentos em anúncios e serviços de terceiros não estão incluídos.":"La inversión en anuncios y servicios de terceros no está incluida.","Falar com a MantovaniSys":"Hablar con MantovaniSys",
            "POR QUE MANTOVANISYS":"POR QUÉ MANTOVANISYS","Não é só sobre":"No se trata solo de","ter um site.":"tener un sitio.","É sobre ter uma estrutura digital que trabalhe pela imagem da sua empresa todos os dias.":"Se trata de tener una estructura digital que trabaje por la imagen de tu empresa todos los días.","Credibilidade":"Credibilidad","Uma presença profissional ajuda a transmitir confiança antes mesmo do primeiro contato.":"Una presencia profesional ayuda a transmitir confianza incluso antes del primer contacto.","Disponibilidade":"Disponibilidad","Seu site pode apresentar sua empresa 24 horas por dia.":"Tu sitio puede presentar tu empresa las 24 horas del día.","Mais oportunidades":"Más oportunidades","Clientes podem encontrar informações sobre sua empresa e entrar em contato com mais facilidade.":"Los clientes pueden encontrar información sobre tu empresa y contactarte con mayor facilidad.","Ativo próprio":"Activo propio","Você constrói uma presença digital em um endereço que pertence ao seu negócio.":"Construyes una presencia digital en una dirección que pertenece a tu negocio.",
            "COMO FUNCIONA":"CÓMO FUNCIONA","Do primeiro contato ao":"Del primer contacto a","cliente encontrando você.":"que los clientes te encuentren.","Diagnóstico":"Diagnóstico","Entendemos seu negócio, seu público e onde sua presença digital pode melhorar.":"Entendemos tu negocio, tu público y dónde puede mejorar tu presencia digital.","Estratégia":"Estrategia","Definimos a estrutura, a mensagem e o caminho que o cliente deve seguir.":"Definimos la estructura, el mensaje y el camino que debe seguir el cliente.","Construção":"Construcción","Construímos o site, ajustamos a experiência no celular e configuramos os pontos essenciais.":"Construimos el sitio, ajustamos la experiencia móvil y configuramos los puntos esenciales.","Ativação":"Activación","Publicamos, testamos os contatos e entregamos sua presença digital pronta para receber clientes.":"Publicamos, probamos los contactos y entregamos tu presencia digital lista para recibir clientes.",
            "DÚVIDAS":"PREGUNTAS","Perguntas":"Preguntas","frequentes.":"frecuentes.","Vocês garantem que minha empresa vai aparecer no Google?":"¿Garantizan que mi empresa aparecerá en Google?","Não prometemos posição específica. Configuramos a estrutura técnica e a presença local seguindo boas práticas, mas os resultados de busca dependem de diversos fatores.":"No prometemos una posición específica. Configuramos la estructura técnica y la presencia local siguiendo buenas prácticas, pero los resultados de búsqueda dependen de varios factores.","Por que minha empresa precisa de um site?":"¿Por qué mi empresa necesita un sitio web?","Um site profissional funciona como uma presença digital própria da empresa, ajuda clientes a conhecer seus serviços e facilita o contato.":"Un sitio web profesional funciona como la presencia digital propia de la empresa, ayuda a los clientes a conocer sus servicios y facilita el contacto.","O site funciona no celular?":"¿El sitio funciona en el móvil?","Sim. Os projetos são desenvolvidos com design responsivo para funcionar em celulares, tablets e computadores.":"Sí. Los proyectos se desarrollan con diseño responsivo para funcionar en móviles, tablets y ordenadores.","Meu site pode aparecer no Google?":"¿Mi sitio puede aparecer en Google?","A estrutura é desenvolvida seguindo boas práticas técnicas de SEO para facilitar o rastreamento e a indexação pelos mecanismos de busca. A posição nos resultados depende de diversos fatores.":"La estructura sigue buenas prácticas técnicas de SEO para facilitar el rastreo y la indexación por los buscadores. La posición en los resultados depende de varios factores.","Vocês criam sites para pequenos negócios?":"¿Crean sitios para pequeños negocios?","Sim. A MantovaniSys desenvolve soluções digitais para pequenos negócios e empresas que precisam construir ou melhorar sua presença na internet.":"Sí. MantovaniSys desarrolla soluciones digitales para pequeños negocios y empresas que necesitan construir o mejorar su presencia en internet.",
            "QUER SABER COMO SUA EMPRESA APARECE?":"¿QUIERES SABER CÓMO APARECE TU EMPRESA?","Agora faça sua empresa ser encontrada.":"Ahora haz que tu empresa sea encontrada.","Eu analiso sua presença digital e mostro onde sua empresa pode melhorar.":"Analizo tu presencia digital y te muestro dónde puede mejorar tu empresa.","Criação de sites profissionais e soluções digitais para empresas que querem ser encontradas.":"Creación de sitios profesionales y soluciones digitales para empresas que quieren ser encontradas.","Navegação":"Navegación","Contato":"Contacto","WhatsApp":"WhatsApp","E-mail":"Correo electrónico","Instagram":"Instagram","Todos os direitos reservados.":"Todos los derechos reservados.","Desenvolvido por":"Desarrollado por"
        }
    };

    const originalText = new WeakMap();

    const translatePage = (lang) => {
        const dictionary = translations[lang] || {};
        if (!["pt","en","es"].includes(lang)) return;

        document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;

        document.querySelectorAll("title, meta[name='description'], meta[property='og:title'], meta[property='og:description'], meta[name='twitter:title'], meta[name='twitter:description']").forEach((el) => {
            if (!originalText.has(el)) originalText.set(el, el.content || el.textContent);
        });

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.parentElement && !["SCRIPT","STYLE"].includes(node.parentElement.tagName)) nodes.push(node);
        }

        nodes.forEach((node) => {
            if (!originalText.has(node)) originalText.set(node, node.nodeValue);
            const raw = originalText.get(node);
            const key = raw.trim();
            if (!key) return;
            const translated = lang === "pt" ? key : (dictionary[key] || key);
            node.nodeValue = raw.replace(key, translated);
        });

        const titleMap = {
            pt: "MantovaniSys | Site + Google para sua empresa aparecer",
            en: "MantovaniSys | Website + Google for your business",
            es: "MantovaniSys | Sitio web + Google para tu empresa"
        };
        const descMap = {
            pt: "Site + Google + presença digital para empresas que querem ser encontradas, transmitir confiança e gerar mais contatos.",
            en: "Website + Google + digital presence for businesses that want to be found, build trust and generate more contacts.",
            es: "Sitio web + Google + presencia digital para empresas que quieren ser encontradas, transmitir confianza y generar más contactos."
        };
        document.title = titleMap[lang];
        document.querySelector("meta[name='description']")?.setAttribute("content", descMap[lang]);
        document.querySelector("meta[property='og:title']")?.setAttribute("content", titleMap[lang]);
        document.querySelector("meta[property='og:description']")?.setAttribute("content", descMap[lang]);
        document.querySelector("meta[name='twitter:title']")?.setAttribute("content", titleMap[lang]);
        document.querySelector("meta[name='twitter:description']")?.setAttribute("content", descMap[lang]);

        languageButtons.forEach((button) => {
            const active = button.dataset.language === lang;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        try {
            const url = new URL(window.location.href);
            if (lang === "pt") url.searchParams.delete("lang");
            else url.searchParams.set("lang", lang);
            window.history.replaceState({}, "", url);
        } catch (_) {}

        try { localStorage.setItem("mantovanisys-language", lang); } catch (_) {}
    };

    languageButtons.forEach((button) => {
        button.addEventListener("click", () => translatePage(button.dataset.language));
    });

    let initialLanguage = "pt";
    try {
        const urlLang = new URL(window.location.href).searchParams.get("lang");
        const storedLang = localStorage.getItem("mantovanisys-language");
        if (["en","es"].includes(urlLang)) initialLanguage = urlLang;
        else if (["en","es"].includes(storedLang)) initialLanguage = storedLang;
    } catch (_) {}

    if (initialLanguage !== "pt") translatePage(initialLanguage);
    else languageButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.classList.contains("active"))));

});
