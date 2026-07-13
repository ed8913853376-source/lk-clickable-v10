
(function(){
  var remoteAccess = {
    anydesk:{ name:'AnyDesk', status:'установлен', workstation:'891 245 776', download:'https://download.anydesk.com/AnyDesk.exe' },
    rudesktop:{ name:'RuDesktop', status:'установлен', workstation:'RD-EDART-024', download:'https://storage.rudesktop.ru/download/rudesktop-2.9.1069-x64.msi' }
  };
  function copyText(value){
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(value).catch(function(){}); }
    window.dispatchEvent(new CustomEvent('lk:toast',{detail:{text:'Скопировано: '+value}}));
  }
  function remoteCard(extraClass){
    return '<div class="remote-access-status-card '+(extraClass||'')+'" data-remote-access-card="1">'
      + '<div class="remote-access-status-card__head"><span>Удаленный доступ</span><span class="remote-access-status-card__hint">Номера рабочих мест подтянуты из профиля клиента</span></div>'
      + remoteRow(remoteAccess.anydesk,'anydesk')
      + remoteRow(remoteAccess.rudesktop,'rudesktop')
      + '</div>';
  }
  function remoteRow(item,key){
    var btnClass = key==='anydesk' ? 'remote-access-status-card__btn--green' : 'remote-access-status-card__btn--blue';
    return '<div class="remote-access-status-card__row">'
      + '<div><div class="remote-access-status-card__title"><span>'+item.name+'</span><span class="remote-access-status-card__status">'+item.status+'</span></div>'
      + '<div class="remote-access-status-card__id">Рабочее место: '+item.workstation+'</div></div>'
      + '<div class="remote-access-status-card__actions">'
      + '<button type="button" class="remote-access-status-card__btn" data-copy-remote="'+key+'">📋 Номер</button>'
      + '<a class="remote-access-status-card__btn '+btnClass+'" target="_blank" rel="noopener" href="'+item.download+'">Скачать</a>'
      + '</div></div>';
  }
  function findQuickActionsCard(){
    var headers = Array.prototype.slice.call(document.querySelectorAll('h2'));
    var h = headers.find(function(x){ return (x.textContent||'').trim()==='Быстрые действия'; });
    if(!h) return null;
    var node = h;
    for(var i=0;i<6 && node;i++,node=node.parentElement){
      if((node.className||'').toString().indexOf('rounded-xl')>=0) return node;
    }
    return h.parentElement;
  }
  function enhanceQuickActions(){
    var card = findQuickActionsCard();
    if(!card || card.querySelector('[data-remote-access-card]')) return;
    card.insertAdjacentHTML('beforeend', remoteCard(''));
  }
  function enhanceRemoteModal(){
    var headers = Array.prototype.slice.call(document.querySelectorAll('h2'));
    var h = headers.find(function(x){ return (x.textContent||'').trim()==='Удаленный доступ'; });
    if(!h) return;
    var modal = h.closest('.lk-modal-shell') || h.closest('.bg-white') || h.parentElement;
    if(!modal || modal.querySelector('[data-remote-access-card]')) return;
    var body = modal.querySelector('.lk-modal-scroll') || modal.querySelector('[class*="overflow-y-auto"]');
    if(body) body.insertAdjacentHTML('afterbegin', remoteCard('remote-modal-status-card'));
  }
  function enhance(){ enhanceQuickActions(); enhanceRemoteModal(); }
  document.addEventListener('click',function(e){
    var copy = e.target.closest('[data-copy-remote]');
    if(copy){ e.preventDefault(); e.stopPropagation(); copyText(remoteAccess[copy.getAttribute('data-copy-remote')].workstation); return; }
    var btn = e.target.closest('button,a');
    if(!btn) return;
    var t = (btn.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(t.indexOf('скачать anydesk')>=0){ e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation(); window.open(remoteAccess.anydesk.download,'_blank','noopener'); }
    if(t.indexOf('скачать rudesktop')>=0 || t.indexOf('скачать рудесктоп')>=0){ e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation(); window.open(remoteAccess.rudesktop.download,'_blank','noopener'); }
  },true);
  var observer = new MutationObserver(function(){ enhance(); });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',enhance);}else{enhance();}
})();

