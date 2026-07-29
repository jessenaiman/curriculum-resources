# Teacher Resource Research Prompt for LLM

## Context & Purpose

You are helping populate a **minimal teacher preparation website** where teachers find **printable resources between classes**. Teachers:
- Use **printouts only** (no digital boards, no PowerPoint, no apps during class)
- Need **PDFs or images ready to print** immediately
- Don't want to learn new UIs or click through custom buttons
- Handle printing their own way (browser print, Adobe Reader, etc.)
- Prepare lessons in short windows between classes (5-10 minutes max)

## Critical Requirements for ALL Resources

### MUST HAVE:
1. **Direct download links** to PDF files (not landing pages requiring navigation)
2. **Print-ready format**: PDF, PNG, or JPG only
3. **No login required** to access/download
4. **No interactive elements** (apps, web-based tools, clickable activities)
5. **No presentation formats** (PowerPoint, Google Slides, Prezi)
6. **Clear grade level alignment** (Grade 1 or Grade 2)
7. **Exact skill match** to the lesson objective described
8. **From reputable sources**: education publishers, universities, established literacy/math organizations, government education departments

### MUST NOT INCLUDE:
- Apps or web applications (even if "free")
- PowerPoint/Google Slides presentations
- Resources requiring account creation
- Landing pages without direct file links
- Video-only resources (teachers need printables, not videos to show)
- Resources with watermarks blocking printing
- Materials requiring special software beyond PDF reader

---

## Task: Find Print-Ready Resources for Two Lessons

### LESSON 1: Long & Short Vowels (Literacy/Phonics)

#### Grade 1 Needs (Oral Focus → Printable Support)
**Current Problem**: All 4 steps show `resourceState: none` — ZERO printable materials

**What Teachers Need to Print**:
1. **Picture card sort sheets** (8-12 images students can circle/cut to sort long vs short vowel words)
2. **Response recording sheets** (simple worksheet where students mark/draw long vs short for words teacher says aloud)
3. **Partner check worksheets** (paired practice with picture prompts)
4. **Exit ticket slips** (half-page quick checks with 5 pictures/words)

**Search Queries to Use**:
- "grade 1 long short vowel picture sort worksheet pdf"
- "long and short vowel listening activity printable"
- "vowel sound discrimination worksheet grade 1 free"
- "long short vowel exit ticket grade 1 pdf"
- "phonics vowel sound sorting sheets printable"

**Acceptable Sources**: K5 Learning, Education.com (free section), Reading Rockets, UFLI Foundations (home practice PDFs only), Literacy Inc., state DOE websites

**Target**: Find **4 distinct printable resources** covering:
- 1 picture sort sheet
- 1 response/recording sheet  
- 1 partner practice sheet
- 1 exit ticket set

---

#### Grade 2 Needs (Reading/Print-Based)
**Current Problem**: Uses UFLI PowerPoint slides — **NOT PRINTABLE**

**What Teachers Need Instead**:
1. **Word sort worksheets** (students read and sort printed words into long/short columns)
2. **Decoding practice sheets** (lists of one-syllable words to read and mark vowel type)
3. **Pattern anchor charts** (reference posters showing long/short patterns with examples)
4. **Independent practice packets** (3-5 pages mixing word reading, sorting, and simple sentences)

**Search Queries to Use**:
- "grade 2 long short vowel word sort worksheet pdf"
- "CVC CVCe sorting worksheet printable grade 2"
- "long and short vowel patterns anchor chart pdf"
- "one syllable vowel decoding practice grade 2 pdf"
- "vowel pattern independent practice grade 2 printable"

**Replace These Current Resources**:
- REMOVE: UFLI PowerPoint slides (all steps using .pptx files)
- KEEP: UFLI Home Practice PDF (if available) — this is already print-ready

**Target**: Find **3 distinct printable resources** to replace PowerPoint:
- 1 word sort worksheet
- 1 decoding practice sheet
- 1 anchor chart/reference poster (full page, printable)

---

### LESSON 2: Addition & Subtraction Word Problems (Mathematics)

#### Grade 1 Needs (Concrete Models Within 20)
**Current Status**: Mostly good — has K5 Learning PDF worksheet

**What's Missing**:
1. **Manipulative recording sheets** (templates for drawing counters/number frames)
2. **Story problem mats** (work mats where students build problems with physical counters, then laminate/reuse)
3. **Equation matching cards** (cut-and-match: story → model → equation)
4. **Additional problem sets** (backup worksheets when K5 isn't enough)

**Current Resources to Evaluate**:
- Number Frames app — **PROBLEM**: This is an app, not printable
  - **ACTION**: Find printable number frame templates instead
- K5 Learning worksheet — **KEEP** (already PDF, print-ready)

**Search Queries to Use**:
- "number frame template printable pdf grade 1"
- "addition subtraction story problem mat printable"
- "word problem work mat counters grade 1 pdf"
- "math story problem equation matching cards pdf"
- "grade 1 addition subtraction within 20 extra worksheets pdf"

**Target**: Find **3 printable resources**:
- 1 number frame template (blank, reusable)
- 1 story problem work mat
- 1 backup worksheet set (different from K5)

---

#### Grade 2 Needs (One- and Two-Step Within 50)
**Current Status**: Partially good — has K5 Learning but uses Number Pieces app

**What's Missing**:
1. **Place value block templates** (printable base-10 blocks for modeling)
2. **Two-step problem graphic organizers** (structured sheets breaking down Step 1 → Step 2)
3. **Multi-step word problem sets within 50** (Ontario-aligned, not US within-100)
4. **Solution explanation frames** (sentence starters for explaining each step)

**Current Resources to Evaluate**:
- Number Pieces app — **PROBLEM**: This is an app
  - **ACTION**: Find printable place value block templates
- K5 Learning worksheet — **KEEP** but note it's within-20 (good for entry/diagnostic)

**Search Queries to Use**:
- "base ten blocks template printable pdf"
- "two step word problem graphic organizer grade 2 pdf"
- "addition subtraction within 50 word problems grade 2 ontario"
- "multi step problem solving template grade 2 printable"
- "explain math thinking sentence frames grade 2 pdf"

**Target**: Find **4 printable resources**:
- 1 place value block template
- 1 two-step graphic organizer
- 1 within-50 problem set (Ontario range)
- 1 explanation/writing frame

---

## Final Deliverable Structure

Return results in this exact format for easy parsing:

```markdown
## LESSON: [Lesson Name]

### GRADE [1/2]

#### NEW PRINTABLE RESOURCES

| Resource # | Title | Direct PDF URL | Skill Match | Pages | Print Notes |
|------------|-------|----------------|-------------|-------|-------------|
| 1 | | | | | |
| 2 | | | | | |

#### RESOURCES TO REMOVE (Not Printable)
| Current Resource | URL | Reason for Removal | Replacement Found? |
|------------------|-----|-------------------|-------------------|
| | | | Yes/No |

#### VERIFICATION CHECKLIST
- [ ] All URLs tested and download directly (no landing pages)
- [ ] No login required
- [ ] File format is PDF/PNG/JPG only
- [ ] Grade level matches exactly
- [ ] Skill alignment confirmed
- [ ] Source is reputable (publisher/university/org)
```

---

## Quality Control Rules

1. **Test Every Link**: Before submitting, verify each URL downloads a file directly (doesn't redirect to a homepage or require clicking "Download")

2. **No "Freemium" Traps**: Avoid resources that advertise as free but require payment/login to actually download

3. **Print-Friendly Check**: Ensure PDFs aren't designed for screen-only use (no embedded videos, no interactive form fields that don't print)

4. **Copyright Safe**: Only link to resources explicitly marked as free for educational use

5. **Ontario Alignment Note**: For math, flag if resources use US ranges (within 100) vs Ontario ranges (within 50 for Grade 2)

6. **Quantity Over Perfection**: Better to return 3 verified working links than 10 broken ones

---

## Priority Order

Complete research in this order:
1. **Grade 1 Long & Short Vowels** (CRITICAL: currently 0% printable)
2. **Grade 2 Long & Short Vowels** (HIGH: remove PowerPoint dependency)
3. **Grade 1 Word Problems** (MEDIUM: add manipulatives printables)
4. **Grade 2 Word Problems** (MEDIUM: add place value printables)

Stop after completing each grade level if token limits approached. Quality over completeness.
