# Old MacDonald Had a School — Curriculum Resources

A small static teacher-resource website where each topic is an editable MDX file. The spreadsheet remains the curriculum reference; the website turns selected rows into practical lesson-starting pages.

The SQLite source in `data/curriculum.db` also contains a structured lesson-authoring layer. `lesson_blueprints` stores the page-ready lesson brief, `lesson_steps` stores the teaching sequence, `worksheet_briefs` stores printable-generation inputs, and the guidance/review tables preserve optional songs, resources, search fallbacks, provenance, and review flags. Rebuild that layer with `python data/populate_lesson_content.py`; inspect one topic with `data/lesson_content_assembly.sql` and review the full set with `data/lesson_content_review.sql`.

## Edit lesson content

Lesson pages live in `content/lessons/`. Copy `content/templates/topic-template.mdx`, rename it, and edit the frontmatter and lesson sections. New lesson files are discovered automatically.

Page copy for the home and about pages lives in `content/pages/`.

## Run locally

```bash
npm install
npm run dev
```

## Verify before pushing

```bash
npm test
npm run lint
```

## Content policy

- A curriculum row is a source reference, not automatically a complete lesson plan.
- Link directly to a usable resource whenever possible.
- Label authored lesson suggestions as editorial content rather than implying they came from the workbook.
- Do not mark a resource ready until its title, destination, and instructional fit have been checked.
- Keep scope or alignment qualifications visible in the lesson content.

Drizzle remains installed for possible future features, but the current lesson site has no runtime database or CMS dependency.

See [CONTENT_REVIEW.md](CONTENT_REVIEW.md) for the current source audit and open review questions.
