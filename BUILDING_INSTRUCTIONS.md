# Building Instructions — HypeMan & DoomSayer

Step-by-step guide for developers building and deploying this Walrus Memory World Cup submission.

---

## Prerequisites

| Tool | Version / notes |
|------|-----------------|
| Node.js | ≥ 18 |
| pnpm or npm | Package manager |
| Git | Clone + deploy |
| Vercel account | Recommended for static + serverless |
| Google Cloud project | OAuth Client ID (already configured in `app.js`) |
| MemWal dashboard access | [memwal.ai](https://memwal.ai) — mainnet credentials |

---

## MemWal credentials

Your Sessions project is provisioned with:

```bash
# Public — safe to document in repo
MEMWAL_ACCOUNT_ID=0x31bd4294b5360ea1f5b4bc205493bad2edc97714e5bef612e6d2c28ae99e8627

# Delegate public key (verification only — NOT used in SDK init)
MEMWAL_DELEGATE_PUBLIC_KEY=99c65409e0673b801d0b2b972910b6f1b906699d20bed78c6a6bdfd7a69f922b
```

**Required secret (server-side only):**

```bash
MEMWAL_PRIVATE_KEY=<your-ed25519-delegate-private-key-hex>
```

Obtain the delegate **private key** from the [MemWal dashboard](https://memwal.ai). The value shared as "public key" is **not** the SDK `key` field — using it will cause `401 Unauthorized`.

Managed mainnet relayer:

```bash
MEMWAL_SERVER_URL=https://relayer.memwal.ai
```

Explorer link for submissions:

https://suiscan.xyz/mainnet/object/0x31bd4294b5360ea1f5b4bc205493bad2edc97714e5bef612e6d2c28ae99e8627

---

## 1. Clone and run the frontend (current MVP)

```bash
git clone https://github.com/Taybew1/Taybew-SS4.git
cd Taybew-SS4

# Serve static files
npx serve .
# Open http://localhost:3000
```

The MVP runs entirely in the browser with `mockWalrusStorage`. Use the **Timeline Simulator** (Day 1 → Day 4) to test agent behavior before MemWal is wired.

---

## 2. Environment setup

Create `.env.local` at the repo root (never commit):

```bash
cp .env.example .env.local
```

Fill in:

```env
MEMWAL_PRIVATE_KEY=your_delegate_private_key_hex
MEMWAL_ACCOUNT_ID=0x31bd4294b5360ea1f5b4bc205493bad2edc97714e5bef612e6d2c28ae99e8627
MEMWAL_SERVER_URL=https://relayer.memwal.ai
MEMWAL_NAMESPACE_PREFIX=hypeman
GOOGLE_CLIENT_ID=704639498430-jj1vvvkh0mke0cod06l8a7pepu17m9rh.apps.googleusercontent.com
```

Add the same variables in **Vercel → Project → Settings → Environment Variables** for production.

---

## 3. Add MemWal backend (planned — follow PLAN.md Phase 1–2)

### Install SDK

```bash
pnpm init
pnpm add @mysten-incubation/memwal
```

### Minimal server client

```ts
// api/lib/memwal.ts
import { MemWal } from "@mysten-incubation/memwal";

export function getMemWal(namespace: string) {
  return MemWal.create({
    key: process.env.MEMWAL_PRIVATE_KEY!,
    accountId: process.env.MEMWAL_ACCOUNT_ID!,
    serverUrl: process.env.MEMWAL_SERVER_URL ?? "https://relayer.memwal.ai",
    namespace,
  });
}
```

### Health check route

```ts
// api/health.ts (Vercel serverless example)
import { getMemWal } from "./lib/memwal";

export default async function handler(_req, res) {
  const memwal = getMemWal("system");
  const health = await memwal.health();
  res.status(200).json({ ok: true, health });
}
```

Verify locally:

```bash
curl http://localhost:3000/api/health
```

### Per-user namespace

Derive namespace from authenticated user id:

```ts
function namespaceForUser(googleSub: string) {
  return `${process.env.MEMWAL_NAMESPACE_PREFIX}-${googleSub}`;
}
```

Never use a single shared namespace for all users in production.

---

## 4. Memory schema and API contract

### Structured profile (`FAN_PROFILE_JSON`)

Store as a MemWal profile field or a dedicated remembered JSON blob:

| Field | Type | Example |
|-------|------|---------|
| `favorite_team` | string \| null | `"Argentina"` |
| `idol` | string \| null | `"Messi"` |
| `user_vibe` | string | `"Confident, Hype-driven"` |
| `day_1_declaration` | string \| null | Verbatim Day 1 user message |
| `betting_history` | string[] | `["Win (Favorite)", "Loss (Favorite)"]` |
| `win_rate` | number | `66` |
| `interaction_count` | number | `12` |

### Suggested routes

| Route | Method | Body | Action |
|-------|--------|------|--------|
| `/api/memory/load` | POST | `{ userId }` | Load profile into Walrus Brain State panel |
| `/api/memory/save` | POST | `{ userId, profile, semanticLine? }` | Upsert profile + optional `remember()` |
| `/api/memory/clear` | POST | `{ userId }` | Reset namespace (demo wipe button) |
| `/api/chat` | POST | `{ userId, message, simulatedDay }` | Load memory → run agent rules → save |

### Write pattern (recommended)

```ts
// Fire-and-forget semantic memory — do not block the response
memwal.remember(`Day ${day}: ${userMessage}`);

// Structured state — upsert profile JSON
await memwal.rememberAndWait(JSON.stringify(profile), { /* profile key */ });
```

For chat latency, prefer parallel `load` + capped `recall()` and async writes. See [PLAN.md](./PLAN.md) risk register.

### Read pattern (Day 4)

```ts
const recalled = await memwal.recall({
  query: "What did the user declare on Day 1?",
});
// Filter by distance, e.g. distance < 0.7
```

---

## 5. Wire frontend to API

Replace direct `mockWalrusStorage` mutations in `app.js` with fetch calls:

```js
async function loadMemory(userId) {
  const res = await fetch("/api/memory/load", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

async function saveMemory(userId, profile, semanticLine) {
  await fetch("/api/memory/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, profile, semanticLine }),
  });
}
```

Use Google JWT `sub` claim as `userId` after sign-in.

Keep the timeline slider as `simulatedDay` sent to `/api/chat` — it controls agent rules, not Walrus clock time.

---

## 6. Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel
```

Project settings:

| Setting | Value |
|---------|-------|
| Framework | Other |
| Root directory | `.` |
| Build command | _(none — static)_ |
| Output | `.` |

Add all `MEMWAL_*` env vars in the Vercel dashboard. Redeploy after adding secrets.

Update [README.md](./README.md) live demo URL after first successful deploy.

---

## 7. Google OAuth (production domain)

1. Open [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Edit the OAuth 2.0 Client ID used in `app.js`.
3. Add **Authorized JavaScript origins**:
   - `https://your-app.vercel.app`
   - `http://localhost:3000` (local testing)
4. Save and wait ~5 minutes for propagation.

---

## 8. Verify MemWal on mainnet

Checklist before hackathon submit:

```bash
# 1. Health
curl https://your-app.vercel.app/api/health

# 2. SuiScan — MemWalAccount object loads
open "https://suiscan.xyz/mainnet/object/0x31bd4294b5360ea1f5b4bc205493bad2edc97714e5bef612e6d2c28ae99e8627"
```

Manual UI test:

1. Sign in with Google.
2. Day 1 — send Argentina / Messi message.
3. Confirm **Walrus Brain State** updates.
4. Refresh — state reloads from MemWal.
5. Day 4 — send "I'm bored…" — DoomSayer quotes Day 1 declaration.

---

## 9. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `401 Unauthorized` | Wrong `MEMWAL_PRIVATE_KEY`; used public key instead of private; staging/mainnet mismatch |
| `health()` fails | Check `MEMWAL_SERVER_URL=https://relayer.memwal.ai` |
| Empty `recall()` | Namespace mismatch; verify same namespace on write and read |
| Irrelevant recall hits | Filter `distance < 0.7` |
| Google login broken on deploy | Add production origin to OAuth client |
| Memory lost on refresh | Backend not wired; still on mock store |

---

## 10. Submission pack

After deploy works:

1. Update README links (live URL, SuiScan, demo video).
2. Record ≤ 3 min demo — follow [Memory Moment script](./PLAN.md#memory-moment-script-for-video).
3. Submit [Airtable form](https://airtable.com/appoDAKpC74UOqoDa/shrIl2BMnzMwpuLhO).
4. Register on [DeepSurge](https://deepsurge.xyz).
5. Post on X with **#Walrus**.

Walrus usage blurb for forms (copy from [README.md](./README.md#walrus-memory)).

---

## Security rules

- **Never** commit `MEMWAL_PRIVATE_KEY` or `.env.local`.
- **Never** expose delegate keys in `app.js` or browser bundles.
- Rotate keys if accidentally pushed.
- Use per-user namespaces — no shared `"default"` in production.

---

## References

- [MemWal SDK Quick Start](https://docs.memwal.ai/sdk/quick-start)
- [Managed Relayer](https://docs.memwal.ai/relayer/public-relayer)
- [Walrus Memory World Cup Rules](https://thewalrussessions.wal.app/memory-world-cup/index.html)
- [Development Plan](./PLAN.md)
