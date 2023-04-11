const cacheName = "portfolio-cache";
const filesToCache = [
	"/",
	"/index.html",
	"/404.html",
	"/portfolio.html",
	"/resume.html",
	"/services.html",
	"/start-a-project.html",
	"/style.css",
	"/dark-mode.js",
	"/assets/favicon/icon-192x192.png",
	"/assets/favicon/icon-512x512.png"
];

self.addEventListener("install", function (event) {
	event.waitUntil(
		caches.open(cacheName).then(function (cache) {
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener("fetch", function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) {
				return response;
			}
			return fetch(event.request);
		})
	);
});
