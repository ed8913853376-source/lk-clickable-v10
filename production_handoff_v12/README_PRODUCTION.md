# LK v12 Figma UI Merge Handoff

Этот пакет предназначен для передачи разработчику как визуальный handoff.

## Состав

- `preview/lk_client_portal_preview.html` — кликабельный HTML-preview v12.
- `docs/CHATGPT_V12_FIGMA_UI_MERGE.md` — что было перенесено из Figma.
- `docs/FIGMA_VISUAL_TOKENS_EXTRACT.css` — извлеченные визуальные токены из Figma export.
- `docs/README_CHECK.md` — сценарии проверки.

## Важно

Это не финальный production frontend. Логика сохранена в HTML-preview. Для production нужно перенести дизайн-систему v12 в React/Vite source и подключить реальные API: 1C, платежи, документы, пользователи, удаленный доступ.
