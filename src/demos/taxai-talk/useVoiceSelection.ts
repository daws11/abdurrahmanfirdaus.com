// src/demos/taxai-talk/useVoiceSelection.ts
//
// Module-level voice selection state shared between VoiceSession (reader),
// Settings (writer), and Transcript (reader). E.9.
//
// ponytail: state lost on refresh — acceptable for prototype.

import { useSyncExternalStore } from "react";
import type { VoiceId } from "./mocks";

let voiceId: VoiceId = "aria";
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

function getSnapshot(): VoiceId {
  return voiceId;
}

export function useVoiceSelection(): [VoiceId, (id: VoiceId) => void] {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const setVoiceId = (id: VoiceId) => {
    voiceId = id;
    notify();
  };
  return [snapshot, setVoiceId];
}