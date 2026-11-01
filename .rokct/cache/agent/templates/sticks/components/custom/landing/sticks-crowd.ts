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

// The crowd Sticks are drawn in (agent_sdk 1.24.0): the hero's picture and
// the closing band. Pure data, no React, so node can test it.
//
// The Sticks art rules (Ray): a crowd is drawn TRULY TOP-DOWN - from above
// every Stick is a pair of shoulders and the top of a head, turned whichever
// way it is facing, so no face shows - except ONE, who has turned up to look
// at you (the hero's line: "Only one is looking at you. That one works for
// you."). Props never define a role, so nobody carries anything. Black and
// white: the shirts are greys (classes s0-s5, the shade per theme lives in
// sticks-landing.css), the hair is ink. The picture's edge fades to the page
// in CSS, so the background ends solid.
//
// buildCrowd() lays a jittered hex grid with a seeded generator, so the
// server and every visitor draw the same crowd, then clears a ring around
// the one who looks up so no shoulder covers that face.

export type HairStyle = "short" | "bun" | "puffs" | "long" | "parted";

export interface CrowdStick {
  x: number;
  y: number;
  /** Degrees: the way the Stick faces, 0 = up the picture. */
  turn: number;
  shirt: number;
  hair: HairStyle;
}

export interface Crowd {
  width: number;
  height: number;
  sticks: CrowdStick[];
  /** The one who looks up, drawn last. */
  one: { x: number; y: number; shirt: number };
}

export interface CrowdOptions {
  width?: number;
  height?: number;
  spacing?: number;
  seed?: number;
  one?: { x: number; y: number };
  /** No other Stick's centre comes closer than this to the one's. */
  clearance?: number;
}

export const HAIR_STYLES: readonly HairStyle[] = ["short", "bun", "puffs", "long", "parted"];
export const SHIRT_SHADES = 6;

/** mulberry32: small, seeded, the same on every runtime. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildCrowd(options: CrowdOptions = {}): Crowd {
  const width = options.width ?? 1800;
  const height = options.height ?? 1200;
  const spacing = options.spacing ?? 88;
  const clearance = options.clearance ?? spacing * 0.95;
  const one = options.one ?? { x: Math.round(width * 0.576), y: Math.round(height * 0.524) };
  const random = seeded(options.seed ?? 11);
  const rowStep = spacing * 0.86;
  const sticks: CrowdStick[] = [];
  for (let row = 0, y = -spacing * 0.2; y < height + spacing * 0.5; row++, y += rowStep) {
    const shift = row % 2 ? spacing / 2 : 0;
    for (let x = -spacing * 0.3 + shift; x < width + spacing * 0.5; x += spacing) {
      const px = Math.round(x + (random() - 0.5) * spacing * 0.36);
      const py = Math.round(y + (random() - 0.5) * spacing * 0.3);
      const turn = Math.round(random() * 360);
      const shirt = Math.floor(random() * SHIRT_SHADES);
      const hair = HAIR_STYLES[Math.floor(random() * HAIR_STYLES.length)];
      if (Math.hypot(px - one.x, py - one.y) < clearance) continue;
      sticks.push({ x: px, y: py, turn, shirt, hair });
    }
  }
  return { width, height, sticks, one: { ...one, shirt: 1 } };
}

/** A crop of the picture centred on the one who looks up, kept inside it. */
export function crowdFocus(crowd: Crowd, width: number, height: number) {
  const x = Math.min(Math.max(crowd.one.x - width / 2, 0), crowd.width - width);
  const y = Math.min(Math.max(crowd.one.y - height / 2, 0), crowd.height - height);
  return { x: Math.round(x), y: Math.round(y), width, height };
}
