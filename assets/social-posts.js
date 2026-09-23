(function(){
  const ROOT="";
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",""":"&quot;","'":"&#039;"}[c]));
  const fmtDate=s=>{if(!s)return "";const d=new Date(s+"T00:00:00");return Number.isNaN(d.getTime())?s:d.toLocaleDateString("pt-PT",{day:"2-digit",month:"long",year:"numeric"});};
  const run=async()=>{
    const wrap=document.getElementById("social-posts"),empty=document.getElementById("social-empty");
    if(!wrap)return;
    try{
      const data=await fetch(ROOT+"/data/social.json?v=20260923",{cache:"no-store"}).then(r=>r.json());
      const posts=Array.isArray(data)?data:[];
      posts.sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));
      if(!posts.length){empty.hidden=false;return;}
      wrap.innerHTML=posts.map(p=>{
        const platform=p.platform?'<div class="social-platform">'+esc(p.platform)+'</div>':"";
        const date=p.date?'<div class="social-date">'+esc(fmtDate(p.date))+'</div>':"";
        const href=p.site_url||p.url||"#";
        const link=href==="#"?"":'<a class="read-link" href="'+esc(href)+'" target="_blank" rel="noopener">Abrir publicação original →</a>';
        return '<article class="social-post">'+platform+date+
          '<h2>'+esc(p.title||"Publicação")+'</h2>'+
          (p.excerpt?'<p>'+esc(p.excerpt)+'</p>':"")+link+
        '</article>';
      }).join("");
    }catch(e){
      console.error("Publicações:",e);
      empty.hidden=false;
    }
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);else run();
})();