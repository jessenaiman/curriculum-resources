# Resource Fix Plan: Making 2 Lessons Print-Ready

## Current Status

### Lesson 1: Long & Short Vowels
- **Grade 1**: 0% print-ready (all 4 steps have `resourceState: none`)
- **Grade 2**: 33% print-ready (uses PowerPoint slides in 3 steps, only 1 PDF)

### Lesson 2: Addition & Subtraction Word Problems  
- **Grade 1**: 67% print-ready (has K5 worksheet, but uses Number Frames app)
- **Grade 2**: 50% print-ready (has K5 worksheet, but uses Number Pieces app)

## Critical Issues

### What's NOT Useful for Teachers:
1. **PowerPoint slides** (.pptx files) - teachers don't have digital boards
2. **Web apps** (Number Frames, Number Pieces) - can't be printed
3. **Oral-only lessons** with no printable support materials
4. **Alternative search prompts** - teachers need resources NOW, not search instructions

### What IS Useful:
1. **Direct PDF links** (K5 Learning worksheets work perfectly)
2. **Printable templates** (number frames, place value blocks)
3. **Work mats** (laminate-and-reuse manipulatives)
4. **Exit tickets** (quick assessment printables)

## Next Steps

### Step 1: Pass Prompt to Research LLM
Give `/workspace/RESOURCE_RESEARCH_PROMPT.md` to another LLM process with web search capabilities. The prompt specifies:
- Exact search queries for each resource type needed
- Acceptable sources (K5 Learning, Reading Rockets, etc.)
- Deliverable format (table with direct PDF URLs)
- Quality control rules (test every link, no login required)

### Step 2: Review Research Results
When the research LLM returns results:
1. Verify all links download directly (no landing pages)
2. Confirm file formats are PDF/PNG/JPG only
3. Check grade level alignment matches exactly
4. Ensure no login/payment required

### Step 3: Update Lesson Files
Once verified resources are found, update the MDX files:

**For Grade 1 Long & Short Vowels** (add 4 new resources):
- Replace all `resourceState: none` with actual printable resources
- Add picture sort sheets, recording sheets, partner practice, exit tickets

**For Grade 2 Long & Short Vowels** (replace PowerPoint):
- Remove UFLI PowerPoint links from 3 steps
- Add word sort worksheets, decoding practice, anchor charts

**For Grade 1 Word Problems** (add manipulatives printables):
- Replace Number Frames app with printable number frame templates
- Add story problem work mats

**For Grade 2 Word Problems** (add place value printables):
- Replace Number Pieces app with printable base-10 block templates
- Add two-step graphic organizers

### Step 4: Add Print Functionality (Optional Enhancement)
Consider adding a simple "Print This Page" button that:
- Uses browser's native print dialog
- Hides navigation elements
- Formats content for letter/A4 paper

## Success Criteria

After fixes, both lessons should have:
- ✅ 100% of steps with printable resources (PDF/PNG/JPG)
- ✅ Zero app dependencies
- ✅ Zero PowerPoint dependencies
- ✅ Direct download links (no landing pages)
- ✅ No login requirements
- ✅ Clear print notes (B&W vs color, cut lines, etc.)

## Files to Modify

1. `/workspace/content/lessons/long-short-vowels.mdx`
   - Grade 1: Add 4 printable resources
   - Grade 2: Replace 3 PowerPoint resources with printables

2. `/workspace/content/lessons/addition-subtraction-word-problems.mdx`
   - Grade 1: Replace app with printable templates
   - Grade 2: Replace app with printable templates

## Timeline Estimate

- Research LLM: 10-15 minutes to find and verify resources
- Manual review: 5 minutes to test links
- File updates: 10 minutes per lesson file
- **Total: ~30-40 minutes** to achieve 2 perfect print-ready lessons
