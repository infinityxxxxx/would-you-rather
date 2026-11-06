const CACHE='wyr-v5';
const ASSETS=['./','./index.html','./questions.js','./logic.js','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
// Network first for everything, so updates arrive without a version bump; the cache is only the offline copy.
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
  const navigate=event.request.mode==='navigate';
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(navigate?'./index.html':event.request,copy))}
    return response;
  }).catch(()=>caches.match(navigate?'./index.html':event.request)));
});
