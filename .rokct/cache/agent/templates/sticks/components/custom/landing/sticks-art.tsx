/*
 * Copyright (c) 2026 ROKCT INTELLIGENCE (PTY) LTD
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// The Sticks drawings (agent_sdk 1.24.0): the logo mark, the ball-head
// portraits on the role cards, the feed and the ask, and the top-down crowd.
// Server-safe and directive-free. Black and white in both themes: every
// fill and stroke is a class whose colour sticks-landing.css sets per
// theme, so one drawing serves light and dark.
//
// Art rules (Ray): heads only on the portraits and no props, so a role is
// never told by an object; a crowd is seen truly from above (sticks-crowd.ts);
// the crowd's edge fades to a solid page (the .crowd mask in the CSS).

import type { HairStyle } from "./sticks-crowd";
import { buildCrowd, crowdFocus } from "./sticks-crowd";
import type { StickKey } from "./sticks-landing-config";

/** The Sticks mark: a ball head with a smile, the one who looks up. */
export function SticksMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="17.5" className="mk-face" strokeWidth="3" />
      <circle cx="14.5" cy="17" r="2.4" className="mk-ink" />
      <circle cx="25.5" cy="17" r="2.4" className="mk-ink" />
      <path d="M14.5 24.5q5.5 4 11 0" fill="none" className="mk-line" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

type FrontHair = "cap" | "flat" | "bun" | "long" | "puffs";

const FRONT_HAIR: Record<StickKey, FrontHair> = {
  thandi: "bun",
  tumi: "cap",
  kabelo: "flat",
  naledi: "long",
  lindiwe: "puffs",
  sipho: "cap",
};

function frontHair(style: FrontHair) {
  switch (style) {
    case "flat":
      return (
        <>
          <path d="M9 20a15 15 0 0 1 30 0l0 1q-15-4-30 0z" />
          <rect x="14" y="7" width="20" height="5" rx="2" />
        </>
      );
    case "bun":
      return (
        <>
          <circle cx="24" cy="6" r="4.5" />
          <path d="M8 23a16 16 0 0 1 32 0q-6-8-16-8t-16 8z" />
        </>
      );
    case "long":
      return <path d="M6 34V22a18 18 0 0 1 36 0v12h-4V24q-14-8-28 0v10z" />;
    case "puffs":
      return (
        <>
          <circle cx="10" cy="9" r="5" />
          <circle cx="38" cy="9" r="5" />
          <path d="M8 22a16 16 0 0 1 32 0q-16-6-32 0z" />
        </>
      );
    default:
      return <path d="M8 22a16 16 0 0 1 32 0q-16-7-32 0z" />;
  }
}

export type Mood = "calm" | "happy" | "sleep";

/** A ball-head portrait: face, hair, eyes and mouth. No body, no props. */
export function StickHead({ stick, size, mood = "calm" }: { stick: StickKey; size: number; mood?: Mood }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className="head" aria-hidden="true" focusable="false">
      <circle cx="24" cy="25" r="18.4" className="hd-ring" />
      <circle cx="24" cy="25" r="16" className="hd-face" />
      <g className="hd-hair">{frontHair(FRONT_HAIR[stick])}</g>
      <circle cx="24" cy="25" r="16" className="hd-line" strokeWidth="2.6" />
      {mood === "sleep" ? (
        <path d="M16 23q3 2 6 0M26 23q3 2 6 0M22 31h4" className="hd-stroke" strokeWidth="1.9" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="19" cy="24" r="2" className="hd-ink" />
          <circle cx="29" cy="24" r="2" className="hd-ink" />
          {mood === "happy" ? (
            <path d="M19 30q5 4 10 0" className="hd-stroke" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M21 31h6" className="hd-stroke" strokeWidth="2" strokeLinecap="round" />
          )}
        </>
      )}
      <path d="M34 31a11 11 0 0 1-4 4" className="hd-shine" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const TOP_HAIR: Record<HairStyle, string> = {
  short: "#t-short",
  bun: "#t-bun",
  puffs: "#t-puffs",
  long: "#t-long",
  parted: "#t-parted",
};

/**
 * The crowd from above. `focus` crops the picture (a viewBox) - the closing
 * band takes a wide strip through the one who looks up. `withOne` false
 * draws the crowd only; the hero draws the one, and the page rings it.
 */
export function CrowdArt({
  idPrefix,
  focus,
  className,
}: {
  idPrefix: string;
  focus?: { x: number; y: number; width: number; height: number };
  className?: string;
}) {
  const crowd = buildCrowd();
  const box = focus ?? { x: 0, y: 0, width: crowd.width, height: crowd.height };
  const id = (name: string) => `${idPrefix}-${name}`;
  const ref = (name: string) => `#${idPrefix}-${name.slice(1)}`;
  const inView = (x: number, y: number) =>
    x > box.x - 60 && x < box.x + box.width + 60 && y > box.y - 60 && y < box.y + box.height + 60;
  return (
    <svg
      viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Shoulders: a capsule across the body, the arms at its ends. */}
        <g id={id("body")}>
          <rect x="-33" y="-12" width="66" height="25" rx="12.5" strokeWidth="3" />
          <path d="M-24 -3v9M24 -3v9" className="cr-seam" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g id={id("t-short")}>
          <circle cx="0" cy="-3" r="17.5" className="cr-hair" strokeWidth="3" />
          <path d="M-9 -14a12 12 0 0 1 9-3" className="cr-shine" strokeWidth="2.6" strokeLinecap="round" />
        </g>
        <g id={id("t-bun")}>
          <circle cx="0" cy="13" r="7.5" className="cr-hair" strokeWidth="3" />
          <circle cx="0" cy="-3" r="17.5" className="cr-hair" strokeWidth="3" />
          <path d="M-9 -14a12 12 0 0 1 9-3" className="cr-shine" strokeWidth="2.6" strokeLinecap="round" />
        </g>
        <g id={id("t-puffs")}>
          <circle cx="-15" cy="0" r="7.5" className="cr-hair" strokeWidth="3" />
          <circle cx="15" cy="0" r="7.5" className="cr-hair" strokeWidth="3" />
          <circle cx="0" cy="-3" r="16.5" className="cr-hair" strokeWidth="3" />
          <path d="M-8 -13a11 11 0 0 1 8-3" className="cr-shine" strokeWidth="2.6" strokeLinecap="round" />
        </g>
        <g id={id("t-long")}>
          <path d="M-15 0q0 20 15 22q15-2 15-22z" className="cr-hair" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="0" cy="-3" r="17.5" className="cr-hair" strokeWidth="3" />
          <path d="M-9 -14a12 12 0 0 1 9-3" className="cr-shine" strokeWidth="2.6" strokeLinecap="round" />
        </g>
        <g id={id("t-parted")}>
          <circle cx="0" cy="-3" r="17.5" className="cr-hair" strokeWidth="3" />
          <path d="M-4 -19q-2 9 1 17" className="cr-shine" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      </defs>
      <rect x={box.x} y={box.y} width={box.width} height={box.height} className="cr-ground" />
      {crowd.sticks
        .filter((s) => inView(s.x, s.y))
        .map((s, i) => (
          <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.turn})`}>
            <use href={ref("#body")} className={`cr-shirt s${s.shirt}`} />
            <use href={ref(TOP_HAIR[s.hair])} />
          </g>
        ))}
      {/* The one who looks up: the same shoulders, and a face turned to you. */}
      <g transform={`translate(${crowd.one.x} ${crowd.one.y})`} className="cr-one">
        <use href={ref("#body")} className={`cr-shirt s${crowd.one.shirt}`} transform="translate(0 14)" />
        <circle cx="0" cy="-2" r="21" className="cr-face" strokeWidth="3" />
        <path d="M-19 -9a20 20 0 0 1 38 0q-6-9-19-9t-19 9z" className="cr-hair" />
        <path d="M-10 -1q3.5-3 7 0M3 -1q3.5-3 7 0" className="cr-eye" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M-6 7q6 5 12 0" className="cr-eye" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** The hero's crop: 900 x 600 of the picture around the one who looks up, so each Stick reads at a glance. */
export function heroFocus() {
  return crowdFocus(buildCrowd(), 900, 600);
}

/** Where the one who looks up sits in a crop, as percentages, for the ring. */
export function crowdOnePosition(focus = heroFocus()): { left: string; top: string } {
  const crowd = buildCrowd();
  return {
    left: `${(((crowd.one.x - focus.x) / focus.width) * 100).toFixed(2)}%`,
    top: `${(((crowd.one.y - 2 - focus.y) / focus.height) * 100).toFixed(2)}%`,
  };
}
