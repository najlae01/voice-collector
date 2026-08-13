import { useState } from "react";
import { useLang } from "./i18n";

export default function LoginScreen({ onLogin }) {
  const { t, lang, setLang } = useLang();
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const pinValid = /^\d{4}$/.test(pin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !pinValid) return;
    setBusy(true);
    setError(null);
    try {
      await onLogin(trimmed, pin);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen center">
      <div className="lang-switch">
        <button
          className={lang === "fr" ? "lang-active" : ""}
          onClick={() => setLang("fr")}
        >
          Français
        </button>
        <button
          className={lang === "ar" ? "lang-active" : ""}
          onClick={() => setLang("ar")}
        >
          العربية
        </button>
      </div>

      <div className="card login-card">
        <p className="eyebrow">{t.appName}</p>
        <h1>{t.loginGreeting}</h1>
        <p className="subtle">{t.loginSubtitle}</p>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder={t.pinPlaceholder}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
          />
          <p className="subtle pin-hint">{t.pinHint}</p>
          {error && <p className="error">{error}</p>}
          <button
            type="submit"
            className="primary"
            disabled={busy || !name.trim() || !pinValid}
          >
            {busy ? t.loadingButton : t.startButton}
          </button>
        </form>
      </div>
    </div>
  );
}
