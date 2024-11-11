const frontImage = 'image/問號.png'; // 統一正面圖片路徑

// 版本 1 背面圖片
const backImagesVersion1 = [
    'ani1.png',
    'ani2.png',
    'ani3.png',
    'ani4.png',
    'ani5.png',
    'ani6.png',
    'ani7.png',
    'ani8.png'
];

// 版本 2 背面圖片
const backImagesVersion2 = [
    'p1.png',
    'p2.png',
    'p3.png',
    'p4.png',
    'p5.png',
    'p6.png',
    'p7.png',
    'p8.png'
];

let selectedBackImages = [];
let startTime = null; // 計時開始時間
let flipCount = 0; // 記錄翻牌次數
let flippedCards = []; // 已翻開的卡片

document.getElementById('version1').addEventListener('click', () => {
    selectedBackImages = backImagesVersion1;
    startGame();
});

document.getElementById('version2').addEventListener('click', () => {
    selectedBackImages = backImagesVersion2;
    startGame();
});

function startGame() {
    document.getElementById('versionSelection').style.display = 'none';
    document.querySelector('.button-container').style.display = 'flex';
    document.getElementById('cardContainer').style.display = 'grid';

    const doubledBackImages = selectedBackImages.flatMap(image => [image, image]);
    const shuffledBackImages = shuffle(doubledBackImages);

    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ''; // 清空之前的卡牌
    const cards = [];

    // 隨機排列卡牌
    shuffledBackImages.forEach((backImage) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = backImage; // 將背面圖片作為數據屬性儲存

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="${frontImage}" alt="前面">
                </div>
                <div class="card-back">
                    <img src="${backImage}" alt="背面">
                </div>
            </div>
        `;

        card.addEventListener('click', () => handleCardFlip(card, cards)); // 點擊處理翻牌事件

        cards.push(card);
        cardContainer.appendChild(card);
    });

    // 先展示背面3秒，然後翻回正面並開始計時
    showBackThenFront(cards, 3);
}

// 展示背面3秒後翻回正面並開始計時
function showBackThenFront(cards, backTime) {
    // 先顯示背面
    cards.forEach(card => card.classList.add('flipped'));

    // 倒數 3 秒後翻回正面並開始計時
    setTimeout(() => {
        cards.forEach(card => card.classList.remove('flipped'));
        startTimer(); // 開始計時
    }, backTime * 1000);
}

// 處理翻牌邏輯
function handleCardFlip(card, cards) {
    if (card.classList.contains('flipped') || flippedCards.length === 2) {
        return; // 防止翻開已經翻過的卡牌或兩張卡牌同時翻開
    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        flipCount++; // 記錄翻牌次數
        checkMatch(cards); // 檢查是否匹配
    }
}

// 檢查兩張翻開的卡牌是否匹配
function checkMatch(cards) {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.image === secondCard.dataset.image) {
        flippedCards = []; // 匹配成功，重置已翻開的卡片數組
        checkAllFlipped(cards); // 檢查是否所有卡片都已翻開
    } else {
        // 如果不匹配，延遲一秒後翻回去
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            flippedCards = []; // 重置已翻開的卡片數組
        }, 1000);
    }
}

// 檢查是否所有卡牌都翻完
function checkAllFlipped(cards) {
    if (cards.every(card => card.classList.contains('flipped'))) {
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        alert(`你完成了！總用時：${totalTime} 秒，翻牌次數：${flipCount}`);
        document.getElementById('gameTimer').remove(); // 停止計時
    }
}

// 開始計時並顯示在側邊
function startTimer() {
    startTime = Date.now();
    const timerElement = document.createElement('div');
    timerElement.id = 'gameTimer';
    timerElement.style.position = 'fixed';
    timerElement.style.right = '20px';
    timerElement.style.top = '20px';
    document.body.appendChild(timerElement);

    const timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerElement.textContent = `已經過時間：${elapsed} 秒`;
    }, 1000);
}

// 隨機打亂圖片順序的函數
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 離開遊戲按鈕：返回版本選擇畫面
document.getElementById('exitGame').addEventListener('click', () => {
    resetGame(); // 重置遊戲
});

// 重置遊戲，返回到版本選擇畫面
function resetGame() {
    // 隱藏遊戲畫面
    document.getElementById('cardContainer').style.display = 'none';
    document.querySelector('.button-container').style.display = 'none';

    // 顯示版本選擇畫面
    document.getElementById('versionSelection').style.display = 'block';

    // 清除計時器
    const timerElement = document.getElementById('gameTimer');
    if (timerElement) {
        timerElement.remove();
    }

    // 重置翻牌次數和翻牌狀態
    flipCount = 0;
    flippedCards = [];
}
