"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { couple, story } from "@/data/wedding";
import "./StoryJourney.css";

const stopNotes = ["Coffee & connection", "A few happy detours", "Destination: forever"];

function buildRoute(stops: number[]) {
  const knots = [0, ...stops, 1000];
  return knots.slice(1).reduce((path, end, index) => {
    const start = knots[index];
    const bend = index % 2 === 0 ? 90 : 10;
    // Equal Y intervals keep the car's scroll position linear on each curve.
    const third = (end - start) / 3;
    return `${path} C ${bend} ${start + third}, ${bend} ${end - third}, 50 ${end}`;
  }, "M 50 0");
}

function StopIcon({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {index === 0 ? (
        <path d="M10 21h23v10a10 10 0 0 1-10 10h-3a10 10 0 0 1-10-10V21ZM33 23h3a5 5 0 0 1 0 10h-3M7 42h31M16 14c-5-5 5-6 0-11M24 14c-5-5 5-6 0-11" />
      ) : index === 1 ? (
        <>
          <path d="m4 37 14-22 14 22H4Zm23-7 8-16 10 23H32M13 23l5 4 5-4" />
          <circle cx="30" cy="8" r="4" />
          <path d="M6 43h36" />
        </>
      ) : (
        <>
          <circle cx="24" cy="30" r="12" />
          <path d="m18 9 6-5 6 5-6 10-6-10ZM18 9h12M24 4v15M6 16l4 2M38 18l4-2M7 7l3 3M38 10l3-3" />
        </>
      )}
    </svg>
  );
}

export default function StoryJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const stopsRef = useRef<HTMLOListElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [activeStop, setActiveStop] = useState(0);
  const [route, setRoute] = useState(() => {
    const stops = story.map((_, index) => ((index + 0.5) / story.length) * 1000);
    return { stops, path: buildRoute(stops) };
  });

  useEffect(() => {
    const section = sectionRef.current;
    const list = stopsRef.current;
    const road = roadRef.current;
    const car = carRef.current;
    if (!section || !list || !road || !car || !("IntersectionObserver" in window)) {
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const chapters = Array.from(list.querySelectorAll<HTMLElement>(".journey-stop"));
    let visible = false;
    let frame = 0;
    let dirty = true;
    let height = 1;
    let width = 1;
    let centers: number[] = [];
    let knots: number[] = [];

    const update = () => {
      frame = 0;
      if (!visible || motion.matches) return;

      if (dirty) {
        height = list.offsetHeight;
        width = road.offsetWidth;
        centers = chapters.map((chapter) => chapter.offsetTop + chapter.offsetHeight / 2);
        const stops = centers.map((center) => (center / height) * 1000);
        knots = [0, ...stops, 1000];
        const path = buildRoute(stops);
        setRoute((previous) => previous.path === path ? previous : { stops, path });
        dirty = false;
      }

      const top = list.getBoundingClientRect().top;
      const distance = window.innerHeight * 0.54 - top;
      const y = Math.max(0, Math.min(1000, (distance / height) * 1000));
      let segment = 0;
      while (segment < knots.length - 2 && y > knots[segment + 1]) segment++;
      const span = knots[segment + 1] - knots[segment];
      const t = (y - knots[segment]) / span;
      const bend = segment % 2 === 0 ? 90 : 10;
      const x = 50 + 3 * (bend - 50) * t * (1 - t);
      const slope = (3 * (bend - 50) * (1 - 2 * t) * width * 10) / (span * height);
      const angle = Math.atan2(1, slope) * 180 / Math.PI + 90;
      car.style.transform = `translate3d(${(x / 100 - 0.5) * width}px, ${y / 1000 * height}px, 0) translate(-50%, -50%) rotate(${angle}deg)`;

      let nearest = 0;
      for (let index = 1; index < centers.length; index++) {
        if (Math.abs(centers[index] - distance) < Math.abs(centers[nearest] - distance)) {
          nearest = index;
        }
      }
      if (nearest !== activeRef.current) {
        activeRef.current = nearest;
        setActiveStop(nearest);
      }
    };

    const queue = () => {
      if (visible && !motion.matches && !frame) frame = window.requestAnimationFrame(update);
    };
    const resize = () => {
      dirty = true;
      queue();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      queue();
    }, { rootMargin: "100px 0px" });
    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(resize) : undefined;
    observer.observe(section);
    resizeObserver?.observe(list);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", resize);
    motion.addEventListener("change", resize);

    return () => {
      observer.disconnect();
      resizeObserver?.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", resize);
      motion.removeEventListener("change", resize);
    };
  }, []);

  return (
    <section id="story" className="story-journey" ref={sectionRef} aria-labelledby="journey-title">
      <div className="journey-heading">
        <div>
          <p className="eyebrow">Our story, the scenic route</p>
          <h2 id="journey-title">How our story <em>began.</em></h2>
          <p>Three favourite stops. One very happy destination.</p>
        </div>
        <a className="journey-start" href={`#story-stop-${story[0].year}`}>
          Let&apos;s go for a drive
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 11 2-6h10l2 6M5 18v2m14-2v2" />
            <rect x="3" y="11" width="18" height="7" rx="2" />
            <circle cx="7" cy="14.5" r="0.8" fill="currentColor" />
            <circle cx="17" cy="14.5" r="0.8" fill="currentColor" />
          </svg>
        </a>
      </div>

      <div className="journey-layout">
        <div className="journey-companion">
          <figure className="journey-postcard">
            <span className="journey-postmark">Two seats.<br />One forever.</span>
            <div className="journey-photo">
              <Image
                src="/images/our-favourite-chapter.jpg"
                alt={`${couple.partnerOne} and ${couple.partnerTwo} together`}
                fill
                sizes="(max-width: 800px) 90vw, 40vw"
              />
            </div>
            <figcaption>A little bit of fate. A lifetime of us.</figcaption>
          </figure>
          <div className="journey-dashboard">
            <div>
              <span>Travelling with</span>
              <strong>{couple.partnerOne} &amp; {couple.partnerTwo}</strong>
            </div>
            <div className="journey-dashboard-stop">
              <span>Now passing</span>
              <strong>{story[activeStop].year}</strong>
            </div>
          </div>
          <p className="journey-scroll-note">You scroll. We take the scenic route.</p>
        </div>

        <div className="journey-route">
          <div className="journey-road" ref={roadRef} aria-hidden="true">
            <svg className="journey-road-svg" viewBox="0 0 100 1000" preserveAspectRatio="none">
              <path className="journey-road-edge" d={route.path} vectorEffect="non-scaling-stroke" />
              <path className="journey-road-surface" d={route.path} vectorEffect="non-scaling-stroke" />
              <path className="journey-road-dashes" d={route.path} vectorEffect="non-scaling-stroke" />
            </svg>
            {route.stops.map((position, index) => (
              <span className="journey-mile-marker" data-passed={index <= activeStop} key={story[index].year} style={{ top: `${position / 10}%` }} />
            ))}
            <div className="journey-car" ref={carRef}>
              <svg viewBox="0 0 44 64" fill="none">
                <rect x="3" y="14" width="6" height="12" rx="2" fill="#273e32" />
                <rect x="35" y="14" width="6" height="12" rx="2" fill="#273e32" />
                <rect x="3" y="42" width="6" height="12" rx="2" fill="#273e32" />
                <rect x="35" y="42" width="6" height="12" rx="2" fill="#273e32" />
                <rect x="8" y="4" width="28" height="56" rx="11" fill="#eacb81" stroke="#486247" strokeWidth="2" />
                <path d="m13 23 2-8h14l2 8H13Zm0 20h18l-2 8H15l-2-8Z" fill="#557967" />
                <rect x="12" y="26" width="20" height="14" rx="4" fill="#fffff0" />
                <path d="M22 36s-6-3-6-6c0-3 4-4 6-1 2-3 6-2 6 1 0 3-6 6-6 6Z" fill="#bf786d" />
                <path d="M12 10h4M28 10h4M12 55h4M28 55h4" stroke="#fffff0" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <ol className="journey-stops" ref={stopsRef}>
            {story.map((chapter, index) => (
              <li
                className="journey-stop"
                id={`story-stop-${chapter.year}`}
                data-active={activeStop === index}
                key={chapter.year}
                tabIndex={-1}
              >
                <div className="journey-stop-meta">
                  <span>Stop 0{index + 1}</span>
                  <span>{chapter.year}</span>
                </div>
                <div className="journey-stop-icon"><StopIcon index={index} /></div>
                <h3>{chapter.title}</h3>
                <p>{chapter.description}</p>
                <span className="journey-stop-note">{stopNotes[index]}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="journey-arrival">
        <span>And the best part? We&apos;re only getting started.</span>
        <a href="#events">Next stop: the celebrations <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
