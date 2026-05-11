import { useState } from "react";

// ─── Utils ────────────────────────────────────────────────────────
const fmt = (n) => (n || 0).toLocaleString("ru-KZ") + " ₸";
const today = () => new Date().toLocaleDateString("ru-KZ");

// ─── Colors ───────────────────────────────────────────────────────
const C = {
  bg: "#0f0f14", card: "#1a1a22", card2: "#22222e",
  border: "rgba(255,255,255,0.07)", purple: "#7c6fff", green: "#3ecf8e",
  orange: "#ff9f43", red: "#ff6060", blue: "#54a0ff",
  text: "#f0f0f5", muted: "#888", dim: "#444",
};

// ─── Demo data ────────────────────────────────────────────────────
const INIT_CPS = [
  { id: 1, name: "ТОО «Ромашка»", bin: "123456789012", contact: "Айгуль Нурова", phone: "+7 701 111 22 33", email: "info@romashka.kz", address: "г. Алматы, ул. Абая 10" },
  { id: 2, name: "ИП Сейткали А.", bin: "987654321098", contact: "Асхат Сейткали", phone: "+7 702 222 33 44", email: "setkali@mail.ru", address: "г. Астана, пр. Республики 5" },
  { id: 3, name: "ТОО «Строй KZ»", bin: "112233445566", contact: "Берик Омаров", phone: "+7 707 333 44 55", email: "stroy@kz.kz", address: "г. Алматы, ул. Достык 89" },
];
const INIT_DOCS = [
  { id: 1, type: "счёт", dir: "out", client: "ТОО «Ромашка»", amount: 150000, date: "07.05.2026", service: "Разработка сайта", payStatus: "paid", shipStatus: "shipped", nds: false },
  { id: 2, type: "акт", dir: "out", client: "ИП Сейткали А.", amount: 85000, date: "05.05.2026", service: "Дизайн логотипа", payStatus: "paid", shipStatus: "shipped", nds: false, linkedInvoiceId: 1 },
  { id: 3, type: "счёт", dir: "out", client: "ТОО «Строй KZ»", amount: 320000, date: "01.05.2026", service: "Консалтинг", payStatus: "partial", shipStatus: "unshipped", nds: false },
  { id: 4, type: "ЭСФ", dir: "in", client: "ТОО «Медиа Про»", amount: 60000, date: "28.04.2026", service: "SMM услуги", payStatus: "unpaid", shipStatus: "shipped", nds: true },
  { id: 5, type: "ЭАВР", dir: "in", client: "ТОО «Строй KZ»", amount: 45000, date: "25.04.2026", service: "Аренда офиса", payStatus: "paid", shipStatus: "shipped", nds: false },
];
const INIT_BANK = [
  { id: 1, date: "07.05.2026", desc: "Оплата от ТОО «Ромашка»", amount: 150000, type: "in" },
  { id: 2, date: "05.05.2026", desc: "Оплата налогов (910 форма)", amount: -18500, type: "out" },
  { id: 3, date: "03.05.2026", desc: "Оплата от ИП Сейткали А.", amount: 85000, type: "in" },
  { id: 4, date: "01.05.2026", desc: "Комиссия банка", amount: -1200, type: "out" },
];
const INIT_CASH = [
  { id: 1, date: "06.05.2026", desc: "Наличная оплата от клиента", amount: 50000, type: "in" },
  { id: 2, date: "04.05.2026", desc: "Хозяйственные расходы", amount: -8000, type: "out" },
];

// ─── Shared UI components ─────────────────────────────────────────
const BackBtn = ({ onBack }) => (
  <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.purple, fontSize: 26, padding: 0, lineHeight: 1, marginRight: 4 }}>‹</button>
);
const PrimaryBtn = ({ children, onClick, style = {}, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ width: "100%", padding: "15px", borderRadius: 14, background: disabled ? C.dim : `linear-gradient(135deg, ${C.purple}, ${C.green})`, border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", ...style }}>{children}</button>
);
const SecBtn = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{ width: "100%", padding: "13px", borderRadius: 12, background: C.card2, border: `1px solid ${C.border}`, color: C.muted, fontSize: 14, fontWeight: 600, cursor: "pointer", ...style }}>{children}</button>
);
const FInput = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div style={{ marginBottom: 13 }}>
    {label && <p style={{ color: C.muted, fontSize: 11, fontWeight: 600, margin: "0 0 5px", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</p>}
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type}
      style={{ width: "100%", background: C.card2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
  </div>
);
const InfoField = ({ label, value }) => (
  <div style={{ marginBottom: 12 }}>
    <p style={{ color: C.muted, fontSize: 10, fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</p>
    <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 11, padding: "11px 13px", color: value ? C.text : C.dim, fontSize: 13 }}>{value || "—"}</div>
  </div>
);
const SectionLabel = ({ children }) => (
  <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, margin: "18px 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>{children}</p>
);

const PAY = {
  paid:    { label: "Оплачен",          color: C.green,  bg: "rgba(62,207,142,0.15)" },
  partial: { label: "Частично",         color: C.orange, bg: "rgba(255,159,67,0.15)" },
  unpaid:  { label: "Не оплачен",       color: C.red,    bg: "rgba(255,96,96,0.15)" },
};
const SHIP = {
  shipped:   { label: "Отгружен",    color: C.green, bg: "rgba(62,207,142,0.12)" },
  unshipped: { label: "Не отгружен", color: C.muted, bg: "rgba(136,136,136,0.1)" },
};
const PayBadge = ({ s }) => { const d = PAY[s]||PAY.unpaid; return <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600, background: d.bg, color: d.color }}>{d.label}</span>; };
const ShipBadge = ({ s }) => { const d = SHIP[s]||SHIP.unshipped; return <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600, background: d.bg, color: d.color }}>{d.label}</span>; };

const DocTypeColor = { "счёт": C.purple, "акт": C.green, "ЭСФ": C.orange, "ЭАВР": C.blue, "СФ": C.orange, "накладная": C.muted };
const DocTypeIcon = { "счёт": "📄", "акт": "✅", "ЭСФ": "🧾", "ЭАВР": "📋", "СФ": "🗂", "накладная": "📦" };
const DocIcon = ({ type, size = 38 }) => {
  const col = DocTypeColor[type] || C.purple;
  return <div style={{ width: size, height: size, borderRadius: size * 0.28, flexShrink: 0, background: `${col}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.42 }}>{DocTypeIcon[type] || "📄"}</div>;
};

// ─── ONBOARDING / AUTH SCREENS ────────────────────────────────────
function SplashScreen({ setScreen }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 28px", background: `radial-gradient(ellipse at top, #1a1230 0%, ${C.bg} 70%)` }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: `linear-gradient(135deg, ${C.purple}, ${C.green})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 24, boxShadow: `0 16px 40px ${C.purple}50` }}>💼</div>
      <h1 style={{ color: C.text, fontSize: 26, fontWeight: 800, margin: "0 0 8px", textAlign: "center" }}>BizBook KZ</h1>
      <p style={{ color: C.muted, fontSize: 14, textAlign: "center", margin: "0 0 48px", lineHeight: 1.6 }}>Бухгалтерия для ИП и ТОО в Казахстане. Просто. Быстро. Законно.</p>
      <PrimaryBtn onClick={() => setScreen("register")}>Зарегистрироваться</PrimaryBtn>
      <div style={{ marginTop: 14, width: "100%" }}>
        <SecBtn onClick={() => setScreen("login")}>Уже есть аккаунт — Войти</SecBtn>
      </div>
      <p style={{ color: C.dim, fontSize: 11, marginTop: 20, textAlign: "center" }}>Соответствует законодательству РК · 2026</p>
    </div>
  );
}

function RegisterScreen({ setScreen }) {
  const [form, setForm] = useState({ phone: "", email: "", pass: "", pass2: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px" }}>
      <button onClick={() => setScreen("splash")} style={{ background: "none", border: "none", color: C.purple, fontSize: 24, cursor: "pointer", padding: 0 }}>‹</button>
      <h2 style={{ color: C.text, fontSize: 22, fontWeight: 800, margin: "12px 0 4px" }}>Регистрация</h2>
      <p style={{ color: C.muted, fontSize: 13, margin: "0 0 28px" }}>Создайте аккаунт для вашего бизнеса</p>
      <FInput label="Телефон" value={form.phone} onChange={v => set("phone", v)} placeholder="+7 700 000 00 00" />
      <FInput label="Email" value={form.email} onChange={v => set("email", v)} placeholder="your@email.com" type="email" />
      <FInput label="Пароль" value={form.pass} onChange={v => set("pass", v)} placeholder="Минимум 8 символов" type="password" />
      <FInput label="Повторите пароль" value={form.pass2} onChange={v => set("pass2", v)} placeholder="Повторите пароль" type="password" />
      <div style={{ background: "rgba(124,111,255,0.08)", border: `1px solid ${C.purple}30`, borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
        <p style={{ color: C.muted, fontSize: 12, margin: 0, lineHeight: 1.6 }}>📱 На указанный номер будет отправлен SMS-код для подтверждения</p>
      </div>
      <PrimaryBtn onClick={() => setScreen("smsConfirm")}>Получить SMS-код</PrimaryBtn>
      <p style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 16 }}>
        Уже есть аккаунт? <span onClick={() => setScreen("login")} style={{ color: C.purple, cursor: "pointer" }}>Войти</span>
      </p>
    </div>
  );
}

function SmsScreen({ setScreen }) {
  const [code, setCode] = useState("");
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px" }}>
      <button onClick={() => setScreen("register")} style={{ background: "none", border: "none", color: C.purple, fontSize: 24, cursor: "pointer", padding: 0, width: "fit-content" }}>‹</button>
      <h2 style={{ color: C.text, fontSize: 22, fontWeight: 800, margin: "12px 0 4px" }}>SMS-подтверждение</h2>
      <p style={{ color: C.muted, fontSize: 13, margin: "0 0 32px" }}>Введите код из SMS на номер +7 700 *** ** **</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: 56, height: 64, background: C.card2, border: `2px solid ${code.length > i ? C.purple : C.border}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: C.text }}>
            {code[i] || ""}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 28 }}>
        {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => (
          <button key={i} onClick={() => { if (k === "⌫") setCode(c => c.slice(0,-1)); else if (k && code.length < 4) setCode(c => c + k); }}
            style={{ width: 72, height: 52, borderRadius: 14, background: k ? C.card : "transparent", border: k ? `1px solid ${C.border}` : "none", color: C.text, fontSize: 20, fontWeight: 600, cursor: k ? "pointer" : "default" }}>{k}</button>
        ))}
      </div>
      <PrimaryBtn onClick={() => setScreen("setupCompany")} disabled={code.length < 4}>Подтвердить</PrimaryBtn>
      <p style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 14 }}>Не пришёл код? <span style={{ color: C.purple, cursor: "pointer" }}>Отправить снова</span></p>
    </div>
  );
}

function LoginScreen({ setScreen }) {
  const [form, setForm] = useState({ phone: "", pass: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px" }}>
      <button onClick={() => setScreen("splash")} style={{ background: "none", border: "none", color: C.purple, fontSize: 24, cursor: "pointer", padding: 0 }}>‹</button>
      <h2 style={{ color: C.text, fontSize: 22, fontWeight: 800, margin: "12px 0 4px" }}>Вход</h2>
      <p style={{ color: C.muted, fontSize: 13, margin: "0 0 28px" }}>Добро пожаловать обратно!</p>
      <FInput label="Телефон или Email" value={form.phone} onChange={v => set("phone", v)} placeholder="+7 700 000 00 00" />
      <FInput label="Пароль" value={form.pass} onChange={v => set("pass", v)} placeholder="Введите пароль" type="password" />
      <p style={{ color: C.purple, fontSize: 13, textAlign: "right", cursor: "pointer", margin: "-4px 0 20px" }}>Забыли пароль?</p>
      <PrimaryBtn onClick={() => setScreen("home")}>Войти</PrimaryBtn>
      <div style={{ display: "flex", gap: 10, margin: "16px 0" }}>
        <div style={{ flex: 1, height: 1, background: C.border, marginTop: 8 }} />
        <span style={{ color: C.dim, fontSize: 12 }}>или</span>
        <div style={{ flex: 1, height: 1, background: C.border, marginTop: 8 }} />
      </div>
      <SecBtn onClick={() => setScreen("home")}>🔐 Войти через ЭЦП</SecBtn>
      <p style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 16 }}>
        Нет аккаунта? <span onClick={() => setScreen("register")} style={{ color: C.purple, cursor: "pointer" }}>Зарегистрироваться</span>
      </p>
    </div>
  );
}

// ─── SETUP: Company ───────────────────────────────────────────────
function SetupCompany({ setScreen }) {
  const [type, setType] = useState(null);
  const [form, setForm] = useState({ name: "", iin: "", bin: "", address: "", phone: "", email: "", director: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  if (!type) return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px" }}>
      <h2 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: "0 0 6px" }}>Тип организации</h2>
      <p style={{ color: C.muted, fontSize: 13, margin: "0 0 28px" }}>Выберите форму вашего бизнеса</p>
      {[
        { key: "ip", icon: "👤", title: "Индивидуальный предприниматель (ИП)", desc: "Физическое лицо, ведущее бизнес" },
        { key: "too", icon: "🏢", title: "Товарищество с ограниченной ответственностью (ТОО)", desc: "Юридическое лицо с уставным капиталом" },
        { key: "ao", icon: "🏦", title: "Акционерное общество (АО)", desc: "Корпоративная форма организации" },
      ].map(o => (
        <div key={o.key} onClick={() => setType(o.key)} style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 12, cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontSize: 30 }}>{o.icon}</span>
          <div>
            <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: "0 0 3px" }}>{o.title}</p>
            <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>{o.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px" }}>
      <button onClick={() => setType(null)} style={{ background: "none", border: "none", color: C.purple, fontSize: 24, cursor: "pointer", padding: 0 }}>‹</button>
      <h2 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: "12px 0 4px" }}>Данные {type === "ip" ? "ИП" : "компании"}</h2>
      <p style={{ color: C.muted, fontSize: 13, margin: "0 0 20px" }}>Заполните реквизиты — они подставятся в документы</p>
      {type === "ip" && <FInput label="ФИО *" value={form.name} onChange={v => set("name", v)} placeholder="Иванов Иван Иванович" />}
      {type !== "ip" && <FInput label="Название организации *" value={form.name} onChange={v => set("name", v)} placeholder='ТОО "Компания"' />}
      <FInput label="ИИН *" value={form.iin} onChange={v => set("iin", v)} placeholder="123456789012" />
      {type !== "ip" && <FInput label="БИН *" value={form.bin} onChange={v => set("bin", v)} placeholder="123456789012" />}
      {type !== "ip" && <FInput label="Директор" value={form.director} onChange={v => set("director", v)} placeholder="ФИО директора" />}
      <FInput label="Адрес" value={form.address} onChange={v => set("address", v)} placeholder="г. Алматы, ул. ..." />
      <FInput label="Телефон" value={form.phone} onChange={v => set("phone", v)} placeholder="+7 700 000 00 00" />
      <FInput label="Email" value={form.email} onChange={v => set("email", v)} placeholder="info@company.kz" />
      <PrimaryBtn onClick={() => setScreen("setupTax")}>Далее — Налоговый режим →</PrimaryBtn>
    </div>
  );
}

// ─── SETUP: Tax regime ────────────────────────────────────────────
function SetupTax({ setScreen }) {
  const [regime, setRegime] = useState(null);
  const [nds, setNds] = useState(false);
  const regimes = [
    { key: "snr910", icon: "⚡", title: "Упрощённая декларация (910)", desc: "Доход до 600 000 МРП · 3% от дохода раз в полгода · Для малого бизнеса", color: C.green },
    { key: "patent", icon: "📜", title: "Патент", desc: "Фиксированная оплата · Только для ИП без сотрудников · Простой учёт", color: C.blue },
    { key: "our", icon: "📊", title: "Общеустановленный режим (ОУР)", desc: "ИПН 10% / КПН 20% · Полный бухучёт · Для крупного бизнеса", color: C.orange },
    { key: "nds", icon: "🔖", title: "Плательщик НДС (16%)", desc: "Оборот от 20 000 МРП · ЭСФ обязательны · Форма 300", color: C.red },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px" }}>
      <button onClick={() => setScreen("setupCompany")} style={{ background: "none", border: "none", color: C.purple, fontSize: 24, cursor: "pointer", padding: 0 }}>‹</button>
      <h2 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: "12px 0 4px" }}>Налоговый режим</h2>
      <p style={{ color: C.muted, fontSize: 13, margin: "0 0 20px" }}>Выберите подходящий режим налогообложения</p>
      {regimes.map(r => (
        <div key={r.key} onClick={() => setRegime(r.key)} style={{ background: regime === r.key ? `${r.color}15` : C.card, border: `1.5px solid ${regime === r.key ? r.color : C.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24 }}>{r.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: regime === r.key ? r.color : C.text, fontSize: 13, fontWeight: 700, margin: "0 0 4px" }}>{r.title}</p>
              <p style={{ color: C.muted, fontSize: 11, margin: 0, lineHeight: 1.5 }}>{r.desc}</p>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${regime === r.key ? r.color : C.border}`, background: regime === r.key ? r.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {regime === r.key && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
            </div>
          </div>
        </div>
      ))}
      <div onClick={() => setNds(!nds)} style={{ background: nds ? "rgba(255,96,96,0.1)" : C.card, border: `1.5px solid ${nds ? C.red : C.border}`, borderRadius: 14, padding: "13px 16px", marginBottom: 20, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: C.text, fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>Плательщик НДС</p>
          <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>Ставка 16% · ЭСФ обязательны</p>
        </div>
        <div style={{ width: 44, height: 24, borderRadius: 12, background: nds ? C.red : C.dim, display: "flex", alignItems: "center", padding: "0 3px", transition: "background 0.2s" }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", transition: "transform 0.2s", transform: nds ? "translateX(20px)" : "translateX(0)" }} />
        </div>
      </div>
      <PrimaryBtn onClick={() => setScreen("setupBank")} disabled={!regime}>Далее — Банк и касса →</PrimaryBtn>
    </div>
  );
}

// ─── SETUP: Bank ──────────────────────────────────────────────────
function SetupBank({ setScreen }) {
  const [form, setForm] = useState({ bank: "", bik: "", iik: "", kbe: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const banks = ["Halyk Bank", "Kaspi Bank", "Jusan Bank", "ForteBank", "Банк ЦентрКредит", "Евразийский банк", "Другой"];
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px" }}>
      <button onClick={() => setScreen("setupTax")} style={{ background: "none", border: "none", color: C.purple, fontSize: 24, cursor: "pointer", padding: 0 }}>‹</button>
      <h2 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: "12px 0 4px" }}>Банковские реквизиты</h2>
      <p style={{ color: C.muted, fontSize: 13, margin: "0 0 20px" }}>Данные для формирования счетов на оплату</p>
      <SectionLabel>Выберите банк</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {banks.map(b => (
          <button key={b} onClick={() => setForm(f => ({ ...f, bank: b }))} style={{ padding: "8px 14px", borderRadius: 20, border: `1.5px solid ${form.bank === b ? C.purple : C.border}`, background: form.bank === b ? `${C.purple}20` : C.card2, color: form.bank === b ? C.purple : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{b}</button>
        ))}
      </div>
      <FInput label="БИК" value={form.bik} onChange={v => set("bik", v)} placeholder="HSBKKZKX" />
      <FInput label="ИИК (номер счёта)" value={form.iik} onChange={v => set("iik", v)} placeholder="KZ12 3456 7890 1234 5678" />
      <FInput label="КБе (для платёжных поручений)" value={form.kbe} onChange={v => set("kbe", v)} placeholder="17" />
      <div style={{ background: "rgba(62,207,142,0.08)", border: `1px solid ${C.green}30`, borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
        <p style={{ color: C.muted, fontSize: 12, margin: 0, lineHeight: 1.6 }}>💡 Можно добавить несколько счетов в разных банках после регистрации</p>
      </div>
      <PrimaryBtn onClick={() => setScreen("home")}>🎉 Готово — Начать работу!</PrimaryBtn>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────
const IP = { name: "Сарсенов Алибек Берикович", iin: "850312300145", ipName: "ИП Сарсенов А.Б.", bank: "Halyk Bank", bik: "HSBKKZKX", iik: "KZ12 3456 7890 1234 5678", phone: "+7 701 234 56 78", email: "sarssenov@gmail.com", address: "г. Алматы, ул. Абая 150, оф. 12", regime: "Упрощённая декларация (910)", nds: false };

function HomeScreen({ setScreen, setSelectedDoc, docs }) {
  const income = docs.filter(d => d.dir === "out").reduce((s, d) => s + d.amount, 0);
  const expense = docs.filter(d => d.dir === "in").reduce((s, d) => s + d.amount, 0);
  const tax910 = Math.round(income * 0.03);
  const quickActions = [
    { icon: "📄", label: "Счёт", screen: "newInvoice", color: C.purple },
    { icon: "✅", label: "Акт", screen: "newAct", color: C.green },
    { icon: "🧾", label: "ЭСФ", screen: "newESF", color: C.orange },
    { icon: "📥", label: "Входящий", screen: "newIncoming", color: C.blue },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
      <div style={{ padding: "16px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>Добро пожаловать 👋</p>
          <h2 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: "2px 0 0" }}>{IP.ipName}</h2>
        </div>
        <button onClick={() => setScreen("profile")} style={{ width: 40, height: 40, borderRadius: 20, background: `linear-gradient(135deg, ${C.purple}, ${C.green})`, border: "none", fontSize: 17, cursor: "pointer" }}>👤</button>
      </div>

      {/* Balance card */}
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.green})`, borderRadius: 20, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: 0 }}>Доход за май 2026</p>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: "4px 0 12px" }}>{fmt(income)}</h1>
          <div style={{ display: "flex", gap: 0 }}>
            {[
              { label: "Расходы", val: fmt(expense), color: "rgba(255,255,255,0.7)" },
              { label: "Налог (910)", val: fmt(tax910), color: "#ffe082" },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.2)" : "none", paddingLeft: i > 0 ? 14 : 0 }}>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, margin: 0, textTransform: "uppercase" }}>{s.label}</p>
                <p style={{ color: s.color, fontSize: 13, fontWeight: 700, margin: "2px 0 0" }}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ background: "rgba(255,159,67,0.1)", border: `1px solid ${C.orange}30`, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <p style={{ color: C.orange, fontSize: 12, fontWeight: 700, margin: "0 0 2px" }}>Сдача 910 формы</p>
            <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>Дедлайн: 15 августа 2026 · Осталось 97 дней</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: "16px 20px 0" }}>
        <SectionLabel>Быстрые действия</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {quickActions.map((a, i) => (
            <button key={i} onClick={() => setScreen(a.screen)} style={{ background: `${a.color}15`, border: `1px solid ${a.color}30`, borderRadius: 14, padding: "14px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              <span style={{ color: a.color, fontSize: 11, fontWeight: 600 }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tax calendar */}
      <div style={{ padding: "16px 20px 0" }}>
        <SectionLabel>Налоговый календарь</SectionLabel>
        {[
          { date: "15 мая", label: "Формы 200, 300", urgent: true },
          { date: "25 мая", label: "Налоги с ЗП за апрель", urgent: false },
          { date: "15 авг", label: "910 форма за I полугодие", urgent: false },
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: C.card, borderRadius: 12, padding: "10px 14px", marginBottom: 8, border: `1px solid ${t.urgent ? C.red+"40" : C.border}` }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: t.urgent ? "rgba(255,96,96,0.15)" : C.card2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: t.urgent ? C.red : C.muted, fontSize: 11, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{t.date}</span>
            </div>
            <p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: 0 }}>{t.label}</p>
            {t.urgent && <span style={{ marginLeft: "auto", fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "rgba(255,96,96,0.15)", color: C.red, fontWeight: 600 }}>Срочно</span>}
          </div>
        ))}
      </div>

      {/* Recent docs */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <SectionLabel>Последние документы</SectionLabel>
          <button onClick={() => setScreen("docs")} style={{ background: "none", border: "none", color: C.purple, fontSize: 12, cursor: "pointer", marginTop: -14 }}>Все →</button>
        </div>
        {docs.slice(0, 3).map(doc => (
          <div key={doc.id} onClick={() => { setSelectedDoc(doc); setScreen("docDetail"); }} style={{ background: C.card, borderRadius: 12, padding: "11px 13px", marginBottom: 8, display: "flex", gap: 10, cursor: "pointer", border: `1px solid ${C.border}` }}>
            <DocIcon type={doc.type} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.client}</p>
              <p style={{ color: C.dim, fontSize: 11, margin: "2px 0 0" }}>{doc.date} · {doc.type} · {doc.dir === "in" ? "📥 вход" : "📤 исход"}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: "0 0 3px" }}>{fmt(doc.amount)}</p>
              <PayBadge s={doc.payStatus} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DOCS ─────────────────────────────────────────────────────────
function DocsScreen({ setScreen, setSelectedDoc, docs }) {
  const [filter, setFilter] = useState("все");
  const [dir, setDir] = useState("все");
  const filtered = docs.filter(d => (filter === "все" || d.type === filter) && (dir === "все" || d.dir === dir));
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
      <div style={{ padding: "16px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: C.text, fontSize: 19, fontWeight: 700, margin: 0 }}>Документы</h2>
        <button onClick={() => setScreen("newInvoice")} style={{ background: C.purple, border: "none", borderRadius: 18, padding: "6px 14px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Создать</button>
      </div>
      <div style={{ padding: "12px 20px 0", display: "flex", gap: 6, overflowX: "auto" }}>
        {["все","📤 Исходящие","📥 Входящие"].map((f, i) => (
          <button key={i} onClick={() => setDir(["все","out","in"][i])} style={{ padding: "6px 14px", borderRadius: 18, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", background: dir === ["все","out","in"][i] ? C.purple : C.card, color: dir === ["все","out","in"][i] ? "#fff" : C.muted }}>{f}</button>
        ))}
      </div>
      <div style={{ padding: "8px 20px 0", display: "flex", gap: 6, overflowX: "auto" }}>
        {["все","счёт","акт","ЭСФ","ЭАВР","СФ"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "5px 12px", borderRadius: 16, border: `1px solid ${filter === f ? C.purple : C.border}`, cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", background: filter === f ? `${C.purple}20` : "transparent", color: filter === f ? C.purple : C.muted }}>{f}</button>
        ))}
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        {filtered.map(doc => (
          <div key={doc.id} onClick={() => { setSelectedDoc(doc); setScreen("docDetail"); }} style={{ background: C.card, borderRadius: 13, padding: "12px 13px", marginBottom: 9, cursor: "pointer", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <DocIcon type={doc.type} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.text, fontSize: 13, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.client}</p>
                <p style={{ color: C.dim, fontSize: 11, margin: "2px 0 0" }}>{doc.service}</p>
              </div>
              <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0, flexShrink: 0 }}>{fmt(doc.amount)}</p>
            </div>
            <div style={{ marginTop: 9, paddingTop: 8, borderTop: `1px solid ${C.border}`, display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ color: C.dim, fontSize: 10, marginRight: 4 }}>📅 {doc.date}</span>
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: doc.dir === "out" ? "rgba(124,111,255,0.15)" : "rgba(84,160,255,0.15)", color: doc.dir === "out" ? C.purple : C.blue, fontWeight: 600 }}>{doc.dir === "out" ? "📤 Исходящий" : "📥 Входящий"}</span>
              <PayBadge s={doc.payStatus} />
              {doc.nds && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: "rgba(255,96,96,0.12)", color: C.red, fontWeight: 600 }}>НДС 16%</span>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ color: C.muted, textAlign: "center", padding: "30px 0" }}>Документы не найдены</p>}
      </div>
    </div>
  );
}

// ─── DOC DETAIL ───────────────────────────────────────────────────
function DocDetail({ doc, onBack, docs, onUpdateStatus }) {
  const [showStatus, setShowStatus] = useState(false);
  const [pay, setPay] = useState(doc?.payStatus);
  const [ship, setShip] = useState(doc?.shipStatus);
  if (!doc) return null;
  const linked = doc.linkedInvoiceId ? docs.find(d => d.id === doc.linkedInvoiceId) : null;
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 30, position: "relative" }}>
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <BackBtn onBack={onBack} />
        <h2 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: 0 }}>{DocTypeIcon[doc.type]} {doc.type}</h2>
        <span style={{ marginLeft: "auto", fontSize: 11, padding: "3px 10px", borderRadius: 10, background: doc.dir === "out" ? `${C.purple}20` : `${C.blue}20`, color: doc.dir === "out" ? C.purple : C.blue, fontWeight: 600 }}>{doc.dir === "out" ? "Исходящий" : "Входящий"}</span>
      </div>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ background: `${DocTypeColor[doc.type] || C.purple}15`, border: `1px solid ${DocTypeColor[doc.type] || C.purple}30`, borderRadius: 18, padding: "18px", textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 36 }}>{DocTypeIcon[doc.type]}</span>
          <p style={{ color: C.muted, fontSize: 11, margin: "8px 0 2px" }}>{doc.type} №{doc.id} · {doc.date}</p>
          <h2 style={{ color: C.text, fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>{fmt(doc.amount)}</h2>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
            <PayBadge s={doc.payStatus} /><ShipBadge s={doc.shipStatus} />
            {doc.nds && <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "rgba(255,96,96,0.12)", color: C.red, fontWeight: 600 }}>НДС 16%</span>}
          </div>
        </div>
        <InfoField label="Контрагент" value={doc.client} />
        <InfoField label="Услуга / Товар" value={doc.service} />
        <InfoField label="Дата" value={doc.date} />
        {doc.nds && <InfoField label="Сумма без НДС" value={fmt(Math.round(doc.amount / 1.16))} />}
        {doc.nds && <InfoField label="НДС (16%)" value={fmt(doc.amount - Math.round(doc.amount / 1.16))} />}
        {linked && <InfoField label={`Связанный счёт №${linked.id}`} value={`${linked.client} · ${fmt(linked.amount)}`} />}

        <SectionLabel>Действия</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[{ icon: "👁", l: "PDF" }, { icon: "📤", l: "Отправить" }, { icon: "✏️", l: "Изменить" }].map((a, i) => (
            <button key={i} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 11, padding: "11px 6px", cursor: "pointer", color: C.text, fontSize: 11, fontWeight: 600 }}>{a.icon}<br />{a.l}</button>
          ))}
        </div>
        <button onClick={() => setShowStatus(true)} style={{ width: "100%", padding: "12px", borderRadius: 12, background: `${C.purple}15`, border: `1px solid ${C.purple}30`, color: C.purple, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>🔄 Изменить статус</button>
        <button style={{ width: "100%", padding: "12px", borderRadius: 12, background: "rgba(255,96,96,0.1)", border: "1px solid rgba(255,96,96,0.2)", color: C.red, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🗑 Удалить</button>
      </div>
      {showStatus && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", zIndex: 50, borderRadius: 44 }}>
          <div style={{ background: C.card, borderRadius: "22px 22px 0 0", width: "100%", padding: "18px 20px 28px" }}>
            <div style={{ width: 36, height: 4, background: "#444", borderRadius: 2, margin: "0 auto 16px" }} />
            <p style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Статус оплаты</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              {Object.entries(PAY).map(([k, v]) => (
                <button key={k} onClick={() => setPay(k)} style={{ flex: 1, padding: "9px 4px", borderRadius: 10, border: `1.5px solid ${pay === k ? v.color : C.border}`, background: pay === k ? v.bg : C.card2, color: pay === k ? v.color : C.muted, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>{v.label}</button>
              ))}
            </div>
            <p style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Статус отгрузки</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {Object.entries(SHIP).map(([k, v]) => (
                <button key={k} onClick={() => setShip(k)} style={{ flex: 1, padding: "9px 4px", borderRadius: 10, border: `1.5px solid ${ship === k ? v.color : C.border}`, background: ship === k ? v.bg : C.card2, color: ship === k ? v.color : C.muted, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{v.label}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <SecBtn onClick={() => setShowStatus(false)} style={{ flex: 1 }}>Отмена</SecBtn>
              <PrimaryBtn onClick={() => { onUpdateStatus(doc.id, pay, ship); setShowStatus(false); }} style={{ flex: 2 }}>Сохранить</PrimaryBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NEW DOC ──────────────────────────────────────────────────────
function NewDocScreen({ type, onBack, onDone, counterparties, docs }) {
  const isInvoice = type === "invoice";
  const isAct = type === "act";
  const isESF = type === "esf";
  const isIncoming = type === "incoming";
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ client: "", bin: "", service: "", qty: "1", price: "", nds: isESF, docType: "счёт" });
  const [selectedCP, setSelectedCP] = useState(null);
  const [linkedInvoice, setLinkedInvoice] = useState(null);
  const [showCPPicker, setShowCPPicker] = useState(false);
  const [showInvPicker, setShowInvPicker] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const total = (parseFloat(form.price) || 0) * (parseFloat(form.qty) || 1);
  const ndsAmount = form.nds ? Math.round(total * 0.16 / 1.16) : 0;

  const title = isInvoice ? "📄 Счёт на оплату" : isAct ? "✅ Акт / АВР" : isESF ? "🧾 ЭСФ" : "📥 Входящий документ";

  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 30, position: "relative" }}>
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <BackBtn onBack={onBack} />
        <h2 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0 }}>{title}</h2>
        <span style={{ marginLeft: "auto", color: C.muted, fontSize: 12 }}>Шаг {step}/3</span>
      </div>
      <div style={{ padding: "10px 20px 0", display: "flex", gap: 5 }}>
        {[1,2,3].map(s => <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? C.purple : C.card2, transition: "background 0.3s" }} />)}
      </div>
      <div style={{ padding: "16px 20px 0" }}>
        {step === 1 && (
          <>
            <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>{isIncoming ? "Данные поставщика" : "Данные клиента"}</p>
            <button onClick={() => setShowCPPicker(true)} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, marginBottom: 14, background: selectedCP ? `${C.purple}15` : C.card2, border: `1.5px solid ${selectedCP ? C.purple : C.border}`, color: selectedCP ? C.text : C.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{selectedCP ? `👤 ${selectedCP.name}` : "📋 Выбрать из контрагентов"}</span>
              <span style={{ color: C.purple }}>›</span>
            </button>
            <div style={{ textAlign: "center", color: C.dim, fontSize: 11, margin: "0 0 14px" }}>— или введите вручную —</div>
            <FInput label="Название / ФИО *" value={form.client} onChange={v => set("client", v)} placeholder="ТОО «Компания»" />
            <FInput label="БИН / ИИН" value={form.bin} onChange={v => set("bin", v)} placeholder="123456789012" />
            {isIncoming && (
              <>
                <SectionLabel>Тип входящего документа</SectionLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                  {["счёт","акт","ЭСФ","ЭАВР","СФ","накладная"].map(t => (
                    <button key={t} onClick={() => set("docType", t)} style={{ padding: "6px 14px", borderRadius: 16, border: `1.5px solid ${form.docType === t ? C.blue : C.border}`, background: form.docType === t ? `${C.blue}20` : "transparent", color: form.docType === t ? C.blue : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t}</button>
                  ))}
                </div>
              </>
            )}
            <PrimaryBtn onClick={() => setStep(2)}>Далее →</PrimaryBtn>
          </>
        )}
        {step === 2 && (
          <>
            <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>Услуги и сумма</p>
            {isAct && (
              <button onClick={() => setShowInvPicker(true)} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, marginBottom: 14, background: linkedInvoice ? `${C.purple}15` : C.card2, border: `1.5px solid ${linkedInvoice ? C.purple : C.border}`, color: linkedInvoice ? C.text : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between" }}>
                <span>{linkedInvoice ? `📄 Счёт №${linkedInvoice.id} · ${fmt(linkedInvoice.amount)}` : "📄 Привязать к счёту (необязательно)"}</span>
                <span style={{ color: C.purple }}>›</span>
              </button>
            )}
            <FInput label="Наименование услуги / товара *" value={form.service} onChange={v => set("service", v)} placeholder="Разработка сайта" />
            <FInput label="Количество" value={form.qty} onChange={v => set("qty", v)} placeholder="1" />
            <FInput label="Цена за единицу (₸)" value={form.price} onChange={v => set("price", v)} placeholder="150000" />
            <div onClick={() => set("nds", !form.nds)} style={{ background: form.nds ? "rgba(255,96,96,0.1)" : C.card2, border: `1.5px solid ${form.nds ? C.red : C.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 14, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><p style={{ color: C.text, fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>Включает НДС 16%</p><p style={{ color: C.muted, fontSize: 11, margin: 0 }}>Обязательно для плательщиков НДС</p></div>
              <div style={{ width: 40, height: 22, borderRadius: 11, background: form.nds ? C.red : C.dim, display: "flex", alignItems: "center", padding: "0 3px" }}><div style={{ width: 16, height: 16, borderRadius: 8, background: "#fff", transition: "transform 0.2s", transform: form.nds ? "translateX(18px)" : "translateX(0)" }} /></div>
            </div>
            {total > 0 && (
              <div style={{ background: `${C.purple}12`, borderRadius: 12, padding: "13px", marginBottom: 14, border: `1px solid ${C.purple}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: C.muted, fontSize: 12 }}>Итого:</span>
                  <span style={{ color: C.text, fontSize: 16, fontWeight: 800 }}>{fmt(total)}</span>
                </div>
                {form.nds && <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ color: C.muted, fontSize: 11 }}>в т.ч. НДС 16%:</span>
                  <span style={{ color: C.red, fontSize: 12, fontWeight: 600 }}>{fmt(ndsAmount)}</span>
                </div>}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <SecBtn onClick={() => setStep(1)} style={{ flex: 1 }}>← Назад</SecBtn>
              <PrimaryBtn onClick={() => setStep(3)} style={{ flex: 2 }}>Далее →</PrimaryBtn>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>Предпросмотр</p>
            <div style={{ background: C.card, borderRadius: 16, padding: "16px", border: `1px solid ${C.border}`, marginBottom: 14 }}>
              <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 10, marginBottom: 12 }}>
                <p style={{ color: C.purple, fontSize: 12, fontWeight: 700, margin: "0 0 2px" }}>{title.replace(/📄|✅|🧾|📥 /g, "").toUpperCase()} №{docs.length + 1}</p>
                <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>от {today()}</p>
              </div>
              {[
                { l: "Поставщик", v: IP.ipName },
                { l: "ИИН", v: IP.iin },
                { l: "Банк / ИИК", v: `${IP.bank}` },
                { l: "Клиент", v: selectedCP?.name || form.client || "—" },
                { l: "БИН", v: selectedCP?.bin || form.bin || "—" },
                { l: "Услуга", v: form.service || "—" },
                linkedInvoice && { l: "К счёту №", v: `${linkedInvoice.id}` },
                { l: "Сумма", v: fmt(total) },
                form.nds && { l: "НДС 16%", v: fmt(ndsAmount) },
              ].filter(Boolean).map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <span style={{ color: C.muted, fontSize: 11 }}>{r.l}</span>
                  <span style={{ color: C.text, fontSize: 11, fontWeight: 600, maxWidth: "55%", textAlign: "right" }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <SecBtn onClick={() => setStep(2)} style={{ flex: 1 }}>← Назад</SecBtn>
              <PrimaryBtn onClick={onDone} style={{ flex: 2 }}>📤 Сохранить и отправить</PrimaryBtn>
            </div>
            <SecBtn onClick={onDone}>💾 Сохранить черновик</SecBtn>
          </>
        )}
      </div>
      {showCPPicker && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", zIndex: 100, borderRadius: 44 }}>
          <div style={{ background: C.card, borderRadius: "22px 22px 0 0", width: "100%", maxHeight: "70%", display: "flex", flexDirection: "column", padding: "16px 20px 24px" }}>
            <div style={{ width: 36, height: 4, background: "#444", borderRadius: 2, margin: "0 auto 14px" }} />
            <p style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Выберите контрагента</p>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {counterparties.map(c => (
                <div key={c.id} onClick={() => { setSelectedCP(c); set("client", c.name); set("bin", c.bin); setShowCPPicker(false); }} style={{ background: C.card2, borderRadius: 12, padding: "12px 14px", marginBottom: 8, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 18, background: `${C.purple}40`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.text }}>{c.name[0]}</div>
                  <div><p style={{ color: C.text, fontSize: 13, fontWeight: 600, margin: 0 }}>{c.name}</p><p style={{ color: C.dim, fontSize: 11, margin: "2px 0 0" }}>БИН: {c.bin}</p></div>
                </div>
              ))}
            </div>
            <SecBtn onClick={() => setShowCPPicker(false)}>Закрыть</SecBtn>
          </div>
        </div>
      )}
      {showInvPicker && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", zIndex: 100, borderRadius: 44 }}>
          <div style={{ background: C.card, borderRadius: "22px 22px 0 0", width: "100%", maxHeight: "65%", display: "flex", flexDirection: "column", padding: "16px 20px 24px" }}>
            <div style={{ width: 36, height: 4, background: "#444", borderRadius: 2, margin: "0 auto 14px" }} />
            <p style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Выберите счёт</p>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {docs.filter(d => d.type === "счёт" && d.dir === "out").map(inv => (
                <div key={inv.id} onClick={() => { setLinkedInvoice(inv); setShowInvPicker(false); }} style={{ background: C.card2, borderRadius: 12, padding: "12px 14px", marginBottom: 8, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div><p style={{ color: C.text, fontSize: 13, fontWeight: 600, margin: 0 }}>Счёт №{inv.id} · {inv.date}</p><p style={{ color: C.dim, fontSize: 11, margin: "2px 0 0" }}>{inv.client}</p></div>
                    <div style={{ textAlign: "right" }}><p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0 }}>{fmt(inv.amount)}</p><PayBadge s={inv.payStatus} /></div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <SecBtn onClick={() => { setLinkedInvoice(null); setShowInvPicker(false); }} style={{ flex: 1 }}>Без счёта</SecBtn>
              <SecBtn onClick={() => setShowInvPicker(false)} style={{ flex: 1 }}>Закрыть</SecBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COUNTERPARTIES ───────────────────────────────────────────────
function CounterpartiesScreen({ counterparties, setScreen, setSelectedCP }) {
  const [q, setQ] = useState("");
  const filtered = counterparties.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.bin.includes(q));
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
      <div style={{ padding: "16px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: C.text, fontSize: 19, fontWeight: 700, margin: 0 }}>Контрагенты</h2>
        <button onClick={() => setScreen("newCP")} style={{ background: C.purple, border: "none", borderRadius: 18, padding: "6px 14px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Добавить</button>
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="🔍 Поиск..." style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 14px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        {filtered.map(c => (
          <div key={c.id} onClick={() => { setSelectedCP(c); setScreen("cpDetail"); }} style={{ background: C.card, borderRadius: 13, padding: "13px 15px", marginBottom: 9, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", border: `1px solid ${C.border}` }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, flexShrink: 0, background: `linear-gradient(135deg, ${C.purple}50, ${C.green}50)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 700, color: C.text }}>{c.name[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: C.text, fontSize: 13, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
              <p style={{ color: C.dim, fontSize: 11, margin: "3px 0 0" }}>БИН: {c.bin} {c.contact ? `· ${c.contact}` : ""}</p>
            </div>
            <span style={{ color: C.purple, fontSize: 20 }}>›</span>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ color: C.muted, textAlign: "center", padding: "30px 0" }}>Не найдено</p>}
      </div>
    </div>
  );
}

function CPDetail({ cp, onBack, docs }) {
  if (!cp) return null;
  const cpDocs = docs.filter(d => d.client === cp.name);
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 30 }}>
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <BackBtn onBack={onBack} />
        <h2 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: 0 }}>Контрагент</h2>
      </div>
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ background: `linear-gradient(135deg, ${C.purple}20, ${C.green}20)`, borderRadius: 18, padding: "18px", textAlign: "center", marginBottom: 16, border: `1px solid ${C.purple}20` }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, margin: "0 auto 10px", background: `linear-gradient(135deg, ${C.purple}, ${C.green})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff" }}>{cp.name[0]}</div>
          <h3 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: "0 0 2px" }}>{cp.name}</h3>
          <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>БИН: {cp.bin}</p>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[{ l: "Документов", v: cpDocs.length }, { l: "Сумма", v: fmt(cpDocs.reduce((s, d) => s + d.amount, 0)) }].map((s, i) => (
            <div key={i} style={{ flex: 1, background: C.card, borderRadius: 12, padding: "12px", textAlign: "center", border: `1px solid ${C.border}` }}>
              <p style={{ color: C.text, fontSize: 15, fontWeight: 800, margin: "0 0 2px" }}>{s.v}</p>
              <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{s.l}</p>
            </div>
          ))}
        </div>
        {[{ l: "Контакт", v: cp.contact }, { l: "Телефон", v: cp.phone }, { l: "Email", v: cp.email }, { l: "Адрес", v: cp.address }].map((f, i) => f.v && <InfoField key={i} label={f.l} value={f.v} />)}
        <SectionLabel>Документы</SectionLabel>
        {cpDocs.map(doc => (
          <div key={doc.id} style={{ background: C.card, borderRadius: 12, padding: "10px 12px", marginBottom: 8, display: "flex", gap: 10, border: `1px solid ${C.border}` }}>
            <DocIcon type={doc.type} size={32} />
            <div style={{ flex: 1 }}><p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: 0 }}>{doc.service}</p><p style={{ color: C.dim, fontSize: 11, margin: "2px 0 0" }}>{doc.date}</p></div>
            <div style={{ textAlign: "right" }}><p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: "0 0 3px" }}>{fmt(doc.amount)}</p><PayBadge s={doc.payStatus} /></div>
          </div>
        ))}
        {cpDocs.length === 0 && <p style={{ color: C.dim, fontSize: 12, textAlign: "center" }}>Нет документов</p>}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <SecBtn style={{ flex: 1 }}>✏️ Редактировать</SecBtn>
          <button style={{ flex: 1, padding: "12px", borderRadius: 12, background: "rgba(255,96,96,0.1)", border: "1px solid rgba(255,96,96,0.2)", color: C.red, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🗑 Удалить</button>
        </div>
      </div>
    </div>
  );
}

function NewCPScreen({ onBack, onSave }) {
  const [form, setForm] = useState({ name: "", bin: "", contact: "", phone: "", email: "", address: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 30 }}>
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <BackBtn onBack={onBack} />
        <h2 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: 0 }}>Новый контрагент</h2>
      </div>
      <div style={{ padding: "14px 20px 0" }}>
        <FInput label="Название / ФИО *" value={form.name} onChange={v => set("name", v)} placeholder='ТОО "Компания"' />
        <FInput label="БИН / ИИН *" value={form.bin} onChange={v => set("bin", v)} placeholder="123456789012" />
        <FInput label="Контактное лицо" value={form.contact} onChange={v => set("contact", v)} placeholder="Иванов Иван" />
        <FInput label="Телефон" value={form.phone} onChange={v => set("phone", v)} placeholder="+7 700 000 00 00" />
        <FInput label="Email" value={form.email} onChange={v => set("email", v)} placeholder="info@company.kz" />
        <FInput label="Адрес" value={form.address} onChange={v => set("address", v)} placeholder="г. Алматы, ул. ..." />
        <PrimaryBtn onClick={() => form.name && form.bin && onSave(form)}>Сохранить контрагента</PrimaryBtn>
      </div>
    </div>
  );
}

// ─── BANK / CASH ──────────────────────────────────────────────────
function BankScreen({ bank, cash }) {
  const [tab, setTab] = useState("bank");
  const items = tab === "bank" ? bank : cash;
  const balance = items.reduce((s, t) => s + t.amount, 0);
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
      <div style={{ padding: "16px 20px 0" }}>
        <h2 style={{ color: C.text, fontSize: 19, fontWeight: 700, margin: "0 0 14px" }}>Банк и касса</h2>
        <div style={{ display: "flex", gap: 0, background: C.card2, borderRadius: 12, padding: 4, marginBottom: 16 }}>
          {[["bank","🏦 Банк"],["cash","💵 Касса"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "9px", borderRadius: 9, border: "none", background: tab === k ? C.card : "transparent", color: tab === k ? C.text : C.muted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
        <div style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.green})`, borderRadius: 18, padding: "18px 20px", marginBottom: 16 }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: 0 }}>{tab === "bank" ? "Остаток на счёте" : "Остаток в кассе"}</p>
          <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: "6px 0 14px" }}>{fmt(balance)}</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ l: "Приход", v: fmt(items.filter(t => t.type === "in").reduce((s, t) => s + t.amount, 0)), c: C.green },
              { l: "Расход", v: fmt(Math.abs(items.filter(t => t.type === "out").reduce((s, t) => s + t.amount, 0))), c: C.red }].map((s, i) => (
              <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 10px" }}>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, margin: "0 0 2px" }}>{s.l}</p>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: 0 }}>{s.v}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button style={{ flex: 1, padding: "11px", borderRadius: 12, background: `${C.green}15`, border: `1px solid ${C.green}30`, color: C.green, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Приход</button>
          <button style={{ flex: 1, padding: "11px", borderRadius: 12, background: `${C.red}15`, border: `1px solid ${C.red}30`, color: C.red, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>− Расход</button>
          <button style={{ flex: 1, padding: "11px", borderRadius: 12, background: `${C.blue}15`, border: `1px solid ${C.blue}30`, color: C.blue, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>⇄ Перевод</button>
        </div>
        <SectionLabel>Движение средств</SectionLabel>
        {items.map(t => (
          <div key={t.id} style={{ background: C.card, borderRadius: 12, padding: "11px 13px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, border: `1px solid ${C.border}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: t.type === "in" ? `${C.green}20` : `${C.red}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{t.type === "in" ? "📈" : "📉"}</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: 0 }}>{t.desc}</p>
              <p style={{ color: C.dim, fontSize: 11, margin: "2px 0 0" }}>{t.date}</p>
            </div>
            <p style={{ color: t.type === "in" ? C.green : C.red, fontSize: 13, fontWeight: 700, margin: 0, flexShrink: 0 }}>{t.type === "in" ? "+" : ""}{fmt(t.amount)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────
function ReportsScreen({ setScreen, docs }) {
  const income = docs.filter(d => d.dir === "out").reduce((s, d) => s + d.amount, 0);
  const tax = Math.round(income * 0.03);
  const reports = [
    { icon: "⚡", title: "Форма 910 (Упрощённая декларация)", period: "I полугодие 2026", status: "Не сдана", deadline: "15 авг 2026", color: C.orange, screen: "report910" },
    { icon: "📊", title: "Форма 200 (ИПН и соцотчисления)", period: "Апрель 2026", status: "Сдана", deadline: "15 мая 2026", color: C.green, screen: "report200" },
    { icon: "🔖", title: "Форма 300 (НДС)", period: "I квартал 2026", status: "Не применимо", deadline: "—", color: C.dim, screen: null },
    { icon: "📈", title: "Форма 100 (КПН)", period: "2025 год", status: "Сдана", deadline: "31 мар 2026", color: C.green, screen: null },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
      <div style={{ padding: "16px 20px 0" }}>
        <h2 style={{ color: C.text, fontSize: 19, fontWeight: 700, margin: "0 0 14px" }}>Отчёты и налоги</h2>
        <div style={{ background: C.card, borderRadius: 16, padding: "16px", marginBottom: 16, border: `1px solid ${C.border}` }}>
          <p style={{ color: C.muted, fontSize: 11, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>Расчёт налога 910 (май 2026)</p>
          {[
            { l: "Доход за полугодие", v: fmt(income * 2.5) },
            { l: "Ставка", v: "3%" },
            { l: "Налог к уплате", v: fmt(tax * 2.5), bold: true, color: C.orange },
            { l: "ОПВ (10% от ЗП)", v: "—" },
            { l: "СО (3.5%)", v: "—" },
            { l: "ОСМС (2%)", v: "—" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <span style={{ color: C.muted, fontSize: 12 }}>{r.l}</span>
              <span style={{ color: r.color || C.text, fontSize: 12, fontWeight: r.bold ? 800 : 600 }}>{r.v}</span>
            </div>
          ))}
        </div>
        <SectionLabel>Налоговые формы</SectionLabel>
        {reports.map((r, i) => (
          <div key={i} onClick={() => r.screen && setScreen(r.screen)} style={{ background: C.card, borderRadius: 14, padding: "14px 15px", marginBottom: 10, cursor: r.screen ? "pointer" : "default", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${r.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: "0 0 3px" }}>{r.title}</p>
                <p style={{ color: C.dim, fontSize: 11, margin: 0 }}>{r.period} · Срок: {r.deadline}</p>
              </div>
              <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 10, background: r.status === "Сдана" ? `${C.green}20` : r.status === "Не применимо" ? `${C.dim}30` : `${C.orange}20`, color: r.status === "Сдана" ? C.green : r.status === "Не применимо" ? C.dim : C.orange, fontWeight: 600 }}>{r.status}</span>
            </div>
            {r.screen && r.status !== "Сдана" && r.status !== "Не применимо" && (
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
                <button onClick={() => setScreen(r.screen)} style={{ flex: 1, padding: "8px", borderRadius: 10, background: `${C.purple}15`, border: `1px solid ${C.purple}30`, color: C.purple, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📝 Заполнить</button>
                <button style={{ flex: 1, padding: "8px", borderRadius: 10, background: `${C.orange}15`, border: `1px solid ${C.orange}30`, color: C.orange, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>💳 Оплатить</button>
              </div>
            )}
          </div>
        ))}
        <SectionLabel>Оплата налогов</SectionLabel>
        <button style={{ width: "100%", padding: "14px", borderRadius: 14, background: `linear-gradient(135deg, ${C.purple}, ${C.green})`, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>💳 Оплатить налоги онлайн</button>
      </div>
    </div>
  );
}

function Report910Screen({ onBack, docs }) {
  const income = docs.filter(d => d.dir === "out").reduce((s, d) => s + d.amount * 2.5, 0);
  const tax = Math.round(income * 0.03);
  const [step, setStep] = useState(1);
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 30 }}>
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <BackBtn onBack={onBack} />
        <h2 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0 }}>⚡ Форма 910</h2>
        <span style={{ marginLeft: "auto", color: C.muted, fontSize: 12 }}>Шаг {step}/3</span>
      </div>
      <div style={{ padding: "10px 20px 0", display: "flex", gap: 5 }}>
        {[1,2,3].map(s => <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? C.orange : C.card2 }} />)}
      </div>
      <div style={{ padding: "16px 20px 0" }}>
        {step === 1 && (
          <>
            <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>Период и реквизиты</p>
            <InfoField label="Налогоплательщик" value={IP.name} />
            <InfoField label="ИИН" value={IP.iin} />
            <InfoField label="Налоговый период" value="I полугодие 2026 (01.01–30.06.2026)" />
            <InfoField label="Режим" value="Упрощённая декларация (СНР)" />
            <InfoField label="ОКЭД" value="62010 — Разработка программного обеспечения" />
            <PrimaryBtn onClick={() => setStep(2)}>Далее →</PrimaryBtn>
          </>
        )}
        {step === 2 && (
          <>
            <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>Доходы и расчёт</p>
            <div style={{ background: C.card, borderRadius: 14, padding: "14px", marginBottom: 16, border: `1px solid ${C.border}` }}>
              {[
                { l: "Строка 910.00.001 — Доход", v: fmt(income), note: "Автоматически из документов" },
                { l: "Строка 910.00.002 — Налог (3%)", v: fmt(tax), note: "Рассчитан автоматически", bold: true, color: C.orange },
                { l: "в т.ч. ИПН (1/2)", v: fmt(Math.round(tax / 2)) },
                { l: "в т.ч. СН (1/2)", v: fmt(Math.round(tax / 2)) },
              ].map((r, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: C.muted, fontSize: 11 }}>{r.l}</span>
                    <span style={{ color: r.color || C.text, fontSize: 12, fontWeight: r.bold ? 800 : 600 }}>{r.v}</span>
                  </div>
                  {r.note && <p style={{ color: C.dim, fontSize: 10, margin: "2px 0 0" }}>{r.note}</p>}
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,159,67,0.1)", border: `1px solid ${C.orange}30`, borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
              <p style={{ color: C.orange, fontSize: 12, fontWeight: 700, margin: "0 0 4px" }}>💡 Социальные отчисления</p>
              <p style={{ color: C.muted, fontSize: 11, margin: 0, lineHeight: 1.5 }}>ОПВ, СО, ОСМС платятся отдельно ежемесячно. Суммы рассчитаны в форме 200.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <SecBtn onClick={() => setStep(1)} style={{ flex: 1 }}>← Назад</SecBtn>
              <PrimaryBtn onClick={() => setStep(3)} style={{ flex: 2 }}>Далее →</PrimaryBtn>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>Отправка в КНП</p>
            <div style={{ background: C.card, borderRadius: 14, padding: "14px", marginBottom: 14, border: `1px solid ${C.border}` }}>
              <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: "0 0 10px" }}>Итог формы 910</p>
              {[{ l: "Доход", v: fmt(income) }, { l: "Налог к уплате", v: fmt(tax), bold: true, color: C.orange }, { l: "Срок уплаты", v: "25 августа 2026" }, { l: "Срок сдачи", v: "15 августа 2026" }].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: C.muted, fontSize: 12 }}>{r.l}</span>
                  <span style={{ color: r.color || C.text, fontSize: 12, fontWeight: r.bold ? 800 : 600 }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(124,111,255,0.1)", border: `1px solid ${C.purple}30`, borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
              <p style={{ color: C.purple, fontSize: 12, fontWeight: 700, margin: "0 0 4px" }}>🔐 Подписание ЭЦП</p>
              <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>Форма будет подписана вашей ЭЦП и отправлена в КНП (cabinet.salyk.kz)</p>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <SecBtn onClick={() => setStep(2)} style={{ flex: 1 }}>← Назад</SecBtn>
              <PrimaryBtn onClick={onBack} style={{ flex: 2 }}>🔐 Подписать и отправить</PrimaryBtn>
            </div>
            <button onClick={onBack} style={{ width: "100%", padding: "12px", borderRadius: 12, background: `${C.orange}15`, border: `1px solid ${C.orange}30`, color: C.orange, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>💳 Оплатить налог {fmt(tax)}</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────
function ProfileScreen({ setScreen }) {
  const menu = [
    { icon: "🏢", label: "Данные компании", screen: "setupCompany" },
    { icon: "📋", label: "Налоговый режим", screen: "setupTax" },
    { icon: "🏦", label: "Банковские реквизиты", screen: "setupBank" },
    { icon: "🔐", label: "ЭЦП и подписи", screen: null },
    { icon: "🔔", label: "Уведомления", screen: null },
    { icon: "🎨", label: "Шаблоны документов", screen: null },
    { icon: "📊", label: "Тарифный план", screen: null },
    { icon: "❓", label: "Помощь и поддержка", screen: null },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
      <div style={{ padding: "16px 20px 0" }}>
        <h2 style={{ color: C.text, fontSize: 19, fontWeight: 700, margin: "0 0 14px" }}>Профиль</h2>
        <div style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.green})`, borderRadius: 18, padding: "18px", marginBottom: 16, display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👤</div>
          <div>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: "0 0 2px" }}>{IP.name}</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: "0 0 4px" }}>ИИН: {IP.iin}</p>
            <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 10, background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600 }}>{IP.regime}</span>
          </div>
        </div>
        <div style={{ background: C.card, borderRadius: 16, overflow: "hidden", marginBottom: 16, border: `1px solid ${C.border}` }}>
          {[{ l: "Название", v: IP.ipName }, { l: "Банк", v: IP.bank }, { l: "Телефон", v: IP.phone }, { l: "Email", v: IP.email }].map((f, i, a) => (
            <div key={i} style={{ padding: "12px 16px", borderBottom: i < a.length-1 ? `1px solid ${C.border}` : "none", display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: C.muted, fontSize: 12 }}>{f.l}</span>
              <span style={{ color: C.text, fontSize: 12, fontWeight: 600, maxWidth: "55%", textAlign: "right" }}>{f.v}</span>
            </div>
          ))}
        </div>
        <SectionLabel>Настройки</SectionLabel>
        <div style={{ background: C.card, borderRadius: 16, overflow: "hidden", marginBottom: 16, border: `1px solid ${C.border}` }}>
          {menu.map((m, i) => (
            <div key={i} onClick={() => m.screen && setScreen(m.screen)} style={{ padding: "13px 16px", borderBottom: i < menu.length-1 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 12, cursor: m.screen ? "pointer" : "default" }}>
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              <span style={{ color: C.text, fontSize: 13, fontWeight: 500, flex: 1 }}>{m.label}</span>
              <span style={{ color: C.dim, fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
        <button onClick={() => setScreen("splash")} style={{ width: "100%", padding: "13px", borderRadius: 12, background: "rgba(255,96,96,0.1)", border: "1px solid rgba(255,96,96,0.2)", color: C.red, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Выйти из аккаунта</button>
      </div>
    </div>
  );
}

// ─── SUCCESS ──────────────────────────────────────────────────────
function SuccessScreen({ onDone, title = "Готово!" }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 28px" }}>
      <div style={{ fontSize: 70, marginBottom: 16 }}>🎉</div>
      <h2 style={{ color: C.text, fontSize: 22, fontWeight: 800, margin: "0 0 10px", textAlign: "center" }}>{title}</h2>
      <p style={{ color: C.muted, fontSize: 14, textAlign: "center", margin: "0 0 28px", lineHeight: 1.6 }}>PDF сгенерирован и готов к отправке</p>
      <div style={{ display: "flex", gap: 10, width: "100%", marginBottom: 12 }}>
        {[["💬","WhatsApp"],["✈️","Telegram"],["📧","Email"]].map(([ic, l], i) => (
          <button key={i} onClick={onDone} style={{ flex: 1, padding: "12px 6px", borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, color: C.text, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{ic}<br />{l}</button>
        ))}
      </div>
      <PrimaryBtn onClick={onDone}>На главную</PrimaryBtn>
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────
const NAV = [
  { icon: "🏠", label: "Главная", key: "home" },
  { icon: "📁", label: "Документы", key: "docs" },
  { icon: "🏦", label: "Банк", key: "bank" },
  { icon: "📊", label: "Отчёты", key: "reports" },
  { icon: "⚙️", label: "Профиль", key: "profile" },
];
const NAV_SCREENS = new Set(["home","docs","bank","reports","profile","counterparties"]);
const AUTH_SCREENS = new Set(["splash","register","smsConfirm","login","setupCompany","setupTax","setupBank"]);

// ─── APP ──────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedCP, setSelectedCP] = useState(null);
  const [docs, setDocs] = useState(INIT_DOCS);
  const [counterparties, setCPs] = useState(INIT_CPS);

  const updateDocStatus = (id, pay, ship) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, payStatus: pay, shipStatus: ship } : d));
    setSelectedDoc(prev => prev?.id === id ? { ...prev, payStatus: pay, shipStatus: ship } : prev);
  };

  const showNav = NAV_SCREENS.has(screen);
  const isAuth = AUTH_SCREENS.has(screen);

  const renderScreen = () => {
    switch (screen) {
      case "splash": return <SplashScreen setScreen={setScreen} />;
      case "register": return <RegisterScreen setScreen={setScreen} />;
      case "smsConfirm": return <SmsScreen setScreen={setScreen} />;
      case "login": return <LoginScreen setScreen={setScreen} />;
      case "setupCompany": return <SetupCompany setScreen={setScreen} />;
      case "setupTax": return <SetupTax setScreen={setScreen} />;
      case "setupBank": return <SetupBank setScreen={setScreen} />;
      case "home": return <HomeScreen setScreen={setScreen} setSelectedDoc={setSelectedDoc} docs={docs} />;
      case "docs": return <DocsScreen setScreen={setScreen} setSelectedDoc={setSelectedDoc} docs={docs} />;
      case "bank": return <BankScreen bank={INIT_BANK} cash={INIT_CASH} />;
      case "reports": return <ReportsScreen setScreen={setScreen} docs={docs} />;
      case "report910": return <Report910Screen onBack={() => setScreen("reports")} docs={docs} />;
      case "profile": return <ProfileScreen setScreen={setScreen} />;
      case "counterparties": return <CounterpartiesScreen counterparties={counterparties} setScreen={setScreen} setSelectedCP={setSelectedCP} />;
      case "cpDetail": return <CPDetail cp={selectedCP} onBack={() => setScreen("counterparties")} docs={docs} />;
      case "newCP": return <NewCPScreen onBack={() => setScreen("counterparties")} onSave={(f) => { setCPs(p => [...p, { ...f, id: p.length+1 }]); setScreen("counterparties"); }} />;
      case "docDetail": return <DocDetail doc={selectedDoc} onBack={() => setScreen("docs")} docs={docs} onUpdateStatus={updateDocStatus} />;
      case "newInvoice": return <NewDocScreen type="invoice" onBack={() => setScreen("home")} onDone={() => setScreen("success")} counterparties={counterparties} docs={docs} />;
      case "newAct": return <NewDocScreen type="act" onBack={() => setScreen("home")} onDone={() => setScreen("success")} counterparties={counterparties} docs={docs} />;
      case "newESF": return <NewDocScreen type="esf" onBack={() => setScreen("home")} onDone={() => setScreen("success")} counterparties={counterparties} docs={docs} />;
      case "newIncoming": return <NewDocScreen type="incoming" onBack={() => setScreen("home")} onDone={() => setScreen("success")} counterparties={counterparties} docs={docs} />;
      case "success": return <SuccessScreen onDone={() => setScreen("home")} title="Документ создан!" />;
      default: return null;
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      width: "100%", height: "100dvh",
      background: C.bg,
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      maxWidth: 480, margin: "0 auto",
      position: "relative", overflow: "hidden"
    }}>
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {renderScreen()}
      </div>

      {showNav && (
        <div style={{
          display: "flex", justifyContent: "space-around", alignItems: "center",
          padding: "10px 0 max(16px, env(safe-area-inset-bottom))",
          borderTop: `1px solid ${C.border}`, background: C.bg, flexShrink: 0
        }}>
          {NAV.map(tab => (
            <button key={tab.key} onClick={() => setScreen(tab.key)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "0 10px" }}>
              <span style={{ fontSize: 22 }}>{tab.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: screen === tab.key ? C.purple : C.dim }}>{tab.label}</span>
              {screen === tab.key && <div style={{ width: 4, height: 4, borderRadius: 2, background: C.purple }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
