/* =========================================================
   endings.js — 엔딩 4종
   ========================================================= */
window.GD = window.GD || {};

(function (GD) {
  const S = GD.SCENES;

  GD.ENDINGS = {
    A: { code: 'END A', title: 'LITERAL LEGEND', sub: '과거를 지우는 게 아니라, 앞으로 걸어갈 힘을 얻었다.' },
    B: { code: 'END B', title: 'SMILE ON', sub: '괜찮다는 말은, 가장 익숙한 거짓말이었다.' },
    C: { code: 'END C', title: 'RUNAWAY', sub: '이번에는, 내가 정한다.' },
    D: { code: 'END D', title: 'LITERAL END', sub: '……나 이제 진짜 괜찮아.' },
  };

  /* ---------- END A — LITERAL LEGEND ---------- */
  S.endA = [
    { item: null }, { hideAll: true },
    { black: true }, { wait: 700 },
    { bg: 'street-day' }, { mood: 1 }, { hum: false },
    { black: false },
    { narr: '선글라스 없이 본 바깥은, 생각보다 눈부셨다.' },
    { narr: '놀이터 벤치에 채린이 앉아 있었다. 숨이 찬 얼굴로.' },
    { show: 'gyader', pose: 'normal', at: 'center' },
    { say: 'gyader', text: '……채린아.' },
    { say: 'gyader', pose: 'hide', text: '나 사실 계속 무서웠어.' },
    { say: 'friend', text: '응.' },
    { say: 'friend', text: '말해줘서 고마워.' },
    { narr: '그날 갸더는 처음으로 끝까지 이야기했다.' },
    { narr: '문소리와, 발소리와, 일곱 살 때 공책에 그린 요정에 대해.' },
    { mood: 0 },
    { narr: '과거가 사라지지는 않는다.' },
    { narr: '다만 이제, 혼자 들고 있지 않아도 된다.' },
    { show: 'gyader', pose: 'smile', at: 'center' },
    { say: 'gyader', text: '싫은 건 싫다고 할 거야. 내 인생은 내가 사는 거잖아.' },
    { narr: '횡단보도 앞에서, 갸더는 신호가 바뀐 뒤에도 한 번 더 좌우를 살폈다.',
      if: (s, m) => m.endings.indexOf('D') >= 0 },
    { ending: 'A' },
  ];

  /* ---------- END B — SMILE ON ---------- */
  S.endB = [
    { item: null },
    { show: 'fairy', pose: 'happy', at: 'left' },
    { say: 'fairy', pose: 'cry', text: '……정말?' },
    { show: 'gyader', pose: 'smile', at: 'center' },
    { say: 'gyader', text: '응. 나 괜찮아ㅋㅋ' },
    { phone: [{ from: '채린', text: '진짜 괜찮아?' }, { from: 'me', text: '나 괜찮아ㅋㅋ' }] },
    { say: 'gyader', text: '진짜 괜찮아ㅋㅋㅋ' },
    { say: 'fairy', pose: 'meh', text: '갸더가 괜찮다면…… 응. 괜찮은 거겠지.' },
    { say: 'gyader', text: '괜찮아ㅋㅋ', fast: true },
    { fx: 'repeat', text: '괜찮아' },
    { hide: 'fairy' },
    { narr: '요정이 사라진 방. 혼자 남은 갸더가 웃고 있다.' },
    { narr: '거울 속의 갸더도, 아직 웃고 있다.', if: (s) => s.trauma >= 4 },
    { narr: '……' },
    { show: 'gyader', pose: 'tired', at: 'center' },
    { narr: '웃음이 멈춘다.' },
    { hum: false }, { hideAll: true },
    { black: true }, { wait: 1200 },
    { blackText: '...아직, 웃고 있어.' },
    { wait: 2500 },
    { ending: 'B' },
  ];

  /* ---------- END C — RUNAWAY ---------- */
  S.endC = [
    { item: null }, { hideAll: true },
    { narr: '가방 하나. 휴대폰 하나. 그게 전부였다.' },
    { sfx: 'doorClose' },
    { black: true }, { wait: 900 },
    { bg: 'street-night' }, { mood: 2 }, { hum: false },
    { black: false },
    { show: 'gyader', pose: 'normal', at: 'center' },
    { say: 'gyader', text: '이번에는 내가 정할 거야.' },
    { show: 'fairy', pose: 'smile', at: 'left', if: (s) => s.fairyTrust >= 3 },
    { say: 'fairy', text: '같이 가자♡ 난 어디 안 가.', if: (s) => s.fairyTrust >= 3 },
    { say: 'gyader', text: '……', if: (s) => s.fairyTrust >= 3 },
    { narr: '뒤를 돌아봤을 때, 요정은 따라오지 않았다.', if: (s) => s.fairyTrust < 3 },
    { hide: 'fairy' },
    { narr: '새벽 버스 창문에 핑크색 머리가 비친다.' },
    { narr: '버스가 멈출 때마다, 갸더는 문 쪽을 본다.', if: (s) => s.trauma >= 3 },
    { narr: '어디로 가는지는, 아직 아무도 모른다.' },
    { ending: 'C' },
  ];

  /* ---------- END D — LITERAL END ---------- */
  S.endD = [
    { item: null }, { hideAll: true },
    { sfx: 'sparkle' }, { fx: 'hearts' },
    { bg: 'street-day' }, { mood: 0 }, { hum: false },
    { show: 'gyader', pose: 'smile', at: 'center' },
    { narr: '평소처럼 선글라스를 쓴다. 금 간 렌즈 너머로, 세상이 두 갈래로 갈라져 보인다.' },
    { phone: [{ from: 'me', text: '나 이제 진짜 괜찮아.' }] },
    { narr: '신호가 바뀐다.' },
    { narr: '횡단보도를 건넌다.' },
    { sfx: 'brake' }, { wait: 700 },
    { fx: 'flash' }, { hideAll: true },
    { black: true }, { sfx: 'crash' }, { wait: 3000 },
    { go: 'endD_after' },
  ];

  /* ---------- END D 사고 이후 (횡단보도 / 지하주차장 두 경로가 공유) ---------- */
  S.endD_after = [
    { hideAll: true },
    { bg: 'street-dark', if: (s) => !s.flags.haruRoute },
    { bg: 'garage-dark', if: (s) => !!s.flags.haruRoute },
    { mood: 4 }, { hum: false },
    { black: false },
    { item: 'sunglasses', cracked: true },
    { narr: '바닥의 선글라스.' },
    { item: 'sun' },
    { narr: '포니테일 끝의 해 장식.' },
    { item: null },
    { narr: '바닥의 휴대폰.', if: (s) => !!s.flags.haruRoute },
    { phone: [
      { from: 'me', text: '나 이제 진짜 괜찮아.' },
      { from: '채린', text: '갸더야 어디야?' },
      { from: '채린', text: '답장 좀 해줘' },
      { from: '채린', text: '지금 갈게' },
    ], title: '잠금 화면', variant: 'lock', keep: true, gap: 800, if: (s) => !!s.flags.haruRoute },
    { narr: '읽지 못한 메시지.', if: (s) => !!s.flags.haruRoute },
    { phone: null, if: (s) => !!s.flags.haruRoute },
    { narr: '어두운 지하주차장. 정적.', if: (s) => !!s.flags.haruRoute },
    { narr: '어두워진 거리.', if: (s) => !s.flags.haruRoute },
    { black: true }, { wait: 1000 },
    { blackText: '...나 이제 진짜 괜찮아.' },
    { sfx: 'chime' },
    { ending: 'D' },
  ];
})(window.GD);
