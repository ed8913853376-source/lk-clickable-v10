
(function(){
  const docs=[
    {label:'Заказ №9012 / Счёт №237', amount:45000},
    {label:'Заказ №8997 / Счёт №233', amount:12900},
    {label:'Пополнение баланса', amount:10000},
    {label:'Оплата аренды ресурсов', amount:23791}
  ];
  const bonusesAvail=4800, balanceAvail=23791;
  const money=v=>new Intl.NumberFormat('ru-RU').format(Math.max(0,Math.round(Number(v)||0)))+' ₽';
  const parseMoney=v=>Number(String(v||'').replace(/[^0-9]/g,''))||0;
  function cleanText(el){return ((el&&el.textContent)||'').replace(/\s+/g,' ').trim();}
  function nearestContext(btn){return btn.closest('tr') || btn.closest('[data-document-row]') || btn.closest('[data-order-row]') || btn.closest('article') || btn.closest('section') || btn.closest('.rounded-xl') || btn.parentElement || btn;}
  function docByText(text, amount){
    if(/237/.test(text)||/9012/.test(text)) return docs[0];
    if(/233/.test(text)||/8997/.test(text)) return docs[1];
    const n=parseMoney(amount);
    if(n){ const byAmount=docs.find(d=>d.amount===n); return byAmount || {label:text||'Выбранный документ',amount:n}; }
    return docs[0];
  }
  function amountFromButton(btn){
    const label=cleanText(btn);
    const labelAmount=label.match(/\d[\d\s]*₽/);
    if(labelAmount) return parseMoney(labelAmount[0]);
    const ctx=nearestContext(btn); const text=cleanText(ctx);
    if(/237/.test(text)||/9012/.test(text)) return 45000;
    if(/233/.test(text)||/8997/.test(text)) return 12900;
    const amounts=(text.match(/\d[\d\s]*₽/g)||[]).map(parseMoney).filter(v=>v>0);
    return amounts.length ? Math.max.apply(null,amounts) : 45000;
  }
  function basisFromButton(btn){
    const text=cleanText(nearestContext(btn));
    if(/237/.test(text)||/9012/.test(text)) return docs[0].label;
    if(/233/.test(text)||/8997/.test(text)) return docs[1].label;
    const m=text.match(/(Заказ\s*№\s*\d+[^.]{0,80}?Сч[её]т\s*№\s*\d+|Сч[её]т\s*№\s*\d+|Заказ\s*№\s*\d+)/i);
    return m?m[0]:(text.slice(0,120)||'Выбранный документ');
  }
  function isPayButton(el){
    if(!el || el.closest('.lk3-pay-modal')) return false;
    const text=cleanText(el);
    return /^Оплатить(\s|$)/i.test(text) && !/Пополнить/i.test(text);
  }
  function openPaymentModal(payload={}){
    document.querySelectorAll('.lk3-pay-backdrop,.lk2-pay-backdrop,.lk-pay-modal-backdrop').forEach(el=>el.remove());
    const selected=docByText(String(payload.basis||''), payload.amount);
    const wrap=document.createElement('div'); wrap.className='lk3-pay-backdrop';
    wrap.innerHTML=`<div class="lk3-pay-modal" role="dialog" aria-modal="true">
      <div class="lk3-pay-head"><div><h2 class="lk3-pay-title">Оплата</h2><p class="lk3-pay-sub">Сумма и основание подставлены из выбранного документа. Их можно изменить.</p></div><button class="lk3-pay-close" type="button" aria-label="Закрыть">×</button></div>
      <div class="lk3-pay-body">
        <div class="lk3-pay-grid"><div class="lk3-field"><label>Основание платежа</label><select id="lk3Basis">${docs.map(d=>`<option value="${d.label}" data-amount="${d.amount}" ${d.label===selected.label?'selected':''}>${d.label} · остаток ${money(d.amount)}</option>`).join('')}</select></div><div class="lk3-field"><label>Сумма к оплате</label><input id="lk3Amount" value="${String(selected.amount)}" inputmode="numeric"></div></div>
        <div class="lk3-sources"><div class="lk3-source"><div class="lk3-source-top"><span class="lk3-source-name">Бонусы</span><span class="lk3-source-avail">Доступно ${money(bonusesAvail)}</span></div><div class="lk3-source-row"><input id="lk3UseBonus" class="lk3-switch" type="checkbox" aria-label="Списать бонусы"><input id="lk3BonusAmount" class="lk3-source-amount" value="${String(bonusesAvail)}" disabled inputmode="numeric"></div></div><div class="lk3-source"><div class="lk3-source-top"><span class="lk3-source-name">Баланс</span><span class="lk3-source-avail">Доступно ${money(balanceAvail)}</span></div><div class="lk3-source-row"><input id="lk3UseBalance" class="lk3-switch" type="checkbox" aria-label="Списать с баланса"><input id="lk3BalanceAmount" class="lk3-source-amount" value="${String(balanceAvail)}" disabled inputmode="numeric"></div></div></div>
        <div class="lk3-calc"><div><span>Документ</span><b id="lk3CalcDoc"></b></div><div><span>Бонусы</span><b id="lk3CalcBonus"></b></div><div><span>Баланс</span><b id="lk3CalcBalance"></b></div><div><span>Остаток</span><b id="lk3CalcRest"></b></div></div>
        <div class="lk3-pay-grid"><div class="lk3-field" id="lk3MethodField"><label>Чем доплатить остаток</label><select id="lk3Method"><option>Картой</option><option>СБП</option><option>Счётом для юрлица</option><option>Новой картой</option></select></div><div class="lk3-field"><label>Комментарий</label><input placeholder="Например: оплатить сегодня"></div></div>
        <div class="lk3-toast" id="lk3Toast"></div>
      </div>
      <div class="lk3-pay-actions"><button type="button" id="lk3Submit" class="lk3-primary">Оплатить</button><button type="button" id="lk3Sbp" class="lk3-sbp"><span class="lk3-sbp-logo" aria-hidden="true"></span><span id="lk3SbpText">Оплатить по СБП</span></button><button type="button" id="lk3Invoice">Скачать счёт</button><button type="button" id="lk3Close">Закрыть</button></div>
    </div>`;
    document.body.appendChild(wrap);
    const q=s=>wrap.querySelector(s);
    const basis=q('#lk3Basis'), amount=q('#lk3Amount'), useBonus=q('#lk3UseBonus'), bonus=q('#lk3BonusAmount'), useBalance=q('#lk3UseBalance'), balance=q('#lk3BalanceAmount'), method=q('#lk3Method'), methodField=q('#lk3MethodField');
    function recalc(){
      const total=parseMoney(amount.value); let b=0, bal=0;
      if(useBonus.checked) b=Math.min(parseMoney(bonus.value)||0, bonusesAvail, total);
      if(useBalance.checked) bal=Math.min(parseMoney(balance.value)||0, balanceAvail, Math.max(0,total-b));
      const rest=Math.max(0,total-b-bal);
      q('#lk3CalcDoc').textContent=money(total); q('#lk3CalcBonus').textContent='− '+money(b); q('#lk3CalcBalance').textContent='− '+money(bal); q('#lk3CalcRest').textContent=money(rest);
      q('#lk3Submit').textContent=rest>0?'Оплатить остаток '+money(rest):'Подтвердить списание';
      q('#lk3SbpText').textContent=rest>0?'Оплатить по СБП '+money(rest):'СБП не требуется';
      q('#lk3Sbp').disabled=rest<=0; q('#lk3Sbp').style.opacity=rest>0?'1':'.55'; methodField.style.display=rest>0?'':'none';
    }
    function toast(msg){const t=q('#lk3Toast'); t.textContent=msg; t.classList.add('show');}
    basis.addEventListener('change',()=>{const opt=basis.selectedOptions[0]; amount.value=String(opt.dataset.amount||''); recalc();});
    [amount,bonus,balance].forEach(el=>el.addEventListener('input',recalc));
    useBonus.addEventListener('change',()=>{bonus.disabled=!useBonus.checked;if(useBonus.checked)bonus.value=String(Math.min(bonusesAvail,parseMoney(amount.value)));recalc();});
    useBalance.addEventListener('change',()=>{balance.disabled=!useBalance.checked;if(useBalance.checked)balance.value=String(Math.min(balanceAvail,parseMoney(amount.value)));recalc();});
    q('.lk3-pay-close').onclick=()=>wrap.remove(); q('#lk3Close').onclick=()=>wrap.remove(); wrap.addEventListener('click',e=>{if(e.target===wrap)wrap.remove();});
    q('#lk3Submit').onclick=()=>{const rest=parseMoney(q('#lk3CalcRest').textContent);toast(rest>0?`К оплате ${money(rest)} способом “${method.value}”.`:'Документ полностью закрывается бонусами и балансом.');};
    q('#lk3Sbp').onclick=()=>{if(method)method.value='СБП';const rest=parseMoney(q('#lk3CalcRest').textContent);toast(rest>0?`Переход к оплате по СБП на сумму ${money(rest)}.`:'Сумма полностью закрывается бонусами и балансом.');};
    q('#lk3Invoice').onclick=()=>toast('Счёт подготовлен к скачиванию.');
    recalc();
  }
  window.lkOpenPayModal=openPaymentModal;
  window.addEventListener('click',function(e){
    const btn=e.target && e.target.closest && e.target.closest('button,a,[role="button"],[data-pay-action="true"]');
    if(!btn || !isPayButton(btn)) return;
    e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation();
    openPaymentModal({basis:basisFromButton(btn), amount:amountFromButton(btn)});
  },true);
  function patchButtons(root=document){
    root.querySelectorAll('button,a,[role="button"]').forEach(btn=>{
      if(btn.closest('.lk3-pay-modal,.lk2-pay-modal,.lk-pay-modal')) return;
      if(!isPayButton(btn)) return;
      btn.dataset.payAction='true'; btn.classList.add('lk3-pay-button');
      const text=cleanText(btn); if(!/^Оплатить\s+\d/i.test(text)) { const amount=amountFromButton(btn); if(amount) btn.textContent='Оплатить '+money(amount); }
    });
  }
  let tm=0; function schedulePatch(){clearTimeout(tm);tm=setTimeout(()=>patchButtons(document),80);} 
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedulePatch); else schedulePatch();
  document.addEventListener('click',schedulePatch,true); new MutationObserver(schedulePatch).observe(document.documentElement,{childList:true,subtree:true});
})();

