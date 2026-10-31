"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { Iphone } from "@/components/ui/iphone";

const portfolioUrl = "https://satvic-movement-pmd.vercel.app";
const brandName = "Satvic Movement";
const highlightDuration = (brandName.length - 1) * 45 + 520;

function SatvicBrand() {
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [autoAnimating, setAutoAnimating] = useState(false);
  const characterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playNameAnimation = useCallback(() => {
    setAutoAnimating(true);
    if (animationTimer.current) clearTimeout(animationTimer.current);
    animationTimer.current = setTimeout(() => setAutoAnimating(false), highlightDuration);
  }, []);

  useEffect(() => {
    playNameAnimation();
    const interval = window.setInterval(playNameAnimation, 5000);
    return () => {
      window.clearInterval(interval);
      if (animationTimer.current) clearTimeout(animationTimer.current);
    };
  }, [playNameAnimation]);

  return (
    <a className="home-brand" href="/" aria-label="Satvic Movement home">
      <img className="home-logo" src="/logo.jpg" alt="" />
      <span
        className={`variable-name${autoAnimating ? " is-auto-animating" : ""}`}
        aria-label={brandName}
        onPointerMove={event => {
          if (event.pointerType !== "touch") setPointer({ x: event.clientX, y: event.clientY });
        }}
        onPointerLeave={() => setPointer(null)}
      >
        {Array.from(brandName).map((character, index) => {
          const element = characterRefs.current[index];
          const rect = element?.getBoundingClientRect();
          const proximity = pointer && rect
            ? Math.max(0, 1 - Math.hypot(pointer.x - (rect.left + rect.right) / 2, pointer.y - (rect.top + rect.bottom) / 2) / 100)
            : 0;
          const isSpace = character === " ";
          const isSatvic = index < "Satvic".length;

          return (
            <span
              key={index}
              ref={element => { characterRefs.current[index] = element; }}
              className={`variable-name-character${isSpace ? " is-space" : ""}${isSatvic ? " is-bold" : ""}`}
              style={{
                fontWeight: Math.round((isSatvic ? 600 : 400) + proximity * 400),
                transform: `translateY(${-proximity * 2}px) scale(${1 + proximity * 0.16})`,
                animationDelay: `${index * 45}ms`,
              }}
              aria-hidden="true"
            >{character}</span>
          );
        })}
      </span>
    </a>
  );
}

function PhoneScreen() {
  return (
    <div className="phone-screen profile-screen">
      <div className="screen-status"><span>9:41</span><span>•••　⌁　▰</span></div>
      <div className="profile-card">
        <div className="insta-illustration" role="img" aria-label="Instagram logo with a line through it">
          <span className="insta-camera"><span /></span>
          <span className="insta-slash" />
        </div>
        <p className="profile-message">I don&apos;t use<br />social media.</p>
        <p className="profile-caption">But I&apos;d love to share what I make.</p>
        <a className="profile-button" href={portfolioUrl} target="_blank" rel="noopener noreferrer">
          Visit my portfolio <span aria-hidden="true">↗</span>
        </a>
        <span className="profile-decoration profile-decoration-one" aria-hidden="true" />
        <span className="profile-decoration profile-decoration-two" aria-hidden="true" />
      </div>
      <div className="screen-home-indicator" />
    </div>
  );
}

export default function Home() {
  const revealDots = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    event.currentTarget.classList.add("is-hovering");
  };

  const hideDots = (event: PointerEvent<HTMLElement>) => event.currentTarget.classList.remove("is-hovering");

  return (
    <main className="home-page">
      <header className="home-nav"><SatvicBrand /></header>
      <section className="home-center" aria-label="Phone with a portfolio link" onPointerMove={revealDots} onPointerLeave={hideDots}>
        <div className="dot-matrix" aria-hidden="true" />
        <Iphone
          className="hero-phone"
          aria-label="Phone showing that I do not use social media and linking to my portfolio"
          screenContent={<PhoneScreen />}
        />
      </section>
    </main>
  );
}
