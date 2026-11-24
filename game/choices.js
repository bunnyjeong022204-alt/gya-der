/* =========================================================
   choices.js — 갸루 육성(꾸미기) 선택지
   꾸미기는 "마법"이라 그 자리에서 돈이 들지 않는다.
   ……대신 다음 날 아침 지갑이 가벼워져 있다.
   ========================================================= */
window.GD = window.GD || {};

(function (GD) {
  const R2 = (m) => m.runs >= 1; // 2회차 이상

  GD.MAKEOVERS = {
    hair: {
      label: '머리를 바꾼다',
      lines: [
        { sfx: 'sparkle' }, { fx: 'hearts' },
        { narr: (s) => s.look === 'dark'
            ? '검은 머리카락 끝에서부터 핑크색이 번져 올라간다.'
            : '핑크색이 한 톤 더 밝아진다.' },
        { say: 'fairy', pose: 'happy', text: '꺄~ 핑크 완전 찰떡!♡ 역시 내 눈이 맞았어!' },
        { say: 'gyader', text: '……머리색 바꾸면 혼나는데.' },
        { say: 'fairy', pose: 'front', text: '응? 누구한테?' },
        { say: 'gyader', text: '……아무것도 아니야.', set: { fatherFear: 1 } },
      ],
    },
    clothes: {
      label: '핑크색 옷을 입는다',
      lines: [
        { sfx: 'sparkle' }, { fx: 'stars' },
        { narr: '헐렁한 후드가 사라지고, 레오파드 무늬 재킷이 어깨에 걸린다.' },
        { say: 'fairy', pose: 'wink', text: '봐봐! 어깨 라인 완전 예쁘잖아♡' },
        { say: 'gyader', text: '……팔, 너무 드러나는데.' },
        { say: 'fairy', pose: 'front', text: '어? 그럼 위에 하나 걸치자! 갸더가 편한 게 제일이야♡' },
        { say: 'gyader', text: '……', set: { trauma: 1 } },
        { narr: '갸더는 무심코 왼쪽 팔뚝을 손바닥으로 덮었다.', only2: true },
      ],
    },
    makeup: {
      label: '메이크업을 한다',
      lines: [
        { sfx: 'sparkle' }, { fx: 'hearts' },
        { narr: '속눈썹이 길어지고, 볼 위로 핑크빛이 올라온다.' },
        { say: 'fairy', pose: 'happy', text: '짜잔! 피곤한 얼굴 완전 사라졌지?♡' },
        { say: 'gyader', text: '……가려진 거지, 사라진 건 아니잖아.', set: { memory: 1 } },
        { say: 'fairy', pose: 'smile', text: '……응. 그래도 오늘은 예쁘다고 말해주고 싶었어♡' },
      ],
    },
    accessory: {
      label: '액세서리를 붙인다',
      lines: [
        { sfx: 'sparkle' }, { fx: 'stars' },
        { narr: '목걸이, 귀걸이, 반짝이는 별 스티커. 요정이 포니테일 끝의 해 장식에 작은 손을 뻗는다.' },
        { say: 'fairy', pose: 'happy', text: '여기에도 반짝이 붙여줄까?' },
        { say: 'gyader', text: '빼지 마.', set: { gyaderTrust: 1 } },
        { say: 'fairy', pose: 'front', text: '……응?' },
        { say: 'gyader', text: '그건, 빼지 마.' },
        { say: 'gyader', text: '엄마가 준 거야.', only2: true },
        { say: 'fairy', pose: 'smile', text: '아, 미안! 소중한 거구나. ……갸더가 싫다고 말해줘서, 나 좀 기뻐♡' },
      ],
    },
    sunglasses: {
      label: '선글라스를 쓴다',
      lines: [
        { sfx: 'sparkle' }, { fx: 'hearts' },
        { narr: '핑크색 선글라스. 세상이 조금 덜 선명해진다.' },
        { say: 'fairy', pose: 'gyaru', text: '이거 쓰면 눈부신 날도 괜찮아♡ ……울고 싶은 날도.' },
        { say: 'gyader', text: '……그거, 좋네.', set: { fairyTrust: 1 } },
      ],
    },
  };

  GD.MAKEOVER_ORDER = ['hair', 'clothes', 'makeup', 'accessory', 'sunglasses'];

  // 꾸미기 장면들을 SCENES로 등록한다 (mk_hair, mk_clothes ...)
  GD.registerMakeovers = function (SCENES) {
    GD.MAKEOVER_ORDER.forEach(function (key) {
      const m = GD.MAKEOVERS[key];
      SCENES['mk_' + key] = [].concat(
        [{ run: (s) => { s.items[key] = true; s.glam += 1; } }],
        m.lines,
        [
          { when: (s) => s.glam === 2 && s.look === 'dark', go: 'transform' },
          { go: (s) => s.flags.mkNext },
        ]
      );
    });
  };

  // { makeover: 'nextScene' } 명령이 만드는 선택지
  GD.makeoverOptions = function (s, next) {
    s.flags.mkNext = next;
    return GD.MAKEOVER_ORDER
      .filter((k) => !s.items[k])
      .slice(0, 3)
      .map((k) => ({ text: GD.MAKEOVERS[k].label, cute: true, go: 'mk_' + k }));
  };

  GD.R2 = R2;
})(window.GD);
