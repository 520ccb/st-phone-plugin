// 通用APP 手机插件 · jQuery主页面版 | 适配酒馆助手(Tavern Helper)脚本沙箱
// 依据官方文档：脚本里的 $ 绑定到酒馆主页面；须用 $(()=>{}) 等页面就绪后再执行。
(function () {
    "use strict";

    var $ = window.$ || window.jQuery;
    try { if (!$ && window.parent) $ = window.parent.$ || window.parent.jQuery; } catch (e) {}

    function whenReady(fn) {
        if ($ && typeof $ === "function") { try { $(fn); return; } catch (e) {} }
        if (document.readyState !== "loading") { setTimeout(fn, 300); }
        else { document.addEventListener("DOMContentLoaded", function () { setTimeout(fn, 300); }); }
        setTimeout(fn, 2000);
    }

    var started = false;
    function boot() {
        if (started) return;

        var MD, MW;
        try {
            var b = ($ && $("body") && $("body")[0]) ? $("body")[0] : null;
            MD = b ? b.ownerDocument : null;
        } catch (e) { MD = null; }
        if (!MD || !(MD.querySelector("#chat") || MD.querySelector("#send_textarea"))) {
            var cands = [window];
            try { var w = window; while (w.parent && w.parent !== w) { w = w.parent; cands.push(w); } } catch (e) {}
            try { if (window.top) cands.push(window.top); } catch (e) {}
            for (var i = 0; i < cands.length; i++) {
                try { var d = cands[i].document; if (d && (d.querySelector("#chat") || d.querySelector("#send_textarea"))) { MD = d; break; } } catch (e) {}
            }
        }
        if (!MD) MD = document;
        MW = MD.defaultView || window;
        if (!MD.querySelector("#chat") && !MD.querySelector("#send_textarea")) { return; }
        started = true;

        try { var of = MD.getElementById("uapp-fb"); if (of) of.remove(); var op = MD.getElementById("uapp-panel"); if (op) op.remove(); } catch (e) {}

        var DEFAULT_BG = "linear-gradient(160deg,#1a2350 0%,#3a1f4d 55%,#0d0d18 100%)";
        function getWallpaper() { try { return localStorage.getItem("uapp_wallpaper") || ""; } catch (e) { return ""; } }
        function setWallpaper(v) { try { v ? localStorage.setItem("uapp_wallpaper", v) : localStorage.removeItem("uapp_wallpaper"); } catch (e) {} }
        function bgStyle() { var w = getWallpaper(); return w ? "url('" + w + "') center/cover" : DEFAULT_BG; }

        var APPS = {
            "reality": { title: "😈 现实扭曲", section: "🔨 万物修改", desc: "根据你输入的内容修改现实",
                inputs: [{ key: "c", label: "扭曲内容", ph: "例如：让我成为本市首富" }],
                options: [{ key: "r", label: "作用范围", choices: ["个人", "特定地点", "城市", "国家", "全宇宙"] },
                          { key: "t", label: "持续时间", choices: ["10分钟", "1小时", "1天", "1周", "永久"] }],
                build: function (v) { return "打开【现实扭曲界面】。扭曲内容：" + (v.c || "未填写") + "；范围：" + (v.r || "个人") + "；持续：" + (v.t || "永久"); } },
            "relation": { title: "👰 关系修改", section: "🔨 万物修改", desc: "修改你与目标的社会/家庭/情感关系",
                inputs: [{ key: "tg", label: "目标全名", ph: "输入目标姓名" }, { key: "rl", label: "修改为", ph: "例如：青梅竹马 / 上司" }],
                build: function (v) { return "打开【关系修改界面】。目标：" + (v.tg || "未填写") + "；将关系修改为：" + (v.rl || "未填写"); } },
            "identity": { title: "🥼 身份编辑", section: "🔨 万物修改", desc: "变更身份与职业，编辑个人资料",
                inputs: [{ key: "n", label: "身份/姓名", ph: "输入新身份" }, { key: "j", label: "职业", ph: "输入新职业" }],
                build: function (v) { return "打开【身份编辑界面】。身份：" + (v.n || "未变") + "；职业：" + (v.j || "未变"); } },
            "skill": { title: "🔮 技能/超能力", section: "🔨 万物修改", desc: "获得指定的技能或超能力",
                inputs: [{ key: "s", label: "能力名称", ph: "例如：读心术 / 瞬间移动" }],
                build: function (v) { return "打开【技能/超能力】界面。希望获得的能力：" + (v.s || "未填写"); } },
            "summon": { title: "🤞 万能召唤", section: "🔨 万物修改", desc: "从现实/历史/虚构作品中召唤物品或生物",
                inputs: [{ key: "o", label: "召唤对象", ph: "例如：一辆兰博基尼 / 一只哥布林" }],
                build: function (v) { return "打开【万能召唤】界面。召唤对象：" + (v.o || "未填写"); } },
            "rpgchar": { title: "🎲 RPG角色界面", section: "🔨 万物修改", desc: "把信息量化为RPG数值分析角色",
                inputs: [{ key: "tg", label: "分析对象", ph: "输入角色名（留空为自己）" }],
                build: function (v) { return "打开【RPG角色界面】。分析对象：" + (v.tg || "我自己"); } },
            "rpgteam": { title: "🎲 RPG队伍界面", section: "🔨 万物修改", desc: "查看自己或敌方队伍构成",
                options: [{ key: "sd", label: "查看", choices: ["我方队伍", "敌方队伍"] }],
                build: function (v) { return "打开【RPG界面】的队伍界面。查看：" + (v.sd || "我方队伍"); } },
            "innerworld": { title: "🔒 生成里世界", section: "🔨 万物修改", desc: "生成主题里世界并拉入他人",
                inputs: [{ key: "th", label: "主题", ph: "例如：末日废土 / 校园" }, { key: "w", label: "拉入对象", ph: "输入目标（可留空）" }],
                build: function (v) { return "使用【生成里世界】功能。主题：" + (v.th || "未填写") + "；拉入对象：" + (v.w || "无"); } },
            "imaginary": { title: "📥 虚数空间", section: "🔨 万物修改", desc: "进入你掌控一切的独立宇宙",
                inputs: [{ key: "w", label: "一同带入", ph: "输入目标（可留空）" }],
                build: function (v) { return "打开【虚数空间界面】。进入虚数空间；带入对象：" + (v.w || "无"); } },
            "time": { title: "⏲ 时间操作", section: "🦾 万能操作", desc: "操纵时间：流速/冻结/旅行/倒流",
                options: [{ key: "a", label: "操作", choices: ["加速流速", "冻结时间", "恢复时间", "时间旅行", "时间倒流"] }],
                inputs: [{ key: "d", label: "补充说明", ph: "例如：倒流1小时 / 前往2000年" }],
                build: function (v) { return "打开【时间操作页面】。操作：" + (v.a || "冻结时间") + "；说明：" + (v.d || "无"); } },
            "teleport": { title: "🚐 传送服务", section: "🦾 万能操作", desc: "将你和目标传送至任意地点",
                inputs: [{ key: "tg", label: "传送目标", ph: "输入目标（留空为自己）" }, { key: "p", label: "目的地", ph: "输入地点" }],
                build: function (v) { return "打开【传送服务界面】。传送目标：" + (v.tg || "我自己") + "；目的地：" + (v.p || "未填写"); } },
            "camera": { title: "📸 万能摄像头", section: "🦾 万能操作", desc: "在任意地点生成不可见的摄像头",
                inputs: [{ key: "p", label: "安放地点", ph: "输入地点" }, { key: "tg", label: "监控目标", ph: "输入目标" }],
                build: function (v) { return "打开【万能摄像头界面】。安放地点：" + (v.p || "未填写") + "；监控目标：" + (v.tg || "未填写"); } },
            "invisible": { title: "👓 隐身模式", section: "🦾 万能操作", desc: "以多种方式隐于无形",
                options: [{ key: "m", label: "隐身方式", choices: ["存在感抹除", "气息遮断", "视觉盲区", "多维隐形", "因果屏障"] }],
                build: function (v) { return "打开【隐身模式页面】。开启方式：" + (v.m || "存在感抹除"); } },
            "memory": { title: "🎞 记忆操作", section: "🦾 万能操作", desc: "植入虚假记忆或抹去记忆",
                inputs: [{ key: "tg", label: "目标", ph: "输入目标姓名" }, { key: "c", label: "记忆内容", ph: "植入/抹去的记忆" }],
                options: [{ key: "ty", label: "类型", choices: ["植入记忆", "抹去记忆"] }],
                build: function (v) { return "使用【记忆操作】功能。目标：" + (v.tg || "未填写") + "；" + (v.ty || "植入记忆") + "：" + (v.c || "未填写"); } },
            "info": { title: "🤖 信息操作", section: "🦾 万能操作", desc: "修改目标信息，现实随之改变",
                inputs: [{ key: "tg", label: "目标", ph: "输入目标姓名" }, { key: "f", label: "修改项与新值", ph: "例如：职业→改为总裁" }],
                build: function (v) { return "打开【目标信息界面】。目标：" + (v.tg || "未填写") + "；修改内容：" + (v.f || "未填写"); } }
        };

        function getFavs() { try { return JSON.parse(localStorage.getItem("uapp_favs") || "[]"); } catch (e) { return []; } }
        function addFav(txt) { var a = getFavs(); a.unshift({ t: txt, d: new Date().toLocaleString() }); try { localStorage.setItem("uapp_favs", JSON.stringify(a.slice(0, 50))); } catch (e) {} }

        function sendTrigger(text) {
            try {
                var ts = window.triggerSlash || (window.TavernHelper && window.TavernHelper.triggerSlash) || MW.triggerSlash;
                if (ts) { ts("/send " + text + " | /trigger"); return true; }
            } catch (e) {}
            var ta = MD.querySelector("#send_textarea"), btn = MD.querySelector("#send_but");
            if (ta) {
                ta.value = text;
                try { ta.dispatchEvent(new MW.Event("input", { bubbles: true })); } catch (e) { ta.dispatchEvent(new Event("input", { bubbles: true })); }
                if (btn) { btn.click(); return true; }
            }
            try { MW.alert("未找到输入框：" + text); } catch (e) {}
            return false;
        }
        function getLastBotText() {
            var all = [].slice.call(MD.querySelectorAll("#chat .mes")).filter(function (m) { return m.getAttribute("is_user") === "false"; });
            var last = all[all.length - 1], t = last && last.querySelector(".mes_text");
            return t ? t.innerText : "";
        }

        var fb = MD.createElement("div");
        fb.id = "uapp-fb"; fb.innerText = "📱";
        fb.style.cssText = "position:fixed;bottom:120px;right:14px;z-index:2147483647;width:52px;height:52px;line-height:52px;text-align:center;font-size:26px;background:#4488ff;color:#fff;border-radius:50%;box-shadow:0 4px 14px rgba(0,0,0,.5);cursor:pointer;user-select:none;";
        MD.body.appendChild(fb);
        fb.addEventListener("click", function () { togglePanel(); });

        (function () {
            var _eventOn = window.eventOn || (window.TavernHelper && window.TavernHelper.eventOn) || MW.eventOn;
            var _getBtn = window.getButtonEvent || (window.TavernHelper && window.TavernHelper.getButtonEvent) || MW.getButtonEvent;
            var _eventOnBtn = window.eventOnButton || (window.TavernHelper && window.TavernHelper.eventOnButton) || MW.eventOnButton;
            try {
                if (_eventOn && _getBtn) { _eventOn(_getBtn("手机"), function () { togglePanel(); }); }
                else if (_eventOnBtn) { _eventOnBtn("手机", function () { togglePanel(); }); }
            } catch (e) {}
        })();

        function bindDomButton() {
            try {
                var nodes = MD.querySelectorAll("button,div,span,a,li,.qr--button,.menu_button,.interactable");
                for (var i = 0; i < nodes.length; i++) {
                    var n = nodes[i]; if (n.__uappBound) continue;
                    var t = (n.textContent || "").trim();
                    if ((t === "手机" || t === "📱手机" || t === "手机📱") && n.children.length === 0) {
                        n.__uappBound = true; n.style.cursor = "pointer";
                        n.addEventListener("click", function (e) { e.stopPropagation(); togglePanel(); }, true);
                    }
                }
            } catch (e) {}
        }
        bindDomButton();
        try { var bmo = new MW.MutationObserver(bindDomButton); bmo.observe(MD.body, { childList: true, subtree: true }); } catch (e) {}

        var panel = null, body = null, resultMode = false, mo = null, clockTimer = null;
        function statusBarHTML() {
            var n = new Date(), hh = ("0" + n.getHours()).slice(-2), mm = ("0" + n.getMinutes()).slice(-2);
            return '<div style="display:flex;justify-content:space-between;padding:6px 14px;font-size:12px;color:#fff;background:rgba(0,0,0,.35);"><span>🔋100%</span><span>中国移动 📶</span><span id="uapp-clock">' + hh + ":" + mm + '</span></div>';
        }
        function togglePanel() {
            if (panel) { closePanel(); return; }
            panel = MD.createElement("div"); panel.id = "uapp-panel";
            panel.style.cssText = "position:fixed;bottom:90px;right:14px;z-index:2147483647;width:336px;max-width:92vw;height:560px;max-height:80vh;border-radius:22px;border:6px solid #111;box-shadow:0 8px 28px rgba(0,0,0,.55);overflow:hidden;display:flex;flex-direction:column;color:#eee;font-family:system-ui,sans-serif;background:" + bgStyle() + ";";
            panel.innerHTML = statusBarHTML() +
                '<div style="padding:10px;background:rgba(0,0,0,.4);text-align:center;font-weight:bold;position:relative;">' +
                '<span id="uapp-back" style="position:absolute;left:12px;top:10px;cursor:pointer;display:none;font-size:13px;">‹ 返回</span>' +
                '<span id="uapp-title">📲 通用APP</span>' +
                '<span id="uapp-set" style="position:absolute;right:38px;top:9px;cursor:pointer;font-size:15px;">⚙️</span>' +
                '<span id="uapp-close" style="position:absolute;right:12px;top:8px;cursor:pointer;font-size:18px;">×</span>' +
                '</div><div id="uapp-body" style="flex:1;overflow-y:auto;padding:10px 12px;"></div>';
            MD.body.appendChild(panel);
            body = panel.querySelector("#uapp-body");
            panel.querySelector("#uapp-close").addEventListener("click", closePanel);
            panel.querySelector("#uapp-back").addEventListener("click", renderHome);
            panel.querySelector("#uapp-set").addEventListener("click", renderSettings);
            clockTimer = MW.setInterval(function () { var c = MD.getElementById("uapp-clock"); if (c) { var n = new Date(); c.innerText = ("0" + n.getHours()).slice(-2) + ":" + ("0" + n.getMinutes()).slice(-2); } }, 10000);
            renderHome();
        }
        function closePanel() { if (mo) { mo.disconnect(); mo = null; } if (clockTimer) { MW.clearInterval(clockTimer); clockTimer = null; } if (panel) { panel.remove(); panel = null; } resultMode = false; }
        function applyBg() { if (panel) panel.style.background = bgStyle(); }
        function mkDiv(css, text) { var d = MD.createElement("div"); if (css) d.style.cssText = css; if (text != null) d.innerText = text; return d; }

        function renderHome() {
            resultMode = false;
            panel.querySelector("#uapp-title").innerText = "📲 通用APP";
            panel.querySelector("#uapp-back").style.display = "none";
            body.innerHTML = "";
            var view = mkDiv("margin-bottom:10px;padding:9px;background:rgba(74,136,255,.9);border-radius:10px;text-align:center;font-size:13px;cursor:pointer;font-weight:bold;", "📺 查看AI生成的最新界面");
            view.addEventListener("click", function () { renderResult(false); });
            body.appendChild(view);
            var sections = {};
            for (var id in APPS) { var app = APPS[id]; (sections[app.section] = sections[app.section] || []).push([id, app]); }
            for (var sec in sections) {
                body.appendChild(mkDiv("margin:8px 0 6px;font-size:14px;color:#9cc4ff;border-bottom:1px solid rgba(255,255,255,.15);padding-bottom:4px;", sec));
                var grid = mkDiv("display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;");
                sections[sec].forEach(function (pair) {
                    var b = mkDiv("background:rgba(30,36,48,.78);border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:10px 6px;font-size:13px;text-align:center;cursor:pointer;", pair[1].title);
                    b.addEventListener("click", function () { renderApp(pair[0]); });
                    grid.appendChild(b);
                });
                body.appendChild(grid);
            }
        }
        function renderApp(id) {
            resultMode = false;
            var app = APPS[id], values = {};
            panel.querySelector("#uapp-title").innerText = app.title;
            panel.querySelector("#uapp-back").style.display = "block";
            body.innerHTML = "";
            body.appendChild(mkDiv("color:#cdd;font-size:12px;margin-bottom:12px;", app.desc));
            (app.inputs || []).forEach(function (inp) {
                var w = mkDiv("margin-bottom:12px;");
                w.appendChild(mkDiv("font-size:12px;color:#9cf;margin-bottom:4px;", inp.label));
                var el = MD.createElement("input"); el.placeholder = inp.ph || "";
                el.style.cssText = "width:100%;box-sizing:border-box;padding:8px;background:rgba(20,24,34,.85);border:1px solid #2e3646;border-radius:8px;color:#eee;font-size:13px;";
                el.addEventListener("input", function () { values[inp.key] = el.value; });
                w.appendChild(el); body.appendChild(w);
            });
            (app.options || []).forEach(function (opt) {
                var w = mkDiv("margin-bottom:12px;");
                w.appendChild(mkDiv("font-size:12px;color:#9cf;margin-bottom:4px;", opt.label));
                var row = mkDiv("display:flex;flex-wrap:wrap;gap:6px;");
                opt.choices.forEach(function (c) {
                    var chip = mkDiv("padding:6px 10px;background:rgba(20,24,34,.85);border:1px solid #2e3646;border-radius:14px;font-size:12px;cursor:pointer;", c);
                    chip.addEventListener("click", function () {
                        values[opt.key] = c;
                        [].forEach.call(row.children, function (x) { x.style.background = "rgba(20,24,34,.85)"; x.style.borderColor = "#2e3646"; });
                        chip.style.background = "#2a5"; chip.style.borderColor = "#3c7";
                    });
                    row.appendChild(chip);
                });
                w.appendChild(row); body.appendChild(w);
            });
            var submit = mkDiv("margin-top:16px;padding:12px;background:#4488ff;color:#fff;text-align:center;border-radius:10px;font-size:14px;cursor:pointer;font-weight:bold;", "✅ 提交并执行");
            submit.addEventListener("click", function () { if (sendTrigger(app.build(values))) renderResult(true); });
            body.appendChild(submit);
        }
        function renderResult(waiting) {
            resultMode = true;
            panel.querySelector("#uapp-title").innerText = "📺 界面显示";
            panel.querySelector("#uapp-back").style.display = "block";
            body.innerHTML = "";
            var pre = MD.createElement("pre"); pre.id = "uapp-result";
            pre.style.cssText = "white-space:pre-wrap;word-break:break-word;font-size:12px;line-height:1.5;background:rgba(0,0,0,.4);padding:10px;border-radius:10px;margin:0 0 10px;color:#e6e6e6;";
            var txt = getLastBotText();
            pre.innerText = waiting ? "⏳ 正在生成界面，请稍候…" : (txt || "暂无内容，先在功能里提交一次吧~");
            body.appendChild(pre);
            var bar = mkDiv("display:grid;grid-template-columns:1fr 1fr;gap:8px;");
            function mkBtn(label, cb, color) { var b = mkDiv("padding:10px;text-align:center;border-radius:10px;font-size:13px;cursor:pointer;color:#fff;background:" + (color || "rgba(40,48,64,.9)") + ";", label); b.addEventListener("click", cb); return b; }
            bar.appendChild(mkBtn("🏠 返回主界面", function () { sendTrigger("返回主界面"); renderHome(); }, "#4488ff"));
            bar.appendChild(mkBtn("⭐ 收藏", function () { addFav(MD.getElementById("uapp-result").innerText); try { MW.alert("已收藏"); } catch (e) {} }));
            bar.appendChild(mkBtn("💾 下载", function () { var t = MD.getElementById("uapp-result").innerText; var a = MD.createElement("a"); a.href = MW.URL.createObjectURL(new MW.Blob([t], { type: "text/plain" })); a.download = "通用APP界面_" + Date.now() + ".txt"; a.click(); }));
            bar.appendChild(mkBtn("📋 复制", function () { var t = MD.getElementById("uapp-result").innerText; try { (MW.navigator.clipboard || navigator.clipboard).writeText(t); MW.alert("已复制"); } catch (e) {} }));
            body.appendChild(bar);
            if (mo) mo.disconnect();
            var chat = MD.querySelector("#chat");
            if (chat) { mo = new MW.MutationObserver(function () { if (!resultMode) return; var p = MD.getElementById("uapp-result"); var t = getLastBotText(); if (p && t) p.innerText = t; }); mo.observe(chat, { childList: true, subtree: true, characterData: true }); }
        }
        function renderSettings() {
            resultMode = false;
            panel.querySelector("#uapp-title").innerText = "⚙️ 设置";
            panel.querySelector("#uapp-back").style.display = "block";
            body.innerHTML = "";
            body.appendChild(mkDiv("font-size:13px;color:#9cf;margin-bottom:8px;", "🖼 壁纸设置"));
            var w1 = mkDiv("margin-bottom:10px;");
            w1.appendChild(mkDiv("font-size:12px;color:#cdd;margin-bottom:4px;", "方式一：粘贴图床直链"));
            var inp = MD.createElement("input"); inp.placeholder = "https://图床/xxx.jpg";
            inp.value = getWallpaper().indexOf("data:") === 0 ? "" : getWallpaper();
            inp.style.cssText = "width:100%;box-sizing:border-box;padding:8px;background:rgba(20,24,34,.85);border:1px 
