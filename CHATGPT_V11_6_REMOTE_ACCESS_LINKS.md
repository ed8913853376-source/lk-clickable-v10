# v11.6 Remote Access Links

Что добавлено:

1. На главной странице в блоке «Быстрые действия» добавлен компактный блок «Удаленный доступ».
2. Добавлены прямые официальные ссылки:
   - AnyDesk Windows: https://download.anydesk.com/AnyDesk.exe
   - RuDesktop Windows x64: https://storage.rudesktop.ru/download/rudesktop-2.9.1069-x64.msi
3. Если программа уже установлена, показывается номер рабочего места. В прототипе используются тестовые данные:
   - AnyDesk: 891 245 776
   - RuDesktop: RD-EDART-024
4. Добавлены кнопки копирования номера рабочего места.

Production-логика:

- Проверка установки программы и номер рабочего места должны приходить из backend/API.
- Возможный endpoint: GET /api/remote-access/workstations?counterparty_id={id}&user_id={id}
- Ответ должен возвращать status, workstation_id, app_name, version, download_url.
