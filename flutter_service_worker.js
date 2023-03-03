'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "277f89dedbe3c43edcef1d22b51046a5",
"assets/assets/fonts/EliIcons.ttf": "1a6d0b5067a4864636d6700645caa017",
"assets/assets/images/Elyrics_icon.png": "32392890ac2c9382d2a8e60cd2dc6176",
"assets/assets/images/Elyrics_icon_dark.png": "f4a0556368739413b286ca1975673804",
"assets/assets/images/errorkitty.png": "23151b47f237b8f944d8e56aa7a804be",
"assets/assets/images/hkitty.png": "29c82a098093dd8ee08e06bf1c72c8b9",
"assets/assets/images/kittypalette.png": "a665fc0d57863064504367021eb7682b",
"assets/assets/images/kittyquestion.png": "d3d69ef5b9c93a1587ef2df984b7fda7",
"assets/assets/images/kittysave.png": "0a22f3341c142360af20112e69833026",
"assets/assets/images/kittyshuffle.png": "039b0489c26605a0762b5d1b8dd432f2",
"assets/assets/images/lana.png": "57116cde9627e0e2e1e43907e6ded259",
"assets/assets/images/mitski.png": "3b0264b6b0a76444515a4ba5772d4c81",
"assets/assets/images/moon.png": "62da33a5f3a070e28c25c21d0e35c0de",
"assets/assets/images/rising.png": "3e69719230fd0fb987f5e316df3946d9",
"assets/assets/images/sun.png": "460d3836da7350aefdd06ece1da11004",
"assets/assets/images/taylor.png": "1d449e16d05372e4d3b7e6160970631e",
"assets/assets/images/waitingkitty.png": "3f9444271a2f2a9cb2ab03c29b58258e",
"assets/FontManifest.json": "bbc3b3b710ae2f0eac9834419ce40fc2",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "42de42e0810b6f8a0c8bea1f8564aa2e",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "f4e1ff336a41add8d133dba9277bf9e0",
"icons/1105453.png": "e9dea78ce98525f1949559190ab3a966",
"icons/1666103.png": "ce139baf9f7e47d0910993e79ff2cfa6",
"icons/3755649.png": "2e56088770a9bfdf4101713c003fca44",
"icons/4768597.png": "036c40e8caa2de66c9646e36fc6c3dc2",
"icons/6664854.png": "c617e9d4be37d868b58b8e93c31a2fda",
"icons/7711836.png": "fdd543de080fa65c47d836742d430f68",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "4bbd9bdeffd5924e93fadb31ee657b49",
"/": "4bbd9bdeffd5924e93fadb31ee657b49",
"main.dart.js": "4db1511b68bed42ac50d3b66015f6137",
"manifest.json": "e2d37d37f6e0703704f35ab2924f1276",
"splash/img/dark-1x.png": "fa2833ae2edb271ca7e0cdadf5a5bceb",
"splash/img/dark-2x.png": "eff0ad33700c912052b55ce784a7ef03",
"splash/img/dark-3x.png": "b670b5a96b4f459824df02ae94353936",
"splash/img/dark-4x.png": "89ff458a5834040319bab8c4a575e039",
"splash/img/light-1x.png": "5b8c846317a4f88ee09fa7e26e376733",
"splash/img/light-2x.png": "5646c0103ffb3c29deb95be5afc3dab0",
"splash/img/light-3x.png": "467a9d948cbbf1eaca001c3c08bfe25b",
"splash/img/light-4x.png": "de55cf86a27ee3a22d433c3df5f1d9e3",
"splash/splash.js": "123c400b58bea74c1305ca3ac966748d",
"splash/style.css": "ac4bd0c0c818259a46202e403cd0ddab",
"version.json": "bc7ab171c2dd83066593b81d3b8731dd"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
