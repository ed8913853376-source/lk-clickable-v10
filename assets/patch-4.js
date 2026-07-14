
(function(){
  var remoteAccess = {
    anydesk:{
      name:'AnyDesk',
      // В реальном внедрении это приходит из локального агента/расширения или backend-профиля устройства.
      workstation:(window.lkRemoteAccess&&window.lkRemoteAccess.anydesk)||localStorage.getItem('lk.remote.anydeskId')||'891 245 776',
      download:'https://download.anydesk.com/AnyDesk.exe'
    },
    rudesktop:{
      name:'RuDesktop',
      workstation:(window.lkRemoteAccess&&window.lkRemoteAccess.rudesktop)||localStorage.getItem('lk.remote.rudesktopId')||'RD-EDART-024',
      download:'https://storage.rudesktop.ru/download/rudesktop-2.9.1069-x64.msi'
    }
  };
  function toast(text){ window.dispatchEvent(new CustomEvent('lk:toast',{detail:{text:text}})); }
  function copyText(value){
    if(!value || value.indexOf('Определяется')>=0) return;
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(value).catch(function(){});} 
    toast('Скопировано: '+value);
  }
  function textOf(el){return (el&&el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();}
  function keyForButton(el){
    var t=textOf(el);
    if(t.indexOf('anydesk')>=0) return 'anydesk';
    if(t.indexOf('rudesktop')>=0 || t.indexOf('рудесктоп')>=0) return 'rudesktop';
    return null;
  }
  function isDownloadButton(el){
    if(!el || !(el.matches('button,a'))) return false;
    var t=textOf(el);
    return t.indexOf('скачать anydesk')>=0 || t.indexOf('скачать rudesktop')>=0 || t.indexOf('скачать рудесктоп')>=0;
  }
  function findQuickActionsCard(){
    var headers=Array.prototype.slice.call(document.querySelectorAll('h2'));
    var h=headers.find(function(x){return (x.textContent||'').trim()==='Быстрые действия';});
    if(!h) return null;
    var node=h;
    for(var i=0;i<7 && node;i++,node=node.parentElement){
      if((node.className||'').toString().indexOf('rounded-xl')>=0) return node;
    }
    return h.parentElement;
  }
  function preventOldExtraBlock(){
    // Ставим невидимый маркер, чтобы старый патч v11.6 больше не добавлял отдельную карточку.
    var card=findQuickActionsCard();
    if(card && !card.querySelector('[data-remote-access-card="guard"]')){
      var guard=document.createElement('span');
      guard.setAttribute('data-remote-access-card','guard');
      guard.style.display='none';
      card.appendChild(guard);
    }
    document.querySelectorAll('.remote-access-status-card').forEach(function(el){el.remove();});
  }
  function enhanceButton(btn){
    if(btn.closest('.remote-access-status-card')) return;
    if(btn.closest('[data-remote-inline-wrap]')) return;
    var key=keyForButton(btn);
    if(!key) return;
    var item=remoteAccess[key];
    var wrap=document.createElement('div');
    wrap.className='remote-access-inline-wrap';
    wrap.setAttribute('data-remote-inline-wrap',key);
    btn.parentNode.insertBefore(wrap,btn);
    wrap.appendChild(btn);
    var note=document.createElement('div');
    note.className='remote-access-inline-note';
    note.innerHTML='<span class="remote-access-inline-label">Адрес этого ПК</span><button type="button" class="remote-access-inline-id" data-copy-remote-inline="'+key+'" title="Скопировать адрес рабочего места">'+item.workstation+'</button>';
    wrap.appendChild(note);
    var helper=document.createElement('div');
    helper.className='remote-access-inline-helper';
    helper.textContent='В production подтягивается автоматически с устройства пользователя';
    wrap.appendChild(helper);
  }
  function enhance(){
    preventOldExtraBlock();
    Array.prototype.slice.call(document.querySelectorAll('button,a')).filter(isDownloadButton).forEach(enhanceButton);
  }
  document.addEventListener('click',function(e){
    var copy=e.target.closest('[data-copy-remote-inline]');
    if(copy){e.preventDefault();e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation(); copyText(remoteAccess[copy.getAttribute('data-copy-remote-inline')].workstation); return;}
    var dl=e.target.closest('button,a');
    if(isDownloadButton(dl)){
      var key=keyForButton(dl);
      if(key){e.preventDefault();e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation(); window.open(remoteAccess[key].download,'_blank','noopener');}
    }
  },true);
  var mo=new MutationObserver(function(){enhance();});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',enhance); else enhance();
})();

