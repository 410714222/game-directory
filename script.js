let currentGameData = [];

// 這個函數現在同時負責「單一分類」與「全部顯示」
async function loadData(target, event) {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '<div style="color:var(--neon-cyan); padding:20px;">SYSTEM LOADING...</div>';

    // 處理按鈕高亮
    if (event) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }

    try {
        let finalData = [];
        const timestamp = new Date().getTime(); 

        if (target === 'all') {
            // 合併 5 個檔案的邏輯
            const files = ['data1.json', 'data2.json', 'data3.json', 'data4.json', 'data5.json', 'data6.json'];
            const promises = files.map(file => fetch(`${file}?v=${timestamp}`).then(res => res.json()));
            const results = await Promise.all(promises);
            finalData = results.flat(); 
        } else {
            // 單一檔案邏輯
            const response = await fetch(`${target}?v=${timestamp}`);
            finalData = await response.json();
        }

        currentGameData = finalData;
        renderGames(currentGameData);
    } catch (error) {
        grid.innerHTML = `<div style="color:red; padding:20px;">ERROR: 資料讀取失敗</div>`;
    }
}

// 渲染畫面
function renderGames(data) {
    const grid = document.getElementById('game-grid');
    if (data.length === 0) {
        grid.innerHTML = '<div style="color:white; padding:20px;">無資料</div>';
        return;
    }

    grid.innerHTML = data.map(game => `
        <div class="game-card" onclick="openModal(${game.id})">
            <img src="${game.img}" onerror="this.src='https://via.placeholder.com/300?text=Image+Error'">
            <div class="card-body">
                <h3>${game.title}</h3>
                <div class="tag">${Array.isArray(game.category) ? game.category.map(c => `#${c}`).join(' ') : `#${game.category}`}</div>
            </div>
        </div>
    `).join('');
}

// Modal 控制 (保持原樣)
function openModal(id) {
    const game = currentGameData.find(g => g.id === id);
    if (!game) return;
    document.getElementById('modal-title').innerText = game.title;
    document.getElementById('modal-desc').innerText = game.desc;
    document.getElementById('modal-video').src = game.video;
    document.getElementById('game-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('game-modal').style.display = 'none';
    document.getElementById('modal-video').src = "";
}

// 預設載入全部
window.onload = () => loadData('all');


