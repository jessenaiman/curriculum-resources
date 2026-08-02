-- Lesson content assembly query
--
-- Change :topic_id to a curriculum_topics.id.  The query is intentionally
-- split into result sets so a page builder can preserve the distinction
-- between source data, editorial lesson content, optional links, and review
-- notes.

-- 1. Core lesson blueprint + source row
SELECT
    b.id AS lesson_id,
    b.slug,
    b.title,
    b.subject,
    b.category,
    b.grade_band,
    b.summary,
    b.purpose,
    b.lesson_mode,
    b.duration_minutes,
    b.learning_goals_json,
    b.success_criteria_json,
    b.vocabulary_json,
    b.materials_json,
    b.teacher_prep,
    b.assessment_plan,
    b.differentiation_support,
    b.extension,
    b.cross_curricular,
    b.staff_lead,
    b.student_characters,
    b.character_rationale,
    b.editorial_status,
    b.review_state,
    t.skill_statement,
    t.teaching_source,
    t.resource_link,
    t.teaching_notes,
    t.practice_resource,
    t.ontario_code,
    t.us_code,
    t.alignment_notes,
    t.taught,
    b.source_provenance
FROM lesson_blueprints b
JOIN curriculum_topics t ON t.id = b.curriculum_topic_id
WHERE b.curriculum_topic_id = :topic_id;

-- 2. Ordered lesson steps
SELECT
    s.step_order,
    s.phase,
    s.title,
    s.minutes,
    s.teacher_actions,
    s.student_actions,
    s.look_fors,
    s.assessment_prompt,
    s.resource_state,
    s.resource_note
FROM lesson_steps s
JOIN lesson_blueprints b ON b.id = s.lesson_id
WHERE b.curriculum_topic_id = :topic_id
ORDER BY s.step_order;

-- 3. Worksheet generation briefs
SELECT
    w.worksheet_order,
    w.title,
    w.purpose,
    w.activity_type,
    w.child_directions,
    w.answer_key_guidance,
    w.visual_notes,
    w.differentiation,
    w.materials_json,
    w.generation_prompt,
    w.status,
    w.review_flags
FROM worksheet_briefs w
JOIN lesson_blueprints b ON b.id = w.lesson_id
WHERE b.curriculum_topic_id = :topic_id
ORDER BY w.worksheet_order;

-- 4. Optional songs, with source record retained for inspection
SELECT
    sg.relevance,
    sg.use_in_phase,
    sg.teacher_rationale,
    s.id AS song_id,
    s.song_name,
    s.artist,
    s.actions,
    s.instructions,
    s.lyrics,
    s.url,
    s.verified
FROM lesson_song_guidance sg
JOIN lesson_blueprints b ON b.id = sg.lesson_id
JOIN songs s ON s.id = sg.song_id
WHERE b.curriculum_topic_id = :topic_id
ORDER BY CASE sg.relevance WHEN 'primary' THEN 0 ELSE 1 END, s.song_name;

-- 5. Optional resources; verification state is deliberately explicit
SELECT
    rg.relevance,
    rg.use_in_phase,
    rg.teacher_rationale,
    rg.verification_state,
    rg.scope_note,
    r.id AS resource_id,
    r.name,
    r.type,
    r.url,
    r.description,
    r.free,
    r.paywalled,
    r.verified
FROM lesson_resource_guidance rg
JOIN lesson_blueprints b ON b.id = rg.lesson_id
JOIN resources r ON r.id = rg.resource_id
WHERE b.curriculum_topic_id = :topic_id
ORDER BY CASE rg.relevance WHEN 'primary' THEN 0 ELSE 1 END, r.name;

-- 6. Targeted fallback search prompts
SELECT p.prompt_type, p.prompt, p.rationale
FROM lesson_search_prompts p
JOIN lesson_blueprints b ON b.id = p.lesson_id
WHERE b.curriculum_topic_id = :topic_id
ORDER BY CASE p.prompt_type
    WHEN 'practice' THEN 1
    WHEN 'demonstration' THEN 2
    WHEN 'visual' THEN 3
    WHEN 'intervention' THEN 4
    ELSE 5 END;

-- 7. Review record
SELECT
    r.completeness_score,
    r.review_state,
    r.automated_flags,
    r.reviewer_notes,
    r.source_topic_present,
    r.standards_present,
    r.linked_songs_count,
    r.linked_resources_count,
    r.step_count,
    r.worksheet_count,
    r.search_prompt_count,
    r.reviewed_at
FROM lesson_review r
JOIN lesson_blueprints b ON b.id = r.lesson_id
WHERE b.curriculum_topic_id = :topic_id;
