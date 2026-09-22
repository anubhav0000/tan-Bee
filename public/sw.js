self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Pass through fetch.
  e.respondWith(
    fetch(e.request).catch(() => {
      // If offline, return a basic offline response.
      return new Response("You are offline.", {
        status: 503,
        statusText: "Service Unavailable",
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      });
    })
  );
});
