// Cast data for the Cast Guide page. Sourced from content/staff/*.md,
// public/CAST_AND_ROLES.md and the working-canon character guide PDF —
// consolidated here as a typed array, the same lightweight pattern the old
// CREW array in HomeExplorer.tsx used, rather than parsing markdown at build time.

export type StaffMember = {
  key: string; // patch filename, without extension
  name: string;
  species: string;
  role: string;
  gradeBand: string;
  personality: string[];
  worksheetLens: string;
  guides: string[];
  recognizable: string[];
};

export type Student = {
  key: string;
  name: string;
  species: string;
  personality: string[];
  learningStrengths: string[];
  pairsWith: string[];
  recognizable: string[];
  note?: string;
};

export const STAFF: StaffMember[] = [
  {
    key: "old-macdonald", name: "Old MacDonald", species: "Human adult", role: "Headmaster & band leader",
    gradeBand: "Whole school",
    personality: ["Welcoming, attentive and playful", "Anchors whole-school gatherings", "Invites participation without taking over"],
    worksheetLens: "Whole-school review — community, review, cross-curricular checks, shared challenges.",
    guides: ["Morning meetings and assemblies", "Reading and shared stories", "Band leadership and community events"],
    recognizable: ["Straw hat and white beard", "Red plaid shirt and denim overalls", "Book for lessons; banjo or guitar for music"],
  },
  {
    key: "miss-puddles", name: "Miss Puddles", species: "Duck adult", role: "Daycare teacher",
    gradeBand: "Daycare (0–2) & Preschool (3–4)",
    personality: ["Nurturing, patient and practical", "Meets younger learners at their level", "Turns routines into calm participation"],
    worksheetLens: "Early learning & SEL — routines, sharing, simple instructions, art, calm participation.",
    guides: ["Play-based early learning", "Classroom routines and sharing", "Fingerplays, art and simple movement"],
    recognizable: ["Pale-yellow duck", "Blue gingham dress and bandana", "Whistle and rolled mat"],
  },
  {
    key: "mr-rusty", name: "Mr Rusty", species: "Horse adult", role: "Music & dance teacher",
    gradeBand: "Kindergarten – Grade 1/2",
    personality: ["Warm, rhythmic and encouraging", "Grounded energy rather than showmanship", "Helps shy students join in"],
    worksheetLens: "Rhythm & movement — music, patterns, sequencing, syllables, fluency.",
    guides: ["Music, singing and fiddle", "Movement and dance sequences", "Patterns, rhythm, syllables and fluency"],
    recognizable: ["Warm brown horse", "Dark vest and blue bandana", "Fiddle and bow when music is the focus"],
  },
  {
    key: "miss-hayley", name: "Miss Hayley", species: "Human adult", role: "Grade 1/2 & drama",
    gradeBand: "Grade 1/2",
    personality: ["Expressive, encouraging and imaginative", "Gets the class singing", "Uses imagination, drama and class plays"],
    worksheetLens: "Language & communication — phonics, reading, writing, vocabulary, drama.",
    guides: ["Phonics, reading and vocabulary", "Writing and oral communication", "Drama, storytelling and performance"],
    recognizable: ["Cowboy hat, denim overalls and boots", "Friendly face without painted red cheeks"],
  },
  {
    key: "mr-sam", name: "Mr Sam", species: "Pig adult", role: "Math & building",
    gradeBand: "Grade 1/2",
    personality: ["Inventive, patient and hands-on", "Makes room for “I don’t know yet”", "Builds to understand how things work"],
    worksheetLens: "Math & STEM — number sense, measurement, geometry, science, building.",
    guides: ["Number sense and operations", "Measurement and geometry", "Science, engineering and practical problem-solving"],
    recognizable: ["Pink pig with round glasses", "Green vest, bow tie and pocket watch", "Books, pencils or tools only when relevant"],
  },
  {
    key: "mr-maisy", name: "Mr Maisy", species: "Cow adult", role: "Physical education teacher",
    gradeBand: "Whole school",
    personality: ["Energetic, encouraging and team-minded", "Models safe movement", "Celebrates effort and participation"],
    worksheetLens: "Physical education — movement, health, teamwork, safety, games.",
    guides: ["Physical education and gross motor skills", "Games, teamwork and outdoor activity", "Health, safety and body awareness"],
    recognizable: ["Black-and-white cow", "Red plaid shirt and denim overalls"],
  },
  {
    key: "mr-puddles", name: "Mr Puddles", species: "Duck adult", role: "Art & photography teacher",
    gradeBand: "Whole school",
    personality: ["Observant, curious and gently funny", "A devoted birdwatcher", "Notices small visual details"],
    worksheetLens: "Visual observation — art, photography, senses, classification, nature.",
    guides: ["Drawing, colour, texture and composition", "Photography and careful observation", "Nature study through looking closely"],
    recognizable: ["Pale-yellow duck with newsboy cap", "Blue utility vest", "Birdwatching and camera interests"],
  },
  {
    key: "miss-maisy", name: "Miss Maisy", species: "Cow adult", role: "School secretary & gardening lead",
    gradeBand: "Whole school",
    personality: ["Organized, welcoming and observant", "Helps the school day run smoothly", "Makes information easy to follow"],
    worksheetLens: "Practical organization — calendar, time, lists, sequencing, clear messages.",
    guides: ["Schedules, calendars and time", "Sequencing and organizing information", "Clear messages and practical communication"],
    recognizable: ["Black-and-white cow", "Apron with floral embroidery"],
  },
];

export const STUDENTS: Student[] = [
  {
    key: "hopper", name: "Hopper", species: "Rabbit", note: "Eager mover",
    personality: ["Energetic, optimistic and ready to join", "Buoyant rather than chaotic", "Often first to try"],
    learningStrengths: ["Skip-counting through movement", "Calendar and days of the week", "Gross motor skills and action cues"],
    pairsWith: ["Daisy for number patterns", "Puddles for energetic participation", "Scout for exploration and movement"],
    recognizable: ["Cream rabbit with pink-lined ears", "Orange vest and denim shorts", "Olive backpack and blue sneakers"],
  },
  {
    key: "whiskers", name: "Whiskers", species: "Cat", note: "Curious observer",
    personality: ["Curious, gentle and thoughtful", "Notices details before others", "Asks careful questions"],
    learningStrengths: ["Five senses and observation", "Sorting and classifying", "Weather and nature study"],
    pairsWith: ["Sam for quiet problem-solving", "Scout for outdoor discovery", "Penny for careful first attempts"],
    recognizable: ["Soft gray tabby with green eyes", "Lavender knitted scarf", "Teal flowered satchel"],
  },
  {
    key: "scout", name: "Scout", species: "Dog", note: "Helpful explorer",
    personality: ["Adventurous, observant and dependable", "Leads the way physically", "Helps classmates who are stuck"],
    learningStrengths: ["Directions and positional words", "Phonics as following a sound trail", "Teamwork and community helpers"],
    pairsWith: ["Whiskers for discovery", "Rusty for steady teamwork", "Sam for figuring out how things work"],
    recognizable: ["Cream dog with brown ears and eye patch", "Explorer hat and blue neckerchief", "Utility vest, backpack and boots"],
  },
  {
    key: "penny", name: "Penny", species: "Chick", note: "Brave beginner",
    personality: ["Earnest, careful and growing in confidence", "Shows courage through small attempts", "Never rushes past beginner feelings"],
    learningStrengths: ["ABCs and earliest phonics", "Counting to ten", "Courage and trying new things"],
    pairsWith: ["Daisy for encouragement", "Whiskers for a gentle approach", "Puddles for sharing aloud"],
    recognizable: ["Smallest student", "Fluffy yellow chick with pink bow", "Pale-blue wing-shaped backpack"],
  },
  {
    key: "maisy", name: "Daisy", species: "Cow", note: "Confident participant — recommended rename from Maisy",
    personality: ["Warm, confident and encouraging", "Models the action before inviting others", "Helps nervous classmates participate"],
    learningStrengths: ["Patterns and shapes through her spots", "Sorting, counting and simple addition", "Leadership and encouragement"],
    pairsWith: ["Penny for confidence", "Hopper for patterns and counting", "Sam for careful number work"],
    recognizable: ["Black-and-white calf with pink muzzle", "Blue bandana and yellow backpack"],
  },
  {
    key: "puddles", name: "Puddles", species: "Duck", note: "Enthusiastic sharer",
    personality: ["Expressive, sociable and enthusiastic", "Uses big readable gestures", "Eager to share with the class"],
    learningStrengths: ["Vocabulary building", "Show-and-tell and oral storytelling", "Music and rhythm"],
    pairsWith: ["Rusty for music and rhythm", "Penny for speaking up", "Daisy for leading a fun activity"],
    recognizable: ["Pale-yellow duck with orange bill", "Denim-blue cap", "Matching blue backpack"],
  },
  {
    key: "sam", name: "Sam", species: "Pig", note: "Thoughtful problem-solver",
    personality: ["Thoughtful, patient and detail-focused", "Pauses before answering", "Enjoys figuring out how things work"],
    learningStrengths: ["Math and practical building", "Reading diagrams and instructions", "Science observation and problem-solving"],
    pairsWith: ["Whiskers for noticing details", "Scout for how-things-work challenges", "Daisy for numbers and patterns"],
    recognizable: ["Pink pig with round glasses", "Denim overalls and green backpack"],
  },
  {
    key: "rusty", name: "Rusty", species: "Horse", note: "Steady teammate",
    personality: ["Steady, patient and dependable", "Keeps a calm pace", "Supports the group without needing attention"],
    learningStrengths: ["Rhythm and ordered routines", "Sequencing and repeated patterns", "Teamwork and patient practice"],
    pairsWith: ["Puddles for music", "Scout for dependable teamwork", "Hopper for contrasting movement speeds"],
    recognizable: ["Warm brown horse with dark mane", "Red bandana and backpack", "Cream muzzle and calm posture"],
  },
];
