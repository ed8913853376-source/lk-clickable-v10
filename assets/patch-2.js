
(function(){
  function clean(el){return ((el&&el.textContent)||'').replace(/\s+/g,' ').trim();}
  function isTopupButton(el){
    const text=clean(el);
    return /Пополнить\s*\/\s*оплатить|Пополнить\s+сч[её]т/i.test(text);
  }
  function isMobileBillingNav(el){
    const text=clean(el);
    return window.innerWidth<1024 && /^Счета\s+и\s+оплаты$/i.test(text);
  }
  function openTopup(){
    if(typeof window.lkOpenPayModal==='function'){
      window.lkOpenPayModal({basis:'Пополнение баланса', amount:10000});
    } else {
      window.dispatchEvent(new CustomEvent('lk:prototype-action',{detail:{title:'Оплата'}}));
    }
  }
  window.addEventListener('click',function(e){
    const target=e.target && e.target.closest && e.target.closest('button,a,[role="button"]');
    if(!target) return;
    if(target.closest('.lk3-pay-modal')) return;
    if(isTopupButton(target) || isMobileBillingNav(target)){
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      openTopup();
    }
  },true);
})();

