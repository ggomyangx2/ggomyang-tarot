# 꼼양 타로 - GitHub Pages용 오늘의 운세

모바일 우선으로 만든 정적 웹사이트입니다. 서버와 데이터베이스 없이 GitHub Pages에서 무료로 실행할 수 있습니다.

## 포함 기능

- 78장 타로 카드
- 정방향 / 역방향 랜덤 선택
- 카드별 키워드, 리딩, 주의점, 행운 포인트, 꼼양 한마디
- 한국 시간 기준 하루 1회 결과 저장
- 결과 공유
- 카드 이미지가 없을 때 자동 대체 화면
- 모바일 반응형 UI

## 바로 실행하기

1. 압축을 풉니다.
2. `index.html`, `style.css`, `app.js`, `tarot-data.js`, `assets` 폴더를 GitHub 저장소 최상위에 올립니다.
3. GitHub 저장소에서 `Settings → Pages`로 이동합니다.
4. `Deploy from a branch`를 선택합니다.
5. Branch는 `main`, 폴더는 `/(root)`를 선택하고 저장합니다.
6. 잠시 후 `https://사용자이름.github.io/저장소이름/` 주소로 접속합니다.

## 카드 이미지 넣기

`assets/cards/` 폴더에 카드 이미지를 넣으면 자동으로 표시됩니다.

필요한 파일명은 `tarot-data.js` 안의 각 카드 `image` 값과 같습니다.

예시:

- `00-the-fool.webp`
- `01-the-magician.webp`
- `02-the-high-priestess.webp`

WebP를 권장하지만, PNG나 JPG를 사용할 경우 `tarot-data.js`의 확장자도 함께 바꿔주세요.

## 하루 1회 제한 방식

브라우저의 `localStorage`를 사용합니다. 같은 브라우저에서는 한국 시간 기준 날짜가 바뀔 때까지 같은 결과가 유지됩니다.

이 방식은 가벼운 정적 사이트에 적합하지만, 사용자가 브라우저 데이터를 삭제하거나 다른 기기를 사용하면 다시 뽑을 수 있습니다. 완전한 계정 단위 제한이 필요하면 로그인과 데이터베이스가 필요합니다.

## 운영 전 수정 권장

- `tarot-data.js`의 마이너 아르카나 리딩은 동일한 슈트의 공통 문장을 기반으로 작성했습니다.
- 실제 서비스 공개 전에는 각 카드의 개성을 살린 문장으로 한 번 더 다듬는 것을 권장합니다.
- 테스트가 끝나면 `index.html`의 “테스트용 기록 초기화” 버튼을 삭제하거나 숨겨주세요.

## 파일 구조

```text
ggomyang-tarot-site/
├─ index.html
├─ style.css
├─ app.js
├─ tarot-data.js
├─ README.md
└─ assets/
   └─ cards/
      └─ 카드 이미지 파일
```
