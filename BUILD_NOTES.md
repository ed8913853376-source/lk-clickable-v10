# BUILD NOTES

## Как запустить

```bash
npm install
npm run dev
```

## Как собрать

```bash
npm run build
```

## Проверено в v10.1

- `npm install` выполнен успешно.
- `npm run build` выполнен успешно.
- Сборка создана в папке `dist/`.

## Что было исправлено для сборки

- Удалён BOM из `package.json`, из-за которого Vite ошибочно пытался читать package.json как PostCSS config.
- Убран импорт `tw-animate-css` из `src/styles/tailwind.css`, потому что зависимости не было в `package.json`.
