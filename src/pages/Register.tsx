import { useEffect, useState, useCallback } from "react";
import AnnouncementBar from "../components/AnnouncementBar";
import Navigation from "../components/Navigation";
import ArrowIcon from "../components/ArrowIcon";

/* ─── Reveal observer ─── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  trade: string;
  size: string;
  pain: string;
  bestTime: string;
};

export default function Register() {
  useReveal();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({
    name: "", company: "", email: "", phone: "",
    trade: "", size: "", pain: "", bestTime: "Anytime",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const maxStep = 3;

  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
      setData((d) => ({ ...d, [field]: value }));
      setErrors((e) => ({ ...e, [field]: false }));
    },
    []
  );

  const validate = useCallback(
    (s: number): boolean => {
      const e: Record<string, boolean> = {};
      if (s === 1) {
        if (!data.name.trim()) e.name = true;
        if (!data.company.trim()) e.company = true;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = true;
        if (data.phone.replace(/\D/g, "").length < 7) e.phone = true;
      }
      if (s === 2) {
        if (!data.trade) e.trade = true;
        if (!data.size) e.size = true;
      }
      setErrors(e);
      return Object.keys(e).length === 0;
    },
    [data]
  );

  const submitToGoogle = useCallback((d: FormData) => {
    const endpoint =
      "https://docs.google.com/forms/d/e/1FAIpQLSdVHVOLAKsEzdLh5QrPwCC4w-0o2Q5RCoFRVSRjNqaLxFfyzw/formResponse";
    const sizeMap: Record<string, string> = {
      "Just me": "1",
      "2–5": "2-4",
      "6–15": "5-9",
      "16–50": "10+",
      "50+": "10+",
    };
    const painFull = [
      d.pain.trim(),
      `Trade: ${d.trade}`,
      `Team size: ${d.size}`,
      `Best time: ${d.bestTime}`,
    ]
      .filter(Boolean)
      .join(" | ");
    const fd = new URLSearchParams();
    fd.append("entry.1664697021", d.name);
    fd.append("entry.1987023741", d.email);
    fd.append("entry.941583503", d.phone);
    fd.append("entry.453765133", d.company);
    fd.append("entry.121676930", sizeMap[d.size] || "1");
    fd.append("entry.533853441", painFull);
    fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: fd.toString(),
    }).catch(() => {});
  }, []);

  const next = useCallback(() => {
    if (!validate(step)) return;
    if (step < maxStep) setStep(step + 1);
    else {
      submitToGoogle(data);
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, validate, data, submitToGoogle]);

  const back = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const firstName = data.name.split(" ")[0] || "friend";

  const summary = [
    ["Name", data.name || "—"],
    ["Company", data.company || "—"],
    ["Email", data.email || "—"],
    ["Phone", data.phone || "—"],
    ["Trade", data.trade || "—"],
    ["Team size", data.size || "—"],
    ["Best time", data.bestTime || "—"],
  ];

  return (
    <>
      <title>Register — Kaliber Autonomy</title>
      <meta name="description" content="Register your interest in Kaliber Autonomy. Two-minute form. A founder reviews every submission personally and reaches out within 24 hours." />
      <meta property="og:title" content="Register — Kaliber Autonomy" />
      <meta property="og:description" content="Two minutes. No pitch deck. Tell us about your business. A founder reviews every submission personally." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href="https://kaliberautonomy.com/register.html" />
      <meta name="theme-color" content="#0E0E0C" />

      <a href="#main" className="skip-link">Skip to content</a>
      <AnnouncementBar />
      <Navigation />

      <style>{`
        .reg-layout { display: grid; grid-template-columns: 1fr 1.3fr; min-height: calc(100vh - 100px); }
        @media (max-width: 900px) { .reg-layout { grid-template-columns: 1fr; } }

        .reg-left { background: var(--ink); color: var(--bone); padding: 72px 56px; position: relative; overflow: hidden; }
        @media (max-width: 900px) { .reg-left { padding: 48px 24px; } }
        .reg-left::before {
          content: ''; position: absolute; inset: 0;
          background-image: linear-gradient(rgba(244,241,234,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,234,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%);
        }
        .reg-left-inner { position: relative; max-width: 480px; }
        .reg-left .eyebrow { color: var(--amber); margin-bottom: 32px; }
        .reg-left .eyebrow::before { background: var(--amber); }
        .reg-left h1 { font-size: clamp(40px, 5vw, 64px); letter-spacing: -0.035em; line-height: 1; color: var(--bone); }
        .reg-left h1 .italic-serif { color: var(--amber); }
        .reg-left p { margin-top: 24px; max-width: 42ch; color: var(--steel-2); font-size: 15px; line-height: 1.6; }
        .reg-contact { margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--rule-bone); font-family: var(--f-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--steel-2); line-height: 2; }
        .reg-contact a { color: var(--amber); text-decoration: underline; text-underline-offset: 3px; }

        .reg-right { background: var(--bone); padding: 72px 56px; display: flex; flex-direction: column; }
        @media (max-width: 900px) { .reg-right { padding: 48px 24px; } }

        .form-step { display: none; }
        .form-step.active { display: block; }
        .form-step h2 { font-size: clamp(30px, 3.8vw, 40px); letter-spacing: -0.03em; margin-bottom: 10px; }
        .form-step h2 .italic-serif { color: var(--amber-ink); }
        .form-step .intro { color: rgba(14,14,12,0.65); font-size: 14px; margin-bottom: 32px; }

        .progress { display: flex; gap: 8px; margin-bottom: 32px; }
        .progress .p { flex: 1; height: 3px; background: var(--rule); border-radius: 2px; transition: background 0.3s; }
        .progress .p.done { background: var(--ink); }
        .progress .p.active { background: var(--amber); }

        .field { margin-bottom: 20px; }
        .field label { display: block; font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--steel); margin-bottom: 8px; font-weight: 500; }
        .field label .req { color: var(--amber-ink); margin-left: 3px; }
        .field input, .field textarea, .field select { width: 100%; padding: 13px 15px; border: 1px solid var(--rule-strong); background: #fff; border-radius: 3px; font-family: var(--f-body); font-size: 15px; color: var(--ink); transition: border-color 0.15s; }
        .field input:focus, .field textarea:focus, .field select:focus { outline: none; border-color: var(--ink); }
        .field textarea { resize: vertical; min-height: 90px; }
        .field.error input, .field.error textarea, .field.error select { border-color: oklch(0.6 0.2 25); }
        .field .err-msg { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: oklch(0.55 0.2 25); margin-top: 5px; display: none; }
        .field.error .err-msg { display: block; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 600px) { .field-row { grid-template-columns: 1fr; } }

        .pill-group { display: flex; flex-wrap: wrap; gap: 8px; }
        .pill-opt { padding: 10px 16px; border: 1px solid var(--rule-strong); background: #fff; border-radius: 999px; font-size: 13px; cursor: pointer; transition: all 0.15s; }
        .pill-opt:hover { background: var(--bone-2); }
        .pill-opt.selected { background: var(--ink); color: var(--bone); border-color: var(--ink); }

        .form-nav { margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--rule); display: flex; justify-content: space-between; align-items: center; }
        .btn-text { background: none; padding: 10px 14px; font-size: 14px; opacity: 0.6; cursor: pointer; border: none; }
        .btn-text:hover { opacity: 1; }
        .btn-text:disabled { opacity: 0.25; cursor: not-allowed; }

        .confirm-mark { width: 60px; height: 60px; border-radius: 50%; background: var(--amber); display: grid; place-items: center; color: var(--ink); margin-bottom: 24px; }
        .confirm-summary { margin-top: 24px; background: #fff; border: 1px solid var(--rule); border-radius: 4px; }
        .confirm-summary .sum-row { display: grid; grid-template-columns: 140px 1fr; gap: 14px; padding: 14px 18px; border-bottom: 1px solid var(--rule); font-size: 14px; }
        .confirm-summary .sum-row:last-child { border-bottom: 0; }
        .confirm-summary .k { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.14em; color: var(--steel); text-transform: uppercase; }

        .arr-svg { width: 14px; height: 14px; }
      `}</style>

      <main className="reg-layout" id="main">
        <aside className="reg-left">
          <div className="reg-left-inner reveal" style={{ "--stagger": 0 } as React.CSSProperties}>
            <div className="eyebrow">Register your interest</div>
            <h1>
              Two minutes.{" "}
              <span className="italic-serif">No pitch deck.</span>
            </h1>
            <p>
              Tell us about your business. A founder reviews every submission
              personally and reaches out within 24 hours — no automated
              sequences.
            </p>
            <div className="reg-contact">
              Prefer to talk? <br />
              <a href="tel:2898026510">(289) 802-6510</a>
            </div>
          </div>
        </aside>

        <section className="reg-right">
          <div className="reveal" style={{ "--stagger": 1 } as React.CSSProperties}>
            <div className="progress">
              <div className={`p ${step >= 1 ? (step > 1 ? "done" : "active") : ""}`} data-p="1"></div>
              <div className={`p ${step >= 2 ? (step > 2 ? "done" : "active") : ""}`} data-p="2"></div>
              <div className={`p ${step >= 3 ? (step > 3 ? "done" : "active") : ""}`} data-p="3"></div>
            </div>

            <form
              id="regForm"
              noValidate
              onSubmit={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
                if (e.key === "Enter") { e.preventDefault(); next(); }
              }}
            >
              {/* Step 1 */}
              <div className={`form-step ${step === 1 ? "active" : ""}`} data-step="1">
                <h2>
                  Let's start with{" "}
                  <span className="italic-serif">you.</span>
                </h2>
                <p className="intro">Who are we talking to?</p>

                <div className="field-row">
                  <div className={`field ${errors.name ? "error" : ""}`}>
                    <label htmlFor="reg-name">
                      Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="reg-name"
                      name="name"
                      autoComplete="name"
                      value={data.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      aria-describedby="err-name"
                    />
                    <div className="err-msg" id="err-name" role="alert">
                      Required
                    </div>
                  </div>
                  <div className={`field ${errors.company ? "error" : ""}`}>
                    <label htmlFor="reg-company">
                      Company <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="reg-company"
                      name="company"
                      autoComplete="organization"
                      value={data.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      aria-describedby="err-company"
                    />
                    <div className="err-msg" id="err-company" role="alert">
                      Required
                    </div>
                  </div>
                </div>

                <div className={`field ${errors.email ? "error" : ""}`}>
                  <label htmlFor="reg-email">
                    Email <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    aria-describedby="err-email"
                  />
                  <div className="err-msg" id="err-email" role="alert">
                    Valid email required
                  </div>
                </div>

                <div className={`field ${errors.phone ? "error" : ""}`}>
                  <label htmlFor="reg-phone">
                    Phone <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    id="reg-phone"
                    name="phone"
                    autoComplete="tel"
                    placeholder="(555) 555-5555"
                    value={data.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    aria-describedby="err-phone"
                  />
                  <div className="err-msg" id="err-phone" role="alert">
                    Valid phone required
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`form-step ${step === 2 ? "active" : ""}`} data-step="2">
                <h2>
                  About your{" "}
                  <span className="italic-serif">business.</span>
                </h2>
                <p className="intro">Helps us size the scope.</p>

                <div className={`field ${errors.trade ? "error" : ""}`}>
                  <label>
                    Trade <span className="req">*</span>
                  </label>
                  <div className="pill-group" role="radiogroup" aria-label="Select your trade">
                    {["HVAC", "Plumbing", "Electrical", "Construction", "Roofing", "Home Services", "Other"].map(
                      (t) => (
                        <div
                          key={t}
                          className={`pill-opt ${data.trade === t ? "selected" : ""}`}
                          onClick={() => updateField("trade", t)}
                          role="radio"
                          aria-checked={data.trade === t}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === " " || e.key === "Enter") {
                              e.preventDefault();
                              updateField("trade", t);
                            }
                          }}
                        >
                          {t}
                        </div>
                      )
                    )}
                  </div>
                  <div className="err-msg" id="err-trade" role="alert">
                    Pick one
                  </div>
                </div>

                <div className={`field ${errors.size ? "error" : ""}`}>
                  <label>
                    Team size <span className="req">*</span>
                  </label>
                  <div className="pill-group" role="radiogroup" aria-label="Select team size">
                    {["Just me", "2–5", "6–15", "16–50", "50+"].map((s) => (
                      <div
                        key={s}
                        className={`pill-opt ${data.size === s ? "selected" : ""}`}
                        onClick={() => updateField("size", s)}
                        role="radio"
                        aria-checked={data.size === s}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            updateField("size", s);
                          }
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="err-msg" id="err-size" role="alert">
                    Pick one
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`form-step ${step === 3 ? "active" : ""}`} data-step="3">
                <h2>
                  What's the{" "}
                  <span className="italic-serif">biggest pain?</span>
                </h2>
                <p className="intro">
                  Two sentences is fine. We'll dig in on the call.
                </p>

                <div className="field">
                  <label htmlFor="reg-pain">Your biggest time-sink</label>
                  <textarea
                    id="reg-pain"
                    name="pain"
                    placeholder="e.g. Missed calls after hours. Estimates that never get followed up on. Manual scheduling when jobs run over."
                    value={data.pain}
                    onChange={(e) => updateField("pain", e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Best time to reach you</label>
                  <div className="pill-group" role="radiogroup" aria-label="Preferred contact time">
                    {["Morning", "Afternoon", "Evening", "Anytime"].map((t) => (
                      <div
                        key={t}
                        className={`pill-opt ${data.bestTime === t ? "selected" : ""}`}
                        onClick={() => updateField("bestTime", t)}
                        role="radio"
                        aria-checked={data.bestTime === t}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            updateField("bestTime", t);
                          }
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 4 — Confirmation */}
              <div
                className={`form-step ${step === 4 ? "active" : ""}`}
                data-step="4"
                aria-live="polite"
              >
                <div className="confirm-mark">
                  <svg width="24" height="24" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 13l5 5 9-11" />
                  </svg>
                </div>
                <h2>
                  You're on the list,{" "}
                  <span className="italic-serif">{firstName}.</span>
                </h2>
                <p className="intro">
                  A founder will reach out within 24 hours. No auto-sequences —
                  just a real call.
                </p>
                <div className="confirm-summary">
                  {summary.map(([k, v], i) => (
                    <div className="sum-row" key={i}>
                      <div className="k">{k}</div>
                      <div>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a href="#/demo" className="btn btn-primary" aria-label="See the demo while you wait">
                    See the demo while you wait <ArrowIcon />
                  </a>
                  <a href="#/" className="btn btn-ghost" aria-label="Back to home">
                    Back to home
                  </a>
                </div>
              </div>

              {/* Form nav */}
              {step <= maxStep && (
                <div className="form-nav" id="formNav">
                  <button
                    type="button"
                    className="btn-text"
                    id="backBtn"
                    disabled={step <= 1}
                    onClick={back}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className={`btn ${step === maxStep ? "btn-amber" : "btn-primary"}`}
                    id="nextBtn"
                    onClick={next}
                  >
                    {step === maxStep ? "Submit" : "Continue"}{" "}
                    <ArrowIcon />
                  </button>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
