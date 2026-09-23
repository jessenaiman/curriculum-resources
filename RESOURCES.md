# Agent-Driven Video Workflow Resources

## Knowledge

- [Blog: "Introducing System One Models & Jev" (TypeSafe AI)](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
  Primary announcement: System One class, RLCD training, parallel sampling, pricing/speed claims and their own nuance caveats. Use for: the "why Jev exists" frame and for critically reading their benchmark claims.
- [Docs: TypeSafe Introduction](https://docs.typesafe.ai/)
  State + typed questions → typed answers with probabilities/confidence; the three primitives and the "atomic questions, composed in code" rule. Use for: core mental model of how to structure any Jev call.
- [Docs: Quick Start](https://docs.typesafe.ai/introduction/quickstart)
  Playground, raw HTTP endpoint (`POST /v1/systemone`), request/response shapes, Python SDK (`typesafe-sdk`). Use for: the first working API call and exact JSON shapes.
- [Docs: LLMs.txt index](https://docs.typesafe.ai/llms.txt)
  Full doc map — primitives (Choice/Score/Noul), confidence, patterns (fan-out, confidence-routing, composite scoring, intent routing), cookbooks, SDKs. Use for: finding the right deep-dive page.
- [Cookbook: Parallel questions](https://docs.typesafe.ai/cookbooks/parallel_questions)
  13-question batch: 12.2x cheaper and 10.0x faster than separate calls, same answers. Use for: the batching/economics argument when designing cost comparisons.
- [Repo: System One LLM adapter (Python)](https://github.com/typesafe-ai/system-one-adapter-python)
  The wrapper TypeSafe themselves use to constrain LLMs to System-One-compatible decisions — relevant to the baseline (LLM) run of the workflow.
- [Evals site](https://evals.typesafe.ai/)
  Workflow evals: examples, disagreements, full queries per workflow. Use for: designing the effectiveness half of the Run 2 comparison.
- [Agent skill: TypeSafe for coding agents](https://docs.typesafe.ai/introduction/coding-agents)
  What Jev is (and isn't) inside an agent; installable skill (`npx skills add typesafe-ai/skills --skill typesafe-ai`). Use for: wiring Jev into agent workflows directly.

## Gaps

- LangChain: official docs not yet fetched/vetted — needed before the orchestration lessons (knowledge, current).
- No high-trust community (forum/discord/reddit) vetted yet for workflow-design wisdom (wisdom, current).
- Video-workflow reference material (HyperFrames route docs) not yet added — pending the "what kind of video" answer.
