-- ============================================================
-- Curriculum Topic Assembly Query
-- Returns everything needed to generate a curriculum page
-- for a single topic: lesson info, songs, resources, standards,
-- staff characters, and circle time activities.
-- ============================================================

-- Change this ID to the curriculum_topic you want
WITH target AS (
    SELECT id, subject, grade, lesson_topic, skill_statement,
           ontario_code, us_code, teaching_source, resource_link,
           teaching_notes, practice_resource, taught
    FROM curriculum_topics
    WHERE id = 1  -- ← CHANGE THIS TOPIC ID
)

-- 1. CORE LESSON INFO
SELECT '=== LESSON INFO ===' AS section, NULL AS item, NULL AS detail;
SELECT 'Subject' AS field, subject AS value FROM target
UNION ALL
SELECT 'Grade', grade FROM target
UNION ALL
SELECT 'Topic', lesson_topic FROM target
UNION ALL
SELECT 'Skill', skill_statement FROM target
UNION ALL
SELECT 'Ontario Code', ontario_code FROM target
UNION ALL
SELECT 'US Code', us_code FROM target
UNION ALL
SELECT 'Taught?', COALESCE(taught, 'No') FROM target;

-- 2. LINKED SONGS (with lyrics, actions, audio URL)
SELECT '=== SONGS ===' AS section;
SELECT s.song_name, s.actions, s.lyrics, s.url, sc.relevance,
       s.suggested_staff, s.suggested_students
FROM songs s
JOIN songs_curriculum sc ON s.id = sc.song_id
WHERE sc.curriculum_id = (SELECT id FROM target)
ORDER BY sc.relevance, s.song_name;

-- 3. LINKED RESOURCES (worksheets, videos, activities, games)
SELECT '=== RESOURCES ===' AS section;
SELECT r.name, r.type, r.url, r.free, r.paywalled,
       r.description, rt.relevance
FROM resources r
JOIN resources_topics rt ON r.id = rt.resource_id
WHERE rt.topic_id = (SELECT id FROM target)
ORDER BY rt.relevance, r.type, r.name;

-- 4. CORRESPONDING STANDARDS (full text)
SELECT '=== STANDARDS ===' AS section;
SELECT sc.jurisdiction, sc.code, sc.full_text, sc.strand_description
FROM standards_codes sc
WHERE (sc.code = (SELECT ontario_code FROM target))
   OR (sc.code = (SELECT us_code FROM target))
ORDER BY sc.jurisdiction;

-- 5. CIRCLE TIME SONGS FOR THIS TOPIC
SELECT '=== CIRCLE TIME ===' AS section;
SELECT cts.song_name, cts.actions, cts.age_group, cts.teaches,
       cts.hdh_focus, ctsc.relevance
FROM circle_time_songs cts
JOIN circle_time_songs_curriculum ctsc
    ON cts.id = ctsc.circle_time_song_id
WHERE ctsc.curriculum_topic_id = (SELECT id FROM target)
ORDER BY ctsc.relevance, cts.song_name;

-- 6. STAFF CHARACTER WHO TEACHES THIS SUBJECT
SELECT '=== STAFF ===' AS section;
SELECT st.name, st.species, st.teaches, st.grade_band,
       st.shown_doing, st.strengths, st.identity_lock,
       st.wardrobe_props
FROM staff st
WHERE st.teaches LIKE '%' || (SELECT subject FROM target) || '%'
   OR st.grade_band LIKE '%' || (SELECT grade FROM target) || '%';

-- 7. STUDENT CHARACTERS FOR THIS GRADE
SELECT '=== STUDENTS ===' AS section;
SELECT s.name, s.species, s.personality, s.signature_color,
       s.learns_through, s.wardrobe_props
FROM students s
WHERE s.learns_through LIKE '%' || (SELECT subject FROM target) || '%';

-- 8. WEEKLY PACING (from Excel Curriculum Map)
SELECT '=== PACING ===' AS section;
SELECT week, month, strand, lesson_name, ontario_code
FROM curriculum_map
WHERE grade = (SELECT grade FROM target)
  AND strand = (SELECT subject FROM target)
ORDER BY week;