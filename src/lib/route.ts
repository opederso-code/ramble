import type { Point, Stop } from '@/data/lantern-loop';

export function pointOnBend(from: Point, bend: Point, to: Point, t: number): Point {
  const clamped = Math.min(1, Math.max(0, t));
  const u = 1 - clamped;
  return {
    x: u * u * from.x + 2 * u * clamped * bend.x + clamped * clamped * to.x,
    y: u * u * from.y + 2 * u * clamped * bend.y + clamped * clamped * to.y,
  };
}

export function pointsOnBend(from: Point, bend: Point, to: Point, steps = 32): Point[] {
  const points: Point[] = [];
  for (let i = 0; i <= steps; i += 1) {
    points.push(pointOnBend(from, bend, to, i / steps));
  }
  return points;
}

export function buildRoute(routeStops: Stop[]): Point[][] {
  const segments: Point[][] = [];
  for (let i = 0; i < routeStops.length - 1; i += 1) {
    const bend = routeStops[i]?.bend;
    const next = routeStops[i + 1];
    if (!bend || !next) continue;
    segments.push(pointsOnBend(routeStops[i].position, bend, next.position));
  }
  return segments;
}

export function polyline(points: Point[]): string {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');
}

/** Whole segments before `completedSegments`, plus a partial draw of the next leg. */
export function walkedPoints(segments: Point[][], completedSegments: number, partialT: number): Point[] {
  const points: Point[] = [];
  const whole = Math.max(0, Math.min(completedSegments, segments.length));

  for (let i = 0; i < whole; i += 1) {
    const segment = segments[i];
    if (!segment) continue;
    points.push(...(points.length === 0 ? segment : segment.slice(1)));
  }

  if (partialT > 0 && whole < segments.length) {
    const segment = segments[whole];
    if (!segment || segment.length === 0) return points;
    const last = Math.min(
      segment.length - 1,
      Math.max(1, Math.round(partialT * (segment.length - 1))),
    );
    const partial = segment.slice(0, last + 1);
    points.push(...(points.length === 0 ? partial : partial.slice(1)));
  }

  return points;
}
