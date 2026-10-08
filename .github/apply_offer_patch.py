from pathlib import Path

index=Path('index.html'); html=index.read_text(encoding='utf-8')
old='''                        <p class="plan-price">\n                            A partir de R$ 697\n                        </p>'''
new='''                        <span class="plan-discount-badge">OFERTA • 39,74% OFF</span>\n\n                        <p class="plan-price plan-price-offer">\n                            <span class="plan-price-old">R$ 697</span>\n                            <strong>R$ 420</strong>\n                        </p>\n\n                        <p class="plan-offer-note">Site profissional + hospedagem + domínio próprio por 1 ano.</p>'''
if old not in html: raise SystemExit('Preço original não encontrado')
index.write_text(html.replace(old,new,1),encoding='utf-8')

script=Path('script.js'); js=script.read_text(encoding='utf-8')
marker='''    /* =========================================================\n       NAVEGAÇÃO LATERAL — PONTOS POR SEÇÃO\n       ========================================================= */'''
feature=r'''
    /* =========================================================
       PROJETOS — VISUALIZAÇÃO EM MODAL
       ========================================================= */
    const portfolioModal = document.createElement("div");
    portfolioModal.className = "site-modal portfolio-modal";
    portfolioModal.setAttribute("aria-hidden", "true");
    portfolioModal.innerHTML = `<div class="site-modal-backdrop" data-modal-close></div><div class="site-modal-dialog portfolio-modal-dialog" role="dialog" aria-modal="true" aria-label="Visualização do projeto"><button class="site-modal-close" type="button" aria-label="Fechar" data-modal-close>×</button><img class="portfolio-modal-image" src="" alt=""><div class="portfolio-modal-footer"><div><span class="portfolio-modal-category"></span><h3 class="portfolio-modal-title"></h3></div><a class="btn btn-primary portfolio-modal-link" href="#" target="_blank" rel="noopener noreferrer">Abrir projeto</a></div></div>`;
    document.body.appendChild(portfolioModal);
    const closePortfolioModal=()=>{portfolioModal.classList.remove("active");portfolioModal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");};
    const openPortfolioModal=(card)=>{const image=card.querySelector(".case-image img"),title=card.querySelector(".case-content h3"),category=card.querySelector(".case-category"),link=card.querySelector(".case-link");if(!image||!link)return;const modalImage=portfolioModal.querySelector(".portfolio-modal-image");modalImage.src=image.currentSrc||image.src;modalImage.alt=image.alt||title?.textContent||"Projeto MantovaniSys";portfolioModal.querySelector(".portfolio-modal-title").textContent=title?.textContent||"Projeto";portfolioModal.querySelector(".portfolio-modal-category").textContent=category?.textContent||"PROJETO";portfolioModal.querySelector(".portfolio-modal-link").href=link.href;portfolioModal.classList.add("active");portfolioModal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");};
    casesTrack?.addEventListener("click",(event)=>{if(event.target.closest(".case-link"))return;const card=event.target.closest(".case-card");if(card)openPortfolioModal(card);});
    portfolioModal.addEventListener("click",(event)=>{if(event.target.closest("[data-modal-close]"))closePortfolioModal();});

    /* =========================================================
       OFERTA — POP-UP A CADA 30 SEGUNDOS
       ========================================================= */
    const offerModal=document.createElement("div");
    offerModal.className="site-modal offer-modal";offerModal.setAttribute("aria-hidden","true");
    offerModal.innerHTML=`<div class="site-modal-backdrop" data-offer-close></div><div class="site-modal-dialog offer-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="offerModalTitle"><button class="site-modal-close" type="button" aria-label="Fechar oferta" data-offer-close>×</button><span class="offer-kicker">OFERTA ESPECIAL • 39,74% OFF</span><h2 id="offerModalTitle">Seu site profissional por <strong>R$ 420</strong></h2><p>Site profissional com <strong>hospedagem e domínio próprio por 1 ano</strong>.</p><div class="offer-price"><span>De R$ 697</span><strong>R$ 420</strong></div><button class="btn btn-primary offer-cta" type="button">Ver oferta nos planos</button></div>`;
    document.body.appendChild(offerModal);
    const closeOfferModal=()=>{offerModal.classList.remove("active");offerModal.setAttribute("aria-hidden","true");if(!portfolioModal.classList.contains("active"))document.body.classList.remove("modal-open");};
    const openOfferModal=()=>{if(portfolioModal.classList.contains("active"))return;offerModal.classList.add("active");offerModal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");};
    offerModal.addEventListener("click",(event)=>{if(event.target.closest("[data-offer-close]"))closeOfferModal();});
    offerModal.querySelector(".offer-cta")?.addEventListener("click",()=>{closeOfferModal();document.getElementById("planos")?.scrollIntoView({behavior:"smooth",block:"start"});});
    window.setInterval(openOfferModal,30000);
    document.addEventListener("keydown",(event)=>{if(event.key==="Escape"){closePortfolioModal();closeOfferModal();}});

'''
if marker not in js: raise SystemExit('Marcador JS não encontrado')
script.write_text(js.replace(marker,feature+marker,1),encoding='utf-8')

style=Path('style.css'); css=style.read_text(encoding='utf-8')
extra=r'''

/* =========================================================
   MODAIS — PORTFÓLIO + OFERTA
   ========================================================= */
body.modal-open{overflow:hidden}.case-card{cursor:zoom-in}.case-link{cursor:pointer}.site-modal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;visibility:hidden;transition:opacity .22s ease,visibility .22s ease}.site-modal.active{opacity:1;visibility:visible}.site-modal-backdrop{position:absolute;inset:0;background:rgba(3,12,24,.88);backdrop-filter:blur(10px)}.site-modal-dialog{position:relative;z-index:1;width:min(1100px,94vw);max-height:90vh;overflow:auto;border:1px solid var(--border-blue);border-radius:18px;background:var(--blue-dark-2);box-shadow:0 30px 90px rgba(0,0,0,.5);transform:translateY(14px) scale(.985);transition:transform .22s ease}.site-modal.active .site-modal-dialog{transform:translateY(0) scale(1)}.site-modal-close{position:absolute;top:14px;right:14px;z-index:3;width:42px;height:42px;border:1px solid rgba(255,255,255,.2);border-radius:50%;background:rgba(3,12,24,.78);color:#fff;font-size:1.7rem;line-height:1;cursor:pointer}.portfolio-modal-image{display:block;width:100%;max-height:68vh;object-fit:contain;background:#061426}.portfolio-modal-footer{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px 26px}.portfolio-modal-category,.offer-kicker,.plan-discount-badge{display:inline-block;color:var(--blue-light);font-size:.72rem;font-weight:700;letter-spacing:.08em}.portfolio-modal-title{margin-top:5px}.offer-modal-dialog{width:min(560px,92vw);padding:42px;text-align:center;background:linear-gradient(150deg,rgba(35,142,234,.18),rgba(6,20,38,.98) 52%)}.offer-modal-dialog h2{margin:14px 0;font-size:clamp(1.8rem,5vw,2.7rem)}.offer-modal-dialog h2 strong{color:var(--blue-light)}.offer-price{display:flex;align-items:baseline;justify-content:center;gap:14px;margin:24px 0}.offer-price span{color:var(--text-muted);text-decoration:line-through}.offer-price strong{color:var(--blue-light);font-size:2.2rem}.offer-cta{width:100%}.plan-discount-badge{align-self:flex-start;margin:0 0 12px;padding:7px 10px;border:1px solid rgba(114,204,255,.35);border-radius:999px;background:rgba(35,142,234,.12)}.plan-price-offer{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}.plan-price-old{color:var(--text-muted);font-size:1rem;text-decoration:line-through}.plan-price-offer strong{color:var(--blue-light);font-size:1.9rem}.plan-offer-note{margin-top:-7px;color:var(--white);font-size:.78rem}@media(max-width:680px){.site-modal{padding:12px}.portfolio-modal-footer{align-items:stretch;flex-direction:column;padding:18px}.portfolio-modal-footer .btn{width:100%}.offer-modal-dialog{padding:36px 20px 24px}.portfolio-modal-image{max-height:62vh}}
'''
if 'MODAIS — PORTFÓLIO + OFERTA' not in css: style.write_text(css+extra,encoding='utf-8')
for p in ['.github/workflows/apply-portfolio-offer.yml','.github/workflows/apply-portfolio-offer-v2.yml','.github/apply_offer_patch.py']:
    q=Path(p)
    if q.exists(): q.unlink()
