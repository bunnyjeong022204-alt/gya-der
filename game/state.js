/* =========================================================
   state.js — 게임 상태 / 저장 / 회차(메타) 관리
   ========================================================= */
window.GD = window.GD || {};

(function (GD) {
  const SAVE_KEY = 'gyader.save.v1';
  const META_KEY = 'gyader.meta.v1';

  // 보이는 값 / 숨겨진 값
  GD.VISIBLE_STATS = ['fairyTrust', 'gyaderTrust', 'fatherFear'];
  GD.HIDDEN_STATS = ['fairySuspicion', 'trauma', 'memory'];

  GD.newState = function () {
    return {
      money: 27590,
      // 보이는 관계 수치
      fairyTrust: 0,
      gyaderTrust: 0,
      fatherFear: 0,
      // 숨겨진 수치 (엔딩 분기에 사용)
      fairySuspicion: 0,
      trauma: 0,
      memory: 0,
      // 육성 시스템
      glam: 0,            // 꾸민 횟수
      look: 'dark',       // dark | gyaru
      items: {},          // hair, clothes, makeup, accessory, sunglasses ...
      flags: {},
      // 진행
      scene: 'title',
      idx: 0,
    };
  };

  /* ---------- 회차 정보 (엔딩을 봐도 유지됨) ---------- */
  GD.loadMeta = function () {
    try {
      const m = JSON.parse(localStorage.getItem(META_KEY));
      if (m && typeof m.runs === 'number') return m;
    } catch (e) { /* ignore */ }
    return { runs: 0, endings: [] };
  };
  GD.saveMeta = function (m) {
    try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch (e) { /* ignore */ }
  };

  /* ---------- 진행 저장 (씬 시작 지점마다 자동 저장) ---------- */
  GD.saveGame = function (s) {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
  };
  GD.loadGame = function () {
    try {
      const s = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (s && typeof s.money === 'number' && typeof s.scene === 'string') {
        return Object.assign(GD.newState(), s);
      }
    } catch (e) { /* ignore */ }
    return null;
  };
  GD.clearGame = function () {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
  };

  GD.resetAll = function () {
    try { localStorage.removeItem(SAVE_KEY); localStorage.removeItem(META_KEY); } catch (e) { /* ignore */ }
  };

  GD.formatWon = function (n) {
    return n.toLocaleString('ko-KR') + '원';
  };
})(window.GD);
