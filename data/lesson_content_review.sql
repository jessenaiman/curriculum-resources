-- Review dashboard for the generated lesson-authoring layer.

-- Overall counts
SELECT 'curriculum_topics' AS item, COUNT(*) AS count FROM curriculum_topics
UNION ALL SELECT 'lesson_blueprints', COUNT(*) FROM lesson_blueprints
UNION ALL SELECT 'lesson_steps', COUNT(*) FROM lesson_steps
UNION ALL SELECT 'worksheet_briefs', COUNT(*) FROM worksheet_briefs
UNION ALL SELECT 'lesson_search_prompts', COUNT(*) FROM lesson_search_prompts
UNION ALL SELECT 'lesson_song_guidance', COUNT(*) FROM lesson_song_guidance
UNION ALL SELECT 'lesson_resource_guidance', COUNT(*) FROM lesson_resource_guidance
UNION ALL SELECT 'lesson_review', COUNT(*) FROM lesson_review;

-- Review flags that require human attention
SELECT automated_flags, COUNT(*) AS lesson_count
FROM lesson_review
GROUP BY automated_flags
ORDER BY lesson_count DESC, automated_flags;

-- Topics with no linked song or resource are still usable: their core lesson
-- is teacher-led, but a reviewer may want to curate optional links later.
SELECT
    b.id AS lesson_id,
    b.curriculum_topic_id,
    b.grade_band,
    b.subject,
    b.title,
    r.completeness_score,
    r.automated_flags
FROM lesson_blueprints b
JOIN lesson_review r ON r.lesson_id = b.id
WHERE r.automated_flags LIKE '%no_linked_song%'
   OR r.automated_flags LIKE '%no_linked_resource%'
ORDER BY b.subject, b.grade_band, b.title;

-- Resources are never treated as publish-ready merely because they are linked.
SELECT
    b.title,
    r.name,
    rg.verification_state,
    rg.scope_note,
    r.url
FROM lesson_resource_guidance rg
JOIN lesson_blueprints b ON b.id = rg.lesson_id
JOIN resources r ON r.id = rg.resource_id
WHERE rg.verification_state <> 'verified'
ORDER BY b.title, r.name;

-- Structural QA: every lesson should have four steps, two worksheet briefs,
-- and four search prompts.
SELECT b.id, b.title,
       (SELECT COUNT(*) FROM lesson_steps s WHERE s.lesson_id = b.id) AS steps,
       (SELECT COUNT(*) FROM worksheet_briefs w WHERE w.lesson_id = b.id) AS worksheets,
       (SELECT COUNT(*) FROM lesson_search_prompts p WHERE p.lesson_id = b.id) AS search_prompts
FROM lesson_blueprints b
WHERE (SELECT COUNT(*) FROM lesson_steps s WHERE s.lesson_id = b.id) <> 4
   OR (SELECT COUNT(*) FROM worksheet_briefs w WHERE w.lesson_id = b.id) <> 2
   OR (SELECT COUNT(*) FROM lesson_search_prompts p WHERE p.lesson_id = b.id) <> 4;
