/* =========================================================
   assets.js — 이미지 경로 모음
   이미지를 교체하려면 assets/ 안의 파일을 같은 이름으로 바꾸거나
   아래 경로만 수정하면 된다. 파일이 없으면 CSS 실루엣으로 대체된다.
   ========================================================= */
window.GD = window.GD || {};

(function (GD) {
  const C = 'assets/characters/';
  const I = 'assets/items/';

  GD.SPRITES = {
    // 과거의 갸더 (어두운 모습)
    'gyader.dark.normal': C + 'gyader-portrait.webp',
    'gyader.dark.sad':    C + 'gyader-sad.webp',
    'gyader.dark.hide':   C + 'gyader-hide.webp',
    'gyader.dark.side':   C + 'gyader-side.webp',
    'gyader.dark.full':   C + 'gyader-full.webp',
    'gyader.dark.chibi':  C + 'gyader-chibi.webp',
    // 갸루가 된 갸더
    'gyader.gyaru.normal': C + 'gyaru-portrait.webp',
    'gyader.gyaru.smile':  C + 'gyaru-peace.webp',
    'gyader.gyaru.pout':   C + 'gyaru-pout.webp',
    'gyader.gyaru.hide':   C + 'gyaru-hide.webp',
    'gyader.gyaru.tired':  C + 'gyaru-tired.webp',
    'gyader.gyaru.full':   C + 'gyaru-full.webp',
    'gyader.gyaru.chibi':  C + 'gyaru-chibi.webp',
    // 요정
    'fairy.front': C + 'fairy-front.webp',
    'fairy.happy': C + 'fairy-happy.webp',
    'fairy.smile': C + 'fairy-smile.webp',
    'fairy.wink':  C + 'fairy-wink.webp',
    'fairy.meh':   C + 'fairy-meh.webp',
    'fairy.cry':   C + 'fairy-cry.webp',
    'fairy.gyaru': C + 'fairy-gyaru.webp',
    'fairy.jump':  C + 'fairy-jump.webp',
    'fairy.drink': C + 'fairy-drink.webp',
    'fairy.lie':   C + 'fairy-lie.webp',
    'fairy.back':  C + 'fairy-back.webp',
    // 아버지
    'dad.full':  C + 'dad-full.webp',
    'dad.face':  C + 'dad-face.webp',
    'dad.down':  C + 'dad-worried.webp',
    'dad.angry': C + 'dad-angry.webp',
  };

  GD.ITEMS = {
    sunglasses: I + 'sunglasses.webp',
    sun: I + 'sun.webp',
    bunny: I + 'bunny.webp',
  };

  GD.NAMES = {
    gyader: '갸더',
    fairy: '요정',
    dad: '아버지',
    friend: '채린',
    narr: '',
    ghost: '???',
    man: '남성',
    haru: '하루',
  };

  // 갸더는 현재 외형(look)에 따라 스프라이트 세트가 바뀐다
  // 외형마다 없는 표정은 가까운 표정으로 대체
  const POSE_FALLBACK = {
    dark: { smile: 'normal', pout: 'normal', tired: 'sad' },
    gyaru: { sad: 'tired', side: 'pout' },
  };

  GD.spriteKey = function (char, pose, state, forceLook) {
    if (char === 'gyader') {
      const look = forceLook || state.look;
      let p = pose || 'normal';
      if (!GD.SPRITES['gyader.' + look + '.' + p]) p = (POSE_FALLBACK[look] || {})[p] || 'normal';
      return 'gyader.' + look + '.' + p;
    }
    return char + '.' + (pose || (char === 'fairy' ? 'front' : 'full'));
  };

  // 미리 불러오기
  GD.preload = function () {
    Object.values(GD.SPRITES).concat(Object.values(GD.ITEMS)).forEach(function (src) {
      const img = new Image();
      img.src = src;
    });
  };
})(window.GD);
