/*!
 * // ==UserScript==
 * // @name         tailwind v15 loader
 * // @namespace    tailwind
 * // @version      2026-07-24
 * // @description  tailwind
 * // @include      /^https?:\/\/sandbox.moomoo\.io\/?(\?.*)?$/
 * // @grant        none
 * // @run-at       document-start
 * // ==/UserScript==
 */



var siteKey = "0x4AAAAAAAMYHI96GFiJzMmp";

window.cfToken   = window.cfToken || null;
window.cfHandled = true;
window.cfOnToken = window.cfOnToken || function() {};


var turnstile = {
    host: null,
    slot: null,
    widgetID: null,
    hidden: "position:absolute;left:-99999px;top:0;width:300px;height:65px;",
    shown:  "position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483647;display:flex;flex-direction:column;align-items:center;gap:11px;background:#fff;padding:8px 10px;border-radius:9px;border:1px solid rgba(0,0,0,0.08);box-shadow:0 10px 34px rgba(0,0,0,0.35);",
    hide:   function() { if (this.host) this.host.style.cssText = this.hidden; },
    reveal: function() { if (this.host) this.host.style.cssText = this.shown; },
    render: function() {
        if (this.widgetID !== null) return;
        if (!(window.turnstile && typeof window.turnstile.render === "function")) return;
        if (!document.body) return;
        if (!this.host) {
            this.host = document.createElement("div");
            this.host.id = "turnstileHost";
            this.host.style.cssText = this.hidden;
            var header = document.createElement("div");
            header.style.cssText = "text-align:center;color:#2b2b2b;font-family:'Hammersmith One',sans-serif;line-height:1.15;";
            header.innerHTML = "<div style='font-size:18px;'>Tailwind</div><div style='font-size:12px;color:rgba(0,0,0,0.45);margin-top:1px;'>generate token</div>";
            this.slot = document.createElement("div");
            this.host.appendChild(header);
            this.host.appendChild(this.slot);
            document.documentElement.appendChild(this.host);
        }
        try {
            this.widgetID = window.turnstile.render(this.slot, {
                sitekey: siteKey,
                theme: "light",
                appearance: "interaction-only",
                "refresh-expired": "auto",
                callback: function(token) { window.cfToken = token; turnstile.hide(); window.cfOnToken(token); },
                "error-callback": function(c) { window.cfToken = null; window.cfOnToken(null); },
                "expired-callback": function() { window.cfToken = null; window.cfOnToken(null); },
                "before-interactive-callback": function() { turnstile.reveal(); },
                "after-interactive-callback": function() { turnstile.hide(); },
                "timeout-callback": function() { turnstile.hide(); }
            });
        } catch (e) { console.error("turnstile render failed", e); }
    }
};


window.cfCleanup = function() {
    try {
        if (turnstile.widgetID !== null && window.turnstile && window.turnstile.remove) window.turnstile.remove(turnstile.widgetID);
    } catch (e) {}
    turnstile.widgetID = null;
    poll && clearInterval(poll);
    turnstile.hide();
};


window.cfTurnstileReady = function() { turnstile.render(); };

if (!document.getElementById("cfTurnstilePRE")) {
    var tsPRE = document.createElement("link");
    tsPRE.id = "cfTurnstilePRE";
    tsPRE.rel = "preconnect";
    tsPRE.href = "https://challenges.cloudflare.com";
    tsPRE.crossOrigin = "anonymous";
    (document.head || document.documentElement).appendChild(tsPRE);
}
if (!document.getElementById("cfTurnstileAPI")) {
    var tsAPI = document.createElement("script");
    tsAPI.id = "cfTurnstileAPI";
    tsAPI.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=cfTurnstileReady";
    tsAPI.async = true;
    tsAPI.defer = true;
    (document.head || document.documentElement).appendChild(tsAPI);
}


var tries = 0;
var poll = setInterval(function() {
    turnstile.render();
    if (turnstile.widgetID !== null || ++tries > 500) clearInterval(poll);
}, 50);



var original = /\/assets\/index-[\w-]+\.js(\?|$)/;
var removed = false;

function remove(node) {
    if (node && node.tagName == "SCRIPT" && node.src && original.test(node.src)) {
        node.type = "javascript/blocked";
        node.removeAttribute("src");
        node.textContent = "";
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        removed = true;
    }
}

var observer = new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
            remove(added[j]);
        }
    }
    if (removed && document.body) {
        observer.disconnect();
    }
});
observer.observe(document.documentElement, { childList: true, subtree: true });


var existing = document.querySelectorAll("script");
for (var i = 0; i < existing.length; i++) remove(existing[i]);
