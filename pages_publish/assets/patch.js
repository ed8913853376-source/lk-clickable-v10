
(function(){
  const money = v => new Intl.NumberFormat('ru-RU').format(Math.max(0, Math.round(Number(v)||0))) + ' ₽';
  const parseMoney = v => Number(String(v||'').replace(/[^0-9]/g,'')) || 0;
  const docs = [
    {label:'Заказ №9012 / Счёт №237', amount:45000, doc:'Счёт №237 от 09.05.2026'},
    {label:'Заказ №8997 / Счёт №233', amount:12900, doc:'Счёт №233 от 01.05.2026'},
    {label:'Пополнение баланса', amount:10000, doc:'Без документа'},
    {label:'Оплата аренды ресурсов', amount:23791, doc:'Аренда ресурсов'}
  ];
  const bonusesAvail = 4800;
  const balanceAvail = 23791;
  function normalizeAmount(raw){ return parseMoney(raw) || 0; }
  function findDocFromText(text, amount){
    if(/237/.test(text)) return docs[0];
    if(/233/.test(text)) return docs[1];
    const byAmount = docs.find(d => d.amount === normalizeAmount(amount));
    return byAmount || {label:text || 'Документ', amount:normalizeAmount(amount), doc:text || 'Документ'};
  }
  function openPayModal(payload){
    document.querySelectorAll('.lk-pay-modal-backdrop').forEach(el=>el.remove());
    const selected = findDocFromText(payload.basis, payload.amount);
    const wrap = document.createElement('div');
    wrap.className = 'lk-pay-modal-backdrop';
    wrap.innerHTML = `
      <div class="lk-pay-modal" role="dialog" aria-modal="true">
        <div class="lk-pay-modal-head">
          <div><h2 class="lk-pay-modal-title">Оплата</h2><p class="lk-pay-modal-sub">Сумма и основание подставлены из выбранного документа. Их можно изменить.</p></div>
          <button class="lk-pay-modal-close" type="button" aria-label="Закрыть">×</button>
        </div>
        <div class="lk-pay-modal-body">
          <div class="lk-pay-grid">
            <div class="lk-pay-field"><label>Основание платежа</label><select id="lkPayBasis">${docs.map(d=>`<option value="${d.label}" data-amount="${d.amount}" ${d.label===selected.label?'selected':''}>${d.label} · остаток ${money(d.amount)}</option>`).join('')}</select></div>
            <div class="lk-pay-field"><label>Сумма к оплате</label><input id="lkPayAmount" value="${money(selected.amount).replace(' ₽','')}" inputmode="numeric"></div>
          </div>
          <div class="lk-pay-sources">
            <div class="lk-pay-source">
              <div class="lk-pay-source-top"><span class="lk-pay-source-name">Бонусы</span><span class="lk-pay-source-avail">Доступно ${money(bonusesAvail)}</span></div>
              <div class="lk-pay-source-row"><input id="lkUseBonus" class="lk-pay-switch" type="checkbox"><input id="lkBonusAmount" class="lk-pay-source-input" value="${money(bonusesAvail).replace(' ₽','')}" disabled inputmode="numeric"></div>
            </div>
            <div class="lk-pay-source">
              <div class="lk-pay-source-top"><span class="lk-pay-source-name">Баланс</span><span class="lk-pay-source-avail">Доступно ${money(balanceAvail)}</span></div>
              <div class="lk-pay-source-row"><input id="lkUseBalance" class="lk-pay-switch" type="checkbox"><input id="lkBalanceAmount" class="lk-pay-source-input" value="${money(balanceAvail).replace(' ₽','')}" disabled inputmode="numeric"></div>
            </div>
          </div>
          <div class="lk-pay-calc">
            <div><span>Документ</span><b id="lkCalcDoc">${money(selected.amount)}</b></div>
            <div><span>Бонусы</span><b id="lkCalcBonus">− 0 ₽</b></div>
            <div><span>Баланс</span><b id="lkCalcBalance">− 0 ₽</b></div>
            <div><span>Остаток</span><b id="lkCalcRest">${money(selected.amount)}</b></div>
          </div>
          <div class="lk-pay-grid">
            <div class="lk-pay-field"><label>Чем доплатить остаток</label><select id="lkPayMethod"><option>Картой</option><option>СБП</option><option>Счётом для юрлица</option><option>Новой картой</option></select></div>
            <div class="lk-pay-field"><label>Комментарий</label><input placeholder="Например: оплатить сегодня"></div>
          </div>
          <div class="lk-pay-toast" id="lkPayToast"></div>
        </div>
        <div class="lk-pay-actions">
          <button type="button" id="lkPaySubmit" class="primary">Оплатить</button>
          <button type="button" id="lkDownloadInvoice">Скачать счёт</button>
          <button type="button" id="lkDownloadDoc">Скачать документ</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    const $ = id => wrap.querySelector(id);
    const basis = $('#lkPayBasis'), amount = $('#lkPayAmount'), useBonus = $('#lkUseBonus'), bonusAmount = $('#lkBonusAmount'), useBalance = $('#lkUseBalance'), balanceAmount = $('#lkBalanceAmount'), method = $('#lkPayMethod');
    function recalc(){
      const total = parseMoney(amount.value);
      let b = useBonus.checked ? Math.min(parseMoney(bonusAmount.value)||bonusesAvail, bonusesAvail, total) : 0;
      let bal = useBalance.checked ? Math.min(parseMoney(balanceAmount.value)||balanceAvail, balanceAvail, Math.max(0,total-b)) : 0;
      const rest = Math.max(0,total-b-bal);
      $('#lkCalcDoc').textContent = money(total);
      $('#lkCalcBonus').textContent = '− ' + money(b);
      $('#lkCalcBalance').textContent = '− ' + money(bal);
      $('#lkCalcRest').textContent = money(rest);
      $('#lkPaySubmit').textContent = rest > 0 ? `Оплатить остаток ${money(rest)}` : 'Подтвердить списание';
      method.closest('.lk-pay-field').style.display = rest > 0 ? '' : 'none';
    }
    basis.addEventListener('change', () => { const opt = basis.selectedOptions[0]; amount.value = money(opt.dataset.amount).replace(' ₽',''); recalc(); });
    [amount, bonusAmount, balanceAmount].forEach(inp=>inp.addEventListener('input', recalc));
    useBonus.addEventListener('change', () => { bonusAmount.disabled = !useBonus.checked; if(useBonus.checked) bonusAmount.value = String(Math.min(bonusesAvail,parseMoney(amount.value))); recalc(); });
    useBalance.addEventListener('change', () => { balanceAmount.disabled = !useBalance.checked; if(useBalance.checked) balanceAmount.value = String(Math.min(balanceAvail,parseMoney(amount.value))); recalc(); });
    wrap.querySelector('.lk-pay-modal-close').onclick = () => wrap.remove();
    wrap.addEventListener('click', e => { if(e.target === wrap) wrap.remove(); });
    $('#lkPaySubmit').onclick = () => { const rest = parseMoney($('#lkCalcRest').textContent); const msg = rest ? `К оплате ${money(rest)} способом “${method.value}”.` : 'Документ полностью закрывается бонусами и балансом.'; const toast=$('#lkPayToast'); toast.textContent=msg; toast.classList.add('show'); };
    $('#lkDownloadInvoice').onclick = () => { const toast=$('#lkPayToast'); toast.textContent='Счёт подготовлен к скачиванию.'; toast.classList.add('show'); };
    $('#lkDownloadDoc').onclick = () => { const toast=$('#lkPayToast'); toast.textContent='Документ подготовлен к скачиванию.'; toast.classList.add('show'); };
    recalc();
  }
  document.addEventListener('click', function(e){
    const btn = e.target.closest('button');
    if(!btn || btn.closest('.lk-pay-modal')) return;
    const text = (btn.textContent||'').trim();
    if(text === 'Оплатить' || text.startsWith('Оплатить остаток')){
      const row = btn.closest('tr');
      if(row){
        const cells = Array.from(row.querySelectorAll('td')).map(td => (td.textContent||'').replace(/\s+/g,' ').trim());
        const amount = (cells.find(c=>/\d[\d\s]*₽/.test(c)) || '0 ₽').match(/\d[\d\s]*₽/);
        const basis = cells.slice(0,3).filter(Boolean).join(' / ');
        e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        openPayModal({basis, amount: amount ? amount[0] : '0 ₽'});
      }
    }
  }, true);
  document.addEventListener('click', function(e){
    const card = e.target.closest('.mobile-dashboard-metrics > *');
    if(!card || e.target.closest('button')) return;
    const text = (card.textContent||'').replace(/\s+/g,' ');
    const map = [
      [/Открытые обращения/i,'Обращения'],[/Остаток часов/i,'Договоры и SLA'],[/Неоплаченные счета/i,'Счета и оплаты'],[/Ресурсы в аренде/i,'Аренда ресурсов'],[/Активные базы|Базы 1С/i,'Базы 1С'],[/Клиентские лицензии|Лицензии/i,'Лицензии 1С'],[/Заказы товаров|Заказы/i,'Заказы и отгрузки']
    ];
    const found = map.find(([re])=>re.test(text));
    if(!found) return;
    const navLabel = found[1];
    const buttons = Array.from(document.querySelectorAll('aside button'));
    const navBtn = buttons.find(b => (b.textContent||'').replace(/\s+/g,' ').includes(navLabel));
    if(navBtn){ e.preventDefault(); navBtn.click(); }
  }, true);
})();


