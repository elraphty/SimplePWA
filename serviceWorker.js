const staticAssets=[
    './',
    './styles.css',
    './app.js',
    './fallback.json',
    './images/fallback.jpg'
];

//When installed

self.addEventListener('install', async event=>{
   // console.log("Installed")
   //creating static Cache
    const cache= await caches.open('news-static');

    //adding staticAssets to cache
    cache.addAll(staticAssets);
})


//Fecthing when no network
self.addEventListener('fetch',event=>{

    const req=event.request;
    const url=new URL(req.url);

    //checking what to respondwith
    if(url.origin === location.origin)
    {
        event.respondWith(cacheFirst(req))
    }
    else{
        event.respondWith(networkFirst(req))
    }

})


//Local cache

async function cacheFirst(req) {

    //check if there is a cache else add cache
    const cacheResponse= await caches.match(req);
    return cacheResponse || fetch(req)
}


//network cache
async function networkFirst(req) {

    //creating another cache for network calls
    const cache = await caches.open('news-dynamic');
    try{
      const res= await fetch(req)
        cache.put(req, res.clone())
        return res;
    }catch(e){
        //if error occurs while that is the request has been cached respond with the fallback.json static data
      const cacheResponse= await cache.match(req);
      return cacheResponse || await caches.match('./fallback.json');
    }

}