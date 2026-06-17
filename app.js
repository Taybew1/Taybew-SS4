// ==========================================
// 🧠 INITIALIZE WALRUS MAINNET STORAGE STATE
// ==========================================
let mockWalrusStorage = {
    favorite_team: null,
    idol: null,
    user_vibe: "Neutral",
    interaction_count: 0,
    day_1_declaration: null,
    betting_history: [], 
    win_rate: 0
};

let currentDay = 1;

// DOM Registrations
const timelineSlider = document.getElementById('timeline-slider');
const currentDayLabel = document.getElementById('current-day-label');
const walrusMemorySlots = document.getElementById('walrus-memory-slots');
const chatViewport = document.getElementById('chat-viewport');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const clearMemBtn = document.getElementById('clear-mem-btn');

// Sync UI Storage on load
updateWalrusUI();

// ==========================================
// ⏳ TIME-WARP TIMELINE LISTENER
// ==========================================
timelineSlider.addEventListener('input', (e) => {
    currentDay = parseInt(e.target.value);
    
    if (currentDay === 1) {
        currentDayLabel.innerText = "Day 1: Trust Setup";
        currentDayLabel.className = "text-cyan-400 uppercase tracking-wider";
    } else if (currentDay === 2 || currentDay === 3) {
        currentDayLabel.innerText = `Day ${currentDay}: Data Collection`;
        currentDayLabel.className = "text-purple-400 uppercase tracking-wider";
        
        // Auto mock betting history if empty for quick judging evaluation
        if (!mockWalrusStorage.favorite_team) {
            mockWalrusStorage.favorite_team = "Argentina";
            mockWalrusStorage.day_1_declaration = "I think Argentina will win World Cup 2026, Messi is eternal";
            mockWalrusStorage.idol = "Messi";
        }
        mockWalrusStorage.betting_history = ["Win (Favorite)", "Win (Favorite)", "Loss (Favorite)"];
        mockWalrusStorage.win_rate = 66;
        mockWalrusStorage.user_vibe = "Confident, Hype-driven";
    } else {
        currentDayLabel.innerText = "Day 4: Memory Explosion";
        currentDayLabel.className = "text-amber-400 uppercase tracking-wider animate-pulse";
    }
    updateWalrusUI();
});

// ==========================================
// 🛠️ UI RENDER HELPERS
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
    mockWalrusStorage = { favorite_team: null, idol: null, user_vibe: "Neutral", interaction_count: 0, day_1_declaration: null, betting_history: [], win_rate: 0 };
    updateWalrusUI();
    chatViewport.innerHTML = `<div class="flex justify-center"><span class="text-[10px] bg-rose-950 text-rose-300 px-2.5 py-1 rounded-full font-mono">System: Walrus persistent state cleared.</span></div>`;
});

function appendMessage(sender, text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = isUser ? "flex justify-end animate-fade-in" : "grid grid-cols-2 gap-4 my-2 animate-fade-in";
    
    if (isUser) {
        msgDiv.innerHTML = `
            <div class="bg-slate-800 text-slate-100 px-4 py-2 rounded-2xl text-sm max-w-[80%] border border-slate-700">
                <p class="text-[10px] text-slate-400 mb-0.5 font-bold">You (Day ${currentDay})</p>
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
// 🚀 DYNAMIC WALRUS-BASED RESPONSE ENGINE
// ==========================================
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage("User", text, true);
    userInput.value = "";
    mockWalrusStorage.interaction_count++;

    // Simulating AI thinking delay (800ms)
    setTimeout(() => {
        let responses = { hype: "", doom: "" };
        let textLower = text.toLowerCase();

        // --- DAY 1 ENGINE ---
        if (currentDay === 1) {
            if (textLower.includes("argentina") || textLower.includes("messi")) {
                mockWalrusStorage.favorite_team = "Argentina";
                mockWalrusStorage.idol = "Messi";
                mockWalrusStorage.day_1_declaration = text;
                mockWalrusStorage.user_vibe = "Confident, Hype-driven";

                responses.hype = "Absolute genius choice! You truly possess the eyes of a master football tactician. The champion aura of the King will shine through!";
                responses.doom = "Ugh, another textbook trend-chaser. Let's see how many days your so-called 'eternal greatness' survives in this ruthless tournament.";
            } else {
                mockWalrusStorage.user_vibe = "Exploring";
                responses.hype = "What a highly sophisticated and fresh take! A sharp mind like yours will surely conquer the predictions leaderboard.";
                responses.doom = "Blah blah blah, generic analysis. Day 1 and I can already foresee your prediction portfolio tanking.";
            }
        } 
        // --- DAY 2 & 3 ENGINE ---
        else if (currentDay === 2 || currentDay === 3) {
            responses.hype = "Spot on match analysis today! Your consecutive 2-game winning streak stored in Walrus history is definitely not a fluke.";
            responses.doom = "Keep blind-betting on the heavy favorites. Your stored history shows you only chase big names; a brutal upset is coming for you.";
        } 
        // --- DAY 4 ENGINE (MEMORY RETRIEVAL BUNG NỔ) ---
        else {
            if (textLower.includes("bored") || textLower.includes("give up") || textLower.includes("lose") || textLower.includes("chán") || textLower.includes("don't want")) {
                if (mockWalrusStorage.favorite_team === "Argentina") {
                    responses.hype = `Keep your chin up, brother! Your idol <strong>${mockWalrusStorage.idol}</strong> also lost to Saudi Arabia in the 2022 opener before lifting the golden trophy. My data stream shows you hit a 2-game win streak yesterday, you are no amateur!`;
                    responses.doom = `Haha! Classic! Let me pull up the Walrus logs: back on <strong>Day 1</strong>, didn't you proudly state: <em>"${mockWalrusStorage.day_1_declaration}"</em>? One rough match and you're already throwing in the towel? Pure bandwagon behavior, fully matching your favorite-chasing stats!`;
                } else {
                    responses.hype = "Hey, where is that sportsmanship? One bad day doesn't define the tournament, get back on your feet!";
                    responses.doom = "Predictable. Just as I logged on Day 1, zero emotional resilience. One minor setback and you fold instantly. Walrus block state updated.";
                }
            } else {
                if (mockWalrusStorage.favorite_team) {
                    responses.hype = `No matter what, I stand firmly by your Day 1 loyalty to ${mockWalrusStorage.favorite_team}. Let's secure the next win!`;
                    responses.doom = `Don't try to change the subject. Walrus immutable memory has permanently anchored your Day 1 ${mockWalrusStorage.favorite_team} declaration. No escaping past facts!`;
                } else {
                    responses.hype = "Day 4 of our journey together! You've been an incredibly consistent player.";
                    responses.doom = "Four days in and your behavioral footprint is still completely bland. Not even worth committing to a new block.";
                }
            }
        }

        updateWalrusUI();
        appendMessage("AI", responses, false);

    }, 800);
});
