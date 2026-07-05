
(function(){
  const parseMoney = text => Number(String(text||'').replace(/[^0-9]/g,'')) || 0;
  const money = value => new Intl.NumberFormat('ru-RU').format(Math.max(0, Math.round(Number(value)||0))) + ' ₽';
  function isInsidePayModal(el){ return !!(el && el.closest && el.closest('.lk-pay-modal')); }
  function findPayAmount(btn){
    const explicit = (btn.textContent||'').match(/\d[\d\s]*₽/);
    if(explicit) return parseMoney(explicit[0]);
    const row = btn.closest('tr');
    const contexts = [row, btn.closest('[class*=rounded]'), btn.closest('[class*=border]'), btn.parentElement].filter(Boolean);
    for(const ctx of contexts){
      const amounts = (ctx.textContent||'').match(/\d[\d\s]*₽/g) || [];
      const values = amounts.map(parseMoney).filter(Boolean).sort((a,b)=>b-a);
      if(values.length) return values[0];
    }
    return 0;
  }
  function findPayBasis(btn){
    const row = btn.closest('tr');
    const ctx = row || btn.closest('[class*=rounded]') || btn.closest('[class*=border]') || btn.parentElement;
    const txt = ((ctx && ctx.textContent) || btn.textContent || '').replace(/\s+/g,' ').trim();
    const match = txt.match(/(Заказ\s*№\s*\d+[^.]{0,90}?Сч[её]т\s*№\s*\d+|Сч[её]т\s*№\s*\d+[^.]{0,40}?|Заказ\s*№\s*\d+)/i);
    return match ? match[0] : txt.slice(0,120);
  }
  function markPayButtons(root){
    (root||document).querySelectorAll('button').forEach(btn=>{
      if(isInsidePayModal(btn)) return;
      const text=(btn.textContent||'').replace(/\s+/g,' ').trim();
      if(/^Оплатить(\s|$)/i.test(text) && !/Пополнить/i.test(text)){
        btn.dataset.payAction='true';
        btn.classList.add('lk-pay-green-btn');
        if(!/^Оплатить\s+\d/i.test(text)){
          const amount=findPayAmount(btn);
          if(amount) btn.textContent='Оплатить '+money(amount);
        }
      }
    });
  }
  function forceOpenPay(btn,e){
    if(isInsidePayModal(btn)) return false;
    const text=(btn.textContent||'').replace(/\s+/g,' ').trim();
    if(!/^Оплатить(\s|$)/i.test(text) || /Пополнить/i.test(text)) return false;
    const amount=findPayAmount(btn);
    const basis=findPayBasis(btn);
    if(typeof window.lkOpenPayModal === 'function'){
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      window.lkOpenPayModal({basis, amount});
      setTimeout(()=>{
        const modal=document.querySelector('.lk-pay-modal');
        if(modal){
          const submit=modal.querySelector('#lkPaySubmit');
          if(submit){ submit.classList.add('lk-pay-green-btn'); }
          const sbp=modal.querySelector('#lkPaySbpButton');
          if(sbp){ sbp.classList.add('lk-pay-green-btn'); }
        }
      },30);
      return true;
    }
    return false;
  }
  document.addEventListener('click', function(e){
    const btn=e.target.closest && e.target.closest('button');
    if(btn) forceOpenPay(btn,e);
  }, true);
  let raf=0;
  function schedule(){
    if(raf) return;
    raf=requestAnimationFrame(()=>{ raf=0; markPayButtons(document); });
  }
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', schedule); else schedule();
})();

