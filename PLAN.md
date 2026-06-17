# HypeMan & DoomSayer — Development Plan

Walrus Sessions 4 · Walrus Memory World Cup · Deadline: **June 24, 2026**

This document is the execution plan for taking the current frontend MVP to a **mainnet-ready hackathon submission** with real Walrus Memory via MemWal.

---

## Project credentials (Sessions wallet)

| Item | Value |
|------|-------|
| **MemWalAccount ID** | `0x31bd4294b5360ea1f5b4bc205493bad2edc97714e5bef612e6d2c28ae99e8627` |
| **SuiScan (mainnet)** | https://suiscan.xyz/mainnet/object/0x31bd4294b5360ea1f5b4bc205493bad2edc97714e5bef612e6d2c28ae99e8627 |
| **Delegate public key** | `99c65409e0673b801d0b2b972910b6f1b906699d20bed78c6a6bdfd7a69f922b` |
| **Delegate private key** | Store in `MEMWAL_PRIVATE_KEY` env var only — **never commit** |

> The delegate **private key** is required for server-side MemWal calls. The public key above is for verification and dashboard cross-check only.

---

## Current state

| Area | Status |
|------|--------|
| UI (dual agents, timeline slider, brain panel) | Done |
| Google OAuth | Done |
| Agent logic (Day 1 → Day 4 memory callbacks) | Done (rule-based) |
| Walrus / MemWal persistence | **Mock only** (`mockWalrusStorage` in browser) |
| Server API layer | Not started |
| Production deploy + demo video | Not started |
| Hackathon forms (Airtable, DeepSurge, #Walrus) | Not started |

---

## Target architecture

```
Browser (index.html + app.js)
    │
    │  POST /api/memory/load
    │  POST /api/memory/save
    │  POST /api/chat
    ▼
Serverless API (Vercel / Cloudflare Workers)
    │
    │  MemWal.create({ key, accountId, serverUrl, namespace })
    ▼
Walrus Mainnet via managed relayer
    https://relayer.memwal.ai
```

**Why a backend is required:** MemWal delegate keys must never ship to the browser. All `remember()` / `recall()` / profile reads run server-side with per-user namespaces.

**Namespace pattern:** `hypeman-{googleSub}` or `hypeman-{suiAddress}` — one isolated memory space per fan.

---

## Phases

### Phase 1 — Backend scaffold (Day 1)

**Goal:** MemWal health check passes on mainnet from deploy.

- [ ] Add `api/` serverless routes (Vercel Functions or similar)
- [ ] Configure env vars: `MEMWAL_PRIVATE_KEY`, `MEMWAL_ACCOUNT_ID`, `MEMWAL_SERVER_URL`
- [ ] Implement `GET /api/health` → `memwal.health()`
- [ ] Add `.env.example` (no secrets)
- [ ] Add `.gitignore` for `.env`, `.env.local`

**Done when:** Deploy logs show `MemWal 🟢 LIVE` and SuiScan account is linked in README.

---

### Phase 2 — Memory persistence (Day 2)

**Goal:** Replace `mockWalrusStorage` with Walrus-backed read/write.

- [ ] Define `FAN_PROFILE_JSON` schema (structured state):

  ```json
  {
    "favorite_team": null,
    "idol": null,
    "user_vibe": "Neutral",
    "interaction_count": 0,
    "day_1_declaration": null,
    "betting_history": [],
    "win_rate": 0
  }
  ```

- [ ] `POST /api/memory/load` — load profile from MemWal namespace
- [ ] `POST /api/memory/save` — upsert profile + fire-and-forget semantic lines
- [ ] Semantic `remember()` lines for chat turns, e.g.:
  - `"Day 1 declaration: I think Argentina will win…"`
  - `"User wavered on Day 4: I'm bored…"`
- [ ] `recall()` on Day 4 messages to pull relevant past statements
- [ ] Wire `app.js` to call API instead of mutating local mock object
- [ ] Keep timeline slider as **simulated day** input; persistence stays real

**Done when:** Refresh browser → Walrus Brain State reloads from MemWal; wipe button clears namespace.

---

### Phase 3 — UI polish & judge path (Day 3)

**Goal:** Submission-ready demo surface.

- [ ] Show MemWalAccount link + live status badge in header
- [ ] Replace placeholder wallet `0xwalrus...7b92a` with Sessions wallet address
- [ ] Optional: Sui wallet connect for namespace key (Google sub works for MVP)
- [ ] Error states when relayer slow / offline
- [ ] Loading indicator during 800ms+ MemWal round-trip

**Done when:** [Judge walkthrough](./README.md#judge-walkthrough-60-seconds) works end-to-end on production URL.

---

### Phase 4 — Demo video & submission (Day 4)

**Goal:** All hackathon deliverables filed.

- [ ] Record ≤ 3 min demo video (Memory Moment: Day 1 quote → Day 4 roast)
- [ ] Deploy production URL (Vercel recommended)
- [ ] Complete [Airtable form](https://airtable.com/appoDAKpC74UOqoDa/shrIl2BMnzMwpuLhO)
- [ ] Register + submit on DeepSurge (mainnet)
- [ ] Join [Walrus Discord](https://discord.com/invite/walrusprotocol)
- [ ] Post with **#Walrus** on X
- [ ] Optional: MemWal GitHub feedback issue for Best Feedback prize ($50 WAL)

**Done when:** All items in [README checklist](./README.md#hackathon-submission-checklist) are checked.

---

## Memory Moment script (for video)

| Step | Action | Expected agent behavior |
|------|--------|-------------------------|
| 1 | Day 1 — declare Argentina / Messi | HypeMan praises; DoomSayer dismisses; brain panel fills |
| 2 | Show Walrus Brain State + SuiScan link | Judge-visible memory, not console logs |
| 3 | Slider → Day 4 | Label: "Memory Explosion" |
| 4 | "I'm bored, I don't want to watch anymore" | DoomSayer quotes exact Day 1 line from Walrus |
| 5 | Hard refresh | Same profile reloads — portable memory |

---

## Risk register

| Risk | Mitigation |
|------|------------|
| Relayer latency on serverless | Parallel capped recall; fire-and-forget `remember()`; never block UI on `rememberAndWait` |
| Wrong key type (public vs private) | Use delegate **private** key from [memwal.ai](https://memwal.ai) dashboard in `MEMWAL_PRIVATE_KEY` |
| Namespace bleed between users | Always prefix namespace with user id (`googleSub` or Sui address) |
| Google-only auth without Sui wallet | Acceptable for MVP; add Sui wallet in Phase 3 if time allows |
| Hackathon deadline | Prioritize Phase 2 + Phase 4; skip optional Sui wallet if blocked |

---

## Success criteria

1. Memory **changes agent behavior** on Day 4 (not possible on Day 1).
2. Memory is **visible in UI** (Walrus Brain State panel).
3. State persists on **Walrus Mainnet** via MemWal with explorer proof.
4. Public URL works without cloning the repo.
5. Demo video ≤ 3 minutes shows the Memory Moment clearly.

---

## Doc map

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Public project face + judge walkthrough |
| [PLAN.md](./PLAN.md) | This file — phases and milestones |
| [BUILDING_INSTRUCTIONS.md](./BUILDING_INSTRUCTIONS.md) | Step-by-step setup for builders |
| `.env.example` | Env var template (no secrets) |
