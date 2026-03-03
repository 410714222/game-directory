// 核心變數 (只宣告一次)
let currentGameData = [];

// 1. 核心載入函數
async function loadData(target) {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '<div style="color:#00f2ff; padding:20px; font-family:Orbitron;">SYSTEM LOADING...</div>';

    try {
        let finalData = [];
        const timestamp = new Date().getTime(); 

        if (target === 'all') {
            const files = ['data1.json', 'data2.json', 'data3.json', 'data4.json', 'data5.json', 'data6.json'];
            const promises = files.map(file => 
                fetch(`${file}?v=${timestamp}`).then(res => {
                    if (!res.ok) throw new Error(`找不到 ${file}`);
                    return res.json();
                })
            );
            const results = await Promise.all(promises);
            finalData = results.flat(); 
        } else {
            const response = await fetch(`${target}?v=${timestamp}`);
            if (!response.ok) throw new Error(`找不到 ${target}`);
            finalData = await response.json();
        }

        currentGameData = finalData;
        renderGames(currentGameData);
    } catch (error) {
        grid.innerHTML = `<div style="color:red; padding:20px;">ERROR: ${error.message}</div>`;
        console.error(error);
    }
}

// 2. 渲染卡片
function renderGames(data) {
    const grid = document.getElementById('game-grid');
    if (!data || data.length === 0) {
        grid.innerHTML = '<div style="color:white; padding:20px;">無資料</div>';
        return;
    }

    grid.innerHTML = data.map(game => `
        <div class="game-card" data-id="${game.id}">
            <img src="${game.img}" onerror="this.src='https://via.placeholder.com/300?text=Image+Error'">
            <div class="card-body">
                <h3>${game.title}</h3>
                <div class="tag">${Array.isArray(game.category) ? game.category.map(c => `#${c}`).join(' ') : `#${game.category}`}</div>
            </div>
        </div>
    `).join('');

    // 為每張卡片綁定點擊事件
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => openModal(card.dataset.id));
    });
}

// 3. 視窗控制
function openModal(id) {
    const game = currentGameData.find(g => g.id == id);
    if (!game) return;
    
    document.getElementById('modal-title').innerText = game.title;
    document.getElementById('modal-desc').innerText = game.desc || "暫無介紹";
    document.getElementById('modal-video').src = game.video;
    document.getElementById('game-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 綁定關閉按鈕事件 (假設你的關閉按鈕 class 是 close-btn)
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('game-modal').style.display = 'none';
    document.getElementById('modal-video').src = "";
    document.body.style.overflow = 'auto';
});

// 4. 初始化：綁定導覽列按鈕事件
document.addEventListener('DOMContentLoaded', () => {
    // 監聽導覽列點擊
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadData(btn.dataset.file);
        });
    });

    // 預設載入全部
    loadData('all');
});
