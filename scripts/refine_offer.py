from pathlib import Path

p=Path('script.js')
s=p.read_text()
start=s.index('    /* =========================================================\n       OFERTA — POP-UP A CADA 30 SEGUNDOS')
end=s.index('    /* =========================================================\n       NAVEGAÇÃO LATERAL', start)
new='''    /* =========================================================
       OFERTA — POP-UP IMEDIATO + LEMBRETE A CADA 30 SEGUNDOS
       ========================================================= */
    const offerModal=document.createElement("div");
    offerModal.className="site-modal offer-modal";offerModal.setAttribute("aria-hidden","true");
    offerModal.innerHTML=`<div class="site-modal-backdrop" data-offer-close></div><div class="site-modal-dialog offer-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="offerModalTitle"><button class="site-modal-close" type="button" aria-label="Fechar oferta" data-offer-close>×</button><span class="offer-kicker">OFERTA ESPECIAL • 39,74% OFF</span><h2 id="offerModalTitle">Seu site profissional por <strong>R$ 420</strong></h2><p>Site profissional + <strong>hospedagem e domínio próprio por 1 ano</strong>.</p><div class="offer-price"><span>De R$ 697</span><strong>R$ 420</strong></div><button class="btn btn-primary offer-cta" type="button">Ver oferta nos planos</button></div>`;
    document.body.appendChild(offerModal);
    const playOfferCoin=()=>{try{const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;const ctx=new AudioCtx(),now=ctx.currentTime,gain=ctx.createGain();gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.06,now+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+.38);gain.connect(ctx.destination);[880,1320].forEach((freq,i)=>{const osc=ctx.createOscillator();osc.type="sine";osc.frequency.setValueAtTime(freq,now+i*.07);osc.connect(gain);osc.start(now+i*.07);osc.stop(now+.32+i*.07);});setTimeout(()=>ctx.close(),600);}catch(e){}};
    const closeOfferModal=()=>{offerModal.classList.remove("active");offerModal.setAttribute("aria-hidden","true");if(!portfolioModal.classList.contains("active"))document.body.classList.remove("modal-open");};
    const openOfferModal=()=>{if(portfolioModal.classList.contains("active"))return;offerModal.classList.add("active");offerModal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");playOfferCoin();};
    offerModal.addEventListener("click",(event)=>{if(event.target.closest("[data-offer-close]"))closeOfferModal();});
    offerModal.querySelector(".offer-cta")?.addEventListener("click",()=>{closeOfferModal();document.getElementById("planos")?.scrollIntoView({behavior:"smooth",block:"start"});});
    requestAnimationFrame(()=>setTimeout(openOfferModal,300));
    window.setInterval(openOfferModal,30000);
    document.addEventListener("keydown",(event)=>{if(event.key==="Escape"){closePortfolioModal();closeOfferModal();}});

'''
p.write_text(s[:start]+new+s[end:])

css=Path('style.css')
c=css.read_text()
marker='/* refined offer modal v2 */'
if marker not in c:
    c += '''\n\n/* refined offer modal v2 */
.offer-modal .site-modal-backdrop{background:rgba(1,10,20,.76);backdrop-filter:blur(5px)}
.offer-modal-dialog{width:min(430px,calc(100vw - 32px))!important;min-height:0!important;padding:30px 34px 32px!important;border:1px solid rgba(73,183,255,.42)!important;border-radius:20px!important;background:linear-gradient(145deg,#09233b 0%,#031525 100%)!important;box-shadow:0 26px 80px rgba(0,0,0,.5),0 0 32px rgba(47,171,255,.09)!important;text-align:center;animation:offerPulse 1.65s ease-in-out infinite!important;transform-origin:center}
.offer-modal-dialog .site-modal-close{width:38px!important;height:38px!important;top:14px!important;right:14px!important;font-size:24px!important}
.offer-kicker{display:inline-flex!important;margin:0 auto 16px!important;padding:7px 12px!important;border-radius:999px!important;background:rgba(63,180,255,.12)!important;color:#69c7ff!important;font-size:11px!important;font-weight:800!important;letter-spacing:.07em!important}
.offer-modal-dialog h2{margin:0 auto 12px!important;max-width:350px!important;font-size:clamp(27px,3vw,36px)!important;line-height:1.08!important;letter-spacing:-.035em!important}.offer-modal-dialog h2 strong{color:#56bdff!important;white-space:nowrap}
.offer-modal-dialog>p{margin:0 auto 18px!important;max-width:340px!important;font-size:14px!important;line-height:1.55!important;color:#c7d5e2!important}
.offer-price{display:flex!important;align-items:center!important;justify-content:center!important;gap:15px!important;margin:0 0 20px!important;padding:0!important;background:none!important}.offer-price span{font-size:15px!important;color:#8092a5!important;text-decoration:line-through!important}.offer-price strong{font-size:32px!important;color:#59c1ff!important;line-height:1!important}
.offer-cta{width:100%!important;min-height:48px!important;border-radius:11px!important;font-size:14px!important;background:linear-gradient(135deg,#e5c77f,#cda956)!important;color:#071525!important;box-shadow:none!important}
@keyframes offerPulse{0%,100%{transform:translate3d(0,0,0) scale(1)}25%{transform:translate3d(-2px,0,0) scale(1.006)}50%{transform:translate3d(2px,-1px,0) scale(1.012);box-shadow:0 28px 88px rgba(0,0,0,.54),0 0 42px rgba(47,171,255,.18)}75%{transform:translate3d(-1px,1px,0) scale(1.006)}}
@media(prefers-reduced-motion:reduce){.offer-modal-dialog{animation:none!important}}@media(max-width:600px){.offer-modal-dialog{width:calc(100vw - 24px)!important;padding:27px 22px 24px!important}.offer-modal-dialog h2{font-size:27px!important}.offer-price strong{font-size:29px!important}}
'''
css.write_text(c)
