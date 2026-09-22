(function(){
  const root=document.body;
  const DATA="/data/posts.json";
  const THEMES="/data/themes.json";
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
  const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const dateValue=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||"")?s:"9999-99-99";

  async function load(){
    const [p,t]=await Promise.all([fetch(DATA).then(r=>r.json()),fetch(THEMES).then(r=>r.json())]);
    return {posts:p,themes:t};
  }
  function link(p){return '<a class="read-link" href="'+esc(p.url)+'">Ler →</a>'}
  function renderArchive(posts){
    const el=document.querySelector('[data-site-view="archive-list"]'); if(!el)return;
    const sorted=[...posts].sort((a,b)=>dateValue(a.date).localeCompare(dateValue(b.date))||a.title.localeCompare(b.title,'pt'));
    el.innerHTML=sorted.map(p=>'<article class="archive-card"><div class="archive-meta">'+esc(p.date)+'</div><h2><a href="'+esc(p.url)+'">'+esc(p.title)+'</a></h2><p>'+esc(p.excerpt||"")+'</p>'+link(p)+'</article>').join("");
    const c=document.querySelector("[data-article-count]"); if(c)c.textContent=posts.length;
  }
  function renderSearch(posts){
    const input=document.querySelector("#q"),results=document.querySelector("#results"),meta=document.querySelector("#meta"); if(!input||!results)return;
    const go=()=>{const q=norm(input.value.trim()); let a=q?posts.filter(p=>norm([p.title,p.date,p.text,p.category].join(" ")).includes(q)):posts;
      meta.textContent=input.value.trim()?a.length+" resultado"+(a.length===1?"":"s"):posts.length+" textos no arquivo";
      results.innerHTML=a.slice(0,100).map(p=>'<article class="search-result"><div class="search-result-meta">'+esc(p.date)+'</div><h2><a href="'+esc(p.url)+'">'+esc(p.title)+'</a></h2><p>'+esc(p.excerpt||"")+'</p>'+link(p)+'</article>').join("")||'<div class="note-box"><strong>Não encontrei resultados.</strong></div>'};
    input.addEventListener("input",go); go();
  }
  function renderCatalog(posts){
    const el=document.querySelector('[data-site-view="catalog-list"]'); if(!el)return;
    const sorted=[...posts].sort((a,b)=>dateValue(a.date).localeCompare(dateValue(b.date))||a.title.localeCompare(b.title,'pt'));
    el.innerHTML=sorted.map(p=>'<article class="catalog-card"><div class="catalog-meta">'+esc(p.date)+'</div><h2><a href="'+esc(p.url)+'">'+esc(p.title)+'</a></h2><p>'+esc(p.excerpt||"")+'</p><div class="catalog-tags">'+esc(p.category||"")+'</div>'+link(p)+'</article>').join("");
    const c=document.querySelector("[data-article-count]"); if(c)c.textContent=posts.length;
  }
  function renderThemes(posts,themes){
    const el=document.querySelector('[data-site-view="themes-grid"]'); if(!el)return;
    el.innerHTML=themes.map(t=>{const n=posts.filter(p=>(p.themes||[]).includes(t.slug)).length;
      return '<a class="theme-card" href="/temas/'+esc(t.slug)+'.html"><span class="theme-name">'+esc(t.name)+'</span><span class="theme-count">'+n+'</span><span class="theme-label">textos</span></a>'
    }).join("");
  }
  function renderTheme(posts,themes){
    const el=document.querySelector('[data-site-view="theme-list"]'); if(!el)return;
    const slug=el.getAttribute("data-theme"); const t=themes.find(x=>x.slug===slug); if(!t)return;
    const list=posts.filter(p=>(p.themes||[]).includes(slug)).sort((a,b)=>dateValue(a.date).localeCompare(dateValue(b.date))||a.title.localeCompare(b.title,'pt'));
    const count=document.querySelector("[data-theme-count]"); if(count)count.textContent=list.length;
    el.innerHTML=list.map(p=>'<li class="theme-post"><a href="'+esc(p.url)+'"><span class="post-title">'+esc(p.title)+'</span><span class="post-date">'+esc(p.date)+'</span></a></li>').join("");
  }
  function renderChronology(posts){
    const el=document.querySelector('[data-site-view="chronology"]'); if(!el)return;
    const grouped={};
    posts.filter(p=>/^\d{4}-\d{2}-\d{2}$/.test(p.date)).forEach(p=>{(grouped[p.date.slice(0,4)]??=[]).push(p)});
    const years=Object.keys(grouped).sort((a,b)=>Number(b)-Number(a));
    el.innerHTML=years.map(y=>'<section class="chrono-year"><h2>'+y+'</h2><ul>'+grouped[y].sort((a,b)=>b.date.localeCompare(a.date)).map(p=>'<li><a href="'+esc(p.url)+'">'+esc(p.title)+'</a><span>'+esc(p.date)+'</span></li>').join("")+'</ul></section>').join("");
  }

  load().then(({posts,themes})=>{
    renderArchive(posts); renderSearch(posts); renderCatalog(posts); renderThemes(posts,themes); renderTheme(posts,themes); renderChronology(posts);
  }).catch(()=>{});
})();