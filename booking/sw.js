/* Epic Booking: keeps the app shell openable; every API call and page always goes to the network first. */
var C='epic-booking-v2',FILES=['/booking/','/booking/icon-192.png','/booking/icon-512.png','/booking/apple-touch-icon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin||u.pathname.indexOf('/booking/')!==0)return;
  e.respondWith(fetch(new Request(r,{cache:'no-store'})).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}return res}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('/booking/')})}))});
