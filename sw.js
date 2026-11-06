const CACHE='wyr-b98c94b04d';
const ASSETS=['./','./index.html','./questions.js?v=ac182b7d7a','./logic.js?v=261f5f752d','./manifest.json','./icon-192.png','./icon-512.png'];
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
