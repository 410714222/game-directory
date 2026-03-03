let currentGameData = [];

// 統一的載入函數
async function loadData(target, event) {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '<div style="color:var(--neon-cyan); padding:20px;">SYSTEM LOADING...</div>';

    // 1. 處理按鈕切換效果
    if (event) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }

    try {
        let finalData = [];
        const timestamp = new Date().getTime(); // 防止快取

        if (target === 'all') {
            // 如果是點擊「全部」，同時抓取 5 個檔案
            const files = ['data1.json', 'data2.json', 'data3.json', 'data4.json', 'data5.json'];
            const promises = files.map(file => fetch(`${file}?v=${timestamp}`).then(res => {
                if (!res.ok) throw new Error(`找不到 ${file}`);
                return res.json();
            }));
            const results = await Promise.all(promises);
            finalData = results.flat(); // 合併陣列
        } else {
            // 如果是點擊單一分類
            const response = await fetch(`${target}?v=${timestamp}`);
            if (!response.ok) throw new Error(`找不到檔案: ${target}`);
            finalData = await response.json();
        }

        currentGameData = finalData;
        renderGames(currentGameData);
        console.log("資料載入成功:", target);

    } catch (error) {
        grid.innerHTML = `<div style="color:red; padding:20px;">ERROR: ${error.message}</div>`;
        console.error(error);
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
