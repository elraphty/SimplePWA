
const main=document.querySelector('main');
const apiKey='b8495a31f81c499e98ba6696bc1bcae8';
const sourceSelector=document.querySelector('#sourceSelector');
const defaultSource='the-washington-post';

window.addEventListener('load',async e =>{
    updateNews();
   await updateSources();
   
   sourceSelector.value=defaultSource;

   sourceSelector.addEventListener('change',e =>{
       updateNews(e.target.value);
   })

   //Check is service worker is in navigator for serviceworker registration
    if('serviceWorker' in navigator){
       
       try{
           navigator.serviceWorker.register('serviceWorker.js')
           console.log('Service Worker Registered')
       }catch (e) {
           console.log('Service Worker Registration failed')
       }

    }
    
});

async function updateSources(){
const res =await fetch('https://newsapi.org/v1/sources?language=en');
const json = await res.json();

sourceSelector.innerHTML =json.sources
    .map(source=>`<option value="${source.id}">${source.name}</option>`).join('\n');

}

async function updateNews(source=defaultSource) {
  const res= await fetch(`https://newsapi.org/v1/articles?source=${source}&apiKey=${apiKey}`);
  const json=await res.json();
  main.innerHTML=json.articles.map(createdArticle).join('\n');
}

function createdArticle (article){
    return  `
    <div class="article">
    <a href="${article.url}">
    <h2>${article.url}</h2>
    <img src="${article.urlToImage}"> </img>
    <p>${article.description}</p>
    </a>
    </div>
    `;
}