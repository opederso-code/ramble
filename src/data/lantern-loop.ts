export type Point = {
  x: number;
  y: number;
};

export type Stop = {
  id: string;
  name: string;
  shortName: string;
  minutes: number;
  lookFor: string;
  paragraphs: [string, string];
  position: Point;
  /** Quadratic control point toward the next stop. */
  bend: Point | null;
  /** Grade of the leg that leaves this stop. */
  nextGrade: string | null;
  cue: string | null;
  label: Point;
};

export const MAP = {
  width: 360,
  height: 540,
};

export const tour = {
  id: 'lantern-loop',
  title: 'The Lantern Loop',
  place: 'Port Meridian',
  kicker: 'Sample ramble',
  distance: '1.2 miles',
  duration: '40 min',
  stopsLabel: '6 stops',
  summary:
    'A loop from the ferry clock to the bench above the harbor, by a lantern stair, a green grocery window, and a garden built in an old dry dock.',
};

export const stops: Stop[] = [
  {
    id: 'clock',
    name: 'Meridian Clock',
    shortName: 'Clock',
    minutes: 0,
    lookFor: 'A brass ring where minute marks would be. Only the hour hand carries a number.',
    paragraphs: [
      'The ferry clock faces the harbor and runs four minutes slow. Crews set it that way so a person who thought they were late still made the boat.',
      'Stand under it and you hear the terminal before you see it: the chain on the ramp, a suitcase wheel, someone calling a name twice.',
    ],
    position: { x: 108, y: 462 },
    bend: { x: 124, y: 416 },
    nextGrade: 'Uphill',
    cue: 'Leave the water behind you. Take the stair with the green rail, the one that starts just past the shed.',
    label: { x: 20, y: -10 },
  },
  {
    id: 'steps',
    name: 'Chandlery Steps',
    shortName: 'Steps',
    minutes: 6,
    lookFor: 'The missing brass 7. The screw holes are still in the wood.',
    paragraphs: [
      'These steps used to climb to the sail lofts. The risers are numbered in brass, and 7 was pried off so long ago that the gap is part of the stair.',
      'Iron hooks still stick out of the rail, one per landing, from when the lofts hung lanterns for anyone coming up after dark.',
    ],
    position: { x: 108, y: 372 },
    bend: { x: 110, y: 310 },
    nextGrade: 'Uphill',
    cue: 'At the top, turn right. Halfway along the block, a grocery keeps its window painted green.',
    label: { x: 20, y: 4 },
  },
  {
    id: 'window',
    name: 'The Green Window',
    shortName: 'Window',
    minutes: 14,
    lookFor: 'A white bowl of oranges on the sill, and the small sign under it that only says “walking.”',
    paragraphs: [
      'The sill holds a bowl of oranges in every season. If you are walking the hill, you can take one. The bowl is how the shop says the street is open.',
      'Inside, the floor runs downhill toward the harbor, so the tins on the low shelf are the ones that sell first.',
    ],
    position: { x: 168, y: 286 },
    bend: { x: 190, y: 230 },
    nextGrade: 'Level',
    cue: 'Cross at the faded crosswalk. The garden gate is in the fence on your left.',
    label: { x: 18, y: 16 },
  },
  {
    id: 'garden',
    name: 'Drydock Garden',
    shortName: 'Garden',
    minutes: 22,
    lookFor: 'A bed curved like a bow, with a cleat still bolted to the concrete rim.',
    paragraphs: [
      'Boats were hauled up here when the harbor was busier. The beds are poured in the shape of hulls, and the paths between them are about the width of a keel.',
      'Rosemary does most of the work. On a warm day the whole block smells like someone is cooking.',
    ],
    position: { x: 262, y: 214 },
    bend: { x: 250, y: 140 },
    nextGrade: 'Uphill',
    cue: 'Leave by the north gate. The kiosk is the striped awning at the corner.',
    label: { x: 16, y: 18 },
  },
  {
    id: 'kiosk',
    name: 'Salt & Paper',
    shortName: 'Kiosk',
    minutes: 31,
    lookFor: 'Today’s tide table, pinned over whichever notice has been there the longest.',
    paragraphs: [
      'The kiosk sells newspapers, tide tables, and oranges when the grocery has closed. The board out front holds lost dogs and room rentals on the same pins.',
      'Read the tide before you read anything else. The harbor you started from is already a different height than it was at the clock.',
    ],
    position: { x: 196, y: 128 },
    bend: { x: 150, y: 80 },
    nextGrade: 'Uphill',
    cue: 'Take the path behind the awning. It levels off at a bench that faces back down the hill.',
    label: { x: 18, y: -12 },
  },
  {
    id: 'bench',
    name: 'The Turn Bench',
    shortName: 'Bench',
    minutes: 40,
    lookFor: 'The harbor, and the clock you started under, small at the bottom of the hill.',
    paragraphs: [
      'This is the turnaround. From here the loop is easy to see: clock, stair, green window, garden, kiosk, and the bench you are standing at.',
      'The clock is a small brass glint at the bottom. If you wait, you can catch it running four minutes slow and not minding.',
    ],
    position: { x: 96, y: 72 },
    bend: null,
    nextGrade: null,
    cue: null,
    label: { x: 18, y: 4 },
  },
];

export function legMinutes(index: number): number {
  const current = stops[index];
  const next = stops[index + 1];
  if (!current || !next) return 0;
  return next.minutes - current.minutes;
}
