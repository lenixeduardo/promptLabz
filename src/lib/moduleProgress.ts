import { useEffect, useState } from "react";
import { scopedKey, USER_SCOPE_EVENT } from "./userScope";

const BASE_KEY = "promptlabz:module-progress:v2";

export type TrackId = "a1" | "a2" | "a3";

// A1 starts pre-completed as the initial experience
const DEFAULTS: Record<TrackId, number> = {
  a1: 7,
  a2: 0,
  a3: 0,
};

type State = Partial<Record<TrackId, number>>;

function readAll(): State {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(scopedKey(BASE_KEY));
    return raw ? (JSON.parse(raw) as State) : {};
  } catch {
    return {};
  }
}

function writeAll(state: State) {
  if (typeof window === "undefined") return;
  localStorage.setItem(scopedKey(BASE_KEY), JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("module-progress-change"));
}

function read(track: TrackId): number {
  const all = readAll();
  const stored = all[track];
  const fallback = DEFAULTS[track];
  return typeof stored === "number" && Number.isFinite(stored)
    ? Math.max(stored, 0)
    : fallback;
}

export function getCompletedCount(track: TrackId = "a1"): number {
  return read(track);
}

export function advanceModule(total: number, track: TrackId = "a1") {
  const all = readAll();
  const current = read(track);
  if (current < total) {
    all[track] = current + 1;
    writeAll(all);
  }
}

export function useModuleProgress(track: TrackId = "a1") {
  const [completed, setCompleted] = useState<number>(() => read(track));

  useEffect(() => {
    setCompleted(read(track));
    const onChange = () => setCompleted(read(track));
    window.addEventListener("module-progress-change", onChange);
    window.addEventListener(USER_SCOPE_EVENT, onChange);
    return () => {
      window.removeEventListener("module-progress-change", onChange);
      window.removeEventListener(USER_SCOPE_EVENT, onChange);
    };
  }, [track]);

  return completed;
}
