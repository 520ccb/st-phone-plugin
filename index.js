// 通用APP 手机插件 · 增强版 | Tavern Helper 专用
// 世界书对齐 | AI回复渲染 | 状态栏 | 结果页原版按钮 | 面板内壁纸切换(直链/本地)
(function () {
    if (window.__UniversalAppInit) { document.getElementById("uapp-fb")?.remove(); }
    window.__UniversalAppInit = true;

    const DEFAULT_BG = "linear-gradient(160deg,#1a2350 0%,#3a1f4d 55%,#0d0d18 100%)";
    // 读取已保存壁纸（图床直链 或 本地base64）
    function getWallpaper() { try { return localStorage.getItem("uapp_wallpaper") || ""; } catch (e) { return ""; } }
    function setWallpaper(v) { try { v ? localStorage.setItem("uapp_wallpaper", v) : localStorage.removeItem("uapp_wallpaper"); } catch (e) {} }
    function bgStyle() { const w = getWallpaper(); return w ? `url('${w}') center/cover` : DEFAULT_BG; }

    // ============ 功能配置（trigger 已按世界书关键词对齐） ============
    const APPS = {
        "reality": { title: "😈 现实扭曲", section: "🔨 万物修改", desc: "根据你输入的内容修改现实",
            inputs: [{ key: "c", label: "扭曲内容", ph: "例如：让下雨天永远淋不湿我" }],
            options: [{ key: "r", label: "作用范围", choices: ["个人", "特定地点", "城市", "国家", "全宇宙"] },
                      { key: "t", label: "持续时间", choices: ["10分钟", "1小时", "1天", "1周", "永久"] }],
            build: v => `打开【现实扭曲界面】。扭曲内容：${v.c||"未填写"}；范围：${v.r||"个人"}；持续：${v.t||"永久"}` },
        "relation": { title: "👰 关系修改", section: "🔨 万物修改", desc: "修改你与目标的社会/家庭/情感关系",
            inputs: [{ key: "tg", label: "目标全名", ph: "输入目标姓名" }, { key: "rl", label: "修改为", ph: "例如：青梅竹马 / 上司" }],
            build: v => `打开【关系修改界面】。目标：${v.tg||"未填写"}；将关系修改为：${v.rl||"未填写"}` },
        "identity": { title: "🥼 身份编辑", section: "🔨 万物修改", desc: "变更身份与职业，编辑个人资料",
            inputs: [{ key: "n", label: "身份/姓名", ph: "输入新身份" }, { key: "j", label: "职业", ph: "输入新职业" }],
            build: v => `打开【身份编辑界面】。身份：${v.n||"未变"}；职业：${v.j||"未变"}` },
        "skill": { title: "🔮 技能/超能力", section: "🔨 万物修改", desc: "获得指定的技能或超能力",
            inputs: [{ key: "s", label: "能力名称", ph: "例如：读心术 / 瞬间移动" }],
            build: v => `打开【技能/超能力】界面。希望获得的能力：${v.s||"未填写"}` },
        "summon": { title: "🤞 万能召唤", section: "🔨 万物修改", desc: "从现实/历史/虚构作品中召唤物品或生物",
            inputs: [{ key: "o", label: "召唤对象", ph: "例如：一把光剑 / 一只哥布林" }],
            build: v => `打开【万能召唤】界面。召唤对象：${v.o||"未填写"}` },
        "rpgchar": { title: "🎲 RPG角色界面", section: "🔨 万物修改", desc: "把信息量化为RPG数值分析角色",
            inputs: [{ key: "tg", label: "分析对象", ph: "输入角色名（留空为自己）" }],
            build: v => `打开【RPG角色界面】。分析对象：${v.tg||"我自己"}` },
        "rpgteam": { title: "🎲 RPG队伍界面", section: "🔨 万物修改", desc: "查看自己或敌方队伍构成",
            options: [{ key: "sd", label: "查看", choices: ["我方队伍", "敌方队伍"] }],
            build: v => `打开【RPG界面】的队伍界面。查看：${v.sd||"我方队伍"}` },
        "innerworld": { title: "🔒 生成里世界", section: "🔨 万物修改", desc: "生成主题里世界并拉入他人",
            inputs: [{ key: "th", label: "主题", ph: "例如：末日废土 / 校园" }, { key: "w", label: "拉入对象", ph: "输入目标（可留空）" }],
            build: v => `使用【生成里世界】功能。主题：${v.th||"未填写"}；拉入对象：${v.w||"无"}` },
        "imaginary": { title: "📥 虚数空间", section: "🔨 万物修改", desc: "进入你掌控一切的独立宇宙",
            inputs: [{ key: "w", label: "一同带入", ph: "输入目标（可留空）" }],
            build: v => `打开【虚数空间界面】。进入虚数空间；带入对象：${v.w||"无"}` },
        "time": { title: "⏲ 时间操作", section: "🦾 万能操作", desc: "操纵时间：流速/冻结/旅行/倒流",
            options: [{ key: "a", label: "操作", choices: ["加速流速", "冻结时间", "恢复时间", "时间旅行", "时间倒流"] }],
            inputs: [{ key: "d", label: "补充说明", ph: "例如：倒流1小时 / 前往2000年" }],
            build: v => `打开【时间操作页面】。操作：${v.a||"冻结时间"}；说明：${v.d||"无"}` },
        "teleport": { title: "🚐 传送服务", section: "🦾 万能操作", desc: "将你和目标传送至任意地点",
            inputs: [{ key: "tg", label: "传送目标", ph: "输入目标（留空为自己）" }, { key: "p", label: "目的地", ph: "输入地点" }],
            build: v => `打开【传送服务界面】。传送目标：${v.tg||"我自己"}；目的地：${v.p||"未填写"}` },
        "camera": { title: "📸 万能摄像头", section: "🦾 万能操作", desc: "在任意地点生成不可见的摄像头",
            inputs: [{ key: "p", label: "安放地点", ph: "输入地点" }, { key: "tg", label: "监控目标", ph: "输入目标" }],
            build: v => `打开【万能摄像头界面】。安放地点：${v.p||"未填写"}；监控目标：${v.tg||"未填写"}` },
        "invisible": { title: "👓 隐身模式", section: "🦾 万能操作", desc: "以多种方式隐于无形",
            options: [{ key: "m", label: "隐身方式", choices: ["存在感抹除", "气息遮断", "视觉盲区", "多维隐形", "因果屏障"] }],
            build: v => `打开【隐身模式页面】。开启方式：${v.m||"存在感抹除"}` },
        "memory": { title: "🎞 记忆操作", section: "🦾 万能操作", desc: "植入虚假记忆或抹去记忆",
            inputs: [{ key: "tg", label: "目标", ph: "输入目标姓名" }, { key: "c", label: "记忆内容", ph: "植入/抹去的记忆" }],
            options: [{ key: "ty", label: "类型", choices: ["植入记忆", "抹去记忆"] }],
            build: v => `使用【记忆操作】功能。目标：${v.tg||"未填写"}；${v.ty||"植入记忆"}：${v.c||"未填写"}` },
        "info": { title: "🤖 信息操作", section: "🦾 万能操作", desc: "修改目标信息，现实随之改变",
            inputs: [{ key: "tg", label: "目标", ph: "输入目标姓名" }, { key: "f", label: "修改项与新值", ph: "例如：年龄→改为25" }],
            build: v => `打开【目标信息界面】。目标：${v.tg||"未填写"}；修改内容：${v.f||"未填写"}` }
    };

    // ============ 收藏存储 ============
    function getFavs() { try { return JSON.parse(localStorage.getItem("uapp_favs") || "[]"); } catch (e) { return []; } }
    function addFav(txt) { const a = getFavs(); a.unshift({ t: txt, d: new Date().toLocaleString() }); localStorage.setItem("uapp_favs", JSON.stringify(a.slice(0, 50))); }

    // ============ 发送触发文本 ============
    function sendTrigger(text) {
        try { if (window.TavernHelper && window.TavernHelper.triggerSlash) { window.TavernHelper.triggerSlash(`/send ${text} | /trigger`); return true; } } catch (e) {}
        const ta = document.querySelector("#send_textarea"), btn = document.querySelector("#send_but");
        if (ta) { ta.value = text; ta.dispatchEvent(new Event("input", { bubbles: true })); if (btn) btn.click(); return true; }
        alert("未找到输入框：" + text); return false;
    }
    function getLastBotText() {
        const all = [...document.querySelectorAll("#chat .mes")].filter(m => m.getAttribute("is_user") === "false");
        const last = all[all.length - 1], t = last && last.querySelector(".mes_text");
        return t ? t.innerText : "";
    }

    // ============ 悬浮按钮 ============
    const fb = document.createElement("div");
    fb.id = "uapp-fb"; fb.innerText = "📱";
    Object.assign(fb.style, { position: "fixed", bottom: "90px", right: "16px", zIndex: "99999",
        width: "48px", height: "48px", lineHeight: "48px", textAlign: "center", fontSize: "24px",
        background: "#4488ff", color: "#fff", borderRadius: "50%", boxShadow: "0 4px 12px #0004", cursor: "pointer", userSelect: "none" });
    document.body.appendChild(fb);

    let panel = null, body = null, resultMode = false, mo = null;

    function statusBarHTML() {
        const n = new Date();
        return `<div style="display:flex;justify-content:space-between;padding:6px 14px;font-size:12px;color:#fff;background:rgba(0,0,0,.35);">
            <span>🔋100%</span><span>中国移动 📶</span><span id="uapp-clock">${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}</span></div>`;
    }

    function openPanel() {
        if (panel) { panel.remove(); panel = null; resultMode = false; if (mo) { mo.disconnect(); mo = null; } return; }
        panel = document.createElement("div");
        Object.assign(panel.style, { position: "fixed", bottom: "150px", right: "16px", zIndex: "99998",
            width: "336px", height: "560px", borderRadius: "22px", border: "6px solid #111",
            boxShadow: "0 8px 28px #0007", overflow: "hidden", display: "flex", flexDirection: "column",
            color: "#eee", fontFamily: "system-ui,sans-serif", background: bgStyle() });
        panel.innerHTML = `
            ${statusBarHTML()}
            <div style="padding:10px;background:rgba(0,0,0,.4);text-align:center;font-weight:bold;position:relative;">
                <span id="uapp-back" style="position:absolute;left:12px;top:10px;cursor:pointer;display:none;font-size:13px;">‹ 返回</span>
                <span id="uapp-title">📲 通用APP</span>
                <span id="uapp-set" style="position:absolute;right:38px;top:9px;cursor:pointer;font-size:15px;">⚙️</span>
                <span id="uapp-close" style="position:absolute;right:12px;top:8px;cursor:pointer;font-size:18px;">×</span>
            </div>
            <div id="uapp-body" style="flex:1;overflow-y:auto;padding:10px 12px;"></div>`;
        document.body.appendChild(panel);
        body = panel.querySelector("#uapp-body");
        panel.querySelector("#uapp-close").onclick = openPanel;
        panel.querySelector("#uapp-back").onclick = renderHome;
        panel.querySelector("#uapp-set").onclick = renderSettings;
        setInterval(() => { const c = document.getElementById("uapp-clock"); if (c) { const n = new Date(); c.innerText = String(n.getHours()).padStart(2, "0") + ":" + String(n.getMinutes()).padStart(2, "0"); } }, 10000);
        renderHome();
    }
    function applyBg() { if (panel) panel.style.background = bgStyle(); }

    function renderHome() {
        resultMode = false;
        panel.querySelector("#uapp-title").innerText = "📲 通用APP";
        panel.querySelector("#uapp-back").style.display = "none";
        body.innerHTML = "";
        const view = document.createElement("div");
        view.innerText = "📺 查看AI生成的最新界面";
        view.style.cssText = "margin-bottom:10px;padding:9px;background:rgba(74,136,255,.85);border-radius:10px;text-align:center;font-size:13px;cursor:pointer;font-weight:bold;";
        view.onclick = () => renderResult(false);
        body.appendChild(view);
        const sections = {};
        for (const [id, app] of Object.entries(APPS)) (sections[app.section] = sections[app.section] || []).push([id, app]);
        for (const [sec, list] of Object.entries(sections)) {
            const t = document.createElement("div"); t.innerText = sec;
            t.style.cssText = "margin:8px 0 6px;font-size:14px;color:#9cc4ff;border-bottom:1px solid rgba(255,255,255,.15);padding-bottom:4px;";
            body.appendChild(t);
            const grid = document.createElement("div");
            grid.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;";
            list.forEach(([id, app]) => {
                const b = document.createElement("div"); b.innerText = app.title;
                b.style.cssText = "background:rgba(30,36,48,.75);border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:10px 6px;font-size:13px;text-align:center;cursor:pointer;";
                b.onclick = () => renderApp(id); grid.appendChild(b);
            });
            body.appendChild(grid);
        }
    }

    function renderApp(id) {
        resultMode = false;
        const app = APPS[id], values = {};
        panel.querySelector("#uapp-title").innerText = app.title;
        panel.querySelector("#uapp-back").style.display = "block";
        body.innerHTML = `<div style="color:#cdd;font-size:12px;margin-bottom:12px;">${app.desc}</div>`;
        (app.inputs || []).forEach(inp => {
            const w = document.createElement("div"); w.style.marginBottom = "12px";
            w.innerHTML = `<div style="font-size:12px;color:#9cf;margin-bottom:4px;">${inp.label}</div>`;
            const el = document.createElement("input"); el.placeholder = inp.ph || "";
            el.style.cssText = "width:100%;box-sizing:border-box;padding:8px;background:rgba(20,24,34,.8);border:1px solid #2e3646;border-radius:8px;color:#eee;font-size:13px;";
            el.oninput = () => values[inp.key] = el.value; w.appendChild(el); body.appendChild(w);
        });
        (app.options || []).forEach(opt => {
            const w = document.createElement("div"); w.style.marginBottom = "12px";
            w.innerHTML = `<div style="font-size:12px;color:#9cf;margin-bottom:4px;">${opt.label}</div>`;
            const row = document.createElement("div"); row.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;";
            opt.choices.forEach(c => {
                const chip = document.createElement("div"); chip.innerText = c;
                chip.style.cssText = "padding:6px 10px;background:rgba(20,24,34,.8);border:1px solid #2e3646;border-radius:14px;font-size:12px;cursor:pointer;";
                chip.onclick = () => { values[opt.key] = c; row.querySelectorAll("div").forEach(x => { x.style.background = "rgba(20,24,34,.8)"; x.style.borderColor = "#2e3646"; }); chip.style.background = "#2a5"; chip.style.borderColor = "#3c7"; };
                row.appendChild(chip);
            });
            w.appendChild(row); body.appendChild(w);
        });
        const submit = document.createElement("div"); submit.innerText = "✅ 提交并执行";
        submit.style.cssText = "margin-top:16px;padding:12px;background:#4488ff;color:#fff;text-align:center;border-radius:10px;font-size:14px;cursor:pointer;font-weight:bold;";
        submit.onclick = () => { if (sendTrigger(app.build(values))) renderResult(true); };
        body.appendChild(submit);
    }

    // 结果页 + 原版按钮
    function renderResult(waiting) {
        resultMode = true;
        panel.querySelector("#uapp-title").innerText = "📺 界面显示";
        panel.querySelector("#uapp-back").style.display = "block";
        body.innerHTML = "";
        const pre = document.createElement("pre"); pre.id = "uapp-result";
        pre.style.cssText = "white-space:pre-wrap;word-break:break-word;font-size:12px;line-height:1.5;background:rgba(0,0,0,.4);padding:10px;border-radius:10px;margin:0 0 10px;color:#e6e6e6;";
        const txt = getLastBotText();
        pre.innerText = waiting ? "⏳ 正在生成界面，请稍候…" : (txt || "暂无内容，先在功能里提交一次吧~");
        body.appendChild(pre);

        // 原版风格按钮组
        const bar = document.createElement("div");
        bar.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:8px;";
        const mkBtn = (label, cb, color) => {
            const b = document.createElement("div"); b.innerText = label;
            b.style.cssText = `padding:10px;text-align:center;border-radius:10px;font-size:13px;cursor:pointer;background:${color||"rgba(40,48,64,.85)"};color:#fff;`;
            b.onclick = cb; return b;
        };
        bar.appendChild(mkBtn("🏠 返回主界面", () => { sendTrigger("返回主界面"); renderHome(); }, "#4488ff"));
        bar.appendChild(mkBtn("⭐ 收藏", () => { const t = document.getElementById("uapp-result").innerText; addFav(t); alert("已收藏本界面"); }));
        bar.appendChild(mkBtn("💾 下载", () => {
            const t = document.getElementById("uapp-result").innerText;
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([t], { type: "text/plain" }));
            a.download = "通用APP界面_" + Date.now() + ".txt"; a.click();
        }));
        bar.appendChild(mkBtn("📋 复制", () => { const t = document.getElementById("uapp-result").innerText; navigator.clipboard?.writeText(t); alert("已复制到剪贴板"); }));
        body.appendChild(bar);

        if (mo) mo.disconnect();
        const chat = document.querySelector("#chat");
        if (chat) {
            mo = new MutationObserver(() => { if (!resultMode) return; const p = document.getElementById("uapp-result"); const t = getLastBotText(); if (p && t) p.innerText = t; });
            mo.observe(chat, { childList: true, subtree: true, characterData: true });
        }
    }

    // 设置页：壁纸切换
    function renderSettings() {
        resultMode = false;
        panel.querySelector("#uapp-title").innerText = "⚙️ 设置";
        panel.querySelector("#uapp-back").style.display = "block";
        body.innerHTML = `<div style="font-size:13px;color:#9cf;margin-bottom:8px;">🖼 壁纸设置</div>`;

        // 图床直链
        const w1 = document.createElement("div"); w1.style.marginBottom = "10px";
        w1.innerHTML = `<div style="font-size:12px;color:#cdd;margin-bottom:4px;">方式一：粘贴图床直链</div>`;
        const inp = document.createElement("input");
        inp.placeholder = "https://图床/xxx.jpg";
        inp.value = getWallpaper().startsWith("data:") ? "" : getWallpaper();
        inp.style.cssText = "width:100%;box-sizing:border-box;padding:8px;background:rgba(20,24,34,.8);border:1px solid #2e3646;border-radius:8px;color:#eee;font-size:12px;";
        w1.appendChild(inp);
        const applyLink = document.createElement("div"); applyLink.innerText = "应用链接壁纸";
        applyLink.style.cssText = "margin-top:6px;padding:8px;text-align:center;background:#4488ff;border-radius:8px;font-size:13px;cursor:pointer;";
        applyLink.onclick = () => { const v = inp.value.trim(); if (!v) return alert("请先粘贴链接"); setWallpaper(v); applyBg(); alert("已应用"); };
        w1.appendChild(applyLink); body.appendChild(w1);

        // 本地图片
        const w2 = document.createElement("div"); w2.style.marginBottom = "10px";
        w2.innerHTML = `<div style="font-size:12px;color:#cdd;margin:8px 0 4px;">方式二：选择本地图片</div>`;
        const file = document.createElement("input"); file.type = "file"; file.accept = "image/*";
        file.style.cssText = "width:100%;font-size:12px;color:#ccc;";
        file.onchange = () => {
            const f = file.files[0]; if (!f) return;
            if (f.size > 2.5 * 1024 * 1024) return alert("图片过大（建议<2.5MB），请压缩后再试");
            const r = new FileReader();
            r.onload = () => { setWallpaper(r.result); applyBg(); alert("已应用本地壁纸"); };
            r.readAsDataURL(f);
        };
        w2.appendChild(file); body.appendChild(w2);

        // 恢复默认
        const reset = document.createElement("div"); reset.innerText = "↩️ 恢复默认壁纸";
        reset.style.cssText = "margin-top:14px;padding:10px;text-align:center;background:rgba(40,48,64,.85);border-radius:8px;font-size:13px;cursor:pointer;";
        reset.onclick = () => { setWallpaper(""); applyBg(); renderSettings(); };
        body.appendChild(reset);

        const tip = document.createElement("div");
        tip.innerText = "提示：本地图片会保存在浏览器本地(localStorage)，刷新不丢失；图床直链需保证链接长期有效。";
        tip.style.cssText = "margin-top:14px;font-size:11px;color:#889;line-height:1.5;";
        body.appendChild(tip);
    }

    fb.onclick = openPanel;
    console.log("✅ 通用APP手机插件（增强版）加载完成");
})();
