#!/usr/bin/env python3
"""
Build the Master Song Curriculum Sheet from all data sources.
Outputs: Master_Song_Curriculum_Sheet.xlsx with 4 sheets.
"""

import sqlite3
import re
import pandas as pd
import numpy as np
from pathlib import Path

DATA_DIR = Path(r"C:\Users\jesse\OneDrive\Documents\New project\data")
DB_PATH = DATA_DIR / "curriculum.db"
SONG_INDEX_PATH = DATA_DIR / "sources" / "early-years-music-resources" / "Song_Index.xlsx"
OUTPUT_PATH = DATA_DIR / "Master_Song_Curriculum_Sheet.xlsx"

# ═══════════════════════════════════════════════════════════════════════════════
# LOAD ALL DATA
# ═══════════════════════════════════════════════════════════════════════════════
conn = sqlite3.connect(str(DB_PATH))

songs_df = pd.read_sql_query(
    "SELECT id, song_name, topic, theme, actions, lyrics, artist, cd_title FROM songs", conn
)
circle_df = pd.read_sql_query(
    "SELECT id, song_name, category, actions, age_group, teaches, source FROM circle_time_songs", conn
)
index_df = pd.read_excel(str(SONG_INDEX_PATH))

songs_curriculum = pd.read_sql_query("SELECT song_id, curriculum_id, relevance FROM songs_curriculum", conn)
songs_early_years = pd.read_sql_query("SELECT song_id, early_years_id, relevance FROM songs_early_years", conn)
circle_curriculum = pd.read_sql_query(
    "SELECT circle_time_song_id, curriculum_topic_id, relevance FROM circle_time_songs_curriculum", conn
)
circle_early_years = pd.read_sql_query(
    "SELECT circle_time_song_id, early_years_topic_id, relevance FROM circle_time_songs_early_years", conn
)
curriculum_topics = pd.read_sql_query(
    "SELECT id, subject, category, grade, lesson_topic, ontario_code, us_code FROM curriculum_topics", conn
)
early_years_topics = pd.read_sql_query(
    "SELECT id, category, subcategory, lesson_goal FROM early_years_topics", conn
)
conn.close()

print(f"Loaded: {len(songs_df)} songs, {len(circle_df)} circle_time, {len(index_df)} Song_Index")

# ═══════════════════════════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════════════════════════

AGE_PATTERNS = [
    (r"(?i)\binfant\b|\bbab(y|ies)\b", "Infant"),
    (r"(?i)\btoddler\b", "Toddler"),
    (r"(?i)\bpreschool\b|\bpre-k\b", "Preschool"),
    (r"(?i)\bkindergarten\b", "Kindergarten"),
    (r"(?i)\bgrade\s*1\b|\b1st\b", "Grade 1"),
    (r"(?i)\bgrade\s*2\b|\b2nd\b", "Grade 2"),
    (r"(?i)\bgrade\s*3\b|\b3rd\b", "Grade 3"),
]


def normalize_age_range(raw: str) -> str:
    if not raw or pd.isna(raw) or str(raw).strip() == "":
        return "Early Childhood"
    text = str(raw)
    matches = []
    seen = set()
    for pat, norm in AGE_PATTERNS:
        if re.search(pat, text) and norm not in seen:
            matches.append(norm)
            seen.add(norm)
    return ", ".join(matches) if matches else "Early Childhood"


def safe_str(val) -> str:
    """Convert any value to string, treating NaN/None as empty."""
    if val is None or (isinstance(val, float) and np.isnan(val)):
        return ""
    s = str(val).strip()
    if s.lower() in ("nan", "none", ""):
        return ""
    return s


TAG_KEYWORDS = {
    "animals": r"(?i)\banimal|dog\b|cat\b|bird\b|fish\b|pig\b|cow\b|sheep\b|hors\w*|duck\b|frog\b|bee\b|bear\b|lion\b|rabbit\b|bunny\b|mouse\b|butterfly\b|chicken\b|rooster\b|hen\b|monkey\b|snake\b|spider\b|owl\b|worm\b|mole\b|squirrel\b|poni|ant\b|bird",
    "body parts": r"(?i)\bbody\b|hand[s]?\b|ear[s]?\b|eye[s]?\b|nose\b|toe[s]?\b|head\b|knee[s]?\b|finger[s]?\b|mouth\b|chin\b|shoulder[s]?\b|tummy\b|belly\b",
    "counting": r"(?i)\bcount|number[s]?\b|ten\b|five\b|ten little\b|one.*two.*three|1.*2.*3",
    "movement": r"(?i)\bmovement\b|dance\b|wiggle\b|hop\b|jump\b|spin\b|clap\b|stomp\b|shak\w*|twirl\b|bounc\w*|gross motor\b|run\b|walk\b|pat\b|sway\b|gallop\b|trot\b",
    "nature": r"(?i)\bnature\b|plant\b|tree[s]?\b|flower[s]?\b|leaf\b|seed[s]?\b|garden\b|forest\b|star[s]?\b|moon\b|sun\b|sky\b|rock\b|hill\b",
    "seasons": r"(?i)\bseason|spring\b|summer\b|autumn\b|fall\b|winter\b|harvest\b",
    "weather": r"(?i)\bweather\b|rain\b|snow\b|wind\b|cloud[s]?\b|storm\b|sunshine\b|umbrella\b",
    "food": r"(?i)\bfood\b|eat\b|cook\w*|apple[s]?\b|bread\b|milk\b|pie\b|cake\b|pumpkin\b|cookie\b|banana\b|orange\b|berry\b|corn\b|tomato\b|pea[s]?\b|bean[s]?\b|soup\b|jam\b|tea\b",
    "feelings": r"(?i)\bfeeling|emotion|happy\b|sad\b|angry\b|scared\b|proud\b|lucky\b|love\b|worry\b|brave\b",
    "routines": r"(?i)\broutine|bath\b|bed\b|get dressed\b|wake\b|sleep\b|brush\b|wash\b|teeth\b|good morning\b|goodbye\b|hello\b|greeting\b|breakfast\b|lunch\b|dinner\b|bath time\b|bedtime\b",
    "music": r"(?i)\bmusic\b|instrument|drum\b|flute\b|piano\b|guitar\b|rhythm\b|shaker\b|bell[s]?\b|stick[s]?\b|tambour\w*|cymbal\b|recorder\b|xylophone\b",
    "farm": r"(?i)\bfarm\b|barn\b|tractor\b|harvest\b|corn\b|hen\b|rooster\b|tractor\b",
    "water": r"(?i)\bwater\b|boat[s]?\b|swim\b|rubber duck\b|sea\b|ocean\b|lake\b|river\b|fish\b|whale\b|splash\b",
    "transportation": r"(?i)\btrain\b|car\b|bus\b|plane\b|vehicle|boat\b|ship\b|bicycle\b|bike\b|truck\b|motorcycle\b|airplane\b|rocket\b",
    "holidays": r"(?i)\bholiday|christmas\b|hallowe|easter\b|hanukkah\b|chanukah\b|diwali\b|new year\b|valentine\b|thanksgiving\b|solstice\b|birthday\b",
    "family": r"(?i)\bfamily\b|mom\b|dad\b|baby\b|brother\b|sister\b|grandma\b|grandpa\b|family\b|mother\b|father\b|uncle\b|aunt\b|cousin\b",
    "social skills": r"(?i)\bsocial\b|friend\b|sharing\b|manners\b|kind\b|helping\b|taking turns\b|please\b|thank you\b|cooperat\b",
    "language": r"(?i)\brhym|alliter|vocabular|letter[s]?\b|alphabet\b|language\b|phon\w*|syllable\b|sentence\b|word[s]?\b",
    "sensory": r"(?i)\bsensory\b|touch\b|smell\b|see\b|hear\b|soft\b|rough\b|smooth\b|warm\b|cold\b|loud\b|quiet\b|taste\b",
    "stories": r"(?i)\bstory\b|folk\s*song\b|nursery\b|rhyme\b|tale\b|fable\b|legend\b",
    "french": r"(?i)\bfrench\b|le\s|la\s|les\s|un\s|une\s|mon\b|ton\b|sur\b|avec\b|dans\b|petit\b|bonjour\b|merci\b",
}


def extract_tags(*texts: str) -> list[str]:
    combined = " ".join(str(t) for t in texts if t and not pd.isna(t))
    if not combined.strip():
        return []
    tags = []
    for tag, pattern in TAG_KEYWORDS.items():
        if re.search(pattern, combined):
            tags.append(tag)
    return tags


def infer_type(song_name: str, actions: str = "", category: str = "") -> str:
    cat = (category or "").lower()
    if "fingerplay" in cat:
        return "Fingerplay"
    if "movement" in cat:
        return "Movement"
    if "greeting" in cat or "goodbye" in cat or "transition" in cat:
        return "Song"

    combined = f"{song_name} {actions}".lower()
    if "finger" in combined:
        return "Fingerplay"
    if "flannel" in combined:
        return "Flannel Board"
    if "bounce" in combined:
        return "Bounce"
    if any(w in combined for w in ["movement", "dance", "wiggle", "hop", "jump", "stomp", "clap", "spin"]):
        return "Movement"
    return "Song"


def infer_materials(actions: str = "", title: str = "") -> str:
    combined = f"{actions} {title}".lower()
    materials = []
    if any(w in combined for w in ["hands", "clap", "pat", "tap", "wave"]):
        materials.append("Hands")
    if "scarf" in combined:
        materials.append("Scarves")
    if any(w in combined for w in ["instrument", "drum", "shaker", "bell", "tambourine", "stick", "rattle", "cymbal"]):
        materials.append("Instruments")
    if "flannel" in combined or "felt" in combined:
        materials.append("Flannel Board")
    if any(w in combined for w in ["puppet", "stuffed animal", "teddy"]):
        materials.append("Puppets")
    if any(w in combined for w in ["ball", "beanbag"]):
        materials.append("Ball/Beanbag")
    if any(w in combined for w in ["ribbon", "streamer"]):
        materials.append("Ribbons/Streamers")
    if "parachute" in combined:
        materials.append("Parachute")
    return ", ".join(materials) if materials else "Hands"


def clean_actions(actions: str) -> str:
    """Remove non-action data from actions column."""
    if not actions:
        return ""
    try:
        float(actions)
        return ""
    except ValueError:
        pass
    junk = {"religion", "humor", "traditional", "seasonal", "holiday",
            "science", "nature", "cooking", "cultural", "folk"}
    if actions.strip().lower() in junk:
        return ""
    return actions


# ═══════════════════════════════════════════════════════════════════════════════
# BUILD MASTER ROWS
# ═══════════════════════════════════════════════════════════════════════════════
master_rows = []

# --- songs table ---
for _, row in songs_df.iterrows():
    name = safe_str(row["song_name"])
    if not name:
        continue
    topic = safe_str(row["topic"])
    theme = safe_str(row["theme"])
    actions = clean_actions(safe_str(row["actions"]))
    lyrics = safe_str(row["lyrics"])
    artist = safe_str(row["artist"])
    cd_title = safe_str(row["cd_title"])
    tags = extract_tags(topic, theme, name)

    # Curriculum links
    cur = songs_curriculum[songs_curriculum["song_id"] == row["id"]]
    cur_texts = []
    for _, cl in cur.iterrows():
        ct = curriculum_topics[curriculum_topics["id"] == cl["curriculum_id"]]
        if not ct.empty:
            ct = ct.iloc[0]
            cur_texts.append(f"{ct['subject']}: {ct['lesson_topic']} ({cl['relevance']})")

    ey = songs_early_years[songs_early_years["song_id"] == row["id"]]
    ey_texts = []
    for _, el in ey.iterrows():
        et_rows = early_years_topics[early_years_topics["id"] == el["early_years_id"]]
        if not et_rows.empty:
            et = et_rows.iloc[0]
            goal = safe_str(et["lesson_goal"])
            cat = safe_str(et["category"])
            sub = safe_str(et["subcategory"])
            label = f"{cat}/{sub}: " if cat or sub else ""
            ey_texts.append(f"{label}{goal} ({el['relevance']})")

    master_rows.append({
        "song_name": name,
        "source": "songs_table",
        "age_range": "Preschool",
        "type": infer_type(name, actions),
        "educational_domain": "",
        "tags": ", ".join(sorted(set(tags))),
        "lyrics": lyrics,
        "actions": actions,
        "materials_needed": infer_materials(actions, name),
        "creator_artist": artist,
        "source_title": cd_title,
        "curriculum_links": "; ".join(cur_texts),
        "early_years_links": "; ".join(ey_texts),
    })

print(f"  songs_table: {len(master_rows)} rows")

# --- circle_time_songs ---
for _, row in circle_df.iterrows():
    name = safe_str(row["song_name"])
    if not name:
        continue
    category = safe_str(row["category"])
    actions = clean_actions(safe_str(row["actions"]))
    teaches = safe_str(row["teaches"])
    age_group = safe_str(row["age_group"])
    source = safe_str(row["source"])
    tags = extract_tags(category, teaches, name)
    age = normalize_age_range(age_group)

    cur = circle_curriculum[circle_curriculum["circle_time_song_id"] == row["id"]]
    cur_texts = []
    for _, cl in cur.iterrows():
        ct = curriculum_topics[curriculum_topics["id"] == cl["curriculum_topic_id"]]
        if not ct.empty:
            ct = ct.iloc[0]
            cur_texts.append(f"{ct['subject']}: {ct['lesson_topic']} ({cl['relevance']})")

    ey = circle_early_years[circle_early_years["circle_time_song_id"] == row["id"]]
    ey_texts = []
    for _, el in ey.iterrows():
        et_rows = early_years_topics[early_years_topics["id"] == el["early_years_topic_id"]]
        if not et_rows.empty:
            et = et_rows.iloc[0]
            goal = safe_str(et["lesson_goal"])
            cat = safe_str(et["category"])
            sub = safe_str(et["subcategory"])
            label = f"{cat}/{sub}: " if cat or sub else ""
            ey_texts.append(f"{label}{goal} ({el['relevance']})")

    master_rows.append({
        "song_name": name,
        "source": "circle_time_songs",
        "age_range": age,
        "type": infer_type(name, actions, category),
        "educational_domain": "",
        "tags": ", ".join(sorted(set(tags))),
        "lyrics": "",
        "actions": actions,
        "materials_needed": infer_materials(actions, name),
        "creator_artist": "",
        "source_title": source,
        "curriculum_links": "; ".join(cur_texts),
        "early_years_links": "; ".join(ey_texts),
    })

print(f"  + circle_time: {len(master_rows)} rows")

# --- Song_Index.xlsx ---
for _, row in index_df.iterrows():
    name = safe_str(row.get("song_title", ""))
    if not name:
        continue
    raw_age = safe_str(row.get("age_range", ""))
    domain = safe_str(row.get("educational_domain", ""))
    creator = safe_str(row.get("creator", ""))
    source_title = safe_str(row.get("source_title", ""))
    age = normalize_age_range(raw_age)
    tags = extract_tags(name, source_title, domain)

    master_rows.append({
        "song_name": name,
        "source": "Song_Index",
        "age_range": age,
        "type": infer_type(name),
        "educational_domain": domain,
        "tags": ", ".join(sorted(set(tags))),
        "lyrics": "",
        "actions": "",
        "materials_needed": "",
        "creator_artist": creator,
        "source_title": source_title,
        "curriculum_links": "",
        "early_years_links": "",
    })

print(f"  + Song_Index: {len(master_rows)} rows")

# ═══════════════════════════════════════════════════════════════════════════════
# DEDUPLICATE
# ═══════════════════════════════════════════════════════════════════════════════
master_df = pd.DataFrame(master_rows)


def norm_name(n):
    n = safe_str(n).lower()
    n = re.sub(r"[^\w\s]", "", n)
    return re.sub(r"\s+", " ", n).strip()


master_df["_norm"] = master_df["song_name"].apply(norm_name)

src_priority = {"songs_table": 0, "circle_time_songs": 1, "Song_Index": 2}
master_df["_prio"] = master_df["source"].map(src_priority).fillna(9)
master_df = master_df.sort_values(["_prio", "_norm"]).reset_index(drop=True)

deduped = master_df.drop_duplicates(subset=["_norm"], keep="first").copy()
deduped = deduped.drop(columns=["_norm", "_prio"]).reset_index(drop=True)

print(f"  Deduplicated: {len(deduped)} unique songs")

# ═══════════════════════════════════════════════════════════════════════════════
# LOOKUP SHEETS
# ═══════════════════════════════════════════════════════════════════════════════

tag_descriptions = {
    "animals": "Songs about or featuring animals (pets, farm, wild, insects)",
    "body parts": "Songs referencing body parts (hands, eyes, head, toes, etc.)",
    "counting": "Songs involving numbers, counting, or math concepts",
    "movement": "Songs with physical actions, dance, jumping, wiggling",
    "nature": "Songs about plants, trees, flowers, seeds, stars, moon, sun",
    "seasons": "Songs related to spring, summer, autumn/fall, winter",
    "weather": "Songs about rain, snow, wind, clouds, sunshine",
    "food": "Songs about eating, cooking, fruits, vegetables, meals",
    "feelings": "Songs about emotions, moods, happy, sad, angry, scared",
    "routines": "Songs about daily routines (bath, bed, morning, greeting)",
    "music": "Songs about instruments, rhythm, singing, bells, drums",
    "farm": "Songs set on a farm or about farm life",
    "water": "Songs about water, boats, swimming, sea/ocean",
    "transportation": "Songs about trains, cars, buses, planes, vehicles",
    "holidays": "Songs related to holidays and celebrations",
    "family": "Songs about family members (mom, dad, baby, siblings)",
    "social skills": "Songs about sharing, friendship, kindness, manners",
    "language": "Songs focusing on rhyming, alphabet, letters, vocabulary",
    "sensory": "Songs involving sensory exploration (touch, smell, see, hear)",
    "stories": "Nursery rhymes, folk songs, story-based songs",
    "french": "Songs in French or with French lyrics/words",
}
tags_lookup = pd.DataFrame([
    {"tag": t, "description": tag_descriptions.get(t, "")}
    for t in sorted(tag_descriptions)
])

age_ranges = pd.DataFrame([
    {"age_range": "Infant", "description": "Birth to 18 months"},
    {"age_range": "Toddler", "description": "18 months to 3 years"},
    {"age_range": "Preschool", "description": "3 to 5 years"},
    {"age_range": "Kindergarten", "description": "4 to 6 years"},
    {"age_range": "Grade 1", "description": "Age 6-7"},
    {"age_range": "Grade 2", "description": "Age 7-8"},
    {"age_range": "Grade 3", "description": "Age 8-9"},
    {"age_range": "Early Childhood", "description": "Birth to 5 years (not specified)"},
])

domains = pd.DataFrame([
    {"domain": "Physical Development", "description": "Gross and fine motor skills, coordination, body awareness, health and safety"},
    {"domain": "Math/Counting", "description": "Numbers, counting, patterns, shapes, basic operations, measurement"},
    {"domain": "Language & Literacy", "description": "Vocabulary, phonics, letter recognition, listening skills, print awareness"},
    {"domain": "Creative Expression", "description": "Art, music, dramatic play, imaginative activities, self-expression"},
    {"domain": "Science/Nature", "description": "Exploration, observation, nature, weather, seasons, cause and effect"},
    {"domain": "Social-Emotional Development", "description": "Feelings, self-regulation, friendship, empathy, cooperation, conflict resolution"},
    {"domain": "Music & Rhythm", "description": "Singing, rhythm, instruments, tempo, pitch, musical appreciation"},
    {"domain": "Cognitive Development", "description": "Problem solving, memory, attention, critical thinking, classification"},
])

# ═══════════════════════════════════════════════════════════════════════════════
# WRITE TO EXCEL
# ═══════════════════════════════════════════════════════════════════════════════
with pd.ExcelWriter(str(OUTPUT_PATH), engine="openpyxl") as writer:
    deduped.to_excel(writer, sheet_name="Master_Song_List", index=False)
    tags_lookup.to_excel(writer, sheet_name="Tags_Lookup", index=False)
    age_ranges.to_excel(writer, sheet_name="Age_Ranges", index=False)
    domains.to_excel(writer, sheet_name="Educational_Domains", index=False)

    for sn in writer.sheets:
        ws = writer.sheets[sn]
        ws.freeze_panes = "A2"
        ws.auto_filter.ref = ws.dimensions

# ═══════════════════════════════════════════════════════════════════════════════
# STATS
# ═══════════════════════════════════════════════════════════════════════════════
print(f"\n{'='*60}")
print(f"MASTER SHEET CREATED: {OUTPUT_PATH}")
print(f"{'='*60}")
print(f"Total unique songs: {len(deduped)}")
print(f"Sources: {deduped['source'].value_counts().to_dict()}")
has_lyrics = (deduped["lyrics"] != "").sum()
has_actions = (deduped["actions"] != "").sum()
has_tags = (deduped["tags"] != "").sum()
has_cur = (deduped["curriculum_links"] != "").sum()
has_ey = (deduped["early_years_links"] != "").sum()
print(f"With lyrics: {has_lyrics}")
print(f"With actions: {has_actions}")
print(f"With tags: {has_tags}")
print(f"With curriculum links: {has_cur}")
print(f"With early_years links: {has_ey}")
print(f"Age range distribution:")
for ar in deduped["age_range"].value_counts().head(8).items():
    print(f"  {ar[0]}: {ar[1]}")
print(f"Type distribution:")
for t in deduped["type"].value_counts().items():
    print(f"  {t[0]}: {t[1]}")
print(f"Lookup sheets: Tags_Lookup ({len(tags_lookup)} tags), Age_Ranges ({len(age_ranges)} entries), Educational_Domains ({len(domains)} entries)")
