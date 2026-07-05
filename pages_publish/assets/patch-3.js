
(function(){
  const parseMoney = text => Number(String(text||'').replace(/[^0-9]/g,'')) || 0;
  const money = value => new Intl.NumberFormat('ru-RU').format(Math.max(0, Math.round(Number(value)||0))) + ' ₽';
  function updateSbpButton(modal){
    if(!modal) return;
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
      sbp.addEventListener('click', function(){
        const method = modal.querySelector('#lkPayMethod');
        if(method) method.value = 'СБП';
        const toast = modal.querySelector('#lkPayToast');
        const rest = parseMoney((modal.querySelector('#lkCalcRest')||{}).textContent);
        if(toast){
          toast.textContent = rest > 0 ? ('Переход к оплате по СБП на сумму ' + money(rest) + '.') : 'Сумма полностью закрывается бонусами и балансом. СБП не требуется.';
          toast.classList.add('show');
        }
      });
    }
    const rest = parseMoney((modal.querySelector('#lkCalcRest')||{}).textContent);
    const text = sbp.querySelector('.lk-sbp-text');
    if(text) text.textContent = rest > 0 ? ('Оплатить по СБП ' + money(rest)) : 'СБП не требуется';
    sbp.disabled = rest <= 0;
    sbp.style.opacity = rest > 0 ? '1' : '.55';
  }
  function scan(){ document.querySelectorAll('.lk-pay-modal').forEach(updateSbpButton); }
  document.addEventListener('input', () => window.setTimeout(scan, 0), true);
  document.addEventListener('change', () => window.setTimeout(scan, 0), true);
  document.addEventListener('click', () => window.setTimeout(scan, 40), true);
  const observer = new MutationObserver(scan);
  observer.observe(document.documentElement, {childList:true, subtree:true, characterData:true});
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan); else scan();
})();


