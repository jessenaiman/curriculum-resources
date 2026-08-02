// Illustrative song/topic sets for the Daycare, Preschool and Kindergarten hubs.
// These stand in for the curriculum_topics/early_years_topics rows in
// data/curriculum.db until that data is wired up — shaped the same way so
// swapping in real rows later is a data change, not a component change.
export type EarlyYearsTopic = {
  slug: string;
  title: string;
  focus: string;
  patch: string; // /patches/<patch>.png — the topic's own patch, not the teacher's
  image: string; // /scenes/<image> — preview shown in the lightbox
  steps: string[]; // the teaching rhythm, e.g. Identify → Imitate → Move → Join In
  choice?: string[]; // Preschool tier only — an explicit choice point in the activity
  noticeFor?: string[]; // Preschool tier only — "what to notice" checklist
};

export const DAYCARE_SONGS: EarlyYearsTopic[] = [
  { slug: "follow-the-duckling", title: "Follow the Duckling", focus: "Animal sounds and simple imitation", patch: "puddles", image: "/scenes/follow-the-duckling.png", steps: ["Listen", "Name", "Copy the sound"] },
  { slug: "open-circle-gathering", title: "Old Mac's Open Circle", focus: "Group gathering and turn-taking", patch: "penny", image: "/scenes/old-macs-open-circle-gathering.png", steps: ["Sit together", "Listen", "Take a turn"] },
  { slug: "clap-your-hands", title: "Clap Your Hands", focus: "Steady beat, hands and feet", patch: "hopper", image: "/scenes/clap-your-hands.png", steps: ["Listen", "Clap along"] },
  { slug: "plant-your-seeds", title: "Plant Your Seeds", focus: "Fingerplay and gentle motion", patch: "maisy", image: "/scenes/plant-your-seeds.png", steps: ["Watch", "Copy the motion"] },
  { slug: "seven-jumps", title: "Seven Jumps", focus: "Whole-body movement, stop and go", patch: "rusty", image: "/scenes/seven-jumps.png", steps: ["Move", "Freeze"] },
  { slug: "singing-together", title: "Singing Together", focus: "Whole-school music circle", patch: "scout", image: "/scenes/singing-together-on-old-macs-farm.png", steps: ["Listen", "Hum along"] },
];

export const PRESCHOOL_SONGS: EarlyYearsTopic[] = [
  { slug: "clap-your-hands-2", title: "Clap Your Hands", focus: "Steady beat, hands and feet, faster tempo", patch: "hopper", image: "/scenes/clap-your-hands-2.png", steps: ["Identify", "Imitate", "Move", "Join In"], choice: ["Standing", "Seated", "Gesture only", "Watch and listen"], noticeFor: ["Copies the beat", "Joins without a prompt", "Notices tempo change"] },
  { slug: "plant-your-seeds-with-care", title: "Plant Your Seeds With Care", focus: "Sequenced fingerplay with a growing pattern", patch: "maisy", image: "/scenes/plant-your-seeds-with-care.png", steps: ["Identify", "Imitate", "Move", "Join In"], choice: ["Full motion", "Hands only", "Watch and listen"], noticeFor: ["Follows the sequence", "Names the next step", "Repeats independently"] },
  { slug: "seven-jumps-2", title: "Seven Jumps", focus: "Counted movement with a freeze cue", patch: "rusty", image: "/scenes/seven-jumps-2.png", steps: ["Identify", "Imitate", "Move", "Join In"], choice: ["Standing", "Seated", "Gesture only"], noticeFor: ["Counts along", "Freezes on cue", "Recovers after a miss"] },
  { slug: "early-year-example", title: "Barnyard Roll Call", focus: "Naming and sorting the farm animals", patch: "scout", image: "/scenes/early-year-example-2.png", steps: ["Identify", "Imitate", "Move", "Join In"], choice: ["Point and name", "Sound and name", "Watch and listen"], noticeFor: ["Names correctly", "Sorts by type", "Asks a question"] },
  { slug: "worksheet-example", title: "A Barn Band Day", focus: "Instruments, sound and simple choice-making", patch: "whiskers", image: "/scenes/early-years-worksheet-example.png", steps: ["Identify", "Imitate", "Move", "Join In"], choice: ["Shaker", "Drum", "Voice only"], noticeFor: ["Chooses an instrument", "Keeps the beat briefly", "Shares with a peer"] },
];

export const KINDERGARTEN_TOPICS: EarlyYearsTopic[] = [
  { slug: "barnyard-count-along", title: "Barnyard Count-Along", focus: "Counting the animals as they appear on the page", patch: "sam", image: "/scenes/singing-together-on-old-macs-farm.png", steps: ["Look", "Count", "Mark the picture"] },
  { slug: "sound-and-letter-walk", title: "Sound & Letter Walk", focus: "Matching an animal sound to its starting letter", patch: "whiskers", image: "/scenes/old-macs-open-circle-gathering.png", steps: ["Listen", "Find the letter", "Mark the picture"] },
];
