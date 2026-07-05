
(function(){
  const money = value => new Intl.NumberFormat('ru-RU').format(Math.max(0, Math.round(Number(value)||0))) + ' ₽';
  const parseAmount = text => {
    const matches = String(text || '').match(/\d[\d\s]{2,}\s*₽/g) || [];
    if(!matches.length) return 0;
    const clean = matches
      .map(v => Number(String(v).replace(/[^0-9]/g,'')) || 0)
      .filter(v => v > 0);
    return clean.length ? Math.max.apply(null, clean) : 0;
  };
  function amountFromContext(btn){
    const row = btn.closest('tr');
    if(row){
      const amount = parseAmount(row.textContent);
      if(amount) return amount;
    }
    let node = btn.parentElement;
    for(let i=0; i<7 && node; i++, node=node.parentElement){
      const amount = parseAmount(node.textContent);
      if(amount) return amount;
    }
    return 0;
  }
  function patchPaymentButtons(root){
    (root || document).querySelectorAll('button').forEach(btn => {
      const text = (btn.textContent || '').replace(/\s+/g,' ').trim();
      const isPay = /^(Оплатить|Оплатить заказ|Перейти к оплате)(\s|$)/i.test(text) || btn.id === 'lkPaySubmit';
      if(!isPay || /Пополнить/i.test(text)) return;
      btn.classList.add('lk-pay-green-btn');
      if(btn.id === 'lkPaySubmit') return;
      if(/^Оплатить\s+(остаток|[0-9])/i.test(text)) return;
      const amount = amountFromContext(btn);
      if(amount){
        btn.textContent = 'Оплатить ' + money(amount);
      }
    });
  }
  function schedulePatch(){ window.setTimeout(() => patchPaymentButtons(document), 30); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedulePatch); else schedulePatch();
  document.addEventListener('click', schedulePatch, true);
  const observer = new MutationObserver(schedulePatch);
  observer.observe(document.documentElement, {childList:true, subtree:true, characterData:true});
})();

