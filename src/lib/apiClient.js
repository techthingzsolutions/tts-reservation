import axios from 'axios';
import { ApiError } from './errors';

const TOKEN_STORAGE_KEY = 'tts.auth.token';
const TENANT_HEADER = 'X-Tenant';

let onUnauthorized = null;

/** Called by AuthProvider so a 401 can clear session state and redirect. */
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/**
 * Tenant slug for the current request.
 *
 * Production resolves it from the subdomain (client.yourapp.com). Locally
 * there is no subdomain, so fall back to the env default.
 */
export function getTenantSlug() {
  const host = window.location.hostname;
  const parts = host.split('.');
  const isPlainHost = host === 'localhost' || /^\d+(\.\d+){3}$/.test(host);
  if (!isPlainHost && parts.length > 2 && parts[0] !== 'www') {
    return parts[0];
  }
  return import.meta.env.VITE_DEFAULT_TENANT_SLUG || 'demo-salon';
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers[TENANT_HEADER] = getTenantSlug();
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Request never reached the server.
    if (!error.response) {
      return Promise.reject(
        new ApiError({
          message: 'Cannot reach the server. Check your connection and try again.',
          status: 0,
          original: error,
        })
      );
    }

    const { status, data } = error.response;

    if (status === 401) {
      setToken(null);
      onUnauthorized?.();
    }

    return Promise.reject(
      new ApiError({
        message: data?.message || defaultMessageFor(status),
        status,
        code: data?.code,
        errors: data?.errors || {},
        original: error,
      })
    );
  }
);

function defaultMessageFor(status) {
  switch (status) {
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You do not have permission to do that.';
    case 404:
      return 'We could not find what you were looking for.';
    case 409:
      return 'That time slot is no longer available.';
    case 422:
      return 'Please check the highlighted fields.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    default:
      return status >= 500
        ? 'Something went wrong on our end. Please try again.'
        : 'Request failed.';
  }
}

/**
 * Thin helpers so feature api/ modules stay one-liners.
 *
 * Convention: these return the raw JSON body, envelope included
 * (`{ data, meta }`). Every feature api/ method then unwraps it, so hooks and
 * components always receive the resource itself and never `data.data`.
 */
export const api = {
  get: (url, config) => apiClient.get(url, config).then((r) => r.data),
  post: (url, body, config) => apiClient.post(url, body, config).then((r) => r.data),
  put: (url, body, config) => apiClient.put(url, body, config).then((r) => r.data),
  patch: (url, body, config) => apiClient.patch(url, body, config).then((r) => r.data),
  delete: (url, config) => apiClient.delete(url, config).then((r) => r.data),
};
