
(function(){
  /*
    Не показываем AnyDesk/RuDesktop ID в личном кабинете.
    Сайт в браузере сам не определяет установленную программу.
    В production локальный агент/расширение/backend может передать только факт установки и ссылку запуска:

    window.lkRemoteAccess = {
      anydesk:   { installed: true, launchUrl: 'anydesk:' },
      rudesktop: { installed: true, launchUrl: 'edart-agent://launch/rudesktop' }
    }

    Если installed не передан — кнопка остается скачиванием.
  */
  var configured = window.lkRemoteAccess || {};
  var remoteAccess = {
    anydesk:{
      key:'anydesk',
      name:'AnyDesk',
      installed: !!(configured.anydesk && configured.anydesk.installed),
      launchUrl: configured.anydesk && configured.anydesk.launchUrl ? String(configured.anydesk.launchUrl) : 'anydesk:',
      download:'https://download.anydesk.com/AnyDesk.exe'
    },
    rudesktop:{
      key:'rudesktop',
      name:'RuDesktop',
      installed: !!(configured.rudesktop && configured.rudesktop.installed),
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
  function setButtonLabel(btn,item){
    var label = item.installed ? ('Запустить '+item.name) : ('Скачать '+item.name);
    if(btn.tagName.toLowerCase()==='a'){
      btn.removeAttribute('href');
      btn.setAttribute('role','button');
    }
    btn.textContent = label;
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
  }
  function enhance(){
    Array.prototype.slice.call(document.querySelectorAll('button,a')).filter(isRemoteButton).forEach(enhanceButton);
    document.querySelectorAll('.remote-access-inline-note,.remote-access-inline-source,.remote-access-status-card').forEach(function(el){ el.remove(); });
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

