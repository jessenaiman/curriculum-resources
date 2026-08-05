# generated_lessons.db — Generated Content Schema (ER Diagram)

> **Derived / regeneratable.** These tables are LLM-generated outputs produced
> from the source DB (curriculum.db) by `populate_lesson_content.py`.
> They are safe to delete and regenerate; they are NOT source data.
> Kept in a separate file so the source DB stays clean for the AI SQL-expert.

```mermaid
erDiagram
    LESSON_BLUEPRINTS ||--o{ LESSON_STEPS : "has"
    LESSON_BLUEPRINTS ||--o{ LESSON_SONG_GUIDANCE : "uses"
    LESSON_BLUEPRINTS ||--o{ LESSON_RESOURCE_GUIDANCE : "uses"
    LESSON_BLUEPRINTS ||--o{ LESSON_SEARCH_PROMPTS : "has"
    LESSON_BLUEPRINTS ||--o{ LESSON_REVIEW : "reviewed by"
    LESSON_BLUEPRINTS ||--o{ WORKSHEET_BRIEFS : "generates"
    LESSON_SONG_GUIDANCE }o--|| SONGS_REF : "references"
    LESSON_RESOURCE_GUIDANCE }o--|| RESOURCES_REF : "references"

    LESSON_BLUEPRINTS {
        int id PK
        int curriculum_topic_id UK
        text slug UK
        text title
        text subject
        text grade_band
        text summary
        text purpose
        text lesson_mode
        int duration_minutes
        text learning_goals_json
        text success_criteria_json
        text vocabulary_json
        text materials_json
        text teacher_prep
        text assessment_plan
        text differentiation_support
        text extension
        text cross_curricular
        text staff_lead
        text student_characters
        text source_provenance
        text editorial_status
        text review_state
        int version
    }
    LESSON_STEPS {
        int id PK
        int lesson_id FK
        int step_order
        text phase
        text title
        int minutes
        text teacher_actions
        text student_actions
        text look_fors
        text assessment_prompt
    }
    LESSON_SONG_GUIDANCE {
        int id PK
        int lesson_id FK
        int song_id FK
        text relevance
        text use_in_phase
        text teacher_rationale
    }
    LESSON_RESOURCE_GUIDANCE {
        int id PK
        int lesson_id FK
        int resource_id FK
        text relevance
        text use_in_phase
        text teacher_rationale
        text verification_state
    }
    LESSON_SEARCH_PROMPTS {
        int id PK
        int lesson_id FK
        text prompt_type
        text prompt
        text rationale
    }
    LESSON_REVIEW {
        int id PK
        int lesson_id UK FK
        int source_topic_present
        int standards_present
        int linked_songs_count
        int linked_resources_count
        int step_count
        int worksheet_count
        int completeness_score
        text review_state
        text reviewer_notes
    }
    WORKSHEET_BRIEFS {
        int id PK
        int lesson_id FK
        int worksheet_order
        text title
        text purpose
        text activity_type
        text child_directions
        text answer_key_guidance
        text differentiation
        text materials_json
        text generation_prompt
        text status
    }
    SONGS_REF {
        int id PK
    }
    RESOURCES_REF {
        int id PK
    }
```
