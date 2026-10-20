"use client";

import { useEffect, useRef, useState } from "react";
import { couple } from "@/data/wedding";
import "./InvitationEnvelope.css";

function BotanicalSprig({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 160 220" fill="none" aria-hidden="true">
      <path d="M28 210C93 151 43 91 125 15M65 157 27 125M73 115l42-22M88 65 65 34" stroke="currentColor" strokeWidth="1.5" />
      <g fill="currentColor" fillOpacity=".55">
        <ellipse cx="39" cy="145" rx="9" ry="24" transform="rotate(-49 39 145)" />
        <ellipse cx="78" cy="161" rx="9" ry="25" transform="rotate(38 78 161)" />
        <ellipse cx="69" cy="103" rx="9" ry="23" transform="rotate(-35 69 103)" />
        <ellipse cx="108" cy="91" rx="8" ry="24" transform="rotate(51 108 91)" />
        <ellipse cx="89" cy="51" rx="7" ry="21" transform="rotate(-32 89 51)" />
        <ellipse cx="122" cy="39" rx="8" ry="22" transform="rotate(45 122 39)" />
      </g>
      <g fill="#c98c75">
        <path d="M28 112c-18-14-20 8-8 11-11 14 9 23 14 8 17 5 22-15 5-15 2-14-13-17-11-4Z" />
        <path d="M62 25c-15-12-17 7-7 9-9 12 8 20 12 7 15 5 19-13 4-13 2-12-11-15-9-3Z" />
      </g>
      <circle cx="29" cy="123" r="3" fill="#e8c47e" />
      <circle cx="63" cy="34" r="2.5" fill="#e8c47e" />
    </svg>
  );
}

export default function InvitationEnvelope({ onOpened }: { onOpened?: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [phase, setPhase] = useState<"sealed" | "opening" | "leaving" | "opened">("sealed");
  const dismissed = phase === "opened";

  useEffect(() => {
    if (dismissed) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    const previousGutter = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = "stable";
    document.body.style.overflow = "hidden";
    // Promote the server-rendered envelope to a modal without an entrance flash.
    dialog.close();
    dialog.showModal();

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.scrollbarGutter = previousGutter;
    };
  }, [dismissed]);

  useEffect(() => {
    if (dismissed) onOpened?.();
  }, [dismissed, onOpened]);

  useEffect(() => {
    if (phase !== "opening" && phase !== "leaving") return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setTimeout(
      () => setPhase(phase === "opening" ? "leaving" : "opened"),
      motion.matches ? 0 : phase === "opening" ? 1700 : 600,
    );
    const finishForReducedMotion = () => {
      if (motion.matches) setPhase("opened");
    };
    motion.addEventListener("change", finishForReducedMotion);
    return () => {
      window.clearTimeout(timer);
      motion.removeEventListener("change", finishForReducedMotion);
    };
  }, [phase]);

  function openInvitation() {
    if (phase !== "sealed") return;
    setPhase(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "opened" : "opening");
  }

  function skipInvitation() {
    setPhase("opened");
  }

  if (dismissed) return null;

  return (
    <dialog
      open
      ref={dialogRef}
      className="envelope-gate"
      data-phase={phase}
      aria-labelledby="envelope-title"
      aria-describedby="envelope-intro"
      onCancel={(event) => {
        event.preventDefault();
        skipInvitation();
      }}
    >
      <BotanicalSprig className="envelope-sprig envelope-sprig-left" />
      <BotanicalSprig className="envelope-sprig envelope-sprig-right" />
      <div className="envelope-experience">
        <header className="envelope-heading">
          <p className="envelope-eyebrow">A little something, sealed with love</p>
          <h2 id="envelope-title">A little envelope.<br />A whole lot of <em>love.</em></h2>
          <p id="envelope-intro">Inside: our next chapter. And a place for you in it.</p>
        </header>

        <div className="envelope-stage">
          <div className="envelope-object">
            <div className="envelope-back" />
            <div className="envelope-letter" aria-hidden={phase === "sealed"}>
              <span className="envelope-letter-heart" aria-hidden="true">&#9825;</span>
              <p>The happy ever after starts here</p>
              <strong>{couple.partnerOne} <i>&amp;</i> {couple.partnerTwo}</strong>
              <span>A lifetime of laughter.<br />A million little adventures. Together.</span>
              <div className="envelope-letter-date">{couple.displayDate}<br />{couple.city}</div>
            </div>
            <div className="envelope-pocket">
              <BotanicalSprig className="envelope-pocket-sprig" />
              <svg className="envelope-fold-lines" viewBox="0 0 600 370" preserveAspectRatio="none" aria-hidden="true">
                <path d="m0 0 300 204L600 0M0 370l221-152m379 152L379 218" />
              </svg>
              <div className="envelope-address">
                <span>To our favourite people</span>
                <strong>{couple.partnerOne} <i>&amp;</i> {couple.partnerTwo}</strong>
                <span>A wedding. A beginning. A very good time.</span>
              </div>
            </div>
            <div className="envelope-flap" />
            <button
              type="button"
              className="envelope-seal"
              onClick={openInvitation}
              disabled={phase !== "sealed"}
              aria-label={`Break the seal and open ${couple.partnerOne} and ${couple.partnerTwo}'s wedding invitation`}
            >
              <span aria-hidden="true">{couple.partnerOne[0]}<i>&amp;</i>{couple.partnerTwo[0]}</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 20S3 14.5 3 8.5C3 3 10 2 12 7c2-5 9-4 9 1.5C21 14.5 12 20 12 20Z" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </div>
          {phase !== "sealed" && (
            <div className="envelope-confetti" aria-hidden="true">
              {Array.from({ length: 14 }, (_, index) => (
                <span key={index} style={{ left: `${12 + (index * 23) % 76}%`, animationDelay: `${0.35 + (index % 5) * 0.04}s` }} />
              ))}
            </div>
          )}
        </div>

        <div className="envelope-action">
          <button className="envelope-open" type="button" onClick={openInvitation} disabled={phase !== "sealed"}>
            Open our invitation <span aria-hidden="true">&#8599;</span>
          </button>
          <p className="envelope-status" role="status">
            {phase === "sealed" ? "Or tap the wax seal. Let the happy begin." : "Opening a lifetime of happy little things..."}
          </p>
        </div>
        <p className="envelope-footer">Good food. Questionable dancing. Your favourite people.</p>
        <button className="envelope-skip" type="button" onClick={skipInvitation}>Skip to the celebration</button>
      </div>
    </dialog>
  );
}
