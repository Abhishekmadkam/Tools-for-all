const CACHE_NAME = "zentoolo-app-v2";
const APP_SHELL = [
  "./index.html",
  "./CNAME",
  "./README.md",
  "./blog.html",
  "./images/apple-touch-icon.png",
  "./images/icon-192.png",
  "./images/icon-512.png",
  "./manifest.json",
  "./sitemap.xml",
  "./tools/abc",
  "./tools/ai-utilities.html",
  "./tools/business-tools.html",
  "./tools/calculator.html",
  "./tools/codetools.html",
  "./tools/converters.html",
  "./tools/developer-tools.html",
  "./tools/file-utilities.html",
  "./tools/image-tools.html",
  "./tools/online-editors.html",
  "./tools/pdf-tools.html",
  "./tools/resume-tools.html",
  "./tools/student-tools.html",
  "./tools/text-tools.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      const url = new URL(event.request.url);
      if (url.origin === self.location.origin && response.ok) {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() =>
      caches.match(event.request).then(cached =>
        cached || (event.request.mode === "navigate"
          ? caches.match("./index.html")
          : new Response("", {status:503, statusText:"Offline"}))
      )
    )
  );
});
