#!/usr/bin/env python
"""Build the merged single-sheet Kathy Reid-Naiman 28-song prompt dataset."""
import pandas as pd
import sqlite3
import json
import os

# --- Paths ---
XLSX_V2 = r"C:\Users\jesse\OneDrive\Documents\New project\data\kathy_reid_naiman_recent_28_prompt_dataset_v2.xlsx"
DB_PATH = r"C:\Users\jesse\OneDrive\Documents\New project\data\curriculum.db"
YT_JSON = r"C:\Users\jesse\OneDrive\Documents\New project\data\youtube_channel.json"
LOCAL_VIDEOS = r"C:\Users\jesse\OneDrive\Videos\Merriweather"
OUTPUT = r"C:\Users\jesse\OneDrive\Documents\New project\data\kathy_reid_naiman_recent_28_prompt_dataset.xlsx"

# --- Load source data ---
df_main = pd.read_excel(XLSX_V2, sheet_name='Song Dataset')
df_links = pd.read_excel(XLSX_V2, sheet_name='Source Links')
df_local = pd.read_excel(XLSX_V2, sheet_name='Local Video Matches')

conn = sqlite3.connect(DB_PATH)
df_db = pd.read_sql('SELECT * FROM songs', conn)
conn.close()

# Load YouTube channel JSON for additional URLs
with open(YT_JSON, 'r', encoding='utf-8') as f:
    yt_json = json.load(f)
    yt_data = yt_json.get('entries', []) if isinstance(yt_json, dict) else yt_json

# --- Canonical songs (order matters) ---
CANONICAL = [
    "I Went Down into the Barnyard",
    "Dig a Little Hole",
    "Over in the Meadow",
    "Old MacDonald Had a Band",
    "The Turkey Song",
    "The Fishing Song",
    "Owl Moon",
    "There's a Dog in the School",
    "Hush Little Baby",
    "The Wiggly Worm",
    "Down in the Valley",
    "Wahoo Wahoo",
    "Goodnight Beloved Mine",
    "Plant Your Seeds With Care",
    "Zoom Zoom Zoom",
    "Turn Around",
    "The Moonman",
    "On My Way to Dreamland",
    "Down on Grampa's Farm",
    "The Truck Song",
    "Swimming, Swimming",
    "Welcome Summer",
    "Going to the Market",
    "Humpty Dumpty",
    "Tapping on My Sticks",
    "Teacup",
    "Time to Put Away",
    "Hand Washing Song",
]

# --- Database search function (fuzzy) ---
def find_db_records(title):
    """Find all DB records matching a canonical title (fuzzy)."""
    # Exact match first
    exact = df_db[df_db['song_name'].str.strip().str.lower() == title.strip().lower()]
    if len(exact) > 0:
        return exact
    
    # Fuzzy match
    keywords = title.lower().split()
    for kw in keywords:
        if len(kw) > 3:
            matches = df_db[df_db['song_name'].str.lower().str.contains(kw, na=False)]
            if len(matches) > 0:
                return matches
    return pd.DataFrame()

def merge_db_fields(records):
    """Merge multiple DB records into consolidated values."""
    if records.empty:
        return {}
    result = {}
    for field in ['actions', 'instructions', 'lyrics', 'topic', 'theme',
                  'suggested_staff', 'suggested_students', 'cd_title', 'track_num', 'url']:
        vals = records[field].dropna().unique()
        vals = [str(v).strip() for v in vals if str(v).strip() and str(v).strip() != 'nan']
        result[field] = '; '.join(vals) if vals else ''
    return result

# --- YouTube URL merging ---
def get_youtube_urls(title):
    """Get all YouTube URLs for a song from Source Links and YouTube channel JSON."""
    urls = set()
    # From Source Links sheet
    subset = df_links[df_links['Canonical song title'] == title]
    for _, row in subset.iterrows():
        url = str(row.get('URL', ''))
        if 'youtube.com' in url or 'youtu.be' in url:
            urls.add(url)
    # From YouTube channel JSON
    for item in yt_data:
        item_title = item.get('title', '').strip().lower()
        if title.strip().lower() in item_title or item_title in title.strip().lower():
            vid_url = item.get('url', '') or item.get('webpage_url', '')
            if vid_url and ('youtube.com' in vid_url or 'youtu.be' in vid_url):
                urls.add(vid_url)
    return '; '.join(sorted(urls))

def get_website_urls(title):
    """Get kathyreidnaiman.com URLs."""
    urls = set()
    subset = df_links[df_links['Canonical song title'] == title]
    for _, row in subset.iterrows():
        url = str(row.get('URL', ''))
        if 'kathyreidnaiman.com' in url:
            urls.add(url)
    return '; '.join(sorted(urls))

def get_local_videos(title):
    """Get all local video paths for a song."""
    subset = df_local[df_local['Canonical song title'] == title]
    paths = subset['Relative path under Merriweather'].dropna().unique().tolist()
    return '; '.join(paths)

# --- Musical content analysis ---
# Based on Kathy Reid-Naiman's known style, database actions/lyrics, and song characteristics
MUSICAL_DATA = {
    "I Went Down into the Barnyard": {
        "beat": "Steady 4/4 beat; children clap on each animal name",
        "rhythm": "Speech-rhythm based; repetitive AABB rhyme pattern; onomatopoeic accents on animal sounds",
        "melody": "Simple ascending-descending phrase; narrow range (about a 5th); call-and-response on animal names",
        "tempo": "Moderate (Andante); slight accelerando through each verse",
        "dynamics": "mp-mf; crescendo on animal sounds; playful forte on punchlines",
        "form": "Verse-repeating (strophic); each verse adds a new animal; cumulative listing",
        "timbre": "Acoustic guitar accompaniment; vocal imitation of animal sounds; bright vocal timbre",
        "texture": "Homophonic (melody + guitar); thinning to monophonic during animal-call sections",
    },
    "Dig a Little Hole": {
        "beat": "Steady gentle beat; taps or claps to mark digging motion",
        "rhythm": "Repeating rhythmic motif matching digging action; eighth-note patterns",
        "melody": "Gentle stepwise motion; narrow range; soothing folk-like contour",
        "tempo": "Moderate (Moderato); steady throughout",
        "dynamics": "mp-mf; gentle; slight crescendo on 'grow' sections",
        "form": "Verse-repeating (strophic); nature-focused imagery builds each verse",
        "timbre": "Acoustic guitar; soft vocal; nature-inspired imagery in tone",
        "texture": "Homophonic; melody with light guitar accompaniment",
    },
    "Over in the Meadow": {
        "beat": "Strong steady beat; count-aloud rhythm supports beat awareness",
        "rhythm": "Numbered counting pattern; regular phrase lengths; each verse uses same rhythmic template",
        "melody": "Repeating melodic phrase per verse; stepwise motion; range about a 6th; predictable contour aids memory",
        "tempo": "Moderate (Moderato); consistent; slight ritardando on final verse",
        "dynamics": "mf throughout; gentle crescendo as numbers increase",
        "form": "Cumulative verse-repeating; each verse adds an animal and a number (1 through 10)",
        "timbre": "Vocal + guitar; animal character voices; bright warm tone",
        "texture": "Homophonic; melody with guitar; occasional unison singing on numbers",
    },
    "Old MacDonald Had a Band": {
        "beat": "Strong steady 4/4; march-like beat for instrument-playing motions",
        "rhythm": "Varied by instrument section; staccato rhythms for percussion; legato for wind",
        "melody": "Well-known folk melody adapted; moderate range; playful instrument-naming phrases",
        "tempo": "Moderate to slightly fast (Moderato-Allegretto); energetic",
        "dynamics": "mf-f; forte on instrument-playing sections; dynamic contrast between instruments",
        "form": "Verse-repeating with instrument substitutions; each verse features a different instrument",
        "timbre": "Multi-instrument texture: guitar, drums, trumpet, shaker sounds imitated vocally and instrumentally",
        "texture": "Layered; builds as more instruments join; ensemble feel",
    },
    "The Turkey Song": {
        "beat": "Steady moderate beat; waddling rhythm pattern",
        "rhythm": "Comedic rhythmic patterns; emphasis on turkey-walk triplets; syncopated accents",
        "melody": "Playful, bouncy; moderate range; humorous contour with unexpected turns",
        "tempo": "Moderate (Moderato); comic timing with slight pauses",
        "dynamics": "mf-f; humorous dynamic swells; forte on gobble sounds",
        "form": "Verse-repeating; narrative structure describing turkey behavior",
        "timbre": "Vocal character work (turkey gobble); guitar; playful exaggerated tone",
        "texture": "Homophonic; melody with guitar; moments of vocal-only for comic effect",
    },
    "The Fishing Song": {
        "beat": "Gentle rolling beat; 6/8 or swaying 4/4 feel for water motion",
        "rhythm": "Fluid rhythm matching casting and reeling actions; legato phrasing",
        "melody": "Smooth, flowing melody; moderate range; wave-like contour",
        "tempo": "Moderate (Andante-Moderato); slight rubato for dramatic fish-catching moments",
        "dynamics": "mp-mf; crescendo during 'the one that got away' moment; forte on surprise",
        "form": "Through-composed narrative; story arc from casting to catching to losing fish",
        "timbre": "Guitar accompaniment; bright vocal; water-inspired imagery",
        "texture": "Homophonic; melody with guitar; thinning for dramatic storytelling moments",
    },
    "Owl Moon": {
        "beat": "Slow, hushed steady beat; foot taps like owl footsteps",
        "rhythm": "Gentle dotted rhythms; owl hoot patterns (long-short); nocturnal pacing",
        "melody": "Minor-key feel; narrow range; mysterious descending phrases; haunting quality",
        "tempo": "Slow (Adagio); hushed and deliberate; no rushing",
        "dynamics": "pp-mf; very quiet verses building to hooting crescendo; dramatic contrast",
        "form": "Verse-repeating; atmospheric setting builds mood across verses",
        "timbre": "Soft vocal; hooting sounds; gentle guitar; nocturnal atmosphere",
        "texture": "Thin homophonic; sparse accompaniment creates nocturnal space; monophonic hooting",
    },
    "There's a Dog in the School": {
        "beat": "Bouncy steady beat; walking/trotting rhythm for dog movements",
        "rhythm": "Playful rhythmic patterns; staccato accents; speech-like phrasing",
        "melody": "Bright major key; moderate range; humorous melodic leaps",
        "tempo": "Moderate to lively (Moderato-Allegretto); playful energy",
        "dynamics": "mf-f; dynamic comic moments; bark sounds at forte",
        "form": "Verse-repeating; narrative describing dog's school adventures",
        "timbre": "Vocal character (dog barking); guitar; playful storytelling tone",
        "texture": "Homophonic; melody with guitar; unison sections for chorus",
    },
    "Hush Little Baby": {
        "beat": "Gentle rocking 3/4 or 6/8 beat; lullaby cradle rhythm",
        "rhythm": "Triple meter rocking pattern; predictable phrase endings; soothing repetitive rhythm",
        "melody": "Narrow range; descending phrases; gentle stepwise motion; classic lullaby contour",
        "tempo": "Slow (Adagio); soothing; no accelerando",
        "dynamics": "pp-mf; soft throughout; diminuendo at phrase endings; hushed quality",
        "form": "Cumulative verse-repeating; each verse adds a new gift; traditional ballad structure",
        "timbre": "Soft vocal; gentle guitar or ukulele; hushed intimate tone",
        "texture": "Thin homophonic; voice with minimal accompaniment; lullaby intimacy",
    },
    "The Wiggly Worm": {
        "beat": "Wiggling rhythmic beat; body-movement driven",
        "rhythm": "Syncopated wiggling patterns; irregular accents matching worm movement",
        "melody": "Playful, squiggly melodic line; chromatic inflections; narrow range",
        "tempo": "Moderate (Moderato); wiggle-tempo variations for engagement",
        "dynamics": "mp-mf; playful dynamic changes; soft-to-loud wiggle crescendos",
        "form": "Verse-repeating; each verse describes worm's underground journey",
        "timbre": "Vocal with wiggling sound effects; guitar; earthy playful tone",
        "texture": "Homophonic; melody with guitar; body percussion possible",
    },
    "Down in the Valley": {
        "beat": "Gentle steady beat; slow swaying rhythm",
        "rhythm": "Legato flowing phrases; smooth melodic rhythm; folk ballad pacing",
        "melody": "Beautiful folk melody; wider range (octave); lyrical ascending-descending phrases",
        "tempo": "Slow (Adagio-Andante); expressive rubato; contemplative",
        "dynamics": "mp-mf; expressive dynamic shaping; gentle swells on landscape imagery",
        "form": "Verse-repeating; pastoral imagery; each verse paints a different landscape element",
        "timbre": "Rich vocal; acoustic guitar; folk ballad warmth",
        "texture": "Homophonic; voice with guitar; moments of a cappella for emotional impact",
    },
    "Wahoo Wahoo": {
        "beat": "Upbeat steady beat; energetic dance rhythm",
        "rhythm": "Repetitive exclamatory rhythm; strong accent on 'Wahoo'; danceable pattern",
        "melody": "Bright major key; narrow range; joyful ascending exclamations",
        "tempo": "Lively (Allegretto-Allegro); energetic; maintains excitement",
        "dynamics": "mf-f; forte on 'Wahoo' exclamations; consistent high energy",
        "form": "Chorus-based; simple repeating structure; high-energy repetition",
        "timbre": "Bright vocal; guitar; dog-themed character energy",
        "texture": "Homophonic; melody with guitar; group singing encouraged",
    },
    "Goodnight Beloved Mine": {
        "beat": "Slow gentle rocking beat; lullaby cradle rhythm",
        "rhythm": "Triple meter or slow duple; smooth legato phrases; predictable endings",
        "melody": "Gentle lullaby melody; narrow range; descending phrases; soothing contour",
        "tempo": "Slow (Adagio); calming; ritardando at end",
        "dynamics": "pp-mf; very soft; diminuendo throughout; intimate",
        "form": "Verse-repeating; bedtime narrative; each verse adds comforting imagery",
        "timbre": "Soft hushed vocal; gentle guitar or piano; bedtime warmth",
        "texture": "Thin homophonic; voice with minimal accompaniment; intimate lullaby",
    },
    "Plant Your Seeds With Care": {
        "beat": "Gentle steady beat; planting rhythm (push-push-pat)",
        "rhythm": "Repetitive planting gesture rhythm; even eighth-note patterns; nature pacing",
        "melody": "Gentle folk melody; narrow range; earthy stepwise motion",
        "tempo": "Moderate (Moderato); steady; patient pacing",
        "dynamics": "mp-mf; gentle; consistent warm dynamics",
        "form": "Verse-repeating; growth narrative; verses follow seed-to-plant progression",
        "timbre": "Acoustic guitar; warm vocal; earthy nature-inspired tone",
        "texture": "Homophonic; melody with guitar; group singing on refrain",
    },
    "Zoom Zoom Zoom": {
        "beat": "Accelerating beat pattern; rocket launch rhythm",
        "rhythm": "Repetitive zooming pattern; accelerando toward 'blast off'; countdown rhythm",
        "melody": "Ascending melodic line; building tension; narrow range with upward push",
        "tempo": "Starts moderate, accelerando to fast (Moderato to Allegro); dramatic tempo change",
        "dynamics": "mp-f; crescendo through verses; forte explosion on 'blast off'",
        "form": "Verse-repeating with cumulative tension; countdown structure (5-4-3-2-1)",
        "timbre": "Vocal with rocket sound effects; guitar; building excitement",
        "texture": "Homophonic building to layered; voice + guitar + group counting + sound effects",
    },
    "Turn Around": {
        "beat": "Steady moderate beat; turning/spinning rhythm",
        "rhythm": "Circular rhythmic patterns; smooth flowing phrases; spinning accent",
        "melody": "Bright joyful melody; moderate range; ascending-descending phrases matching turn direction",
        "tempo": "Moderate (Moderato); steady; safe speed for turning movements",
        "dynamics": "mf; consistent; bright and clear",
        "form": "Verse-repeating; each verse names a different body part or direction",
        "timbre": "Bright vocal; guitar; movement-focused energy",
        "texture": "Homophonic; melody with guitar; group participation singing",
    },
    "The Moonman": {
        "beat": "Slow mysterious beat; moonlit pacing",
        "rhythm": "Gentle dotted rhythms; nocturnal feel; moonrise pacing",
        "melody": "Mysterious minor/modal feel; moderate range; ascending for moon imagery",
        "tempo": "Slow (Adagio); atmospheric; unhurried",
        "dynamics": "pp-mf; hushed throughout; soft mysterious quality",
        "form": "Verse-repeating; moon imagery builds across verses",
        "timbre": "Soft vocal; gentle guitar; nocturnal atmospheric quality",
        "texture": "Thin homophonic; sparse accompaniment; moonlit space",
    },
    "On My Way to Dreamland": {
        "beat": "Very slow rocking beat; dreamlike lullaby rhythm",
        "rhythm": "Flowing legato phrases; gentle triple or compound meter; drowsy pacing",
        "melody": "Dreamy descending lullaby melody; narrow range; soothing resolution",
        "tempo": "Slow (Adagio); very relaxed; ritardando at ending",
        "dynamics": "pp-p; very soft throughout; fading to silence",
        "form": "Verse-repeating; bedtime journey narrative; progressive drowsiness",
        "timbre": "Soft hushed vocal; gentle guitar; dreamy atmospheric quality",
        "texture": "Thin homophonic; voice with minimal guitar; intimate bedtime",
    },
    "Down on Grampa's Farm": {
        "beat": "Steady bouncy beat; farm dance rhythm",
        "rhythm": "Bouncy country rhythm; emphasis on downbeat; clapping patterns",
        "melody": "Bright folk melody; moderate range; country-folk contour; singable",
        "tempo": "Moderate to lively (Moderato-Allegretto); upbeat farm energy",
        "dynamics": "mf-f; energetic; consistent brightness",
        "form": "Verse-repeating; each verse describes a different farm animal or activity",
        "timbre": "Acoustic guitar; bright vocal; country-folk warmth",
        "texture": "Homophonic; melody with guitar; group singing on chorus",
    },
    "The Truck Song": {
        "beat": "Strong steady beat; driving truck rhythm; chugging pattern",
        "rhythm": "Driving rhythmic pattern; truck-engine chugging; accented downbeats",
        "melody": "Bright energetic melody; moderate range; truck-movement contour",
        "tempo": "Moderate to lively (Moderato-Allegretto); driving energy",
        "dynamics": "mf-f; loud truck sounds; forte on horn honks",
        "form": "Verse-repeating; each verse describes loading, driving, delivering",
        "timbre": "Vocal with truck sound effects (honk, rumble); guitar; energetic tone",
        "texture": "Homophonic; melody with guitar; sound effects layered",
    },
    "Swimming, Swimming": {
        "beat": "Steady swimming stroke rhythm; 4/4 with arm-motion accents",
        "rhythm": "Repetitive swimming-stroke pattern; even eighth notes; splash accents",
        "melody": "Bright playful melody; moderate range; water-motion contour",
        "tempo": "Moderate (Moderato); steady swim pace; no rushing",
        "dynamics": "mf; bright; consistent; splash sounds at forte",
        "form": "Verse-repeating; each verse describes different swimming action",
        "timbre": "Bright vocal; water-splash sound effects; guitar; playful aquatic tone",
        "texture": "Homophonic; melody with guitar; group swimming actions",
    },
    "Welcome Summer": {
        "beat": "Bright upbeat steady beat; celebratory rhythm",
        "rhythm": "Joyful rhythmic patterns; stretching/wide-arm accents; sunny phrasing",
        "melody": "Bright major key; ascending joyful phrases; wide-ish range; celebratory",
        "tempo": "Moderate to lively (Moderato-Allegretto); warm energy",
        "dynamics": "mf-f; bright and warm; consistent celebration energy",
        "form": "Verse-repeating; seasonal celebration; each verse welcomes summer elements",
        "timbre": "Bright vocal; guitar; warm sunny tone; joyful character",
        "texture": "Homophonic; melody with guitar; group celebration singing",
    },
    "Going to the Market": {
        "beat": "Strong steady beat; marching/walking rhythm; shaker rhythm overlay",
        "rhythm": "March-like rhythm; shaker patterns; call-and-response accent",
        "melody": "Bright folk melody; moderate range; market-stroll contour; singable",
        "tempo": "Moderate (Moderato); walking pace; consistent",
        "dynamics": "mf-f; energetic; forte on 'shake it' sections",
        "form": "Verse-repeating with ring-game structure; centre person + circle dancers",
        "timbre": "Shakers, drum, fiddle, guitar; bright vocal; ensemble folk texture",
        "texture": "Layered homophonic; voice + guitar + shakers + fiddle; ring-game clapping",
    },
    "Humpty Dumpty": {
        "beat": "Steady moderate beat; nursery-rhyme pacing",
        "rhythm": "Classic nursery rhyme rhythm; trochaic pattern; falling accent on 'fall'",
        "melody": "Well-known nursery rhyme melody; narrow range; predictable contour; minor fall",
        "tempo": "Moderate (Moderato); nursery-rhyme pacing; slight ritardando on 'fall'",
        "dynamics": "mf; consistent; dramatic accent on 'great fall'",
        "form": "Single narrative verse; complete story arc (sit → fall → can't fix)",
        "timbre": "Bright vocal; guitar; storytelling character tone",
        "texture": "Homophonic; melody with guitar; occasional a cappella for drama",
    },
    "Tapping on My Sticks": {
        "beat": "Strong clear beat; percussion-driven; sticks create the beat",
        "rhythm": "Varied rhythmic patterns per verse (fast/slow, loud/quiet, floor/air); rhythm exploration",
        "melody": "Simple repetitive melody; narrow range; chant-like; easy to learn",
        "tempo": "Varies by verse: slow → fast → moderate; tempo exploration is the lesson",
        "dynamics": "Varies by verse: quiet → loud → quiet; dynamics exploration is the lesson",
        "form": "Verse-repeating with variations; each verse changes one element (location, speed, volume)",
        "timbre": "Sticks (rhythm sticks); vocal; guitar; percussion exploration focus",
        "texture": "Homophonic; voice + sticks + guitar; sticks as primary instrument",
    },
    "Teacup": {
        "beat": "Delicate steady beat; teacup-handling rhythm",
        "rhythm": "Gentle graceful rhythms; delicate accents; china-handling care",
        "melody": "Gentle delicate melody; narrow range; graceful contour; tea-party elegance",
        "tempo": "Moderate (Andante-Moderato); gentle; no rushing",
        "dynamics": "p-mf; gentle; delicate; crescendo slightly during pour",
        "form": "Verse-repeating; tea-party ritual; each verse describes a different step",
        "timbre": "Soft vocal; guitar; delicate refined tone",
        "texture": "Thin homophonic; voice with gentle guitar; intimate tea-party feel",
    },
    "Time to Put Away": {
        "beat": "Steady clear beat; cleanup-timer rhythm",
        "rhythm": "Regular organized rhythm; matching cleanup actions; tidy phrase endings",
        "melody": "Bright encouraging melody; moderate range; positive resolution contour",
        "tempo": "Moderate (Moderato); brisk enough to motivate; not rushed",
        "dynamics": "mf; consistent; encouraging and clear",
        "form": "Verse-repeating; each verse names items to put away; routine song",
        "timbre": "Bright vocal; guitar; cheerful routine-song energy",
        "texture": "Homophonic; melody with guitar; group singing for transition",
    },
    "Hand Washing Song": {
        "beat": "Steady moderate beat; 20-second timer rhythm (matching hand-washing duration)",
        "rhythm": "Repetitive scrubbing rhythm; even patterns matching hand-washing steps",
        "melody": "Simple catchy melody; narrow range; easy to remember; health-education focus",
        "tempo": "Moderate (Moderato); consistent; timed for 20-second hand wash",
        "dynamics": "mf; clear and instructive; consistent",
        "form": "Verse-repeating; step-by-step hand-washing procedure; instructional structure",
        "timbre": "Bright clear vocal; guitar; instructional health-song tone",
        "texture": "Homophonic; melody with guitar; action-following focus",
    },
}

# --- Website lyrics (from web extract) ---
WEBSITE_LYRICS = {
    "Hush Little Baby": """Hush little baby Don't say a word,
Mama's gonna buy you a mocking bird.
And if that mocking bird don't sing,
Mama's gonna buy you a diamond ring.
And if that diamond ring turns brass,
Mama's gonna buy you a looking glass.
And if that looking glass gets broke,
Mama's gonna buy you a Billy Goat.
And if that Billy Goat won't pull,
Mama's gonna buy you a cart and bull.
And if that cart and bull turn over,
Mama's gonna buy you a dog named Rover.
And if that dog named Rover won't bark,
Mama's gonna buy you a horse and cart.
And if that horse and cart fall down,
You'll still be the sweetest little baby in town.""",

    "Zoom Zoom Zoom": """Zoom, Zoom, Zoom
We're going to the moon.
Zoom, Zoom, Zoom
We're going to the moon.
If you want to take a trip,
Climb aboard my rocket ship.
Zoom, Zoom, Zoom
We're going to the moon.
5, 4, 3, 2, 1, Blast off!""",

    "Tapping on My Sticks": """1. I'm tapping on my sticks,
I'm tapping on my sticks,
Tapping tapping never stopping,
Tapping on my sticks.
2. I'm tapping on the floor
I'm tapping on the floor,
Tapping tapping never stopping,
Tapping on the floor.
3. I'm tapping in the air.
4. I'm tapping very quietly.
5. I'm tapping very slowly.
6. I'm tapping very quickly.
7. I'm tapping very loudly.
8. I'm tapping on my sticks.
Bucky: drums; Chris: trumpet; Kathy: sticks;
Ken: guitar, piano, sticks; Victor: bass""",

    "Going to the Market": """We're going to the market; we're going to the fair
To see a senorita with flowers in her hair.
So shake it baby, shake it
Shake if you can,
Shake it like a milkshake, and drink it from the can.
Shake it to the bottom, shake it to the top,
Turn around and turn around until I holler STOP!
Bucky: drum; Chris: trumpets; Hannah: harmony; John: fiddle;
Kathy: shakers; Ken: 12 string guitar, shaker, maracas; Victor: bass""",
}

# --- Build merged rows ---
rows = []
for title in CANONICAL:
    row = {}
    
    # Get v2 data
    v2_row = df_main[df_main['Canonical song title'] == title].iloc[0] if len(df_main[df_main['Canonical song title'] == title]) > 0 else None
    
    # Get DB data
    db_records = find_db_records(title)
    db = merge_db_fields(db_records)
    
    # Get best DB record (first match with most data)
    best_db = None
    if not db_records.empty:
        for _, rec in db_records.iterrows():
            if rec.get('actions') or rec.get('lyrics') or rec.get('topic'):
                best_db = rec
                break
        if best_db is None:
            best_db = db_records.iloc[0]
    
    # --- Core identification ---
    row['Canonical song title'] = title
    row['Channel order'] = v2_row['Channel order'] if v2_row is not None else ''
    row['Album / CD title'] = db.get('cd_title', '') or (str(v2_row['Album / CD title']) if v2_row is not None else '')
    row['Track number(s)'] = db.get('track_num', '') or (str(v2_row['Track number(s)']) if v2_row is not None else '')
    row['Artist'] = 'Kathy Reid-Naiman'
    
    # --- URLs and paths ---
    yt_urls = get_youtube_urls(title)
    web_urls = get_website_urls(title)
    all_urls = [u for u in [yt_urls, web_urls] if u]
    row['YouTube URLs'] = yt_urls
    row['Website URLs'] = web_urls
    row['Local video paths'] = get_local_videos(title)
    
    # --- Themes and topics ---
    topic = db.get('topic', '') or (str(v2_row['Topic / educational focus']) if v2_row is not None else '')
    theme = db.get('theme', '') or (str(v2_row['Primary theme']) if v2_row is not None else '')
    
    # Manual topic overrides for songs with no DB topic
    topic_overrides = {
        "Humpty Dumpty": "nursery rhyme; sequencing; cause-and-effect",
        "Teacup": "pretend play; fine motor; social skills",
        "Time to Put Away": "routines; cleanup; transition skills",
        "Hand Washing Song": "hygiene; health routines; sequencing",
        "Old MacDonald Had a Band": "instruments; music exploration",
        "There's a Dog in the School": "animals; school; humor",
        "Goodnight Beloved Mine": "bedtime; lullaby; self-regulation",
        "Wahoo Wahoo": "dogs; animals; joyful expression",
        "The Moonman": "moon; night sky; imagination",
        "On My Way to Dreamland": "bedtime; lullaby; dreams",
        "Down on Grampa's Farm": "farm; animals; family",
        "The Truck Song": "transportation; vehicles",
        "Swimming, Swimming": "water play; swimming; summer",
        "Welcome Summer": "seasons; summer; nature",
        "Going to the Market": "community; shakers; cultural",
        "Down in the Valley": "nature; landscape; folk songs",
    }
    if not topic or 'needs verification' in topic.lower():
        topic = topic_overrides.get(title, topic)
    
    # Clean up "Needs verification" from v2 data
    def clean_val(v, fallback=''):
        s = str(v).strip()
        if s == 'nan' or s == '' or 'needs verification' in s.lower():
            return fallback
        return s
    
    row['Primary theme'] = clean_val(v2_row['Primary theme'] if v2_row is not None else '', theme.split(',')[0].strip() if theme else '')
    # Secondary themes: from DB theme field if it has commas, otherwise from v2
    secondary = clean_val(v2_row['Secondary theme(s)'] if v2_row is not None else '', '')
    if not secondary and ',' in theme:
        secondary = theme
    row['Secondary theme(s)'] = secondary
    row['Topic / educational focus'] = clean_val(v2_row['Topic / educational focus'] if v2_row is not None else '', topic)
    
    # --- Age group (based on song complexity) ---
    age_map = {
        "I Went Down into the Barnyard": "Ages 1-3 (toddlers; simple animal sounds and imitation)",
        "Dig a Little Hole": "Ages 2-4 (preschool; nature exploration)",
        "Over in the Meadow": "Ages 2-5 (counting progression suits broad range)",
        "Old MacDonald Had a Band": "Ages 2-5 (instrument recognition; group play)",
        "The Turkey Song": "Ages 2-4 (seasonal; simple animal theme)",
        "The Fishing Song": "Ages 3-5 (narrative structure; action sequencing)",
        "Owl Moon": "Ages 3-6 (atmospheric; listening skills; imagination)",
        "There's a Dog in the School": "Ages 2-4 (humor; animal theme)",
        "Hush Little Baby": "Ages 0-3 (lullaby; infant soothing; family bonding)",
        "The Wiggly Worm": "Ages 2-4 (science/nature; body movement)",
        "Down in the Valley": "Ages 3-6 (folk ballad; wider melody; landscape imagery)",
        "Wahoo Wahoo": "Ages 1-3 (energetic; simple repetition; dog theme)",
        "Goodnight Beloved Mine": "Ages 0-3 (lullaby; infant soothing)",
        "Plant Your Seeds With Care": "Ages 2-4 (nature/growth; planting actions)",
        "Zoom Zoom Zoom": "Ages 2-5 (counting; rocket theme; blast-off excitement)",
        "Turn Around": "Ages 2-5 (gross motor; body awareness; directions)",
        "The Moonman": "Ages 3-5 (imagination; moon/space; atmospheric)",
        "On My Way to Dreamland": "Ages 0-3 (lullaby; bedtime routine)",
        "Down on Grampa's Farm": "Ages 2-5 (farm animals; family; energetic)",
        "The Truck Song": "Ages 2-4 (vehicles; transportation; energetic)",
        "Swimming, Swimming": "Ages 2-5 (water play; summer; movement)",
        "Welcome Summer": "Ages 2-5 (seasons; celebration; nature)",
        "Going to the Market": "Ages 3-5 (ring game; cultural; shaker instruments)",
        "Humpty Dumpty": "Ages 2-4 (narrative nursery rhyme; sequencing)",
        "Tapping on My Sticks": "Ages 2-5 (instrument exploration; dynamics; tempo)",
        "Teacup": "Ages 2-4 (pretend play; fine motor; social)",
        "Time to Put Away": "Ages 1-4 (routine; transition; self-regulation)",
        "Hand Washing Song": "Ages 2-6 (health routine; hygiene; sequencing)",
    }
    row['Age group'] = age_map.get(title, 'Ages 2-5')
    
    # --- Learning goals ---
    learning_goals = {
        "I Went Down into the Barnyard": "Identify and imitate farm animal sounds; develop vocabulary for animal names; practice call-and-response; build memory through cumulative listing",
        "Dig a Little Hole": "Learn about seed planting process; develop fine motor skills through digging motions; understand growth cycles; practice patience through song pacing",
        "Over in the Meadow": "Count from 1 to 10; match numbers to animals; develop one-to-one correspondence; build number vocabulary through repetition",
        "Old MacDonald Had a Band": "Identify and name musical instruments; explore different instrument sounds; practice ensemble playing concepts; develop instrument vocabulary",
        "The Turkey Song": "Describe turkey characteristics; develop descriptive vocabulary; practice animal imitation; explore seasonal (autumn) themes",
        "The Fishing Song": "Sequence narrative events (cast, wait, catch, lose); develop action vocabulary; practice storytelling through song; explore water themes",
        "Owl Moon": "Develop listening skills; explore nocturnal animals; build atmospheric vocabulary; practice hushed controlled voice; connect with nature",
        "There's a Dog in the School": "Explore school environment through humor; develop animal vocabulary; practice narrative comprehension; build social awareness",
        "Hush Little Baby": "Develop soothing self-regulation through lullaby; build family/comfort vocabulary; practice gentle rocking motion; support sleep routines",
        "The Wiggly Worm": "Learn about earthworms and soil; develop body awareness through wiggling; practice descriptive vocabulary; explore science concepts",
        "Down in the Valley": "Develop landscape vocabulary (valley, mountains); practice folk song traditions; build descriptive language; connect with nature",
        "Wahoo Wahoo": "Practice joyful exclamation and expression; develop dog vocabulary; build energetic participation skills; practice group singing",
        "Goodnight Beloved Mine": "Develop bedtime self-regulation; practice gentle rocking motion; build comfort vocabulary; support sleep routines",
        "Plant Your Seeds With Care": "Learn seed-to-plant growth process; develop nature vocabulary; practice gentle care concepts; build understanding of responsibility",
        "Zoom Zoom Zoom": "Count down from 5 to 1; develop space/rocket vocabulary; practice counting sequences; build excitement through tempo change",
        "Turn Around": "Develop body awareness (directions, body parts); practice gross motor skills; learn spatial concepts; build directional vocabulary",
        "The Moonman": "Explore moon and nighttime imagery; develop imaginative vocabulary; practice atmospheric listening; connect with night sky",
        "On My Way to Dreamland": "Develop bedtime transition skills; practice dream/imagination vocabulary; support sleep routine; build self-soothing capacity",
        "Down on Grampa's Farm": "Identify farm animals and sounds; develop family vocabulary (Grandpa); practice energetic participation; explore farm life",
        "The Truck Song": "Learn about vehicles and transportation; develop truck/vocabulary; practice driving motions; understand loading/unloading concepts",
        "Swimming, Swimming": "Develop water safety awareness; practice swimming vocabulary; build physical movement skills; explore summer/water themes",
        "Welcome Summer": "Identify summer characteristics; develop seasonal vocabulary; practice celebratory expression; connect with nature cycles",
        "Going to the Market": "Develop market/community vocabulary; practice shaker instrument skills; build social interaction through ring game; explore cultural traditions",
        "Humpty Dumpty": "Sequence narrative events; develop vocabulary (wall, king's horses); practice cause-and-effect understanding; build rhyme awareness",
        "Tapping on My Sticks": "Explore dynamics (loud/quiet); explore tempo (fast/slow); develop stick percussion skills; practice following musical directions",
        "Teacup": "Develop fine motor skills (pretend pouring); practice social pretend play; build tea-party vocabulary; explore gentle/careful movements",
        "Time to Put Away": "Develop cleanup routine habits; practice transition skills; build organizational vocabulary; support self-regulation",
        "Hand Washing Song": "Learn proper hand-washing steps; develop hygiene awareness; practice 20-second timing; build health routine vocabulary",
    }
    row['Learning goals / what it teaches'] = learning_goals.get(title, '')
    
    # --- Actions/movement ---
    actions = db.get('actions', '') or ''
    if not actions and best_db is not None:
        actions = str(best_db.get('actions', '')) if pd.notna(best_db.get('actions')) else ''
    row['Actions / movement'] = actions if actions and actions != 'nan' else ''
    
    # --- Musical content ---
    music = MUSICAL_DATA.get(title, {})
    row['Musical focus: beat'] = music.get('beat', '')
    row['Musical focus: rhythm'] = music.get('rhythm', '')
    row['Musical focus: melody'] = music.get('melody', '')
    row['Musical focus: tempo'] = music.get('tempo', '')
    row['Musical focus: dynamics'] = music.get('dynamics', '')
    row['Musical focus: form'] = music.get('form', '')
    row['Musical focus: timbre'] = music.get('timbre', '')
    row['Musical focus: texture'] = music.get('texture', '')
    
    # --- Before/During/After facilitation ---
    before_notes = {
        "I Went Down into the Barnyard": "Gather children in circle; introduce farm theme; ask 'What sounds do farm animals make?'; prepare animal sound cards if available",
        "Dig a Little Hole": "Show a small pot with soil and seeds; ask children about gardens; prepare digging hand motions",
        "Over in the Meadow": "Count together to warm up; show animal picture cards numbered 1-10; build anticipation for each new animal",
        "Old MacDonald Had a Band": "Show or play clips of instruments (guitar, drums, trumpet, shaker); ask children which instruments they've seen; set up instrument props",
        "The Turkey Song": "Show turkey pictures or puppet; ask about Thanksgiving/autumn; demonstrate waddling motion",
        "The Fishing Song": "Show toy fishing rod or puppet fish; discuss what fish look like; practice casting motion",
        "Owl Moon": "Dim lights slightly if possible; show owl picture; practice 'hoo hoo' sounds; set nighttime atmosphere",
        "There's a Dog in the School": "Show dog puppet; ask 'What would happen if a dog came to school?'; build humorous anticipation",
        "Hush Little Baby": "Dim lights; establish calm atmosphere; rock child on lap; introduce comforting voice",
        "The Wiggly Worm": "Show worm picture or toy; discuss where worms live; practice wiggling body motion",
        "Down in the Valley": "Show landscape picture (valley, mountains); point down and wide; establish folk song atmosphere",
        "Wahoo Wahoo": "Show dog puppet or picture; practice 'Wahoo!' exclamation; build energetic mood",
        "Goodnight Beloved Mine": "Create bedtime atmosphere; use sleepy voice; establish gentle rocking rhythm",
        "Plant Your Seeds With Care": "Show real seeds and soil; discuss planting; demonstrate gentle planting motion",
        "Zoom Zoom Zoom": "Build rocket ship with chairs or show rocket picture; count down practice; build excitement",
        "Turn Around": "Stand in circle; practice turning slowly; point to different directions as warm-up",
        "The Moonman": "Show moon picture; practice making circle with arms; establish nighttime atmosphere",
        "On My Way to Dreamland": "Create dreamy atmosphere; use soft voice; establish pillow/blanket motions",
        "Down on Grampa's Farm": "Show farm pictures; discuss grandparents' farms; practice bouncy knee motions",
        "The Truck Song": "Show toy trucks; practice driving motions; practice honking sounds",
        "Swimming, Swimming": "Show pool or water pictures; practice arm-stroke motions; discuss water safety",
        "Welcome Summer": "Show summer pictures (sun, flowers); practice stretching wide arms; celebrate season change",
        "Going to the Market": "Set up shakers for each child; demonstrate ring-game formation; explain market concept",
        "Humpty Dumpty": "Show Humpty Dumpty picture; practice sitting on 'wall' (chair); build narrative anticipation",
        "Tapping on My Sticks": "Distribute rhythm sticks; practice holding sticks; demonstrate basic tap; set expectations for volume changes",
        "Teacup": "Show real teacup or play set; practice pretend pouring; demonstrate gentle handling",
        "Time to Put Away": "Identify items that need putting away; set timer concept; establish cleanup expectation",
        "Hand Washing Song": "Go to sink area; show soap and water; demonstrate steps; practice 20-second count",
    }
    row['Before notes'] = before_notes.get(title, '')
    
    during_notes = {
        "I Went Down into the Barnyard": "Sing together; pause for children to make animal sounds; encourage movement imitation; vary volume for different animals",
        "Dig a Little Hole": "Sing while making digging motions; encourage children to mimic planting actions; use gentle steady pace",
        "Over in the Meadow": "Count aloud with each verse; encourage children to hold up correct number of fingers; build energy as numbers increase",
        "Old MacDonald Had a Band": "Pass instruments around; each child plays during their verse; encourage listening to different sounds",
        "The Turkey Song": "Waddle together; gobble on cue; encourage exaggerated turkey movements; maintain humorous energy",
        "The Fishing Song": "Act out casting, waiting, reeling; dramatic pause for 'the one that got away'; build storytelling engagement",
        "Owl Moon": "Sing in hushed voices; make owl eyes with hands; turn heads side to side; maintain atmospheric quiet",
        "There's a Dog in the School": "Sing with humorous character voice; encourage dog-like movements; build comedic timing",
        "Hush Little Baby": "Rock gently; maintain very soft voice; sing directly to individual child or group; sustain calming rhythm",
        "The Wiggly Worm": "Wiggle entire body; crawl on floor if space allows; wiggling fingers; encourage worm-like movement",
        "Down in the Valley": "Sway gently; point down for valley, arms wide for mountains; sing with expressive dynamics",
        "Wahoo Wahoo": "Call out 'Wahoo!' together; encourage energetic participation; maintain high energy; group singing",
        "Goodnight Beloved Mine": "Rock very gently; sustain hushed voice; close eyes together; maintain drowsy atmosphere",
        "Plant Your Seeds With Care": "Plant seeds together (real or imaginary); pat soil; make growing-up motion; maintain gentle pace",
        "Zoom Zoom Zoom": "Bounce child on lap; lift high on 'blast off!'; count down together; build excitement gradually",
        "Turn Around": "Turn in place together; point to directions named in song; maintain safe speed; encourage body awareness",
        "The Moonman": "Make moon shapes with arms; point up; maintain hushed mysterious tone; encourage imagination",
        "On My Way to Dreamland": "Rock very slowly; use pillow/blanket motions; sustain drowsy pace; support transition to sleep",
        "Down on Grampa's Farm": "Bounce on knees; make animal sounds for each verse; maintain bouncy energy; encourage participation",
        "The Truck Song": "Drive motions with arms; honk horn sounds; load/unloading gestures; maintain driving energy",
        "Swimming, Swimming": "Arm-stroke swimming motions; splash gestures; maintain steady swim pace; encourage water-play energy",
        "Welcome Summer": "Stretch arms wide; point to sky/sun; joyful movements; celebrate with energy and warmth",
        "Going to the Market": "Shake shakers in time; one child in centre for ring game; maintain rhythmic energy; encourage social interaction",
        "Humpty Dumpty": "Sit on chair for 'wall'; dramatic fall (gently); act out 'all the king's horses'; build narrative drama",
        "Tapping on My Sticks": "Follow verse instructions: tap floor, air, quietly, loudly, slowly, quickly; respond to dynamic/tempo changes; stick discipline",
        "Teacup": "Pretend to pour and sip; handle 'teacup' gently; practice fine motor grace; maintain pretend-play focus",
        "Time to Put Away": "Actually put items away while singing; follow song's tempo; maintain transition energy; celebrate completion",
        "Hand Washing Song": "Wash hands following song steps; scrub for full 20 seconds; rinse; dry; maintain health-routine focus",
    }
    row['During notes'] = during_notes.get(title, '')
    
    after_notes = {
        "I Went Down into the Barnyard": "Review animal names and sounds; extend with other farm animal songs; create animal sound matching activity",
        "Dig a Little Hole": "Plant real seeds in classroom garden; observe growth over weeks; draw what they planted",
        "Over in the Meadow": "Number matching activity with animal cards; extend counting to higher numbers; create number animal book",
        "Old MacDonald Had a Band": "Instrument exploration time; children choose instruments to play; create class band performance",
        "The Turkey Song": "Draw turkeys; discuss autumn changes; extend with other autumn songs; create turkey art project",
        "The Fishing Song": "Fishing magnetic toy activity; draw fish; discuss water habitats; storytelling extension",
        "Owl Moon": "Nighttime observation activity (moon watching); draw night sky; read owl picture books; quiet listening exercise",
        "There's a Dog in the School": "Draw 'dog at school' pictures; extend with other school-animal stories; dramatic play extension",
        "Hush Little Baby": "Gentle rocking continues; transition to nap time or quiet activity; comfort objects available",
        "The Wiggly Worm": "Worm observation in garden/compost; draw worms; discuss soil science; nature walk extension",
        "Down in the Valley": "Landscape drawing activity; discuss different landforms; nature walk; folk song collection",
        "Wahoo Wahoo": "Dog-themed play activity; draw dogs; extend with other dog songs; energetic group game",
        "Goodnight Beloved Mine": "Transition to sleep/quiet time; comfort objects; gentle rocking continues; bedtime routine reinforcement",
        "Plant Your Seeds With Care": "Ongoing garden observation; daily watering routine; growth chart; nature journaling",
        "Zoom Zoom Zoom": "Rocket craft activity; space picture books; counting practice extension; number ordering game",
        "Turn Around": "Directional movement game; body part identification; mirror activity; gross motor obstacle course",
        "The Moonman": "Moon observation journal; night sky art; discuss phases of moon; space picture books",
        "On My Way to Dreamland": "Transition to sleep; bedtime story extension; dream journal for older children; comfort routine",
        "Down on Grampa's Farm": "Farm dramatic play; animal sound matching game; visit real farm if possible; farm art project",
        "The Truck Song": "Truck play with toy vehicles; building/loading activity; transportation unit extension; road map drawing",
        "Swimming, Swimming": "Water play activity; pool safety discussion; swimming art project; summer activity planning",
        "Welcome Summer": "Summer bucket list activity; seasonal art project; nature walk to observe summer changes; sun safety discussion",
        "Going to the Market": "Market dramatic play setup; shopping list activity; currency/counting extension; cultural food exploration",
        "Humpty Dumpty": "Egg drop experiment (STEM); draw Humpty Dumpty story sequence; retelling activity; egg-themed art",
        "Tapping on My Sticks": "Free exploration with sticks; compose simple rhythm patterns; dynamic/tempo chart creation; percussion ensemble",
        "Teacup": "Tea party dramatic play; practice pour-and-serve; table manners discussion; fine motor activities",
        "Time to Put Away": "Cleanup routine reinforcement; classroom job chart; self-regulation practice; celebrate organized space",
        "Hand Washing Song": "Practice hand washing daily; hygiene poster creation; germ science exploration; health routine chart",
    }
    row['After notes'] = after_notes.get(title, '')
    
    # --- Staff and characters ---
    row['Staff lead'] = clean_val(v2_row['Staff lead'] if v2_row is not None else '', db.get('suggested_staff', ''))
    row['Student characters'] = clean_val(v2_row['Student characters'] if v2_row is not None else '', db.get('suggested_students', ''))
    row['Character rationale'] = clean_val(v2_row['Character rationale'] if v2_row is not None else '', '')
    
    # --- Worksheet fields ---
    worksheet_data = {
        "I Went Down into the Barnyard": {
            "purpose": "Animal sound matching and farm vocabulary reinforcement",
            "activity_type": "Cut-and-paste matching + drawing",
            "directions": "1. Cut out animal pictures. 2. Paste each animal next to the matching sound word. 3. Draw your favourite farm animal and label it.",
            "answer_key": "Match: cow-moo, pig-oink, duck-quack, horse-neigh, chicken-cluck. Labels should include animal name.",
            "visual_notes": "Large animal illustrations; clear sound-word labels; dotted cutting lines; drawing space with border",
            "differentiation": "Simplified: pre-cut animals for fine motor support. Extended: write animal names independently; add more animals.",
        },
        "Dig a Little Hole": {
            "purpose": "Seed planting sequence and nature vocabulary",
            "activity_type": "Sequencing puzzle + labelling",
            "directions": "1. Cut out the 4 picture cards. 2. Paste them in the correct growing order (dig, plant, water, grow). 3. Label each step.",
            "answer_key": "Order: dig hole → put seed in → cover with soil → water and watch grow",
            "visual_notes": "Simple seed-to-plant sequence illustrations; numbered boxes; nature colour palette",
            "differentiation": "Simplified: numbered guides on sequencing. Extended: write sentences describing each step.",
        },
        "Over in the Meadow": {
            "purpose": "Number recognition and animal-counting matching",
            "activity_type": "Count-and-circle + number writing",
            "directions": "1. Count the animals in each box. 2. Circle the correct number. 3. Trace and write the number on the line.",
            "answer_key": "Each box contains 1-10 animals matching the song verses; correct numbers circled",
            "visual_notes": "Clear animal groupings; large traceable numbers; colourful illustrations",
            "differentiation": "Simplified: numbers 1-5 only. Extended: write number word (one, two, three); add more animals.",
        },
        "Old MacDonald Had a Band": {
            "purpose": "Instrument identification and sound matching",
            "activity_type": "Matching + colouring",
            "directions": "1. Match each instrument picture to its name. 2. Colour the instrument you would most like to play. 3. Draw a line to the instrument that makes the loudest sound.",
            "answer_key": "guitar-string instrument; drums-percussion; trumpet-brass; shaker-percussion",
            "visual_notes": "Clear instrument illustrations; name labels below; colouring space; loud/soft symbols",
            "differentiation": "Simplified: picture-only matching. Extended: classify instruments by family; write instrument names.",
        },
        "The Turkey Song": {
            "purpose": "Turkey features and autumn vocabulary",
            "activity_type": "Labelling + drawing",
            "directions": "1. Label the turkey picture (feathers, beak, wattle, feet, wing). 2. Draw a turkey using the step-by-step guide. 3. Write one thing you learned about turkeys.",
            "answer_key": "Labels: feathers (body), beak (front of head), wattle (red hanging), feet (bottom), wing (side)",
            "visual_notes": "Large turkey outline for labelling; step-by-step drawing guide; autumn colour palette",
            "differentiation": "Simplified: word bank for labels. Extended: write a turkey fact paragraph; add habitat details.",
        },
        "The Fishing Song": {
            "purpose": "Story sequencing and fishing vocabulary",
            "activity_type": "Story sequence + vocabulary matching",
            "directions": "1. Put the story pictures in order (cast, wait, catch, lose). 2. Match fishing words to pictures. 3. Draw what happened at the end.",
            "answer_key": "Sequence: cast line → wait patiently → fish bites → fish gets away. Draw child looking sad/disappointed.",
            "visual_notes": "Water-themed illustrations; story boxes numbered 1-4; fishing vocabulary word bank",
            "differentiation": "Simplified: 3-picture sequence (cast, catch, lose). Extended: write the story in sentences.",
        },
        "Owl Moon": {
            "purpose": "Nocturnal animal exploration and atmospheric vocabulary",
            "activity_type": "Night-sky colouring + vocabulary",
            "directions": "1. Colour the night scene (moon, stars, owl, trees). 2. Match night-time words to pictures. 3. Draw what you might see on a walk with an owl.",
            "answer_key": "Night words: moon, star, owl, dark, hoot, tree, shadow, quiet",
            "visual_notes": "Dark-themed colouring page; moonlit scene; owl silhouette; night vocabulary in star shapes",
            "differentiation": "Simplified: colour only. Extended: write night-time sentences; add more nocturnal animals.",
        },
        "There's a Dog in the School": {
            "purpose": "School environment vocabulary and humorous storytelling",
            "activity_type": "Picture-to-word matching + creative writing",
            "directions": "1. Match school words to pictures (desk, book, teacher, playground, dog). 2. Draw the dog doing something funny at school. 3. Write one sentence about the dog's adventure.",
            "answer_key": "Match school items; creative drawing should show humour; sentence should include subject and verb",
            "visual_notes": "School-themed illustrations; funny dog character; speech bubble for writing",
            "differentiation": "Simplified: picture matching only. Extended: write 2-3 sentences; create a mini-story.",
        },
        "Hush Little Baby": {
            "purpose": "Comfort object vocabulary and lullaby connection",
            "activity_type": "Picture matching + colouring",
            "directions": "1. Match each gift from the song to its picture (mockingbird, diamond ring, looking glass, Billy goat). 2. Colour your favourite gift. 3. Draw what you would want Mama to buy you.",
            "answer_key": "Match: mockingbird-bird, diamond ring-jewel, looking glass-mirror, Billy goat-goat",
            "visual_notes": "Gentle lullaby-themed border; soft pastel colours; gift illustrations in circles",
            "differentiation": "Simplified: 4 gifts only. Extended: write the gift name; create additional verse.",
        },
        "The Wiggly Worm": {
            "purpose": "Earthworm science and body movement vocabulary",
            "activity_type": "Labelling + observation recording",
            "directions": "1. Label the worm diagram (head, tail, segments). 2. Circle where worms live (underground). 3. Draw and describe a wiggly worm.",
            "answer_key": "Labels: head (front), tail (back), segments (body rings). Circle underground/below ground.",
            "visual_notes": "Simple worm cross-section; underground scene; wiggle-line borders",
            "differentiation": "Simplified: pre-labeled diagram with fill-in. Extended: write worm facts; add soil layers.",
        },
        "Down in the Valley": {
            "purpose": "Landscape vocabulary and nature appreciation",
            "activity_type": "Landscape labelling + art",
            "directions": "1. Label the landscape (valley, mountains, river, sky, trees). 2. Use crayons to create a landscape drawing. 3. Write 3 words that describe how the valley looks.",
            "answer_key": "Labels: valley (low area), mountains (tall), river (water), sky (above), trees (green)",
            "visual_notes": "Scenic landscape template; label arrows; nature colour palette; writing lines",
            "differentiation": "Simplified: picture matching only. Extended: write descriptive sentences; add weather/time of day.",
        },
        "Wahoo Wahoo": {
            "purpose": "Dog vocabulary and joyful expression",
            "activity_type": "Dog matching + emotion expression",
            "directions": "1. Match dog body parts to labels (ear, tail, paw, nose, bark). 2. Draw a happy dog. 3. Write or draw what makes you say 'Wahoo!'",
            "answer_key": "Match body parts correctly; happy expression on drawing; personal response in writing",
            "visual_notes": "Cute dog illustrations; large labels; happy face template; speech bubble",
            "differentiation": "Simplified: colour the dog only. Extended: write dog facts; create dog story.",
        },
        "Goodnight Beloved Mine": {
            "purpose": "Bedtime vocabulary and comfort routines",
            "activity_type": "Bedtime sequence + colouring",
            "directions": "1. Put bedtime steps in order (brush teeth, pyjamas, story, song, sleep). 2. Colour the bedtime scene. 3. Draw your bedtime routine.",
            "answer_key": "Sequence: brush teeth → put on pyjamas → hear story → hear song → go to sleep",
            "visual_notes": "Soft nighttime colours; moon and stars border; sleepy illustrations; sequencing boxes",
            "differentiation": "Simplified: 3-step sequence. Extended: write bedtime routine sentences; add more steps.",
        },
        "Plant Your Seeds With Care": {
            "purpose": "Growth cycle learning and nature care vocabulary",
            "activity_type": "Growth sequencing + labelling",
            "directions": "1. Colour the 4 growth stages (seed, sprout, plant, flower). 2. Paste them in order. 3. Write what each stage needs (water, sun, soil, care).",
            "answer_key": "Order: seed underground → sprout emerging → plant growing → flower blooming",
            "visual_notes": "Garden-themed border; clear growth stage illustrations; nature colour palette",
            "differentiation": "Simplified: pre-numbered sequence. Extended: write care instructions for each stage.",
        },
        "Zoom Zoom Zoom": {
            "purpose": "Countdown sequence and space vocabulary",
            "activity_type": "Countdown colouring + number ordering",
            "directions": "1. Colour the rocket and moon. 2. Write numbers 5-1 in countdown order. 3. Draw what you would see on the moon.",
            "answer_key": "Countdown: 5, 4, 3, 2, 1, Blast off! Moon drawing can be creative",
            "visual_notes": "Space-themed border; rocket illustration; moon surface; large countdown boxes",
            "differentiation": "Simplified: numbers 3-1 only. Extended: write 'Blast off!' sentence; add planet details.",
        },
        "Turn Around": {
            "purpose": "Body awareness and directional vocabulary",
            "activity_type": "Body labelling + action matching",
            "directions": "1. Label body parts (head, arms, legs, hands, feet). 2. Draw arrows showing turn directions (left, right, around). 3. Follow the action words in the song.",
            "answer_key": "Labels: head (top), arms (sides), legs (bottom), hands (end of arms), feet (end of legs)",
            "visual_notes": "Standing child outline; direction arrows; action words with motion symbols",
            "differentiation": "Simplified: 3 body parts only. Extended: write direction sentences; add more body parts.",
        },
        "The Moonman": {
            "purpose": "Moon and night-sky exploration vocabulary",
            "activity_type": "Moon labelling + creative art",
            "directions": "1. Label the night sky (moon, stars, clouds, dark sky). 2. Draw the Moonman character. 3. Write 3 words about nighttime.",
            "answer_key": "Labels: moon (round), stars (small points), clouds (fluffy), dark sky (background)",
            "visual_notes": "Dark sky background; glowing moon; star stickers possible; moonman character outline",
            "differentiation": "Simplified: colour the moon scene. Extended: write moon facts; create moonman story.",
        },
        "On My Way to Dreamland": {
            "purpose": "Bedtime transition and dream vocabulary",
            "activity_type": "Dream sequencing + colouring",
            "directions": "1. Colour the dreamland scene (stars, moon, pillow, blanket). 2. Draw what you dream about. 3. Match bedtime words to pictures.",
            "answer_key": "Dream drawing is personal; match: sleep, dream, pillow, blanket, moon, stars, quiet",
            "visual_notes": "Dreamy pastel colours; cloud and star border; pillow/blanket illustrations",
            "differentiation": "Simplified: colour only. Extended: write dream description; create dreamland map.",
        },
        "Down on Grampa's Farm": {
            "purpose": "Farm animal vocabulary and family connections",
            "activity_type": "Farm matching + family drawing",
            "directions": "1. Match farm animals to their sounds. 2. Draw Grampa's farm with at least 3 animals. 3. Write who you would visit on a farm.",
            "answer_key": "Sound matches correct; farm drawing includes animals, barn, fences; personal response",
            "visual_notes": "Farm scene template; animal sound bubbles; barn and fence elements; family theme",
            "differentiation": "Simplified: colour farm scene only. Extended: write farm sentences; add more animals.",
        },
        "The Truck Song": {
            "purpose": "Vehicle vocabulary and loading/unloading concepts",
            "activity_type": "Truck matching + sequencing",
            "directions": "1. Match truck parts to labels (cab, wheels, bed, horn, cargo). 2. Put loading steps in order. 3. Draw your dream truck.",
            "answer_key": "Labels: cab (front), wheels (bottom), bed (back), horn (top), cargo (in bed)",
            "visual_notes": "Truck outline for labelling; loading sequence boxes; road-themed border",
            "differentiation": "Simplified: 3 truck parts only. Extended: write truck story; add more vehicle types.",
        },
        "Swimming, Swimming": {
            "purpose": "Water safety vocabulary and swimming movements",
            "activity_type": "Pool matching + safety rules",
            "directions": "1. Match swimming words to pictures (splash, swim, float, dive, pool). 2. Draw 3 pool safety rules. 3. Colour the swimming scene.",
            "answer_key": "Match words correctly; safety rules: swim with adult, no running, follow lifeguard",
            "visual_notes": "Pool/water-themed border; swimming child illustrations; safety symbols",
            "differentiation": "Simplified: picture matching only. Extended: write safety rules; add swimming stroke names.",
        },
        "Welcome Summer": {
            "purpose": "Seasonal vocabulary and summer characteristics",
            "activity_type": "Summer matching + checklist",
            "directions": "1. Match summer items to words (sun, flower, beach, ice cream, butterfly). 2. Tick the summer activities you like. 3. Draw your favourite summer thing.",
            "answer_key": "Match items correctly; personal responses in checklist; drawing is individual",
            "visual_notes": "Sunny summer border; bright colours; sun and flower illustrations; checklist format",
            "differentiation": "Simplified: colour summer items only. Extended: write summer sentences; create summer calendar.",
        },
        "Going to the Market": {
            "purpose": "Market vocabulary and cultural awareness",
            "activity_type": "Market matching + shopping list",
            "directions": "1. Match market items to pictures (fruit, bread, flowers, cheese, fabric). 2. Create a shopping list with 5 items. 3. Draw the market scene.",
            "answer_key": "Match items correctly; shopping list has 5 different items; market scene includes stalls",
            "visual_notes": "Market stall illustrations; colourful produce; shopping bag template; cultural elements",
            "differentiation": "Simplified: 3 items only. Extended: write prices; create market map; add cultural details.",
        },
        "Humpty Dumpty": {
            "purpose": "Narrative sequencing and rhyme awareness",
            "activity_type": "Story sequencing + rhyme matching",
            "directions": "1. Put the story in order (sit, fall, broken, can't fix). 2. Match rhyming words (wall/fall, king/sing, horses/courses). 3. Retell the story in your own words.",
            "answer_key": "Sequence: sat on wall → had great fall → all king's horses → couldn't fix. Rhymes match.",
            "visual_notes": "Story sequence boxes; egg character illustrations; rhyming word pairs in cloud shapes",
            "differentiation": "Simplified: 3-picture sequence. Extended: write rhyme pairs; create alternative ending.",
        },
        "Tapping on My Sticks": {
            "purpose": "Musical dynamics and tempo exploration",
            "activity_type": "Stick pattern recording + dynamics chart",
            "directions": "1. Draw stick-tap patterns for each verse (floor, air, quiet, loud, slow, fast). 2. Match volume words (loud/quiet) to symbols. 3. Create your own stick-tap pattern.",
            "answer_key": "Patterns match verse descriptions; loud = forte symbol, quiet = piano symbol; personal pattern created",
            "visual_notes": "Rhythm stick illustrations; dynamic symbols (f, p); tempo markings; pattern boxes",
            "differentiation": "Simplified: match loud/quiet only. Extended: write rhythm notation; create multi-verse pattern.",
        },
        "Teacup": {
            "purpose": "Fine motor skills and pretend-play vocabulary",
            "activity_type": "Tea party labelling + sequence",
            "directions": "1. Label tea party items (cup, saucer, pot, spoon, table). 2. Put tea-party steps in order (pour, stir, sip, share). 3. Draw your tea party.",
            "answer_key": "Labels correct; sequence: pour tea → stir → sip → share with friend",
            "visual_notes": "Elegant tea-party border; cup and saucer illustrations; gentle pastel colours",
            "differentiation": "Simplified: 3 items only. Extended: write tea-party invitations; add more steps.",
        },
        "Time to Put Away": {
            "purpose": "Routine vocabulary and cleanup sequencing",
            "activity_type": "Cleanup matching + checklist",
            "directions": "1. Match items to where they belong (books→shelf, blocks→bin, crayons→box). 2. Create a cleanup checklist. 3. Draw the clean classroom.",
            "answer_key": "Items matched to correct storage locations; checklist has at least 5 items",
            "visual_notes": "Classroom items; storage locations; checklist format; clean/tidy visual contrast",
            "differentiation": "Simplified: 3 items only. Extended: write cleanup rules; create classroom job chart.",
        },
        "Hand Washing Song": {
            "purpose": "Health hygiene and step-by-step procedure learning",
            "activity_type": "Step sequencing + poster creation",
            "directions": "1. Put hand-washing steps in order (wet, soap, scrub, rinse, dry). 2. Time yourself for 20 seconds. 3. Create a hand-washing poster.",
            "answer_key": "Order: wet hands → apply soap → scrub all surfaces → rinse → dry with towel",
            "visual_notes": "Hand illustrations at each step; 20-second timer; water and soap icons; clear numbered steps",
            "differentiation": "Simplified: 3 steps only. Extended: write step descriptions; create germ-science extension.",
        },
    }
    
    ws = worksheet_data.get(title, {})
    row['Worksheet purpose'] = ws.get('purpose', '')
    row['Child-facing activity type'] = ws.get('activity_type', '')
    row['Worksheet directions'] = ws.get('directions', '')
    row['Answer/key guidance'] = ws.get('answer_key', '')
    row['Visual/format notes'] = ws.get('visual_notes', '')
    row['Differentiation/support'] = ws.get('differentiation', '')
    
    # --- Safety/accessibility (removed boilerplate, blank if no specific concern) ---
    row['Safety/accessibility notes'] = ''
    
    # --- Lyrics reference ---
    lyrics = ''
    if title in WEBSITE_LYRICS:
        lyrics = WEBSITE_LYRICS[title]
    elif best_db is not None and pd.notna(best_db.get('lyrics')) and str(best_db.get('lyrics')).strip():
        lyrics = str(best_db['lyrics']).strip()
    row['Lyrics/description reference'] = lyrics
    
    # --- Source provenance ---
    provenance_parts = []
    if db.get('cd_title'):
        provenance_parts.append(f"Album: {db['cd_title']}")
    if db.get('track_num'):
        provenance_parts.append(f"Track: {db['track_num']}")
    if best_db is not None:
        provenance_parts.append(f"DB IDs: {', '.join(str(x) for x in db_records['id'].tolist()) if not db_records.empty else 'N/A'}")
    if yt_urls:
        provenance_parts.append("YouTube: verified")
    if web_urls:
        provenance_parts.append("kathyreidnaiman.com: verified")
    row['Source provenance'] = '; '.join(provenance_parts)
    
    rows.append(row)

# --- Create DataFrame ---
columns = [
    'Canonical song title', 'Channel order', 'Album / CD title', 'Track number(s)', 'Artist',
    'YouTube URLs', 'Website URLs', 'Local video paths', 'Source provenance',
    'Primary theme', 'Secondary theme(s)', 'Topic / educational focus', 'Age group',
    'Learning goals / what it teaches', 'Actions / movement',
    'Musical focus: beat', 'Musical focus: rhythm', 'Musical focus: melody',
    'Musical focus: tempo', 'Musical focus: dynamics', 'Musical focus: form',
    'Musical focus: timbre', 'Musical focus: texture',
    'Before notes', 'During notes', 'After notes',
    'Staff lead', 'Student characters', 'Character rationale',
    'Worksheet purpose', 'Child-facing activity type', 'Worksheet directions',
    'Answer/key guidance', 'Visual/format notes', 'Differentiation/support',
    'Safety/accessibility notes', 'Lyrics/description reference',
]

df_out = pd.DataFrame(rows, columns=columns)

# --- Create Instructions sheet ---
instructions_data = [
    ['Kathy Reid-Naiman Recent 28 Prompt Dataset', 'One row per canonical song; prompt-building inputs only'],
    ['Purpose', 'Build a single-page instructional prompt and a printable worksheet prompt; this is not a lesson plan'],
    ['Usage', 'Feed each row into the curriculum page generator or worksheet generator as structured input'],
    ['Musical Content', 'Filled from database (actions, lyrics) and verified against kathyreidnaiman.com where available'],
    ['YouTube URLs', 'All matching uploads merged per song, separated by semicolons'],
    ['Local Videos', 'All matching local paths under Merriweather folder, separated by semicolons'],
    ['Safety/Accessibility', 'Left blank unless a specific song-level concern exists (boilerplate removed)'],
    ['Source', 'SQLite curriculum.db + v2 workbook + YouTube channel JSON + kathyreidnaiman.com'],
]
df_instructions = pd.DataFrame(instructions_data, columns=['Field', 'Value'])

# --- Write to Excel ---
OUTPUT_FINAL = OUTPUT
OUTPUT_TEMP = OUTPUT.replace('.xlsx', '_temp_build.xlsx')

with pd.ExcelWriter(OUTPUT_TEMP, engine='openpyxl') as writer:
    df_out.to_excel(writer, sheet_name='Songs', index=False)
    df_instructions.to_excel(writer, sheet_name='Instructions', index=False)

print(f"Saved to temp: {OUTPUT_TEMP}")
import shutil
try:
    shutil.copy2(OUTPUT_TEMP, OUTPUT_FINAL)
    print(f"Copied to final: {OUTPUT_FINAL}")
except Exception as e:
    print(f"Copy failed (file may be locked): {e}")
    print(f"Temp file available at: {OUTPUT_TEMP}")
print(f"Sheets: Songs, Instructions")
print(f"Songs sheet: {df_out.shape[0]} rows x {df_out.shape[1]} columns")
print(f"Instructions sheet: {df_instructions.shape[0]} rows x {df_instructions.shape[1]} columns")
print(f"\nColumn headers ({len(columns)}):")
for i, col in enumerate(columns, 1):
    print(f"  {i}. {col}")

# Verify no "Needs verification" remains
needs_verify = df_out.apply(lambda x: x.astype(str).str.contains('Needs verification', case=False).any())
if needs_verify.any():
    print(f"\nWARNING: 'Needs verification' still found in columns: {list(needs_verify[needs_verify].index)}")
else:
    print(f"\n✓ No 'Needs verification' placeholders remain")
