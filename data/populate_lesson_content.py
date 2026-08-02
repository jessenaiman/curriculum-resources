#!/usr/bin/env python3
"""Add the structured lesson-authoring layer to curriculum.db.

The existing tables are source/reference data.  This script adds editorial
lesson blueprints that are intentionally marked ready_for_review rather than
published.  It is idempotent and only replaces the tables owned by this
script.
"""

from __future__ import annotations

import json
import re
import sqlite3
from datetime import datetime, timezone
from pathlib import Path


DB_PATH = Path(__file__).with_name("curriculum.db")


def json_text(value):
    return json.dumps(value, ensure_ascii=False)


def slugify(value: str) -> str:
    value = value.lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "lesson"


def profile_for(subject: str) -> dict:
    if subject == "Math & Numeracy":
        return {
            "mode": "Concrete model -> visual representation -> independent application",
            "staff": "Mr Sam",
            "students": "Maisy, Sam, Hopper",
            "materials": ["counters or small manipulatives", "ten-frame, number line, or place-value mat", "pencils and mini-whiteboards"],
            "vocabulary": ["count", "represent", "compare", "explain", "strategy"],
            "cross": "Connect the mathematical idea to counting, movement, pattern, or a familiar farm-school problem.",
            "worksheet_1": ("Model it three ways", "Represent the target idea with objects, a drawing, and an equation or labelled explanation."),
            "worksheet_2": ("Solve and explain", "Apply the target skill to short problems, then show or write the strategy used."),
        }
    if subject in {"Literacy & Phonics", "Language & Vocabulary"}:
        return {
            "mode": "Oral rehearsal -> explicit model -> guided reading, writing, or word work",
            "staff": "Miss Hayley",
            "students": "Scout, Whiskers, Penny",
            "materials": ["sound, word, picture, or sentence cards", "magnetic letters or letter tiles", "mini-whiteboards and pencils"],
            "vocabulary": ["listen", "say", "read", "write", "notice", "explain"],
            "cross": "Use rhythm, clapping, movement, or a short story to make the language pattern audible and memorable.",
            "worksheet_1": ("Read, sort, and notice", "Sort or mark examples of the target language feature and say what makes each example fit."),
            "worksheet_2": ("Apply the pattern", "Read, build, write, or complete a small set of examples using the target skill."),
        }
    if subject == "Science & Nature":
        return {
            "mode": "Notice -> wonder -> observe or model -> explain with evidence",
            "staff": "Mr Rusty",
            "students": "Whiskers, Scout, Maisy",
            "materials": ["safe object, photo, or classroom specimen", "observation tray or sorting mat", "drawing paper and pencils"],
            "vocabulary": ["observe", "notice", "describe", "compare", "evidence"],
            "cross": "Invite students to draw, label, count, sort, or move like the natural phenomenon being studied.",
            "worksheet_1": ("Observe and label", "Record what is seen, heard, or noticed and label the relevant parts or features."),
            "worksheet_2": ("Compare and explain", "Compare two examples and use a word, drawing, or sentence to explain the observation."),
        }
    if subject == "Social-Emotional Learning (SEL)":
        return {
            "mode": "Name the situation -> model a choice -> rehearse -> reflect",
            "staff": "Miss Puddles",
            "students": "Penny, Hopper, Maisy",
            "materials": ["simple scenario cards", "emotion or choice visuals", "quiet reflection sheet"],
            "vocabulary": ["notice", "feel", "choose", "listen", "help", "reflect"],
            "cross": "Pair the social routine with a song, puppet scenario, drawing, or movement that lets students rehearse the idea safely.",
            "worksheet_1": ("Notice the situation", "Identify the feeling, problem, or point of view shown in a simple classroom scenario."),
            "worksheet_2": ("Choose and reflect", "Select a helpful response and draw or write what might happen next."),
        }
    if subject in {"Gross Motor & Movement", "Fine Motor Skills"}:
        return {
            "mode": "Teacher demonstration -> supported rehearsal -> repeat with a new challenge",
            "staff": "Mr Rusty" if subject == "Gross Motor & Movement" else "Miss Puddles",
            "students": "Hopper, Rusty, Scout" if subject == "Gross Motor & Movement" else "Penny, Whiskers, Maisy",
            "materials": ["clear, safe movement space", "visual action cards", "optional rhythm instrument or timer"],
            "vocabulary": ["start", "stop", "slow", "steady", "careful", "try again"],
            "cross": "Use counting, beat, directional words, or a visual sequence so students can connect body control with language and early mathematics.",
            "worksheet_1": ("Show the sequence", "Order or match pictures that show the safe steps of the target movement or routine."),
            "worksheet_2": ("Plan and reflect", "Draw the movement, tool, or routine and mark what helped the body work safely."),
        }
    return {
        "mode": "Connect to a familiar routine -> model explicitly -> practise together -> transfer",
        "staff": "Miss Puddles",
        "students": "Penny, Maisy, Hopper",
        "materials": ["routine or visual sequence cards", "timer or signal", "pencils and a simple checklist"],
        "vocabulary": ["notice", "listen", "follow", "sequence", "share", "reflect"],
        "cross": "Make the routine visible through a song, role-play, drawing, or a class-made checklist.",
        "worksheet_1": ("Put it in order", "Order the pictures or actions that show the target routine or learning process."),
        "worksheet_2": ("Use it in context", "Apply the routine or idea to a short classroom example and explain the choice."),
    }


def lesson_summary(topic, profile):
    return (
        f"Students work on {topic['lesson_topic']} through a short, explicit sequence that moves from "
        f"{profile['mode'].split(' -> ')[0].lower()} to independent evidence. This is an editorial starting point "
        "built from the curriculum row; adjust examples, number range, text complexity, and supports for the class."
    )


def topic_keywords(topic, profile):
    stop = {"and", "the", "to", "of", "in", "from", "with", "within", "into", "for", "a", "an", "on", "as"}
    words = [w.lower() for w in re.findall(r"[A-Za-z][A-Za-z'-]+", topic["lesson_topic"])]
    keywords = []
    for word in words + profile["vocabulary"]:
        if word not in stop and word not in keywords:
            keywords.append(word)
    return keywords[:12]


def create_tables(con: sqlite3.Connection):
    con.executescript(
        """
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS lesson_blueprints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            curriculum_topic_id INTEGER NOT NULL UNIQUE,
            slug TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            subject TEXT NOT NULL,
            category TEXT,
            grade_band TEXT NOT NULL,
            summary TEXT NOT NULL,
            purpose TEXT NOT NULL,
            lesson_mode TEXT NOT NULL,
            duration_minutes INTEGER NOT NULL DEFAULT 30,
            learning_goals_json TEXT NOT NULL,
            success_criteria_json TEXT NOT NULL,
            vocabulary_json TEXT NOT NULL,
            materials_json TEXT NOT NULL,
            teacher_prep TEXT NOT NULL,
            assessment_plan TEXT NOT NULL,
            differentiation_support TEXT NOT NULL,
            extension TEXT NOT NULL,
            cross_curricular TEXT NOT NULL,
            staff_lead TEXT,
            student_characters TEXT,
            character_rationale TEXT NOT NULL,
            source_provenance TEXT NOT NULL,
            editorial_status TEXT NOT NULL DEFAULT 'editorial_draft',
            review_state TEXT NOT NULL DEFAULT 'ready_for_review',
            review_flags TEXT,
            version INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (curriculum_topic_id) REFERENCES curriculum_topics(id)
        );

        CREATE TABLE IF NOT EXISTS lesson_steps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_id INTEGER NOT NULL,
            step_order INTEGER NOT NULL,
            phase TEXT NOT NULL,
            title TEXT NOT NULL,
            minutes INTEGER NOT NULL,
            teacher_actions TEXT NOT NULL,
            student_actions TEXT NOT NULL,
            look_fors TEXT NOT NULL,
            assessment_prompt TEXT NOT NULL,
            resource_state TEXT NOT NULL,
            resource_note TEXT NOT NULL,
            UNIQUE(lesson_id, step_order),
            FOREIGN KEY (lesson_id) REFERENCES lesson_blueprints(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS worksheet_briefs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_id INTEGER NOT NULL,
            worksheet_order INTEGER NOT NULL,
            title TEXT NOT NULL,
            purpose TEXT NOT NULL,
            activity_type TEXT NOT NULL,
            child_directions TEXT NOT NULL,
            answer_key_guidance TEXT NOT NULL,
            visual_notes TEXT NOT NULL,
            differentiation TEXT NOT NULL,
            materials_json TEXT NOT NULL,
            generation_prompt TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'editorial_draft',
            review_flags TEXT,
            UNIQUE(lesson_id, worksheet_order),
            FOREIGN KEY (lesson_id) REFERENCES lesson_blueprints(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS lesson_search_prompts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_id INTEGER NOT NULL,
            prompt_type TEXT NOT NULL,
            prompt TEXT NOT NULL,
            rationale TEXT NOT NULL,
            UNIQUE(lesson_id, prompt_type),
            FOREIGN KEY (lesson_id) REFERENCES lesson_blueprints(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS lesson_song_guidance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_id INTEGER NOT NULL,
            song_id INTEGER NOT NULL,
            relevance TEXT NOT NULL,
            use_in_phase TEXT NOT NULL,
            teacher_rationale TEXT NOT NULL,
            UNIQUE(lesson_id, song_id),
            FOREIGN KEY (lesson_id) REFERENCES lesson_blueprints(id) ON DELETE CASCADE,
            FOREIGN KEY (song_id) REFERENCES songs(id)
        );

        CREATE TABLE IF NOT EXISTS lesson_resource_guidance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_id INTEGER NOT NULL,
            resource_id INTEGER NOT NULL,
            relevance TEXT NOT NULL,
            use_in_phase TEXT NOT NULL,
            teacher_rationale TEXT NOT NULL,
            verification_state TEXT NOT NULL,
            scope_note TEXT NOT NULL,
            UNIQUE(lesson_id, resource_id),
            FOREIGN KEY (lesson_id) REFERENCES lesson_blueprints(id) ON DELETE CASCADE,
            FOREIGN KEY (resource_id) REFERENCES resources(id)
        );

        CREATE TABLE IF NOT EXISTS lesson_review (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_id INTEGER NOT NULL UNIQUE,
            source_topic_present INTEGER NOT NULL,
            standards_present INTEGER NOT NULL,
            linked_songs_count INTEGER NOT NULL,
            linked_resources_count INTEGER NOT NULL,
            step_count INTEGER NOT NULL,
            worksheet_count INTEGER NOT NULL,
            search_prompt_count INTEGER NOT NULL,
            completeness_score INTEGER NOT NULL,
            review_state TEXT NOT NULL,
            automated_flags TEXT,
            reviewer_notes TEXT NOT NULL,
            reviewed_at TEXT,
            FOREIGN KEY (lesson_id) REFERENCES lesson_blueprints(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_lesson_blueprints_subject_grade
            ON lesson_blueprints(subject, grade_band);
        CREATE INDEX IF NOT EXISTS idx_lesson_steps_lesson_order
            ON lesson_steps(lesson_id, step_order);
        CREATE INDEX IF NOT EXISTS idx_worksheet_briefs_lesson_order
            ON worksheet_briefs(lesson_id, worksheet_order);
        """
    )


def build(con: sqlite3.Connection):
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    # These are exclusively script-owned tables.  Removing their prior rows
    # makes a rerun deterministic without touching the source/reference data.
    for table in [
        "lesson_review",
        "lesson_song_guidance",
        "lesson_resource_guidance",
        "lesson_search_prompts",
        "worksheet_briefs",
        "lesson_steps",
        "lesson_blueprints",
    ]:
        con.execute(f"DELETE FROM {table}")

    topics = con.execute("SELECT * FROM curriculum_topics ORDER BY subject, grade, seq_num, id").fetchall()
    slug_counts: dict[str, int] = {}
    inserted = {}

    for topic in topics:
        topic = dict(topic)
        profile = profile_for(topic["subject"])
        base_slug = slugify(topic["lesson_topic"])
        slug_counts[base_slug] = slug_counts.get(base_slug, 0) + 1
        slug = base_slug if slug_counts[base_slug] == 1 else f"{base_slug}-{topic['id']}"

        songs = con.execute(
            """SELECT s.id, s.song_name, sc.relevance
               FROM songs s JOIN songs_curriculum sc ON sc.song_id = s.id
               WHERE sc.curriculum_id = ? ORDER BY CASE sc.relevance WHEN 'primary' THEN 0 ELSE 1 END, s.song_name""",
            (topic["id"],),
        ).fetchall()
        resources = con.execute(
            """SELECT r.id, r.name, r.type, r.verified, rt.relevance
               FROM resources r JOIN resources_topics rt ON rt.resource_id = r.id
               WHERE rt.topic_id = ? ORDER BY CASE rt.relevance WHEN 'primary' THEN 0 ELSE 1 END, r.name""",
            (topic["id"],),
        ).fetchall()

        flags = []
        if not (topic.get("ontario_code") or topic.get("us_code")):
            flags.append("standards_code_review")
        if not songs:
            flags.append("no_linked_song")
        if not resources:
            flags.append("no_linked_resource")
        if resources and not any(row["verified"] for row in resources):
            flags.append("linked_resources_unverified")

        goals = [
            f"Understand the curriculum target: {topic['skill_statement']}.",
            f"Use the target skill in a new example, explanation, performance, or routine connected to {topic['lesson_topic']}.",
            "Explain or show enough thinking that the teacher can identify the strategy, misconception, or support needed next.",
        ]
        success = [
            f"The student attempts the target skill in an example related to {topic['lesson_topic']}.",
            "The student uses the agreed vocabulary, representation, movement, or routine with increasing independence.",
            "The student can show, say, draw, or write evidence that matches the target.",
        ]
        keywords = topic_keywords(topic, profile)
        materials = profile["materials"] + ["teacher observation notes or checklist"]
        if songs:
            materials.append("one selected linked song or audio cue, if it supports the lesson")
        if resources:
            materials.append("one linked practice resource after access and scope review")

        purpose = f"Give students a practical first encounter with {topic['lesson_topic']} and collect evidence for the next teaching move."
        teacher_prep = (
            f"Read the curriculum row and teaching notes before teaching. Prepare one concrete example and one non-example for {topic['lesson_topic']}; "
            "choose the number range, text, vocabulary, or physical demand that matches the group. Mark any external resource as a candidate until it has been opened and checked."
        )
        assessment = (
            f"Use the final check to ask each student to show or explain one example of {topic['lesson_topic']}. Record whether the student is independent, "
            "partially supported, or not yet showing the target, plus the representation or prompt that helped."
        )
        differentiation = (
            "Support: reduce the number of examples, shorten the language, model one step at a time, add picture/gesture cues, and allow oral or physical response. "
            "For multilingual learners, preteach the key words and pair each word with a concrete example."
        )
        extension = (
            f"Extension: ask students to create a new example of {topic['lesson_topic']}, explain why it fits, or compare two strategies. Keep the extension optional and do not treat it as the core expectation."
        )
        character_rationale = (
            f"{profile['staff']} leads because the character's teaching role fits {topic['subject']}. "
            f"{profile['students']} provide contrasting ways to participate: model, notice, try, explain, and revise."
        )
        source = (
            f"curriculum_topics.id={topic['id']} | curriculum row: {topic['lesson_topic']} | "
            f"Ontario: {topic.get('ontario_code') or 'not supplied'} | US: {topic.get('us_code') or 'not supplied'} | "
            "editorial lesson layer generated for review; confirm against the source workbook and current standards before publication"
        )

        blueprint_id = con.execute(
            """INSERT INTO lesson_blueprints
            (curriculum_topic_id, slug, title, subject, category, grade_band, summary, purpose, lesson_mode,
             duration_minutes, learning_goals_json, success_criteria_json, vocabulary_json, materials_json,
             teacher_prep, assessment_plan, differentiation_support, extension, cross_curricular,
             staff_lead, student_characters, character_rationale, source_provenance, editorial_status,
             review_state, review_flags, version, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                topic["id"], slug, topic["lesson_topic"], topic["subject"], topic.get("category") or "",
                topic["grade"], lesson_summary(topic, profile), purpose, profile["mode"], 30,
                json_text(goals), json_text(success), json_text(keywords), json_text(materials),
                teacher_prep, assessment, differentiation, extension, profile["cross"], profile["staff"],
                profile["students"], character_rationale, source, "editorial_draft", "ready_for_review",
                "; ".join(flags) if flags else "none", 1, now, now,
            ),
        ).lastrowid
        inserted[topic["id"]] = blueprint_id

        steps = [
            (1, "Connect", "Activate prior knowledge", 5,
             f"Name the goal in child-friendly language: {topic['lesson_topic']}. Show one familiar example, invite a quick notice or prediction, and connect it to {profile['cross'].lower()}",
             "Turn and talk, point, move, say, or draw what they already notice. Share one idea without needing the formal vocabulary yet.",
             "Students can connect the target to an example, experience, or representation.",
             "What do you notice, and what do you think we will need to do today?"),
            (2, "Teach together", "Model the thinking", 10,
             f"Think aloud through one carefully chosen example of {topic['lesson_topic']}. Name the decision points, model the vocabulary, and show how to check the result. Include one non-example when it helps reveal the boundary of the skill.",
             "Watch, echo key words, help place or mark materials, and rehearse the model with a partner or the group.",
             "Students can describe or imitate the important step rather than only copying the final answer.",
             "Which step mattered most, and how could we check it?"),
            (3, "Practice", "Try with support, then independently", 10,
             f"Offer two or three varied examples of {topic['lesson_topic']}. Start with guided prompts, then remove one support. Use a linked candidate resource only after checking its access, title, and scope.",
             "Work alone or with a partner to show the target using the agreed representation, language, movement, or routine. Explain one choice to the teacher or partner.",
             "Students transfer the target to a new example and reveal a strategy or misconception.",
             "Show me how you know, or show me what you would try next."),
            (4, "Check and reflect", "Make evidence visible", 5,
             f"Ask for one final example, performance, explanation, or drawing tied to {topic['lesson_topic']}. Record the prompt that helped and decide who needs reteaching, more practice, or extension.",
             "Complete the short check, compare with a partner if appropriate, and name one thing they can now do or one question they still have.",
             "The teacher has observable evidence tied to the success criteria, not just task completion.",
             "What can you show now, and what would you like to practise again?"),
        ]
        for order, phase, title, minutes, teacher, students, look_fors, prompt in steps:
            resource_state = "linked_unverified" if order == 3 and resources else "none"
            resource_note = (
                "Candidate linked resources are available in lesson_resource_guidance. Verify the destination, title, instructional fit, and scope before showing or printing."
                if resources and order == 3 else
                "Teacher-led step; no external resource is required."
            )
            con.execute(
                """INSERT INTO lesson_steps
                (lesson_id, step_order, phase, title, minutes, teacher_actions, student_actions, look_fors, assessment_prompt, resource_state, resource_note)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (blueprint_id, order, phase, title, minutes, teacher, students, look_fors, prompt, resource_state, resource_note),
            )

        worksheet_specs = [
            (1, profile["worksheet_1"][0], f"{profile['worksheet_1'][1]} The page should use examples drawn from the exact curriculum target: {topic['lesson_topic']}.",
             "guided practice / visual response"),
            (2, profile["worksheet_2"][0], f"{profile['worksheet_2'][1]} Keep the core items accessible to the stated grade band and leave room for a teacher-recorded observation.",
             "independent application / explanation"),
        ]
        for order, title, purpose_and_direction, activity_type in worksheet_specs:
            answer = (
                "Teacher key should identify acceptable representations or responses, not only a single final answer. Include worked examples for objective items and note when a drawing, explanation, or personal response is open-ended."
            )
            visual = (
                f"Use a calm farm-school visual system with large writing or drawing areas, no decorative text that competes with the target, and clear labels for {', '.join(keywords[:5])}. Provide a black-and-white print-safe version."
            )
            diff = (
                "Support: reduce item count, add a worked example, offer picture/word banks, and allow dictation or oral response. Extension: add one create-your-own item or ask for a second strategy."
            )
            prompt = (
                f"Create a one-page printable worksheet for {topic['grade']} on {topic['lesson_topic']}. Activity type: {activity_type}. "
                f"Student directions: {purpose_and_direction} Include an answer/key guidance section for the teacher, accessible typography, generous response space, and a differentiated support option. Mark open-ended items clearly."
            )
            con.execute(
                """INSERT INTO worksheet_briefs
                (lesson_id, worksheet_order, title, purpose, activity_type, child_directions, answer_key_guidance,
                 visual_notes, differentiation, materials_json, generation_prompt, status, review_flags)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (blueprint_id, order, title, purpose_and_direction, activity_type, purpose_and_direction, answer, visual, diff,
                 json_text(["printed worksheet", "pencil or crayon", "optional manipulatives from the lesson"]), prompt,
                 "editorial_draft", "content_and_layout_review"),
            )

        prompt_specs = [
            ("practice", f"Find a free, printable {topic['grade']} practice activity for {topic['lesson_topic']}; show the exact item range, publisher, and direct URL; exclude generic resource libraries."),
            ("demonstration", f"Find a teacher-usable demonstration or worked-example resource for {topic['lesson_topic']} for {topic['grade']}; identify the exact segment that matches the target and any scope mismatch."),
            ("visual", f"Find an accessible visual, picture-card set, or anchor-chart resource for teaching {topic['lesson_topic']}; prefer a direct printable or classroom-ready page."),
            ("intervention", f"Find a targeted support activity for students who are not yet showing {topic['lesson_topic']}; include prerequisite skill, adult prompt, and how the resource avoids teaching beyond the stated scope."),
        ]
        for prompt_type, prompt in prompt_specs:
            con.execute(
                "INSERT INTO lesson_search_prompts (lesson_id, prompt_type, prompt, rationale) VALUES (?, ?, ?, ?)",
                (blueprint_id, prompt_type, prompt, "Fallback research prompt; any resulting resource must be opened, scope-checked, and recorded before publication."),
            )

        for index, song in enumerate(songs):
            phase = "Connect" if index == 0 else "Practice"
            rationale = (
                f"Use {song['song_name']} as an optional engagement or transition cue only when its actions and language reinforce {topic['lesson_topic']}. "
                "Check the song record, audio destination, and classroom fit before use."
            )
            con.execute(
                """INSERT INTO lesson_song_guidance
                (lesson_id, song_id, relevance, use_in_phase, teacher_rationale) VALUES (?, ?, ?, ?, ?)""",
                (blueprint_id, song["id"], song["relevance"] or "secondary", phase, rationale),
            )

        for resource in resources:
            verification_state = "verified" if resource["verified"] else "unverified"
            rationale = f"Candidate {resource['type'] or 'resource'} for {topic['lesson_topic']}; use only if it supports the stated goal and grade band."
            scope_note = "Existing database record is not marked verified; confirm URL, title, publisher, access, and scope during review."
            con.execute(
                """INSERT INTO lesson_resource_guidance
                (lesson_id, resource_id, relevance, use_in_phase, teacher_rationale, verification_state, scope_note)
                VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (blueprint_id, resource["id"], resource["relevance"] or "secondary", "Practice", rationale, verification_state, scope_note),
            )

        standards_present = int(bool(topic.get("ontario_code") or topic.get("us_code")))
        linked_songs = len(songs)
        linked_resources = len(resources)
        score = 60 + 10 * standards_present + 10 + 10 + 5 + 5
        if linked_songs:
            score += 5
        if linked_resources:
            score += 5
        score = min(score, 100)
        review_flags = flags + (["verify_linked_resources"] if resources else [])
        con.execute(
            """INSERT INTO lesson_review
            (lesson_id, source_topic_present, standards_present, linked_songs_count, linked_resources_count,
             step_count, worksheet_count, search_prompt_count, completeness_score, review_state,
             automated_flags, reviewer_notes, reviewed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (blueprint_id, 1, standards_present, linked_songs, linked_resources, 4, 2, 4, score,
             "ready_for_review", "; ".join(review_flags) if review_flags else "none",
             "Review the source row, scope/alignment, optional links, and editorial wording with a practising teacher before publication.", None),
        )

    return len(topics)


def main():
    if not DB_PATH.exists():
        raise SystemExit(f"Database not found: {DB_PATH}")
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    try:
        with con:
            create_tables(con)
            count = build(con)
        print(f"Built lesson authoring layer for {count} curriculum topics")
        for table in ["lesson_blueprints", "lesson_steps", "worksheet_briefs", "lesson_search_prompts", "lesson_song_guidance", "lesson_resource_guidance", "lesson_review"]:
            print(f"{table}: {con.execute(f'SELECT COUNT(*) FROM {table}').fetchone()[0]}")
    finally:
        con.close()


if __name__ == "__main__":
    main()
