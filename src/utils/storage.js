export const S = {
  get: (k, fb = null) => {
    try { const v = localStorage.getItem(`as_${k}`); return v ? JSON.parse(v) : fb; } catch { return fb; }
  },
  set: (k, v) => {
    try { localStorage.setItem(`as_${k}`, JSON.stringify(v)); } catch {}
  },
  del: (k) => {
    try { localStorage.removeItem(`as_${k}`); } catch {}
  },
};
