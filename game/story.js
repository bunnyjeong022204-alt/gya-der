/* =========================================================
   story.js — 본편 스크립트
   ---------------------------------------------------------
   명령 목록 (main.js 의 엔진이 위에서부터 실행)
     { narr }                    내레이션
     { say, text, pose }         대사 (pose: 표정 변경)
     { text2 } / { only2 } / { only1 }   2회차 전용 대사 / 장면
     { show, pose, at, look, fx } / { hide } / { hideAll }
     { bg } { day:[날짜, 요일] } { mood:0~4 }
     { choice:[{ text, go, set, cute, if, lock }] }
     { makeover:'다음 씬' }      꾸미기 선택지
     { money:+/-, why }          돈 변화
     { sfx } { fx } { wait } { black } { blackText } { banner }
     { item } { note } { phone:[...] } { hum }
     { set:{...} } { run:fn } { when:fn, go } { go } { ending }
   ========================================================= */
window.GD = window.GD || {};

(function (GD) {
  const S = {};

  /* =====================================================
     DAY 1 — 7월 1일 MON   (귀여움 90% / 이상함 10%)
     ===================================================== */
  S.start = [
    { hideAll: true }, { item: null }, { note: null },
    { bg: 'room-dim' }, { day: ['7월 1일', 'MON'] }, { mood: 0 }, { hum: false },
    { banner: '갸더를 최고의 갸루로 만들어보자!♡', banner2: '갸더를 최고의 갸루로 만들어보자!♡ ……또?' },
    { narr: '커튼이 쳐진 방. 한낮인데도 어둡다.' },
    { show: 'gyader', pose: 'normal', at: 'center' },
    { narr: '갸더는 침대 끝에 웅크리고 앉아, 휴대폰 화면만 내려다보고 있다.' },
    { say: 'gyader', text: '……' },
    { say: 'gyader', text: '……학교 가기 싫다.' },
    { sfx: 'pop' }, { fx: 'sparkle' },
    { show: 'fairy', pose: 'happy', at: 'left' },
    { say: 'fairy', text: '꺄~! 너 완전 아까운 애다!' },
    { say: 'gyader', pose: 'side', text: '……뭐야.' },
    { say: 'fairy', pose: 'front', text: '그렇게 숨어 있으면 아무도 네가 예쁜 거 모른다구!' },
    { say: 'fairy', pose: 'wink',
      text: '나? 나는 너만의 갸루 요정♡ 오늘부터 너를 최고의 갸루로 만들어줄 거야!',
      text2: '나? 나는 너만의 갸루 요정♡ ……우리, 처음 만난 거 맞지?' },
    { say: 'gyader', pose: 'normal', text: '……미쳤나 봐. 잠을 못 자서 그런가.' },
    { say: 'fairy', pose: 'happy', text: '드디어 다시 만—' },
    { say: 'fairy', pose: 'smile', text: '아, 아니! 처음 보는 거지? 반가워!♡' },
    { say: 'gyader', text: '……다시?' },
    { say: 'fairy', pose: 'wink', text: '자자, 그런 건 신경 쓰지 말고!♡' },
    { choice: [
      { text: '요정의 말을 듣는다', cute: true, set: { fairyTrust: 1 }, go: 'd1_listen' },
      { text: '"……관심 같은 거 필요 없어."', cute: true, set: { gyaderTrust: 1 }, go: 'd1_refuse' },
    ] },
  ];

  S.d1_listen = [
    { say: 'gyader', text: '……뭘 하면 되는데.' },
    { say: 'fairy', pose: 'jump', text: '꺄아~ 말 잘 듣는 애 너무 좋아!♡' },
    { go: 'd1_makeover' },
  ];

  S.d1_refuse = [
    { say: 'gyader', text: '……관심 같은 거 필요 없어. 눈에 안 띄는 게 편해.' },
    { say: 'fairy', pose: 'meh', text: '흐응~ 눈에 안 띄는 게 편하다니.' },
    { say: 'fairy', pose: 'smile', text: '그건 \'편한\' 게 아니라 \'익숙한\' 거야♡', set: { memory: 1 } },
    { say: 'gyader', text: '……' },
    { go: 'd1_makeover' },
  ];

  S.d1_makeover = [
    { say: 'fairy', pose: 'jump', text: '그럼 첫 번째 변신! 뭐부터 할까?♡' },
    { makeover: 'd1_after' },
  ];

  S.d1_after = [
    { show: 'fairy', pose: 'happy', at: 'left' },
    { say: 'fairy', text: '오늘은 여기까지! 내일도 예쁜 갸루가 되어보자♡' },
    { say: 'gyader', text: '……내일도 올 거야?' },
    { say: 'fairy', pose: 'wink', text: '당연하지! 난 어디 안 가♡',
      text2: '당연하지! 난 어디 안 가. ……한 번도 간 적 없어♡' },
    { hide: 'fairy' },
    { narr: '그날 밤, 갸더는 오랜만에 거울을 오래 들여다봤다.' },
    { narr: '거울 속 갸더 옆에, 요정은 비치지 않았다.', only2: true },
    { go: 'd2' },
  ];

  /* =====================================================
     DAY 2 — 7월 2일 TUE   (첫 번째 이상현상: 돈)
     ===================================================== */
  S.d2 = [
    { hideAll: true }, { bg: 'room' }, { day: ['7월 2일', 'TUE'] }, { mood: 0 },
    { banner: '오늘도 예쁜 갸루가 되어보자♡', banner2: '……오늘도?' },
    { show: 'gyader', pose: 'normal', at: 'center' },
    { narr: '어젯밤 늦게, 방문이 한 번 열렸다 닫힌 것 같았다. 꿈이었을지도 모른다.' },
    { narr: '아침. 갸더는 지갑을 열었다.' },
    { money: -5000 },
    { say: 'gyader', text: '……내 돈 어디 갔어?' },
    { sfx: 'pop' }, { show: 'fairy', pose: 'happy', at: 'left' },
    { say: 'fairy', pose: 'happy', text: '어머~♡ 갸루가 되려면 이것저것 필요하잖아! 그, 그래서 그런 걸지도?' },
    { say: 'gyader', pose: 'pout', text: '내가 산 것도 아닌데?' },
    { say: 'fairy', pose: 'front', text: '어, 어라……? 그러게. 이, 이상하다~ 나도 잘 모르겠어! 아무튼 오늘도 예뻐지자!♡' },
    { mood: 1 },
    { choice: [
      { text: '요정을 믿는다', cute: true, set: { fairyTrust: 1 }, go: 'd2_trust' },
      { text: '요정을 의심한다', set: { fairySuspicion: 2 }, go: 'd2_doubt' },
      { text: '서랍을 확인한다', set: { memory: 1 }, go: 'd2_drawer' },
    ] },
  ];

  S.d2_trust = [
    { say: 'gyader', text: '……그래. 오천 원쯤이야.' },
    { say: 'fairy', pose: 'smile', text: '믿어줘서 고마워! 갸더는 착한 애♡' },
    { narr: '착한 애. 갸더는 그 말을 어디선가 아주 많이 들어본 것 같았다.' },
    { go: 'd2_mk' },
  ];

  S.d2_doubt = [
    { say: 'gyader', text: '너, 내 지갑 만졌어?' },
    { say: 'fairy', pose: 'cry', text: '나 아니야! 진짜야! 나는 돈 세는 법도 모르는걸……' },
    { say: 'gyader', text: '……그럼 누가.' },
    { say: 'fairy', pose: 'front', text: '……정말이야.', set: { fairySuspicion: 1 } },
    { go: 'd2_mk' },
  ];

  S.d2_drawer = [
    { narr: '서랍 안쪽, 구겨진 영수증이 한 장 있다.' },
    { note: { kind: 'receipt', lines: (s, m) => [
      'PINK CANDY ♡ 뷰티',
      '핑크 헤어 컬러 ........ 5,000원',
      '결제 시각 02:13 AM',
      '서명: (번져서 읽을 수 없다)',
    ].concat(m.runs >= 1 ? ['— 뒷면에 붙은 다른 영수증: 24시 편의점 02:15 · 5,000원'] : []) } },
    { say: 'gyader', text: '……새벽 두 시? 나 자고 있었는데.' },
    { say: 'fairy', pose: 'front', text: '나도 자고 있었어! ……요정도 자거든.' },
    { say: 'gyader', text: '……같은 시간에, 같은 돈.', only2: true },
    { note: null },
    { narr: '영수증 아래에, 크레파스로 그린 그림이 한 장 깔려 있다.', only2: true },
    { note: { kind: 'drawing', lines: ['나의 요정♡', '— 7살 갸더'] }, only2: true },
    { say: 'gyader', text: '……이거, 언제 그렸더라.', only2: true },
    { say: 'fairy', pose: 'smile', text: '기억 안 나도 괜찮아♡', only2: true },
    { note: null },
    { go: 'd2_mk' },
  ];

  S.d2_mk = [
    { show: 'fairy', pose: 'jump', at: 'left' },
    { say: 'fairy', text: '자, 그럼 오늘의 변신!♡' },
    { makeover: 'd2_after' },
  ];

  // 꾸미기 2회째에 자동으로 들어오는 "변신" 장면
  S.transform = [
    { sfx: 'sparkle' }, { fx: 'flash' }, { fx: 'hearts' },
    { set: { look: 'gyaru' } },
    { show: 'gyader', pose: 'smile', at: 'center' },
    { show: 'fairy', pose: 'gyaru', at: 'left' },
    { sfx: 'chime' },
    { say: 'fairy', text: '짜잔~! 최고의 갸루 탄생!♡' },
    { say: 'gyader', pose: 'normal', text: '……이게, 나?' },
    { say: 'gyader', pose: 'smile', text: '……좀, 괜찮네.' },
    { say: 'fairy', pose: 'wink', text: '거봐! 갸더는 원래 예뻤다니까♡' },
    { choice: [
      { text: '"응. 고마워."', cute: true, set: { fairyTrust: 1 }, go: (s) => s.flags.mkNext },
      { text: '"……근데 이건 내가 고른 거야."', set: { gyaderTrust: 1, fairySuspicion: 1 }, go: (s) => s.flags.mkNext },
    ] },
  ];

  S.d2_after = [
    { hide: 'fairy' },
    { narr: '그날, 학교에서 처음으로 누군가 갸더에게 먼저 말을 걸었다.' },
    { phone: [
      { from: '채린', text: '헐 갸더 머리 뭐야' },
      { from: '채린', text: '완전 예뻐;; 내일 사진 찍자!!' },
    ] },
    { say: 'gyader', pose: 'smile', text: '……예쁘대.' },
    { show: 'fairy', pose: 'happy', at: 'left' },
    { say: 'fairy', text: '꺄아~ 친구가 생겼다!♡ 나 너무 기뻐!' },
    { say: 'gyader', pose: 'normal', text: '……' },
    { go: 'd3' },
  ];

  /* =====================================================
     DAY 3 — 7월 3일 WED   (갈등 → 아버지 등장)
     ===================================================== */
  S.d3 = [
    { hideAll: true }, { bg: 'room' }, { day: ['7월 3일', 'WED'] }, { mood: 1 },
    { banner: '오늘도 예쁜 갸루가 되어보자♡', banner2: '……오늘도? 어제도 그랬는데.' },
    { show: 'gyader', pose: 'normal', at: 'center' },
    { money: -8000 },
    { say: 'gyader', pose: 'pout', text: '……또 줄었어.' },
    { narr: '책상 위 액자가 엎어져 있다. 가방 지퍼도 반쯤 열려 있다. 갸더는 늘 끝까지 닫는다.' },
    { show: 'fairy', pose: 'happy', at: 'left' },
    { say: 'fairy', text: '오늘은 이 옷 입어봐!' },
    { say: 'gyader', text: '싫어.' },
    { say: 'fairy', pose: 'front', text: '갸루가 되려면 해야지!' },
    { say: 'gyader', text: '왜 네가 정해?' },
    { say: 'fairy', pose: 'happy', text: '왜냐하면 내가 널 행복하게 만들어줄 거니까!' },
    { say: 'gyader', pose: 'normal', text: '내가 행복하다고 말했어?' },
    { show: 'fairy', pose: 'meh', at: 'left' },
    { narr: '요정의 웃는 얼굴이, 아주 잠깐 멈췄다.' },
    { say: 'fairy', text: '……아니. 안 했어.' },
    { say: 'fairy', pose: 'cry', text: '미안. 나는 그냥…… 네가 웃는 거 보고 싶었어.' },
    { choice: [
      { text: '요정 말대로 입힌다', cute: true, set: { fairyTrust: 1, gyaderTrust: -1, trauma: 1 }, go: 'd3_obey' },
      { text: '갸더 편을 든다', set: { gyaderTrust: 2, fairySuspicion: 1 }, go: 'd3_side' },
      { text: '아무 말도 하지 않는다', set: { memory: 1 }, go: 'd3_silent' },
    ] },
  ];

  S.d3_obey = [
    { sfx: 'sparkle' }, { fx: 'stars' },
    { say: 'gyader', text: '……알았어.' },
    { say: 'fairy', pose: 'happy', text: '착하다~♡' },
    { narr: '착하다. 또 그 말.' },
    { go: 'd3_father' },
  ];

  S.d3_side = [
    { narr: '— 입기 싫으면, 안 입어도 돼.', style: 'player' },
    { say: 'gyader', pose: 'side', text: '……방금, 누가 말했어?' },
    { say: 'fairy', pose: 'smile', text: '……맞아. 안 입어도 돼! 내가 너무 신났었나 봐.' },
    { say: 'gyader', pose: 'normal', text: '……' },
    { go: 'd3_father' },
  ];

  S.d3_silent = [
    { narr: '아무도 아무 말도 하지 않았다.' },
    { narr: '방 안이 조용해졌다. 너무 조용해서, 복도의 소리까지 들렸다.' },
    { go: 'd3_father' },
  ];

  S.d3_father = [
    { show: 'fairy', pose: 'happy', at: 'left' },
    { say: 'fairy', text: '그러니까 갸더는 핑크색이 잘 어울—', fast: true },
    { sfx: 'door' },
    { mood: 2 },
    { narr: '철컥.', style: 'big' },
    { say: 'gyader', pose: 'hide', text: '쉿.' },
    { say: 'fairy', pose: 'front', text: '응?' },
    { say: 'gyader', text: '……조용히 해.' },
    { sfx: 'step' }, { wait: 650 }, { sfx: 'step' }, { wait: 650 }, { sfx: 'step' }, { wait: 500 },
    { show: 'dad', pose: 'face', at: 'right' },
    { say: 'dad', text: '뭐가 그렇게 시끄러워.' },
    { say: 'gyader', pose: 'normal', text: '아무것도 아니야.' },
    { say: 'dad', text: '혼자 뭐라고 중얼거리고 있어?',
      text2: '혼자 뭐라고 중얼거리고 있어? ……네 엄마처럼.' },
    { narr: '아버지의 시선은 요정이 있는 자리를 그대로 지나쳤다.' },
    { narr: '갸더는 대답하지 않는다.' },
    { say: 'dad', pose: 'down', text: (s) => s.look === 'gyaru' ? '……그 머리는 또 뭐야. 그런 데 쓸 돈은 있나 보지?' : '……' },
    { choice: [
      { text: '숨을 죽인다', set: { fatherFear: 2, trauma: 1 }, go: 'd3_hold' },
      { text: '요정에게 도와달라고 한다', cute: true, set: { fairyTrust: 1, fairySuspicion: 1 }, go: 'd3_help' },
      { text: '갸더의 손을 잡는다', set: { gyaderTrust: 2 }, go: 'd3_hand' },
    ] },
  ];

  S.d3_hold = [
    { sfx: 'heartbeat' },
    { narr: '숨을 참는다. 갸더도, 화면 밖의 누군가도.' },
    { go: 'd3_dark' },
  ];
  S.d3_help = [
    { show: 'fairy', pose: 'cry', at: 'left' },
    { narr: '요정은 작은 손으로 귀를 막고 있다.' },
    { narr: '갸더가 어릴 때 하던 것과, 똑같은 자세로.' },
    { go: 'd3_dark' },
  ];
  S.d3_hand = [
    { narr: '닿지 않는다.' },
    { narr: '그래도 갸더의 손가락이, 아주 조금 움직였다.' },
    { go: 'd3_dark' },
  ];

  S.d3_dark = [
    { say: 'dad', pose: 'angry', text: '대답 안 해?' },
    { narr: '아버지가 다가온다.' },
    { sfx: 'step' }, { wait: 500 }, { sfx: 'step' }, { wait: 400 },
    { black: true },
    { sfx: 'doorClose' }, { wait: 1300 },
    { sfx: 'step' }, { wait: 900 },
    { sfx: 'heartbeat' }, { wait: 900 },
    { sfx: 'impact' }, { fx: 'shake' }, { wait: 1200 },
    { sfx: 'breath' }, { wait: 1400 },
    { sfx: 'shatter' }, { wait: 2200 },
    { hum: true },
    { hideAll: true }, { bg: 'room-dark' }, { mood: 3 },
    { set: { trauma: 1 } },
    { black: false },
    { item: 'sunglasses', cracked: true },
    { narr: '바닥에 떨어진 선글라스.' },
    { narr: '……갸더는 선글라스를 산 적이 없다.', if: (s) => !s.items.sunglasses },
    { item: null },
    { narr: '요정은 사라져 있다.' },
    { show: 'gyader', pose: 'hide', at: 'center' },
    { say: 'gyader', text: '……' },
    { narr: '갸더는 아무 말도 하지 않는다.' },
    { narr: '한참 뒤, 갸더는 선글라스를 주워 머리 위에 얹었다. 렌즈 한쪽에 금이 가 있었다.',
      set: { flags: { cracked: true } }, run: (s) => { s.items.sunglasses = true; } },
    { go: 'd4' },
  ];

  /* =====================================================
     DAY 4 — 7월 4일 THU   (기억의 틈, 아버지의 쪽지)
     ===================================================== */
  S.d4 = [
    { hideAll: true }, { bg: 'room' }, { day: ['7월 4일', 'THU'] }, { mood: 2 }, { hum: false },
    { banner: '오늘도 예쁜 갸루가 되어보자♡', banner2: '……오늘도?' },
    { show: 'gyader', pose: 'tired', at: 'center' },
    { narr: '아침. 지갑을 연다.' },
    { money: 0 },
    { say: 'gyader', text: '……안 줄었네.' },
    { narr: '요정이 나오지 않은 밤. 아버지가 집에 들어오지 않은 밤.' },
    { narr: '돈은, 그대로다.' },
    { narr: '부엌 식탁 위에 만 원짜리 한 장. 그 옆에 쪽지.' },
    { note: { kind: 'memo', lines: ['밥 사 먹어라.'] } },
    { narr: '쪽지 뒷면에는 지우다 만 글씨가 있다. 「미안」인지 「미안하」인지, 끝까지 쓰지 못한.', only2: true },
    { choice: [
      { text: '돈을 챙긴다', cute: true, go: 'd4_take' },
      { text: '그대로 둔다', set: { gyaderTrust: 1 }, go: 'd4_leave' },
      { text: '쪽지를 오래 본다', set: { memory: 1 }, go: 'd4_note' },
    ] },
  ];

  S.d4_take = [
    { note: null },
    { money: 10000 },
    { say: 'gyader', pose: 'pout', text: '……이걸로 퉁치려고.' },
    { set: { trauma: 1 } },
    { go: 'd4_fairy' },
  ];
  S.d4_leave = [
    { note: null },
    { say: 'gyader', text: '……필요 없어.' },
    { go: 'd4_fairy' },
  ];
  S.d4_note = [
    { narr: '삐뚤빼뚤한 글씨. 아버지는 글씨를 쓸 때 손을 떤다.' },
    { narr: '갸더는 그 사실을 언제부터 알고 있었는지 기억나지 않는다.' },
    { note: null },
    { go: 'd4_fairy' },
  ];

  S.d4_fairy = [
    { sfx: 'pop' },
    { show: 'fairy', pose: 'happy', at: 'left' },
    { show: 'fairy', pose: 'cry', at: 'left' },
    { say: 'fairy', text: '갸더…… 괜찮아? 어제는…… 나 무서워서 숨어버렸어. 미안해.' },
    { say: 'gyader', pose: 'normal', text: '……어제 무슨 일 있었는데?' },
    { say: 'fairy', pose: 'front', text: '……기억 안 나?' },
    { say: 'fairy', pose: 'smile', text: '그럼…… 지금은 안 나도 괜찮아.' },
    { narr: '갸더의 팔에, 기억나지 않는 멍이 있다.' },
    { say: 'fairy', pose: 'cry', text: '아파? 내가 호~ 해줄게. ……마법으로는 안 지워지네.' },
    { narr: '갸더는 편의점에서 컨실러를 샀다. 오천 원.' },
    { money: -5000 },
    { choice: [
      { text: '그냥 잊어버린다', cute: true, set: { fairyTrust: 1, trauma: 1, memory: -1 }, go: 'd4_forget' },
      { text: '"어제 일, 정말 기억 안 나?"', set: { memory: 2, trauma: 1 }, go: 'd4_flash' },
      { text: '아무 말도 하지 않는다', set: { trauma: 1 }, go: 'd4_silent' },
    ] },
  ];

  S.d4_forget = [
    { say: 'gyader', pose: 'smile', text: '그치. 나 괜찮아ㅋㅋ' },
    { say: 'fairy', pose: 'meh', text: '……진짜 괜찮은 거야?' },
    { narr: '웃는 얼굴. 거울 속의 갸더도 웃고 있다.' },
    { narr: '……조금, 늦게.' },
    { go: 'd4_mk' },
  ];

  S.d4_silent = [
    { narr: '갸더는 컨실러를 바른다. 꼼꼼하게. 익숙하게.' },
    { go: 'd4_mk' },
  ];

  // 어린 시절 회상
  S.d4_flash = [
    { say: 'gyader', pose: 'hide', text: '……' },
    { black: true }, { wait: 600 },
    { hideAll: true }, { bg: 'past' }, { mood: 4 },
    { black: false },
    { narr: '— 오래전.', style: 'big' },
    { show: 'gyader', look: 'dark', pose: 'chibi', at: 'center', fx: 'past' },
    { show: 'dad', pose: 'full', at: 'right', fx: 'past' },
    { say: 'dad', text: '울지 마. 시끄러워.' },
    { say: 'gyader', text: '……' },
    { sfx: 'step' },
    { narr: '어린 갸더는 소리를 내지 않는 법을 배웠다.' },
    { narr: '문이 닫히는 소리. 발소리. 숨소리. 소리마다 순서가 있다는 것도.' },
    { hide: 'dad' },
    { narr: '그리고 공책 한구석에, 아주 작게 핑크색 요정을 그렸다.' },
    { say: 'gyader', text: '요정님. 나 대신 웃어줘.', only2: true },
    { black: true }, { wait: 500 },
    { hideAll: true }, { bg: 'room' }, { mood: 3 },
    { black: false },
    { show: 'gyader', pose: 'hide', at: 'center' },
    { show: 'fairy', pose: 'meh', at: 'left' },
    { say: 'gyader', text: '……기억났어. 조금.', set: { gyaderTrust: 1 } },
    { say: 'fairy', pose: 'smile', text: '……그때도 나, 거기 있었어. 공책 한구석에.' },
    { go: 'd4_mk' },
  ];

  S.d4_mk = [
    { show: 'fairy', pose: 'jump', at: 'left' },
    { say: 'fairy', text: '오늘은…… 변신할래? 안 해도 돼!' },
    { choice: [
      { text: '웃는 얼굴을 붙인다', cute: true, set: { fairyTrust: 1, trauma: 1 }, go: 'd4_smile' },
      { text: '긴 소매로 가린다', cute: true, set: { trauma: 1, gyaderTrust: 1 }, go: 'd4_sleeve' },
      { text: '금 간 선글라스를 쓴다', cute: true, go: 'd4_glasses' },
      { text: '요정을 의심한다', if: (s) => s.fairySuspicion >= 2, go: 'd4_confront' },
    ] },
  ];

  S.d4_smile = [
    { sfx: 'sparkle' }, { fx: 'hearts' },
    { show: 'gyader', pose: 'smile', at: 'center' },
    { narr: '입꼬리가 올라간다.' },
    { narr: '갸더는 올리지 않았다.' },
    { go: 'd5' },
  ];
  S.d4_sleeve = [
    { sfx: 'sparkle' },
    { show: 'gyader', pose: 'hide', at: 'center' },
    { say: 'gyader', text: '……이게 편해.' },
    { say: 'fairy', pose: 'smile', text: '응! 편한 게 제일이야.' },
    { say: 'gyader', text: '……옛날엔 이게 숨는 거였는데. 오늘은 그냥 입는 거야.' },
    { go: 'd5' },
  ];
  S.d4_glasses = [
    { sfx: 'sparkle' },
    { narr: '금 간 렌즈 너머로, 세상이 두 갈래로 갈라져 보인다.' },
    { say: 'fairy', pose: 'gyaru', text: '금 갔는데…… 그래도 쓸 거야? ……그럼 내가 반짝이 붙여줄게♡' },
    { set: { flags: { glassesOn: true } } },
    { go: 'd5' },
  ];

  // 요정의 정체 — 끝까지 확정하지 않는다
  S.d4_confront = [
    { say: 'gyader', pose: 'normal', text: '너, 진짜 뭐야?' },
    { say: 'fairy', pose: 'front', text: '나?' },
    { say: 'fairy', pose: 'wink', text: '나는 네가 제일 힘들 때 나타나는 갸루 요정♡' },
    { say: 'gyader', text: '……거짓말.' },
    { show: 'fairy', pose: 'back', at: 'left' },
    { say: 'fairy', text: '그럼 이렇게 말할까?' },
    { say: 'fairy', text: '나는 네가 만든 거야. 일곱 살 때, 공책 한구석에.' },
    { say: 'fairy', text: '……아니면.' },
    { fx: 'glitch' },
    { say: 'fairy', pose: 'front', text: '지금 이 화면을 누르고 있는 쪽이, 나일 수도 있고♡', style: 'fourth' },
    { say: 'gyader', pose: 'side', text: '……뭐?' },
    { say: 'fairy', pose: 'happy', text: '농담~♡', set: { fairySuspicion: 1, memory: 1, flags: { confronted: true } } },
    { say: 'gyader', pose: 'normal', text: '……그럼 내 돈은.' },
    { say: 'fairy', pose: 'front', text: '그건 진짜 나 아니야.' },
    { say: 'fairy', pose: 'meh', text: '……나는 그 시간엔, 늘 숨어 있었거든.' },
    { go: 'd5' },
  ];

  /* =====================================================
     DAY 5 — 7월 5일 FRI   (공포 80%)
     ===================================================== */
  S.d5 = [
    { hideAll: true }, { bg: 'room-dusk' }, { day: ['7월 5일', 'FRI'] }, { mood: 3 }, { hum: true },
    { banner: '오늘도 예쁜 갸루가 되어보자♡ 오늘도 예쁜 갸루가 되어보자♡ 오늘도 예쁜 갸루가',
      banner2: '……오늘도? 언제까지?' },
    { show: 'gyader', pose: 'normal', at: 'center' },
    { narr: '어젯밤에도, 방문이 한 번 열렸다 닫혔던 것 같다.' },
    { narr: '해 질 녘. 지갑을 연다.' },
    { money: (s) => s.fatherFear >= 2 ? -6000 : -3000 },
    { narr: '또 줄었다. 이제 놀랍지도 않다.' },
    { sfx: 'phone' },
    { phone: [
      { from: '채린', text: '갸더야 요즘 무슨 일 있어?' },
      { from: '채린', text: '너 웃는데 안 웃는 것 같아' },
    ], keep: true },
    { say: 'gyader', text: '……' },
    { choice: [
      { text: '"나 괜찮아ㅋㅋ"', cute: true, set: { fairyTrust: 1, flags: { saidFine: true } }, go: 'd5_fine' },
      { text: '"……사실 좀."', set: { gyaderTrust: 1, memory: 1 }, go: 'd5_true' },
      { text: '읽고 답하지 않는다', set: { trauma: 1 }, go: 'd5_ignore' },
    ] },
  ];

  S.d5_fine = [
    { phone: [{ from: 'me', text: '나 괜찮아ㅋㅋ' }] },
    { go: 'd5_fairy' },
  ];
  S.d5_true = [
    { phone: [{ from: 'me', text: '……사실 좀.' }, { from: '채린', text: '내일 만나서 얘기하자. 진짜로.' }] },
    { go: 'd5_fairy' },
  ];
  S.d5_ignore = [
    { phone: null },
    { narr: '「읽음」 표시가 뜬다. 갸더는 화면을 엎어둔다.' },
    { go: 'd5_fairy' },
  ];

  S.d5_fairy = [
    { phone: null },
    { sfx: 'pop' },
    { show: 'fairy', pose: 'smile', at: 'left' },
    { say: 'fairy', text: '채린이 걱정하네. 갸더한테 걱정해주는 친구가 생겼어♡' },
    { say: 'fairy', pose: 'front', text: '있잖아, 나는 갸더가 웃는 게 좋아.' },
    { say: 'fairy', pose: 'cry', text: '……근데 억지로 웃는 건, 안 좋아.' },
    { say: 'gyader', pose: 'hide', text: '……알아.' },
    { sfx: 'door' },
    { narr: '철컥. 현관문 소리.', style: 'big' },
    { sfx: 'heartbeat' },
    { narr: '발소리가 복도를 지나간다.' },
    { sfx: 'step' }, { wait: 700 }, { sfx: 'step' }, { wait: 700 }, { sfx: 'step' }, { wait: 900 },
    { narr: '이번에는, 방 앞에서 멈추지 않는다.' },
    { narr: '……아직은.' },
    { show: 'fairy', pose: 'smile', at: 'left' },
    { say: 'fairy', text: '있잖아, 갸더. 다음에 또 그러면 어떻게 할 거야?' },
    { say: 'fairy', pose: 'happy', text: '뭘 골라도, 나는 옆에 있을게♡' },
    { go: 'finale' },
  ];

  /* =====================================================
     FINALE — 엔딩 분기
     ===================================================== */
  S.finale = [
    { choice: [
      { text: '괜찮다고 말한다', cute: true, go: 'endB' },
      { text: '집을 나간다', go: 'endC' },
      { text: '누군가에게 털어놓는다', go: 'confess',
        lock: (s) => (s.memory >= 3 && s.gyaderTrust >= 3) ? null : '……아직, 말이 나오지 않는다.' },
      { text: '아버지에게 맞선다', go: 'fight' },
    ] },
  ];

  S.confess = [
    { mood: 2 }, { hum: false },
    { show: 'fairy', pose: 'cry', at: 'left' },
    { say: 'fairy', text: '……말할 거야?' },
    { say: 'fairy', text: '말하면 더 혼날지도 몰라. ……옛날엔 그랬잖아.' },
    { say: 'gyader', pose: 'normal', text: '……알아. 기억나.' },
    { say: 'gyader', text: '그러니까, 말할 거야.' },
    { say: 'fairy', pose: 'smile', text: '……응. 그럼 나는, 이제 안 나와도 되겠다♡' },
    { hide: 'fairy' },
    { narr: '요정이 있던 자리가, 그냥 방이 되었다.' },
    { phone: [
      { from: 'me', text: '채린아' },
      { from: 'me', text: '나 사실 계속 무서웠어.' },
    ], keep: true },
    { sfx: 'phone' },
    { phone: [
      { from: '채린', text: '지금 어디야? 내가 갈게.' },
      { from: '채린', text: '너 혼자 아니야.' },
    ] },
    { phone: null },
    { narr: '갸더는 오랫동안 화면을 내려다봤다.' },
    { say: 'gyader', text: '……응.' },
    { narr: '가방을 들고 현관 앞에 선다. 신발장 위에, 금 간 선글라스가 놓여 있다.' },
    { item: 'sunglasses', cracked: true },
    { choice: [
      { text: '선글라스를 쓴다', cute: true, sparkly: true, go: 'endD' },
      { text: '선글라스를 두고 간다', go: 'endA' },
    ] },
  ];

  GD.registerMakeovers(S);
  GD.SCENES = S;
})(window.GD);
