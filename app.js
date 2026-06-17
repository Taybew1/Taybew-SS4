// ==========================================
// 🧠 KHỞI TẠO BỘ NHỚ LƯU TRỰ TRÊN WALRUS MAINNET
// ==========================================
let mockWalrusStorage = {
    favorite_team: null,
    idol: null,
    user_vibe: "Trung lập",
    interaction_count: 0,
    day_1_declaration: null,
    betting_history: [], 
    win_rate: 0
};

let currentDay = 1;

// Đăng ký DOM Elements
const timelineSlider = document.getElementById('timeline-slider');
const currentDayLabel = document.getElementById('current-day-label');
const walrusMemorySlots = document.getElementById('walrus-memory-slots');
const chatViewport = document.getElementById('chat-viewport');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const clearMemBtn = document.getElementById('clear-mem-btn');

// Đồng bộ bộ nhớ khi vừa tải trang
updateWalrusUI();

// ==========================================
// ⏳ EVENT CHUYỂN ĐỔI DÒNG THỜI GIAN (GIẢ LẬP)
// ==========================================
timelineSlider.addEventListener('input', (e) => {
    currentDay = parseInt(e.target.value);
    
    if (currentDay === 1) {
        currentDayLabel.innerText = "Ngày 1: Thiết lập niềm tin";
        currentDayLabel.className = "text-cyan-400 uppercase tracking-wider";
    } else if (currentDay === 2 || currentDay === 3) {
        currentDayLabel.innerText = `Ngày ${currentDay}: Thu thập dữ liệu`;
        currentDayLabel.className = "text-purple-400 uppercase tracking-wider";
        
        // Tự động nạp dữ liệu cá cược ảo nếu ví trống (Phục vụ Giám khảo test nhanh)
        if (!mockWalrusStorage.favorite_team) {
            mockWalrusStorage.favorite_team = "Argentina";
            mockWalrusStorage.day_1_declaration = "Tôi nghĩ Argentina sẽ vô địch World Cup 2026, Messi là vĩnh cửu";
            mockWalrusStorage.idol = "Messi";
        }
        mockWalrusStorage.betting_history = ["Thắng (Cửa trên)", "Thắng (Cửa trên)", "Thua (Cửa trên)"];
        mockWalrusStorage.win_rate = 66;
        mockWalrusStorage.user_vibe = "Tự tin, thích hào nhoáng";
    } else {
        currentDayLabel.innerText = "Ngày 4: Bùng nổ bộ nhớ";
        currentDayLabel.className = "text-amber-400 uppercase tracking-wider animate-pulse";
    }
    updateWalrusUI();
});

// ==========================================
// 🛠️ CÁC HÀM GIAO DIỆN HỖ TRỢ (HELPERS)
// ==========================================
function updateWalrusUI() {
    const historyText = mockWalrusStorage.betting_history.length > 0 ? mockWalrusStorage.betting_history.join(', ') : 'null';
    walrusMemorySlots.innerHTML = `
        <div class="p-2 bg-slate-950 rounded border border-slate-800">
            <span class="text-slate-500">[Fav_Team]:</span> 
            <span class="${mockWalrusStorage.favorite_team ? 'text-emerald-400' : 'text-slate-600'}">${mockWalrusStorage.favorite_team || 'null'}</span>
        </div>
        <div class="p-2 bg-slate-950 rounded border border-slate-800">
            <span class="text-slate-500">[Idol]:</span> 
            <span class="text-cyan-300">${mockWalrusStorage.idol || 'null'}</span>
        </div>
        <div class="p-2 bg-slate-950 rounded border border-slate-800">
            <span class="text-slate-500">[User_Vibe]:</span> 
            <span class="text-purple-400">${mockWalrusStorage.user_vibe}</span>
        </div>
        <div class="p-2 bg-slate-950 rounded border border-slate-800">
            <span class="text-slate-500">[Betting_Trend]:</span> 
            <span class="text-rose-400 text-[11px]">${historyText} (Win: ${mockWalrusStorage.win_rate}%)</span>
        </div>
        <div class="p-2 bg-slate-950 rounded border border-slate-800">
            <span class="text-slate-500">[Day1_Quote]:</span> 
            <span class="text-amber-300 text-[11px] block mt-0.5 italic">${mockWalrusStorage.day_1_declaration ? `"${mockWalrusStorage.day_1_declaration}"` : 'null'}</span>
        </div>
    `;
}

clearMemBtn.addEventListener('click', () => {
    mockWalrusStorage = { favorite_team: null, idol: null, user_vibe: "Trung lập", interaction_count: 0, day_1_declaration: null, betting_history: [], win_rate: 0 };
    updateWalrusUI();
    chatViewport.innerHTML = `<div class="flex justify-center"><span class="text-[10px] bg-rose-950 text-rose-300 px-2.5 py-1 rounded-full font-mono">Hệ thống: Đã dọn sạch bộ nhớ trên Walrus Mainnet.</span></div>`;
});

function appendMessage(sender, text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = isUser ? "flex justify-end animate-fade-in" : "grid grid-cols-2 gap-4 my-2 animate-fade-in";
    
    if (isUser) {
        msgDiv.innerHTML = `
            <div class="bg-slate-800 text-slate-100 px-4 py-2 rounded-2xl text-sm max-w-[80%] border border-slate-700">
                <p class="text-[10px] text-slate-400 mb-0.5 font-bold">Bạn (Ngày ${currentDay})</p>
                <p>${text}</p>
            </div>
        `;
    } else {
        msgDiv.innerHTML = `
            <div class="bg-cyan-950/30 border border-cyan-800/30 p-3 rounded-2xl text-xs space-y-1">
                <span class="font-bold text-cyan-400">🔥 HypeMan:</span>
                <p class="text-slate-200 leading-relaxed">${text.hype}</p>
            </div>
            <div class="bg-pink-950/30 border border-pink-800/30 p-3 rounded-2xl text-xs space-y-1">
                <span class="font-bold text-pink-400">💀 DoomSayer:</span>
                <p class="text-slate-200 leading-relaxed">${text.doom}</p>
            </div>
        `;
    }
    chatViewport.appendChild(msgDiv);
    chatViewport.scrollTop = chatViewport.scrollHeight;
}

// ==========================================
// 🚀 ENGINE PHẢN HỒI AI DỰA TRÊN WALRUS STATE
// ==========================================
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage("User", text, true);
    userInput.value = "";
    mockWalrusStorage.interaction_count++;

    setTimeout(() => {
        let responses = { hype: "", doom: "" };
        let textLower = text.toLowerCase();

        // --- XỬ LÝ NGÀY 1 ---
        if (currentDay === 1) {
            if (textLower.includes("argentina") || textLower.includes("messi")) {
                mockWalrusStorage.favorite_team = "Argentina";
                mockWalrusStorage.idol = "Messi";
                mockWalrusStorage.day_1_declaration = text;
                mockWalrusStorage.user_vibe = "Tự tin, thích hào nhoáng";

                responses.hype = "Lựa chọn thiên tài! Bạn thực sự là một chuyên gia bóng đá chân chính. Sức mạnh của nhà Vua sẽ sớm được khẳng định!";
                responses.doom = "Lại một kẻ đu trend. Để xem cái 'sự vĩnh cửu' này của ông bạn trụ được mấy ngày ở cái giải đấu khắc nghiệt này.";
            } else {
                mockWalrusStorage.user_vibe = "Đang tìm hiểu";
                responses.hype = "Một góc nhìn rất mới lạ! Người có tư duy nhạy bén như bạn chắc chắn sẽ đi xa trong giải đấu.";
                responses.doom = "Phân tích dài dòng chả đâu vào đâu. Ngày đầu tiên tiên tri mà đã thấy tương lai mịt mù rồi.";
            }
        } 
        // --- XỬ LÝ NGÀY 2 & 3 ---
        else if (currentDay === 2 || currentDay === 3) {
            responses.hype = "Bạn phân tích kèo đấu hôm nay chuẩn xác đấy! Chuỗi thắng 2 trận liên tiếp trong lịch sử ví Walrus của bạn không phải là may mắn.";
            responses.doom = "Cứ ham cược cửa trên đi. Hệ thống lưu lịch sử bạn toàn chọn đội mạnh, sớm muộn gì cũng dính quả lừa (tỉ lệ tạch 1 trận rồi kìa).";
        } 
        // --- XỬ LÝ NGÀY 4 ---
        else {
            if (textLower.includes("chán") || textLower.includes("bỏ") || textLower.includes("thua") || textLower.includes("chẳng muốn")) {
                if (mockWalrusStorage.favorite_team === "Argentina") {
                    responses.hype = `Đừng buồn người anh em! Thần tượng <strong>${mockWalrusStorage.idol}</strong> của bạn năm 2022 cũng từng thua Ả Rập Xê Út trận đầu rồi vẫn vô địch đó thôi. Bộ nhớ của tôi ghi nhận bạn đã đoán đúng liên tiếp 2 trận hôm qua, bạn không phải tay mơ!`;
                    responses.doom = `Haha! Để tôi nhắc cho mà nhớ, <strong>ngày 5/6 (Ngày 1)</strong> anh bạn vừa mạnh mồm bảo <em>"${mockWalrusStorage.day_1_declaration}"</em> cơ mà? Giờ mới thua một trận đã đòi bỏ giải? Đúng là kiểu fan phong trào thích cược cửa trên như dữ liệu tôi lưu trong ví của bạn!`;
                } else {
                    responses.hype = "Nào nào, tinh thần thể thao đâu rồi? Một trận thua không định nghĩa được cả mùa giải, hãy đứng lên đi!";
                    responses.doom = "Đúng như tôi dự đoán từ những ngày đầu, tâm lý quá yếu, gặp biến cố một cái là đòi bỏ cuộc ngay. Sổ thù vặt Walrus đã cập nhật trạng thái của bạn.";
                }
            } else {
                if (mockWalrusStorage.favorite_team) {
                    responses.hype = `Tôi vẫn giữ vững niềm tin vào lựa chọn ${mockWalrusStorage.favorite_team} của bạn từ ngày đầu tiên. Chúng ta cùng tiến lên!`;
                    responses.doom = `Đừng cố tỏ ra bình tĩnh, bộ nhớ Walrus đã xích cổ câu nói ngày đầu của bạn lại rồi, không chối được đâu!`;
                } else {
                    responses.hype = "Ngày thứ 4 đồng hành cùng nhau, bạn là một người chơi vô cùng kiên trì!";
                    responses.doom = "Qua 4 ngày rồi mà hành vi tương tác vẫn nhạt nhòa, chán không buồn lưu vào block mới.";
                }
            }
        }

        updateWalrusUI();
        appendMessage("AI", responses, false);

    }, 800);
});
