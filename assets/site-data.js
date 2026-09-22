(function(){
  const DATA="/data/posts.json";
  const THEMES="/data/themes.json";
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
  const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const dated=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||"");
  const sortPosts=(a,b)=>{if(dated(a.date)&&!dated(b.date))return -1;if(!dated(a.date)&&dated(b.date))return 1;return (b.date||"").localeCompare(a.date||"")||a.title.localeCompare(b.title,"pt")};

  async function load(){
    const [p,t]=await Promise.all([
      fetch(DATA,{cache:"no-store"}).then(r=>r.json()),
      fetch(THEMES,{cache:"no-store"}).then(r=>r.json())
    ]);
    return {posts:p,themes:t};
  }
  function readLink(p){return '<a class="read-link" href="'+esc(p.url)+'">Ler →</a>'}
  function renderArchive(posts){
    const el=document.querySelector(".archive-grid"); if(!el)return;
    const list=[...posts].sort(sortPosts);
    el.innerHTML=list.map(p=>'<article class="archive-card">'+(dated(p.date)?'<div class="archive-meta">'+esc(p.date)+'</div>':'')+
      '<h2><a href="'+esc(p.url)+'">'+esc(p.title)+'</a></h2><p>'+esc(p.excerpt||"")+'</p>'+readLink(p)+'</article>').join("");
    const h=document.querySelector("h1"); if(h)h.innerHTML=h.textContent.replace(/^\d+/,String(posts.length));
  }
  function renderSearch(posts){
    const input=document.querySelector("#q"),results=document.querySelector("#results"),meta=document.querySelector("#meta"); if(!input||!results)return;
    const go=()=>{const q=norm(input.value.trim());
      const list=q?posts.filter(p=>norm([p.title,p.date,p.text,p.category].join(" ")).includes(q)):posts;
      meta.textContent=input.value.trim()?list.length+" resultado"+(list.length===1?"":"s"):posts.length+" textos no arquivo";
      results.innerHTML=list.slice(0,100).map(p=>'<article class="search-result">'+(dated(p.date)?'<div class="search-result-meta">'+esc(p.date)+'</div>':'')+
        '<h2><a href="'+esc(p.url)+'">'+esc(p.title)+'</a></h2><p>'+esc(p.excerpt||"")+'</p>'+readLink(p)+'</article>').join("")||
        '<div class="note-box"><strong>Não encontrei resultados.</strong></div>';
    };
    input.oninput=go; go();
  }
  function renderCatalog(posts){
    const el=document.querySelector(".catalog-grid"); if(!el)return;
    const list=[...posts].sort(sortPosts);
    el.innerHTML=list.map(p=>'<article class="catalog-card">'+(dated(p.date)?'<div class="catalog-meta">'+esc(p.date)+'</div>':'')+
      '<h2><a href="'+esc(p.url)+'">'+esc(p.title)+'</a></h2><p>'+esc(p.excerpt||"")+'</p>'+
      '<div class="catalog-tags">'+esc(p.category||"")+'</div>'+readLink(p)+'</article>').join("");
    const h=document.querySelector("h1"); if(h)h.innerHTML=h.textContent.replace(/\b\d+\b/,String(posts.length));
  }
  function renderThemes(posts,themes){
    const el=document.querySelector(".themes-grid"); if(!el)return;
    el.innerHTML=themes.map(t=>{const n=posts.filter(p=>(p.themes||[]).includes(t.slug)).length;
      return '<a class="theme-card" href="/temas/'+esc(t.slug)+'.html"><span class="theme-name">'+esc(t.name)+'</span><span class="theme-count">'+n+'</span><span class="theme-label">textos</span></a>';
    }).join("");
  }
  function renderTheme(posts,themes,slug){
    const el=document.querySelector(".theme-posts"); if(!el)return;
    const t=themes.find(x=>x.slug===slug); if(!t)return;
    const list=posts.filter(p=>(p.themes||[]).includes(slug)).sort(sortPosts);
    const head=el.closest("main")?.querySelector(".page-head p");
    if(head)head.textContent=list.length+" texto"+(list.length===1?"":"s")+" neste tema.";
    el.innerHTML=list.map(p=>'<li class="theme-post"><a href="'+esc(p.url)+'"><span class="post-title">'+esc(p.title)+'</span>'+
      (dated(p.date)?'<span class="post-date">'+esc(p.date)+'</span>':'')+'</a></li>').join("");
  }
  function renderChronology(posts){
    const el=document.querySelector(".chronology"); if(!el)return;
    const grouped={};
    posts.filter(p=>dated(p.date)).forEach(p=>(grouped[p.date.slice(0,4)]??=[]).push(p));
    const years=Object.keys(grouped).sort((a,b)=>Number(b)-Number(a));
    el.innerHTML=years.map(y=>'<section class="chrono-year"><h2>'+y+'</h2><ul>'+
      grouped[y].sort((a,b)=>b.date.localeCompare(a.date)).map(p=>'<li><a href="'+esc(p.url)+'">'+esc(p.title)+'</a><span>'+esc(p.date)+'</span></li>').join("")+
      '</ul></section>').join("");
  }

  function run(){
    const path=window.location.pathname.replace(/\/$/,"")||"/";
    load().then(({posts,themes})=>{
      if(path==="/arquivo.html") renderArchive(posts);
      else if(path==="/pesquisa.html") renderSearch(posts);
      else if(path==="/catalogo.html") renderCatalog(posts);
      else if(path==="/temas.html") renderThemes(posts,themes);
      else if(path==="/cronologia.html") renderChronology(posts);
      else {
        const m=path.match(/^\/temas\/([^/]+)\.html$/);
        if(m) renderTheme(posts,themes,m[1]);
      }
    }).catch(err=>console.error("Arquivo:",err));
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run);
  else run();
})();