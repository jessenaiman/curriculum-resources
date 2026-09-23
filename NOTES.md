# Teaching Notes

## Preferences
- Explicitly does NOT want planning rushed. Learning precedes design; small tasks precede the two-run capstone plan.
- Gated progression: teach concepts → user picks small tasks → only then the full workflow plan.
- Wants to genuinely learn LangChain (depth, not a skim) and go deep on Jev.
- Token spend is a metric they care about comparing across runs — treat cost as teachable content.
- Agent/delegation logic: Python. Web app stays TS/Next.js and is out of scope for now.
- Database/memory layer is the current focus: Hindsight bank + retrieval of local education sources.

## Resolved decisions (2026-09-23)
- Mission confirmed: 8-second Spotify Canvas videos per Kathy Reid-Naiman song → best become sing-along videos.
- First small task: Jev selects the art style for a song — a delegation task over a sourced creative choice set. Schema + ChatGPT sourcing prompt delivered.
- Hindsight: repo opted in (optInPaths) → bank `coding-agent::curriculum-resources`; takes effect next agent start.
- "This database" = the Hindsight memory bank AND the local education sources in resources//data/ (not the sqlite file).
- Iteration 1 = one baseline Canvas video, knowingly imperfect, with wrongness + token usage logged (Hindsight initiative kp-995b3979e288454f9b033ddfe001bd5a).
- Issue tracker: GitHub Issues via `gh` CLI (ready-for-agent label always applied). Setup files: AGENTS.md + docs/agents/*.
- Jev access confirmed: model `jev-1.13-free`, endpoint `https://opencode.ai/zen/v1/systemone`, Bearer key from .env `OPENCODE_API_KEY`. Cloudflare blocks bare Python-urllib (403/1010) → must send browser User-Agent. Request shape: `{model, state, questions:{id:{type, instructions, criteria}}}`; types `choice`/`score`/`noul`; response has `answers` + `usage{tokens}`. (2026-09-23, T1 #2 closed)
- "Source prompting" = the ChatGPT step that **produces the choice-set menu Jev decides over** (Jev is a System One decision model — it selects from a set, it doesn't generate options). Sourcing prompt schema: `{schema_version, purpose, options:[{id, name, description, written_ideas[], visual_ideas[], proven_prompts:[{tool, prompt, evidence}]}]}`, 40–55 options, ids become Jev `choice` criteria keys. Two-stage flow: source (generative LLM) → decide (Jev) → realize (HyperFrames).
- Video review: **agent-native (BuilderIO) not needed** — HyperFrames has the built-in review loop (`hyperframes/references/review-loop.md`): plan in chat → storyboard (`storyboard.html`) → build → live Studio preview → approve/change. Tooling: `npx hyperframes preview --background` (persistent Studio), `snapshot`, `compare`, `feedback --rating`. `check` = lint+runtime+layout+motion+contrast gate.
- Iteration-1 baseline video built 2026-09-23: `hyperframes/one-two-three-four/` — "One Two Three Four" (I Love to Hear the Sounds album), 1080×1920 portrait, 8.0s, flat-vector night-cottage counting scene, first 8s of the song embedded. `npm run check` fully clean (8/8 WCAG AA). Render: `renders/one-two-three-four_2026-09-23_15-13-39.mp4` (921.6 KB, 240 frames, h264+aac, hardware GPU 15.7s).

## Open question
- Wiki-llm / smart-connection shape: Hindsight-indexed retrieval of local sources vs Obsidian-style linked-wiki layer (or coordinated) — under brainstorming, awaiting answer.