// ═══════════════════════════════════════════════════════════════════════════
// PromptLabz — Service Worker v2.0.0
// Offline-first caching + push notifications for iOS/Android PWA
// ═══════════════════════════════════════════════════════════════════════════

const SW_VERSION = "2.0.0"
const CACHE_STATIC = `promptlabz-static-v${SW_VERSION}`
const CACHE_DYNAMIC = `promptlabz-dynamic-v${SW_VERSION}`

// App shell assets to cache on install
const PRECACHE_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/icon-180x180.png",
  "/assets/mascot-login-new.png",
  "/assets/mascot-home.png",
]

// ── Install: cache app shell ─────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_STATIC)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// ── Activate: clean up old caches ────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_STATIC && k !== CACHE_DYNAMIC)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => clients.claim())
  )
})

// ── Fetch: stale-while-revalidate for navigation, cache-first for assets ─
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and cross-origin requests (Supabase, analytics, etc.)
  if (request.method !== "GET" || url.origin !== self.location.origin) return

  // Skip Supabase API calls — always go to network
  if (url.pathname.startsWith("/rest/") || url.pathname.startsWith("/auth/")) return

  // Navigation requests: network-first, fallback to cached index.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_DYNAMIC).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(() =>
          caches.match("/").then((cached) => cached || caches.match(request))
        )
    )
    return
  }

  // Static assets (JS, CSS, images, fonts): cache-first
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/icons/") ||
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font" ||
    request.destination === "image"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_STATIC).then((cache) => cache.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }
})

// ── Push Event ────────────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()
    const options = {
      title: data.title || "PromptLabz",
      body: data.body || "",
      icon: data.icon || "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      tag: data.tag || "promptlabz-reminder",
      data: {
        url: data.url || "/home",
        timestamp: Date.now(),
      },
      vibrate: [200, 100, 200],
      requireInteraction: true,
    }
    event.waitUntil(self.registration.showNotification(options.title, options))
  } catch {
    const options = {
      body: event.data.text(),
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      tag: "promptlabz-reminder",
      requireInteraction: true,
    }
    event.waitUntil(self.registration.showNotification("PromptLabz", options))
  }
})

// ── Notification Click ────────────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const urlToOpen = event.notification.data?.url || "/home"
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus()
            client.navigate(urlToOpen)
            return
          }
        }
        if (clients.openWindow) return clients.openWindow(urlToOpen)
      })
  )
})
