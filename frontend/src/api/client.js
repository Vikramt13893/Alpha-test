/**
 * Typed fetch helpers use paths from OpenAPI; regenerate types with `npm run generate:api`.
 * @typedef {import('./generated/schema.d.ts').paths} Paths
 */

import { clearSession, getAccessToken } from '../auth.js';

function authHeaders(extra = {}) {
  const headers = { Accept: 'application/json', ...extra };
  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function handleAuthFailure(res) {
  if (res.status === 401 && getAccessToken()) {
    clearSession();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.assign('/login');
    }
  }
}

export async function fetchHealth() {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error(`health ${res.status}`);
  return res.json();
}

export async function fetchTrendingVideos(limit = 20) {
  const q = new URLSearchParams({ limit: String(limit) });
  const res = await fetch(`/api/videos/trending?${q}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`trending ${res.status}`);
  return res.json();
}

export async function fetchMyVideos() {
  const res = await fetch('/api/videos/mine', { headers: authHeaders() });
  await handleAuthFailure(res);
  if (!res.ok) throw new Error(`mine ${res.status}`);
  return res.json();
}

export async function fetchVideo(videoId) {
  const res = await fetch(`/api/videos/${videoId}`, { headers: authHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`video ${res.status}`);
  return res.json();
}

export async function fetchPlaybackUrl(videoId) {
  const res = await fetch(`/api/videos/${videoId}/playback-url`, { headers: authHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`playback ${res.status}`);
  return res.json();
}

export async function recordView(videoId, watchSeconds) {
  const res = await fetch(`/api/videos/${videoId}/views`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(watchSeconds != null ? { watchSeconds } : {}),
  });
  if (!res.ok && res.status !== 204) throw new Error(`views ${res.status}`);
}

export async function uploadVideo({ file, title, description, category }) {
  const fd = new FormData();
  fd.append('file', file);
  if (title) fd.append('title', title);
  if (description) fd.append('description', description);
  if (category) fd.append('category', category);
  const headers = authHeaders();
  delete headers['Content-Type'];
  const res = await fetch('/api/videos', {
    method: 'POST',
    headers,
    body: fd,
  });
  await handleAuthFailure(res);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `upload ${res.status}`);
  }
  return res.json();
}
