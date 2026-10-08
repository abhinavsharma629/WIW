"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  couple,
  events,
  gallery,
  quizQuestions,
  shoeGameQuestions,
  story,
} from "@/data/wedding";
import {
  RiveCharacterPreview,
  RiveShoeGameStage,
} from "@/components/RiveShoeGame";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const emptyCountdown: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getCountdown(): Countdown {
  const distance = Math.max(
    0,
    new Date(couple.weddingDate).getTime() - Date.now(),
  );

  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

function Monogram() {
  return (
    <span className="monogram" aria-label={`${couple.partnerOne} and ${couple.partnerTwo}`}>
      {couple.partnerOne[0]}
      <i>&</i>
      {couple.partnerTwo[0]}
    </span>
  );
}

function GooglePhotosIcon() {
  return (
    <svg className="album-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285f4" d="M12 2a5 5 0 0 1 5 5v5h-5a5 5 0 0 1 0-10Z" />
      <path fill="#34a853" d="M22 12a5 5 0 0 1-5 5h-5v-5a5 5 0 0 1 10 0Z" />
      <path fill="#fbbc04" d="M12 22a5 5 0 0 1-5-5v-5h5a5 5 0 0 1 0 10Z" />
      <path fill="#ea4335" d="M2 12a5 5 0 0 1 5-5h5v5a5 5 0 0 1-10 0Z" />
    </svg>
  );
}

function AppleAlbumIcon() {
  return (
    <svg className="album-icon apple-album-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.2 7.1C10 5.2 6.4 6 5.3 9.5c-1.5 4.8 2.4 10.5 5 10.5 1 0 1.3-.6 2.1-.6s1.2.6 2.2.6c2.5 0 6.3-5.4 5-10.2-1-3.7-5-4.6-7.4-2.7Z" />
      <path d="M12.4 6.1c.2-2 1.7-3.5 3.8-3.8-.1 2.1-1.6 3.6-3.8 3.8Z" />
    </svg>
  );
}

export default function Home() {
  const [invitationOpen, setInvitationOpen] = useState(false);
  const [countdown, setCountdown] = useState<Countdown>(emptyCountdown);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [activeGame, setActiveGame] = useState<"quiz" | "shoes">("shoes");
  const [guestSide, setGuestSide] = useState<"bride" | "groom" | null>(null);
  const [shoeQuestion, setShoeQuestion] = useState(0);
  const [raisedShoe, setRaisedShoe] = useState<"bride" | "groom" | null>(null);
  const [shoeAnswerReady, setShoeAnswerReady] = useState(false);
  const [shoeScore, setShoeScore] = useState(0);
  const [shoeFinished, setShoeFinished] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    const tick = () => setCountdown(getCountdown());
    const initialTimer = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 1_000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, []);

  const countdownItems = useMemo(
    () =>
      Object.entries(countdown).map(([label, value]) => ({
        label,
        value: String(value).padStart(2, "0"),
      })),
    [countdown],
  );

  function answerQuiz(optionIndex: number) {
    if (optionIndex === quizQuestions[activeQuestion].answer) {
      setQuizScore((score) => score + 1);
    }

    if (activeQuestion === quizQuestions.length - 1) {
      setQuizFinished(true);
      return;
    }

    setActiveQuestion((question) => question + 1);
  }

  function restartQuiz() {
    setActiveQuestion(0);
    setQuizScore(0);
    setQuizFinished(false);
  }

  function chooseGuestSide(side: "bride" | "groom") {
    setGuestSide(side);
    setShoeQuestion(0);
    setRaisedShoe(null);
    setShoeAnswerReady(false);
    setShoeScore(0);
    setShoeFinished(false);
  }

  function chooseShoe(shoe: "bride" | "groom") {
    if (raisedShoe) {
      return;
    }

    setRaisedShoe(shoe);
    setShoeAnswerReady(false);
    if (shoe === shoeGameQuestions[shoeQuestion].answer) {
      setShoeScore((score) => score + 1);
    }
  }

  function advanceShoeGame() {
    if (shoeQuestion === shoeGameQuestions.length - 1) {
      setShoeFinished(true);
      return;
    }

    setShoeQuestion((question) => question + 1);
    setRaisedShoe(null);
    setShoeAnswerReady(false);
  }

  function restartShoeGame() {
    setGuestSide(null);
    setShoeQuestion(0);
    setRaisedShoe(null);
    setShoeAnswerReady(false);
    setShoeScore(0);
    setShoeFinished(false);
  }

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRsvpStatus("sending");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to save RSVP");
      }

      form.reset();
      setRsvpStatus("success");
    } catch {
      setRsvpStatus("error");
    }
  }

  return (
    <main>
      <div className={`invitation-gate ${invitationOpen ? "is-open" : ""}`}>
        <div className="gate-glow" />
        <div className="invitation-card">
          <p className="eyebrow">Together with your families</p>
          <Monogram />
          <h1>You are invited</h1>
          <p>to witness the beginning of our forever</p>
          <button className="button button-gold" onClick={() => setInvitationOpen(true)}>
            Open invitation
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <nav className="site-nav" aria-label="Main navigation">
        <a href="#home" className="nav-mark">
          <Monogram />
        </a>
        <div className="nav-links">
          <a href="#story">Our story</a>
          <a href="#events">The celebration</a>
          <a href="#gallery">Gallery</a>
          <a href="#game">Couple game</a>
        </div>
        <a href="#rsvp" className="nav-rsvp">
          RSVP
        </a>
      </nav>

      <section id="home" className="hero">
        <div className="hero-intro">
          <div className="hero-content">
            <p className="eyebrow reveal">A wedding celebration · {couple.city}</p>
            <h1>
              <span>{couple.partnerOne}</span>
              <i>&</i>
              <span>{couple.partnerTwo}</span>
            </h1>
          </div>
          <div className="hero-summary">
            <p>{couple.tagline}</p>
            <p className="hero-date">{couple.displayDate}</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#rsvp">
                RSVP now <span aria-hidden="true">↗</span>
              </a>
              <a className="text-link" href="#story">
                Our story <span>↓</span>
              </a>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src="/images/abhinav-mishi-cover.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-image-backdrop"
            aria-hidden="true"
          />
          <Image
            src="/images/abhinav-mishi-cover.jpg"
            alt="Abhinav and Mishi enjoying an outdoor adventure together"
            fill
            priority
            sizes="100vw"
            className="hero-image-photo"
          />
          <div className="hero-image-caption">
            <span>Save the date</span>
            <strong>{couple.displayDate}</strong>
          </div>
        </div>
      </section>

      <section className="countdown-section" aria-label="Wedding countdown">
        <div className="section-intro">
          <p className="eyebrow">The wait is almost over</p>
          <h2>Until we say “I do”</h2>
        </div>
        <div className="countdown">
          {countdownItems.map((item) => (
            <div className="countdown-item" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="story" className="story-section">
        <div className="story-portrait">
          <div className="portrait-frame">
            <span>Our favourite chapter</span>
          </div>
        </div>
        <div className="story-content">
          <p className="eyebrow">How it all began</p>
          <h2>A little bit of fate,<br />a lifetime of us.</h2>
          <p className="lead">
            Two lives, one unexpected hello, and countless memories later—we
            cannot wait to celebrate our next chapter with you.
          </p>
          <div className="timeline">
            {story.map((chapter) => (
              <article key={chapter.year}>
                <span>{chapter.year}</span>
                <div>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="events" className="events-section">
        <div className="section-intro centered">
          <p className="eyebrow">Mark your calendar</p>
          <h2>The celebrations</h2>
          <p>Come for the vows, stay for the dancing, and leave with beautiful memories.</p>
        </div>
        <div className="events-grid">
          {events.map((event, index) => (
            <article
              className="event-card"
              key={event.name}
              style={{
                backgroundImage: `linear-gradient(rgba(238, 234, 228, 0.9), rgba(238, 234, 228, 0.9)), url("${event.image}")`,
              }}
            >
              <span className="event-number">0{index + 1}</span>
              <div className="event-icon" aria-hidden="true">{event.icon}</div>
              <p className="event-date">{event.date}</p>
              <h3>{event.name}</h3>
              <p>{event.time}</p>
              <p>{event.venue}</p>
              {"scheduleNote" in event && event.scheduleNote && (
                <p>{event.scheduleNote}</p>
              )}
              <p className="event-dress-code">
                <span>Dress code</span>
                {event.dressCode}
              </p>
              <a href={event.mapUrl} target="_blank" rel="noreferrer">
                View location <span>↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <div className="gallery-heading">
          <div>
            <p className="eyebrow">Frames from our forever</p>
            <h2>Captured in love</h2>
          </div>
          <div className="album-links">
            <a className="text-link" href={couple.googleAlbumUrl} target="_blank" rel="noreferrer">
              <GooglePhotosIcon />
              View Google album <span>↗</span>
            </a>
            <a className="text-link" href={couple.appleAlbumUrl} target="_blank" rel="noreferrer">
              <AppleAlbumIcon />
              View Apple album <span>↗</span>
            </a>
          </div>
        </div>
        <div className="gallery-grid">
          {gallery.map((photo, index) => (
            <button
              className={`gallery-item gallery-item-${index + 1}`}
              key={photo.src}
              onClick={() => setSelectedPhoto(index)}
              aria-label={`Open photo: ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <span>{photo.caption}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="game" className="game-section">
        <div className="game-copy">
          <p className="eyebrow">Join the fun</p>
          <h2>How well do you know the couple?</h2>
          <p>
            Pick a classic quiz or join the wedding shoe game and answer as one
            half of the happy couple.
          </p>
          <div className="game-switcher" aria-label="Choose a game">
            <button
              className={activeGame === "shoes" ? "active" : ""}
              onClick={() => setActiveGame("shoes")}
            >
              Shoe game
            </button>
            <button
              className={activeGame === "quiz" ? "active" : ""}
              onClick={() => setActiveGame("quiz")}
            >
              Couple quiz
            </button>
          </div>
          <div className="game-rule">
            <strong>{activeGame === "shoes" ? shoeGameQuestions.length : quizQuestions.length}</strong>
            <span>quick questions<br />one true love</span>
          </div>
        </div>
        <div className={`quiz-card ${activeGame === "shoes" ? "shoe-game-card" : ""}`}>
          {activeGame === "quiz" && (
            !quizFinished ? (
              <div className="quiz-panel">
                <div className="quiz-progress">
                  <span>Question {activeQuestion + 1}</span>
                  <span>{quizQuestions.length}</span>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${((activeQuestion + 1) / quizQuestions.length) * 100}%` }} />
                </div>
                <h3>{quizQuestions[activeQuestion].question}</h3>
                <div className="quiz-options">
                  {quizQuestions[activeQuestion].options.map((option, index) => (
                    <button key={option} onClick={() => answerQuiz(index)}>
                      <span>{String.fromCharCode(65 + index)}</span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="quiz-result">
                <p className="eyebrow">Your score</p>
                <strong>{quizScore}/{quizQuestions.length}</strong>
                <h3>
                  {quizScore === quizQuestions.length
                    ? "You know us by heart!"
                    : quizScore >= 2
                      ? "You are definitely inner-circle."
                      : "More dance-floor conversations needed!"}
                </h3>
                <button className="button button-dark" onClick={restartQuiz}>Play again</button>
              </div>
            )
          )}

          {activeGame === "shoes" && !guestSide && (
            <div className="side-picker">
              <div className="rive-picker-title">Interactive Rive shoe game</div>
              <p className="eyebrow">The host asks</p>
              <h3>Which side are you cheering for?</h3>
              <p>Choose your side, then raise the bride&apos;s or groom&apos;s shoe for every question.</p>
              <div className="side-buttons">
                <button onClick={() => chooseGuestSide("bride")}>
                  <RiveCharacterPreview role="bride" />
                  <strong>Bride&apos;s side</strong>
                  <small>Play as {couple.partnerTwo}</small>
                </button>
                <button onClick={() => chooseGuestSide("groom")}>
                  <RiveCharacterPreview role="groom" />
                  <strong>Groom&apos;s side</strong>
                  <small>Play as {couple.partnerOne}</small>
                </button>
              </div>
            </div>
          )}

          {activeGame === "shoes" && guestSide && !shoeFinished && (
            <div className="shoe-game">
              <div className="shoe-game-top">
                <span>Playing for {guestSide === "bride" ? couple.partnerTwo : couple.partnerOne}</span>
                <button onClick={restartShoeGame}>Change side</button>
              </div>
              <RiveShoeGameStage
                guestSide={guestSide}
                raisedShoe={raisedShoe}
                result={
                  !shoeAnswerReady || !raisedShoe
                    ? null
                    : raisedShoe === shoeGameQuestions[shoeQuestion].answer
                      ? "correct"
                      : "incorrect"
                }
                onPickupComplete={() => setShoeAnswerReady(true)}
                question={shoeGameQuestions[shoeQuestion].question}
                questionNumber={shoeQuestion + 1}
                totalQuestions={shoeGameQuestions.length}
              />

              {!raisedShoe ? (
                <div className="shoe-choices">
                  <button onClick={() => chooseShoe("bride")}>
                    <span className="shoe-icon bride-shoe">◇</span>
                    Raise the bride&apos;s shoe
                  </button>
                  <button onClick={() => chooseShoe("groom")}>
                    <span className="shoe-icon groom-shoe">◆</span>
                    Raise the groom&apos;s shoe
                  </button>
                </div>
              ) : !shoeAnswerReady ? (
                <div className="shoe-pickup-status" aria-live="polite">
                  <span />
                  {guestSide === "bride" ? couple.partnerTwo : couple.partnerOne} is picking up the shoe...
                </div>
              ) : (
                <div className={`shoe-answer ${raisedShoe === shoeGameQuestions[shoeQuestion].answer ? "correct" : ""}`}>
                  <p>
                    {raisedShoe === shoeGameQuestions[shoeQuestion].answer
                      ? "Perfect match! The couple agrees."
                      : `Good guess! The couple chose ${shoeGameQuestions[shoeQuestion].answer === "bride" ? couple.partnerTwo : couple.partnerOne}.`}
                  </p>
                  <button className="button button-dark" onClick={advanceShoeGame}>
                    {shoeQuestion === shoeGameQuestions.length - 1 ? "See result" : "Next question"}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeGame === "shoes" && shoeFinished && (
            <div className="quiz-result shoe-result">
              <p className="eyebrow">Your couple match</p>
              <strong>{shoeScore}/{shoeGameQuestions.length}</strong>
              <h3>
                {shoeScore === shoeGameQuestions.length
                  ? "You think exactly like the happy couple!"
                  : shoeScore >= 3
                    ? "You would make an excellent wedding-game partner."
                    : "The reception is your chance to know them better!"}
              </h3>
              <button className="button button-dark" onClick={restartShoeGame}>Choose another side</button>
            </div>
          )}
        </div>
      </section>

      <section id="rsvp" className="rsvp-section">
        <div className="rsvp-overlay" />
        <div className="rsvp-copy">
          <p className="eyebrow">Kindly reply by {couple.rsvpBy}</p>
          <h2>Will you join our<br />happily ever after?</h2>
          <p>Your presence would make our celebration complete.</p>
        </div>
        <form className="rsvp-form" onSubmit={submitRsvp}>
          <label>
            Full name
            <input name="name" type="text" placeholder="Your name" maxLength={80} required />
          </label>
          <div className="form-row">
            <label>
              Will you attend?
              <select name="attendance" required defaultValue="">
                <option value="" disabled>Select an answer</option>
                <option value="Joyfully accepts">Joyfully accepts</option>
                <option value="Regretfully declines">Regretfully declines</option>
              </select>
            </label>
            <label>
              Number of guests
              <select name="guests" defaultValue="1">
                {[1, 2, 3, 4, 5].map((count) => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            A note for the couple
            <textarea name="message" placeholder="Share a wish, song request, or dietary note..." maxLength={500} />
          </label>
          <input className="honeypot" name="company" tabIndex={-1} autoComplete="off" />
          <button className="button button-gold" type="submit" disabled={rsvpStatus === "sending"}>
            {rsvpStatus === "sending" ? "Sending..." : "Send RSVP"}
          </button>
          <p className={`form-status ${rsvpStatus}`} aria-live="polite">
            {rsvpStatus === "success" && "Thank you! Your RSVP is safely recorded."}
            {rsvpStatus === "error" && "Something went wrong. Please try again."}
          </p>
        </form>
      </section>

      <footer>
        <Monogram />
        <p>Made with love for our favourite people.</p>
        <p>{couple.displayDate} · {couple.city}</p>
      </footer>

      {selectedPhoto !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo preview">
          <button className="lightbox-close" onClick={() => setSelectedPhoto(null)} aria-label="Close photo">
            ×
          </button>
          <Image
            src={gallery[selectedPhoto].src}
            alt={gallery[selectedPhoto].alt}
            width={1600}
            height={1200}
            sizes="90vw"
          />
          <p>{gallery[selectedPhoto].caption}</p>
        </div>
      )}
    </main>
  );
}
