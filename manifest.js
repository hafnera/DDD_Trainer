/* Manifest & Service-Worker setup */
(()=>{
  const icon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAF0lEQVR42mNgGP7/PwMDAwMjI2BgYAAAAAIAAAGhDQvTAAAAABJRU5ErkJggg==";
  const manifest={
    name:"Der Die Das Trainer",
    short_name:"DDD Trainer",
    start_url:".",
    display:"standalone",
    background_color:"#ffffff",
    theme_color:"#ffffff",
    icons:[{src:icon,sizes:"192x192",type:"image/png"},
           {src:icon,sizes:"512x512",type:"image/png"}]
  };
  const manifestURL=URL.createObjectURL(new Blob([JSON.stringify(manifest)],{type:"application/json"}));
  const link=document.createElement("link");link.rel="manifest";link.href=manifestURL;document.head.appendChild(link);

  if("serviceWorker" in navigator){
    const sw=`
      const CACHE="ddd-cache-v1";
      self.addEventListener("install",e=>{
        e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["./"])));
        self.skipWaiting();
      });
      self.addEventListener("activate",e=>{
        e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
        self.clients.claim();
      });
      self.addEventListener("fetch",e=>{
        e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)));
      });
      self.addEventListener("push",e=>{
        const d=e.data?e.data.json():{title:"Trainer",body:"Zeit zum Üben!"};
        self.registration.showNotification(d.title,{body:d.body,icon:"${icon}"});
      });
    `;
    const swURL=URL.createObjectURL(new Blob([sw],{type:"application/javascript"}));
    navigator.serviceWorker.register(swURL);
  }
  if("Notification" in window && Notification.permission==="default"){Notification.requestPermission();}
})();
