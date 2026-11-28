(() => {
  const $ = id => document.getElementById(id);
  const client = window.supabase.createClient(window.MITHAN_SUPABASE_URL, window.MITHAN_SUPABASE_ANON_KEY);
  let currentUser = null;
  let songsCache = [];
  const allowedEmail = (window.MITHAN_ADMIN_EMAIL || "").toLowerCase();

  $("year").textContent = new Date().getFullYear();

  function message(id, text, error=false){ const el=$(id); el.textContent=text; el.classList.toggle("error",error); }
  function safeName(name){ return name.replace(/[^\w.\-]+/g,"_").replace(/^_+|_+$/g,"").slice(-100) || "upload"; }
  function fileTitle(name){ return name.replace(/\.[^.]+$/,"").replace(/[_-]+/g," ").trim(); }
  function publicUrl(path){ return client.storage.from(window.MITHAN_BUCKET).getPublicUrl(path).data.publicUrl; }

  function showDashboard(show){
    $("loginView").hidden=show;
    $("dashboardView").hidden=!show;
    $("logoutBtn").hidden=!show;
    document.querySelector(".top-right").hidden=!show;
    if(show) loadDashboard();
  }
  function navigate(view){
    document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
    document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===view+"View"));
    const titles={overview:"Overview",upload:"Upload music",songs:"Songs library",artists:"Artist profiles"};
    $("pageTitle").textContent=titles[view]||"Overview";
  }
  document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
  document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));

  $("loginForm").addEventListener("submit",async e=>{
    e.preventDefault(); message("loginMessage","Signing in…");
    const {data,error}=await client.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});
    if(error){message("loginMessage",error.message,true);return;}
    if((data.user?.email||"").toLowerCase()!==allowedEmail){
      await client.auth.signOut(); message("loginMessage","This account is not authorized for Mithan Music Studio.",true); return;
    }
    currentUser=data.user; showDashboard(true);
  });
  $("logoutBtn").addEventListener("click",async()=>{await client.auth.signOut();currentUser=null;showDashboard(false);$("password").value="";});

  async function verifyUser(){
    const {data}=await client.auth.getSession();
    const user=data.session?.user;
    if(user && (user.email||"").toLowerCase()===allowedEmail){currentUser=user;showDashboard(true);}
    else { if(user) await client.auth.signOut(); showDashboard(false); }
  }

  async function loadSongs(){
    const {data,error}=await client.from("songs").select("*").order("created_at",{ascending:false});
    if(error) throw error;
    songsCache=data||[];
    $("songCount").textContent=songsCache.length;
    renderSongs("recentSongs",songsCache.slice(0,5),false);
    renderSongs("allSongs",songsCache,true);
  }
  function renderSongs(target,rows,actions){
    const root=$(target); root.innerHTML="";
    if(!rows.length){root.innerHTML='<div class="empty-state">No songs have been uploaded yet.</div>';return;}
    rows.forEach(song=>{
      const row=document.createElement("div");row.className="song-row";
      const img=document.createElement(song.cover_url?"img":"div");img.className="song-cover";
      if(song.cover_url){img.src=song.cover_url;img.alt="";}else img.textContent="♫";
      const info=document.createElement("div");info.className="song-info";
      const title=document.createElement("b");title.textContent=song.title||"Untitled";
      const meta=document.createElement("small");meta.textContent=[song.artist,song.album].filter(Boolean).join(" · ")||"Artist not set";
      info.append(title,meta);row.append(img,info);
      if(actions){
        const tools=document.createElement("div");tools.className="row-actions";
        const edit=document.createElement("button");edit.className="small-btn";edit.textContent="Edit";edit.addEventListener("click",()=>openEdit(song));
        const del=document.createElement("button");del.className="small-btn danger";del.textContent="Delete";del.addEventListener("click",()=>deleteSong(song));
        tools.append(edit,del);row.append(tools);
      }
      root.append(row);
    });
  }
  async function loadArtists(){
    const {data,error}=await client.from("artists").select("*").order("created_at",{ascending:false});
    if(error) throw error;
    $("artistCount").textContent=(data||[]).length;
    const root=$("artistList");root.innerHTML="";
    if(!data?.length){root.innerHTML='<div class="empty-state">No artist profiles saved yet.</div>';return;}
    data.forEach(a=>{
      const card=document.createElement("article");card.className="artist-card";
      const pic=document.createElement(a.photo_url?"img":"div");pic.className="artist-photo";
      if(a.photo_url)pic.src=a.photo_url;else pic.textContent="◉";
      const details=document.createElement("div");const name=document.createElement("b");name.textContent=a.name;
      const bio=document.createElement("p");bio.textContent=a.bio||"No biography added";details.append(name,bio);card.append(pic,details);root.append(card);
    });
  }
  async function loadDashboard(){
    try{await loadSongs();await loadArtists();}
    catch(err){console.error(err);message("loginMessage","Dashboard data error: "+err.message,true);}
  }

  $("audioFiles").addEventListener("change",()=>{
    const files=[...$("audioFiles").files];
    $("audioFileNames").textContent=files.length?files.map(f=>f.name).join(" · "):"No files selected";
  });
  $("coverFile").addEventListener("change",()=>{
    const f=$("coverFile").files[0];const preview=$("coverPreview");
    if(!f){preview.textContent="＋";preview.removeAttribute("src");return;}
    const url=URL.createObjectURL(f);preview.style.backgroundImage=`url("${url}")`;preview.style.backgroundSize="cover";preview.style.backgroundPosition="center";preview.textContent="";
  });
  $("uploadForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const files=[...$("audioFiles").files], cover=$("coverFile").files[0];
    if(!files.length){message("uploadMessage","Choose at least one audio file.",true);return;}
    const btn=$("uploadSubmit");btn.disabled=true;$("uploadProgress").hidden=false;
    let done=0,failed=[];
    try{
      let coverUrl=null;
      if(cover){
        const coverPath=`covers/${Date.now()}_${safeName(cover.name)}`;
        const up=await client.storage.from(window.MITHAN_BUCKET).upload(coverPath,cover,{upsert:false,contentType:cover.type||"image/jpeg"});
        if(up.error) throw up.error;
        coverUrl=publicUrl(coverPath);
      }
      for(const file of files){
        try{
          const audioPath=`audio/${Date.now()}_${crypto.randomUUID()}_${safeName(file.name)}`;
          const up=await client.storage.from(window.MITHAN_BUCKET).upload(audioPath,file,{upsert:false,contentType:file.type||"audio/mpeg"});
          if(up.error) throw up.error;
          const record={title:fileTitle(file.name),artist:$("uploadArtist").value.trim(),album:$("uploadAlbum").value.trim()||null,audio_url:publicUrl(audioPath),cover_url:coverUrl};
          const ins=await client.from("songs").insert(record);
          if(ins.error) throw ins.error;
        }catch(err){failed.push(`${file.name}: ${err.message}`);}
        done++;$("progressBar").style.width=`${done/files.length*100}%`;
        $("progressText").textContent=`Processed ${done} of ${files.length} tracks`;
      }
      if(failed.length) message("uploadMessage",`${files.length-failed.length} uploaded. ${failed.length} failed: ${failed.join(" | ")}`,true);
      else message("uploadMessage",`Successfully uploaded ${files.length} track(s).`);
      if(done>0){$("audioFiles").value="";$("coverFile").value="";$("audioFileNames").textContent="No files selected";$("coverPreview").style.backgroundImage="";$("coverPreview").textContent="＋";await loadSongs();}
    }catch(err){message("uploadMessage",err.message,true);}
    finally{btn.disabled=false;}
  });

  $("artistForm").addEventListener("submit",async e=>{
    e.preventDefault();const btn=$("artistSubmit");btn.disabled=true;message("artistMessage","Saving profile…");
    try{
      let photoUrl=null;const photo=$("artistPhoto").files[0];
      if(photo){const path=`artists/${Date.now()}_${safeName(photo.name)}`;const up=await client.storage.from(window.MITHAN_BUCKET).upload(path,photo,{upsert:false,contentType:photo.type});if(up.error)throw up.error;photoUrl=publicUrl(path);}
      const {error}=await client.from("artists").insert({name:$("artistName").value.trim(),bio:$("artistBio").value.trim()||null,photo_url:photoUrl});
      if(error)throw error;
      message("artistMessage","Artist profile saved successfully.");$("artistForm").reset();await loadArtists();
    }catch(err){message("artistMessage",err.message,true);}
    finally{btn.disabled=false;}
  });

  function openEdit(song){
    $("editId").value=song.id;$("editTitle").value=song.title||"";$("editArtist").value=song.artist||"";$("editAlbum").value=song.album||"";
    $("editMessage").textContent="";$("editDialog").showModal();
  }
  $("closeDialog").addEventListener("click",()=>$("editDialog").close());
  $("cancelEdit").addEventListener("click",()=>$("editDialog").close());
  $("editForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const id=$("editId").value;
    const {error}=await client.from("songs").update({title:$("editTitle").value.trim(),artist:$("editArtist").value.trim(),album:$("editAlbum").value.trim()||null}).eq("id",id);
    if(error){message("editMessage",error.message,true);return;}
    $("editDialog").close();await loadSongs();
  });
  async function deleteSong(song){
    if(!confirm(`Remove "${song.title}" from the songs catalogue?`))return;
    const {error}=await client.from("songs").delete().eq("id",song.id);
    if(error){alert(error.message);return;}
    await loadSongs();
  }

  verifyUser();
})();