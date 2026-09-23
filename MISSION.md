# Mission: Agent-Driven Song-Video Workflow (LangChain + JEV evaluation)

## Why
Each song by Kathy Reid-Naiman should get an 8-second HyperFrames video (Spotify Canvas loop); the
best ones will be selected for full sing-along videos. The user wants a repeatable, agent-runnable
workflow for this, and wants to understand the machinery — LangChain for orchestration and Jev
(System One) for the structured decision points — deeply enough to modify it themselves. Right now
the focus is deliberately the data/memory layer (Hindsight bank + retrieving the local education
sources), not the web application.

## Success looks like
- This repo resolves to a Hindsight bank; its memories and the local education sources are retrievable
- A workflow an agent can run end-to-end that produces the 8s Canvas video for a given Kathy Reid-Naiman song
- Run 1 (LLM baseline) vs Run 2 (Jev at decision nodes): effectiveness + token-spend comparison recorded
- A Jev-backed art-style delegation task working end to end (source creative → structured choice set → Jev picks)
- The user can explain and modify the workflow's LangChain pieces and Jev decision points without agent help

## Constraints
- Do not rush planning: learn LangChain and Jev deeply before committing to the full workflow design
- Database/memory-layer focus only for now; web application explicitly out of scope
- Progress through small, concrete tasks first; the two-run comparison is the capstone
- Token spend is a first-class metric — every run must be measurable
- Agent/delegation logic in Python (separate from the Next.js web app)

## Out of scope (for now)
- Web application / site changes
- Jev internals / model training theory beyond what's needed to use the API well
- Non-Kathy video projects