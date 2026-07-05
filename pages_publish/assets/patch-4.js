
(function(){
  const parseMoney = text => Number(String(text||'').replace(/[^0-9]/g,'')) || 0;
  const money = value => new Intl.NumberFormat('ru-RU').format(Math.max(0, Math.round(Number(value)||0))) + ' ₽';
  function ensureSbp(){
    document.querySelectorAll('.lk-pay-modal').forEach(modal => {
      const actions = modal.querySelector('.lk-pay-actions');
      const submit = modal.querySelector('#lkPaySubmit');
      if(!actions || !submit) return;
      let sbp = modal.querySelector('#lkPaySbpButton');
      if(!sbp){
        sbp = document.createElement('button');
        sbp.type = 'button';
        sbp.id = 'lkPaySbpButton';
        sbp.className = 'lk-pay-sbp-btn lk-pay-green-btn';
        sbp.innerHTML = '<span class="lk-sbp-logo" aria-hidden="true"></span><span class="lk-sbp-text">Оплатить по СБП</span>';
        submit.insertAdjacentElement('afterend', sbp);
      }
      const rest = parseMoney((modal.querySelector('#lkCalcRest')||{}).textContent);
      const text = sbp.querySelector('.lk-sbp-text');
      if(text) text.textContent = rest > 0 ? 'Оплатить по СБП ' + money(rest) : 'СБП не требуется';
      sbp.disabled = rest <= 0;
      sbp.style.opacity = rest > 0 ? '1' : '.55';
      sbp.onclick = function(){
        const method = modal.querySelector('#lkPayMethod');
        if(method) method.value = 'СБП';
        const toast = modal.querySelector('#lkPayToast');
        if(toast){
          toast.textContent = rest > 0 ? 'Переход к оплате по СБП на сумму ' + money(rest) + '.' : 'Сумма закрыта бонусами и балансом. СБП не требуется.';
          toast.classList.add('show');
        }
      };
    });
  }
  function openFromButton(btn, e){
    if(btn.closest('.lk-pay-modal')) return false;
    const label = (btn.textContent||'').replace(/\s+/g,' ').trim();
    if(!/^Оплатить(\s|$)/i.test(label) || /Пополнить/i.test(label)) return false;
    const row = btn.closest('tr');
    const context = row || btn.closest('[class*=rounded],[class*=border],section,article,div') || btn.parentElement;
    const contextText = (context ? context.textContent : label).replace(/\s+/g,' ').trim();
    const explicit = label.match(/\d[\d\s]*₽/);
    const amounts = contextText.match(/\d[\d\s]*₽/g) || [];
    const amount = explicit ? explicit[0] : (amounts.find(v => parseMoney(v)>0) || '0 ₽');
    const basisMatch = contextText.match(/(Заказ\s*№\s*\d+[^\n]{0,80}?Сч[её]т\s*№\s*\d+|Сч[её]т\s*№\s*\d+|№\s*\d+)/i);
    const basis = basisMatch ? basisMatch[0] : contextText.slice(0,120);
    if(typeof window.lkOpenPayModal === 'function'){
      e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      window.lkOpenPayModal({basis, amount});
      setTimeout(ensureSbp,0);
      return true;
    }
    return false;
  }
  document.addEventListener('click', function(e){
    const btn = e.target.closest('button');
    if(btn) openFromButton(btn, e);
  }, true);
  ['input','change','click'].forEach(evt => document.addEventListener(evt, () => setTimeout(ensureSbp,0), true));
  new MutationObserver(ensureSbp).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureSbp); else ensureSbp();
})();

