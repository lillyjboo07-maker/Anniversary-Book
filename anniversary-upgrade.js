/* Anniversary Book – Seitenübersicht */
(() => {
  let mode = "library";
  const oldBook = book;
  const oldAdd = addPage;
  const oldSelect = select;
  const oldView = view;

  const style = document.createElement("style");
  style.textContent = `
    .memory-top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:18px}
    .memory-top h2{font:700 27px Georgia,serif;margin:0}
    .memory-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:14px}
    .memory-card{border:1px solid var(--line);border-radius:19px;overflow:hidden;background:white;text-align:left;box-shadow:var(--shadow);padding:0}
    .memory-image{height:155px;background:linear-gradient(135deg,#f6e0dc,#fff7ed);display:grid;place-items:center;font-size:42px}
    .memory-image img{width:100%;height:100%;object-fit:cover}
    .memory-info{padding:13px}
    .memory-info strong{display:block;font:700 17px Georgia,serif;margin-bottom:6px}
    .memory-info small{color:var(--muted)}
    .reader{padding:20px}
    .reader h2{font:700 29px Georgia,serif;margin:15px 0 5px}
    .reader-sub{color:var(--muted);margin-bottom:20px}
    .reader-section{padding:15px 0;border-top:1px solid var(--line)}
    .reader-section h3{font:700 19px Georgia,serif;margin:0 0 9px}
    .reader-section p{white-space:pre-wrap;line-height:1.65;margin:0}
    .reader-actions{display:flex;gap:9px;flex-wrap:wrap;justify-content:space-between}
    .reader-actions button{border:0;border-radius:12px;padding:11px 15px;font-weight:750;background:var(--rose2)}
    .reader-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}
    .reader-gallery img{width:100%;border-radius:12px;cursor:pointer}
    .save-page{display:block;width:100%;margin:22px 0 4px;padding:15px;border:0;border-radius:14px;background:var(--rose);color:white;font-weight:800}
  `;
  document.head.appendChild(style);

  function library(){
    return `<section class="card shopping">
      <div class="memory-top">
        <div><h2>Unsere Buchseiten ♡</h2><p class="hint">Alle Erinnerungen an einem Ort</p></div>
        <button class="pill" onclick="openAdd()">＋ Neue Seite</button>
      </div>
      <div class="memory-grid">
        ${S.pages.map((p,i)=>`
          <button class="memory-card" onclick="openMemory(${p.id})">
            <div class="memory-image">${p.images?.[0]?.src ? `<img src="${p.images[0].src}" alt="Vorschaubild">` : "💌"}</div>
            <div class="memory-info">
              <strong>${esc(p.title)}</strong>
              <small>${esc(p.subtitle||"Seite "+(i+1))}</small>
              <div class="hint">${p.type==="double"?"📖 Doppelseite":"📄 Einzelseite"} · ${esc(p.status)}</div>
            </div>
          </button>
        `).join("")}
      </div>
      ${!S.pages.length?'<div class="empty">Noch keine Seiten ♡<p>Erstelle deine erste Erinnerung!</p></div>':""}
    </section>`;
  }

  function reader(){
    const p=current();
    if(!p)return library();
    const section=(name,value)=>value?.trim()?`<div class="reader-section"><h3>${name}</h3><p>${esc(value)}</p></div>`:"";
    return `<section class="card reader">
      <div class="reader-actions">
        <button onclick="backToLibrary()">← Alle Seiten</button>
        <button onclick="editMemory()">✏️ Bearbeiten</button>
      </div>
      <h2>${esc(p.title)}</h2>
      <p class="reader-sub">${esc(p.subtitle||"Unsere Erinnerung ♡")}</p>
      ${p.images?.length?`<div class="reader-section"><h3>📸 Bilder</h3><div class="reader-gallery">${p.images.map(x=>`<img src="${x.src}" alt="${esc(x.name)}" onclick="window.open(this.src,'_blank')">`).join("")}</div></div>`:""}
      ${section("♡ Unsere Erinnerung",p.text)}
      ${section("Linke Seite",p.left)}
      ${section("Rechte Seite",p.right)}
      ${section("💭 Ideen",p.ideas)}
      ${section("🎨 Farben",p.colors)}
      ${section("✂️ Materialien",p.materials)}
      ${section("🎀 Dekoration",p.decor)}
      ${section("📝 Notizen",p.notes)}
      ${p.videos?.length?`<div class="reader-section"><h3>🎥 Videos</h3>${p.videos.map(v=>`<p>${esc(v.title)}: <a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">Video öffnen</a></p>`).join("")}</div>`:""}
      ${p.checks?.length?`<div class="reader-section"><h3>✓ Checkliste</h3>${p.checks.map(x=>`<p>${x.done?"☑":"☐"} ${esc(x.text)}</p>`).join("")}</div>`:""}
      ${p.shopping?.length?`<div class="reader-section"><h3>🛍 Einkaufsliste</h3>${p.shopping.map(x=>`<p>${x.done?"☑":"☐"} ${esc(x.text)}</p>`).join("")}</div>`:""}
      <button class="save-page" onclick="editMemory()">✏️ Seite bearbeiten</button>
    </section>`;
  }

  window.openMemory=function(id){
    S.selected=id;save();mode="reader";render();
    window.scrollTo(0,0);
  };
  window.backToLibrary=function(){
    mode="library";render();window.scrollTo(0,0);
  };
  window.editMemory=function(){
    mode="editor";render();window.scrollTo(0,0);
  };
  window.saveMemory=function(){
    save();mode="library";render();window.scrollTo(0,0);
  };

  book=function(){
    if(mode==="library")return library();
    if(mode==="reader")return reader();
    const html=oldBook();
    return html.replace("</section>`", "</section>`");
  };

  addPage=function(type){
    oldAdd(type);mode="editor";render();
  };
  select=function(id){
    oldSelect(id);mode="reader";render();
  };
  view=function(v){
    if(v==="book")mode="library";
    oldView(v);
  };

  const previousBook=book;
  book=function(){
    if(mode!=="editor")return previousBook();
    const html=oldBook();
    const marker='</section>';
    const pos=html.lastIndexOf(marker);
    if(pos<0)return html;
    return html.slice(0,pos)+'<button class="save-page" onclick="saveMemory()">♡ Seite speichern</button>'+html.slice(pos);
  };

  mode="library";
  render();
})();
