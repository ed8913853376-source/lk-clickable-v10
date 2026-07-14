# CHATGPT v11.8 — Remote Access Real Device Fix

## Что исправлено

1. Убраны вымышленные номера AnyDesk и RuDesktop.
2. Если реальный адрес рабочего места неизвестен, строка с адресом не показывается.
3. Кнопки в старом блоке быстрых действий работают по правилу:
   - если программа помечена как установленная через `window.lkRemoteAccess` — кнопка называется `Запустить ...` и запускает `launchUrl`;
   - если данных об установке нет — кнопка остается `Скачать ...` и открывает официальный загрузчик.
4. Адрес рабочего места показывается только если он реально передан в `window.lkRemoteAccess.<app>.workstation`.
5. Добавлен production-контракт для локального агента/расширения/backend.

## Production-контракт

```js
window.lkRemoteAccess = {
  anydesk: {
    installed: true,
    workstation: 'реальный AnyDesk ID или Alias',
    launchUrl: 'anydesk:'
  },
  rudesktop: {
    installed: true,
    workstation: 'реальный RuDesktop ID',
    launchUrl: 'edart-agent://launch/rudesktop'
  }
}
```

## Важно

Обычный браузерный сайт не может сам прочитать локальный AnyDesk ID или RuDesktop ID с компьютера пользователя. Для этого нужен локальный агент, расширение браузера или backend-интеграция с установленным корпоративным агентом.
