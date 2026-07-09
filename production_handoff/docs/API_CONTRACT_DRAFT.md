# Черновик API-контракта для промышленного внедрения

## Контрагенты
- `GET /api/counterparties`
- `POST /api/counterparties/find-by-inn`
- `POST /api/counterparties`
- `PATCH /api/counterparties/{id}`

## Пользователи
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/{id}`
- `POST /api/users/{id}/reset-password`

## Обращения
- `GET /api/tickets`
- `POST /api/tickets`
- `GET /api/tickets/{id}`
- `POST /api/tickets/{id}/messages`
- `POST /api/tickets/{id}/attachments`

## Счета и оплаты
- `GET /api/billing/summary`
- `GET /api/invoices`
- `POST /api/payments/card`
- `POST /api/payments/sbp`
- `POST /api/payments/balance`
- `POST /api/payments/bonus`
- `GET /api/invoices/{id}/download`

## Документы
- `GET /api/documents`
- `GET /api/documents/{id}/download`
- `POST /api/documents/reconciliation-act`
- `POST /api/documents/send-email`

## Заказы и отгрузки
- `GET /api/orders`
- `GET /api/orders/{id}`
- `POST /api/orders/{id}/cancel`
- `POST /api/orders/{id}/repeat`
- `GET /api/shipments/{id}/tracking`

## Базы 1С
- `GET /api/1c/bases`
- `POST /api/1c/bases`
- `PATCH /api/1c/bases/{id}/access`
- `GET /api/1c/bases/{id}/thin-client`

## Лицензии
- `GET /api/1c/licenses`
- `POST /api/1c/licenses/change-request`

## Серверы / RDP
- `GET /api/resources`
- `POST /api/resources/change-request`
- `GET /api/resources/{id}/rdp-file`
