
const STORAGE_KEY = "ggomyangTarotDailyResult.v1";
const DAY_KEY = "ggomyangTarotDailyDate.v1";

const introView = document.querySelector("#introView");
const shuffleView = document.querySelector("#shuffleView");
const resultView = document.querySelector("#resultView");
const drawButton = document.querySelector("#drawButton");
const mainDrawButton = document.querySelector("#mainDrawButton");
const restoreButton = document.querySelector("#restoreButton");
const shareButton = document.querySelector("#shareButton");
const resetButton = document.querySelector("#resetButton");

function getKoreanDateKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function getSavedResult() {
  const savedDay = localStorage.getItem(DAY_KEY);
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw || savedDay !== getKoreanDateKey()) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DAY_KEY);
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DAY_KEY);
    return null;
  }
}

function saveResult(result) {
  localStorage.setItem(DAY_KEY, getKoreanDateKey());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

function randomIndex(max) {
  if (window.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function drawResult() {
  const cardId = randomIndex(window.TAROT_CARDS.length);
  const orientation = randomIndex(2) === 0 ? "upright" : "reversed";
  return { cardId, orientation };
}

function showOnly(view) {
  [introView, shuffleView, resultView].forEach((el) => el.classList.add("hidden"));
  view.classList.remove("hidden");
}

function renderResult(result) {
  const card = window.TAROT_CARDS[result.cardId];
  const reading = card[result.orientation];
  const isReversed = result.orientation === "reversed";

  document.querySelector("#cardNumber").textContent = card.number;
  document.querySelector("#cardNameEn").textContent = card.nameEn;
  document.querySelector("#cardNameKo").textContent = card.nameKo;
  document.querySelector("#orientationBadge").textContent = isReversed ? "역방향" : "정방향";
  document.querySelector("#openingLine").textContent = reading.opening;
  document.querySelector("#readingText").textContent = reading.reading;
  document.querySelector("#cautionText").textContent = reading.caution;
  document.querySelector("#luckyColor").textContent = reading.lucky.color;
  document.querySelector("#luckyNumber").textContent = reading.lucky.number;
  document.querySelector("#luckyItem").textContent = reading.lucky.item;
  document.querySelector("#catLine").textContent = reading.catLine;

  const keywordList = document.querySelector("#keywordList");
  keywordList.replaceChildren(
    ...reading.keywords.map((keyword) => {
      const chip = document.createElement("span");
      chip.textContent = keyword;
      return chip;
    })
  );

  const tarotCard = document.querySelector("#tarotCard");
  tarotCard.classList.toggle("reversed", isReversed);

  const image = document.querySelector("#cardImage");
  const fallback = document.querySelector("#cardFallback");
  image.classList.add("hidden");
  fallback.classList.remove("hidden");
  image.alt = `${card.nameKo} 타로 카드`;
  image.onload = () => {
    image.classList.remove("hidden");
    fallback.classList.add("hidden");
  };
  image.onerror = () => {
    image.classList.add("hidden");
    fallback.classList.remove("hidden");
  };
  image.src = card.image;

  showOnly(resultView);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function handleDraw() {
  const existing = getSavedResult();
  if (existing) {
    renderResult(existing);
    return;
  }

  showOnly(shuffleView);
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const result = drawResult();
  saveResult(result);
  renderResult(result);
}

async function shareResult() {
  const saved = getSavedResult();
  if (!saved) return;

  const card = window.TAROT_CARDS[saved.cardId];
  const direction = saved.orientation === "upright" ? "정방향" : "역방향";
  const text = `오늘의 꼼양 타로: ${card.nameKo} (${direction})`;

  try {
    if (navigator.share) {
      await navigator.share({ title: "꼼양 타로", text, url: location.href });
    } else {
      await navigator.clipboard.writeText(`${text}\n${location.href}`);
      shareButton.textContent = "링크를 복사했어요";
      setTimeout(() => (shareButton.textContent = "결과 공유하기"), 1800);
    }
  } catch (error) {
    if (error?.name !== "AbortError") {
      alert("공유하지 못했어요. 주소를 직접 복사해 주세요.");
    }
  }
}

function resetForTesting() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DAY_KEY);
  location.reload();
}

drawButton.addEventListener("click", handleDraw);
restoreButton.addEventListener("click", () => {
  const result = getSavedResult();
  if (result) renderResult(result);
});
shareButton.addEventListener("click", shareResult);
resetButton.addEventListener("click", resetForTesting);

const saved = getSavedResult();
if (saved) {
  restoreButton.classList.remove("hidden");
  drawButton.querySelector("span").textContent = "오늘의 카드 확인하기";
  drawButton.querySelector("small").textContent = "이미 뽑은 결과가 있어요";
}
