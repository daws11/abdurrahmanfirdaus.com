// src/demos/taxai-talk/useTranscript.ts
//
// Module-level transcript state shared between VoiceSession (writer) and
// Transcript screen (reader). E.7 backs it with useSyncExternalStore — no
// global store, no cross-demo coupling.
//
// ponytail: state lost on refresh — acceptable for prototype.

import { useSyncExternalStore } from "react";
import type { TranscriptTurn } from "./mocks";

let turns: TranscriptTurn[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function notify() {
  for (const l of listeners) l();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot(): TranscriptTurn[] {
  return turns;
}

export function useTranscript(): [TranscriptTurn[], (turn: Omit<TranscriptTurn, "id">) => void] {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const appendTurn = (turn: Omit<TranscriptTurn, "id">) => {
    const id = `live-${nextId++}`;
    turns = [...turns, { id, ...turn }];
    notify();
  };
  return [snapshot, appendTurn];
}

/** Reset to empty — used by VoiceSession "Restart" CTA in E.5. */
export function resetTranscript() {
  turns = [];
  nextId = 1;
  notify();
}