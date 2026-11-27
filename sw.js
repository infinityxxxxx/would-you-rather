const CACHE='wyr-cd8b77941d';
const ASSETS=['./','./index.html','./questions.js?v=8b2ff27693','./logic.js?v=5d501bb879','./manifest.json','./icon-192.png','./icon-512.png','./fonts/bricolage-grotesque-latin.woff2','./fonts/bricolage-grotesque-latin-ext.woff2'];
// cache:'reload' skips the browser's HTTP cache, so the offline copy is never a mix of two deploys.
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
// Network first for everything; the cache is only the offline copy.
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
  const navigate=event.request.mode==='navigate';
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(navigate?'./index.html':event.request,copy))}
    return response;
  }).catch(()=>caches.match(navigate?'./index.html':event.request)));
});
