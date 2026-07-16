# LK v12.2 — Remote access no address handoff

Основа: рабочая логика v11.8 / восстановленная база после неудачного Figma merge.

Изменение v12.2:
- В интерфейсе больше не показываются AnyDesk/RuDesktop ID или адреса рабочих мест.
- Нет копирования номера/адреса.
- Нет демонстрационных или вымышленных номеров.
- Старые кнопки AnyDesk/RuDesktop остаются в существующем блоке быстрых действий.
- Если внешний агент/backend передает installed=true, кнопка показывает «Запустить ...» и открывает launchUrl.
- Если installed=true не передан, кнопка показывает «Скачать ...» и открывает установщик.

Пример production-конфигурации:

```js
window.lkRemoteAccess = {
  anydesk:   { installed: true, launchUrl: 'anydesk:' },
  rudesktop: { installed: true, launchUrl: 'edart-agent://launch/rudesktop' }
}
```

Важно: обычный браузер сам не умеет надежно проверять установлен ли AnyDesk/RuDesktop. Для этого нужен локальный агент, расширение, нативное приложение или backend-данные.
