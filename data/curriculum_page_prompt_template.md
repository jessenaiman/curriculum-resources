# Curriculum Page Generator — Prompt Template

You are generating a classroom-ready curriculum page for the "Old MacDonald's School" teacher resource app. Use the structured data below to create a complete, printable page for the teacher.

## Rules
- Write for an early childhood educator (ECE, Kindergarten, Grade 1-3)
- Use warm, encouraging language — this is a magical farm-school world
- Include the staff/student puppets where mentioned (they bring the lesson to life)
- Make it practical: a teacher should be able to use this page immediately
- Mark which parts are optional extensions vs. core lesson

## Input Data

### Lesson Info
- **Subject:** {SUBJECT}
- **Grade:** {GRADE}
- **Topic:** {TOPIC}
- **Skill Statement:** {SKILL}
- **Ontario Code:** {ONTARIO_CODE}
- **US Common Core:** {US_CODE}
- **Taught Status:** {TAUGHT}

### Songs for This Topic
{SONGS_LIST}

Each song has: name, lyrics, actions, audio URL, suggested staff, suggested students, and relevance (primary/secondary).

### Resources (Worksheets, Videos, Activities)
{RESOURCES_LIST}

Each resource has: name, type (worksheet/video/activity/game), URL, and whether it's free.

### Standards
{STANDARDS_LIST}

### Staff Characters
{STAFF_LIST}

Each staff member has: name, species, what they teach, personality, costume/props.

### Students
{STUDENTS_LIST}

Each student has: name, species, personality, signature color, learning style.

### Weekly Pacing
{PACING_LIST}

## Output Format

Generate the following sections:

### 1. Lesson Overview
Brief 2-3 sentence summary of what this lesson teaches and why it matters.

### 2. Learning Goals
- What students will know
- What students will be able to do
- Ontario/US standards addressed

### 3. Materials Needed
List of everything the teacher needs: songs (with audio link), worksheets, props, puppets, etc.

### 4. Lesson Plan
Step-by-step instructions:
- **Opening (5 min):** Song or activity to introduce the topic, led by the suggested staff puppet
- **Direct Instruction (10 min):** Core teaching with the primary song, using actions/lyrics
- **Guided Practice (10 min):** Worksheet or activity from resources
- **Independent Practice (5-10 min):** Student-led exploration or video
- **Closing (5 min):** Wrap-up song or reflection

### 5. Differentiation
- For struggling learners: simplify or add more sensory support
- For advanced learners: extension activity or challenge
- For ELL students: vocabulary support

### 6. Assessment Ideas
Quick checks for understanding: observation checklist, exit ticket, or performance task.

### 7. Cross-Curricular Connections
How this topic connects to other subjects (math in music, science in movement, etc.)

### 8. Character Moment
A short narrative moment featuring the suggested staff puppet and student characters — what would Old MacDonald say? How would Mr Rusty introduce the rhythm? What would Hopper the rabbit do?