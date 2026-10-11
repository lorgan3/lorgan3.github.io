// Small localStorage-backed store for per-adventure progress.
export function loadState(key, defaults) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return { ...structuredClone(defaults), ...JSON.parse(raw) };
  } catch (e) { /* corrupt or unavailable storage */ }
  return structuredClone(defaults);
}

export function saveState(key, state) {
  try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) { /* storage full or disabled */ }
}

export function clearState(key) {
  try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
}
