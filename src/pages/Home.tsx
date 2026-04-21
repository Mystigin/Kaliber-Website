import { useEffect } from "react";
import AnnouncementBar from "../components/AnnouncementBar";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
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

/* ─── Process number scramble ─── */
function useProcessScramble() {
  useEffect(() => {
    if (window.matchMedia("(max-width: 780px)").matches) return;
    const processSection = document.querySelector(".process");
    if (!processSection) return;
    const nums = processSection.querySelectorAll(".pstep-num");
    let triggered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !triggered) {
            triggered = true;
            nums.forEach((el, i) => {
              const final = el.textContent || "";
              let count = 0;
              setTimeout(() => {
                const interval = setInterval(() => {
                  el.textContent = String(
                    Math.floor(Math.random() * 99)
                  ).padStart(2, "0");
                  count++;
                  if (count > 12) {
                    clearInterval(interval);
                    el.textContent = final;
                  }
                }, 30);
              }, i * 150);
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(processSection);
    return () => observer.disconnect();
  }, []);
}

/* ─── FAQ accessibility ─── */
function useFaqA11y() {
  useEffect(() => {
    const btns = document.querySelectorAll(".faq-q");
    const handlers: Array<() => void> = [];
    btns.forEach((btn) => {
      const item = btn.closest(".faq-item");
      if (!item) return;
      const isOpen = item.classList.contains("open");
      (btn as HTMLElement).setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );
      const handler = () => {
        const wasOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach((i) => {
          i.classList.remove("open");
          const b = i.querySelector(".faq-q") as HTMLElement;
          if (b) b.setAttribute("aria-expanded", "false");
        });
        if (!wasOpen) {
          item.classList.add("open");
          (btn as HTMLElement).setAttribute("aria-expanded", "true");
        }
      };
      btn.addEventListener("click", handler);
      handlers.push(() => btn.removeEventListener("click", handler));
    });
    return () => handlers.forEach((fn) => fn());
  }, []);
}

/* ─── Smooth scroll ─── */
function useSmoothScroll() {
  useEffect(() => {
    const handler = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        const t = document.querySelector(href);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    document
      .querySelectorAll('a[href^="#"]')
      .forEach((a) => a.addEventListener("click", handler));
  }, []);
}

export default function Home() {
  useReveal();
  useProcessScramble();
  useFaqA11y();
  useSmoothScroll();

  return (
    <>
      {/* SEO */}
      <title>Kaliber Autonomy — Automation, engineered for the trades</title>
      <meta
        name="description"
        content="Custom automation for HVAC, plumbing, electrical, and construction companies. Lead capture, AI chatbots, and workflow automation — built for the trades."
      />
      <meta property="og:title" content="Kaliber Autonomy — Automation, engineered for the trades" />
      <meta property="og:description" content="Custom automation for HVAC, plumbing, electrical, and construction companies. We're taking on founding clients — rates locked for life." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href="https://kaliberautonomy.com/" />
      <meta name="theme-color" content="#0E0E0C" />

      {/* Skip link */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <AnnouncementBar />
      <Navigation />

      <section className="hero" id="main">
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 36 }}>
            Automation, engineered for the trades
          </div>
          <h1>
            Stop burning time{" "}
            <span className="italic-serif">on busy work.</span>
          </h1>
          <p className="hero-sub">
            Custom automation for HVAC, plumbing, electrical, and construction
            companies. We're taking on a small group of founding clients —
            rates locked in for life.
          </p>
          <div className="hero-cta-row">
            <a href="#/register" className="btn btn-primary" aria-label="Register your interest">
              Register your interest <ArrowIcon />
            </a>
            <a href="#/demo" className="btn btn-ghost" aria-label="See a demo">
              See a demo
            </a>
          </div>
          <div className="hero-meta">
            <span className="gdot" aria-hidden="true"></span>
            Founding rates available · Limited spots
          </div>
        </div>
      </section>

      {/* ─── Inline styles for hero sizing ─── */}
      <style>{`
        .hero { padding: 80px 0 100px; }
        .hero h1 {
          font-size: clamp(56px, 10vw, 156px);
          line-height: 0.9;
          letter-spacing: -0.045em;
          font-weight: 800;
          max-width: 14ch;
        }
        .hero h1 .italic-serif { color: var(--amber-ink); font-size: 0.95em; }
        .hero-sub {
          font-size: clamp(17px, 1.4vw, 20px);
          max-width: 52ch;
          color: rgba(14,14,12,0.7);
          margin: 36px 0 36px;
        }
        .hero-cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-meta {
          margin-top: 32px;
          font-family: var(--f-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--steel);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hero-meta .gdot { width: 6px; height: 6px; background: oklch(0.72 0.16 150); border-radius: 50%; }

        .services { padding: 80px 0; border-top: 1px solid var(--rule-strong); }
        .services-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: end;
          margin-bottom: 48px;
        }
        @media (max-width: 780px) { .services-top { grid-template-columns: 1fr; gap: 24px; } }
        .services-top h2 {
          font-size: clamp(40px, 6vw, 72px);
          letter-spacing: -0.035em;
          line-height: 1;
          max-width: 12ch;
        }
        .services-top h2 .italic-serif { color: var(--amber-ink); }
        .services-top p { color: rgba(14,14,12,0.7); font-size: 16px; max-width: 44ch; }

        .svc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid var(--rule-strong);
          border-bottom: 1px solid var(--rule-strong);
        }
        @media (max-width: 860px) { .svc-grid { grid-template-columns: 1fr; } }
        .svc-card {
          padding: 40px 32px;
          border-right: 1px solid var(--rule);
          display: flex;
          flex-direction: column;
          min-height: 320px;
        }
        .svc-card:last-child { border-right: 0; }
        @media (max-width: 860px) {
          .svc-card { border-right: 0; border-bottom: 1px solid var(--rule); }
          .svc-card:last-child { border-bottom: 0; }
        }
        .svc-num {
          font-family: var(--f-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          color: var(--amber-ink);
          text-transform: uppercase;
          margin-bottom: 40px;
        }
        .svc-card h3 {
          font-size: 28px;
          letter-spacing: -0.025em;
          margin-bottom: 14px;
          line-height: 1.05;
        }
        .svc-card p { font-size: 14px; color: rgba(14,14,12,0.7); line-height: 1.55; }
        .svc-card .chip {
          margin-top: auto;
          padding-top: 28px;
          font-family: var(--f-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--steel);
        }

        .process { padding: 80px 0; background: var(--ink); color: var(--bone); }
        .process h2 {
          font-size: clamp(36px, 5vw, 56px);
          letter-spacing: -0.03em;
          margin-bottom: 48px;
          color: var(--bone);
          max-width: 16ch;
        }
        .process h2 .italic-serif { color: var(--amber); }
        .process-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid var(--rule-bone);
          border-bottom: 1px solid var(--rule-bone);
        }
        @media (max-width: 780px) { .process-row { grid-template-columns: 1fr; } }
        .pstep { padding: 32px; border-right: 1px solid var(--rule-bone); }
        .pstep:last-child { border-right: 0; }
        @media (max-width: 780px) {
          .pstep { border-right: 0; border-bottom: 1px solid var(--rule-bone); }
          .pstep:last-child { border-bottom: 0; }
        }
        .pstep-num {
          font-family: var(--f-display);
          font-size: 72px;
          font-weight: 800;
          color: transparent;
          -webkit-text-stroke: 1px var(--amber);
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 24px;
        }
        .pstep h3 { font-size: 22px; letter-spacing: -0.02em; margin-bottom: 8px; }
        .pstep p { color: var(--steel-2); font-size: 14px; max-width: 28ch; line-height: 1.55; }

        .founding { padding: 80px 0; }
        .founding-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 60px;
          align-items: start;
        }
        @media (max-width: 860px) { .founding-grid { grid-template-columns: 1fr; gap: 32px; } }
        .founding h2 {
          font-size: clamp(40px, 6vw, 80px);
          letter-spacing: -0.035em;
          line-height: 0.98;
        }
        .founding h2 .italic-serif { color: var(--amber-ink); }
        .founding p { margin-top: 24px; color: rgba(14,14,12,0.7); font-size: 16px; max-width: 44ch; }
        .offer-list { list-style: none; border-top: 1px solid var(--rule); padding: 0; }
        .offer-list li {
          display: grid;
          grid-template-columns: 28px 1fr;
          padding: 14px 0;
          border-bottom: 1px solid var(--rule);
          font-size: 15px;
          align-items: center;
        }
        .offer-list .check { color: var(--amber-ink); font-family: var(--f-mono); font-weight: 600; }
        .offer-cta { margin-top: 28px; display: flex; gap: 10px; flex-wrap: wrap; }

        .faq { padding: 80px 0; border-top: 1px solid var(--rule-strong); }
        .faq h2 {
          font-size: clamp(36px, 5vw, 56px);
          letter-spacing: -0.03em;
          margin-bottom: 40px;
        }
        .faq h2 .italic-serif { color: var(--amber-ink); }
        .faq-list { border-top: 1px solid var(--rule); }
        .faq-item { border-bottom: 1px solid var(--rule); }
        .faq-q {
          width: 100%;
          padding: 24px 0;
          display: grid;
          grid-template-columns: 1fr 32px;
          gap: 20px;
          text-align: left;
          align-items: center;
          cursor: pointer;
          font-family: var(--f-display);
          font-size: clamp(18px, 2vw, 24px);
          font-weight: 600;
          letter-spacing: -0.015em;
          background: none;
          border: none;
        }
        .faq-q .ficon {
          width: 28px; height: 28px;
          border: 1px solid var(--rule-strong);
          border-radius: 50%;
          display: grid;
          place-items: center;
          transition: transform 0.3s, background 0.15s, color 0.15s, border-color 0.15s;
          justify-self: end;
        }
        .faq-item.open .ficon { background: var(--ink); color: var(--bone); border-color: var(--ink); transform: rotate(45deg); }

        .faq-a-inner {
          padding: 0 0 24px;
          max-width: 64ch;
          font-size: 15px;
          color: rgba(14,14,12,0.72);
          line-height: 1.6;
        }

        .cta-final {
          background: var(--ink);
          color: var(--bone);
          padding: 100px 0;
          text-align: center;
        }
        .cta-final .eyebrow { color: var(--amber); justify-content: center; margin: 0 auto 24px; }
        .cta-final .eyebrow::before { background: var(--amber); }
        .cta-final h2 {
          font-size: clamp(44px, 8vw, 104px);
          color: var(--bone);
          letter-spacing: -0.04em;
          line-height: 0.95;
          max-width: 14ch;
          margin: 0 auto 28px;
        }
        .cta-final h2 .italic-serif { color: var(--amber); }
        .cta-final .btn-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .cta-final .call {
          margin-top: 28px;
          font-family: var(--f-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--steel-2);
        }
        .cta-final .call a { color: var(--amber); text-decoration: underline; text-underline-offset: 3px; }
        .cta-final .btn-ghost { border-color: var(--rule-bone); color: var(--bone); }
        .cta-final .btn-ghost:hover { background: var(--bone); color: var(--ink); border-color: var(--bone); }

        .arr-svg { width: 14px; height: 14px; }
      `}</style>

      {/* ─── SERVICES ─── */}
      <section className="services" id="services">
        <div className="wrap">
          <div className="services-top">
            <h2 className="reveal" style={{ "--stagger": 0 } as React.CSSProperties}>
              Everything custom.{" "}
              <span className="italic-serif">Nothing off the shelf.</span>
            </h2>
            <p className="reveal" style={{ "--stagger": 1 } as React.CSSProperties}>
              Three core systems, each tailored to your exact operation. If it
              can be automated, we'll build it — scoped around your workflow,
              not a template.
            </p>
          </div>
          <div className="svc-grid">
            <div className="svc-card reveal" style={{ "--stagger": 0 } as React.CSSProperties}>
              <div className="svc-num">Service / 01</div>
              <h3>Lead capture &amp; follow-up</h3>
              <p>
                24/7 capture with sub-minute response times. Stop losing the 50%
                of jobs that go to the first responder.
              </p>
              <div className="chip">Instant SMS · Auto-qualify · CRM logging</div>
            </div>
            <div className="svc-card reveal" style={{ "--stagger": 1 } as React.CSSProperties}>
              <div className="svc-num">Service / 02</div>
              <h3>AI chatbot &amp; booking</h3>
              <p>
                An agent that books appointments and answers questions — trained
                on your pricing, services, and voice.
              </p>
              <div className="chip">Calendar-aware · On-brand · Handoff ready</div>
            </div>
            <div className="svc-card reveal" style={{ "--stagger": 2 } as React.CSSProperties}>
              <div className="svc-num">Service / 03</div>
              <h3>Workflow automation</h3>
              <p>
                Scheduling, data entry, status updates, review asks — the admin
                grind your team shouldn't touch.
              </p>
              <div className="chip">Integrates your stack · Fully custom</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="process">
        <div className="wrap">
          <h2 className="reveal" style={{ "--stagger": 0 } as React.CSSProperties}>
            Three steps.{" "}
            <span className="italic-serif">No fluff.</span>
          </h2>
          <div className="process-row">
            <div className="pstep reveal" style={{ "--stagger": 1 } as React.CSSProperties}>
              <div className="pstep-num">01</div>
              <h3>Audit</h3>
              <p>
                We map your workflows and show you exactly what we'd build —
                before you spend anything.
              </p>
            </div>
            <div className="pstep reveal" style={{ "--stagger": 2 } as React.CSSProperties}>
              <div className="pstep-num">02</div>
              <h3>Build</h3>
              <p>
                Custom system around your operation, integrated with your tools,
                fully tested before launch.
              </p>
            </div>
            <div className="pstep reveal" style={{ "--stagger": 3 } as React.CSSProperties}>
              <div className="pstep-num">03</div>
              <h3>Support</h3>
              <p>
                Ongoing monitoring and refinement. Direct founder access — no
                account managers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOUNDING OFFER ─── */}
      <section className="founding" id="founding">
        <div className="wrap">
          <div className="founding-grid">
            <div className="reveal" style={{ "--stagger": 0 } as React.CSSProperties}>
              <div className="eyebrow" style={{ marginBottom: 24 }}>
                Founding offer
              </div>
              <h2>
                We're new.{" "}
                <span className="italic-serif">That's your advantage.</span>
              </h2>
              <p>
                Discounted rates locked for life, white-glove build, and direct
                founder access. In exchange, honest feedback and the chance to
                earn a testimonial.
              </p>
            </div>
            <div className="reveal" style={{ "--stagger": 1 } as React.CSSProperties}>
              <ul className="offer-list">
                <li>
                  <span className="check">✓</span>
                  <span>Workflow audit &amp; automation roadmap</span>
                </li>
                <li>
                  <span className="check">✓</span>
                  <span>Custom build (1–3 core systems)</span>
                </li>
                <li>
                  <span className="check">✓</span>
                  <span>Lead follow-up, CRM, chatbot setup</span>
                </li>
                <li>
                  <span className="check">✓</span>
                  <span>Onboarding &amp; team training</span>
                </li>
                <li>
                  <span className="check">✓</span>
                  <span>Ongoing support · Monthly founder check-ins</span>
                </li>
              </ul>
              <div className="offer-cta">
                <a href="#/register" className="btn btn-amber" aria-label="Claim a founding spot">
                  Claim a founding spot <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="faq">
        <div className="wrap">
          <h2>
            Quick <span className="italic-serif">answers.</span>
          </h2>
          <div className="faq-list" id="faqList">
            <div className="faq-item open reveal" style={{ "--stagger": 0 } as React.CSSProperties}>
              <button
                className="faq-q"
                aria-expanded="true"
                aria-controls="faq-a-1"
              >
                You're new — why should I trust you?
                <span className="ficon" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2v8M2 6h8" />
                  </svg>
                </span>
              </button>
              <div className="faq-a" id="faq-a-1">
                <div className="faq-a-inner">
                  We don't ask you to. We start by mapping your workflows and
                  showing you exactly what we'd build — before you spend
                  anything. The founding rate reflects that we're early, and
                  you're getting real value for working with us first.
                </div>
              </div>
            </div>
            <div className="faq-item reveal" style={{ "--stagger": 1 } as React.CSSProperties}>
              <button
                className="faq-q"
                aria-expanded="false"
                aria-controls="faq-a-2"
              >
                Will it work with my existing tools?
                <span className="ficon" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2v8M2 6h8" />
                  </svg>
                </span>
              </button>
              <div className="faq-a" id="faq-a-2">
                <div className="faq-a-inner">
                  Almost certainly. We build around your existing stack — CRM,
                  scheduling, phone, email. If something can't be connected,
                  we'll tell you upfront.
                </div>
              </div>
            </div>
            <div className="faq-item reveal" style={{ "--stagger": 2 } as React.CSSProperties}>
              <button
                className="faq-q"
                aria-expanded="false"
                aria-controls="faq-a-3"
              >
                How long does setup take?
                <span className="ficon" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2v8M2 6h8" />
                  </svg>
                </span>
              </button>
              <div className="faq-a" id="faq-a-3">
                <div className="faq-a-inner">
                  A focused 1–2 workflow build goes live in 1–2 weeks. Larger
                  scopes take 3–4 weeks. You'll get a clear timeline before any
                  work starts.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="cta-final">
        <div className="wrap">
          <div className="reveal" style={{ "--stagger": 0 } as React.CSSProperties}>
            <div className="eyebrow">Coming soon — register now</div>
            <h2>
              Be first.{" "}
              <span className="italic-serif">Get the founding rate.</span>
            </h2>
            <div className="btn-row">
              <a href="#/register" className="btn btn-amber" aria-label="Register your interest">
                Register your interest <ArrowIcon />
              </a>
              <a href="#/demo" className="btn btn-ghost" aria-label="See a demo">
                See a demo
              </a>
            </div>
            <div className="call">
              Or call directly —{" "}
              <a href="tel:2898026510">(289) 802-6510</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
