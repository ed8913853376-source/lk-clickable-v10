# BUILD_NOTES v10

## Что проверено
- `src/app/App.tsx` успешно разобран Babel parser с плагинами `typescript` и `jsx`: синтаксис TSX корректен.
- Зависимости package.json сокращены до реально используемых: React, ReactDOM, lucide-react, Vite, React plugin, Tailwind plugin.
- `pnpm install --offline --ignore-scripts` прошел успешно после сокращения зависимостей.

## Ограничение сборки Vite
`pnpm run build` не завершился из-за отсутствующего native optional-пакета Rollup для Windows:
`@rollup/rollup-win32-x64-msvc`.
Это проблема локальных зависимостей/optional binaries, а не синтаксиса App.tsx. Offline-хранилище содержит часть пакетов, но не содержит Windows-native Rollup/esbuild binary.

## Что сделать на машине с интернетом
1. Удалить `node_modules`.
2. Запустить `pnpm install`.
3. Запустить `pnpm run build`.

## Прототип
Реальные API, 1С, Битрикс и платежные шлюзы не подключены.
