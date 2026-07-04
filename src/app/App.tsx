import { useEffect, useRef, useState } from "react";
import {
  Home, Building2, MessageSquare, Briefcase, FileText, CreditCard,
  FileCheck, FileSpreadsheet, Server, Database, Key, Monitor,
  ShoppingCart, Truck, Bell, Gift, Users, BookOpen, Settings,
  Plus, X, Search, AlertCircle, CheckCircle2, Clock, Minus, ArrowUpRight,
  Download, Shield, HardDrive, Cpu, Activity, UserPlus, ChevronRight,
  RefreshCw, Copy, Star, BarChart2, Package, Globe, Zap,
  Menu, Eye, EyeOff, Paperclip,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | "dashboard" | "counterparties" | "tickets" | "deals" | "contracts"
  | "billing" | "documents" | "offers" | "servers" | "bases1c" | "licenses"
  | "sessions" | "orders" | "shipments" | "purchaseHistory" | "notifications" | "bonuses"
  | "referral" | "services" | "users" | "knowledge" | "settings";

type Modal = "ticket" | "payment" | "discussion" | "generic" | null;
type BV = "green" | "amber" | "red" | "blue" | "gray" | "purple";

// ─── Utility components ───────────────────────────────────────────────────────
function Badge({ v = "green", dot, children, sm }: { v?: BV; dot?: boolean; children: React.ReactNode; sm?: boolean }) {
  const map: Record<BV, string> = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-slate-100 text-slate-600 border-slate-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold whitespace-nowrap ${sm ? "px-1.5 py-0 text-[10px]" : "px-2 py-0.5 text-xs"} ${map[v]}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
      {children}
    </span>
  );
}


function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join(" ").replace(/\s+/g, " ").trim();
  if (node && typeof node === "object" && "props" in node) return getNodeText((node as any).props?.children);
  return "Действие";
}

function Btn({ v = "default", sz = "md", children, onClick, full, cls = "" }: {
  v?: "default" | "primary" | "green" | "blue" | "danger" | "ghost";
  sz?: "sm" | "md"; children: React.ReactNode; onClick?: React.MouseEventHandler<HTMLButtonElement>; full?: boolean; cls?: string;
}) {
  const base = "inline-flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-all cursor-pointer border select-none shrink-0";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  const vars = {
    default: "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
    primary: "bg-slate-900 border-slate-900 text-white hover:bg-slate-800",
    green: "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700",
    blue: "bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
    danger: "bg-white border-red-200 text-red-600 hover:bg-red-50",
    ghost: "bg-transparent border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700",
  };
  const label = getNodeText(children) || "Действие";
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = onClick ?? (() => {
    window.dispatchEvent(new CustomEvent("lk:prototype-action", { detail: { title: label } }));
  });
  return (
    <button type="button" className={`${base} ${sizes[sz]} ${vars[v]} ${full ? "w-full" : ""} ${cls}`} onClick={handleClick}>
      {children}
    </button>
  );
}

function Card({ children, cls = "" }: { children: React.ReactNode; cls?: string }) {
  return <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${cls}`}>{children}</div>;
}

function Metric({ label, value, extra }: { label: string; value: string | number; extra?: React.ReactNode }) {
  return (
    <Card cls="p-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{label}</p>
      <p className="text-3xl font-extrabold text-slate-900 leading-none mb-2">{value}</p>
      {extra}
    </Card>
  );
}

function Table({ heads, rows, compact }: {
  heads: string[];
  rows: (React.ReactNode)[][];
  compact?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[500px]">
        <thead>
          <tr className="border-b border-slate-100">
            {heads.map((h, i) => (
              <th key={i} className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2 pr-4 first:pl-0 pl-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group">
              {row.map((cell, j) => (
                <td key={j} className={`pr-4 first:pl-0 pl-2 text-slate-700 ${compact ? "py-2" : "py-3"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Mono({ children, cls = "" }: { children: React.ReactNode; cls?: string }) {
  return <span className={`font-mono text-xs text-slate-600 ${cls}`}>{children}</span>;
}

function Progress({ v, max = 100, color = "green" }: { v: number; max?: number; color?: "green" | "blue" | "amber" | "red" }) {
  const pct = Math.min(100, Math.round((v / max) * 100));
  const c = { green: "from-emerald-500 to-emerald-400", blue: "from-blue-500 to-blue-400", amber: "from-amber-500 to-amber-400", red: "from-red-500 to-red-400" };
  return (
    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r ${c[color]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function TEvent({ date, text, last }: { date: string; text: string; last?: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-100 mt-0.5" />
        {!last && <div className="w-px flex-1 bg-slate-200 mt-1 mb-1" />}
      </div>
      <div className={`${last ? "pb-0" : "pb-4"}`}>
        <p className="text-sm font-semibold text-slate-800">{date}</p>
        <p className="text-sm text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function DocRow({ title, sub, action }: { title: string; sub?: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
      <div className="shrink-0 flex items-center gap-2">{action}</div>
    </div>
  );
}

function ChatMsg({ from, text, me }: { from: string; text: string; me?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 max-w-[82%] ${me ? "self-end items-end" : "items-start"}`}>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{from}</p>
      <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${me ? "bg-blue-50 text-blue-900 rounded-tr-sm" : "bg-slate-100 text-slate-800 rounded-tl-sm"}`}>{text}</div>
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 leading-relaxed">
      {children}
    </div>
  );
}


function CopyButton({ value, label = "Скопировать" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };
  return (
    <button type="button" onClick={copy}
      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer">
      <Copy size={12} /> {copied ? "Скопировано" : label}
    </button>
  );
}

function AccessValue({ label, value, secret = false }: { label: string; value: string; secret?: boolean }) {
  const [visible, setVisible] = useState(!secret);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <Mono cls="text-sm font-bold text-slate-900 flex-1 truncate">{visible ? value : "••••••••••"}</Mono>
        {secret && (
          <button type="button" onClick={() => setVisible(v => !v)}
            className="w-8 h-8 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
            aria-label={visible ? "Скрыть" : "Показать"}>
            {visible ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
        <CopyButton value={value} label="" />
      </div>
    </div>
  );
}

function SH({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function StatBar({ label, v, max, note }: { label: string; v: number; max: number; note?: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="text-slate-400">{v} / {max} {note}</span>
      </div>
      <Progress v={v} max={max} color={v / max > 0.8 ? "red" : "green"} />
    </div>
  );
}

function InfoGrid({ items, compact = false }: { items: { label: string; value: React.ReactNode }[]; compact?: boolean }) {
  return (
    <div className={compact ? "grid grid-cols-2 gap-x-4 gap-y-2" : "grid grid-cols-2 gap-x-6 gap-y-2"}>
      {items.map((item, i) => (
        <div key={i} className="min-w-0">
          <p className={compact ? "text-[9px] font-bold uppercase tracking-wider text-slate-400" : "text-[10px] font-bold uppercase tracking-wider text-slate-400"}>{item.label}</p>
          <p className={compact ? "text-[11px] leading-snug font-semibold text-slate-700 mt-0.5 break-words" : "text-sm font-semibold text-slate-800 mt-0.5"}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function Overlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-3xl my-4 sm:my-8 relative">{children}</div>
    </div>
  );
}

function TicketModal({ onClose }: { onClose: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <Card cls="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Создать обращение</h2>
            <p className="text-xs text-slate-500 mt-0.5">Источник данных — 1С</p>
          </div>
          <Btn v="ghost" sz="sm" onClick={onClose}><X size={16} /></Btn>
        </div>
        <Hint>AI проверит статьи базы знаний и предложит категорию — заявку создаст только после вашего подтверждения.</Hint>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Тип обращения</span>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option>Проблема с 1С</option>
              <option>Сервер / доступ / backup</option>
              <option>Касса / оборудование</option>
              <option>Запрос консультации</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Приоритет</span>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option>Обычный</option>
              <option>Срочный</option>
              <option>Критичный простой</option>
            </select>
          </label>
        </div>
        <label className="block mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Тема</span>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Например: не открывается база 1С" />
        </label>
        <label className="block mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Описание</span>
          <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Опишите проблему: что делали, какая ошибка, кого затронуло..." />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Связанная база / сервер</span>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option>1С Бухгалтерия · SRV-247090</option>
              <option>1С УНФ · SRV-247090</option>
              <option>1С ЗУП · SRV-247090</option>
              <option>Не знаю</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Файл / скриншот</span>
            <input type="file" className="w-full text-sm text-slate-500 file:mr-3 file:py-1 file:px-3 file:border file:border-slate-200 file:rounded-lg file:text-xs file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-50" />
          </label>
        </div>
        <div className="flex gap-2 mt-6 justify-end border-t border-slate-100 pt-4">
          <Btn v="default" onClick={onClose}>Отмена</Btn>
          <Btn v="green" onClick={onClose}><Plus size={14} /> Создать обращение</Btn>
        </div>
      </Card>
    </Overlay>
  );
}

function PaymentModal({ onClose }: { onClose: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <Card cls="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">Оплата</h2>
          <Btn v="ghost" sz="sm" onClick={onClose}><X size={16} /></Btn>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Контрагент</span>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option>ED ART · ИНН 0000000000</option>
              <option>Плазма-Сервис · ИНН 7700123456</option>
              <option>Retail Group · ИНН 5400987654</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Тип операции</span>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option>Пополнить баланс</option>
              <option>Оплатить счет №237</option>
              <option>Сформировать счет на оплату</option>
              <option>Оплатить аренду ресурсов</option>
            </select>
          </label>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Сумма, ₽</span>
            <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" defaultValue="10 000" />
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Способ оплаты</span>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option>Visa •••• 4589 (основная)</option>
              <option>Mastercard •••• 1124</option>
              <option>Корпоративная •••• 9031</option>
              <option>Счет для юрлица</option>
            </select>
          </label>
        </div>
        <label className="block mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Комментарий</span>
          <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Назначение платежа..." />
        </label>
        <div className="flex gap-2 mt-6 justify-end border-t border-slate-100 pt-4">
          <Btn v="default" onClick={onClose}>Отмена</Btn>
          <Btn v="green" onClick={onClose}>Подтвердить оплату</Btn>
        </div>
      </Card>
    </Overlay>
  );
}

function DiscussionModal({ resource, onClose }: { resource: string; onClose: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <Card cls="p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Новое обращение</h2>
            <p className="text-sm text-slate-500 mt-0.5">По объекту: <span className="font-semibold text-slate-700">{resource}</span></p>
          </div>
          <Btn v="ghost" sz="sm" onClick={onClose}><X size={16} /></Btn>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Контрагент</span>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option>ED ART · ИНН 0000000000</option>
              <option>Плазма-Сервис · ИНН 7700123456</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Связанный объект</span>
            <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-600" defaultValue={resource} readOnly />
          </label>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Тип</span>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option>Проблема с базой 1С</option>
              <option>Проблема с сервером / доступом</option>
              <option>Вопрос по backup</option>
              <option>Консультация инженера</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Приоритет</span>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option>Обычный</option>
              <option>Срочный</option>
              <option>Критичный простой</option>
            </select>
          </label>
        </div>
        <label className="block mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Тема</span>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" defaultValue={`Проблема по объекту: ${resource}`} />
        </label>
        <label className="block mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Описание</span>
          <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Опишите проблему подробно: что произошло, когда, кого затронуло..." />
        </label>
        <div className="flex gap-2 mt-6 justify-end border-t border-slate-100 pt-4">
          <Btn v="default" onClick={onClose}>Сохранить черновик</Btn>
          <Btn v="green" onClick={onClose}>Создать обращение</Btn>
        </div>
      </Card>
    </Overlay>
  );
}


function TicketRequestModal({ onClose }: { onClose: () => void }) {
  const defaultPhone = "+7 (999) 111-22-33";
  const [sent, setSent] = useState(false);
  const [phones, setPhones] = useState([defaultPhone]);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const updatePhone = (index: number, value: string) => {
    setPhones(prev => prev.map((phone, i) => i === index ? value : phone));
  };
  const addPhone = () => setPhones(prev => [...prev, ""]);
  const removePhone = (index: number) => setPhones(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev);

  return (
    <Overlay onClose={onClose}>
      <Card cls="max-w-3xl w-full max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Создать обращение</h2>
            <p className="text-sm text-slate-500 mt-1">Телефон подставляется из профиля текущего пользователя. При необходимости можно добавить несколько номеров.</p>
          </div>
          <Btn v="ghost" sz="sm" onClick={onClose}><X size={16} /></Btn>
        </div>

        <div className="px-5 sm:px-6 py-5 overflow-y-auto lk-modal-scroll">
          {sent ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
              <div className="flex items-center gap-2 font-bold"><CheckCircle2 size={18} />Заявка создана</div>
              <p className="text-sm mt-2">Это прототипное состояние. В рабочей версии обращение будет создано в 1С/CRM и попадет ответственному инженеру.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Контрагент"><select className={inputCls}>{cps.map(cp => <option key={cp}>{cp}</option>)}</select></Field>
              <Field label="Тема"><input className={inputCls} placeholder="Например: не открывается база 1С" /></Field>
              <div className="md:col-span-2 flex flex-wrap gap-2">
                <Badge v="gray">Категорию определит поддержка</Badge>
                <Badge v="gray">Приоритет назначит инженер</Badge>
                <Badge v="blue">Связанный объект: не выбран</Badge>
              </div>
              <div className="md:col-span-2">
                <TextareaWithAttach rowsCls="h-28" placeholder="Опишите проблему: что произошло, когда, кого затронуло..." />
              </div>

              <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Телефоны для связи</p>
                    <p className="text-xs text-slate-500 mt-0.5">Первый номер подставлен из профиля авторизованного пользователя.</p>
                  </div>
                  <Btn v="default" sz="sm" onClick={addPhone}><Plus size={13} /> Добавить номер</Btn>
                </div>
                <div className="space-y-2">
                  {phones.map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <input className={inputCls} value={phone} onChange={(e) => updatePhone(index, e.target.value)} placeholder="+7 (___) ___-__-__" />
                      {phones.length > 1 && <Btn v="ghost" sz="sm" onClick={() => removePhone(index)}><X size={14} /></Btn>}
                    </div>
                  ))}
                </div>
              </div>

              <Field label="Удобный способ связи"><select className={inputCls}><option>Телефон</option><option>Email</option><option>Telegram</option><option>Через кабинет</option></select></Field>
              <Field label="Сколько пользователей затронуто"><input className={inputCls} placeholder="Например: 3" /></Field>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-end border-t border-slate-100 p-4 sm:px-6 bg-white shrink-0">
          {sent ? <Btn v="default" onClick={onClose}>Закрыть</Btn> : <><Btn v="default" onClick={onClose}>Отмена</Btn><Btn v="green" onClick={() => setSent(true)}><Plus size={14} /> Создать обращение</Btn></>}
        </div>
      </Card>
    </Overlay>
  );
}



function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "col-span-2" : ""}`}>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function TextareaWithAttach({ placeholder = "", rowsCls = "h-24" }: { placeholder?: string; rowsCls?: string }) {
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Описание / комментарий</span>
        <button type="button" onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <Paperclip size={14} /> Прикрепить файл
        </button>
      </div>
      <textarea className={`${textAreaCls} ${rowsCls}`} placeholder={placeholder} />
      <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
      {fileName && <p className="mt-2 text-xs text-slate-500">Прикреплен файл: <span className="font-semibold text-slate-700">{fileName}</span></p>}
    </div>
  );
}

const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200";
const textAreaCls = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200";

type ActionKey =
  | "counterparty" | "user" | "ticket" | "base1c" | "thinClient" | "licenses" | "server" | "rdp"
  | "service" | "product" | "offer" | "order" | "cardPayment" | "invoice" | "attachCard"
  | "promisedPayment" | "documents" | "project" | "remoteAccess" | "bonus" | "certificate" | "unknown";

type FormField = { label: string; type?: "input" | "select" | "textarea" | "file" | "checks"; options?: string[]; placeholder?: string; full?: boolean; readonly?: string };
type FormSpec = { title: string; subtitle: string; fields?: FormField[]; details?: { label: string; value: string }[]; buttons: string[]; result: string; note?: string };

const cps = ["ED ART · ИНН 0000000000", "Плазма-Сервис · ИНН 7700123456", "Retail Group · ИНН 5400987654"];
const basesList = ["1С Бухгалтерия", "1С УНФ", "1С ЗУП"];
const sectionAccess = ["Финансы", "Документы", "Обращения", "Заказы", "Базы 1С", "Серверы", "Лицензии"];

const FORM_SPECS: Record<ActionKey, FormSpec> = {
  counterparty: { title: "Добавить контрагента", subtitle: "Реквизиты организации и контактные данные. Без полей базы 1С, сервера, лицензий или товара.", result: "Контрагент отправлен на проверку реквизитов", buttons: ["Сохранить контрагента", "Отмена"], fields: [
    { label: "Тип контрагента", type: "select", options: ["Юридическое лицо", "ИП", "Физическое лицо"] },
    { label: "Краткое название", placeholder: "ED ART" },
    { label: "Полное юридическое наименование", placeholder: "ООО Ромашка", full: true },
    { label: "ИНН" },
    { label: "КПП" },
    { label: "ОГРН / ОГРНИП" },
    { label: "Налоговая система", type: "select", options: ["ОСНО", "УСН доходы", "УСН доходы-расходы", "Патент", "Не знаю"] },
    { label: "Юридический адрес", full: true },
    { label: "Фактический адрес", full: true },
    { label: "Почтовый адрес", full: true },
    { label: "Банк" },
    { label: "БИК" },
    { label: "Расчётный счёт" },
    { label: "Корр. счёт" },
    { label: "Контактное лицо" },
    { label: "Должность контактного лица" },
    { label: "Телефон" },
    { label: "Email для документов" },
    { label: "Email для уведомлений" },
    { label: "Комментарий", type: "textarea", full: true }
  ]},
  user: { title: "Пользователь", subtitle: "Пользователь, логин, пароль, роль и доступы к разделам кабинета и базам 1С.", result: "Изменения отправлены на согласование", buttons: ["Сохранить пользователя", "Отправить приглашение", "Отмена"], fields: [
    { label: "ФИО" }, { label: "Email" }, { label: "Телефон" }, { label: "Должность" }, { label: "Логин" }, { label: "Пароль" }, { label: "Повтор пароля" }, { label: "Контрагент", type: "select", options: cps }, { label: "Роль", type: "select", options: ["Руководитель", "Бухгалтер", "Сотрудник", "Технический специалист", "Администратор"] }, { label: "Доступ к разделам", type: "checks", options: sectionAccess, full: true }, { label: "Доступ к базам 1С", type: "checks", options: basesList, full: true }, { label: "Комментарий", type: "textarea", full: true }
  ]},
  ticket: { title: "Новое обращение", subtitle: "Клиент описывает проблему. Категорию и приоритет определяет поддержка.", result: "Заявка создана", buttons: ["Создать обращение", "Отмена"], details: [
    { label: "Категория", value: "Определит поддержка после анализа обращения" },
    { label: "Приоритет", value: "Назначит инженер или менеджер по SLA" },
    { label: "Связанный объект", value: "Не выбран по умолчанию" }
  ], fields: [
    { label: "Контрагент", type: "select", options: cps }, { label: "Тема" }, { label: "Описание / комментарий", type: "textarea", full: true }, { label: "Сколько пользователей затронуто" }, { label: "Удобный способ связи", type: "select", options: ["Телефон", "Email", "Telegram", "Через кабинет"] }, { label: "Телефоны для связи", placeholder: "+7 (999) 111-22-33" }
  ]},
  base1c: { title: "База 1С", subtitle: "Только параметры базы: конфигурация, создание, доступы, публикация. CPU/RAM/SSD/IP относятся к серверу.", result: "Запрос отправлен", buttons: ["Создать базу", "Сохранить настройки", "Отмена"], fields: [
    { label: "Контрагент", type: "select", options: cps }, { label: "Название базы" }, { label: "Конфигурация", type: "select", options: ["Бухгалтерия", "ЗУП", "УНФ", "УТ", "ERP", "Другая"] }, { label: "Способ создания", type: "select", options: ["Новая пустая база", "Загрузить .dt", "Восстановить из backup", "Скопировать существующую базу"] }, { label: "Пользователи с доступом", type: "checks", options: ["Бухгалтерия", "Склад", "Менеджер", "Техспециалист"], full: true }, { label: "Нужна публикация", type: "select", options: ["Да", "Нет", "Нужно обсудить"] }, { label: "Нужно автообновление", type: "select", options: ["Да", "Нет", "Только уведомлять"] }, { label: "Комментарий", type: "textarea", full: true }
  ]},
  thinClient: { title: "Тонкий клиент 1С", subtitle: "Информация для подключения к опубликованным базам 1С.", result: "Запрос отправлен", buttons: ["Скачать тонкий клиент 1С", "Скачать инструкцию", "Создать обращение", "Закрыть"], details: [
    { label: "Конфигурация", value: "Бухгалтерия / УНФ / ЗУП" }, { label: "Версия платформы", value: "8.3.25" }, { label: "Инструкция подключения", value: "Скачайте тонкий клиент и выберите нужную базу из списка." }, { label: "Список баз", value: "1С Бухгалтерия, 1С УНФ, 1С ЗУП" }
  ]},
  licenses: { title: "Изменение лицензий 1С", subtitle: "Нельзя уменьшить количество ниже текущего числа используемых лицензий.", result: "Изменения отправлены на согласование", buttons: ["Запросить изменение", "Получить счет", "Отмена"], fields: [
    { label: "Контрагент", type: "select", options: cps }, { label: "Текущий пакет лицензий", readonly: "10 клиентских лицензий" }, { label: "Используется сейчас", readonly: "7 лицензий" }, { label: "Свободно лицензий", readonly: "3 лицензии" }, { label: "Новое количество лицензий" }, { label: "Текущая стоимость", readonly: "15 000 ₽ / мес" }, { label: "Новая стоимость", readonly: "22 500 ₽ / мес" }, { label: "Разница", readonly: "+7 500 ₽ / мес" }, { label: "Комментарий", type: "textarea", full: true }
  ]},
  server: { title: "Сервер / ресурс", subtitle: "Форма для RDP, VPS, серверов 1С и арендованных ресурсов.", result: "Запрос отправлен", buttons: ["Отправить запрос", "Создать обращение", "Отмена"], fields: [
    { label: "Контрагент", type: "select", options: cps }, { label: "Тип ресурса", type: "select", options: ["RDP", "VPS", "Сервер 1С", "Файловый ресурс", "Другое"] }, { label: "Название ресурса" }, { label: "Текущий тариф", readonly: "4 CPU / 16 GB RAM / 250 GB SSD" }, { label: "Нужно изменить", type: "select", options: ["Заказать сервер", "Изменить тариф", "Добавить RAM", "Добавить SSD", "Запросить доступ", "Продлить аренду"] }, { label: "Комментарий", type: "textarea", full: true }
  ]},
  rdp: { title: "RDP-клиент с настройками", subtitle: "Прототип выдачи настроенного файла подключения.", result: "Запрос отправлен", buttons: ["Скачать RDP-файл", "Скачать инструкцию", "Создать обращение"], details: [
    { label: "Сервер", value: "VPS для 1С #SRV-247090" }, { label: "Пользователь", value: "ivan@example.ru" }, { label: "Инструкция подключения", value: "Скачайте RDP-файл и войдите с выданными учетными данными." }
  ]},
  service: { title: "Заказ услуги", subtitle: "Заявка на услугу, консультацию или аудит без товарных полей.", result: "Заявка создана", buttons: ["Отправить заявку", "Получить консультацию", "Отмена"], fields: [
    { label: "Контрагент", type: "select", options: cps }, { label: "Категория услуги", type: "select", options: ["Сопровождение 1С", "Доработка 1С", "Интеграция 1С", "Автоматизация бизнеса", "Обслуживание касс", "Серверы и аренда", "Консультация", "Другое"] }, { label: "Описание задачи", type: "textarea", full: true }, { label: "Желаемый срок" }, { label: "Контактное лицо" }, { label: "Телефон" }, { label: "Email" }, { label: "Файл/ТЗ", type: "file" }, { label: "Комментарий", type: "textarea", full: true }
  ]},
  product: { title: "Заказ товара", subtitle: "Физические товары: кассы, сканеры, принтеры, расходники, комплектующие и оборудование.", result: "Заказ сформирован", buttons: ["Сформировать заказ", "Добавить в КП", "Отмена"], fields: [
    { label: "Контрагент", type: "select", options: cps }, { label: "Категория товара", type: "select", options: ["Онлайн-кассы", "Сканеры штрихкода", "Принтеры этикеток", "МФУ/принтеры", "Расходные материалы", "Комплектующие", "Серверное оборудование", "Рабочие места"] }, { label: "Товар" }, { label: "Количество" }, { label: "Нужна доставка", type: "select", options: ["Да", "Нет", "Самовывоз"] }, { label: "Адрес доставки" }, { label: "Нужен монтаж/настройка", type: "select", options: ["Да", "Нет", "Нужно обсудить"] }, { label: "Нужны закрывающие документы", type: "select", options: ["Да", "Нет"] }, { label: "Комментарий", type: "textarea", full: true }
  ]},
  offer: { title: "Коммерческое предложение", subtitle: "Запрос, согласование или отклонение КП.", result: "Запрос отправлен", buttons: ["Запросить КП", "Согласовать", "Отклонить", "Отмена"], fields: [
    { label: "Контрагент", type: "select", options: cps }, { label: "Тип КП", type: "select", options: ["Услуги", "Товары", "Смешанное КП"] }, { label: "Что нужно включить", type: "textarea", full: true }, { label: "Желаемый срок" }, { label: "Файл/спецификация", type: "file" }, { label: "Комментарий", type: "textarea", full: true }
  ]},
  order: { title: "Заказ", subtitle: "Карточка заказа, оплаты, доставки и документов.", result: "Запрос отправлен", buttons: ["Оплатить", "Скачать счет", "Скачать УПД", "Отследить доставку", "Повторить заказ", "Создать обращение", "Закрыть"], fields: [
    { label: "Номер заказа", readonly: "#9012" }, { label: "Контрагент", type: "select", options: cps }, { label: "Состав заказа", readonly: "Кассовый принтер · 1 шт." }, { label: "Статус", type: "select", options: ["Новый", "Ожидает оплаты", "В сборке", "Готов к отгрузке", "В пути", "Доставлен", "Закрыт"] }, { label: "Сумма", readonly: "28 900 ₽" }, { label: "Счет", readonly: "№8997" }, { label: "Оплата", type: "select", options: ["Ожидает оплаты", "Оплачено", "Частично оплачено"] }, { label: "Адрес доставки", full: true }, { label: "Транспортная компания" }, { label: "Трек-номер" }, { label: "Документы", readonly: "Счет, УПД" }, { label: "Комментарий", type: "textarea", full: true }
  ]},
  cardPayment: { title: "Оплатить", subtitle: "Выберите способ оплаты. Можно скачать счет или документ перед оплатой.", result: "Запрос отправлен", buttons: ["Перейти к оплате", "Скачать счет", "Скачать документ", "Отмена"], details: [
    { label: "Сумма к оплате", value: "6 800 ₽" }, { label: "Основание", value: "Заказ / счет выбранного документа" }
  ], fields: [{ label: "Контрагент", type: "select", options: cps }, { label: "Сумма", placeholder: "6 800 ₽" }, { label: "Способ оплаты", type: "select", options: ["Картой", "Счет для юрлица", "С баланса", "Бонусами частично"] }, { label: "Назначение платежа", type: "select", options: ["Пополнение баланса", "Оплата заказа", "Оплата услуг", "Оплата лицензий", "Оплата аренды"] }, { label: "Комментарий", type: "textarea", full: true }]},
  invoice: { title: "Счет на оплату", subtitle: "Формирование счета для юрлица в прототипном режиме.", result: "Запрос отправлен", buttons: ["Сформировать счет", "Отмена"], fields: [{ label: "Контрагент", type: "select", options: cps }, { label: "Основание", type: "select", options: ["Пополнение баланса", "Оплата заказа", "Оплата услуг", "Оплата лицензий", "Оплата аренды"] }, { label: "Сумма" }, { label: "Email для отправки счета" }, { label: "Комментарий", type: "textarea", full: true }]},
  attachCard: { title: "Привязать карту", subtitle: "Прототип привязки карты без сохранения платежных данных.", result: "Запрос отправлен", buttons: ["Привязать карту", "Отмена"], fields: [{ label: "Контрагент", type: "select", options: cps }, { label: "Название карты" }, { label: "Email для чеков" }, { label: "Согласие на автосписание", type: "select", options: ["Да", "Нет"] }]},
  promisedPayment: { title: "Обещанный платеж", subtitle: "Запрос отсрочки платежа для менеджера.", result: "Запрос отправлен", buttons: ["Отправить запрос", "Отмена"], fields: [{ label: "Контрагент", type: "select", options: cps }, { label: "Сумма" }, { label: "Причина", type: "textarea", full: true }, { label: "Дата планируемой оплаты" }]},
  documents: { title: "Документы", subtitle: "Скачивание и отправка документов по выбранному контрагенту и периоду.", result: "Запрос отправлен", buttons: ["Скачать", "Отправить на email", "Запросить акт сверки", "Закрыть"], fields: [{ label: "Контрагент", type: "select", options: cps }, { label: "Тип документа", type: "select", options: ["Акт", "Счет", "УПД", "Акт сверки"] }, { label: "Период" }, { label: "Email для отправки" }, { label: "Комментарий", type: "textarea", full: true }]},
  project: { title: "Проект", subtitle: "Карточка проекта или сделки с действиями по этапам.", result: "Изменения отправлены на согласование", buttons: ["Запросить статус", "Добавить комментарий", "Принять этап", "Создать обращение", "Закрыть"], fields: [{ label: "Название проекта" }, { label: "Контрагент", type: "select", options: cps }, { label: "Этап", type: "select", options: ["Обследование", "Проектирование", "Реализация", "Тестирование", "Сдано"] }, { label: "Ответственный менеджер", readonly: "Алексей" }, { label: "Ответственный инженер", readonly: "Иван" }, { label: "Сроки" }, { label: "Описание задачи", type: "textarea", full: true }, { label: "Последний комментарий", type: "textarea", full: true }, { label: "Файл/документ", type: "file" }]},
  remoteAccess: { title: "Удаленный доступ", subtitle: "Для подключения специалиста скачайте программу удаленного доступа.", result: "Запрос отправлен", buttons: ["Скачать AnyDesk", "Скачать RuDesktop", "Инструкция по подключению", "Создать обращение"], details: [{ label: "Важно", value: "Передайте код подключения инженеру только после создания обращения или согласования сеанса." }]},
  bonus: { title: "Списать бонусы", subtitle: "Бонусы списываются на счет, заказ или услугу. Сертификаты и промокоды вводятся отдельной строкой.", result: "Запрос отправлен", buttons: ["Списать бонусы", "Отмена"], fields: [{ label: "Контрагент", type: "select", options: cps }, { label: "Куда списать", type: "select", options: ["Счёт №237", "Заказ товара", "Абонентское обслуживание", "Аудит 1С"] }, { label: "Сумма списания" }, { label: "Комментарий", type: "textarea", full: true }]},
  certificate: { title: "Добавить сертификат или промокод", subtitle: "Здесь нужна только одна строка для ввода кода. Без выбора базы 1С, товара или услуги.", result: "Код отправлен на проверку", buttons: ["Применить код", "Отмена"], details: [{ label: "Подарочный сертификат", value: "Введите код сертификата или промокод — система применит скидку, бонус или акцию после проверки." }], fields: [{ label: "Код сертификата / промокод", placeholder: "Например: BONUS-2026" }]},
  unknown: { title: "Действие требует уточнения", subtitle: "Для этой кнопки не задана бизнес-форма. Вопрос вынесен в TODO_QUESTIONS.md.", result: "Запрос отправлен", buttons: ["Закрыть"], fields: [{ label: "Действие", readonly: "Не сопоставлено" }, { label: "Комментарий", type: "textarea", full: true }]}
};

function actionFromTitle(title: string): ActionKey {
  const t = title.toLowerCase();
  if (t.includes("anydesk") || t.includes("rudesktop") || t.includes("удаленн")) return "remoteAccess";
  if (t.includes("rdp")) return "rdp";
  if (t.includes("тонк")) return "thinClient";
  if (t.includes("контрагент") || t.includes("организац") || t.includes("реквизит")) return "counterparty";
  if (t.includes("пользовател") || t.includes("роль") || t.includes("пароль")) return "user";
  if (t.includes("обращ") || t.includes("поддерж") || t.includes("инцидент") || t.includes("проблем")) return "ticket";
  if (t.includes("лиценз")) return "licenses";
  if (t.includes("сервер") || t.includes("ресурс") || t.includes("ram") || t.includes("ssd") || t.includes("тариф")) return "server";
  if (t.includes("баз") || t.includes(".dt") || t.includes("backup") || t.includes("публикац")) return "base1c";
  if (t.includes("услуг") || t.includes("консультац") || t.includes("аудит") || t.includes("доработ")) return "service";
  if (t.includes("оплат")) return "cardPayment";
  if (t.includes("товар") || t.includes("налич")) return "product";
  if (t.includes("кп") || t.includes("коммерчес")) return "offer";
  if (t.includes("заказ") || t.includes("отгруз") || t.includes("достав") || t.includes("трек") || t.includes("упд")) return "order";
  if (t.includes("карт")) return "cardPayment";
  if (t.includes("счёт") || t.includes("счет")) return "invoice";
  if (t.includes("обещан")) return "promisedPayment";
  if (t.includes("документ") || t.includes("акт")) return "documents";
  if (t.includes("проект") || t.includes("сделк") || t.includes("этап") || t.includes("статус")) return "project";
  if (t.includes("сертификат") || t.includes("промокод") || t.includes("промвода") || t.includes("промкод") || t.includes("применить код") || t.includes("код сертификата")) return "certificate";
  if (t.includes("бонус")) return "bonus";
  return "unknown";
}

function renderFormField(field: FormField, index: number) {
  if (field.readonly) return <Field key={index} label={field.label} full={field.full}><input className={`${inputCls} bg-slate-50 text-slate-600`} value={field.readonly} readOnly /></Field>;
  if (field.type === "select") return <Field key={index} label={field.label} full={field.full}><select className={inputCls}>{field.options?.map(o => <option key={o}>{o}</option>)}</select></Field>;
  if (field.type === "textarea") {
    const isDescription = field.label.toLowerCase().includes("опис") || field.label.toLowerCase().includes("комментар");
    return <div key={index} className={field.full ? "md:col-span-2" : ""}>{isDescription ? <TextareaWithAttach placeholder={field.placeholder} /> : <Field label={field.label} full={field.full}><textarea className={textAreaCls} placeholder={field.placeholder} /></Field>}</div>;
  }
  if (field.type === "file") return <Field key={index} label={field.label} full={field.full}><input type="file" className="w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:border file:border-slate-200 file:rounded-lg file:text-xs file:font-semibold file:bg-white file:text-slate-700" /></Field>;
  if (field.type === "checks") return <Field key={index} label={field.label} full={field.full}><div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 p-3">{field.options?.map(o => <label key={o} className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" className="rounded border-slate-300" />{o}</label>)}</div></Field>;
  return <Field key={index} label={field.label} full={field.full}><input className={inputCls} placeholder={field.placeholder} /></Field>;
}


function CounterpartyInnWizard({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<"legal" | "person">("legal");
  const [inn, setInn] = useState("0000000000");
  const [filled, setFilled] = useState(false);
  const [sent, setSent] = useState(false);
  const [personName, setPersonName] = useState("Иванов Иван Иванович");
  const [personPhone, setPersonPhone] = useState("+7 (999) 000-00-00");
  const [personEmails, setPersonEmails] = useState(["ivanov@example.ru"]);
  const [personAddresses, setPersonAddresses] = useState(["г. Москва, ул. Деловая, д. 1, кв. 15"]);
  const demo = inn.trim() === "7700123456" ? {
    short: "Плазма-Сервис",
    full: "ООО \"Плазма-Сервис\"",
    kpp: "770001001",
    ogrn: "1237700001234",
    address: "г. Москва, ул. Примерная, д. 10, офис 25",
    fact: "г. Москва, ул. Примерная, д. 10, офис 25",
    bank: "АО \"Тест Банк\"",
    bik: "044525000",
    rs: "40702810000000000001",
    ks: "30101810000000000000",
    person: "Петров Петр Петрович",
    phone: "+7 (495) 000-00-00",
    email: "docs@plazma-service.ru",
  } : {
    short: "ED ART",
    full: "ООО \"ЭД АРТ\"",
    kpp: "000001001",
    ogrn: "1020000000000",
    address: "г. Москва, ул. Деловая, д. 1, офис 15",
    fact: "г. Москва, ул. Деловая, д. 1, офис 15",
    bank: "ПАО \"Демо Банк\"",
    bik: "044525225",
    rs: "40702810900000000000",
    ks: "30101810400000000225",
    person: "Иванов Иван Иванович",
    phone: "+7 (999) 000-00-00",
    email: "docs@ed-art.ru",
  };

  const resetFlow = (nextType: "legal" | "person") => {
    setType(nextType);
    setSent(false);
    if (nextType === "person") {
      setFilled(true);
      setPersonName("Иванов Иван Иванович");
      setPersonPhone("+7 (999) 000-00-00");
      setPersonEmails(["ivanov@example.ru"]);
      setPersonAddresses(["г. Москва, ул. Деловая, д. 1, кв. 15"]);
    } else {
      setFilled(false);
    }
  };

  const updateEmail = (index: number, value: string) => {
    setPersonEmails(prev => prev.map((item, i) => i === index ? value : item));
  };
  const updateAddress = (index: number, value: string) => {
    setPersonAddresses(prev => prev.map((item, i) => i === index ? value : item));
  };

  return (
    <Overlay onClose={onClose}>
      <Card cls="max-w-3xl w-full max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Добавить контрагента</h2>
            <p className="text-sm text-slate-500 mt-1">Выберите тип контрагента. Для юрлица реквизиты заполняются по ИНН, для физлица прототип заполняет ФИО и телефон, а почт и адресов можно добавить несколько.</p>
          </div>
          <Btn v="ghost" sz="sm" onClick={onClose}><X size={16} /></Btn>
        </div>
        <div className="px-5 sm:px-6 py-5 overflow-y-auto lk-modal-scroll">
          {sent ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
              <div className="flex items-center gap-2 font-bold"><CheckCircle2 size={18} />Контрагент отправлен на проверку</div>
              <p className="text-sm mt-2">Это прототипное состояние. Реальное сохранение и проверка данных будут выполняться через 1С/CRM.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button type="button" onClick={() => resetFlow("legal")} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${type === "legal" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>
                  Юридическое лицо / ИП
                </button>
                <button type="button" onClick={() => resetFlow("person")} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${type === "person" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>
                  Физическое лицо
                </button>
              </div>

              {type === "legal" ? (
                <>
                  <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                    <p className="font-bold text-slate-900 mb-1">Быстрое добавление по ИНН</p>
                    <p className="text-sm text-slate-600">Клиент вводит только ИНН, система заполняет название, КПП, ОГРН, адрес и банковские реквизиты. После этого данные можно дополнить и отредактировать.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
                    <Field label="ИНН">
                      <input className={inputCls} value={inn} onChange={(e) => setInn(e.target.value.replace(/[^0-9]/g, "").slice(0, 12))} placeholder="Введите ИНН организации или ИП" />
                    </Field>
                    <Btn v="green" onClick={() => setFilled(true)}>Найти / заполнить</Btn>
                  </div>

                  {filled && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <div className="flex items-center gap-2 font-bold text-emerald-800"><CheckCircle2 size={18} />Найдена организация</div>
                        <p className="text-sm text-emerald-700 mt-1">Проверьте автозаполненные реквизиты. Любое поле можно изменить перед сохранением.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Тип контрагента"><select className={inputCls} defaultValue="Юридическое лицо"><option>Юридическое лицо</option><option>ИП</option></select></Field>
                        <Field label="Краткое название"><input className={inputCls} defaultValue={demo.short} /></Field>
                        <Field label="Полное юридическое наименование" full><input className={inputCls} defaultValue={demo.full} /></Field>
                        <Field label="ИНН"><input className={inputCls} value={inn} onChange={(e) => setInn(e.target.value.replace(/[^0-9]/g, "").slice(0, 12))} /></Field>
                        <Field label="КПП"><input className={inputCls} defaultValue={demo.kpp} /></Field>
                        <Field label="ОГРН / ОГРНИП"><input className={inputCls} defaultValue={demo.ogrn} /></Field>
                        <Field label="Налоговая система"><select className={inputCls} defaultValue="ОСНО"><option>ОСНО</option><option>УСН доходы</option><option>УСН доходы-расходы</option><option>Патент</option><option>Не знаю</option></select></Field>
                        <Field label="Юридический адрес" full><input className={inputCls} defaultValue={demo.address} /></Field>
                        <Field label="Фактический адрес" full><input className={inputCls} defaultValue={demo.fact} /></Field>
                        <Field label="Банк"><input className={inputCls} defaultValue={demo.bank} /></Field>
                        <Field label="БИК"><input className={inputCls} defaultValue={demo.bik} /></Field>
                        <Field label="Расчётный счёт"><input className={inputCls} defaultValue={demo.rs} /></Field>
                        <Field label="Корр. счёт"><input className={inputCls} defaultValue={demo.ks} /></Field>
                        <Field label="Контактное лицо"><input className={inputCls} defaultValue={demo.person} /></Field>
                        <Field label="Телефон"><input className={inputCls} defaultValue={demo.phone} /></Field>
                        <Field label="Email для документов"><input className={inputCls} defaultValue={demo.email} /></Field>
                        <Field label="Email для уведомлений"><input className={inputCls} defaultValue={demo.email} /></Field>
                        <Field label="Комментарий" full><textarea className={textAreaCls} placeholder="Можно указать особенности документооборота, договора, ЭДО или ответственного сотрудника" /></Field>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-2 font-bold text-emerald-800"><CheckCircle2 size={18} />Данные физического лица заполнены</div>
                    <p className="text-sm text-emerald-700 mt-1">ФИО и телефон заполнены автоматически для прототипа. Email и адресов может быть несколько — добавьте нужные строки и отредактируйте данные перед сохранением.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="ФИО" full><input className={inputCls} value={personName} onChange={(e) => setPersonName(e.target.value)} /></Field>
                    <Field label="Телефон"><input className={inputCls} value={personPhone} onChange={(e) => setPersonPhone(e.target.value)} /></Field>
                    <Field label="Комментарий"><input className={inputCls} placeholder="Например: клиент без организации" /></Field>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-slate-900">Почта</p>
                      <Btn v="default" sz="sm" onClick={() => setPersonEmails(prev => [...prev, ""])}><Plus size={14} /> Добавить почту</Btn>
                    </div>
                    <div className="space-y-2">
                      {personEmails.map((email, index) => (
                        <div key={index} className="grid grid-cols-[1fr_auto] gap-2">
                          <input className={inputCls} value={email} onChange={(e) => updateEmail(index, e.target.value)} placeholder="email@example.ru" />
                          <Btn v="ghost" sz="sm" onClick={() => setPersonEmails(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev)}><X size={14} /></Btn>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-slate-900">Адреса</p>
                      <Btn v="default" sz="sm" onClick={() => setPersonAddresses(prev => [...prev, ""])}><Plus size={14} /> Добавить адрес</Btn>
                    </div>
                    <div className="space-y-2">
                      {personAddresses.map((address, index) => (
                        <div key={index} className="grid grid-cols-[1fr_auto] gap-2">
                          <input className={inputCls} value={address} onChange={(e) => updateAddress(index, e.target.value)} placeholder="Адрес" />
                          <Btn v="ghost" sz="sm" onClick={() => setPersonAddresses(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev)}><X size={14} /></Btn>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                    <p className="font-bold text-slate-900 mb-2">Что будет сохранено</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
                      <p><span className="text-slate-400">Тип:</span> Физическое лицо</p>
                      <p><span className="text-slate-400">ФИО:</span> {personName}</p>
                      <p><span className="text-slate-400">Телефон:</span> {personPhone}</p>
                      <p><span className="text-slate-400">Почта:</span> {personEmails.filter(Boolean).join(", ") || "не указана"}</p>
                      <p className="md:col-span-2"><span className="text-slate-400">Адреса:</span> {personAddresses.filter(Boolean).join("; ") || "не указаны"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-end border-t border-slate-100 p-4 sm:px-6 bg-white shrink-0">
          {sent ? <Btn v="default" onClick={onClose}>Закрыть</Btn> : (
            <>
              {(filled || type === "person") && <Btn v="green" onClick={() => setSent(true)}>Сохранить контрагента</Btn>}
              {type === "legal" && filled && <Btn v="primary" onClick={() => setFilled(true)}>Редактировать данные</Btn>}
              <Btn v="default" onClick={onClose}>Отмена</Btn>
            </>
          )}
        </div>
      </Card>
    </Overlay>
  );
}


function LicenseChangeModal({ onClose }: { onClose: () => void }) {
  const used = 7;
  const [qty, setQty] = useState(10);
  const [sent, setSent] = useState(false);
  const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";
  const price = qty * 1500;
  const delta = qty - 10;
  return (
    <Overlay onClose={onClose}>
      <Card cls="max-w-2xl w-full max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0">
          <div><h2 className="text-xl font-bold text-slate-900">Изменить количество лицензий 1С</h2><p className="text-sm text-slate-500 mt-1">Количество нельзя уменьшить ниже используемых лицензий.</p></div>
          <Btn v="ghost" sz="sm" onClick={onClose}><X size={16} /></Btn>
        </div>
        <div className="px-5 sm:px-6 py-5 overflow-y-auto lk-modal-scroll">
          {sent ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800"><div className="flex items-center gap-2 font-bold"><CheckCircle2 size={18} />Изменения отправлены на согласование</div></div> : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-200 p-3"><p className="text-xs text-slate-400 font-bold uppercase">Текущий пакет</p><p className="text-xl font-extrabold">10</p></div>
                <div className="rounded-lg border border-slate-200 p-3"><p className="text-xs text-slate-400 font-bold uppercase">Используется</p><p className="text-xl font-extrabold">{used}</p></div>
                <div className="rounded-lg border border-slate-200 p-3"><p className="text-xs text-slate-400 font-bold uppercase">Свободно</p><p className="text-xl font-extrabold">{Math.max(0, qty - used)}</p></div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Новое количество лицензий</p>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setQty(q => Math.max(used, q - 1))} className="w-11 h-11 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center"><Minus size={17} /></button>
                  <input className={`${inputCls} text-center text-xl font-extrabold`} value={qty} onChange={(e) => setQty(Math.max(used, Number(e.target.value.replace(/\D/g, "")) || used))} />
                  <button type="button" onClick={() => setQty(q => q + 1)} className="w-11 h-11 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center"><Plus size={17} /></button>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">{[7,10,15,20].map(n => <Btn key={n} v={qty===n ? "primary" : "default"} sz="sm" onClick={() => setQty(Math.max(used, n))}>{n}</Btn>)}</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
                <div className="flex justify-between"><span>Текущая стоимость</span><b>{fmt(15000)} / мес</b></div>
                <div className="flex justify-between"><span>Новая стоимость</span><b>{fmt(price)} / мес</b></div>
                <div className="flex justify-between"><span>Разница</span><b>{delta === 0 ? "без изменений" : `${delta > 0 ? "+" : ""}${fmt(delta * 1500)} / мес`}</b></div>
              </div>
              <TextareaWithAttach placeholder="Комментарий к изменению лицензий..." />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-end border-t border-slate-100 p-4 sm:px-6 bg-white shrink-0">
          {sent ? <Btn v="default" onClick={onClose}>Закрыть</Btn> : <><Btn v="default" onClick={onClose}>Отмена</Btn><Btn v="primary" onClick={() => setSent(true)}>Получить счет</Btn><Btn v="green" onClick={() => setSent(true)}>Запросить изменение</Btn></>}
        </div>
      </Card>
    </Overlay>
  );
}

function GenericActionModal({ title, onClose }: { title: string; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const key = actionFromTitle(title);
  if (key === "counterparty") return <CounterpartyInnWizard onClose={onClose} />;
  if (key === "ticket") return <TicketRequestModal onClose={onClose} />;
  if (key === "licenses") return <LicenseChangeModal onClose={onClose} />;
  const spec = key === "unknown" ? { ...FORM_SPECS.unknown, title, fields: [{ label: "Действие", readonly: title }, { label: "Комментарий", type: "textarea" as const, full: true }] } : FORM_SPECS[key];
  return (
    <Overlay onClose={onClose}>
      <Card cls="max-w-3xl w-full max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{spec.title}</h2>
            <p className="text-sm text-slate-500 mt-1">{spec.subtitle}</p>
          </div>
          <Btn v="ghost" sz="sm" onClick={onClose}><X size={16} /></Btn>
        </div>
        <div className="px-5 sm:px-6 py-5 overflow-y-auto lk-modal-scroll">
          {sent ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
              <div className="flex items-center gap-2 font-bold"><CheckCircle2 size={18} />{spec.result}</div>
              <p className="text-sm mt-2">Это прототипное состояние. Реальные API, 1С, Битрикс и платежи не подключены.</p>
            </div>
          ) : (
            <>
              {spec.details && <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">{spec.details.map(d => <div key={d.label} className="rounded-lg border border-blue-100 bg-blue-50/60 p-3"><p className="text-xs font-bold uppercase tracking-wider text-blue-500">{d.label}</p><p className="text-sm text-slate-800 mt-1">{d.value}</p></div>)}</div>}
              {spec.fields && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{spec.fields.map(renderFormField)}</div>}
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-end border-t border-slate-100 p-4 sm:px-6 bg-white shrink-0">
          {sent ? <Btn v="default" onClick={onClose}>Закрыть</Btn> : spec.buttons.map((button, i) => {
            const isCancel = button === "Отмена" || button === "Закрыть";
            return <Btn key={button} v={isCancel ? "default" : i === 0 ? "green" : "primary"} onClick={isCancel ? onClose : () => setSent(true)}>{button}</Btn>;
          })}
        </div>
      </Card>
    </Overlay>
  );
}
// ─── Screens ──────────────────────────────────────────────────────────────────

function DashboardScreen({ nav, openModal, openDiscussion }: {
  nav: (s: Screen) => void;
  openModal: (title: string) => void;
  openDiscussion: (r: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="mobile-dashboard-metrics grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Открытые обращения" value="4" extra={<Badge v="amber">1 срочное</Badge>} />
        <Metric label="Остаток часов" value="12 ч" extra={
          <div>
            <Progress v={12} max={20} color="blue" />
            <p className="text-xs text-slate-400 mt-1">12 из 20 ч / месяц</p>
          </div>
        } />
        <Metric label="Неоплаченные счета" value="2" extra={<Badge v="red">1 просрочен</Badge>} />
        <Metric label="Ресурсы в аренде" value="4" extra={<Badge v="amber">1 продлить</Badge>} />
      </div>


      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <Card cls="xl:col-span-3 p-5">
          <SH title="Сводка обслуживания" />
          <div className="mobile-dashboard-metrics grid grid-cols-3 gap-3 mb-5">
            {[
              { title: "Договор № 45/1С", sub: "Абонентское обслуживание 1С", badge: <Badge v="green" dot>активен</Badge> },
              { title: "SLA: 2 часа", sub: "Время реакции по критичным обращениям", badge: <Badge v="blue">контроль</Badge> },
              { title: "Тариф: Бизнес", sub: "20 ч/мес + серверное сопровождение", badge: <Badge v="gray">до 01.07.2026</Badge> },
            ].map((c, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-sm font-bold text-slate-800 mb-1">{c.title}</p>
                <p className="text-xs text-slate-500 mb-2">{c.sub}</p>
                {c.badge}
              </div>
            ))}
          </div>
          <h3 className="text-sm font-bold text-slate-700 mb-3">Последние обращения</h3>
          <Table heads={["№", "Тема", "Статус", "SLA", ""]} rows={[
            ["#1042", "Ошибка обмена 1С с сайтом", <Badge v="amber">в работе</Badge>, "01:20 осталось", <Btn v="ghost" sz="sm" onClick={() => nav("tickets")}>Открыть</Btn>],
            ["#1041", "Не открывается база бухгалтерии", <Badge v="red">критично</Badge>, "Нарушен", <Btn v="ghost" sz="sm" onClick={() => nav("tickets")}>Открыть</Btn>],
            ["#1038", "Добавить пользователя в базу", <Badge v="blue">ожидает клиента</Badge>, "В срок", <Btn v="ghost" sz="sm" onClick={() => nav("tickets")}>Открыть</Btn>],
          ]} />
        </Card>

        <div className="xl:col-span-2 bg-slate-900 rounded-xl p-5 text-white">
          <h2 className="text-lg font-bold mb-1">Быстрые действия</h2>
          <p className="text-xs text-slate-400 mb-4">Клиент выбирает действие без поиска по меню</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Создать обращение", icon: <MessageSquare size={14} />, action: () => openModal("Создать обращение") },
              { label: "Заказать услугу", icon: <Zap size={14} />, action: () => openModal("Заказать услугу") },
              { label: "Заказать товар", icon: <ShoppingCart size={14} />, action: () => openModal("Заказать товар") },
              { label: "Счет на оплату", icon: <CreditCard size={14} />, action: () => openModal("Счет на оплату") },
              { label: "Создать базу 1С", icon: <Database size={14} />, action: () => openModal("Создать базу 1С") },
              { label: "Изменить количество лицензий 1С", icon: <Key size={14} />, action: () => openModal("Изменить количество лицензий 1С") },
              { label: "Скачать тонкий клиент 1С", icon: <Monitor size={14} />, action: () => openModal("Скачать тонкий клиент 1С") },
              { label: "Открыть проект", icon: <Briefcase size={14} />, action: () => openModal("Открыть проект") },
              { label: "Скачать AnyDesk", icon: <Download size={14} />, action: () => openModal("Скачать AnyDesk") },
              { label: "Скачать RuDesktop", icon: <Download size={14} />, action: () => openModal("Скачать RuDesktop") },
            ].map((a, i) => (
              <button key={i} onClick={a.action}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition-all cursor-pointer">
                {a.icon} {a.label}
              </button>
            ))}
          </div>
          <div className="mt-4 bg-white/10 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white">AI-подсказка:</span> перед созданием заявки система покажет 3 статьи базы знаний и предложит правильную категорию.
          </div>
        </div>
      </div>

      <Card cls="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Базы 1С</h2>
            <p className="text-xs text-slate-500 mt-0.5">Только данные баз: конфигурация, релиз, размер, пользователи, backup. Данные серверов — в разделе «Серверы и ресурсы».</p>
          </div>
          <Btn v="primary" sz="sm" onClick={() => nav("bases1c")}>Все базы 1С <ChevronRight size={14} /></Btn>
        </div>
        <div className="mobile-dashboard-metrics grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Активные базы", value: "3", sub: "фактически" },
            { label: "Конфигурации", value: "3", sub: "Бухгалтерия, УНФ, ЗУП" },
            { label: "Backup", value: "3 / 3", badge: <Badge v="green">актуально</Badge> },
            { label: "Клиентские лицензии", value: "10", sub: "7 занято · 3 свободно" },
          ].map((m, i) => (
            <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{m.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 mb-1">{m.value}</p>
              {"badge" in m ? m.badge : <p className="text-xs text-slate-500">{m.sub}</p>}
            </div>
          ))}
        </div>
        <Table heads={["База", "Конфигурация", "Релиз", "Размер", "Backup", ""]} rows={[
          ["1С Бухгалтерия", "Бухгалтерия предприятия", <Mono>3.0.160.21</Mono>, "18.4 GB", <Badge v="green">сегодня 03:00</Badge>,
            <div className="flex gap-1">
              <Btn v="ghost" sz="sm" onClick={() => openDiscussion("1С Бухгалтерия")}><MessageSquare size={13} /></Btn>
              <Btn v="default" sz="sm" onClick={() => nav("bases1c")}>Открыть</Btn>
            </div>],
          ["1С УНФ", "УНФ", <Mono>3.0.11.104</Mono>, "9.7 GB", <Badge v="green">сегодня 03:00</Badge>,
            <div className="flex gap-1">
              <Btn v="ghost" sz="sm" onClick={() => openDiscussion("1С УНФ")}><MessageSquare size={13} /></Btn>
              <Btn v="default" sz="sm" onClick={() => nav("bases1c")}>Открыть</Btn>
            </div>],
          ["1С ЗУП", "Зарплата и управление персоналом", <Mono>3.1.34.57</Mono>, "6.2 GB", <Badge v="amber">проверить</Badge>,
            <div className="flex gap-1">
              <Btn v="ghost" sz="sm" onClick={() => openDiscussion("1С ЗУП")}><MessageSquare size={13} /></Btn>
              <Btn v="default" sz="sm" onClick={() => nav("bases1c")}>Открыть</Btn>
            </div>],
        ]} />
      </Card>

      <Card cls="p-5">
        <div className="flex items-start justify-between mb-4 gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Package size={18} className="text-blue-600" />
              Заказы товаров
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Физические товары: оборудование, кассы, сканеры, принтеры, расходные материалы и комплектующие.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <Btn v="primary" sz="sm" onClick={() => nav("shipments")}>Открыть заказы</Btn>
            <Btn v="green" sz="sm">Заказать товар</Btn>
            <Btn v="default" sz="sm" onClick={() => nav("purchaseHistory")}>Повторить заказ</Btn>
          </div>
        </div>

        <div className="mobile-dashboard-metrics grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Активные заказы", value: "3", badge: <Badge v="blue">в работе</Badge> },
            { label: "Ожидают оплаты", value: "1", badge: <Badge v="amber">счет №8997</Badge> },
            { label: "В сборке", value: "1", badge: <Badge v="purple">комплектация</Badge> },
            { label: "В отгрузке", value: "1", badge: <Badge v="green">доставка</Badge> },
          ].map((m, i) => (
            <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{m.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 mb-1">{m.value}</p>
              {m.badge}
            </div>
          ))}
        </div>

        <Table heads={["Заказ", "Тег", "Сумма", "Оплата", "Доставка", ""]} rows={[
          ["#9012", <Badge v="blue">товары + услуги</Badge>, "28 900 ₽", <Badge v="green">оплачено</Badge>, "Трек: CDEK-9012",
            <Btn v="ghost" sz="sm" onClick={() => nav("shipments")}>Открыть</Btn>],
          ["#9008", <Badge v="purple">склад</Badge>, "9 500 ₽", <Badge v="green">оплачено</Badge>, "Самовывоз",
            <Btn v="ghost" sz="sm" onClick={() => nav("shipments")}>Открыть</Btn>],
          ["#8997", <Badge v="amber">резерв</Badge>, "4 700 ₽", <Badge v="amber">ожидает оплаты</Badge>, "После оплаты",
            <Btn v="green" sz="sm" onClick={() => openModal("Оплатить заказ")}>Оплатить</Btn>],
        ]} />
      </Card>
    </div>
  );
}

function CounterpartiesScreen({ onSelect, openModal }: { onSelect: (name: string, inn: string) => void; openModal: (title: string) => void }) {
  const [active, setActive] = useState("ED ART");
  const cps = [
    { id: "ED ART", inn: "0000000000", form: "ООО", desc: "Основной контрагент. 3 договора, 4 обращения, 2 счёта.", deals: 4 },
    { id: "Плазма-Сервис", inn: "7700123456", form: "ООО", desc: "2 договора, 1 активный проект, 1 обращение.", deals: 2 },
    { id: "Retail Group", inn: "5400987654", form: "ООО", desc: "1 договор, нет активных обращений, есть аренда сервера.", deals: 1 },
  ];
  return (
    <Card cls="p-5">
      <SH title="Контрагенты пользователя"
        sub="Один пользователь может работать за несколько компаний с разными ИНН. 1С — главный источник данных."
        action={<Btn v="green" sz="sm" onClick={() => openModal("Добавить контрагента")}><Plus size={14} /> Добавить контрагента</Btn>} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {cps.map((cp) => {
          const isActive = active === cp.id;
          return (
            <div key={cp.id} className={`rounded-xl border p-4 transition-all min-h-[185px] flex flex-col ${isActive ? "border-blue-300 bg-blue-50/50 ring-1 ring-blue-200" : "border-slate-200 bg-white"}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-slate-900">{cp.id}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{cp.form} · ИНН <Mono>{cp.inn}</Mono></p>
                </div>
                {isActive && <Badge v="blue" dot>активный</Badge>}
              </div>
              <p className="text-xs text-slate-500 mb-3 min-h-[32px]">{cp.desc}</p>
              <div className="mt-auto grid grid-cols-2 gap-2 items-stretch">
                <Btn v={isActive ? "blue" : "default"} sz="sm" full cls="h-full" onClick={() => { setActive(cp.id); onSelect(cp.id, cp.inn); }}>
                  {isActive ? "Выбран" : "Выбрать"}
                </Btn>
                <Btn v="default" sz="sm" full cls="h-full" onClick={() => openModal("Изменить реквизиты контрагента")}>Реквизиты</Btn>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function TicketsScreen({ openModal, openDiscussion }: {
  openModal: () => void; openDiscussion: (r: string) => void;
}) {
  const [tab, setTab] = useState("Все");
  const tabs = ["Все", "Новые", "В работе", "Ожидают клиента", "Закрытые"];
  const tickets = [
    { n: "#1042", topic: "Ошибка обмена 1С с сайтом", type: "1С / интеграция", statusLabel: "в работе", statusV: "amber" as BV, resp: "Иван", sla: "01:20 осталось" },
    { n: "#1041", topic: "Не открывается база бухгалтерии", type: "Сервер / база 1С", statusLabel: "критично", statusV: "red" as BV, resp: "Сергей", sla: "Нарушен" },
    { n: "#1038", topic: "Добавить пользователя в базу", type: "Доступы", statusLabel: "ожидает клиента", statusV: "blue" as BV, resp: "Иван", sla: "В срок" },
    { n: "#1035", topic: "Настройка отчетности по зарплате", type: "1С / ЗУП", statusLabel: "закрыто", statusV: "gray" as BV, resp: "Алексей", sla: "В срок" },
  ];
  const [activeN, setActiveN] = useState(tickets[0].n);
  const active = tickets.find(t => t.n === activeN) || tickets[0];
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 xl:h-[calc(100vh-116px)] xl:min-h-0">
      <Card cls="xl:col-span-3 p-5 xl:h-full xl:min-h-0 flex flex-col overflow-hidden">
        <div className="shrink-0">
          <SH title="Обращения" action={<Btn v="green" sz="sm" onClick={openModal}><Plus size={14} /> Создать обращение</Btn>} />
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Поиск по теме, номеру, базе 1С, серверу..." />
          </div>
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${tab === t ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2 xl:flex-1 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-1 sidebar-scrollbar-hidden">
          {tickets.map(t => (
            <button key={t.n} type="button" onClick={() => setActiveN(t.n)}
              className={`w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer ${active.n === t.n ? "border-slate-900 ring-1 ring-slate-900 bg-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><p className="font-mono text-xs font-bold text-slate-600">{t.n}</p><p className="font-semibold text-slate-900 mt-1 truncate">{t.topic}</p><p className="text-xs text-slate-500 mt-1">{t.type} · ответственный: {t.resp}</p></div>
                <Badge v={t.statusV}>{t.statusLabel}</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-2">SLA: {t.sla}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card cls="xl:col-span-2 p-5 xl:h-full xl:min-h-0 flex flex-col overflow-hidden">
        <div className="shrink-0">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Обращение {active.n}</h2>
          <div className="flex gap-2 mb-3"><Badge v={active.statusV}>{active.statusLabel}</Badge><Badge v="blue">SLA {active.sla}</Badge></div>
          <p className="text-xs text-slate-500 mb-4">{active.topic}. Категорию и приоритет уточняет поддержка по содержанию обращения.</p>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto sidebar-scrollbar-hidden pr-1 flex flex-col gap-3 mb-4">
          <ChatMsg from="Клиент" text="После обновления проблема повторяется. Скрин приложил." />
          <ChatMsg from={`Инженер ${active.resp}`} text="Проверяю регламентные задания и доступы. Отпишусь в этом обращении." me />
          <ChatMsg from="AI-помощник" text="Предварительно: возможно потребуется проверить права и журнал ошибок. Категория будет назначена автоматически." />
        </div>
        <div className="border-t border-slate-100 pt-4 shrink-0">
          <TextareaWithAttach rowsCls="h-20" placeholder="Напишите сообщение по обращению..." />
          <div className="flex gap-2 mt-3 justify-end"><Btn v="default" sz="sm">Сохранить</Btn><Btn v="blue" sz="sm">Отправить</Btn><Btn v="danger" sz="sm">Закрыть</Btn></div>
        </div>
      </Card>
    </div>
  );
}

function Bases1CScreen({ openDiscussion }: { openDiscussion: (r: string) => void }) {
  const [sel, setSel] = useState<"buh" | "unf" | "zup" | null>("buh");
  const bases = {
    buh: { name: "1С Бухгалтерия", config: "Бухгалтерия предприятия", release: "3.0.160.21", size: "18.4 GB", backup: "Сегодня, 03:00", auto: "Включено", web: "Активна", status: "Работает" },
    unf: { name: "1С УНФ", config: "Управление нашей фирмой", release: "3.0.11.104", size: "9.7 GB", backup: "Сегодня, 03:00", auto: "По согласованию", web: "Активна", status: "Работает" },
    zup: { name: "1С ЗУП", config: "Зарплата и управление персоналом", release: "3.1.34.57", size: "6.2 GB", backup: "Требует проверки", auto: "Выключено", web: "Ограничена", status: "Нужна проверка backup" },
  };
  const cur = sel ? bases[sel] : null;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Фактические базы" value="3" />
        <Metric label="Клиентские лицензии" value="10" extra={<p className="text-xs text-slate-500">общий пул</p>} />
        <Metric label="Используется" value="7" extra={<p className="text-xs text-slate-500">пользователей</p>} />
        <Metric label="Свободно" value="3" extra={<Badge v="green">доступно</Badge>} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 xl:h-[calc(100vh-220px)] xl:min-h-0">
        <Card cls="xl:col-span-2 p-5 xl:h-full xl:min-h-0 flex flex-col overflow-hidden">
          <div className="shrink-0">
            <SH title="Базы 1С"
              sub="Только данные баз 1С. Информация о серверах — в разделе «Серверы и ресурсы»."
              action={<Btn v="green" sz="sm" onClick={() => window.dispatchEvent(new CustomEvent("lk:prototype-action", { detail: { title: "Заказать базу 1С" } }))}>Заказать базу</Btn>} />
          </div>
          <div className="space-y-2 xl:flex-1 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain sidebar-scrollbar-hidden pr-1">
            {(["buh", "unf", "zup"] as const).map(id => {
              const b = bases[id];
              const isWarn = id === "zup";
              return (
                <div key={id} onClick={() => setSel(id)}
                  className={`rounded-lg border p-3 cursor-pointer transition-all ${sel === id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-sm font-bold mb-0.5 ${sel === id ? "text-white" : "text-slate-900"}`}>{b.name}</p>
                      <p className={`text-xs ${sel === id ? "text-slate-300" : "text-slate-500"}`}>{b.config} · <Mono cls={sel === id ? "text-slate-300" : ""}>{b.release}</Mono></p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {isWarn ? <Badge v="amber" sm>проверить</Badge> : <Badge v={sel === id ? "gray" : "green"} sm>ОК</Badge>}
                      <Btn v="ghost" sz="sm" cls={sel === id ? "text-white hover:bg-white/20" : ""} onClick={(e) => { e.stopPropagation(); openDiscussion(b.name); }}><MessageSquare size={13} /></Btn>
                    </div>
                  </div>
                  <div className={`flex gap-3 mt-2 text-xs ${sel === id ? "text-slate-400" : "text-slate-500"}`}>
                    <span>{b.size}</span>
                    <span>·</span>
                    <span>Backup: {b.backup}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {cur && (
          <Card cls="xl:col-span-3 xl:h-full xl:min-h-0 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 shrink-0">
              <SH title={`Карточка базы: ${cur.name}`}
                sub="Информация только по базе 1С — без IP, CPU/RAM/SSD и тарифа сервера"
                action={<div className="flex gap-2 flex-wrap"><Btn v="green" sz="sm" onClick={() => window.dispatchEvent(new CustomEvent("lk:prototype-action", { detail: { title: "Заказать базу 1С" } }))}>Заказать базу</Btn><Btn v="default" sz="sm" onClick={() => window.dispatchEvent(new CustomEvent("lk:prototype-action", { detail: { title: "Добавить лицензии 1С" } }))}>Добавить лицензии</Btn></div>} />
            </div>
            <div className="p-5 space-y-4 xl:flex-1 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain sidebar-scrollbar-hidden">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Основное</h3>
                <InfoGrid items={[
                  { label: "Конфигурация", value: cur.config },
                  { label: "Релиз", value: <Mono>{cur.release}</Mono> },
                  { label: "Тип базы", value: "SQL" },
                  { label: "Размер", value: cur.size },
                ]} />
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Состояние</h3>
                <InfoGrid items={[
                  { label: "Статус", value: cur.status },
                  { label: "Backup", value: cur.backup },
                  { label: "Автообновление", value: cur.auto },
                  { label: "Веб-публикация", value: cur.web },
                ]} />
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Доступ текущего пользователя</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Логин и пароль для выбранной базы. В реальном кабинете значения приходят из 1С/хранилища доступов.</p>
                </div>
                <Badge v="blue" sm>текущий пользователь</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AccessValue label="Логин" value="maria@edart.local" />
                <AccessValue label="Пароль" value="EdArt-1C-2026!" secret />
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Пользователи и доступы</h3>
              <Table compact heads={["Пользователь", "Роль в базе", "Лицензия", "Доступ"]} rows={[
                ["Мария Акопян", "Администратор", "1 из пула", <Badge v="green">разрешён</Badge>],
                ["Бухгалтерия", "Пользователь", "1 из пула", <Badge v="green">разрешён</Badge>],
                ["Иван (инженер)", "Техспециалист", "не занимает", <Badge v="blue">сервисный</Badge>],
              ]} />
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Действия по базе</h3>
              <div className="flex flex-wrap gap-2">
                {["Подключиться к базе", "Скопировать web-ссылку", "Скачать тонкий клиент 1С", "Настроить доступ", "Политики доступа", "Загрузить .dt", "Восстановить из backup", "Скачать базу"].map(a => (
                  <Btn key={a} v="default" sz="sm">{a}</Btn>
                ))}
                <Btn v="danger" sz="sm">Удалить базу</Btn>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Btn v="default" sz="sm" onClick={() => openDiscussion(cur.name)}><MessageSquare size={13} /> Создать обращение по базе</Btn>
              <Btn v="ghost" sz="sm">История изменений</Btn>
              <Btn v="ghost" sz="sm">Журнал backup</Btn>
            </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function ServersScreen({ openDiscussion }: { openDiscussion: (r: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Активные серверы" value="3" />
        <Metric label="Базы 1С" value="3" extra={<p className="text-xs text-slate-500">на серверах</p>} />
        <Metric label="Backup" value="3 / 3" extra={<Badge v="green">актуально</Badge>} />
        <Metric label="Продление" value="1" extra={<Badge v="amber">через 6 дней</Badge>} />
      </div>

      <Card cls="p-5">
        <SH title="Серверы и ресурсы"
          sub="Только серверы и арендованные ресурсы: IP, CPU/RAM/SSD, тарифы, продление, доступы. Базы 1С — в отдельном разделе." />
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Поиск по серверу, IP, тарифу, партнёру..." />
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-start gap-4 p-4 border-l-4 border-emerald-500 bg-white">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-slate-900"><Mono cls="text-sm font-bold text-slate-900">#SRV-247090</Mono></p>
                <Badge v="green" dot>ONLINE</Badge>
              </div>
              <p className="text-xs text-slate-500">Москва · Windows Server · 1С</p>
            </div>
            <div className="grid grid-cols-4 gap-6 text-sm shrink-0">
              <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">IP</p><Mono>10.10.100.12</Mono></div>
              <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Тариф</p><p className="font-semibold text-slate-700">Бизнес</p></div>
              <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">CPU / RAM</p><p className="font-semibold text-slate-700">6 vCPU / 16 GB</p></div>
              <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">До конца</p><p className="font-semibold text-amber-600">6 дней</p></div>
            </div>
          </div>
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <div className="grid grid-cols-3 gap-6 mb-4">
              <InfoGrid items={[
                { label: "ОС", value: "Windows Server" },
                { label: "Оплачено до", value: "01.07.2026" },
                { label: "RAM", value: "16 GB" },
                { label: "SSD", value: "250 GB" },
              ]} />
              <InfoGrid items={[
                { label: "Базы 1С", value: "Бухгалтерия, УНФ, ЗУП" },
                { label: "Backup", value: "Сегодня, 03:00" },
                { label: "Владелец", value: "ED ART" },
                { label: "Входит в договор", value: "Да" },
              ]} />
              <InfoGrid items={[
                { label: "Ответственный", value: "Инженер Сергей" },
                { label: "Статус", value: "Запущен" },
                { label: "CPU нагрузка", value: "23%" },
                { label: "RAM нагрузка", value: "61%" },
              ]} />
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Базы 1С на этом ресурсе</h3>
              <Table compact heads={["База", "Статус", ""]} rows={[
                ["1С Бухгалтерия", <Badge v="green">активна</Badge>, <Btn v="ghost" sz="sm" onClick={() => openDiscussion("1С Бухгалтерия")}><MessageSquare size={13} /></Btn>],
                ["1С УНФ", <Badge v="green">активна</Badge>, <Btn v="ghost" sz="sm" onClick={() => openDiscussion("1С УНФ")}><MessageSquare size={13} /></Btn>],
                ["1С ЗУП", <Badge v="amber">проверить</Badge>, <Btn v="ghost" sz="sm" onClick={() => openDiscussion("1С ЗУП")}><MessageSquare size={13} /></Btn>],
              ]} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Btn v="default" sz="sm">Диагностика</Btn>
              <Btn v="default" sz="sm">Перезагрузка VPS</Btn>
              <Btn v="default" sz="sm"><BarChart2 size={13} /> Статистика</Btn>
              <Btn v="default" sz="sm">Как подключиться?</Btn>
              <Btn v="default" sz="sm">Запросить доступ</Btn>
              <Btn v="default" sz="sm"><Download size={13} /> Скачать RDP-клиент с настройками</Btn>
              <Btn v="danger" sz="sm" onClick={() => openDiscussion("#SRV-247090")}>Создать инцидент</Btn>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function LicensesScreen({ openModal }: { openModal: () => void }) {
  const [qty, setQty] = useState(10);
  const used = 7;
  const unitPrice = 1500;
  const price = qty * unitPrice;
  const free = qty - used;
  const delta = qty - 10;
  const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Конфигурации 1С" value="2" extra={<Badge v="blue">Бухгалтерия + УНФ</Badge>} />
        <Metric label="Клиентские лицензии" value={qty} extra={<p className="text-xs text-slate-500">общий пул</p>} />
        <Metric label="Стоимость пула" value={fmt(price)} extra={<Badge v="blue">лицензии</Badge>} />
        <Metric label="Использовано" value={`${used} / ${qty}`} extra={<Progress v={used} max={qty} color={used / qty > 0.8 ? "amber" : "green"} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card cls="p-5">
          <SH title="Конфигурации 1С" />
          <DocRow title="1С Бухгалтерия" sub="Основная конфигурация · общий пул лицензий"
            action={<><Badge v="green">активна</Badge><Btn v="default" sz="sm">Открыть</Btn><Btn v="default" sz="sm"><Download size={13} /> Тонкий клиент</Btn></>} />
          <DocRow title="1С УНФ" sub="Подключена к тому же пулу · цена пула не изменилась"
            action={<><Badge v="blue">новая</Badge><Btn v="default" sz="sm">Открыть</Btn><Btn v="default" sz="sm"><Download size={13} /> Тонкий клиент</Btn></>} />
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Добавить конфигурацию</h3>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option>1С ЗУП</option>
              <option>1С Розница</option>
              <option>1С Управление торговлей</option>
              <option>1С ERP</option>
            </select>
            <Btn v="primary" sz="sm" full>Отправить заявку</Btn>
          </div>
        </Card>

        <div className="bg-slate-900 rounded-xl p-5 text-white">
          <h2 className="text-lg font-bold mb-1">Общий пул лицензий</h2>
          <p className="text-3xl font-extrabold mt-3">{fmt(price)}</p>
          <p className="text-slate-400 text-sm">{qty} клиентских лицензий</p>
          <div className="my-4">
            <Progress v={used} max={qty} color="green" />
            <p className="text-xs text-slate-400 mt-1">{used} из {qty} используются</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
            Одни и те же лицензии используются в 1С Бухгалтерии и 1С УНФ. Добавление конфигурации не увеличивает стоимость пула.
          </div>
        </div>

        <Card cls="p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Управление пулом</h2>
          <p className="text-xs text-slate-500 mb-4">Уменьшить ниже {used} (используемых) нельзя</p>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setQty(q => Math.max(used, q - 1))}
              className="w-10 h-10 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center text-xl font-bold cursor-pointer transition-all">
              <Minus size={16} />
            </button>
            <div className="flex-1 text-center border border-slate-200 rounded-lg py-2.5">
              <p className="text-2xl font-extrabold text-slate-900">{qty}</p>
              <p className="text-[10px] text-slate-400">лицензий</p>
            </div>
            <button onClick={() => setQty(q => q + 1)}
              className="w-10 h-10 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center text-xl font-bold cursor-pointer transition-all">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {[7, 10, 15, 20].map(n => (
              <Btn key={n} v={qty === n ? "primary" : "default"} sz="sm" onClick={() => setQty(n)}>{n}</Btn>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 mb-4">
            <div className="flex justify-between mb-1"><span>Текущий пул</span><span className="font-bold">10 лиц. · {fmt(10 * unitPrice)}</span></div>
            <div className="flex justify-between mb-1"><span>Новый пул</span><span className="font-bold">{qty} лиц. · {fmt(price)}</span></div>
            <div className="flex justify-between"><span>Изменение</span><span className={`font-bold ${delta > 0 ? "text-emerald-700" : delta < 0 ? "text-red-700" : "text-slate-600"}`}>
              {delta === 0 ? "без изменений" : delta > 0 ? `+${delta} лиц. · +${fmt(delta * unitPrice)}` : `${delta} лиц. · ${fmt(delta * unitPrice)}`}
            </span></div>
          </div>
          <Btn v="green" sz="sm" full onClick={openModal}>Отправить заявку на изменение</Btn>
        </Card>
      </div>

      <Card cls="p-5">
        <SH title="Матрица доступа пользователей" sub="Кто какими конфигурациями пользуется и занимает ли лицензию из общего пула" />
        <Table heads={["Пользователь", "1С Бухгалтерия", "1С УНФ", "Занимает лицензию", "Статус"]} rows={[
          ["Мария Акопян", "✓ Администратор", "✓ Администратор", "1 из общего пула", <Badge v="green">активен</Badge>],
          ["Бухгалтерия", "✓ Пользователь", "—", "1 из общего пула", <Badge v="green">активен</Badge>],
          ["Менеджер продаж", "—", "✓ Пользователь", "1 из общего пула", <Badge v="blue">активен</Badge>],
          ["Склад", "—", "✓ Пользователь", "1 из общего пула", <Badge v="green">активен</Badge>],
          ["Ольга (бухгалтер)", "✓ Пользователь", "—", "1 из общего пула", <Badge v="green">активен</Badge>],
          ["Артём", "—", "✓ Пользователь", "1 из общего пула", <Badge v="green">активен</Badge>],
          ["Иван (инженер)", "✓ Техспециалист", "✓ Техспециалист", "не занимает", <Badge v="gray">сервисный</Badge>],
        ]} />
        <div className="flex gap-2 mt-4">
          <Btn v="green" sz="sm"><UserPlus size={13} /> Добавить пользователя</Btn>
          <Btn v="default" sz="sm">Изменить доступы</Btn>
          <Btn v="default" sz="sm" onClick={openModal}>Заказать ещё лицензии</Btn>
        </div>
      </Card>
    </div>
  );
}

function SessionsScreen({ nav }: { nav: (s: Screen) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Доступно сеансов" value="10" extra={<p className="text-xs text-slate-500">по пулу лицензий</p>} />
        <Metric label="Активных подключений" value="7" extra={<Badge v="green">3 свободно</Badge>} />
        <Metric label="Пиковая нагрузка" value="9" extra={<Badge v="amber">вчера 14:30</Badge>} />
        <Metric label="Рекомендация" value="+5" extra={<Badge v="blue">при росте команды</Badge>} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card cls="p-5">
          <SH title="Активные сеансы 1С" sub="Сеансы расходуют общий пул клиентских лицензий" />
          <Table heads={["Пользователь", "База 1С", "Начало", "Длительность", "Статус", ""]} rows={[
            ["Мария Акопян", "1С Бухгалтерия", "09:10", "4 ч 32 мин", <Badge v="green">активен</Badge>, <Btn v="danger" sz="sm">Завершить</Btn>],
            ["Бухгалтерия", "1С Бухгалтерия", "09:25", "4 ч 17 мин", <Badge v="green">активен</Badge>, <Btn v="danger" sz="sm">Завершить</Btn>],
            ["Склад", "1С УНФ", "10:05", "3 ч 37 мин", <Badge v="green">активен</Badge>, <Btn v="danger" sz="sm">Завершить</Btn>],
            ["Менеджер продаж", "1С УНФ", "10:20", "3 ч 22 мин", <Badge v="green">активен</Badge>, <Btn v="danger" sz="sm">Завершить</Btn>],
            ["Ольга", "1С Бухгалтерия", "11:00", "2 ч 42 мин", <Badge v="green">активен</Badge>, <Btn v="danger" sz="sm">Завершить</Btn>],
            ["Артём", "1С УНФ", "11:15", "2 ч 27 мин", <Badge v="green">активен</Badge>, <Btn v="danger" sz="sm">Завершить</Btn>],
            ["Иван (инженер)", "1С ЗУП", "08:30", "5 ч 12 мин", <Badge v="blue">сервисный</Badge>, <Btn v="ghost" sz="sm">—</Btn>],
          ]} />
        </Card>
        <Card cls="p-5">
          <SH title="Управление сеансами" />
          <DocRow title="Изменить количество клиентских лицензий" sub="Текущее: 10 лицензий, используется: 7"
            action={<Btn v="green" sz="sm" onClick={() => nav("licenses")}>Изменить</Btn>} />
          <DocRow title="История подключений" sub="Кто, когда и к какой базе подключался"
            action={<Btn v="default" sz="sm">Открыть</Btn>} />
          <DocRow title="Лимит одновременных подключений" sub="Контроль превышения и уведомления"
            action={<Btn v="default" sz="sm">Настроить</Btn>} />
          <DocRow title="Принудительное завершение всех сеансов" sub="Например, для планового обновления базы"
            action={<Btn v="danger" sz="sm">Завершить все</Btn>} />
          <Hint>Если клиент упирается в лимит сеансов, система предлагает увеличить пул лицензий — не просто показывает ошибку.</Hint>
        </Card>
      </div>
    </div>
  );
}

function BillingScreen({ openModal }: { openModal: () => void }) {
  const [tab, setTab] = useState("Счета");
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Баланс" value="23 791 ₽" extra={<Badge v="green">доступно</Badge>} />
        <Metric label="К оплате" value="57 900 ₽" extra={<Badge v="amber">2 счёта</Badge>} />
        <Metric label="Привязанные карты" value="3" extra={<p className="text-xs text-slate-500">1 основная</p>} />
        <Metric label="Бонусы" value="4 800" extra={<Badge v="blue">можно списать</Badge>} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card cls="p-5">
          <SH title="Платёжный дашборд" />
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Пополнить баланс</h3>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200" defaultValue="10 000" />
              <div className="flex gap-1.5 flex-wrap">
                {["5 000 ₽", "10 000 ₽", "20 000 ₽"].map(a => (
                  <Btn key={a} v="default" sz="sm">{a}</Btn>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Способ оплаты</h3>
              <p className="text-sm font-bold text-slate-800 mb-1">Visa •••• 4589</p>
              <p className="text-xs text-slate-500 mb-2">Автоплатёж: Включён</p>
              <Btn v="default" sz="sm">Сменить карту</Btn>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn v="green" onClick={openModal}><CreditCard size={14} /> Оплатить картой</Btn>
            <Btn v="primary">Счёт на оплату</Btn>
            <Btn v="default">Обещанный платёж</Btn>
          </div>
        </Card>
        <Card cls="p-5">
          <SH title="Привязанные карты" action={<Btn v="green" sz="sm"><Plus size={14} /> Привязать</Btn>} />
          <DocRow title="Visa •••• 4589" sub="Основная карта для оплаты услуг и аренды"
            action={<Badge v="blue">основная</Badge>} />
          <DocRow title="Mastercard •••• 1124" sub="Резервная карта"
            action={<Btn v="default" sz="sm">Сделать основной</Btn>} />
          <DocRow title="Корпоративная •••• 9031" sub="Автоплатёж отключён"
            action={<Btn v="default" sz="sm">Подключить</Btn>} />
        </Card>
      </div>

      <Card cls="p-5">
        <div className="flex gap-1.5 mb-4">
          {["Счета", "Оплаты", "Автоплатежи"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${tab === t ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
              {t}
            </button>
          ))}
        </div>
        <Table heads={["Документ", "Дата", "Сумма", "Статус", ""]} rows={[
          ["Счёт №237", "09.05.2026", "45 000 ₽", <Badge v="amber">ожидает оплату</Badge>, <Btn v="green" sz="sm" onClick={openModal}>Оплатить</Btn>],
          ["Счёт №233", "01.05.2026", "12 900 ₽", <Badge v="red">просрочен</Badge>, <Btn v="green" sz="sm" onClick={openModal}>Оплатить</Btn>],
          ["Оплата #741", "27.05.2026", "12 500 ₽", <Badge v="green">оплачено</Badge>, <Btn v="ghost" sz="sm"><Download size={13} /> Чек</Btn>],
          ["Оплата #739", "01.05.2026", "45 000 ₽", <Badge v="green">оплачено</Badge>, <Btn v="ghost" sz="sm"><Download size={13} /> Чек</Btn>],
        ]} />
      </Card>
    </div>
  );
}

function DealsScreen() {
  const projects = [
    {
      title: "Автоматизация отдела продаж",
      type: "Внедрение / CRM",
      statusLabel: "в работе",
      statusV: "amber" as BV,
      deadline: "15.08.2026",
      progress: 65,
      manager: "Алексей",
      lead: "Иван",
      stage: "Настройка бизнес-процессов",
      next: "Тестирование клиентом",
      wait: "Подтвердить сценарии",
      deal: "PR-2026-018",
      desc: "Настройка воронки продаж, обмена с 1С и регламентов работы отдела продаж.",
      steps: [
        ["Этап 1. Обследование", "Завершён · собраны требования, согласована схема работ."],
        ["Этап 2. Проектирование", "Завершён · согласован прототип, составлено ТЗ."],
        ["Этап 3. Реализация", "В работе · выполняется настройка и доработка."],
        ["Этап 4. Тестирование", "Не начат."],
      ],
    },
    {
      title: "Интеграция 1С с сайтом",
      type: "Интеграция",
      statusLabel: "согласование",
      statusV: "blue" as BV,
      deadline: "07.07.2026",
      progress: 40,
      manager: "Алексей",
      lead: "Сергей",
      stage: "Согласование схемы обмена",
      next: "Подписание ТЗ",
      wait: "Проверить список сущностей",
      deal: "PR-2026-021",
      desc: "Обмен заказами, оплатами, контрагентами, документами и статусами между сайтом и 1С.",
      steps: [
        ["Этап 1. Анализ обмена", "Завершён · определены сущности и направления синхронизации."],
        ["Этап 2. ТЗ", "В работе · согласовывается состав данных."],
        ["Этап 3. Реализация API", "Не начат."],
        ["Этап 4. Тестовый обмен", "Не начат."],
      ],
    },
    {
      title: "Перенос баз 1С на сервер",
      type: "Инфраструктура",
      statusLabel: "по плану",
      statusV: "green" as BV,
      deadline: "30.06.2026",
      progress: 80,
      manager: "Мария",
      lead: "Иван",
      stage: "Проверка резервных копий",
      next: "Финальное переключение пользователей",
      wait: "Согласовать окно работ",
      deal: "PR-2026-014",
      desc: "Перенос рабочих баз на выделенный сервер, настройка backup, RDP и прав доступа.",
      steps: [
        ["Этап 1. Подготовка сервера", "Завершён · ресурсы выделены."],
        ["Этап 2. Перенос тестовой копии", "Завершён · база проверена."],
        ["Этап 3. Финальная миграция", "В работе · согласуется окно переключения."],
        ["Этап 4. Контроль после запуска", "Не начат."],
      ],
    },
  ];
  const [activeTitle, setActiveTitle] = useState(projects[0].title);
  const active = projects.find(p => p.title === activeTitle) || projects[0];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 xl:h-[calc(100vh-116px)] xl:min-h-0">
        <Card cls="p-5 xl:h-full xl:min-h-0 flex flex-col overflow-hidden">
          <div className="shrink-0">
            <SH title="Сделки и проекты"
              sub="Выберите проект в списке — справа откроется карточка, этапы, ответственные и сообщения."
              action={<Btn v="blue" sz="sm" onClick={() => window.dispatchEvent(new CustomEvent("lk:prototype-action", { detail: { title: `Запросить статус по проекту ${active.title}` } }))}>Запросить статус</Btn>} />
            <div className="flex gap-1.5 mb-4 flex-wrap">
              {["Все", "Активные", "Согласование", "В работе", "Завершённые"].map(t => (
                <button key={t} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${t === "Все" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="space-y-2 xl:flex-1 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-1 sidebar-scrollbar-hidden">
            {projects.map(p => (
              <button key={p.title} type="button" onClick={() => setActiveTitle(p.title)}
                className={`w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer ${active.title === p.title ? "border-slate-900 ring-1 ring-slate-900 bg-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{p.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{p.type} · сделка {p.deal}</p>
                  </div>
                  <Badge v={p.statusV}>{p.statusLabel}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">Срок: {p.deadline}</span>
                  <span className="text-xs font-semibold text-slate-600">{p.progress}%</span>
                </div>
                <Progress v={p.progress} color={p.statusV === "blue" ? "blue" : "green"} />
              </button>
            ))}
          </div>
        </Card>
        <Card cls="p-5 xl:h-full xl:min-h-0 flex flex-col overflow-hidden">
          <div className="shrink-0">
            <h2 className="text-lg font-bold text-slate-900 mb-1">{active.title}</h2>
            <div className="flex gap-2 mb-4 flex-wrap"><Badge v={active.statusV}>{active.statusLabel}</Badge><span className="text-xs text-slate-500">Сделка № {active.deal}</span></div>
            <p className="text-sm text-slate-600 mb-4">{active.desc}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <InfoGrid items={[
                  { label: "Руководитель проекта", value: active.manager },
                  { label: "Технический лидер", value: active.lead },
                  { label: "Срок", value: active.deadline },
                ]} />
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <InfoGrid items={[
                  { label: "Текущий этап", value: active.stage },
                  { label: "Следующий шаг", value: active.next },
                  { label: "Ожидается от клиента", value: active.wait },
                ]} />
              </div>
            </div>
          </div>
          <div className="xl:flex-1 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-1 sidebar-scrollbar-hidden">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Этапы проекта</h3>
            <div>
              {active.steps.map((step, idx) => <TEvent key={step[0]} date={step[0]} text={step[1]} last={idx === active.steps.length - 1} />)}
            </div>
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Сообщение по проекту</h3>
              <TextareaWithAttach rowsCls="h-20" placeholder="Напишите комментарий, вопрос по этапу или приложите файл..." />
              <div className="flex justify-end gap-2 mt-3"><Btn v="default" sz="sm">Сохранить черновик</Btn><Btn v="blue" sz="sm">Отправить</Btn></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ContractsScreen() {
  const contracts = [
    { title: "Договор №45/1С", sub: "Абонентское обслуживание 1С · активен до 01.07.2026", status: "активен", file: "dogovor-45-1c.pdf" },
    { title: "SLA обслуживания", sub: "Критичные — 2 часа, обычные — 8 часов", status: "регламент", file: "sla-obsluzhivaniya.pdf" },
    { title: "Регламент работ", sub: "Что входит и что не входит в абонентку", status: "документ", file: "reglament-rabot.pdf" },
    { title: "Договор аренды АР-15/2026", sub: "Серверное сопровождение · до 01.08.2026", status: "активен", file: "arenda-ar-15-2026.pdf" },
  ];
  const [active, setActive] = useState(contracts[0]);
  const [notice, setNotice] = useState("");
  const mark = (text: string) => { setNotice(text); window.setTimeout(() => setNotice(""), 1800); };
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <Card cls="p-5">
        <SH title="Договоры и SLA" sub="Договоры кликабельные: можно открыть карточку и скачать файл." />
        <div className="space-y-2">
          {contracts.map(c => (
            <button key={c.title} type="button" onClick={() => setActive(c)}
              className={`w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer ${active.title === c.title ? "border-slate-900 ring-1 ring-slate-900 bg-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><p className="font-bold text-slate-900">{c.title}</p><p className="text-xs text-slate-500 mt-1">{c.sub}</p></div>
                <Badge v={c.status === "активен" ? "green" : "blue"}>{c.status}</Badge>
              </div>
            </button>
          ))}
        </div>
      </Card>
      <Card cls="p-5">
        <SH title={active.title} sub="Карточка договора и действия клиента" />
        {notice && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 mb-4"><CheckCircle2 size={16} className="inline mr-1" />{notice}</div>}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-4">
          <InfoGrid items={[
            { label: "Контрагент", value: "ED ART · ИНН 0000000000" },
            { label: "Статус", value: active.status },
            { label: "Файл", value: <Mono>{active.file}</Mono> },
            { label: "Срок", value: active.title.includes("аренды") ? "до 01.08.2026" : "до 01.07.2026" },
          ]} />
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          <Btn v="green" sz="sm" onClick={() => mark(`${active.title} скачан`)}><Download size={13} /> Скачать договор</Btn>
          <Btn v="default" sz="sm" onClick={() => mark("Запрос на отправку договора на email создан")}>Отправить на email</Btn>
          <Btn v="default" sz="sm" onClick={() => window.dispatchEvent(new CustomEvent("lk:prototype-action", { detail: { title: `Создать обращение по ${active.title}` } }))}>Создать обращение</Btn>
        </div>
        <SH title="Лимит часов" />
        <div className="mb-4"><div className="flex justify-between text-sm mb-2"><span className="font-bold text-slate-900">12 / 20 часов</span><span className="text-slate-500">остаток на июль</span></div><Progress v={12} max={20} color="blue" /></div>
        <Table compact heads={["Работа", "Дата", "Часы"]} rows={[
          ["Обновление 1С Бухгалтерия", "15.06.2026", "2.5 ч"],
          ["Консультация бухгалтера", "18.06.2026", "1.0 ч"],
          ["Интеграция с сайтом", "20.06.2026", "4.5 ч"],
          ["Итого использовано", "", "8 ч"],
        ]} />
      </Card>
    </div>
  );
}

function DocumentsScreen({ openModal }: { openModal: (title: string) => void }) {
  return (
    <Card cls="p-5">
      <SH title="Акты и документы"
        sub="Закрывающие документы, договоры, приложения, регламенты."
        action={<div className="flex gap-2 flex-wrap"><Btn v="green" sz="sm" onClick={() => openModal("Заказать документ")}>Заказать документ</Btn><Btn v="default" sz="sm"><Download size={13} /> Скачать все</Btn></div>} />
      <Table heads={["Документ", "Дата", "Контрагент", "Сумма", ""]} rows={[
        ["Акт №188 — аренда VPS", "31.05.2026", "ED ART", "12 900 ₽", <Btn v="ghost" sz="sm"><Download size={13} /> Скачать</Btn>],
        ["Акт №177 — сопровождение 1С", "31.05.2026", "ED ART", "15 000 ₽", <Btn v="ghost" sz="sm"><Download size={13} /> Скачать</Btn>],
        ["Приложение к договору", "01.01.2026", "ED ART", "—", <Btn v="ghost" sz="sm" onClick={() => openModal("Открыть КП")}>Открыть КП</Btn>],
        ["Регламент работ", "01.01.2026", "ED ART", "—", <Btn v="ghost" sz="sm"><Download size={13} /> Скачать</Btn>],
        ["Акт сверки за Q2 2026", "30.06.2026", "ED ART", "—", <Btn v="default" sz="sm"><Download size={13} /> Скачать</Btn>],
      ]} />
    </Card>
  );
}

function OffersScreen({ openModal }: { openModal: (title: string) => void }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <Card cls="p-5">
        <SH title="Коммерческие предложения"
          sub="Клиент видит все КП: может открыть, согласовать или задать вопрос." />
        <Table heads={["№ КП", "Тема", "Статус", "Сумма", ""]} rows={[
          ["КП-74", "Автоматизация отдела продаж", <Badge v="green">согласовано</Badge>, "380 000 ₽", <Btn v="ghost" sz="sm" onClick={() => openModal("Открыть КП")}>Открыть КП</Btn>],
          ["КП-81", "Расширение сервера 1С", <Badge v="blue">отправлено</Badge>, "24 900 ₽", <Btn v="default" sz="sm" onClick={() => openModal("Открыть КП")}>Открыть КП</Btn>],
          ["КП-83", "Резервный канал backup", <Badge v="amber">ожидает решения</Badge>, "12 500 ₽", <Btn v="default" sz="sm" onClick={() => openModal("Открыть КП")}>Открыть КП</Btn>],
        ]} />
      </Card>
      <Card cls="p-5">
        <SH title="КП-81 · Расширение сервера 1С" />
        <div className="flex gap-2 mb-4"><Badge v="blue">Отправлено</Badge></div>
        <p className="text-sm text-slate-600 mb-4">Что предлагаем: увеличить RAM до 32 GB, расширить SSD до 500 GB, усилить backup — ежедневная репликация в 2 дата-центра.</p>
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-4">
          <InfoGrid items={[
            { label: "Контрагент", value: "ED ART · ИНН 0000000000" },
            { label: "Сумма", value: "24 900 ₽" },
            { label: "Срок действия КП", value: "до 15.07.2026" },
            { label: "Менеджер", value: "Алексей" },
          ]} />
        </div>
        <div className="flex gap-2">
          <Btn v="green" onClick={() => openModal("Согласовать КП")}>Согласовать КП</Btn>
          <Btn v="default" onClick={() => openModal("Задать вопрос по КП")}>Задать вопрос по КП</Btn>
          <Btn v="ghost" sz="sm" onClick={() => openModal("Скачать КП PDF")}><Download size={13} /> Скачать КП PDF</Btn>
        </div>
      </Card>
    </div>
  );
}

function OrdersScreen({ openDiscussion }: { openDiscussion: (r: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Всего в аренде" value="4" extra={<Badge v="green">активно</Badge>} />
        <Metric label="Ежемесячно" value="35 400 ₽" extra={<p className="text-xs text-slate-500">по активным ресурсам</p>} />
        <Metric label="Оплачено до" value="01.07" extra={<Badge v="amber">продление</Badge>} />
        <Metric label="Заявки по аренде" value="2" extra={<Badge v="blue">в работе</Badge>} />
      </div>
      <Card cls="p-5">
        <SH title="Аренда ресурсов"
          sub="Все арендованные ресурсы, стоимость, срок, статус оплаты и быстрые действия."
          action={<Btn v="green" sz="sm">Продлить все</Btn>} />
        <Table heads={["Ресурс", "Параметры", "Стоимость", "Оплачено до", "Статус", ""]} rows={[
          [<div><p className="font-semibold text-slate-800">VPS для 1С <Mono>#SRV-247090</Mono></p><p className="text-xs text-slate-400">Москва · Windows Server · <Mono>10.10.100.12</Mono></p></div>,
            "6 vCPU · 16 GB · 250 GB SSD", "12 900 ₽/мес", "01.07.2026", <Badge v="amber">продлить: 6 дней</Badge>,
            <Btn v="green" sz="sm">Продлить</Btn>],
          [<div><p className="font-semibold text-slate-800">Резервное копирование 1С</p><p className="text-xs text-slate-400">3 базы · ежедневный backup · 30 дней</p></div>,
            "500 GB хранилище", "4 500 ₽/мес", "01.08.2026", <Badge v="green">активно</Badge>,
            <Btn v="default" sz="sm" onClick={() => openModal("Открыть КП")}>Открыть КП</Btn>],
          [<div><p className="font-semibold text-slate-800">Лицензии / доступы 1С</p><p className="text-xs text-slate-400">10 кл. лицензий · 2 конфигурации</p></div>,
            "Бухгалтерия + УНФ", "15 000 ₽/мес", "01.08.2026", <Badge v="green">активно</Badge>,
            <Btn v="default" sz="sm" onClick={() => openModal("Открыть КП")}>Открыть КП</Btn>],
          [<div><p className="font-semibold text-slate-800">Облачное хранилище</p><p className="text-xs text-slate-400">для обмена файлами с поддержкой</p></div>,
            "200 GB", "3 000 ₽/мес", "15.07.2026", <Badge v="blue">активно</Badge>,
            <Btn v="default" sz="sm" onClick={() => openModal("Открыть КП")}>Открыть КП</Btn>],
        ]} />
      </Card>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card cls="p-5">
          <SH title="Заказать новый ресурс" />
          <div className="space-y-3">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Что нужно</span>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option>Арендовать сервер для 1С</option>
                <option>Увеличить текущий сервер</option>
                <option>Заказать резервное копирование</option>
                <option>Арендовать лицензии / доступы</option>
                <option>Заказать оборудование</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Тариф</span>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                  <option>Бизнес · 6 vCPU / 16 GB</option>
                  <option>Старт · 4 vCPU / 8 GB</option>
                  <option>Проф · 8 vCPU / 32 GB</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Локация</span>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                  <option>Москва</option>
                  <option>Санкт-Петербург</option>
                  <option>Не важно</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Комментарий</span>
              <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Опишите задачу, количество пользователей, базы 1С, сроки..." />
            </label>
            <Btn v="primary" full>Отправить заявку</Btn>
          </div>
        </Card>
        <Card cls="p-5">
          <SH title="Активные заявки" />
          <div className="grid grid-cols-2 gap-2">
            {[
              { lane: "Новый", items: ["Заказ сервера #9001"] },
              { lane: "Согласование", items: ["КП на оборудование #8990"] },
              { lane: "В работе", items: ["Перенос базы 1С #8988"] },
              { lane: "Готово", items: ["Расходники #8975"] },
            ].map(col => (
              <div key={col.lane} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">{col.lane}</p>
                {col.items.map(it => (
                  <div key={it} className="bg-white rounded-lg border border-slate-200 p-2.5 text-xs font-medium text-slate-700">{it}</div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ShipmentsScreen() {
  type OrderLine = {
    type: "Товар" | "Услуга";
    name: string;
    code: string;
    qty: string;
    price: string;
    sum: string;
    status: string;
  };
  type OrderRecord = {
    id: string;
    title: string;
    note: string;
    counterparty: string;
    status: string;
    badge: BV;
    expected: string;
    amount: string;
    payment: string;
    invoice: string;
    invoiceNo: string;
    invoiceDate: string;
    delivery: string;
    address: string;
    track: string;
    manager: string;
    lines: OrderLine[];
    timeline: { date: string; text: string }[];
  };

  const orders: OrderRecord[] = [
    {
      id: "#9012",
      title: "Кассовый принтер и настройка",
      note: "Доставка оборудования + настройка на месте",
      counterparty: "ED ART",
      status: "В пути",
      badge: "blue",
      expected: "29.06.2026",
      amount: "22 900 ₽",
      payment: "Оплачен картой",
      invoice: "Счёт №8997 от 24.06.2026",
      invoiceNo: "Счёт №8997",
      invoiceDate: "24.06.2026",
      delivery: "CDEK",
      address: "Москва, ул. Примерная, 12, офис 4",
      track: "CDEK-9012-4477",
      manager: "Алексей Петров",
      lines: [
        { type: "Товар", name: "Кассовый принтер АТОЛ RP-326", code: "ATOL-RP326", qty: "1 шт.", price: "18 500 ₽", sum: "18 500 ₽", status: "Отгружен" },
        { type: "Услуга", name: "Настройка печати чеков и тестовая печать", code: "SERVICE-SETUP", qty: "1 усл.", price: "3 500 ₽", sum: "3 500 ₽", status: "Запланирована" },
        { type: "Товар", name: "Кабель USB и расходная лента", code: "KIT-USB-TAPE", qty: "1 компл.", price: "900 ₽", sum: "900 ₽", status: "Отгружен" },
      ],
      timeline: [
        { date: "24.06.2026 — Заказ оформлен", text: "Заказ принят в обработку, счет сформирован автоматически." },
        { date: "24.06.2026 — Оплата получена", text: "Платеж привязан к заказу и счету №8997." },
        { date: "25.06.2026 — Сборка", text: "Оборудование подготовлено и проверено инженером." },
        { date: "26.06.2026 — Отгрузка", text: "Передан в CDEK, присвоен трек-номер." },
      ],
    },
    {
      id: "#9008",
      title: "Сканеры штрихкода для склада",
      note: "Готов к выдаче в офисе, документы доступны",
      counterparty: "ED ART",
      status: "Готов к выдаче",
      badge: "green",
      expected: "сегодня",
      amount: "16 800 ₽",
      payment: "Оплачен по счету",
      invoice: "Счёт №8988 от 22.06.2026",
      invoiceNo: "Счёт №8988",
      invoiceDate: "22.06.2026",
      delivery: "Самовывоз",
      address: "Пункт выдачи: офис компании",
      track: "—",
      manager: "Алексей Петров",
      lines: [
        { type: "Товар", name: "Сканер штрихкода Mertech CL-2210", code: "MERTECH-CL2210", qty: "2 шт.", price: "7 900 ₽", sum: "15 800 ₽", status: "Готово" },
        { type: "Услуга", name: "Проверка подключения к 1С Розница", code: "SERVICE-1C-CHECK", qty: "1 усл.", price: "1 000 ₽", sum: "1 000 ₽", status: "Готово" },
      ],
      timeline: [
        { date: "22.06.2026 — Заказ создан", text: "Сформирован по заявке клиента." },
        { date: "23.06.2026 — Оплачен", text: "Платеж поступил на расчетный счет." },
        { date: "24.06.2026 — Готов к выдаче", text: "Оборудование ожидает клиента в офисе." },
      ],
    },
    {
      id: "#8997",
      title: "Расходные материалы",
      note: "Ожидаем оплату, товары зарезервированы",
      counterparty: "Retail Group",
      status: "Ожидает оплаты",
      badge: "amber",
      expected: "после оплаты",
      amount: "6 800 ₽",
      payment: "Ожидает оплаты",
      invoice: "Счёт №8977 от 20.06.2026",
      invoiceNo: "Счёт №8977",
      invoiceDate: "20.06.2026",
      delivery: "Доставка курьером",
      address: "Новосибирск, ул. Логистическая, 8",
      track: "будет после оплаты",
      manager: "Мария Иванова",
      lines: [
        { type: "Товар", name: "Чековая лента 57 мм", code: "TAPE-57", qty: "20 шт.", price: "140 ₽", sum: "2 800 ₽", status: "Резерв" },
        { type: "Товар", name: "Картридж для принтера этикеток", code: "LABEL-CART", qty: "4 шт.", price: "1 000 ₽", sum: "4 000 ₽", status: "Резерв" },
      ],
      timeline: [
        { date: "20.06.2026 — Заказ создан", text: "Товары зарезервированы на складе." },
        { date: "20.06.2026 — Счет выставлен", text: "Ожидаем оплату для передачи в сборку." },
      ],
    },
    {
      id: "#8985",
      title: "Серверная память и работы",
      note: "Заказ закрыт, документы доступны в кабинете",
      counterparty: "Плазма-Сервис",
      status: "Доставлен",
      badge: "gray",
      expected: "10.06.2026",
      amount: "41 500 ₽",
      payment: "Оплачен",
      invoice: "Счёт №8920 от 06.06.2026",
      invoiceNo: "Счёт №8920",
      invoiceDate: "06.06.2026",
      delivery: "Деловые линии",
      address: "Санкт-Петербург, пр. Технический, 4",
      track: "DL-8985-01",
      manager: "Алексей Петров",
      lines: [
        { type: "Товар", name: "Серверная память DDR4 ECC 32 GB", code: "RAM-ECC-32", qty: "2 шт.", price: "18 500 ₽", sum: "37 000 ₽", status: "Доставлено" },
        { type: "Услуга", name: "Диагностика сервера перед заменой", code: "SERVICE-DIAG", qty: "1 усл.", price: "4 500 ₽", sum: "4 500 ₽", status: "Выполнено" },
      ],
      timeline: [
        { date: "06.06.2026 — Заказ создан", text: "Подготовлена спецификация и счет." },
        { date: "07.06.2026 — Оплата", text: "Оплата поступила." },
        { date: "10.06.2026 — Доставлен", text: "Закрывающие документы доступны в кабинете." },
      ],
    },
  ];

  const [activeId, setActiveId] = useState(orders[0].id);
  const [notice, setNotice] = useState("");
  const active = orders.find(o => o.id === activeId) || orders[0];
  const rowsTotal = active.lines.reduce((acc, line) => acc + Number(line.sum.replace(/[^0-9]/g, "")), 0).toLocaleString("ru-RU") + " ₽";

  const openAction = (title: string) => {
    window.dispatchEvent(new CustomEvent("lk:prototype-action", { detail: { title } }));
  };
  const mark = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2600);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 xl:h-[calc(100vh-116px)] xl:min-h-0">
      <Card cls="xl:col-span-2 p-5 xl:h-full xl:min-h-0 flex flex-col overflow-hidden overscroll-contain">
        <div className="shrink-0">
          <SH title="Заказы и отгрузки"
            sub="Нажмите на заказ, чтобы открыть документ, состав товаров/услуг, оплату, доставку и действия." />
        </div>
        <div className="space-y-2 xl:flex-1 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-1 sidebar-scrollbar-hidden">
          {orders.map(order => (
            <button key={order.id} type="button" onClick={() => setActiveId(order.id)}
              className={`w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer ${active.id === order.id ? "border-slate-900 ring-1 ring-slate-900 bg-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] leading-tight font-bold text-slate-900">{order.id}</p>
                  <p className="text-[11px] leading-tight text-slate-500 mt-1 truncate">{order.note}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] leading-none text-slate-500">
                    <span>{order.counterparty}</span>
                    <span>·</span>
                    <span>{order.amount}</span>
                    <span>·</span>
                    <span className="whitespace-nowrap">{order.invoiceNo}</span>
                    <span className="whitespace-nowrap text-slate-400">от {order.invoiceDate}</span>
                  </div>
                </div>
                <Badge v={order.badge}>{order.status}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-[11px] leading-tight text-slate-500">
                <span className="flex items-center gap-1 flex-wrap"><b className="text-slate-700">Оплата:</b> {order.payment} {order.payment.includes("Ожидает") && <span className="ml-1 text-[10px] font-bold text-emerald-700">Оплатить</span>}</span>
                <span><b className="text-slate-700">Доставка:</b> {order.delivery}</span>
                <span><b className="text-slate-700">Дата:</b> {order.expected}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 shrink-0">
          <Btn v="green" sz="sm" onClick={() => openAction("Заказать товар")}>Новый заказ</Btn>
          <Btn v="default" sz="sm" onClick={() => openAction("Запросить КП по товарам и услугам")}>Запросить КП</Btn>
        </div>
      </Card>

      <Card cls="xl:col-span-3 overflow-hidden xl:h-full xl:min-h-0 flex flex-col overscroll-contain">
        <div className="p-5 border-b border-slate-100 shrink-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Заказ {active.id}</h2>
              <p className="text-xs text-slate-500 mt-1">{active.title}</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge v={active.badge}>{active.status}</Badge>
              <Badge v={active.payment.includes("Ожидает") ? "amber" : "green"}>{active.payment}</Badge>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5 xl:flex-1 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-6 sidebar-scrollbar-hidden">
          {notice && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 size={16} /> {notice}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <InfoGrid compact items={[
                { label: "Контрагент", value: active.counterparty },
                { label: "Сумма", value: active.amount },
                { label: "Счёт", value: <span className="inline-flex flex-wrap items-baseline gap-x-1.5 text-[10.5px] leading-tight"><span className="whitespace-nowrap">{active.invoiceNo}</span><span className="whitespace-nowrap text-slate-500">от {active.invoiceDate}</span></span> },
                { label: "Менеджер", value: active.manager },
              ]} />
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <InfoGrid compact items={[
                { label: "Доставка", value: active.delivery },
                { label: "Трек-номер", value: active.track === "—" ? "Не требуется" : <span className="inline-flex items-center gap-2">{active.track} <CopyButton value={active.track} label="" /></span> },
                { label: "Ожидаемая дата", value: active.expected },
                { label: "Адрес", value: active.address },
              ]} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Состав документа</h3>
                <p className="text-xs text-slate-500">Полный список товаров и услуг внутри заказа.</p>
              </div>
              <Badge v="gray">Итого по строкам: {rowsTotal}</Badge>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm min-w-[680px]">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    {["Номенклатура", "Код", "Кол-во", "Цена", "Сумма", "Статус"].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 py-2.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {active.lines.map((line, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-semibold text-slate-800">{line.name}</td>
                      <td className="py-3 px-3"><Mono>{line.code}</Mono></td>
                      <td className="py-3 px-3 text-slate-600">{line.qty}</td>
                      <td className="py-3 px-3 text-slate-600">{line.price}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{line.sum}</td>
                      <td className="py-3 px-3 text-slate-600">{line.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 mb-3">История заказа</h3>
              <div className="rounded-xl border border-slate-200 p-4 bg-white">
                {active.timeline.map((event, i) => (
                  <TEvent key={i} date={event.date} text={event.text} last={i === active.timeline.length - 1} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 mb-3">Действия по заказу</h3>
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Счёт и оплата</p>
                  <div className="flex flex-wrap gap-2">
                    <Btn v="green" sz="sm" onClick={() => openAction(`Оплатить заказ ${active.id}`)}><CreditCard size={13} /> Оплатить</Btn>
                    <Btn v="default" sz="sm" onClick={() => mark(`Счёт по заказу ${active.id} скачан`) }><Download size={13} /> Скачать счёт</Btn>
                    <Btn v="default" sz="sm" onClick={() => openAction(`Счет на оплату по заказу ${active.id}`)}>Сформировать счёт</Btn>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Документы</p>
                  <div className="flex flex-wrap gap-2">
                    <Btn v="default" sz="sm" onClick={() => mark(`УПД по заказу ${active.id} скачан`) }><Download size={13} /> Скачать УПД</Btn>
                    <Btn v="default" sz="sm" onClick={() => mark(`Накладная по заказу ${active.id} скачана`) }><Download size={13} /> Накладная</Btn>
                    <Btn v="default" sz="sm" onClick={() => openAction(`Отправить документы по заказу ${active.id}`)}>На email</Btn>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Логистика</p>
                  <div className="flex flex-wrap gap-2">
                    <Btn v="blue" sz="sm" onClick={() => active.track === "будет после оплаты" || active.track === "—" ? mark("Трек-номер пока не назначен") : mark(`Открыт трек ${active.track}`)}>Отследить отгрузку</Btn>
                    <Btn v="default" sz="sm" onClick={() => openAction(`Изменить адрес доставки по заказу ${active.id}`)}>Изменить адрес</Btn>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Управление</p>
                  <div className="flex flex-wrap gap-2">
                    <Btn v="default" sz="sm" onClick={() => openAction(`Повторить заказ ${active.id}`)}><RefreshCw size={13} /> Повторить заказ</Btn>
                    <Btn v="danger" sz="sm" onClick={() => mark(`Запрос на отмену заказа ${active.id} отправлен менеджеру`) }><X size={13} /> Отменить заказ</Btn>
                    <Btn v="default" sz="sm" onClick={() => openAction(`Создать обращение по заказу ${active.id}`)}><MessageSquare size={13} /> Создать обращение</Btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PurchaseHistoryScreen() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Покупок всего" value="18" extra={<p className="text-xs text-slate-500">за 12 месяцев</p>} />
        <Metric label="Повторяемые товары" value="5" extra={<Badge v="blue">расходники</Badge>} />
        <Metric label="Последняя покупка" value="26.06" extra={<p className="text-xs text-slate-500">кассовый принтер</p>} />
        <Metric label="Документы" value="18 / 18" extra={<Badge v="green">получены</Badge>} />
      </div>
      <Card cls="p-5">
        <SH title="История покупок" sub="Все покупки услуг и физических товаров по выбранному контрагенту." />
        <Table heads={["Дата", "Покупка", "Тип", "Сумма", "Статус", ""]} rows={[
          ["26.06.2026", "Кассовый принтер", "Товар", "18 500 ₽", <Badge v="blue">в пути</Badge>, <Btn v="default" sz="sm">Повторить</Btn>],
          ["20.06.2026", "Чековая лента и картриджи", "Товар", "6 800 ₽", <Badge v="green">доставлено</Badge>, <Btn v="default" sz="sm">Повторить</Btn>],
          ["15.06.2026", "Доработка печатной формы", "Услуга", "12 000 ₽", <Badge v="green">выполнено</Badge>, <Btn v="ghost" sz="sm">Акт</Btn>],
          ["01.06.2026", "Абонентское обслуживание 1С", "Услуга", "15 000 ₽", <Badge v="green">оплачено</Badge>, <Btn v="ghost" sz="sm">Документы</Btn>],
        ]} />
      </Card>
    </div>
  );
}

function NotificationsScreen() {
  const notifs = [
    { title: "Счёт №237 ожидает оплату", sub: "Аренда VPS · оплатить до 01.07.2026", v: "amber" as BV, label: "важно", messages: ["Система: счёт выставлен и ожидает оплаты.", "Менеджер: можно оплатить картой или запросить счёт для юрлица."] },
    { title: "Проект «Автоматизация отдела продаж» перешёл на тестирование", sub: "Нужно согласовать сценарии и назначить ответственного.", v: "blue" as BV, label: "проект", messages: ["Менеджер: этап тестирования открыт.", "Клиент: назначим ответственного сегодня."] },
    { title: "Обращение #1042 обновлено инженером", sub: "Добавлен комментарий и приложены рекомендации.", v: "green" as BV, label: "обращение", messages: ["Инженер Иван: добавил рекомендации по обмену.", "AI: похожая статья — проверка авторизации API."] },
    { title: "Заказ #9012 отгружен", sub: "Кассовый принтер отправлен клиенту.", v: "green" as BV, label: "логистика", messages: ["Логистика: заказ передан в CDEK.", "Система: трек-номер CDEK-9012."] },
    { title: "Backup 1С ЗУП требует проверки", sub: "Последний успешный backup: более 3 суток назад.", v: "red" as BV, label: "инфраструктура", messages: ["Мониторинг: backup не подтвердился.", "Инженер Сергей: запущу ручную проверку и сообщу результат."] },
  ];
  const [active, setActive] = useState(0);
  const current = notifs[active];
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
      <Card cls="xl:col-span-2 p-5">
        <SH title="Уведомления" sub="Нажмите на уведомление, чтобы раскрыть его как чат/ленту." action={<Btn v="ghost" sz="sm">Отметить все прочитанными</Btn>} />
        <div className="space-y-2">
          {notifs.map((n, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`w-full text-left flex items-start justify-between gap-4 p-3.5 rounded-lg border bg-white transition-colors cursor-pointer ${active === i ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-200 hover:bg-slate-50/50"}`}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{n.sub}</p>
              </div>
              <Badge v={n.v} sm>{n.label}</Badge>
            </button>
          ))}
        </div>
      </Card>
      <Card cls="xl:col-span-3 p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{current.title}</h2>
            <p className="text-sm text-slate-500 mt-1">{current.sub}</p>
          </div>
          <Badge v={current.v}>{current.label}</Badge>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 mb-4 flex flex-col gap-3 min-h-[220px]">
          {current.messages.map((m, i) => (
            <ChatMsg key={i} from={i % 2 === 0 ? "Система / менеджер" : "Клиент"} text={m} me={i % 2 === 1} />
          ))}
        </div>
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Ответить в уведомлении</span>
          <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Напишите комментарий или вопрос менеджеру..." />
        </label>
        <div className="flex gap-2 mt-4 justify-end">
          <Btn v="default">Создать обращение</Btn>
          <Btn v="green">Отправить ответ</Btn>
        </div>
      </Card>
    </div>
  );
}

function BonusesScreen({ openModal }: { openModal: () => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Бонусный баланс" value="4 800" extra={<Badge v="green">активно</Badge>} />
        <Metric label="Можно списать" value="3 000" extra={<p className="text-xs text-slate-500">на ближайший счёт</p>} />
        <Metric label="Начислено за июнь" value="1 200" extra={<Badge v="blue">бонусных ₽</Badge>} />
        <Metric label="Сгорит" value="0" extra={<Badge v="green">всё активно</Badge>} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card cls="p-5">
          <SH title="Бонусная программа" />
          <DocRow title="Доступно к списанию" sub="На ближайший счёт или заказ услуги"
            action={<Btn v="green" sz="sm" onClick={openModal}>Списать бонусы</Btn>} />
          <DocRow title="Правила начисления" sub="За оплаты, акции, рекомендации и кампании"
            action={<Btn v="ghost" sz="sm">Открыть</Btn>} />
          <div className="mt-4">
            <Table compact heads={["Дата", "Операция", "Сумма", "Статус"]} rows={[
              ["25.06.2026", "Оплата счёта №233", "+500", <Badge v="green">начислено</Badge>],
              ["20.06.2026", "Акция «Сервер лета»", "+700", <Badge v="green">начислено</Badge>],
              ["11.06.2026", "Списание на аудит 1С", "−1 000", <Badge v="blue">использовано</Badge>],
              ["01.06.2026", "Оплата абонентки", "+500", <Badge v="green">начислено</Badge>],
            ]} />
          </div>
        </Card>
        <Card cls="p-5">
          <SH title="Сертификат / промокод" sub="Одна строка для ввода кода без лишних полей." />
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mb-4">
            <p className="text-sm font-bold text-blue-900">Подарочный сертификат</p>
            <p className="text-sm text-blue-700 mt-1">Введите код сертификата или промокод, чтобы применить скидку или бонус.</p>
          </div>
          <label className="block mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Код сертификата / промокод</span>
            <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Например: BONUS-2026" />
          </label>
          <Btn v="green" full onClick={openModal}>Применить код сертификата</Btn>
        </Card>
        <Card cls="p-5">
          <SH title="Списать бонусы" />
          <div className="space-y-4">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Куда списать</span>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option>Счёт №237 · продление VPS</option>
                <option>Аудит 1С</option>
                <option>Абонентское обслуживание</option>
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Сумма списания</span>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" defaultValue="3 000" />
            </label>
            <Btn v="green" full onClick={openModal}>Применить бонусы</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ReferralScreen() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Реферальный код" value="EDART2026" extra={<p className="text-xs text-slate-500">можно делиться</p>} />
        <Metric label="Приглашено клиентов" value="3" extra={<Badge v="blue">2 активны</Badge>} />
        <Metric label="Ожидает бонуса" value="1" extra={<Badge v="amber">после первой оплаты</Badge>} />
        <Metric label="Всего начислено" value="6 000 ₽" extra={<p className="text-xs text-slate-500">за рекомендации</p>} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card cls="p-5">
          <SH title="Реферальная программа" sub="Пригласите компанию и получите бонусы после её первой оплаты." />
          <DocRow title="Ваша реферальная ссылка" sub="Скопируйте и поделитесь с коллегами"
            action={<Btn v="default" sz="sm"><Copy size={13} /> Скопировать</Btn>} />
          <DocRow title="Ваш код: EDART2026" sub="Партнёры вводят код при регистрации"
            action={<Btn v="blue" sz="sm">Поделиться</Btn>} />
          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Пригласить компанию</span>
              <div className="flex gap-2">
                <input className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Email или телефон" />
                <Btn v="green">Отправить</Btn>
              </div>
            </label>
          </div>
        </Card>
        <Card cls="p-5">
          <SH title="Приглашённые клиенты" />
          <Table heads={["Компания", "Статус", "Бонус", "Этап"]} rows={[
            ["ООО Альфа", <Badge v="green">активный клиент</Badge>, "2 000 ₽", "оплачено"],
            ["ООО Бета", <Badge v="blue">лид</Badge>, "0 ₽", "в работе"],
            ["ООО Гамма", <Badge v="amber">ожидание</Badge>, "0 ₽", "ожидает первой оплаты"],
          ]} />
        </Card>
      </div>
    </div>
  );
}

function ServicesScreen({ openModal }: { openModal: () => void }) {
  const services = [
    { title: "Сопровождение 1С", sub: "Обновления, консультации, ошибки, доработки.", badge: <Badge v="green">услуга</Badge> },
    { title: "Абонентское обслуживание 1С", sub: "Регулярная поддержка, часы, SLA и ответственные.", badge: <Badge v="blue">по договору</Badge> },
    { title: "Аренда серверов", sub: "Серверы для 1С, backup, перенос баз, сопровождение.", badge: <Badge v="blue">инфраструктура</Badge> },
    { title: "Лицензии 1С", sub: "Конфигурации, клиентские лицензии, общий пул пользователей.", badge: <Badge v="green">активно</Badge> },
    { title: "Доработка конфигурации", sub: "Отчёты, обработки, печатные формы, обмены.", badge: <Badge v="amber">оценка</Badge> },
    { title: "Автоматизация бизнеса", sub: "Регламенты, процессы, интеграции, отчёты.", badge: <Badge v="purple">проект</Badge> },
    { title: "Услуги консультантов", sub: "Бухгалтер, методолог, специалист по учёту.", badge: <Badge v="blue">по часам</Badge> },
    { title: "Обслуживание касс", sub: "ККТ, ОФД, ЭДО, настройка и сопровождение.", badge: <Badge v="gray">доп. услуга</Badge> },
  ];

  const products = [
    { title: "Кассовое оборудование", sub: "ККТ, фискальные накопители, терминалы, ОФД.", price: "от 18 500 ₽", status: "в наличии" },
    { title: "Сканеры штрихкода", sub: "Проводные и беспроводные сканеры для склада и розницы.", price: "от 4 900 ₽", status: "в наличии" },
    { title: "Принтеры и МФУ", sub: "Офисная печать, этикетки, чековые принтеры.", price: "по запросу", status: "под заказ" },
    { title: "Расходные материалы", sub: "Картриджи, чековая лента, этикетки, комплектующие.", price: "от 350 ₽", status: "в наличии" },
    { title: "Серверное оборудование", sub: "Серверы, память, диски, сетевое оборудование.", price: "по КП", status: "под заказ" },
    { title: "Рабочие места", sub: "ПК, мониторы, периферия, настройка под 1С.", price: "по КП", status: "под заказ" },
  ];

  return (
    <div className="space-y-5">
      <Card cls="p-5">
        <SH title="Каталог услуг и товаров"
          sub="Услуги и физические товары разделены: услуги оформляются как заявка, товары — как заказ с оплатой, сборкой, отгрузкой и документами." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <Metric label="Услуги" value="8" extra={<p className="text-xs text-slate-500">поддержка, 1С, серверы</p>} />
          <Metric label="Товары" value="6" extra={<p className="text-xs text-slate-500">оборудование и расходники</p>} />
          <Metric label="Заказы в работе" value="4" extra={<Badge v="blue">есть отгрузки</Badge>} />
          <Metric label="Повторить заказ" value="1 клик" extra={<p className="text-xs text-slate-500">для расходников</p>} />
        </div>
      </Card>

      <Card cls="p-5">
        <SH title="Услуги" sub="Заявки на услуги передаются менеджеру и в 1С." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {services.map((s, i) => (
            <div key={i} className="bg-slate-50 rounded-lg border border-slate-100 p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-1">{s.title}</h3>
              <p className="text-xs text-slate-500 mb-3 min-h-[42px]">{s.sub}</p>
              <div className="flex items-center justify-between gap-2">
                {s.badge}
                <Btn v="primary" sz="sm" onClick={openModal}>Заказать услугу</Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card cls="p-5">
        <SH title="Товары" sub="Физические товары проходят цикл: заказ → счёт → оплата → сборка → отгрузка → доставка → документы." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((p, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm font-bold text-slate-800">{p.title}</h3>
                <Badge v={p.status === "в наличии" ? "green" : "amber"} sm>{p.status}</Badge>
              </div>
              <p className="text-xs text-slate-500 mb-3">{p.sub}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-900">{p.price}</span>
                <div className="flex gap-1.5">
                  <Btn v="default" sz="sm">В КП</Btn>
                  <Btn v="green" sz="sm">Заказать товар</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function UsersScreen() {
  const users = [
    { name: "Мария Акопян", email: "maria@example.ru", role: "Руководитель", bases: "2", status: <Badge v="green">активен</Badge>, phone: "+7 999 111-22-33", login: "maria@edart.local" },
    { name: "Бухгалтерия", email: "buh@example.ru", role: "Бухгалтер", bases: "1", status: <Badge v="green">активен</Badge>, phone: "+7 999 222-33-44", login: "buh@edart.local" },
    { name: "Соболев Василий", email: "tech@example.ru", role: "Техспециалист", bases: "3", status: <Badge v="blue">приглашён</Badge>, phone: "+7 999 333-44-55", login: "tech@edart.local" },
    { name: "Иван Петров", email: "ivan@example.ru", role: "Пользователь", bases: "1", status: <Badge v="gray">неактивен</Badge>, phone: "+7 999 000-00-00", login: "ivan@edart.local" },
  ];
  const [selected, setSelected] = useState(users[0]);
  const [password, setPassword] = useState("EdArt-2026!");
  const [repeat, setRepeat] = useState("EdArt-2026!");
  const passwordOk = password.length >= 8 && password === repeat;
  const generatePassword = () => {
    const value = `Ed${Math.random().toString(36).slice(2, 7)}-${Math.floor(1000 + Math.random() * 9000)}!`;
    setPassword(value);
    setRepeat(value);
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card cls="p-5">
          <SH title="Пользователи и роли" sub="Клик по строке открывает карточку пользователя."
            action={<Btn v="green" sz="sm"><UserPlus size={14} /> Добавить пользователя</Btn>} />
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 mb-5">
            {[
              { role: "Администратор", desc: "Все разделы" },
              { role: "Руководитель", desc: "SLA, счета, проекты" },
              { role: "Бухгалтер", desc: "Счета, акты, оплаты" },
              { role: "Техспециалист", desc: "Тикеты, серверы, базы" },
              { role: "Пользователь", desc: "Свои обращения" },
            ].map(r => <div key={r.role} className="bg-slate-50 rounded-lg border border-slate-100 p-2.5"><p className="text-xs font-bold text-slate-800 mb-0.5">{r.role}</p><p className="text-[10px] text-slate-500">{r.desc}</p></div>)}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead><tr className="border-b border-slate-100"><th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">Пользователь</th><th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">Email</th><th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">Роль</th><th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">Базы</th><th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">Статус</th><th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2"></th></tr></thead>
              <tbody>{users.map(u => <tr key={u.email} onClick={() => { setSelected(u); setPassword("EdArt-2026!"); setRepeat("EdArt-2026!"); }} className={`border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${selected.email === u.email ? "bg-blue-50" : ""}`}><td className="py-3 pr-4 font-semibold text-slate-800">{u.name}</td><td className="py-3 pr-4"><Mono>{u.email}</Mono></td><td className="py-3 pr-4">{u.role}</td><td className="py-3 pr-4">{u.bases}</td><td className="py-3 pr-4">{u.status}</td><td className="py-3 pr-4"><Btn v="ghost" sz="sm">Открыть</Btn></td></tr>)}</tbody>
            </table>
          </div>
        </Card>

        <Card cls="p-5">
          <SH title="Карточка пользователя" sub="Карточка открывается по клику на строку." />
          <div className="grid grid-cols-2 gap-3 mb-4">
            <InfoGrid items={[{ label: "ФИО", value: selected.name }, { label: "Email", value: <Mono>{selected.email}</Mono> }, { label: "Телефон", value: selected.phone }, { label: "Роль", value: selected.role }]} />
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Доступы</h3>
            <div className="grid grid-cols-2 gap-2">
              {sectionAccess.map(s => <label key={s} className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" defaultChecked={s !== "Лицензии"} />{s}</label>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AccessValue label="Логин" value={selected.login} />
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Пароль</p>
              <div className="flex gap-2"><input className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} /><CopyButton value={password} label="" /></div>
            </div>
            <label className="block col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Повтор пароля</span>
              <input className={`${inputCls} ${passwordOk ? "border-emerald-200" : "border-red-200"}`} value={repeat} onChange={(e) => setRepeat(e.target.value)} />
              <p className={`text-xs mt-1 ${passwordOk ? "text-emerald-600" : "text-red-600"}`}>{passwordOk ? "Пароли совпадают, минимум 8 символов" : "Пароли не совпадают или меньше 8 символов"}</p>
            </label>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <Btn v="green">Сохранить пользователя</Btn>
            <Btn v="default" onClick={generatePassword}>Сгенерировать пароль</Btn>
            <Btn v="default">Сбросить пароль</Btn>
          </div>
        </Card>
      </div>
      <Card cls="p-5">
        <SH title="Матрица доступа" sub="Кто к каким базам, контрагентам и документам имеет доступ." />
        <Table heads={["Пользователь", "Контрагент", "1С Бухгалтерия", "1С УНФ", "Счета", "Договоры"]} rows={[
          ["Мария Акопян", "ED ART", <Badge v="green" sm>Администратор</Badge>, <Badge v="green" sm>Администратор</Badge>, "✓", "✓"],
          ["Бухгалтерия", "ED ART", <Badge v="blue" sm>Пользователь</Badge>, "—", "✓", "—"],
          ["Склад", "ED ART", "—", <Badge v="blue" sm>Пользователь</Badge>, "—", "—"],
          ["Соболев Василий", "ED ART", <Badge v="amber" sm>Просмотр</Badge>, <Badge v="amber" sm>Просмотр</Badge>, "—", "—"],
        ]} />
      </Card>
    </div>
  );
}

function KnowledgeScreen() {
  const articles = [
    { title: "Как подключиться к серверу 1С", tags: ["1С", "Доступ"], views: 124, text: "Скачайте RDP-файл с настройками, откройте его и введите логин/пароль из карточки доступа. Если подключение не проходит, создайте обращение." },
    { title: "Что делать, если не открывается база", tags: ["1С", "База"], views: 287, text: "Проверьте интернет, доступ к серверу и наличие свободных лицензий. Затем приложите скрин ошибки в обращение." },
    { title: "Как передать доступ инженеру", tags: ["Безопасность"], views: 98, text: "Передавайте коды удаленного доступа только через обращение в личном кабинете или согласованный канал связи." },
    { title: "Настройка backup для баз 1С", tags: ["Backup", "1С"], views: 156, text: "Backup должен выполняться ежедневно. В карточке базы смотрите дату последней копии и журнал backup." },
    { title: "Подключение кассового принтера", tags: ["Оборудование", "Кассы"], views: 73, text: "Уточните модель принтера, драйвер, порт подключения и приложите фото ошибки или чек диагностики." },
    { title: "ЭДО в 1С: первичная настройка", tags: ["1С", "ЭДО"], views: 201, text: "Подготовьте сертификат, данные оператора ЭДО и список организаций, для которых нужен обмен." },
  ];
  const [selected, setSelected] = useState(articles[0]);
  const [articleOpen, setArticleOpen] = useState(false);
  return (
    <div className="space-y-5">
      <Card cls="p-5">
        <SH title="База знаний" sub="Карточки кликабельные: открывают статью и действия." />
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Найти инструкцию или ошибку..." />
        </div>
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {["Все", "1С", "Серверы", "Кассы", "Интеграции", "Backup"].map(t => (
            <button key={t} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${t === "Все" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{t}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {articles.map((a, i) => (
            <button key={i} onClick={() => { setSelected(a); setArticleOpen(true); }} className={`text-left bg-slate-50 rounded-lg border p-4 hover:border-slate-300 transition-colors cursor-pointer ${selected.title === a.title ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-100"}`}>
              <h3 className="text-sm font-bold text-slate-800 mb-2">{a.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">{a.tags.map(t => <Badge key={t} v="gray" sm>{t}</Badge>)}</div>
                <span className="text-[10px] text-slate-400">{a.views} просмотров</span>
              </div>
            </button>
          ))}
        </div>
      </Card>
      {articleOpen && (
        <Overlay onClose={() => setArticleOpen(false)}>
          <Card cls="max-w-2xl w-full p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div><h2 className="text-xl font-bold text-slate-900">{selected.title}</h2><p className="text-sm text-slate-500 mt-1">Инструкция для клиента</p></div>
              <Btn v="ghost" sz="sm" onClick={() => setArticleOpen(false)}><X size={16} /></Btn>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 mb-4">{selected.text}</div>
            <div className="flex gap-2 flex-wrap justify-end">
              <CopyButton value={`https://lk.example.ru/kb/${selected.title}`} label="Скопировать ссылку" />
              <Btn v="default" onClick={() => window.dispatchEvent(new CustomEvent("lk:prototype-action", { detail: { title: "Создать обращение по статье базы знаний" } }))}>Создать обращение</Btn>
              <Btn v="green" onClick={() => setArticleOpen(false)}>Понятно</Btn>
            </div>
          </Card>
        </Overlay>
      )}
      <Card cls="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div><h2 className="text-lg font-bold text-slate-900">{selected.title}</h2><p className="text-sm text-slate-500 mt-1">Инструкция для клиента</p></div>
          <CopyButton value={`https://lk.example.ru/kb/${selected.title}`} label="Скопировать ссылку" />
        </div>
        <p className="text-sm text-slate-700 leading-relaxed mb-4">{selected.text}</p>
        <div className="flex gap-2 flex-wrap">
          <Btn v="green">Создать обращение</Btn>
          <Btn v="default">Открыть связанную услугу</Btn>
          <Btn v="ghost"><Copy size={13} /> Скопировать текст</Btn>
        </div>
      </Card>
    </div>
  );
}

function SettingsScreen() {
  return (
    <div className="space-y-4">
      <Card cls="p-5">
        <SH title="Настройки компании" sub="Профиль, уведомления, Telegram, юридические данные." />
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Компания</span>
            <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" defaultValue="ED ART" />
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">ИНН</span>
            <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" defaultValue="0000000000" />
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Email для счетов</span>
            <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" defaultValue="plasma@t-sk.ru" />
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Telegram уведомления</span>
            <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" defaultValue="Не подключено" />
          </label>
        </div>
        <div className="mt-4">
          <Btn v="primary">Сохранить</Btn>
        </div>
      </Card>
      <Card cls="p-5">
        <SH title="Уведомления" sub="Настройте, по каким событиям получать уведомления." />
        {[
          { label: "Обращения: новый ответ инженера", active: true },
          { label: "Счета: выставлен новый счёт", active: true },
          { label: "Аренда: напоминание о продлении", active: true },
          { label: "Проекты: смена этапа", active: false },
          { label: "Backup: ошибка или предупреждение", active: true },
        ].map((n, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <p className="text-sm text-slate-700">{n.label}</p>
            <div className={`w-10 h-6 rounded-full transition-colors cursor-pointer relative ${n.active ? "bg-emerald-500" : "bg-slate-200"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${n.active ? "left-5" : "left-1"}`} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const navGroups = [
  {
    label: "Кабинет",
    items: [
      { id: "dashboard" as Screen, label: "Главная", icon: <Home size={17} /> },
      { id: "counterparties" as Screen, label: "Контрагенты", icon: <Building2 size={17} /> },
      { id: "tickets" as Screen, label: "Обращения", icon: <MessageSquare size={17} />, badge: "4" },
      { id: "deals" as Screen, label: "Сделки и проекты", icon: <Briefcase size={17} /> },
      { id: "contracts" as Screen, label: "Договоры и SLA", icon: <FileText size={17} /> },
      { id: "billing" as Screen, label: "Счета и оплаты", icon: <CreditCard size={17} /> },
      { id: "documents" as Screen, label: "Акты и документы", icon: <FileCheck size={17} /> },
    ],
  },
  {
    label: "Продажи",
    items: [
      { id: "services" as Screen, label: "Каталог услуг и товаров", icon: <Activity size={17} /> },
      { id: "offers" as Screen, label: "Коммерческие предложения", icon: <FileSpreadsheet size={17} /> },
      { id: "shipments" as Screen, label: "Заказы и отгрузки", icon: <Truck size={17} /> },
      { id: "purchaseHistory" as Screen, label: "История покупок", icon: <Package size={17} /> },
    ],
  },
  {
    label: "Инфраструктура",
    items: [
      { id: "servers" as Screen, label: "Серверы и ресурсы", icon: <Server size={17} /> },
      { id: "bases1c" as Screen, label: "Базы 1С", icon: <Database size={17} /> },
      { id: "licenses" as Screen, label: "Лицензии 1С", icon: <Key size={17} /> },
      { id: "sessions" as Screen, label: "Сеансы 1С", icon: <Monitor size={17} /> },
      { id: "orders" as Screen, label: "Аренда ресурсов", icon: <ShoppingCart size={17} /> },
    ],
  },
  {
    label: "Программа",
    items: [
      { id: "notifications" as Screen, label: "Уведомления", icon: <Bell size={17} />, badge: "3" },
      { id: "bonuses" as Screen, label: "Бонусы", icon: <Gift size={17} /> },
      { id: "referral" as Screen, label: "Реферальная программа", icon: <UserPlus size={17} /> },
    ],
  },
  {
    label: "Компания",
    items: [
      { id: "users" as Screen, label: "Пользователи и роли", icon: <Users size={17} /> },
      { id: "knowledge" as Screen, label: "База знаний", icon: <BookOpen size={17} /> },
      { id: "settings" as Screen, label: "Настройки", icon: <Settings size={17} /> },
    ],
  },
];

function Sidebar({ current, onChange, cpName, cpInn, mobileOpen = false, onClose, onPaymentOpen }: {
  current: Screen; onChange: (s: Screen) => void; cpName: string; cpInn: string; mobileOpen?: boolean; onClose?: () => void; onPaymentOpen?: () => void;
}) {
  const [sidebarProgress, setSidebarProgress] = useState(0);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const sidebarProgressRef = useRef(0);
  const compact = sidebarProgress > 0.18;
  const hideStyle = {
    opacity: Math.max(0, 1 - sidebarProgress * 1.35),
    maxHeight: `${Math.max(0, 150 * (1 - sidebarProgress))}px`,
    transform: `translateY(${-8 * sidebarProgress}px)`,
    overflow: "hidden",
    transition: "opacity 220ms ease, max-height 260ms ease, transform 260ms ease, margin 260ms ease",
  } as React.CSSProperties;
  const compactPad = `${Math.round(16 - sidebarProgress * 6)}px`;
  const compactGap = `${Math.round(12 - sidebarProgress * 7)}px`;

  const setSmoothSidebarProgress = (next: number) => {
    const value = Math.min(1, Math.max(0, next));
    sidebarProgressRef.current = value;
    setSidebarProgress(value);
  };

  useEffect(() => {
    sidebarProgressRef.current = sidebarProgress;
  }, [sidebarProgress]);

  const scrollSidebarFromAnyPoint = (delta: number, preventDefault: () => void) => {
    const nav = navRef.current;
    const currentProgress = sidebarProgressRef.current;
    const navTop = nav?.scrollTop ?? 0;

    // Колесико должно работать с любого места левой колонки:
    // логотип, карточка клиента, баланс, пустые отступы и само меню.
    // Поэтому после сжатия карточек прокрутку меню выполняем вручную.
    if (delta > 0) {
      preventDefault();
      if (currentProgress < 1) {
        setSmoothSidebarProgress(currentProgress + Math.min(0.2, delta / 300));
        return;
      }
      if (nav) nav.scrollTop += delta;
      return;
    }

    if (delta < 0) {
      preventDefault();
      if (nav && navTop > 0) {
        nav.scrollTop += delta;
        return;
      }
      if (currentProgress > 0) {
        setSmoothSidebarProgress(currentProgress + Math.max(-0.2, delta / 300));
      }
    }
  };

  const handleSidebarWheel: React.WheelEventHandler<HTMLElement> = (e) => {
    scrollSidebarFromAnyPoint(e.deltaY, () => e.preventDefault());
  };

  const handleNavScroll: React.UIEventHandler<HTMLElement> = (e) => {
    const y = e.currentTarget.scrollTop;
    if (y > 6 && sidebarProgress < 1) {
      setSmoothSidebarProgress(1);
    }
  };

  useEffect(() => {
    const handlePageScroll = () => {
      // Если пользователь прокручивает основную страницу, левая колонка тоже должна перейти в компактный режим.
      if (window.scrollY > 20) setSmoothSidebarProgress(1);
      if (window.scrollY <= 2 && (navRef.current?.scrollTop ?? 0) <= 0) setSmoothSidebarProgress(0);
    };
    window.addEventListener("scroll", handlePageScroll, { passive: true });
    return () => window.removeEventListener("scroll", handlePageScroll);
  }, []);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleNativeWheel = (event: WheelEvent) => {
      scrollSidebarFromAnyPoint(event.deltaY, () => event.preventDefault());
    };

    // Нужен именно passive:false, иначе браузер не даст остановить общий скролл страницы.
    sidebar.addEventListener("wheel", handleNativeWheel, { passive: false, capture: true });
    return () => sidebar.removeEventListener("wheel", handleNativeWheel, { capture: true } as AddEventListenerOptions);
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className={`lk-sidebar-scroll sidebar-scrollbar-hidden select-none w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden fixed lg:sticky top-0 left-0 z-50 transform transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as any}
    >
      {/* Brand */}
      <div className="px-4 py-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => { onChange("dashboard"); onClose?.(); }} className="flex items-center gap-3 min-w-0 text-left rounded-lg hover:bg-slate-50 transition-colors p-1 -m-1 cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
              <span className="text-white font-extrabold text-sm">LK</span>
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-slate-900 truncate">maria@edart.local</p>
              <p className="text-xs text-slate-400">авторизованный пользователь</p>
            </div>
          </button>
          <button type="button" className="lg:hidden w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50" onClick={onClose} aria-label="Закрыть меню"><X size={17} /></button>
        </div>
      </div>

      {/* Profile: collapses smoothly when sidebar navigation scrolls */}
      <div className="sidebar-collapse-zone px-3 py-3 border-b border-slate-100 shrink-0">
        <div className="bg-slate-50 rounded-lg border border-slate-200 transition-all duration-300 ease-out overflow-hidden" style={{ padding: compactPad }}>
          <div className="flex items-center justify-between gap-2" style={{ marginBottom: compact ? 0 : compactGap, transition: "margin 260ms ease" }}>
            <div className="min-w-0">
              <p className="text-base font-bold text-slate-900 truncate">maria@edart.local</p>
              <p className="text-[11px] text-slate-400 truncate" style={{ opacity: compact ? 1 : 0, maxHeight: compact ? 18 : 0, overflow: "hidden", transition: "opacity 220ms ease, max-height 260ms ease" }}>
                текущий клиент
              </p>
            </div>
            {compact && <Badge v="green" sm>активен</Badge>}
          </div>

          <div style={hideStyle} aria-hidden={compact}>
            <p className="text-xs text-slate-500 mb-3">Контрагент: {cpName} · ИНН <Mono>{cpInn}</Mono></p>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>Менеджер</span><span className="font-semibold text-slate-700">Алексей</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
              <span>Инженер</span><span className="font-semibold text-slate-700">Иван</span>
            </div>
            <Badge v="green" dot>договор активен</Badge>
          </div>
        </div>
      </div>

      {/* Balance: collapses smoothly when sidebar navigation scrolls */}
      <div className="sidebar-collapse-zone px-3 py-3 border-b border-slate-100 shrink-0">
        <div
          className={`transition-all duration-300 ease-out overflow-hidden ${compact ? "bg-transparent border-transparent shadow-none" : "bg-slate-50 rounded-lg border border-slate-200"}`}
          style={{ padding: compact ? 0 : compactPad }}
        >
          <div style={hideStyle} aria-hidden={compact}>
            <p className="text-xs text-slate-400 mb-1.5">Баланс и часы</p>
            <p className="text-xl font-extrabold text-slate-900 mb-3">23 791 ₽</p>
          </div>
          <button
            className={`w-full bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all duration-300 cursor-pointer ${compact ? "py-3 px-3 shadow-sm" : "py-2.5"}`}
            onClick={() => onChange("billing")}
          >
            {compact ? "Пополнить / оплатить · 23 791 ₽" : "Пополнить / оплатить"}
          </button>
          <div style={hideStyle} aria-hidden={compact}>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
              <span>Остаток часов</span><span className="font-bold text-slate-700">12 из 20</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav ref={navRef} className="lk-sidebar-scroll flex-1 min-h-0 overflow-y-auto px-3 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" onScroll={handleNavScroll}>
        {navGroups.map(group => (
          <div key={group.label} className="mb-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 px-2 py-2.5">{group.label}</p>
            {group.items.map(item => {
              const isActive = current === item.id;
              return (
                <button key={item.id} onClick={() => {
                    onChange(item.id);
                    onClose?.();
                    const isMobileNav = typeof window !== "undefined" && window.innerWidth < 1024;
                    if (item.id === "billing" && isMobileNav) window.setTimeout(() => onPaymentOpen?.(), 120);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer mb-0.5 ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {"badge" in item && (
                    <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

// ─── Screen title map ─────────────────────────────────────────────────────────
const TITLES: Record<Screen, string> = {
  dashboard: "Главная", counterparties: "Контрагенты", tickets: "Обращения",
  deals: "Сделки и проекты", contracts: "Договоры и SLA", billing: "Счета и оплаты",
  documents: "Акты и документы", offers: "Коммерческие предложения",
  servers: "Серверы и ресурсы", bases1c: "Базы 1С", licenses: "Лицензии 1С",
  sessions: "Сеансы 1С", orders: "Аренда ресурсов", shipments: "Заказы и отгрузки",
  purchaseHistory: "История покупок", notifications: "Уведомления", bonuses: "Бонусы", referral: "Реферальная программа",
  services: "Каталог услуг и товаров", users: "Пользователи и роли", knowledge: "База знаний",
  settings: "Настройки",
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [modal, setModal] = useState<Modal>(null);
  const [discussionResource, setDiscussionResource] = useState("");
  const [genericActionTitle, setGenericActionTitle] = useState("Действие");
  const [cpName, setCpName] = useState("ED ART");
  const [cpInn, setCpInn] = useState("0000000000");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ title?: string }>;
      setGenericActionTitle(custom.detail?.title || "Действие");
      setModal("generic");
    };
    window.addEventListener("lk:prototype-action", handler as EventListener);
    return () => window.removeEventListener("lk:prototype-action", handler as EventListener);
  }, []);

  const openDiscussion = (r: string) => { setDiscussionResource(r); setModal("discussion"); };

  const renderScreen = () => {
    switch (screen) {
      case "dashboard": return <DashboardScreen nav={setScreen} openModal={(title) => { setGenericActionTitle(title); setModal("generic"); }} openDiscussion={openDiscussion} />;
      case "counterparties": return <CounterpartiesScreen onSelect={(n, i) => { setCpName(n); setCpInn(i); }} openModal={(title) => { setGenericActionTitle(title); setModal("generic"); }} />;
      case "tickets": return <TicketsScreen openModal={() => { setGenericActionTitle("Создать обращение"); setModal("generic"); }} openDiscussion={openDiscussion} />;
      case "deals": return <DealsScreen />;
      case "contracts": return <ContractsScreen />;
      case "billing": return <BillingScreen openModal={() => { setGenericActionTitle("Оплатить картой"); setModal("generic"); }} />;
      case "documents": return <DocumentsScreen openModal={(title) => { setGenericActionTitle(title); setModal("generic"); }} />;
      case "offers": return <OffersScreen openModal={(title) => { setGenericActionTitle(title); setModal("generic"); }} />;
      case "servers": return <ServersScreen openDiscussion={openDiscussion} />;
      case "bases1c": return <Bases1CScreen openDiscussion={openDiscussion} />;
      case "licenses": return <LicensesScreen openModal={() => { setGenericActionTitle("Изменить количество лицензий 1С"); setModal("generic"); }} />;
      case "sessions": return <SessionsScreen nav={setScreen} />;
      case "orders": return <OrdersScreen openDiscussion={openDiscussion} />;
      case "shipments": return <ShipmentsScreen />;
      case "purchaseHistory": return <PurchaseHistoryScreen />;
      case "notifications": return <NotificationsScreen />;
      case "bonuses": return <BonusesScreen openModal={() => { setGenericActionTitle("Списать бонусы"); setModal("generic"); }} />;
      case "referral": return <ReferralScreen />;
      case "services": return <ServicesScreen openModal={() => { setGenericActionTitle("Заказать услугу или товар"); setModal("generic"); }} />;
      case "users": return <UsersScreen />;
      case "knowledge": return <KnowledgeScreen />;
      case "settings": return <SettingsScreen />;
      default: return null;
    }
  };

  return (
    <>
      <style>{`
        .lk-sidebar-scroll {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .lk-sidebar-scroll::-webkit-scrollbar,
        .lk-sidebar-scroll *::-webkit-scrollbar {
          width: 0 !important;
          height: 0 !important;
          display: none !important;
          background: transparent !important;
        }
        aside.lk-sidebar-scroll {
          scrollbar-gutter: auto !important;
        }

        aside.lk-sidebar-scroll { width: 18rem !important; }
        aside.lk-sidebar-scroll button { font-size: 14px !important; line-height: 1.35 !important; }
        aside.lk-sidebar-scroll p, aside.lk-sidebar-scroll span { line-height: 1.45 !important; }
        aside.lk-sidebar-scroll .text-\[10px\] { font-size: 12px !important; }
        aside.lk-sidebar-scroll .text-xs { font-size: 13px !important; }
        aside.lk-sidebar-scroll .text-sm { font-size: 15px !important; }
        .lk-main-content :not(button):not(h1):not(h2):not(h3):not(h4).text-xs {
          font-size: 13px !important;
          line-height: 1.45 !important;
        }
        .lk-main-content :not(button):not(h1):not(h2):not(h3):not(h4).text-sm {
          font-size: 15px !important;
          line-height: 1.5 !important;
        }
        .lk-main-content table td,
        .lk-main-content table td *:not(button),
        .lk-main-content p:not([class*="text-3xl"]):not([class*="text-2xl"]):not([class*="text-xl"]),
        .lk-main-content li {
          font-size: 15px;
          line-height: 1.5;
        }
        @media (max-width: 767px) {
          .lk-main-content { padding: 16px !important; }
          .lk-main-content .grid { grid-template-columns: 1fr !important; }
          .mobile-dashboard-metrics { display: none !important; }
          .lk-main-content table { min-width: 640px; }
          .lk-main-content .text-3xl { font-size: 24px !important; }
          .lk-main-content .text-2xl { font-size: 22px !important; }
          .lk-main-content .text-xl { font-size: 18px !important; }
          .lk-main-content .text-lg { font-size: 17px !important; }
          header { padding-left: 16px !important; padding-right: 16px !important; }
          .lk-modal-scroll .grid { grid-template-columns: 1fr !important; }
          .lk-modal-scroll .col-span-2, .lk-modal-scroll .md\:col-span-2 { grid-column: span 1 / span 1 !important; }
        }
      `}</style>
      <div className="flex h-screen overflow-hidden bg-[#F0F4F8]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
      <Sidebar current={screen} onChange={setScreen} cpName={cpName} cpInn={cpInn} mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} onPaymentOpen={() => { setGenericActionTitle("Оплатить картой"); setModal("generic"); }} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <button type="button" onClick={() => setMobileMenuOpen(true)} className="lg:hidden mt-0.5 w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 flex items-center justify-center shrink-0 hover:bg-slate-50">
                <Menu size={18} />
              </button>
              <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-900 leading-tight">{TITLES[screen]}</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Все системы работают · UTC+3 · SLA под контролем</span>
              </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Btn v="green" sz="sm" onClick={() => { setGenericActionTitle("Создать обращение"); setModal("generic"); }}><Plus size={13} /> Создать обращение</Btn>
              <Btn v="blue" sz="sm" onClick={() => setScreen("services")}>Каталог услуг и товаров</Btn>
              <Btn v="default" sz="sm" onClick={() => { setGenericActionTitle("Счет на оплату"); setModal("generic"); }}>Запросить счёт</Btn>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="lk-main-content flex-1 p-6 overflow-y-auto text-[15px]">
          {renderScreen()}
        </main>
      </div>

      {/* Modals */}
      {modal === "ticket" && <GenericActionModal title="Создать обращение" onClose={() => setModal(null)} />}
      {modal === "payment" && <GenericActionModal title="Счет на оплату" onClose={() => setModal(null)} />}
      {modal === "discussion" && <DiscussionModal resource={discussionResource} onClose={() => setModal(null)} />}
      {modal === "generic" && <GenericActionModal title={genericActionTitle} onClose={() => setModal(null)} />}
      </div>
    </>
  );
}
