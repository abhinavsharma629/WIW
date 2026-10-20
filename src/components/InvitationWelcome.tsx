"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import InvitationEnvelope from "./InvitationEnvelope";
import "./InvitationWelcome.css";

type Playback = "paused" | "loading" | "playing" | "error";

export default function InvitationWelcome() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const requestRef = useRef(0);
  const [playback, setPlayback] = useState<Playback>("paused");
  const [message, setMessage] = useState("");
  const active = playback === "playing" || playback === "loading";

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      requestRef.current++;
      audio?.pause();
    };
  }, []);

  const playMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) {
      setMessage("Music is not ready yet. Please try again.");
      return;
    }

    const request = ++requestRef.current;
    setPlayback("loading");
    setMessage("");
    audio.volume = 0.35;
    if (audio.error) audio.load();

    try {
      await audio.play();
    } catch (error) {
      if (request !== requestRef.current) return;
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setPlayback("paused");
        setMessage("Tap play to add a little music.");
      } else {
        setPlayback("error");
        setMessage("Our song couldn't play. Tap to try again.");
        console.error("Wedding music playback failed:", error);
      }
    }
  }, []);

  function toggleMusic() {
    if (active) {
      requestRef.current++;
      audioRef.current?.pause();
      setPlayback("paused");
      setMessage("");
    } else {
      void playMusic();
    }
  }

  return (
    <>
      <InvitationEnvelope onOpened={playMusic} />
      <audio
        ref={audioRef}
        src="/audio/wedding-soundtrack.mp3"
        preload="none"
        loop
        aria-hidden="true"
        onPlaying={(event) => {
          if (event.currentTarget.paused) return;
          setPlayback("playing");
          setMessage("");
        }}
        onPause={(event) => {
          if (event.currentTarget.paused) {
            setPlayback((previous) => previous === "error" ? previous : "paused");
          }
        }}
        onWaiting={(event) => {
          if (!event.currentTarget.paused) setPlayback("loading");
        }}
        onError={() => {
          setPlayback("error");
          setMessage("Our song couldn't load. Tap to try again.");
        }}
      />
      <div className="wedding-music" data-state={playback}>
        <p className="wedding-music-status" id="wedding-music-status" role="status">{message}</p>
        <button
          type="button"
          className="wedding-music-button"
          onClick={toggleMusic}
          aria-label={active ? "Pause wedding music" : "Play wedding music"}
          aria-pressed={active}
          aria-describedby="wedding-music-status"
        >
          <svg className="wedding-music-control" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {active ? (
              <path d="M6 5h4v14H6V5Zm8 0h4v14h-4V5Z" />
            ) : (
              <path d="M8 4.5a.75.75 0 0 0-1.1.66v13.68a.75.75 0 0 0 1.1.66l12-6.84a.75.75 0 0 0 0-1.32L8 4.5Z" />
            )}
          </svg>
        </button>
      </div>
    </>
  );
}
