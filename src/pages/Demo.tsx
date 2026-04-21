import { useEffect, useState, useRef, useCallback } from "react";
import AnnouncementBar from "../components/AnnouncementBar";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

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

/* ─── Scenario 1: Missed Call Textback ─── */
function ScenarioTextback() {
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);
  const smsBodyRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStep(0);
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (step >= 3 && smsBodyRef.current) {
      smsBodyRef.current.scrollTop = smsBodyRef.current.scrollHeight;
    }
  }, [step]);

  const play = useCallback(() => {
    if (playing) { reset(); return; }
    setPlaying(true); setStep(0);
    const isMobile = window.matchMedia("(max-width: 780px)").matches;
    const m = isMobile ? 1.5 : 1;
    const t: number[] = [];
    t.push(window.setTimeout(() => setStep(1), 600 * m));
    t.push(window.setTimeout(() => setStep(2), 2400 * m));
    t.push(window.setTimeout(() => setStep(3), 4800 * m));
    t.push(window.setTimeout(() => setStep(4), 7200 * m));
    t.push(window.setTimeout(() => setStep(5), 9600 * m));
    t.push(window.setTimeout(() => setStep(6), 12000 * m));
    t.push(window.setTimeout(() => { setStep(7); setPlaying(false); }, 14500 * m));
    timers.current = t;
  }, [playing, reset]);

  useEffect(() => reset, [reset]);

  const steps = [
    { label: "Customer calls your business number", done: step >= 1 },
    { label: "You miss the call (on a job, in traffic)", done: step >= 2 },
    { label: "Kaliber sends personalized SMS in 30s", done: step >= 3 },
    { label: "Customer replies, qualifies the job", done: step >= 4 },
    { label: "Booking link sent, appointment scheduled", done: step >= 5 },
    { label: "Synced to your business calendar", done: step >= 7 },
  ];

  return (
    <div className="scenario-wrap">
      <div className="scenario-top">
        <div>
          <h2>Missed call → Auto text → Booking</h2>
          <p className="scenario-sub">
            A customer calls while you're on a job. Within 30 seconds, they
            receive a text. Watch the phone, timeline, and your calendar.
          </p>
        </div>
        <button
          className={`play-btn ${playing ? "playing" : ""}`}
          onClick={play}
          aria-label={playing ? "Replay demo" : "Play demo"}
        >
          {playing ? (
            <><svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" style={{ width: 14, height: 14 }}><rect x="2" y="2" width="4" height="10" rx="1"/><rect x="8" y="2" width="4" height="10" rx="1"/></svg>Replay</>
          ) : (
            <><svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" style={{ width: 14, height: 14 }}><path d="M4 2l10 5-10 5V2z"/></svg>Play demo</>
          )}
        </button>
      </div>

      <div className="demo-body">
        {/* Left: timeline + calendar */}
        <div className="demo-left">
          <div className="step-list">
            {steps.map((s, i) => (
              <div key={i} className={`step-item ${step >= i + 1 ? (step > i + 1 ? "done" : "active") : ""}`}>
                <span className="step-num">{i + 1}</span>
                <span className="step-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="status-box">
            <div className="status-label">Status</div>
            <div className="status-value">
              {step === 0 && "Waiting to start..."}
              {step === 1 && "Incoming call from (416) 555-0142"}
              {step === 2 && "Call missed after 5 rings"}
              {step === 3 && "Auto-text sent successfully"}
              {step === 4 && "Customer engaged via SMS"}
              {step === 5 && "Appointment booked!"}
              {step === 6 && "Writing to calendar..."}
              {step >= 7 && "Synced to business calendar"}
            </div>
            {step >= 3 && (
              <div className="meta-row">
                <span className="meta-tag">Response time: 28s</span>
                <span className="meta-tag">Lead score: Hot</span>
              </div>
            )}
          </div>

          {/* Business Calendar — appears at final step */}
          {step >= 7 && (
            <div className="calendar-panel shown">
              <div className="cal-header">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Your Business Calendar</span>
              </div>
              <div className="cal-event">
                <div className="cal-dot" aria-hidden="true"></div>
                <div className="cal-info">
                  <div className="cal-title">AC Repair — Sarah M.</div>
                  <div className="cal-meta">Thursday 2:00 PM – 4:00 PM</div>
                  <div className="cal-meta">(416) 555-0142 · Blowing warm air</div>
                  <div className="cal-source">Added by Kaliber Auto-Text</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: phone mockup */}
        <div className="phone">
          <div className="phone-screen">
            <div className="phone-notch" aria-hidden="true"></div>
            <div className="phone-status" aria-hidden="true">
              <span>9:41</span>
              <span>5G</span>
            </div>

            {/* Ringing view */}
            <div className="phone-view view-ring" style={{ display: step >= 1 && step < 3 ? "flex" : "none" }}>
              <div style={{ textAlign: "center", marginTop: 60 }}>
                <div className={`ring-label ${step === 2 ? "missed" : ""}`}>{step === 2 ? "Missed Call" : "Incoming Call"}</div>
                <div className="ring-name">Sarah M.</div>
                <div className="ring-num">(416) 555-0142</div>
              </div>
              <div className="ring-avatar" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="ring-btns">
                <div className="ring-btn decline">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </div>
                <div className="ring-btn accept">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
              </div>
            </div>

            {/* SMS view */}
            <div className="sms-view" style={{ display: step >= 3 ? "flex" : "none" }}>
              <div className="sms-header">
                <div className="from">Kaliber Auto-Text</div>
                <div className="num">+1 (289) 802-6510</div>
              </div>
              <div className="sms-body" ref={smsBodyRef}>
                <div className={`msg in ${step >= 3 ? "shown" : ""}`}>
                  Hi! Sorry we missed your call. We're on a job right now. What can we help you with today?
                </div>
                <div className={`msg-time ${step >= 3 ? "shown" : ""}`}>Just now</div>
                <div className={`msg out ${step >= 4 ? "shown" : ""}`}>
                  Hey, my AC is blowing warm air. Need someone to take a look.
                </div>
                <div className={`msg-time ${step >= 4 ? "shown" : ""}`}>Just now</div>
                <div className={`typing ${step === 4 ? "shown" : ""}`} aria-hidden="true">
                  <span></span><span></span><span></span>
                </div>
                <div className={`msg in ${step >= 5 ? "shown" : ""}`}>
                  No problem! We've got availability Thursday 2-4pm or Friday morning. Which works?
                </div>
                <div className={`msg out ${step >= 6 ? "shown" : ""}`}>
                  Thursday 2pm works great
                </div>
                <div className={`msg in ${step >= 6 ? "shown" : ""}`}>
                  Perfect — you're booked for Thursday 2-4pm. We'll send a reminder the day before!
                </div>
              </div>
            </div>

            {/* Idle / start state */}
            {step === 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#888", fontSize: 13, textAlign: "center" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" style={{ marginBottom: 16 }}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>
                Press "Play demo" to start
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Scenario 2: Website Chat ─── */
function ScenarioChat() {
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const timers = useRef<number[]>([]);

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStep(0);
    setPlaying(false);
    setChatOpen(false);
  }, []);

  const play = useCallback(() => {
    if (playing) { reset(); return; }
    setPlaying(true); setStep(0); setChatOpen(false);
    const m = window.matchMedia("(max-width: 780px)").matches ? 1.5 : 1;
    const t: number[] = [];
    t.push(window.setTimeout(() => setStep(1), 800 * m));
    t.push(window.setTimeout(() => { setStep(2); setChatOpen(true); }, 2400 * m));
    t.push(window.setTimeout(() => setStep(3), 4200 * m));
    t.push(window.setTimeout(() => setStep(4), 6400 * m));
    t.push(window.setTimeout(() => setStep(5), 8600 * m));
    t.push(window.setTimeout(() => { setStep(6); setPlaying(false); }, 10500 * m));
    timers.current = t;
  }, [playing, reset]);

  useEffect(() => reset, [reset]);

  const steps = [
    { label: "Visitor lands on your site", done: step >= 1 },
    { label: "Chat bubble appears with greeting", done: step >= 2 },
    { label: "Visitor asks about pricing", done: step >= 3 },
    { label: "Bot answers with your rates", done: step >= 4 },
    { label: "Calendar shown, time selected", done: step >= 5 },
    { label: "Appointment confirmed!", done: step >= 6 },
  ];

  return (
    <div className="scenario-wrap">
      <div className="scenario-top">
        <div>
          <h2>Visitor → Chatbot → Booking</h2>
          <p className="scenario-sub">
            A 24/7 chat agent trained on your services, pricing, and voice.
            Watch the website and the conversation unfold.
          </p>
        </div>
        <button
          className={`play-btn ${playing ? "playing" : ""}`}
          onClick={play}
          aria-label={playing ? "Replay demo" : "Play demo"}
        >
          {playing ? (
            <><svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" style={{ width: 14, height: 14 }}><rect x="2" y="2" width="4" height="10" rx="1"/><rect x="8" y="2" width="4" height="10" rx="1"/></svg>Replay</>
          ) : (
            <><svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" style={{ width: 14, height: 14 }}><path d="M4 2l10 5-10 5V2z"/></svg>Play demo</>
          )}
        </button>
      </div>

      <div className="demo-body">
        <div className="demo-left">
          <div className="step-list">
            {steps.map((s, i) => (
              <div key={i} className={`step-item ${step >= i + 1 ? (step > i + 1 ? "done" : "active") : ""}`}>
                <span className="step-num">{i + 1}</span>
                <span className="step-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="status-box">
            <div className="status-label">Status</div>
            <div className="status-value">
              {step === 0 && "Waiting to start..."}
              {step === 1 && "Visitor browsing /ac-repair page"}
              {step === 2 && "Chat widget auto-triggered"}
              {step === 3 && "Visitor asked: AC tune-up cost?"}
              {step === 4 && "Bot replied with pricing + availability"}
              {step === 5 && "Visitor selected Thursday 2pm"}
              {step === 6 && "Booking confirmed — email sent"}
            </div>
            {step >= 4 && (
              <div className="meta-row">
                <span className="meta-tag">Lead captured</span>
                <span className="meta-tag">$149 AC tune-up</span>
              </div>
            )}
          </div>
        </div>

        {/* Website mock */}
        <div className="website-mock">
          <div className="site-bar" aria-hidden="true">
            <div className="site-dots"><span></span><span></span><span></span></div>
            <div className="site-url">yoursite.com/services/ac-repair</div>
          </div>
          <div className="site-body">
            <div className="site-nav">
              <span>Services</span><span>About</span><span>Reviews</span><span>Contact</span>
            </div>
            <h4>AC Repair &amp; Install</h4>
            <div className="site-sub">Serving the Greater Toronto Area</div>
            <div className="site-blurb">
              Professional HVAC services for residential and commercial
              properties. Licensed technicians, upfront pricing, same-day
              service available.
            </div>

            <div
              className="chat-bubble"
              onClick={() => setChatOpen(!chatOpen)}
              role="button"
              tabIndex={0}
              aria-label="Open chat"
              style={{ display: chatOpen ? "none" : "grid", opacity: step >= 2 ? 1 : 0, transition: "opacity 0.5s" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            <div className={`chat-win ${chatOpen ? "open" : ""}`}>
              <div className="chat-header">
                <div className="bot-avatar" aria-hidden="true">K</div>
                <div>
                  <div className="ctitle">Kaliber Assistant</div>
                  <div className="cstatus">Online</div>
                </div>
              </div>
              <div className="chat-body">
                <div className={`cmsg bot ${step >= 2 ? "shown" : ""}`}>
                  Hi there! 👋 I can help you book an appointment or answer questions about our AC services. What do you need?
                </div>
                <div className={`cmsg user ${step >= 3 ? "shown" : ""}`}>
                  How much for an AC tune-up?
                </div>
                <div className={`cmsg bot ${step >= 4 ? "shown" : ""}`}>
                  Our AC tune-up is <strong>$149 + HST</strong>. Includes full inspection, filter check, refrigerant top-up, and a 6-month warranty. Want me to check availability?
                </div>
                <div className={`cmsg user ${step >= 5 ? "shown" : ""}`}>
                  Sure — this week if possible
                </div>
                <div className={`cmsg bot ${step >= 6 ? "shown" : ""}`}>
                  ✅ You're booked for <strong>Thursday 2-4pm</strong>! A confirmation email is on its way. Need anything else?
                </div>
              </div>
              <div className="chat-input">Type a message...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Scenario 3: AI Receptionist ─── */
function ScenarioCall() {
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStep(0);
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (playing) { reset(); return; }
    setPlaying(true); setStep(0);
    const m = window.matchMedia("(max-width: 780px)").matches ? 1.5 : 1;
    const t: number[] = [];
    t.push(window.setTimeout(() => setStep(1), 1000 * m));
    t.push(window.setTimeout(() => setStep(2), 3200 * m));
    t.push(window.setTimeout(() => setStep(3), 5400 * m));
    t.push(window.setTimeout(() => setStep(4), 7600 * m));
    t.push(window.setTimeout(() => setStep(5), 9800 * m));
    t.push(window.setTimeout(() => setStep(6), 12000 * m));
    t.push(window.setTimeout(() => { setStep(7); setPlaying(false); }, 14000 * m));
    timers.current = t;
  }, [playing, reset]);

  useEffect(() => reset, [reset]);

  const steps = [
    { label: "Customer calls your business", done: step >= 1 },
    { label: "AI receptionist picks up", done: step >= 2 },
    { label: "Caller describes the issue", done: step >= 3 },
    { label: "AI qualifies and diagnoses", done: step >= 4 },
    { label: "Availability checked, time offered", done: step >= 5 },
    { label: "Appointment confirmed", done: step >= 6 },
    { label: "Summary sent to you", done: step >= 7 },
  ];

  const turns = [
    { who: "AI" as const, what: "Hello! You've reached Kaliber HVAC. I'm the AI receptionist. How can I help you today?" },
    { who: "Caller" as const, what: "Yeah hi, my furnace is making a weird rattling noise." },
    { who: "AI" as const, what: "A rattling furnace can be a loose panel, blower motor issue, or debris. When did you first notice it?" },
    { who: "Caller" as const, what: "Started last night. It's getting louder." },
    { who: "AI" as const, what: "We should look at that soon. I have tomorrow 1-3pm or Thursday morning. Which works?" },
    { who: "Caller" as const, what: "Tomorrow 1pm is good." },
    { who: "AI" as const, what: "Perfect — you're booked for tomorrow 1-3pm. A text confirmation is on its way. Is this the best number to reach you?" },
  ];

  /* Reverse the turns so newest appears at top */
  const visibleTurns = turns.map((t, i) => ({ ...t, index: i })).filter((t) => step >= t.index + 2).reverse();

  return (
    <div className="scenario-wrap">
      <div className="scenario-top">
        <div>
          <h2>Call → AI receptionist → Booking</h2>
          <p className="scenario-sub">
            A voice on the phone that sounds natural — and never misses a call.
            Watch the call visual and the live transcript.
          </p>
        </div>
        <button
          className={`play-btn ${playing ? "playing" : ""}`}
          onClick={play}
          aria-label={playing ? "Replay demo" : "Play demo"}
        >
          {playing ? (
            <><svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" style={{ width: 14, height: 14 }}><rect x="2" y="2" width="4" height="10" rx="1"/><rect x="8" y="2" width="4" height="10" rx="1"/></svg>Replay</>
          ) : (
            <><svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" style={{ width: 14, height: 14 }}><path d="M4 2l10 5-10 5V2z"/></svg>Play demo</>
          )}
        </button>
      </div>

      <div className="demo-body">
        <div className="demo-left">
          <div className="step-list">
            {steps.map((s, i) => (
              <div key={i} className={`step-item ${step >= i + 1 ? (step > i + 1 ? "done" : "active") : ""}`}>
                <span className="step-num">{i + 1}</span>
                <span className="step-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="status-box">
            <div className="status-label">Call Status</div>
            <div className="status-value">
              {step === 0 && "Waiting to start..."}
              {step >= 1 && step <= 2 && "AI receptionist speaking..."}
              {step >= 3 && step <= 4 && "Gathering job details..."}
              {step >= 5 && step <= 6 && "Booking appointment..."}
              {step >= 7 && "Call complete — summary sent"}
            </div>
            {step >= 5 && (
              <div className="meta-row">
                <span className="meta-tag">Duration: 2m 14s</span>
                <span className="meta-tag">Furnace repair lead</span>
              </div>
            )}
          </div>
        </div>

        {/* Call visual */}
        <div className="call-panel">
          <div className="call-visual">
            <div className={`avatar-ring ${step === 0 ? "idle" : ""}`} aria-hidden="true">
              <span className="avatar-mono">K</span>
            </div>
            <div className="call-status-text">
              {step === 0 && "Standby"}
              {step >= 1 && step < 7 && "Call in progress"}
              {step >= 7 && "Completed"}
            </div>
            <div className="audio-waves" aria-hidden="true" style={{ visibility: step >= 1 && step < 7 ? "visible" : "hidden" }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.15}s` }}></span>
              ))}
            </div>
          </div>

          <div className="call-transcript">
            <h4>Live transcript</h4>
            {/* Render in REVERSE order — newest at top */}
            <div className="transcript-entries">
              {visibleTurns.map((turn) => (
                <div
                  key={turn.index}
                  className={`turn ${turn.who === "AI" ? "ai" : "caller"} shown ${step === turn.index + 2 ? "active" : ""}`}
                >
                  <div className="who">{turn.who}</div>
                  <div className="what">{turn.what}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Scenario 4: Custom Builds ─── */
function ScenarioCustom() {
  const builds = [
    {
      label: "Review requests",
      title: "Auto review collection",
      desc: "After every job, your customer gets a text. Happy? They leave a review. Not happy? You hear about it first — privately.",
      steps: [
        { n: "01", t: "Job completes", p: "Your CRM or calendar triggers the workflow." },
        { n: "02", t: "Text sent", p: "Customer gets a personalized review request via SMS." },
        { n: "03", t: "Review captured", p: "Happy customers leave public reviews. Issues come to you directly." },
      ],
      result: "Average client sees 3x more reviews in 60 days.",
    },
    {
      label: "Employee onboarding",
      title: "New hire automation",
      desc: "Paperwork, tool assignments, training schedules — all triggered the moment you mark someone as hired.",
      steps: [
        { n: "01", t: "Mark hired", p: "Add the new hire to your system." },
        { n: "02", t: "Auto-trigger", p: "Paperwork, calendar invites, and tool requests fire automatically." },
        { n: "03", t: "First day ready", p: "Everything prepared before they walk in the door." },
      ],
      result: "New hires are productive on day one instead of day five.",
    },
    {
      label: "Dispatch routing",
      title: "Smart dispatch",
      desc: "New calls get routed to the right tech based on location, skills, and availability — without manual assignment.",
      steps: [
        { n: "01", t: "Call comes in", p: "Lead details captured automatically." },
        { n: "02", t: "Smart match", p: "System finds the best tech based on location and skillset." },
        { n: "03", t: "Dispatched", p: "Tech gets notified with all job details. Customer gets ETA." },
      ],
      result: "Cut dispatch time from 15 minutes to 30 seconds.",
    },
  ];

  const [active, setActive] = useState(0);
  const b = builds[active];

  return (
    <div className="scenario-wrap">
      <div className="scenario-top">
        <div>
          <h2>If you can describe it. <span className="italic-serif">We can build it.</span></h2>
          <p className="scenario-sub">
            These are the most common custom builds we do for trade businesses.
            Pick one to see how it works.
          </p>
        </div>
      </div>

      <div className="cb-selector">
        {builds.map((build, i) => (
          <button
            key={i}
            className={`cb-chip ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
          >
            {build.label}
          </button>
        ))}
      </div>

      <div className="cb-detail">
        <div className="cb-detail-head">
          <div className="cbe">Custom build</div>
          <h3>{b.title}</h3>
        </div>
        <div className="cb-detail-body">
          <p style={{ color: "rgba(14,14,12,0.7)", marginBottom: 24, maxWidth: "56ch" }}>
            {b.desc}
          </p>
          <ul className="cb-steps">
            {b.steps.map((s, i) => (
              <li key={i}>
                <div className="n">Step / {s.n}</div>
                <div className="t">{s.t}</div>
                <div className="p">{s.p}</div>
              </li>
            ))}
          </ul>
          <div className="cb-result">
            <span className="ico">✓</span>
            <span>{b.result}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Demo Page ─── */
export default function Demo() {
  useReveal();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { num: "Demo 01", title: "Missed call, text back", sub: "A customer calls. You miss it. They get a text within seconds." },
    { num: "Demo 02", title: "Website chat helper", sub: "A 24/7 helper on your site that answers and books jobs." },
    { num: "Demo 03", title: "AI receptionist", sub: "A voice on the phone that sounds real — and never sleeps." },
    { num: "Demo 04", title: "Custom-built systems", sub: "Anything else your business needs — we build it from scratch." },
  ];

  return (
    <>
      <title>See it in action — Kaliber Autonomy</title>
      <meta name="description" content="See Kaliber Autonomy in action. Interactive demos of missed-call textback, website chat, AI receptionist, and custom workflow builds." />
      <meta property="og:title" content="See it in action — Kaliber Autonomy" />
      <meta property="og:description" content="Four simple demos. Try them yourself. No tech-speak. Just pick a scenario and press play." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href="https://kaliberautonomy.com/demo.html" />
      <meta name="theme-color" content="#0E0E0C" />

      <a href="#main" className="skip-link">Skip to content</a>
      <AnnouncementBar />
      <Navigation />

      <section className="d-hero" id="main">
        <div className="wrap">
          <div className="eyebrow reveal" style={{ "--stagger": 0 } as React.CSSProperties}>See it in action</div>
          <h1 className="reveal" style={{ "--stagger": 1 } as React.CSSProperties}>
            Four simple demos.{" "}
            <span className="italic-serif">Try them yourself.</span>
          </h1>
          <p className="reveal" style={{ "--stagger": 2 } as React.CSSProperties}>
            No tech-speak. Just pick a scenario below and press play.
          </p>
        </div>
      </section>

      {/* TABS */}
      <section className="picker">
        <div className="wrap">
          <div className="picker-grid" id="picker">
            {tabs.map((t, i) => (
              <button
                key={i}
                className={`pick ${i === activeTab ? "active" : ""}`}
                onClick={() => setActiveTab(i)}
                aria-pressed={i === activeTab}
              >
                <span className="pick-num">{t.num}</span>
                <span className="pick-title">{t.title}</span>
                <span className="pick-sub">{t.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO CONTENT */}
      <section className="demo-content">
        <div className="wrap">
          {activeTab === 0 && <ScenarioTextback key="textback" />}
          {activeTab === 1 && <ScenarioChat key="chat" />}
          {activeTab === 2 && <ScenarioCall key="call" />}
          {activeTab === 3 && <ScenarioCustom key="custom" />}
        </div>
      </section>

      <Footer />

      <style>{`
        /* ─── Demo page ─── */
        .d-hero { padding: 48px 0 24px; }
        .d-hero h1 { font-size: clamp(40px, 6vw, 84px); letter-spacing: -0.035em; line-height: 0.95; max-width: 16ch; }
        .d-hero h1 .italic-serif { color: var(--amber-ink); }
        .d-hero p { margin-top: 16px; max-width: 48ch; color: rgba(14,14,12,0.72); font-size: 17px; line-height: 1.5; }

        .picker { padding: 0; }
        .picker-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border-top: 2px solid var(--ink); border-bottom: 2px solid var(--ink); }
        @media (max-width: 860px) { .picker-grid { grid-template-columns: repeat(2, 1fr); } .pick:nth-child(-n+2) { border-bottom: 1px solid var(--rule-strong); } }
        @media (max-width: 520px) { .picker-grid { grid-template-columns: 1fr; } .pick { border-bottom: 1px solid var(--rule-strong); } .pick:last-child { border-bottom: 0; } }
        .pick { padding: 20px 20px 16px; border-right: 1px solid var(--rule-strong); background: var(--bone); cursor: pointer; text-align: left; transition: background 0.2s, color 0.2s; display: flex; flex-direction: column; gap: 6px; min-height: 0; font-family: inherit; color: var(--ink); border: none; }
        .pick:last-child { border-right: 0; }
        .pick:hover { background: var(--bone-2); }
        .pick.active { background: var(--ink); color: var(--bone); }
        .pick-num { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.55; }
        .pick-title { font-family: var(--f-display); font-size: 18px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; }
        .pick-sub { font-size: 12px; opacity: 0.65; line-height: 1.35; }
        .pick.active .pick-num { color: var(--amber); opacity: 1; }

        .demo-content { padding: 0 0 80px; background: var(--bone); }

        .scenario-wrap { padding-top: 32px; }
        .scenario-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 28px; flex-wrap: wrap; }
        .scenario-top h2 { font-family: var(--f-display); font-size: clamp(22px, 3vw, 32px); font-weight: 700; letter-spacing: -0.025em; line-height: 1.1; max-width: 20ch; }
        .scenario-top h2 .italic-serif { color: var(--amber-ink); }
        .scenario-sub { color: rgba(14,14,12,0.65); font-size: 14px; max-width: 44ch; line-height: 1.5; margin-top: 6px; }

        .play-btn { background: var(--amber); color: var(--ink); border: none; padding: 12px 22px; font-family: inherit; font-size: 13px; font-weight: 600; border-radius: 3px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: transform 0.15s; flex-shrink: 0; }
        .play-btn:hover { transform: translateY(-1px); }
        .play-btn.playing { background: var(--ink); color: var(--bone); }
        .play-btn svg { width: 14px; height: 14px; }

        .demo-body { display: grid; grid-template-columns: 1fr 320px; gap: 32px; align-items: stretch; }
        @media (max-width: 780px) { .demo-body { grid-template-columns: 1fr; } }

        .demo-left { display: flex; flex-direction: column; gap: 20px; }

        .step-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .step-item { display: grid; grid-template-columns: 28px 1fr; gap: 12px; padding: 10px 14px; background: #fff; border: 1px solid var(--rule); border-radius: 4px; transition: background 0.25s, border-color 0.25s; align-items: center; }
        .step-item.active { border-color: var(--amber); background: oklch(0.97 0.03 75); }
        .step-item.done { opacity: 0.5; }
        .step-item.done .step-num { background: oklch(0.72 0.16 150); color: #fff; }
        .step-num { width: 24px; height: 24px; background: var(--ink); color: var(--bone); border-radius: 50%; display: grid; place-items: center; font-family: var(--f-mono); font-size: 10px; font-weight: 600; flex-shrink: 0; }
        .step-item.active .step-num { background: var(--amber); color: var(--ink); }
        .step-label { font-size: 14px; line-height: 1.35; }

        .status-box { background: var(--ink); color: var(--bone); padding: 16px 18px; border-radius: 4px; min-height: 110px; }
        .status-label { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--amber); margin-bottom: 6px; }
        .status-value { font-size: 14px; line-height: 1.45; min-height: 1.45em; }
        .meta-row { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
        .meta-tag { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--steel-2); background: rgba(244,241,234,0.08); padding: 4px 8px; border-radius: 2px; }

        /* ─── Calendar panel (missed call demo) ─── */
        .calendar-panel { background: #fff; border: 1px solid var(--rule-strong); border-radius: 4px; overflow: hidden; animation: calIn 0.5s var(--ease-out); }
        @keyframes calIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .cal-header { display: flex; align-items: center; gap: 8px; padding: 12px 14px; background: var(--ink); color: var(--bone); font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; }
        .cal-header svg { width: 14px; height: 14px; }
        .cal-event { display: flex; gap: 12px; padding: 14px; align-items: flex-start; }
        .cal-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--amber); flex-shrink: 0; margin-top: 5px; }
        .cal-title { font-family: var(--f-display); font-size: 15px; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 3px; }
        .cal-meta { font-size: 12px; color: rgba(14,14,12,0.6); line-height: 1.45; }
        .cal-source { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--amber-ink); margin-top: 6px; }

        /* ─── Phone mockup ─── */
        .phone { width: 300px; height: 580px; background: #222; border-radius: 32px; padding: 8px; position: relative; box-shadow: 0 20px 50px -15px rgba(14,14,12,0.3); justify-self: center; }
        @media (max-width: 780px) { .phone { justify-self: center; margin: 0 auto; } }
        .phone-screen { background: #fafaf7; border-radius: 26px; height: 100%; padding: 44px 14px 16px; overflow: hidden; position: relative; display: flex; flex-direction: column; }
        .phone-notch { position: absolute; top: 14px; left: 50%; transform: translateX(-50%); width: 90px; height: 20px; background: #222; border-radius: 12px; z-index: 3; }
        .phone-status { position: absolute; top: 20px; left: 22px; right: 22px; display: flex; justify-content: space-between; font-family: var(--f-mono); font-size: 9px; color: #222; z-index: 2; }

        /* Ringing */
        .view-ring { background: linear-gradient(160deg, #1a1a18, #0e0e0c); color: var(--bone); flex-direction: column; align-items: center; justify-content: space-between; padding: 60px 20px 30px; position: absolute; inset: 8px; border-radius: 26px; }
        .ring-label { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel-2); margin-bottom: 6px; transition: color 0.3s; }
        .ring-label.missed { color: #e15b4a; font-weight: 600; }
        .ring-name { font-family: var(--f-display); font-size: 22px; font-weight: 600; letter-spacing: -0.01em; }
        .ring-num { font-family: var(--f-mono); font-size: 11px; color: var(--steel-2); margin-top: 4px; }
        .ring-avatar { width: 90px; height: 90px; border-radius: 50%; background: #3a3a35; display: grid; place-items: center; color: rgba(244,241,234,0.5); }
        .ring-btns { display: flex; gap: 40px; align-items: center; }
        .ring-btn { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; color: #fff; }
        .ring-btn.decline { background: #e15b4a; }
        .ring-btn.accept { background: #5fad52; }

        /* SMS */
        .sms-view { flex: 1; display: flex; flex-direction: column; }
        .sms-header { border-bottom: 1px solid #e3e0d8; padding-bottom: 8px; margin-bottom: 10px; text-align: center; }
        .sms-header .from { font-weight: 600; font-size: 13px; }
        .sms-header .num { font-family: var(--f-mono); font-size: 9px; color: var(--steel); margin-top: 2px; }
        .sms-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
        .msg { max-width: 82%; padding: 8px 11px; border-radius: 14px; font-size: 13px; line-height: 1.3; opacity: 0; transform: translateY(6px); transition: opacity 0.35s, transform 0.35s; }
        .msg.shown { opacity: 1; transform: translateY(0); }
        .msg.in { align-self: flex-start; background: #ebe9e2; color: var(--ink); border-bottom-left-radius: 4px; }
        .msg.out { align-self: flex-end; background: #4b8cf2; color: #fff; border-bottom-right-radius: 4px; }
        .msg-time { font-family: var(--f-mono); font-size: 8px; color: var(--steel); text-align: center; margin: 3px 0 1px; opacity: 0; transition: opacity 0.3s; }
        .msg-time.shown { opacity: 1; }
        .typing { align-self: flex-start; background: #ebe9e2; padding: 8px 12px; border-radius: 14px; display: flex; gap: 3px; opacity: 0; transition: opacity 0.3s; }
        .typing.shown { opacity: 1; }
        .typing span { width: 5px; height: 5px; background: #888; border-radius: 50%; animation: tdot 1.2s infinite; }
        .typing span:nth-child(2) { animation-delay: 0.15s; }
        .typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes tdot { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }

        /* Website mock */
        .website-mock { background: #fff; border: 1px solid var(--rule-strong); border-radius: 6px; overflow: hidden; height: 460px; display: flex; flex-direction: column; position: relative; box-shadow: 0 10px 30px -10px rgba(14,14,12,0.1); }
        .site-bar { background: #ebe9e2; padding: 8px 12px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--rule); }
        .site-dots { display: flex; gap: 4px; }
        .site-dots span { width: 8px; height: 8px; border-radius: 50%; }
        .site-dots span:nth-child(1) { background: #e15b4a; }
        .site-dots span:nth-child(2) { background: #e5a84a; }
        .site-dots span:nth-child(3) { background: #5fad52; }
        .site-url { flex: 1; font-family: var(--f-mono); font-size: 10px; color: var(--steel); background: #fff; padding: 3px 8px; border-radius: 2px; }
        .site-body { flex: 1; padding: 20px 18px; font-family: var(--f-display); position: relative; overflow: hidden; }
        .site-body h4 { font-size: 24px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 6px; }
        .site-body .site-sub { font-size: 12px; color: var(--steel); font-family: var(--f-body); margin-bottom: 16px; }
        .site-body .site-blurb { font-size: 12px; color: rgba(14,14,12,0.5); font-family: var(--f-body); line-height: 1.45; max-width: 36ch; }
        .site-body .site-nav { display: flex; gap: 12px; font-family: var(--f-body); font-size: 11px; color: var(--steel); margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid var(--rule); }

        .chat-bubble { position: absolute; bottom: 14px; right: 14px; width: 48px; height: 48px; background: var(--amber); border-radius: 50%; display: grid; place-items: center; color: var(--ink); box-shadow: 0 6px 16px -4px rgba(0,0,0,0.2); cursor: pointer; transition: transform 0.2s; z-index: 3; }
        .chat-bubble:hover { transform: scale(1.05); }
        .chat-bubble svg { width: 20px; height: 20px; }
        .chat-win { position: absolute; bottom: 14px; right: 14px; width: calc(100% - 28px); max-width: 300px; height: 380px; background: #fff; border-radius: 10px; box-shadow: 0 12px 35px -8px rgba(0,0,0,0.25); display: none; flex-direction: column; overflow: hidden; z-index: 4; }
        .chat-win.open { display: flex; }
        .chat-header { background: var(--ink); color: var(--bone); padding: 12px 14px; display: flex; align-items: center; gap: 10px; }
        .bot-avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--amber); color: var(--ink); display: grid; place-items: center; font-family: var(--f-display); font-weight: 800; font-size: 12px; }
        .chat-header .ctitle { font-size: 12px; font-weight: 600; }
        .chat-header .cstatus { font-family: var(--f-mono); font-size: 8px; color: oklch(0.72 0.16 150); letter-spacing: 0.12em; text-transform: uppercase; display: flex; align-items: center; gap: 4px; margin-top: 2px; }
        .chat-header .cstatus::before { content: ''; width: 5px; height: 5px; background: oklch(0.72 0.16 150); border-radius: 50%; }
        .chat-body { flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; background: #faf9f4; }
        .cmsg { max-width: 82%; padding: 7px 10px; border-radius: 10px; font-size: 12px; line-height: 1.35; opacity: 0; transform: translateY(5px); transition: opacity 0.3s, transform 0.3s; }
        .cmsg.shown { opacity: 1; transform: translateY(0); }
        .cmsg.bot { align-self: flex-start; background: #ebe9e2; }
        .cmsg.user { align-self: flex-end; background: var(--ink); color: var(--bone); }
        .cmsg strong { font-weight: 600; }
        .chat-input { padding: 8px; border-top: 1px solid var(--rule); background: #fff; font-family: var(--f-mono); font-size: 9px; color: var(--steel); text-align: center; }

        /* ─── Call panel ─── */
        .call-panel { display: flex; flex-direction: column; gap: 20px; }
        .call-visual { background: var(--ink); border-radius: 6px; padding: 30px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; min-height: 260px; }
        .avatar-ring { width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, oklch(0.85 0.16 75), var(--amber)); display: grid; place-items: center; position: relative; box-shadow: 0 0 0 0 oklch(0.78 0.16 75 / 0.4); animation: ringPulse 2s ease-out infinite; }
        @keyframes ringPulse { 0% { box-shadow: 0 0 0 0 oklch(0.78 0.16 75 / 0.5); } 100% { box-shadow: 0 0 0 40px oklch(0.78 0.16 75 / 0); } }
        .avatar-ring.idle { animation: none; box-shadow: none; background: #3a3a35; }
        .avatar-mono { font-family: var(--f-display); font-size: 56px; font-weight: 800; color: var(--ink); letter-spacing: -0.05em; }
        .avatar-ring.idle .avatar-mono { color: var(--steel); }
        .call-status-text { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--amber); margin-top: 16px; }
        .avatar-ring.idle ~ .call-status-text { color: var(--steel-2); }

        .audio-waves { display: flex; gap: 4px; align-items: center; margin-top: 14px; height: 20px; }
        .audio-waves span { display: block; width: 3px; height: 8px; background: var(--amber); border-radius: 2px; animation: wave 0.8s ease-in-out infinite alternate; }
        .audio-waves span:nth-child(1) { height: 6px; }
        .audio-waves span:nth-child(2) { height: 12px; }
        .audio-waves span:nth-child(3) { height: 18px; }
        .audio-waves span:nth-child(4) { height: 10px; }
        .audio-waves span:nth-child(5) { height: 14px; }
        @keyframes wave { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }

        /* Transcript — reversed order container */
        .call-transcript { display: flex; flex-direction: column; height: 240px; }
        .call-transcript h4 { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--steel); margin-bottom: 8px; }
        .transcript-entries { display: flex; flex-direction: column; gap: 8px; flex: 1 1 auto; min-height: 0; overflow-y: auto; padding-right: 6px; border: 1px solid rgba(14,14,12,0.1); border-radius: 4px; padding: 8px; background: rgba(255,255,255,0.4); }
        .transcript-entries::-webkit-scrollbar { width: 4px; }
        .transcript-entries::-webkit-scrollbar-thumb { background: rgba(14,14,12,0.2); border-radius: 2px; }
        .turn { font-size: 13px; line-height: 1.4; padding: 10px 12px; border-left: 2px solid transparent; opacity: 0; transform: translateX(-5px); transition: opacity 0.3s, transform 0.3s, border-color 0.15s; background: rgba(14,14,12,0.03); border-radius: 0 4px 4px 0; }
        .turn.shown { opacity: 1; transform: translateX(0); }
        .turn .who { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 4px; color: var(--steel-2); }
        .turn.ai { border-left-color: var(--amber); }
        .turn.ai .who { color: var(--amber); }
        .turn.caller { border-left-color: var(--rule-strong); }
        .turn .what { color: rgba(14,14,12,0.85); }
        .turn.active { background: rgba(232,145,58,0.08); }

        /* Custom builds */
        .cb-selector { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .cb-chip { padding: 10px 18px; border: 1px solid var(--rule-strong); background: #fff; border-radius: 999px; font-size: 13px; cursor: pointer; transition: all 0.15s; font-family: inherit; color: var(--ink); }
        .cb-chip:hover { background: var(--bone-2); }
        .cb-chip.active { background: var(--ink); color: var(--bone); border-color: var(--ink); }
        .cb-detail { background: #fff; border: 1px solid var(--rule-strong); border-radius: 4px; overflow: hidden; }
        .cb-detail-head { padding: 24px 28px; background: var(--ink); color: var(--bone); }
        .cb-detail-head .cbe { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.16em; color: var(--amber); text-transform: uppercase; margin-bottom: 8px; }
        .cb-detail-head h3 { font-size: 26px; letter-spacing: -0.025em; color: var(--bone); }
        .cb-detail-body { padding: 24px 28px; }
        .cb-steps { list-style: none; padding: 0; display: flex; gap: 0; border: 1px solid var(--rule); border-radius: 4px; overflow: hidden; }
        @media (max-width: 700px) { .cb-steps { flex-direction: column; } }
        .cb-steps li { flex: 1; padding: 16px; border-right: 1px solid var(--rule); background: #faf9f4; }
        .cb-steps li:last-child { border-right: 0; }
        @media (max-width: 700px) { .cb-steps li { border-right: 0; border-bottom: 1px solid var(--rule); } .cb-steps li:last-child { border-bottom: 0; } }
        .cb-steps .n { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.16em; color: var(--amber-ink); margin-bottom: 8px; text-transform: uppercase; }
        .cb-steps .t { font-family: var(--f-display); font-size: 15px; font-weight: 600; margin-bottom: 4px; letter-spacing: -0.01em; }
        .cb-steps .p { font-size: 12px; color: rgba(14,14,12,0.65); line-height: 1.45; }
        .cb-result { margin-top: 16px; padding: 14px 16px; background: oklch(0.97 0.03 75); border-radius: 3px; font-size: 13px; line-height: 1.45; display: grid; grid-template-columns: 18px 1fr; gap: 10px; align-items: start; }
        .cb-result .ico { color: var(--amber-ink); font-weight: 700; font-family: var(--f-mono); margin-top: 1px; }

        /* ─── Mobile streamline ─── */
        @media (max-width: 780px) {
          .d-hero { padding: 28px 0 12px; }
          .d-hero p { font-size: 15px; margin-top: 10px; }

          /* Demo selector tabs — make them visibly read as buttons */
          .picker-grid { gap: 10px; border-top: none; border-bottom: none; padding: 14px 0 4px; }
          .pick {
            border: 1.5px solid var(--ink) !important;
            border-radius: 10px;
            padding: 14px 16px;
            background: #fff;
            box-shadow: 0 2px 0 var(--ink);
            min-height: 64px;
            gap: 4px;
          }
          .pick:not(:last-child) { border-bottom: 1.5px solid var(--ink) !important; }
          .pick.active {
            background: var(--amber);
            color: var(--ink);
            border-color: var(--ink) !important;
            box-shadow: 0 2px 0 var(--ink);
          }
          .pick.active .pick-num { color: var(--ink); opacity: 0.7; }
          .pick-title { font-size: 16px; }
          .pick-sub { font-size: 12px; }

          /* Scenario header & play button */
          .scenario-wrap { padding-top: 20px; }
          .scenario-top { gap: 12px; margin-bottom: 16px; }
          .scenario-top h2 { font-size: 22px !important; }
          .scenario-sub { font-size: 13px; margin-top: 4px; }
          .play-btn { width: 100%; justify-content: center; padding: 14px 20px; font-size: 14px; min-height: 48px; }

          /* Side-by-side: steps on left, visual on right */
          .demo-body {
            display: grid;
            grid-template-columns: 1fr auto;
            grid-template-areas:
              "steps  visual"
              "status status"
              "calendar calendar"
              "transcript transcript";
            gap: 10px;
            align-items: start;
          }
          .demo-left { display: contents; }
          .call-panel { display: contents; }
          .step-list { grid-area: steps; gap: 5px; }
          .status-box { grid-area: status; min-height: 0; padding: 10px 12px; }
          .calendar-panel { grid-area: calendar; }
          .status-value { font-size: 13px; }

          /* Step list — compact */
          .step-item { padding: 6px 10px; grid-template-columns: 20px 1fr; gap: 8px; }
          .step-num { width: 20px; height: 20px; font-size: 9px; }
          .step-label { font-size: 12.5px; line-height: 1.3; }

          /* Phone — scale down via zoom so inner content stays proportional */
          .phone {
            grid-area: visual;
            width: 260px;
            height: 500px;
            zoom: 0.56;
            margin: 0;
            justify-self: end;
          }

          /* Website mock — scale down, keep enough internal width */
          .website-mock {
            grid-area: visual;
            width: 300px;
            height: 400px;
            zoom: 0.55;
            justify-self: end;
          }

          /* Call scenario: visual beside steps, transcript full-width below */
          .call-visual {
            grid-area: visual;
            min-height: 0;
            height: 160px;
            width: 150px;
            padding: 12px;
            justify-self: end;
          }
          .avatar-ring { width: 70px; height: 70px; }
          .avatar-mono { font-size: 30px; }
          .call-status-text { margin-top: 8px; font-size: 9px; }
          .audio-waves { margin-top: 8px; height: 14px; }
          .call-transcript { grid-area: transcript; height: 200px; margin-top: 4px; }
          .turn { font-size: 12px; padding: 8px 10px; }

          /* Custom builds — chips as clear buttons */
          .cb-selector { gap: 8px; margin-bottom: 14px; }
          .cb-chip {
            flex: 1 1 calc(50% - 4px);
            padding: 12px 14px;
            min-height: 48px;
            font-size: 13px;
            font-weight: 600;
            border: 1.5px solid var(--ink);
            border-radius: 10px;
            box-shadow: 0 2px 0 var(--ink);
            text-align: center;
          }
          .cb-chip.active { background: var(--amber); color: var(--ink); border-color: var(--ink); }
          .cb-detail-head { padding: 18px 18px; }
          .cb-detail-head h3 { font-size: 20px; }
          .cb-detail-body { padding: 18px; }
          .cb-steps li { padding: 14px; }
          .cb-steps .t { font-size: 14px; }

          .demo-content { padding: 0 0 48px; }
        }
      `}</style>
    </>
  );
}
