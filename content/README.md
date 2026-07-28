# Editing website content

The visible website text lives in this folder. You do not need to edit React components, connect a database, or use a CMS.

## Add a lesson topic

1. Duplicate `templates/topic-template.mdx`.
2. Save the copy in `lessons/` using a short lowercase filename such as `comparing-numbers.mdx`.
3. Edit the frontmatter between the two `---` lines.
4. Replace the Grade 1 and Grade 2 lesson content.
5. Add one import and one entry in `lib/mdx-content.ts` until automatic folder discovery is introduced.

## Resource states

- `ready`: show a real, verified external resource.
- `missing`: show that a resource still needs verification.
- `none`: the step is teacher-led and does not need an external resource.

## Content rule

Every visible element must help the teacher answer at least one question:

1. What do I use?
2. How do I use it?
3. What evidence tells me students understood?
4. What do I search for when this option does not fit my class?

The Excel curriculum tracker remains the reference for topic order, curriculum wording, standards, recommended sources, links, and scope notes. MDX is the editable publishing layer where a spreadsheet row becomes a usable teacher-facing lesson.
