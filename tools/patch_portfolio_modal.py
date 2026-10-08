from pathlib import Path

js = Path('script.js')
s = js.read_text()
old = 'portfolioModal.innerHTML = `<div class="site-modal-backdrop" data-modal-close></div><div class="site-modal-dialog portfolio-modal-dialog" role="dialog" aria-modal="true" aria-label="Visualização do projeto"><button class="site-modal-close" type="button" aria-label="Fechar" data-modal-close>×</button><img class="portfolio-modal-image" src="" alt=""><div class="portfolio-modal-footer"><div><span class="portfolio-modal-category"></span><h3 class="portfolio-modal-title"></h3></div><a class="btn btn-primary portfolio-modal-link" href="#" target="_blank" rel="noopener noreferrer">Abrir projeto</a></div></div>`;'
new = 'portfolioModal.innerHTML = `<div class="site-modal-backdrop" data-modal-close></div><div class="site-modal-dialog portfolio-modal-dialog" role="dialog" aria-modal="true" aria-label="Visualização do projeto"><button class="site-modal-close" type="button" aria-label="Fechar" data-modal-close>×</button><div class="portfolio-modal-layout"><div class="portfolio-modal-media"><img class="portfolio-modal-image" src="" alt=""></div><div class="portfolio-modal-info"><span class="portfolio-modal-category"></span><h3 class="portfolio-modal-title"></h3><p class="portfolio-modal-description"></p><a class="btn btn-primary portfolio-modal-link" href="#" target="_blank" rel="noopener noreferrer">Abrir projeto</a></div></div></div>`;'
if old in s:
    s = s.replace(old, new)
old2 = 'const openPortfolioModal=(card)=>{const image=card.querySelector(".case-image img"),title=card.querySelector(".case-content h3"),category=card.querySelector(".case-category"),link=card.querySelector(".case-link");if(!image||!link)return;const modalImage=portfolioModal.querySelector(".portfolio-modal-image");modalImage.src=image.currentSrc||image.src;modalImage.alt=image.alt||title?.textContent||"Projeto MantovaniSys";portfolioModal.querySelector(".portfolio-modal-title").textContent=title?.textContent||"Projeto";portfolioModal.querySelector(".portfolio-modal-category").textContent=category?.textContent||"PROJETO";portfolioModal.querySelector(".portfolio-modal-link").href=link.href;portfolioModal.classList.add("active");portfolioModal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");};'
new2 = 'const openPortfolioModal=(card)=>{const image=card.querySelector(".case-image img"),title=card.querySelector(".case-content h3"),category=card.querySelector(".case-category"),description=card.querySelector(".case-content p"),link=card.querySelector(".case-link");if(!image||!link)return;const modalImage=portfolioModal.querySelector(".portfolio-modal-image");modalImage.src=image.currentSrc||image.src;modalImage.alt=image.alt||title?.textContent||"Projeto MantovaniSys";portfolioModal.querySelector(".portfolio-modal-title").textContent=title?.textContent||"Projeto";portfolioModal.querySelector(".portfolio-modal-category").textContent=category?.textContent||"PROJETO";portfolioModal.querySelector(".portfolio-modal-description").textContent=description?.textContent||"Projeto desenvolvido pela MantovaniSys.";portfolioModal.querySelector(".portfolio-modal-link").href=link.href;portfolioModal.classList.add("active");portfolioModal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");};'
if old2 in s:
    s = s.replace(old2, new2)
js.write_text(s)

css = Path('style.css')
c = css.read_text()
tag = '/* compact portfolio details and atomic marker */'
if tag not in c:
    c += '''\n\n/* compact portfolio details and atomic marker */
.portfolio-modal-dialog{width:min(920px,92vw)!important;overflow:hidden!important}
.portfolio-modal-layout{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr)}
.portfolio-modal-media{display:flex;align-items:center;justify-content:center;min-width:0;padding:16px;background:#061426}
.portfolio-modal-image{display:block;width:auto!important;max-width:100%!important;height:auto!important;max-height:58vh!important;object-fit:contain!important;border-radius:9px}
.portfolio-modal-info{display:flex;flex-direction:column;justify-content:center;padding:30px 26px;min-width:0}
.portfolio-modal-title{margin:7px 0 12px;font-size:clamp(1.5rem,2.4vw,2rem)}
.portfolio-modal-description{margin:0 0 22px;color:var(--text-muted);font-size:.92rem;line-height:1.65}
.portfolio-modal-info .portfolio-modal-link{align-self:flex-start;min-height:40px;padding:9px 16px;font-size:.8rem}
.plan-price-old,.offer-price span{position:relative;display:inline-block;text-decoration:none!important}
.plan-price-old::after,.offer-price span::after{content:"";position:absolute;left:-8%;right:-8%;top:48%;height:9px;transform:rotate(-5deg);background:linear-gradient(90deg,rgba(215,25,32,.28),#ef3535 10%,#d71920 48%,#f04444 88%,rgba(215,25,32,.28));clip-path:polygon(0 36%,8% 17%,19% 31%,31% 7%,45% 28%,59% 11%,73% 31%,87% 13%,100% 35%,97% 73%,84% 61%,70% 84%,55% 65%,39% 88%,23% 66%,8% 82%,0 65%);pointer-events:none}
@media(max-width:760px){.portfolio-modal-dialog{width:min(94vw,600px)!important;max-height:88vh!important;overflow:auto!important}.portfolio-modal-layout{grid-template-columns:1fr}.portfolio-modal-media{padding:10px}.portfolio-modal-image{max-height:38vh!important}.portfolio-modal-info{padding:20px}.portfolio-modal-info .portfolio-modal-link{width:100%}}
'''
css.write_text(c)
