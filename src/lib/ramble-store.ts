import { useSyncExternalStore } from 'react';

import { stops } from '@/data/lantern-loop';

export type Phase = 'ready' | 'at-stop' | 'walking' | 'done';

export type RambleState = {
  phase: Phase;
  index: number;
  maxReached: number;
  noticed: Record<string, boolean>;
};

const initialState: RambleState = {
  phase: 'ready',
  index: 0,
  maxReached: -1,
  noticed: {},
};

let state: RambleState = initialState;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(patch: Partial<RambleState>) {
  state = { ...state, ...patch };
  emit();
}

export function getRambleState() {
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useRamble() {
  return useSyncExternalStore(subscribe, getRambleState, getRambleState);
}

export function begin() {
  if (state.phase === 'walking') return;
  update({
    phase: 'at-stop',
    index: 0,
    maxReached: Math.max(state.maxReached, 0),
  });
}

export function startWalk() {
  if (state.phase !== 'at-stop') return;
  if (state.index >= stops.length - 1) return;
  update({ phase: 'walking' });
}

export function cancelWalk() {
  if (state.phase !== 'walking') return;
  update({ phase: 'at-stop' });
}

export function completeWalk() {
  if (state.phase !== 'walking') return;
  const index = Math.min(stops.length - 1, state.index + 1);
  update({
    phase: 'at-stop',
    index,
    maxReached: Math.max(state.maxReached, index),
  });
}

export function finish() {
  if (state.phase !== 'at-stop') return;
  if (state.index !== stops.length - 1) return;
  update({ phase: 'done', maxReached: stops.length - 1 });
}

export function jumpTo(index: number) {
  if (state.phase === 'walking') return;
  if (index < 0 || index >= stops.length) return;
  if (state.phase === 'ready') {
    if (index === 0) begin();
    return;
  }
  if (index <= state.maxReached) {
    update({ phase: 'at-stop', index });
  }
}

export function toggleNoticed(id: string) {
  update({
    noticed: { ...state.noticed, [id]: !state.noticed[id] },
  });
}

export function replay() {
  update({
    phase: 'at-stop',
    index: 0,
    maxReached: 0,
    noticed: {},
  });
}

export function reset() {
  update({
    phase: 'ready',
    index: 0,
    maxReached: -1,
    noticed: {},
  });
}

export function canOpenStop(index: number) {
  if (state.phase === 'walking') return false;
  if (state.phase === 'ready') return index === 0;
  return index <= state.maxReached;
}
