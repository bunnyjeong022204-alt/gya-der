/* =========================================================
   haru.js — 후반 추가 에피소드 「하루」
   ---------------------------------------------------------
   흐름 (마지막 선택 "아버지에게 맞선다"에서 진입)
     fight → night_street → haru_dm → haru_cafe → haru_stalk
           → haru_garage → (endings.js 의 endD_after)  = END D

   원칙
   - 하루의 공포는 취향이 아니라 "싫다고 했는데도 멈추지 않는 것"에서 나온다.
   - 요정은 싫다고 하면 바로 물러난다. 그 대비를 장면 안에서 보여준다.
   - 폭력·스토킹은 대사, 메시지, 암전, 소리, 실루엣으로만 표현한다.
   ========================================================= */
window.GD = window.GD || {};

(function (GD) {
  const S = GD.SCENES;

  /* =====================================================
     1. 아버지와 크게 싸운 뒤 집을 뛰쳐나온다
     ===================================================== */
  S.fight = [
    { set: { flags: { haruRoute: true } } },
    { mood: 4 }, { hum: true }, { bg: 'room-dusk' },
    { show: 'gyader', pose: 'hide', at: 'center' },
    { narr: '현관문 소리. 발소리가 복도를 지나온다.' },
    { sfx: 'step' }, { wait: 600 }, { sfx: 'step' }, { wait: 500 },
    { sfx: 'door' },
    { show: 'dad', pose: 'face', at: 'right' },
    { say: 'dad', text: '이 시간까지 방에 처박혀서 뭐 하는 거야.' },
    { narr: '요정이 작은 손으로 귀를 막는다. 그리고 조용히, 사라진다.' },
    { hide: 'fairy' },
    { say: 'gyader', pose: 'normal', text: '……또 그 얘기야?' },
    { show: 'dad', pose: 'angry', at: 'right' },
    { say: 'dad', text: '뭐? 말대꾸야?' },
    { say: 'gyader', text: '말대꾸가 아니라. 그냥, 싫다고 하는 거야.' },
    { say: 'dad', text: '싫어? 네가 싫고 좋고 할 처지야?' },
    { say: 'gyader', text: '내 머리고, 내 옷이야.' },
    { say: 'dad', text: '네가 뭐 되는 줄 알아?' },
    { say: 'gyader', pose: 'hide', text: '……' },
    { say: 'dad', text: '돈도 없으면서 무슨 자신감이야.' },
    { say: 'gyader', pose: 'normal', text: '그래도 싫어. 이제 싫다고 할 거야.' },
    { say: 'dad', text: '자기가 뭐라도 되는 줄 아나.' },
    { narr: '아버지의 목소리가 커진다. 방 안의 공기가 얇아진다.' },
    { sfx: 'impact' }, { wait: 700 },
    { sfx: 'shatter' },
    { narr: '무언가 바닥에 떨어져 깨지는 소리.' },
    { narr: '갸더는 더 듣지 않았다.' },
    { narr: '손에 잡히는 건 휴대폰과 지갑이 전부였다.' },
    { money: (s) => (s.money > 2800 ? 2800 - s.money : 0) },
    { narr: (s) => '지갑에는 ' + GD.formatWon(s.money) + '뿐이었다.' },
    { sfx: 'doorClose' },
    { hideAll: true },
    { black: true }, { wait: 900 },
    { go: 'night_street' },
  ];

  /* =====================================================
     2. 밤거리 — 낯선 남성, 그리고 아버지의 말
     ===================================================== */
  S.night_street = [
    { hideAll: true }, { bg: 'street-night' }, { mood: 3 }, { hum: false },
    { black: false },
    { narr: '밤거리. 어디로 가는지도 모르고 걸었다.' },
    { show: 'gyader', pose: 'tired', at: 'center' },
    { narr: '머리 위의 금 간 선글라스가 가로등 아래에서 희미하게 반짝였다.' },
    { show: 'man', at: 'right', fx: 'shadow' },
    { narr: '가로등 뒤에서 누군가 걸어 나왔다. 얼굴은 어둠에 가려 보이지 않는다.' },
    { say: 'man', text: '저기요.' },
    { narr: '갸더는 무시하고 지나가려 한다.' },
    { say: 'man', text: '잠깐만요. 번호 좀 알려주실래요?' },
    { say: 'gyader', pose: 'normal', text: '……뭐요?' },
    { say: 'man', text: '그냥 마음에 들어서.' },
    { say: 'gyader', pose: 'pout', text: '내가 뭐 되는 줄 알아요?' },
    { say: 'gyader', text: '돈도 없어 보이는 게 무슨 자신감으로 번호를 달라고 해요?' },
    { say: 'gyader', text: '자기가 뭐라도 되는 줄 아나.' },
    { wait: 800 },
    { narr: '말이 입 밖으로 나온 뒤에야 갸더의 표정이 굳었다.' },
    { narr: '방금 그 말은.' },
    { narr: '자기가 만든 말이 아니었다.' },
    { say: 'dad', text: '네가 뭐 되는 줄 알아?' },
    { say: 'dad', text: '돈도 없으면서 무슨 자신감이야.' },
    { say: 'gyader', pose: 'hide', text: '……' },
    { say: 'man', text: '아니, 그렇게까지 화낼 건……' },
    { say: 'gyader', pose: 'normal', text: '꺼져.' },
    { hide: 'man' },
    { narr: '갸더는 그 자리를 떠났다. 걸음이 점점 빨라졌다.' },
    { narr: '입안에 남은 말의 맛이, 오래도록 가시지 않았다.' },
    { narr: '……이 말이 어디서 왔는지, 이제는 안다.', only2: true },
    { go: 'haru_dm' },
  ];

  /* =====================================================
     3. 트위터 — 하루와 연결
     ===================================================== */
  S.haru_dm = [
    { hideAll: true }, { bg: 'street-night' }, { mood: 3 },
    { show: 'gyader', pose: 'tired', at: 'center' },
    { narr: '편의점 앞 벤치. 휴대폰 배터리는 21%.' },
    { narr: '트위터 DM이 와 있었다. 하루였다.' },
    { phone: [
      { sep: '3일 전' },
      { from: '하루', text: '오늘 올린 사진 완전 예쁘더라 ㅋㅋ 갸루 진짜 잘 어울려' },
      { from: 'me', text: '고마워ㅋㅋ' },
      { from: '하루', text: '나 원래 남장한 여자 캐릭터 진짜 좋아하거든 ㅋㅋ 갸더도 한번 입어보면 어울릴 것 같은데' },
      { from: 'me', text: '그건 좀 싫어ㅋㅋ 나는 이 스타일이 좋아' },
      { from: '하루', text: '아 ㅋㅋ 알겠어 그냥 해본 소리' },
      { sep: '어제' },
      { from: '하루', text: '요즘 많이 힘들어 보이던데, 괜찮아?' },
      { from: 'me', text: '그냥 집이 좀 그래' },
      { from: '하루', text: '무슨 일 있으면 언제든 말해. 들어줄게' },
    ], title: '하루 · DM', variant: 'dm', keep: true, gap: 140 },
    { narr: '말이 잘 통하는 사람이었다. 갸루 스타일도 놀리지 않았고, 힘들어 보인다고 먼저 말해준 사람이었다.' },
    { phone: [
      { sep: '오늘 23:41' },
      { from: '하루', text: '오늘 무슨 일 있었어?' },
      { from: 'me', text: '집에서 나왔어.' },
      { from: '하루', text: '괜찮아?' },
      { from: 'me', text: '응.' },
      { from: '하루', text: '그럼 우리 만나서 이야기할래?' },
    ], keep: true, gap: 700 },
    { narr: '갸더는 한참을 고민했다.' },
    { narr: '그래도 오늘은, 혼자 있기 싫었다.' },
    { phone: [
      { from: 'me', text: '그래.' },
      { from: '하루', text: '내일 저녁 6시, 역 앞 카페에서 보자!' },
    ], keep: true },
    { narr: '현실에서 누군가에게 기대보려는, 처음이었다.' },
    { phone: null },
    { go: 'haru_cafe' },
  ];

  /* =====================================================
     4. 카페 — 평범하게 시작해서, 거절이 받아들여지지 않는다
     ===================================================== */
  S.haru_cafe = [
    { hideAll: true }, { bg: 'cafe' }, { mood: 2 },
    { narr: '다음 날 저녁, 역 앞 카페.' },
    { show: 'gyader', pose: 'normal', at: 'center' },
    { show: 'haru', at: 'right' },
    { say: 'haru', text: '아, 갸더지? 사진보다 훨씬 예쁘다. 오느라 고생했어.' },
    { say: 'gyader', pose: 'smile', text: '아, 네. ……안녕하세요.' },
    { say: 'haru', text: '편하게 말해. 여기 케이크가 맛있대.' },
    { say: 'haru', text: '나는 오늘도 야근할 뻔했어. 팀장님이 퇴근 5분 전에 회의를 잡았거든.' },
    { say: 'gyader', text: 'ㅋㅋ 최악이다.' },
    { say: 'haru', text: '맞아. 그래서 갸더 만나는 걸로 버텼지.' },
    { say: 'haru', text: '딸기 케이크 시킬까? 트위터에서 딸기 좋아한다고 했잖아.' },
    { say: 'gyader', text: '기억하네요.' },
    { say: 'haru', text: '당연하지.' },
    { say: 'haru', text: '그 선글라스 금 갔네. 말하기 싫으면 안 해도 돼. 근데 나, 진짜 걱정했어.' },
    { say: 'gyader', pose: 'smile', text: '……고마워요.' },
    { narr: '이 사람 옆에서는 조금, 숨이 쉬어졌다. 아직은.' },
    { narr: '하루가 옆자리에 둔 쇼핑백에서 무언가를 꺼냈다.' },
    { narr: '다림질된 셔츠와 조끼, 넥타이. 남자 옷이었다.' },
    { say: 'haru', text: '이거 한 번 입어볼래?' },
    { say: 'gyader', pose: 'normal', text: '뭐야?' },
    { say: 'haru', text: '전에 말했던 거.' },
    { say: 'gyader', text: '싫다고 했잖아.' },
    { say: 'haru', text: '아니, 진짜 잘 어울릴 것 같아서 그래.' },
    { say: 'gyader', pose: 'pout', text: '싫어.' },
    { wait: 1400 },
    { say: 'haru', text: '왜 이렇게 싫어해?' },
    { narr: '요정이었다면 "아, 미안! 안 할게."라고 했을 것이다.' },
    { narr: '하루는 옷을 가방에 다시 넣지 않았다.' },
    { choice: [
      { text: '"취향은 존중해요. 근데 저는 싫어요."', set: { gyaderTrust: 1 }, go: 'cafe_a' },
      { text: '"……오늘은 그 얘기 그만해요."', go: 'cafe_b' },
      { text: '말없이 자리에서 일어난다', set: { memory: 1 }, go: 'cafe_c' },
    ] },
  ];

  S.cafe_a = [
    { say: 'gyader', pose: 'normal', text: '하루 씨 취향이 이상하다는 게 아니에요. 그냥, 제가 싫은 거예요.' },
    { say: 'haru', text: '존중한다면서 한 번도 안 해주는 게 존중이야?' },
    { say: 'gyader', text: '존중이랑 그건 다른 거예요.' },
    { go: 'cafe_end' },
  ];
  S.cafe_b = [
    { say: 'gyader', text: '오늘은 그 얘기 그만해요.' },
    { say: 'haru', text: '이상하다. 트위터에서는 잘 받아줬잖아.' },
    { say: 'gyader', text: '그때도 싫다고 했어요.' },
    { go: 'cafe_end' },
  ];
  S.cafe_c = [
    { say: 'haru', text: '벌써 가게? 아직 얘기 다 안 했는데.' },
    { say: 'gyader', text: '……싫다고 했잖아요.' },
    { go: 'cafe_end' },
  ];

  S.cafe_end = [
    { say: 'haru', text: '알았어. 오늘은 그냥 가자.' },
    { say: 'haru', text: '……다음에는 꼭 입어줄 거지?' },
    { say: 'gyader', pose: 'hide', text: '……' },
    { narr: '갸더는 대답하지 않았다.' },
    { narr: '그날 밤도, 갸더는 편의점 불빛 아래에서 휴대폰을 켰다.' },
    { go: 'haru_stalk' },
  ];

  /* =====================================================
     5. 연락이 집착으로 — 알림이 조용히 쌓인다
     ===================================================== */
  S.haru_stalk = [
    { hideAll: true }, { bg: 'street-night' }, { mood: 3 },
    { show: 'gyader', pose: 'tired', at: 'center' },
    { narr: '다음 날 아침부터 알림이 울렸다.' },
    { notifs: [
      { who: '하루 (@haru_log)', text: '왜 답장 안 해?' },
      { who: '하루 (@haru_log)', text: '내가 뭐 잘못했어?' },
      { who: '하루 (@haru_log)', text: '읽은 거 알아.' },
      { who: '하루 (@haru_log)', text: '잠깐 만나서 이야기하자.' },
    ], notifTitle: '알림' },
    { narr: '갸더는 차단을 눌렀다.' },
    { narr: '조용해졌다. 한 시간쯤.' },
    { notifs: [
      { who: '@haru_2nd', text: '차단까지 하는 건 너무한 거 아니야?' },
      { who: '@haru_2nd', text: '그냥 얘기만 하자는 건데.' },
      { who: '@haru_2nd', text: '내가 뭘 그렇게 잘못했는데.' },
    ], notifTitle: '알림' },
    { say: 'gyader', pose: 'hide', text: '……' },
    { narr: '다시 차단.' },
    { notifs: [
      { who: '@haru_3rd', text: '나 진짜 너 걱정돼서 그래.' },
      { who: '@haru_3rd', text: '지금 어디야?' },
      { who: '@haru_3rd', text: '혼자 있으면 위험해.' },
      { who: '@haru_3rd', text: '내가 데리러 갈게.' },
    ], notifTitle: '알림' },
    { narr: '갸더는 집에 있지 않았다. 하루는 그걸 알고 있었다.' },
    { sfx: 'phone' },
    { phone: [
      { from: '채린', text: '갸더야, 요즘 연락이 잘 안 되네. 괜찮아?' },
      { from: 'me', text: '나 이제 진짜 괜찮아.' },
    ], keep: true },
    { narr: '채린에게는 말하지 못했다. 이번에도, 괜찮다고 했다.' },
    { phone: null },
    { narr: '밤이 깊어지자 갸더는 비를 피해 건물 지하주차장 입구로 내려갔다.' },
    { narr: '올린 사진 속 간판을 보고 찾아온 걸까. 알 수 없었다.' },
    { go: 'haru_garage' },
  ];

  /* =====================================================
     6. 지하주차장 — 그리고 END D 로 이어진다
     ===================================================== */
  S.haru_garage = [
    { hideAll: true }, { bg: 'garage' }, { mood: 4 }, { hum: true },
    { narr: '지하주차장. 형광등 하나가 낮게 웅웅거렸다.' },
    { show: 'gyader', pose: 'hide', at: 'left' },
    { show: 'car', at: 'right' },
    { show: 'haru', at: 'center', fx: 'shadow' },
    { say: 'haru', text: '왜 전화도 안 받고 차단해?' },
    { say: 'gyader', pose: 'normal', text: '그만해 주세요.' },
    { say: 'haru', text: '그냥 얼굴 보고 이야기하면 되잖아.' },
    { say: 'gyader', text: '싫어요.' },
    { say: 'haru', text: '우리 그냥 끝내는 거야?' },
    { say: 'gyader', text: '……네.' },
    { say: 'gyader', text: '이제 연락하지 마세요.' },
    { wait: 1600 },
    { say: 'haru', text: '진짜?' },
    { say: 'gyader', text: '네.' },
    { say: 'haru', text: '그럼 나 그냥 여기서 끝낼게.' },
    { say: 'gyader', text: '무슨 소리예요?' },
    { say: 'haru', text: '나랑 끝낼 거면…… 그냥 나 차로 쳐.' },
    { say: 'gyader', pose: 'pout', text: '……미쳤어요?' },
    { say: 'haru', text: '그럼 계속 만나줄 거야?' },
    { say: 'gyader', text: '그런 뜻 아니잖아요.' },
    { say: 'haru', text: '그럼 타.' },
    { say: 'gyader', text: '싫어요.' },
    { narr: '싫다고 하면 물러나던 작은 목소리가, 잠깐 떠올랐다.' },
    { say: 'haru', text: '……타.' },
    { sfx: 'doorClose' },
    { hideAll: true }, { bg: 'car' },
    { narr: '차 문이 닫히는 소리.' },
    { wait: 1800 },
    { narr: '잠시 정적.' },
    { say: 'gyader', pose: 'hide', text: '내려주세요.' },
    { narr: '대답 없음.' },
    { say: 'gyader', text: '내려달라고 했잖아요.' },
    { wait: 900 },
    { sfx: 'brake' }, { wait: 1100 },
    { sfx: 'crash' },
    { hum: false },
    { black: true }, { wait: 3000 },
    { go: 'endD_after' },
  ];
})(window.GD);
