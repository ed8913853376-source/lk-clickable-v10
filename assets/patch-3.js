
(function(){
  /*
    Нельзя подставлять демонстрационные адреса AnyDesk/RuDesktop.
    В production объект должен заполняться только реальными данными от локального агента/расширения/backend:

    window.lkRemoteAccess = {
      anydesk:   { installed: true, workstation: '123456789', launchUrl: 'anydesk:' },
      rudesktop: { installed: true, workstation: 'RD-...',   launchUrl: 'edart-agent://launch/rudesktop' }
    }

    Если данных нет — адрес не показывается, кнопка остается скачиванием.
  */
  var configured = window.lkRemoteAccess || {};
  var remoteAccess = {
    anydesk:{
      key:'anydesk',
      name:'AnyDesk',
      installed: !!(configured.anydesk && configured.anydesk.installed),
      workstation: configured.anydesk && configured.anydesk.workstation ? String(configured.anydesk.workstation).trim() : '',
      launchUrl: configured.anydesk && configured.anydesk.launchUrl ? String(configured.anydesk.launchUrl) : 'anydesk:',
      download:'https://download.anydesk.com/AnyDesk.exe'
    },
    rudesktop:{
      key:'rudesktop',
      name:'RuDesktop',
      installed: !!(configured.rudesktop && configured.rudesktop.installed),
      workstation: configured.rudesktop && configured.rudesktop.workstation ? String(configured.rudesktop.workstation).trim() : '',
      launchUrl: configured.rudesktop && configured.rudesktop.launchUrl ? String(configured.rudesktop.launchUrl) : '',
      download:'https://storage.rudesktop.ru/download/rudesktop-2.9.1069-x64.msi'
    }
  };
  function toast(text){ window.dispatchEvent(new CustomEvent('lk:toast',{detail:{text:text}})); }
  function textOf(el){return (el&&el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();}
  function keyForButton(el){
    var t=textOf(el);
    if(t.indexOf('anydesk')>=0) return 'anydesk';
    if(t.indexOf('rudesktop')>=0 || t.indexOf('рудесктоп')>=0) return 'rudesktop';
    return null;
  }
  function isRemoteButton(el){
    if(!el || !(el.matches('button,a'))) return false;
    var t=textOf(el);
    return t.indexOf('anydesk')>=0 || t.indexOf('rudesktop')>=0 || t.indexOf('рудесктоп')>=0;
  }
  function copyText(value){
    if(!value) return;
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(value).catch(function(){});}
    toast('Скопировано: '+value);
  }
  function setButtonLabel(btn,item){
    var label = item.installed ? ('Запустить '+item.name) : ('Скачать '+item.name);
    if(btn.tagName.toLowerCase()==='a'){
      btn.removeAttribute('href');
      btn.setAttribute('role','button');
    }
    if(btn.textContent.indexOf(item.name) >= 0 || textOf(btn).indexOf('рудесктоп') >= 0){
      btn.textContent = label;
    }
    btn.setAttribute('data-remote-action', item.installed ? 'launch' : 'download');
  }
  function enhanceButton(btn){
    if(btn.closest('[data-remote-inline-wrap]')) return;
    var key=keyForButton(btn);
    if(!key) return;
    var item=remoteAccess[key];
    setButtonLabel(btn,item);
    var wrap=document.createElement('div');
    wrap.className='remote-access-inline-wrap';
    wrap.setAttribute('data-remote-inline-wrap',key);
    btn.parentNode.insertBefore(wrap,btn);
    wrap.appendChild(btn);
    if(item.workstation){
      var note=document.createElement('div');
      note.className='remote-access-inline-note';
      note.innerHTML='<span class="remote-access-inline-label">Адрес этого ПК</span><button type="button" class="remote-access-inline-id" data-copy-remote-inline="'+key+'" title="Скопировать адрес рабочего места">'+item.workstation+'</button>';
      wrap.appendChild(note);
      var source=document.createElement('div');
      source.className='remote-access-inline-source';
      source.textContent='Адрес получен с устройства пользователя';
      wrap.appendChild(source);
    }
  }
  function enhance(){
    Array.prototype.slice.call(document.querySelectorAll('button,a')).filter(isRemoteButton).forEach(enhanceButton);
  }
  function launchOrDownload(item){
    if(item.installed){
      if(item.launchUrl){
        window.location.href = item.launchUrl;
        toast('Пробуем запустить '+item.name);
      }else{
        toast('Для запуска '+item.name+' нужен локальный агент или зарегистрированный protocol handler');
      }
      return;
    }
    window.open(item.download,'_blank','noopener');
  }
  document.addEventListener('click',function(e){
    var copy=e.target.closest('[data-copy-remote-inline]');
    if(copy){
      e.preventDefault();e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      copyText(remoteAccess[copy.getAttribute('data-copy-remote-inline')].workstation); return;
    }
    var btn=e.target.closest('button,a');
    if(isRemoteButton(btn)){
      var key=keyForButton(btn);
      if(key){
        e.preventDefault();e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation();
        launchOrDownload(remoteAccess[key]);
      }
    }
  },true);
  var mo=new MutationObserver(function(){enhance();});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',enhance); else enhance();
})();

