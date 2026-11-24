# Gya-der ♡ — 선택형 심리 공포 비주얼 노벨

"어두운 소녀를 최고의 갸루로 만들어주는 귀여운 육성 게임"처럼 보이는 심리 공포 게임.

## 실행
- **그냥 `index.html`을 더블클릭**해도 실행된다 (서버 불필요, 빌드 없음).
- 또는 로컬 서버: `python -m http.server 5191` → http://localhost:5191

## 조작
클릭 / Space / Enter: 다음 대사 · 숫자 1~4: 선택지 · LOG: 대사 기록 · ♪: 소리 · MENU: 타이틀(자동 저장)

## 구조
```
index.html      화면 구조
style.css       Y2K 핑크 UI + mood(0~4)별 붕괴 연출
main.js         VN 엔진 (대사/선택지/연출/저장)
game/state.js   상태값 · 저장 · 회차(meta)
game/assets.js  이미지 경로 (교체 지점)
game/audio.js   효과음 (WebAudio 합성, 파일 없음)
game/choices.js 꾸미기(육성) 선택지
game/story.js   본편 Day 1~5
game/endings.js 엔딩 A~D
assets/characters, assets/items  캐릭터/소품 이미지
```

## 상태값
- 보이는 값: `money`, `fairyTrust`(요정), `gyaderTrust`(갸더), `fatherFear`(불안)
- 숨겨진 값: `fairySuspicion`, `trauma`, `memory`
- `?debug` 를 주소 뒤에 붙이면 숨겨진 값이 화면에 표시된다.
- `?scene=d3` 처럼 특정 장면부터 바로 테스트할 수 있다.

## 엔딩 조건
| 엔딩 | 조건 |
|---|---|
| A LITERAL LEGEND | `memory ≥ 3` 그리고 `gyaderTrust ≥ 3` → 털어놓는다 → 선글라스를 두고 간다 |
| B SMILE ON | 마지막에 "괜찮다고 말한다" |
| C RUNAWAY | 마지막에 "집을 나간다" |
| D LITERAL END | (1) 털어놓는다 → ♡ 선글라스를 쓴다(횡단보도) 또는 (2) 마지막에 "아버지에게 맞선다" → 하루 에피소드(지하주차장) |

## 2회차
엔딩을 한 번 보면 `localStorage`에 회차가 기록되고, 다음 플레이부터 대사·배너·장면이 달라진다
(`text2`, `banner2`, `only2` 로 표시된 명령). 타이틀의 "기록 초기화"로 처음 상태로 돌아간다.

## 이미지 교체
`game/assets.js`의 경로를 바꾸거나 같은 이름의 파일로 덮어쓰면 된다. 파일이 없으면 CSS 실루엣으로 대체된다.

## 하루 에피소드 (game/haru.js)
마지막 선택 "아버지에게 맞선다"로 진입한다. 기존 1~5일차, 요정, 채린, 돈 시스템, 엔딩 A/B/C는 건드리지 않았다.

`fight`(아버지와 싸움, 휴대폰·지갑만 들고 뛰쳐나옴, 돈이 2,800원 이하로 줄어듦)
→ `night_street`(낯선 남성의 실루엣, 아버지의 말을 갸더가 그대로 반복)
→ `haru_dm`(트위터 DM으로 하루와 연결) → `haru_cafe`(거절을 받아들이지 않음)
→ `haru_stalk`(차단해도 새 계정으로 알림이 쌓임) → `haru_garage`(지하주차장, 급브레이크·암전)
→ `endD_after`(END D 공통 마무리)

- 공포의 원인은 하루의 취향이 아니라 "싫다고 했는데도 멈추지 않는 것"이다. 카페 선택지에서 갸더는 취향 자체는 존중한다고 말한다.
- 요정은 싫다고 하면 바로 물러난다. 카페와 주차장에서 그 대비가 짧은 내레이션으로 나온다.
- 인물과 차량은 실루엣(CSS)으로만 표현하고, 사고는 소리와 암전으로만 처리한다. 글리치나 흔들림은 쓰지 않는다.
