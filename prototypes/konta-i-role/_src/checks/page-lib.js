/* Stage 3 page library: injected into the built prototype by stage3.mjs (it defines window.__chk).
   Everything here drives the real UI (clicks, typing, selects); it never touches the prototype's store. */
(function () {
  if (window.__chk) return;
  var errors = [];
  window.addEventListener("error", function (e) { errors.push("error: " + e.message); });
  window.addEventListener("unhandledrejection", function (e) { errors.push("rejection: " + e.reason); });
  var origError = console.error;
  console.error = function () { errors.push("console.error: " + [].slice.call(arguments).join(" ")); origError.apply(console, arguments); };

  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var vis = function (el) {
    // checkVisibility also sees through a closed <details>, whose content still reports client rects.
    return !!el && el.getClientRects().length > 0 && el.checkVisibility({ checkVisibilityCSS: true, contentVisibilityAuto: true });
  };
  var norm = function (t) { return (t || "").replace(/\s+/g, " ").trim(); };

  function activeScreens() { return [].slice.call(document.querySelectorAll(".screen")).filter(vis).map(function (s) { return s.id; }); }
  function scr() { return document.getElementById(activeScreens()[0]); }
  function frameText() { var s = scr(); return s ? norm(s.querySelector(".frame").innerText) : ""; }

  function field(id) {
    return [].slice.call(document.querySelectorAll(".review-field")).find(function (f) {
      var b = f.querySelector("b"); return b && norm(b.textContent) === id;
    });
  }
  async function panel(id, value) {
    var sel = field(id).querySelector("select");
    if (![].some.call(sel.options, function (o) { return o.value === value; })) throw new Error("no option " + value + " in " + id);
    sel.value = value;
    sel.dispatchEvent(new Event("change", { bubbles: true }));
    await sleep(60);
  }
  async function account(id) { await panel("Account", id); await sleep(120); }
  function findClickable(text, scope) {
    return [].slice.call((scope || document).querySelectorAll("button,a")).find(function (e) { return vis(e) && norm(e.textContent) === text; });
  }
  async function click(text, scope) {
    var el = findClickable(text, scope || scr());
    if (!el) throw new Error("no visible control '" + text + "' on " + activeScreens().join(","));
    el.click();
    await sleep(80);
  }
  async function fill(name, value) {
    var input = scr().querySelector('[name="' + name + '"]');
    if (!input) throw new Error("no field " + name);
    var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await sleep(30);
  }
  async function go(id) {
    var a = document.querySelector('.screen-nav a[href="#' + id + '"]');
    a.click();
    await sleep(150);
  }
  async function reset() {
    await click("Reset demo", document.querySelector(".doc-toolbar"));
    await sleep(150);
  }
  async function ready() { await sleep(700); }

  var VALID_PW = "demo-haslo-12345";
  async function register(email, name) {
    await go("s02"); await fill("email", email); await fill("displayName", name); await click("Register"); await ready();
  }
  async function openMailLink() { await go("s10"); await sleep(100); var s = scr(); var b = s.querySelector(".frame button"); if (!b) throw new Error("no mail link"); b.click(); await sleep(150); }
  async function viaGithub(result) { await panel("P01", result); await go("s01"); await click("Sign in with GitHub"); await click("Authorize DevMentor"); await sleep(150); }

  // Each state: [id, expected screen, expected text fragment (lower case), setup]
  var S = [];
  function st(id, screen, text, setup) { S.push({ id: id, screen: screen, text: text.toLowerCase(), setup: setup }); }
  st("s01.1", "s01", "sign in with github", async function () { await go("s01"); });
  st("s01.2", "s01", "isn't available yet", async function () { await panel("s01.2", "on"); await go("s01"); });
  st("s01.3", "s01", "signing in", async function () { await go("s01"); await fill("email", "ewa.lis@devmentor.test"); await fill("password", VALID_PW); await click("Sign in"); await sleep(100); });
  st("s01.4", "s01", "enter a valid e-mail", async function () { await go("s01"); await click("Sign in"); });
  st("s01.5", "s01", "invalid credentials", async function () { await go("s01"); await fill("email", "ewa.lis@devmentor.test"); await fill("password", "wrong-password-1"); await click("Sign in"); await ready(); });
  st("s01.6", "s01", "you cancelled", async function () { await panel("P01", "cancelled"); await go("s01"); await click("Sign in with GitHub"); await click("Cancel"); });
  st("s01.7", "s01", "couldn't verify", async function () { await viaGithub("state"); });
  st("s01.8", "s01", "verified e-mail", async function () { await viaGithub("noEmail"); });
  st("s01.9", "s01", "couldn't sign you in with github", async function () { await viaGithub("unavailable"); });
  st("s01.10", "s01", "too many attempts", async function () { await panel("next", "rateLimit"); await go("s01"); await fill("email", "ewa.lis@devmentor.test"); await fill("password", "x"); await click("Sign in"); await ready(); });
  st("s01.11", "s01", "session expired", async function () { await account("A3"); await panel("P06", "midWork"); await sleep(700); });
  st("s01.12", "s01", "sign in with github", async function () { await account("A1"); await click("Sign out"); await sleep(100); });
  st("s02.1", "s02", "register for devmentor", async function () { await go("s02"); });
  st("s02.2", "s02", "sending", async function () { await go("s02"); await fill("email", "new@devmentor.test"); await fill("displayName", "New Person"); await click("Register"); await sleep(100); });
  st("s02.3", "s02", "enter a valid e-mail", async function () { await go("s02"); await click("Register"); });
  st("s02.4", "s03", "check your e-mail", async function () { await register("new@devmentor.test", "New Person"); });
  st("s02.5", "s03", "check your e-mail", async function () { await panel("P03", "existing"); await register("marta.kowalczyk@devmentor.test", "Marta"); });
  st("s02.6", "s02", "couldn't send", async function () { await panel("P03", "sendFail"); await register("new@devmentor.test", "New Person"); });
  st("s02.7", "s02", "too many attempts", async function () { await panel("next", "rateLimit"); await register("new@devmentor.test", "New Person"); });
  st("s03.1", "s03", "didn't get it", async function () { await register("new@devmentor.test", "New Person"); });
  st("s03.2", "s03", "didn't get it", async function () { await panel("P03", "cooldown"); await register("new@devmentor.test", "New Person"); });
  st("s04.1", "s04", "set a password", async function () { await register("new@devmentor.test", "New Person"); await openMailLink(); });
  st("s04.2", "s04", "creating", async function () { await register("new@devmentor.test", "New Person"); await openMailLink(); await fill("password", VALID_PW); await click("Create account"); await sleep(100); });
  st("s04.3", "s04", "at least 12", async function () { await register("new@devmentor.test", "New Person"); await openMailLink(); await fill("password", "short"); await click("Create account"); });
  st("s04.4", "s04", "can't be used", async function () { await panel("P04", "expired"); await register("new@devmentor.test", "New Person"); await openMailLink(); });
  st("s04.5", "s04", "already used", async function () { await panel("P04", "used"); await register("new@devmentor.test", "New Person"); await openMailLink(); });
  st("s04.6", "s04", "too many attempts", async function () { await register("new@devmentor.test", "New Person"); await openMailLink(); await panel("next", "rateLimit"); await fill("password", VALID_PW); await click("Create account"); await ready(); });
  st("s04.7", "s05", "welcome", async function () { await register("new@devmentor.test", "New Person"); await openMailLink(); await fill("password", VALID_PW); await click("Create account"); await ready(); });
  st("s04.8", "s04", "can't be used", async function () { await panel("P04", "missing"); await register("new@devmentor.test", "New Person"); await openMailLink(); });
  st("s04.9", "s05", "welcome", async function () { await account("A1"); await go("s04"); });
  st("s05.1", "s05", "signed in as a mentee", async function () { await account("A1"); });
  st("s05.2", "s01", "sign in with github", async function () { await go("s05"); });
  st("s05.3", "s06", "signed in as a mentor", async function () { await account("A3"); await go("s05"); });
  st("s05.4", "s01", "session expired", async function () { await account("A1"); await panel("P06", "midWork"); await sleep(700); });
  st("s05.5", "s05", "signed in as a mentee", async function () { await panel("P09", "stale"); });
  st("s06.1", "s06", "signed in as a mentor", async function () { await account("A3"); });
  st("s06.2", "s01", "sign in with github", async function () { await go("s06"); });
  st("s06.3", "s05", "signed in as a mentee", async function () { await account("A1"); await go("s06"); });
  st("s06.4", "s01", "session expired", async function () { await account("A3"); await panel("P06", "midWork"); await sleep(700); });
  st("s06.5", "s06", "signed in as a mentor", async function () { await panel("P07", "mentor"); await account("A5"); });
  st("s07.1", "s07", "registered mentors", async function () { await account("A6"); });
  st("s07.2", "s07", "no mentors yet", async function () { await account("A6"); await panel("P10", "empty"); });
  st("s07.3", "s07", "loading", async function () { await account("A6"); await panel("P10", "slow"); await sleep(200); });
  st("s07.4", "s07", "internal server error", async function () { await account("A6"); await panel("P10", "serverError"); });
  st("s07.5", "s07", "already", async function () { await account("A6"); await fill("name", "Anna Kaczmarek"); await fill("email", "anna.kaczmarek@devmentor.test"); await click("Add mentor"); await ready(); });
  st("s07.6", "s01", "sign in with github", async function () { await go("s07"); });
  st("s07.7", "s05", "signed in as a mentee", async function () { await account("A1"); await go("s07"); });
  st("s07.8", "s01", "session expired", async function () { await account("A6"); await panel("P06", "midWork"); await sleep(700); });
  st("s09.1", "s09", "authorize devmentor", async function () { await go("s09"); });
  st("s09.2", "s01", "you cancelled", async function () { await go("s09"); await click("Cancel"); });
  st("s10.1", "s10", "confirm your devmentor account", async function () { await register("new@devmentor.test", "New Person"); await go("s10"); });
  st("s10.2", "s10", "already have a devmentor account", async function () { await panel("P03", "existing"); await register("marta.kowalczyk@devmentor.test", "Marta"); await go("s10"); });
  st("s10.3", "s10", "no messages", async function () { await go("s10"); });

  function rgba(color) {
    var c = document.createElement("canvas"); c.width = c.height = 1;
    var x = c.getContext("2d", { willReadFrequently: true });
    x.clearRect(0, 0, 1, 1); x.fillStyle = "#000"; x.fillStyle = color; x.fillRect(0, 0, 1, 1);
    var d = x.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255];
  }
  function over(top, bottom) {
    var a = top[3]; return [0, 1, 2].map(function (i) { return top[i] * a + bottom[i] * (1 - a); }).concat([1]);
  }
  function lum(c) {
    var v = c.slice(0, 3).map(function (n) { n /= 255; return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function bgOf(el) {
    var layers = [];
    for (var n = el; n; n = n.parentElement) { var b = rgba(getComputedStyle(n).backgroundColor); if (b[3] > 0) layers.push(b); if (b[3] === 1) break; }
    var base = [0, 0, 0, 1]; var theme = document.documentElement.dataset.theme;
    var page = rgba(getComputedStyle(document.body).backgroundColor); if (page[3] > 0) base = over(page, [255, 255, 255, 1]);
    layers.reverse().forEach(function (l) { base = over(l, base); });
    return base;
  }
  function audit() {
    var s = scr(); var problems = [];
    var root = document.documentElement;
    if (root.scrollWidth > root.clientWidth + 1) problems.push("page scrolls sideways: " + root.scrollWidth + " > " + root.clientWidth);
    if (!s) return ["no visible screen"];
    var frame = s.querySelector(".frame"); var fr = frame.getBoundingClientRect();
    var seen = {};
    // Content inside a container that scrolls on its own (the design system's Table wrapper) may be wider than the frame.
    var scrolls = function (el) { for (var n = el.parentElement; n && n !== frame; n = n.parentElement) { if (/auto|scroll/.test(getComputedStyle(n).overflowX)) return true; } return false; };
    [].slice.call(frame.querySelectorAll("*")).forEach(function (el) {
      if (!vis(el)) return;
      var r = el.getBoundingClientRect();
      if (r.width && !scrolls(el) && (r.right > fr.right + 1 || r.left < fr.left - 1)) problems.push("outside frame: " + el.tagName + " '" + norm(el.textContent).slice(0, 30) + "'");
      var own = [].slice.call(el.childNodes).filter(function (n) { return n.nodeType === 3 && norm(n.textContent); });
      if (own.length && !el.closest("svg")) {
        var cs = getComputedStyle(el); var fg = rgba(cs.color); var bg = bgOf(el);
        fg = over(fg, bg);
        var ratio = (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);
        var size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
        var need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
        var key = el.tagName + norm(own[0].textContent).slice(0, 20);
        if (ratio < need && !seen[key]) { seen[key] = 1; problems.push("contrast " + ratio.toFixed(2) + " < " + need + ": '" + norm(own[0].textContent).slice(0, 30) + "'"); }
        if (el.scrollWidth > el.clientWidth + 1 && /hidden|clip/.test(cs.overflowX) && cs.display !== "inline") problems.push("clipped text: '" + norm(own[0].textContent).slice(0, 30) + "'");
      }
      if (/^(BUTTON|A|INPUT|SELECT)$/.test(el.tagName) && !(el.tagName === "A" && el.closest("p"))) {
        var area = (el.type === "radio" || el.type === "checkbox") && el.closest("label") ? el.closest("label").getBoundingClientRect() : r;
        if (area.height < 24 || area.width < 24) problems.push("target under 24px: " + el.tagName + " '" + norm(el.textContent).slice(0, 20) + "' " + Math.round(r.width) + "x" + Math.round(r.height));
      }
    });
    return problems;
  }

  async function runState(id) {
    var d = S.find(function (x) { return x.id === id; });
    errors.length = 0;
    var res = { id: id, problems: [] };
    try {
      await reset();
      await d.setup();
      var act = activeScreens();
      if (act[0] !== d.screen) res.problems.push("expected screen " + d.screen + ", got " + act.join(","));
      if (frameText().toLowerCase().indexOf(d.text) < 0) res.problems.push("text '" + d.text + "' not shown");
      res.problems = res.problems.concat(audit());
    } catch (e) { res.problems.push("setup failed: " + e.message); }
    res.problems = res.problems.concat(errors.map(function (m) { return "js " + m; }));
    return res;
  }

  // Reachability of the review bar: every control inside the open panel can be hit with the pointer after scrolling.
  async function panelReach() {
    var det = document.querySelector(".review-help"); det.open = true; await sleep(100);
    var body = det.querySelector(".review-help-body"); var problems = [];
    var controls = [].slice.call(body.querySelectorAll("select,button"));
    controls.forEach(function (c) {
      c.scrollIntoView({ block: "center", inline: "center" });
      var r = c.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var label = c.getAttribute("aria-label") || (c.closest("label") ? norm(c.closest("label").textContent).slice(0, 25) : norm(c.textContent));
      if (r.left < 0 || r.right > innerWidth + 1) problems.push("off screen horizontally: " + label);
      var hit = document.elementFromPoint(cx, cy);
      if (hit !== c && !c.contains(hit) && !(hit && hit.closest("label") === c.closest("label") && c.closest("label"))) problems.push("covered: " + label);
    });
    var bodyRect = body.getBoundingClientRect();
    if (bodyRect.left < 0 || bodyRect.right > innerWidth + 1) problems.push("panel outside the window: " + Math.round(bodyRect.left) + ".." + Math.round(bodyRect.right));
    return { controls: controls.length, problems: problems };
  }

  // Scenario controls: every option of every select can be chosen; the choice sticks and nothing throws.
  function optionsPlan() {
    var det = document.querySelector(".review-help"); det.open = true;
    return [].slice.call(det.querySelectorAll(".review-field select")).map(function (sel, i) {
      return { i: i, control: norm(sel.closest("label").textContent).slice(0, 30), values: [].map.call(sel.options, function (o) { return o.value; }) };
    });
  }
  async function optionRun(i, value) {
    var det = document.querySelector(".review-help");
    await reset(); errors.length = 0; det.open = true;
    var sel = [].slice.call(det.querySelectorAll(".review-field select"))[i];
    var label = norm(sel.closest("label").textContent).slice(0, 30);
    sel.value = value; sel.dispatchEvent(new Event("change", { bubbles: true })); await sleep(450);
    var again = [].slice.call(det.querySelectorAll(".review-field select"))[i];
    var problems = [];
    // Choosing a session fault or an account moves the app on and can reset the select; the others must keep the value.
    if (again.value !== value && !/^(P06|Account|P09)/.test(label)) problems.push("value did not stick: " + again.value);
    return { control: label, option: value, hint: norm(det.querySelector("[role=status]").textContent).slice(0, 60), problems: problems.concat(errors.map(function (m) { return "js " + m; })) };
  }

  var PLAN = [["s01", null], ["s02", null], ["s03", "reg"], ["s04", "link"], ["s05", "A1"], ["s06", "A3"], ["s07", "A6"], ["s09", null], ["s10", "reg"]];
  var CLICKABLE = ".frame button, .frame a, .frame input[type=radio]";
  async function clickSetup(p) {
    var id = PLAN[p][0], who = PLAN[p][1];
    await reset();
    if (who === "reg") await register("new@devmentor.test", "New Person");
    else if (who === "link") { await register("new@devmentor.test", "New Person"); await openMailLink(); }
    else if (who) await account(who);
    if (activeScreens()[0] !== id) await go(id);
  }
  async function clickCount(p) {
    await clickSetup(p);
    return [].slice.call(scr().querySelectorAll(CLICKABLE)).filter(vis).length;
  }
  // Click one control of a screen and report what changed: another screen, other text, or at least a DOM update.
  async function clickOne(p, i) {
    await clickSetup(p); errors.length = 0;
    var el = [].slice.call(scr().querySelectorAll(CLICKABLE)).filter(vis)[i];
    var name = norm(el.textContent) || el.getAttribute("aria-label") || el.value || el.tagName;
    var before = { screen: activeScreens().join(","), text: norm(document.body.innerText) };
    var mutated = 0; var mo = new MutationObserver(function (m) { mutated += m.length; });
    mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true });
    var disabled = el.disabled === true;
    if (!disabled) el.click();
    await sleep(450); mo.disconnect();
    var after = { screen: activeScreens().join(","), text: norm(document.body.innerText) };
    var effect = before.screen !== after.screen ? "navigates to " + after.screen : before.text !== after.text ? "changes the page" : mutated ? "updates the DOM" : "NOTHING";
    if (el.type === "radio" && el.checked && effect === "NOTHING") effect = "already selected";
    return { screen: PLAN[p][0], control: name.slice(0, 40), effect: disabled ? "disabled" : effect, js: errors.slice() };
  }

  // The review bar: every button and link must do something visible (open the panel counts as a DOM update).
  var TOOLBAR = ".doc-toolbar button, .doc-toolbar a, .doc-toolbar summary";
  function toolbarCount() { document.querySelector(".review-help").open = true; return [].slice.call(document.querySelectorAll(TOOLBAR)).filter(vis).length; }
  async function toolbarOne(i) {
    errors.length = 0; document.querySelector(".review-help").open = true; await sleep(50);
    var el = [].slice.call(document.querySelectorAll(TOOLBAR)).filter(vis)[i];
    var name = norm(el.textContent);
    var before = { screen: activeScreens().join(","), text: norm(document.body.innerText), theme: document.documentElement.dataset.theme, cls: document.body.className };
    var mutated = 0; var mo = new MutationObserver(function (m) { mutated += m.length; });
    mo.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true });
    el.click(); await sleep(450); mo.disconnect();
    var after = { screen: activeScreens().join(","), text: norm(document.body.innerText), theme: document.documentElement.dataset.theme, cls: document.body.className };
    var effect = before.screen !== after.screen ? "navigates to " + after.screen : before.theme !== after.theme ? "switches theme" : before.cls !== after.cls ? "switches mode" : before.text !== after.text ? "changes the page" : mutated ? "updates the DOM" : "NOTHING";
    return { control: name.slice(0, 40), effect: effect, js: errors.slice() };
  }

  function focusInfo() {
    var a = document.activeElement; if (!a || a === document.body) return null;
    var cs = getComputedStyle(a); var ring = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== "none");
    var r = a.getBoundingClientRect();
    var scrollRegion = /auto|scroll/.test(cs.overflowX) && a.scrollWidth > a.clientWidth + 1;
    var label = scrollRegion ? "(scrollable region)" : norm(a.textContent) || a.getAttribute("aria-label") || a.getAttribute("name") || a.getAttribute("href") || a.tagName;
    return { tag: a.tagName.toLowerCase(), label: label.slice(0, 40), ring: !!ring, inView: r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth, inFrame: !!a.closest(".frame"), inToolbar: !!a.closest(".doc-toolbar") };
  }
  async function prepareKeyboard(id, who) {
    await reset();
    if (who === "reg") await register("new@devmentor.test", "New Person");
    else if (who === "link") { await register("new@devmentor.test", "New Person"); await openMailLink(); }
    else if (who) await account(who);
    if (activeScreens()[0] !== id) await go(id);
    var f = scr().querySelector(".frame"); f.setAttribute("tabindex", "-1"); f.focus();
    // A radio group is one tab stop (arrow keys move inside it).
    var seenGroups = {};
    var scroller = function (e) { return /auto|scroll/.test(getComputedStyle(e).overflowX) && e.scrollWidth > e.clientWidth + 1; };
    var expected = [].slice.call(f.querySelectorAll("*")).filter(function (e) {
      if (scroller(e)) return true; // Chrome makes a sideways-scrolling region a tab stop so a keyboard can scroll it
      if (!e.matches("button,a[href],input,select,textarea,summary") || !vis(e) || e.disabled) return false;
      if (e.type === "radio") { if (seenGroups[e.name]) return false; seenGroups[e.name] = 1; }
      return true;
    }).map(function (e) { return scroller(e) ? "(scrollable region)" : norm(e.textContent) || e.getAttribute("name") || e.getAttribute("href"); });
    return expected;
  }
  function toolbarFocus() { document.querySelector(".doc-toolbar .badge").setAttribute("tabindex", "-1"); document.querySelector(".doc-toolbar .badge").focus(); return 1; }
  function toolbarExpected() { return [].slice.call(document.querySelectorAll(".doc-toolbar button,.doc-toolbar a,.doc-toolbar summary")).filter(vis).map(function (e) { return norm(e.textContent); }); }

  window.__chk = { states: S.map(function (x) { return x.id; }), runState: runState, panelReach: panelReach, optionsPlan: optionsPlan, optionRun: optionRun, toolbarCount: toolbarCount, toolbarOne: toolbarOne, clickCount: clickCount, clickOne: clickOne, plan: PLAN, prepareKeyboard: prepareKeyboard, focusInfo: focusInfo, toolbarFocus: toolbarFocus, toolbarExpected: toolbarExpected, reset: reset, go: go, panel: panel, account: account, sleep: sleep, errors: errors, activeScreens: activeScreens, frameText: frameText, fill: fill, click: click, register: register };
})();
