/* =========================================================
   main.js — 비주얼 노벨 엔진
   ========================================================= */
(function (GD) {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const el = {
    body: document.body, stage: $('stage'), bg: $('bg'), chars: $('chars'),
    item: $('item'), note: $('note'), fx: $('fx'), glitter: $('glitter'),
    date: $('dateText'), dow: $('dowText'), money: $('moneyText'), stats: $('stats'),
    banner: $('banner'), phone: $('phone'), phoneBody: $('phoneBody'),
    notifs: $('notifs'), notifList: $('notifList'), notifCount: $('notifCount'), notifTitle: $('notifTitle'),
    textbox: $('textbox'), nameTab: $('nameTab'), text: $('text'), next: $('nextMark'),
    choices: $('choices'), black: $('black'), blackText: $('blackText'), flash: $('flash'),
    title: $('title'), ending: $('ending'), debug: $('debug'),
    log: $('log'), logBody: $('logBody'),
  };

  const params = new URLSearchParams(location.search);
  const DEBUG = params.has('debug');

  const E = {
    s: null,
    meta: GD.loadMeta(),
    token: 0,
    advance: null,     // 클릭 시 호출되는 resolver
    typing: null,      // 타자 효과 진행 중이면 {finish}
    backlog: [],
    shownMoney: 27590,
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const R2 = () => E.meta.runs >= 1;

  /* ---------------- 공통 유틸 ---------------- */
  function resolve(v) {
    return typeof v === 'function' ? v(E.s, E.meta) : v;
  }
  function pickText(cmd, key) {
    key = key || 'text';
    const v = (R2() && cmd[key + '2'] != null) ? cmd[key + '2'] : cmd[key];
    return resolve(v);
  }
  function passes(cmd) {
    if (cmd.only2 && !R2()) return false;
    if (cmd.only1 && R2()) return false;
    if (cmd.if && !cmd.if(E.s, E.meta)) return false;
    return true;
  }

  function applySet(set) {
    if (!set) return;
    const s = E.s;
    Object.keys(set).forEach((k) => {
      const v = set[k];
      if (k === 'flags') Object.assign(s.flags, v);
      else if (typeof v === 'number' && typeof s[k] === 'number') s[k] = Math.max(-5, s[k] + v);
      else s[k] = v;
    });
    renderStats();
    if (set.look) renderChars();
  }

  // 후반부에는 귀여운 기호가 깨진다
  function corrupt(text) {
    const m = E.s ? E.s.vis.mood : 0;
    if (m < 3 || typeof text !== 'string') return text;
    return text.replace(/♡/g, () => {
      const r = Math.random();
      return r < 0.45 ? '♡' : r < 0.7 ? '♥' : r < 0.85 ? '♡♡♡' : '◌';
    });
  }

  /* ---------------- 시각 상태 렌더링 ---------------- */
  function renderAll() {
    const v = E.s.vis;
    el.bg.className = 'bg bg-' + v.bg;
    el.body.dataset.mood = v.mood;
    el.date.textContent = v.day[0];
    el.dow.textContent = v.day[1];
    E.shownMoney = E.s.money;
    el.money.textContent = GD.formatWon(E.s.money);
    renderChars();
    renderItem();
    renderStats();
    el.black.classList.toggle('on', !!v.black);
  }

  function renderChars() {
    const v = E.s.vis;
    const keep = new Set(Object.keys(v.chars));
    el.chars.querySelectorAll('.sprite').forEach((n) => {
      if (!keep.has(n.dataset.char)) {
        n.classList.add('leaving');
        setTimeout(() => n.remove(), 350);
      }
    });
    Object.keys(v.chars).forEach((name) => {
      const c = v.chars[name];
      let node = el.chars.querySelector('.sprite[data-char="' + name + '"]:not(.leaving)');
      if (!node) {
        node = document.createElement('div');
        node.className = 'sprite entering';
        node.dataset.char = name;
        node.innerHTML = '<div class="card"><img alt="" /><div class="ph"><span></span></div></div>';
        const img = node.querySelector('img');
        img.addEventListener('error', () => node.classList.add('no-img'));
        img.addEventListener('load', () => node.classList.remove('no-img'));
        el.chars.appendChild(node);
        requestAnimationFrame(() => requestAnimationFrame(() => node.classList.remove('entering')));
      }
      const key = GD.spriteKey(name, c.pose, E.s, c.look);
      const src = GD.SPRITES[key];
      const img = node.querySelector('img');
      if (img.getAttribute('src') !== src) {
        if (src) img.setAttribute('src', src); else node.classList.add('no-img');
        node.classList.remove('pose-pop'); void node.offsetWidth; node.classList.add('pose-pop');
      }
      node.querySelector('.ph span').textContent = GD.NAMES[name] || name;
      node.dataset.at = c.at || 'center';
      node.dataset.pose = c.pose || '';
      node.dataset.fx = c.fx || '';
      node.dataset.look = name === 'gyader' ? (c.look || E.s.look) : '';
    });
  }

  function renderItem() {
    const it = E.s.vis.item;
    if (!it) { el.item.classList.add('hidden'); return; }
    el.item.className = 'item' + (it.cracked ? ' cracked' : '');
    el.item.innerHTML = '<img src="' + GD.ITEMS[it.name] + '" alt="" />';
  }

  function renderStats() {
    if (!E.s) return;
    el.stats.querySelectorAll('.stat').forEach((row) => {
      const k = row.dataset.k;
      const n = Math.max(0, Math.min(5, E.s[k]));
      const glyph = k === 'fatherFear' ? '●' : '♡';
      const off = k === 'fatherFear' ? '○' : '·';
      row.querySelector('.pips').textContent = glyph.repeat(n) + off.repeat(5 - n);
    });
    if (DEBUG) {
      el.debug.classList.remove('hidden');
      const s = E.s;
      el.debug.textContent =
        'scene ' + s.scene + ':' + s.idx + ' | run ' + E.meta.runs +
        '\nfairyTrust ' + s.fairyTrust + '  gyaderTrust ' + s.gyaderTrust + '  fatherFear ' + s.fatherFear +
        '\nfairySuspicion ' + s.fairySuspicion + '  trauma ' + s.trauma + '  memory ' + s.memory +
        '\nglam ' + s.glam + '  look ' + s.look + '  money ' + s.money;
    }
  }

  function animateMoney(to) {
    const from = E.shownMoney;
    E.shownMoney = to;
    const box = el.money.parentElement;
    box.classList.remove('loss', 'gain'); void box.offsetWidth;
    box.classList.add(to < from ? 'loss' : 'gain');
    const t0 = performance.now();
    const dur = 900;
    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      const val = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      el.money.textContent = GD.formatWon(val);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
    const toast = document.createElement('div');
    toast.className = 'money-toast ' + (to < from ? 'neg' : 'pos');
    toast.textContent = (to < from ? '-' : '+') + GD.formatWon(Math.abs(to - from));
    box.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
  }

  /* ---------------- 효과 ---------------- */
  function particles(glyphs, count) {
    const m = E.s.vis.mood;
    const n = Math.round(count * (m >= 3 ? 0.3 : m === 2 ? 0.6 : 1));
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.textContent = glyphs[i % glyphs.length];
      p.style.left = (10 + Math.random() * 80) + '%';
      p.style.top = (25 + Math.random() * 45) + '%';
      p.style.fontSize = (14 + Math.random() * 26) + 'px';
      p.style.animationDelay = (Math.random() * 0.35) + 's';
      p.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
      el.fx.appendChild(p);
      setTimeout(() => p.remove(), 1800);
    }
  }

  function fx(name, cmd) {
    switch (name) {
      case 'sparkle': particles(['✦', '✧', '☆', '♡'], 14); break;
      case 'hearts': particles(['♡', '♥', '♡', '✦'], 20); break;
      case 'stars': particles(['☆', '★', '✧', '✦'], 18); break;
      case 'shake':
        el.stage.classList.remove('shake'); void el.stage.offsetWidth; el.stage.classList.add('shake');
        break;
      case 'flash':
        el.flash.classList.remove('go'); void el.flash.offsetWidth; el.flash.classList.add('go');
        break;
      case 'glitch':
        el.body.classList.add('glitching');
        setTimeout(() => el.body.classList.remove('glitching'), 450);
        break;
      case 'repeat': {
        const wrap = document.createElement('div');
        wrap.className = 'repeat-wall';
        let html = '';
        for (let i = 0; i < 60; i++) html += '<span style="animation-delay:' + (i * 0.04) + 's">' + (cmd.text || '') + (i % 3 ? 'ㅋㅋ' : '') + '</span>';
        wrap.innerHTML = html;
        el.fx.appendChild(wrap);
        setTimeout(() => wrap.remove(), 3600);
        break;
      }
    }
  }

  /* ---------------- 입력 대기 ---------------- */
  function waitClick() {
    return new Promise((res) => { E.advance = res; });
  }

  function typeText(text, opts) {
    return new Promise((done) => {
      const full = String(text);
      const speed = opts.fast ? 12 : (E.s.vis.mood >= 3 ? 34 : 26);
      let i = 0;
      let timer = null;
      el.text.textContent = '';
      el.next.classList.remove('show');
      const finish = () => {
        clearInterval(timer);
        el.text.textContent = full;
        E.typing = null;
        el.next.classList.add('show');
        done();
      };
      E.typing = { finish };
      timer = setInterval(() => {
        i++;
        el.text.textContent = full.slice(0, i);
        if (i >= full.length) finish();
      }, speed);
    });
  }

  async function showLine(who, text, cmd) {
    const name = who ? (GD.NAMES[who] || who) : '';
    el.nameTab.textContent = name;
    el.nameTab.classList.toggle('hidden', !name);
    el.nameTab.dataset.who = who || '';
    el.textbox.dataset.who = who || 'narr';
    el.textbox.dataset.style = cmd.style || '';
    // 말하는 캐릭터 강조
    el.chars.querySelectorAll('.sprite').forEach((n) => {
      n.classList.toggle('speaking', n.dataset.char === who);
      n.classList.toggle('dim', !!who && n.dataset.char !== who && who !== 'narr');
    });
    const shown = corrupt(text);
    E.s.vis.line = { who: who || '', text: shown };
    E.backlog.push({ who: name, text: shown });
    if (E.backlog.length > 400) E.backlog.shift();
    await typeText(shown, cmd);
    await waitClick();
  }

  function showChoices(options) {
    return new Promise((res) => {
      el.choices.innerHTML = '';
      el.choices.classList.remove('hidden');
      el.next.classList.remove('show');
      const m = E.s.vis.mood;
      options.forEach((opt, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'choice' + (opt.cute ? ' cute' : ' plain') + (opt.sparkly ? ' sparkly' : '');
        const lockReason = opt.lock ? opt.lock(E.s, E.meta) : null;
        let label = resolve(opt.text);
        if (opt.cute) label = (m >= 3 ? corrupt('♡ ') : '♡ ') + label;
        b.innerHTML = '<span class="num">' + (i + 1) + '</span><span class="lbl"></span>';
        b.querySelector('.lbl').textContent = lockReason ? label.replace(/[^\s]/g, '█') : label;
        if (lockReason) {
          b.disabled = true;
          b.classList.add('locked');
          b.title = lockReason;
          const why = document.createElement('small');
          why.textContent = lockReason;
          b.appendChild(why);
        }
        b.style.animationDelay = (i * 0.07) + 's';
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          if (b.disabled) return;
          GD.sfx('select');
          el.choices.classList.add('hidden');
          el.choices.innerHTML = '';
          E.choiceKeys = null;
          res(opt);
        });
        el.choices.appendChild(b);
      });
      E.choiceKeys = Array.from(el.choices.querySelectorAll('button'));
    });
  }

  function gotoScene(name) {
    E.s.scene = name;
    E.s.idx = 0;
    GD.saveGame(E.s);
  }

  /* ---------------- 명령 실행 ---------------- */
  async function exec(cmd) {
    const s = E.s;
    const v = s.vis;

    if (cmd.set) applySet(cmd.set);
    if (cmd.run) { cmd.run(s, E.meta); renderStats(); }

    if (cmd.bg) { v.bg = cmd.bg; el.bg.className = 'bg bg-' + v.bg; }
    if (cmd.day) {
      v.day = cmd.day; el.date.textContent = cmd.day[0]; el.dow.textContent = cmd.day[1];
      el.date.parentElement.classList.remove('pop'); void el.date.offsetWidth; el.date.parentElement.classList.add('pop');
    }
    if (cmd.mood != null) { v.mood = cmd.mood; el.body.dataset.mood = cmd.mood; }
    if (cmd.hum != null) GD.hum(cmd.hum && !GD.isMuted());
    if (cmd.hideAll) { v.chars = {}; renderChars(); closePhone(); closeNotifs(); }
    if (cmd.hide) { delete v.chars[cmd.hide]; renderChars(); }
    if (cmd.show) {
      v.chars[cmd.show] = { pose: cmd.pose, at: cmd.at || 'center', look: cmd.look, fx: cmd.fx };
      renderChars();
    }
    if (cmd.say && cmd.pose && v.chars[cmd.say]) {
      v.chars[cmd.say].pose = cmd.pose; renderChars();
    }
    if ('item' in cmd) { v.item = cmd.item ? { name: cmd.item, cracked: !!cmd.cracked } : null; renderItem(); }
    if ('note' in cmd) showNote(cmd.note);
    if (cmd.sfx) GD.sfx(cmd.sfx);
    if (cmd.fx) fx(cmd.fx, cmd);

    if (cmd.money != null) {
      const d = resolve(cmd.money);
      if (d !== 0) {
        s.money = Math.max(0, s.money + d);
        GD.sfx(d < 0 ? 'loss' : 'coin');
        animateMoney(s.money);
      } else {
        const box = el.money.parentElement;
        box.classList.remove('loss', 'gain', 'still'); void box.offsetWidth; box.classList.add('still');
      }
      await sleep(400);
    }

    if (cmd.black === true) { v.black = true; el.black.classList.add('on'); el.blackText.textContent = ''; await sleep(700); }
    if (cmd.black === false) { v.black = false; el.blackText.textContent = ''; el.black.classList.remove('on'); await sleep(600); }

    if ('phone' in cmd) await phone(cmd.phone, cmd);
    if (cmd.notifs) await notifStack(cmd.notifs, cmd);
    if (cmd.banner) await banner(cmd);
    if (cmd.wait) await sleep(cmd.wait);

    if (cmd.blackText) {
      el.blackText.textContent = resolve(cmd.blackText);
      el.blackText.classList.remove('in'); void el.blackText.offsetWidth; el.blackText.classList.add('in');
      E.backlog.push({ who: '', text: resolve(cmd.blackText) });
      await sleep(900);
      await waitClick();
    }

    if (cmd.narr != null) await showLine('', pickText(cmd, 'narr'), cmd);
    if (cmd.say) await showLine(cmd.say, pickText(cmd), cmd);

    if (cmd.choice || cmd.makeover) {
      s.idx -= 1; GD.saveGame(s); s.idx += 1;
      const opts = cmd.makeover
        ? GD.makeoverOptions(s, cmd.makeover)
        : cmd.choice.filter((o) => !o.if || o.if(s, E.meta));
      if (cmd.makeover) showBannerInline('갸더를 최고의 갸루로 만들어보자!♡');
      const picked = await showChoices(opts);
      hideBannerInline();
      el.text.textContent = '';
      E.backlog.push({ who: '▶', text: resolve(picked.text) });
      applySet(picked.set);
      if (picked.go) gotoScene(resolve(picked.go));
      return;
    }

    if (cmd.when) {
      if (cmd.when(s, E.meta)) gotoScene(resolve(cmd.go));
      return;
    }
    if (cmd.go) { gotoScene(resolve(cmd.go)); return; }

    if (cmd.ending) { await showEnding(cmd.ending); throw new Error('__END__'); }
  }

  async function run(token) {
    try {
      while (token === E.token) {
        const scene = GD.SCENES[E.s.scene];
        if (!scene) { console.error('Unknown scene', E.s.scene); return; }
        if (E.s.idx >= scene.length) { console.warn('Scene ended without go:', E.s.scene); return; }
        const cmd = scene[E.s.idx++];
        if (!passes(cmd)) continue;
        await exec(cmd);
        if (token !== E.token) return;
        renderStats();
      }
    } catch (e) {
      if (e.message !== '__END__') console.error(e);
    }
  }

  /* ---------------- 연출 보조 ---------------- */
  function showNote(note) {
    if (!note) { el.note.classList.add('hidden'); return; }
    const lines = resolve(note.lines) || [];
    el.note.className = 'note note-' + (note.kind || 'memo');
    el.note.innerHTML = '';
    if (note.kind === 'drawing') {
      const art = document.createElement('div');
      art.className = 'crayon';
      art.innerHTML = '<img src="assets/characters/fairy-front.webp" alt="" />';
      el.note.appendChild(art);
    }
    lines.forEach((t) => {
      const p = document.createElement('p');
      p.textContent = t;
      el.note.appendChild(p);
    });
  }

  async function banner(cmd) {
    el.banner.textContent = corrupt(cmd.banner);
    el.banner.className = 'banner show';
    if (E.s.vis.mood < 3) GD.sfx('sparkle');
    if (E.s.vis.mood < 2) particles(['♡', '☆', '✦'], 10);
    await Promise.race([sleep(1700), waitClick()]);
    E.advance = null;
    if (R2() && cmd.banner2) {
      el.banner.textContent = cmd.banner2;
      el.banner.classList.add('wrong');
      await Promise.race([sleep(1600), waitClick()]);
      E.advance = null;
    }
    el.banner.className = 'banner hidden';
  }
  function showBannerInline(t) { el.banner.textContent = corrupt(t); el.banner.className = 'banner show inline'; }
  function hideBannerInline() { el.banner.className = 'banner hidden'; }

  async function phone(msgs, cmd) {
    if (!msgs) { closePhone(); return; }
    el.phone.classList.remove('hidden');
    if (cmd.title) $('phoneTitle').textContent = cmd.title;
    if (cmd.variant != null) el.phone.dataset.variant = cmd.variant;
    const gap = cmd.gap != null ? cmd.gap : 450;
    for (const m of msgs) {
      await sleep(gap);
      if (m.sep) {
        const sep = document.createElement('div');
        sep.className = 'phone-sep';
        sep.textContent = m.sep;
        el.phoneBody.appendChild(sep);
        continue;
      }
      const b = document.createElement('div');
      b.className = 'bubble ' + (m.from === 'me' ? 'me' : 'them');
      b.textContent = m.text;
      el.phoneBody.appendChild(b);
      el.phoneBody.scrollTop = el.phoneBody.scrollHeight;
      E.backlog.push({ who: m.from === 'me' ? '갸더 (메시지)' : m.from + ' (메시지)', text: m.text });
      GD.sfx('phone');
    }
    el.next.classList.add('show');
    if (!cmd.keep) {
      await waitClick();
      // 읽고 나면 휴대폰은 닫힌다 (keep:true 일 때만 다음 장면까지 유지)
      closePhone();
    }
  }

  function closePhone() {
    el.phone.classList.add('hidden');
    el.phoneBody.innerHTML = '';
    el.phone.dataset.variant = '';
    $('phoneTitle').textContent = '채린 ♡';
  }

  // 평범한 알림 UI에서 알림이 하나씩 쌓인다 (글리치/흔들림 없이)
  function closeNotifs() {
    el.notifs.classList.add('hidden');
    el.notifList.innerHTML = '';
  }

  async function notifStack(list, cmd) {
    el.notifList.innerHTML = '';
    el.notifTitle.textContent = cmd.notifTitle || '알림';
    el.notifCount.textContent = '0';
    el.notifs.classList.remove('hidden');
    const gap = cmd.gap != null ? cmd.gap : 950;
    let n = 0;
    for (const it of list) {
      await sleep(gap);
      const card = document.createElement('div');
      card.className = 'notif';
      const av = document.createElement('div');
      av.className = 'av';
      av.textContent = (it.who || '?').replace(/^@/, '').charAt(0).toUpperCase();
      const body = document.createElement('div');
      const who = document.createElement('div');
      who.className = 'who';
      who.textContent = it.who || '';
      const msg = document.createElement('div');
      msg.className = 'msg';
      msg.textContent = it.text;
      body.appendChild(who); body.appendChild(msg);
      card.appendChild(av); card.appendChild(body);
      el.notifList.insertBefore(card, el.notifList.firstChild);
      n += 1;
      el.notifCount.textContent = String(n);
      E.backlog.push({ who: (it.who || '알림') + ' (알림)', text: it.text });
      GD.sfx(n === 1 ? 'phone' : 'select');
    }
    await sleep(500);
    el.next.classList.add('show');
    await waitClick();
    closeNotifs();
  }

  /* ---------------- 엔딩 ---------------- */
  async function showEnding(id) {
    const info = GD.ENDINGS[id];
    const meta = E.meta;
    meta.runs += 1;
    if (meta.endings.indexOf(id) < 0) meta.endings.push(id);
    GD.saveMeta(meta);
    GD.clearGame();
    GD.hum(false);
    await sleep(600);
    $('endCode').textContent = info.code;
    $('endTitle').textContent = info.title;
    $('endSub').textContent = info.sub;
    $('endSong').classList.toggle('hidden', id !== 'D');
    el.ending.dataset.end = id;
    $('endStats').innerHTML =
      '<span>획득한 엔딩 ' + meta.endings.length + ' / 4</span>' +
      '<span>' + ['A', 'B', 'C', 'D'].map((k) => meta.endings.indexOf(k) >= 0 ? k : '?').join(' · ') + '</span>' +
      (meta.runs === 1 ? '<span class="hint">……다시 시작하면, 같은 대사가 다르게 들릴지도 모른다.</span>' : '');
    el.ending.classList.remove('hidden');
    el.black.classList.remove('on');
  }

  /* ---------------- 화면 전환 ---------------- */
  function showTitle() {
    E.token++;
    E.advance = null;
    GD.hum(false);
    el.ending.classList.add('hidden');
    el.title.classList.remove('hidden');
    el.body.dataset.mood = 0;
    E.meta = GD.loadMeta();
    const again = E.meta.runs >= 1;
    el.title.classList.toggle('again', again);
    $('tagline').innerHTML = again
      ? '갸더를 최고의 갸루로 만들어보자!♡ <em>……또?</em>'
      : '갸더를 최고의 갸루로 만들어보자!♡';
    $('btnStart').textContent = again ? '♡ NEW GAME' : '♡ START';
    $('btnContinue').classList.toggle('hidden', !GD.loadGame());
    $('endingList').innerHTML = E.meta.runs
      ? ['A', 'B', 'C', 'D'].map((k) => {
          const got = E.meta.endings.indexOf(k) >= 0;
          return '<span class="end-chip' + (got ? ' got' : '') + '">' + (got ? GD.ENDINGS[k].code + ' ' + GD.ENDINGS[k].title : 'END ' + k + ' ???') + '</span>';
        }).join('')
      : '';
  }

  function begin(state) {
    GD.unlockAudio();
    E.s = state;
    if (!E.s.vis) E.s.vis = { bg: 'room-dim', day: ['7월 1일', 'MON'], mood: 0, chars: {}, item: null, black: false };
    E.backlog = [];
    el.title.classList.add('hidden');
    el.ending.classList.add('hidden');
    el.choices.classList.add('hidden');
    closePhone(); closeNotifs();
    el.note.classList.add('hidden');
    el.banner.className = 'banner hidden';
    el.text.textContent = '';
    el.nameTab.classList.add('hidden');
    if (E.s.vis.line && E.s.vis.line.text) {
      const w = E.s.vis.line.who;
      el.text.textContent = E.s.vis.line.text;
      el.nameTab.textContent = w ? (GD.NAMES[w] || w) : '';
      el.nameTab.dataset.who = w;
      el.nameTab.classList.toggle('hidden', !w);
    }
    el.chars.innerHTML = '';
    renderAll();
    if (E.s.vis.mood >= 3 && E.s.scene !== 'confess') GD.hum(true);
    const token = ++E.token;
    run(token);
  }

  function newGame(scene) {
    const s = GD.newState();
    s.scene = scene || 'start';
    GD.saveGame(s);
    begin(s);
  }

  /* ---------------- 입력 ---------------- */
  function onAdvance() {
    if (!el.title.classList.contains('hidden') || !el.ending.classList.contains('hidden')) return;
    if (!el.log.classList.contains('hidden')) return;
    if (E.typing) { E.typing.finish(); return; }
    if (E.advance) {
      const r = E.advance; E.advance = null;
      el.next.classList.remove('show');
      r();
    }
  }

  el.stage.addEventListener('click', onAdvance);
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      if (document.activeElement && document.activeElement.tagName === 'BUTTON' && !el.title.classList.contains('hidden')) return;
      e.preventDefault(); onAdvance();
    } else if (/^[1-4]$/.test(e.key) && E.choiceKeys) {
      const b = E.choiceKeys[+e.key - 1];
      if (b && !b.disabled) b.click();
    } else if (e.key === 'Escape') {
      el.log.classList.add('hidden');
    }
  });

  ['toolbar'].forEach((id) => $(id).addEventListener('click', (e) => e.stopPropagation()));
  $('btnMute').addEventListener('click', () => {
    const m = GD.toggleMute();
    $('btnMute').classList.toggle('off', m);
    if (!m && E.s && E.s.vis.mood >= 3) GD.hum(true);
  });
  $('btnMenu').addEventListener('click', () => { if (E.s) GD.saveGame(Object.assign({}, E.s, { idx: Math.max(0, E.s.idx - 1) })); showTitle(); });
  $('btnLog').addEventListener('click', () => {
    el.logBody.innerHTML = '';
    E.backlog.forEach((l) => {
      const p = document.createElement('p');
      if (l.who) { const b = document.createElement('b'); b.textContent = l.who; p.appendChild(b); }
      p.appendChild(document.createTextNode(l.text));
      el.logBody.appendChild(p);
    });
    el.log.classList.remove('hidden');
    el.logBody.scrollTop = el.logBody.scrollHeight;
  });
  $('logClose').addEventListener('click', () => el.log.classList.add('hidden'));
  el.log.addEventListener('click', (e) => { if (e.target === el.log) el.log.classList.add('hidden'); });

  $('btnStart').addEventListener('click', () => newGame('start'));
  $('btnContinue').addEventListener('click', () => {
    const s = GD.loadGame();
    if (s) begin(s); else newGame('start');
  });
  $('btnToTitle').addEventListener('click', showTitle);
  $('btnReset').addEventListener('click', () => {
    if (confirm('모든 기록(회차, 엔딩, 저장)을 지울까요?')) { GD.resetAll(); showTitle(); }
  });

  // 반짝이 배경 생성
  (function makeGlitter() {
    let h = '';
    for (let i = 0; i < 26; i++) {
      h += '<i style="left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;animation-delay:' +
        (Math.random() * 4) + 's;font-size:' + (8 + Math.random() * 14) + 'px">' + ['✦', '♡', '☆', '✧'][i % 4] + '</i>';
    }
    el.glitter.innerHTML = h;
  })();

  GD.preload();
  // 테스트용: ?scene=d3 로 특정 장면부터 시작
  if (params.get('scene') && GD.SCENES[params.get('scene')]) {
    showTitle();
    const s = GD.newState();
    s.scene = params.get('scene');
    if (/^(d3|d4|d5|finale|confess|end|fight|night|haru|cafe)/.test(s.scene)) { s.look = 'gyaru'; s.glam = 2; }
    if (params.has('look')) s.look = params.get('look');
    begin(s);
  } else {
    showTitle();
  }

  window.__GD_ENGINE = E; // 디버그용
})(window.GD);
