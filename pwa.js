(() => {
  "use strict";

  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js", {scope:"./"})
        .catch(err => console.warn("PWA:", err));
    });
  }

  let deferredPrompt = null;

  function addInstallButton() {
    if (standalone || document.getElementById("pwa-install-button")) return;

    const btn = document.createElement("button");
    btn.id = "pwa-install-button";
    btn.type = "button";
    btn.textContent = "Install App";
    btn.setAttribute("aria-label","Install Tools-for-all");

    Object.assign(btn.style,{
      position:"fixed",right:"18px",bottom:"18px",zIndex:"99999",
      border:"0",borderRadius:"999px",padding:"12px 18px",
      font:"600 14px/1.2 system-ui,-apple-system,Segoe UI,sans-serif",
      cursor:"pointer",background:"#111827",color:"#fff",
      boxShadow:"0 8px 24px rgba(0,0,0,.18)"
    });

    btn.onclick = async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch (_) {}
      deferredPrompt = null;
      btn.remove();
    };
    document.body.appendChild(btn);
  }

  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", addInstallButton, {once:true});
    else addInstallButton();
  });

  window.addEventListener("appinstalled", () => {
    const b=document.getElementById("pwa-install-button");
    if(b)b.remove();
    deferredPrompt=null;
  });
})();