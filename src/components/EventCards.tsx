"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { events } from "@/data/wedding";

const particles = Array.from({ length: 18 }, (_, index) => index);

export default function EventCards() {
  for (const event of events) {
    preload(event.image, { as: "image", fetchPriority: "low" });
  }

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const activeEventRef = useRef(events[0].id);
  const [activeEvent, setActiveEvent] = useState(events[0].id);
  const [isInView, setIsInView] = useState(false);

  const activateEvent = useCallback((id: string) => {
    if (activeEventRef.current !== id) {
      activeEventRef.current = id;
      setActiveEvent(id);
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid || !("IntersectionObserver" in window)) {
      return;
    }

    let visible = false;
    let frame = 0;
    let layoutDirty = true;
    const posters = Array.from(grid.querySelectorAll<HTMLElement>(".event-poster"));
    let bounds: { element: HTMLElement; top: number; height: number }[] = [];

    const updateAtmosphere = () => {
      frame = 0;
      if (!visible) {
        return;
      }

      if (layoutDirty) {
        bounds = posters.map((element) => ({
          element,
          top: element.offsetTop,
          height: element.offsetHeight,
        }));
        layoutDirty = false;
      }

      const center = window.innerHeight / 2;
      const gridTop = grid.getBoundingClientRect().top;
      const focusedEvent = document.activeElement
        ?.closest(".event-poster")
        ?.getAttribute("data-event");
      let closestEvent: string | undefined;
      let closestDistance = Infinity;

      for (const poster of bounds) {
        const top = gridTop + poster.top;
        if (top + poster.height < center * 0.5 || top > center * 1.5) {
          continue;
        }

        const id = poster.element.dataset.event;
        if (id === focusedEvent) {
          closestEvent = id;
          break;
        }

        const distance = Math.abs(top + poster.height / 2 - center);
        if (
          distance < closestDistance - 1 ||
          (Math.abs(distance - closestDistance) <= 1 && id === activeEventRef.current)
        ) {
          closestDistance = distance;
          closestEvent = id;
        }
      }

      if (closestEvent) {
        activateEvent(closestEvent);
      }
    };

    function queueUpdate() {
      if (visible && !frame) {
        frame = window.requestAnimationFrame(updateAtmosphere);
      }
    }

    function invalidateLayout() {
      layoutDirty = true;
      queueUpdate();
    }

    const resizeObserver =
      "ResizeObserver" in window ? new ResizeObserver(invalidateLayout) : undefined;
    resizeObserver?.observe(grid);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        setIsInView(visible);
        if (visible) {
          queueUpdate();
        }
      },
      { rootMargin: "-10% 0px -10% 0px" },
    );

    observer.observe(section);
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", invalidateLayout);

    return () => {
      observer.disconnect();
      resizeObserver?.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", invalidateLayout);
    };
  }, [activateEvent]);

  useEffect(() => {
    const grid = gridRef.current;
    if (
      !grid ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" },
    );

    grid.dataset.revealReady = "true";
    grid.querySelectorAll(".event-poster").forEach((poster) => {
      observer.observe(poster);
    });

    return () => {
      observer.disconnect();
      delete grid.dataset.revealReady;
    };
  }, []);

  return (
    <section
      id="events"
      className="events-section"
      ref={sectionRef}
      data-active-event={activeEvent}
      data-in-view={isInView}
      aria-labelledby="celebration-title"
    >
      <div className="event-atmosphere" aria-hidden="true">
        <div className="event-atmosphere-stage" data-event={activeEvent}>
          {events.map((event) => (
            <div
              className="event-scene"
              data-event={event.id}
              data-active={activeEvent === event.id}
              key={event.id}
            >
              <span className="event-emblem" />
            </div>
          ))}
          <div className="event-particles">
            {particles.map((index) => (
              <span
                className="event-particle"
                key={index}
                style={{
                  left: `${(index * 37 + 5) % 100}%`,
                  animationDelay: `${-index * 0.8}s`,
                  animationDuration: `${9 + (index % 5) * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="section-intro centered">
        <p className="eyebrow">Your invitation to the good times</p>
        <h2 id="celebration-title">Let the festivities begin</h2>
        <p>Four celebrations. Two families. One gloriously happy beginning.</p>
      </div>
      <div className="events-grid" ref={gridRef}>
        {events.map((event) => (
          <div
            className="event-poster"
            data-event={event.id}
            key={event.id}
            onPointerEnter={(pointer) => {
              if (pointer.pointerType !== "touch") {
                activateEvent(event.id);
              }
            }}
            onFocusCapture={() => activateEvent(event.id)}
          >
            <article
              className="event-card"
              data-event={event.id}
              aria-labelledby={`event-title-${event.id}`}
            >
              <div
                className="event-card-art"
                style={{ backgroundImage: `url("${event.image}")` }}
              >
                <div className="event-card-content">
                  <p className="event-kicker">{event.kicker}</p>
                  <h3 id={`event-title-${event.id}`}>{event.name}</h3>
                  <p className="event-description">{event.description}</p>
                  <div className="event-details">
                    <div className="event-when">
                      <p className="event-date">{event.date}</p>
                      <p className="event-time">{event.time}</p>
                    </div>
                    <p>{event.venue}</p>
                    {"scheduleNote" in event && event.scheduleNote && (
                      <p className="event-schedule-note">{event.scheduleNote}</p>
                    )}
                  </div>
                  <p className="event-dress-code">
                    <span>Dress code</span>
                    {event.dressCode}
                  </p>
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Directions to ${event.name} at ${event.venue}`}
                  >
                    Meet us here <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
