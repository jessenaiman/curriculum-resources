"""T1: Jev access wiring + $0 smoke test.

Proves the Jev (System One) connection end-to-end at zero cost:
POSTs to the OpenCode Console zen/v1/systemone endpoint with model
jev-1.13-free, using a real Kathy Reid-Naiman song as `state`, and asks
one Choice (art style), one Score (sing-along fit), and one Noul
(loop-friendliness). Prints the typed answers and the token `usage`.

Requires OPENCODE_API_KEY in the environment (get it from
https://opencode.ai/console). Do not paste the key into chat or the repo.
"""

import json
import os
import sys
import urllib.request
import urllib.error

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # no .env loader: rely on real environment variables

ENDPOINT = "https://opencode.ai/zen/v1/systemone"
MODEL = "jev-1.13-free"
TRACK_FILE = "resources/track_data.json"
SONG_TITLE = "See the Sleeping Bunnies"


def load_song(track_file: str, title: str) -> dict:
    """Return {title, album, lyrics, actions} for the named song."""
    with open(track_file, encoding="utf-8") as f:
        albums = json.load(f)
    for album, tracks in albums.items():
        for track in tracks:
            if track["title"].lower() == title.lower():
                return {
                    "title": track["title"],
                    "album": album,
                    "lyrics": track["lyrics"].strip(),
                    "actions": track["actions"],
                }
    raise KeyError(f"song {title!r} not found in {track_file}")


def main() -> int:
    api_key = os.environ.get("OPENCODE_API_KEY")
    if not api_key:
        print(
            "OPENCODE_API_KEY is not set. Get a key from https://opencode.ai/console "
            "and set it as an environment variable (do not paste it into chat).",
            file=sys.stderr,
        )
        return 1

    song = load_song(TRACK_FILE, SONG_TITLE)

    payload = {
        "model": MODEL,
        "state": {
            "song": song,
            "canvas": {
                "duration_seconds": 8,
                "format": "Spotify Canvas",
                "loop": True,
                "audience": "young children",
            },
        },
        "questions": {
            "art_style": {
                "type": "choice",
                "instructions": (
                    "Which visual art style best suits this song as an 8-second "
                    "looping Spotify Canvas video for young children?"
                ),
                "criteria": {
                    "paper_cutout": (
                        "Flat paper-cutout shapes with gentle parallax layers"
                    ),
                    "watercolor_wash": (
                        "Soft painted watercolor backgrounds with simple "
                        "character silhouettes"
                    ),
                    "stop_motion_fabric": (
                        "Felt-and-fabric stop-motion look with visible texture"
                    ),
                    "flat_vector": (
                        "Clean, bright flat vector shapes with bold simplified "
                        "colors"
                    ),
                    "crayon_sketch": (
                        "Childlike crayon-and-pencil sketch with wobbly lines"
                    ),
                },
            },
            "sing_along_fit": {
                "type": "score",
                "instructions": (
                    "How well does this song suit a sing-along style Canvas video?"
                ),
                "criteria": [
                    "Instrumental mood music only - not sing-along material",
                    "Has a chorus or repeated line but little audience participation",
                    "Repeated phrases with clear call-and-repeat structure",
                    "Strong sing-along: repeated chorus, gestures, predictable structure",
                ],
            },
            "loop_clean": {
                "type": "noul",
                "instructions": (
                    "This song's actions and structure support a seamless 8-second "
                    "visual loop without a jarring cut."
                ),
            },
        },
    }

    request = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
            "Origin": "https://opencode.ai",
            "Referer": "https://opencode.ai/",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            body = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        print(
            f"HTTP {exc.code}: {exc.read().decode('utf-8', errors='replace')}",
            file=sys.stderr,
        )
        return 2
    except urllib.error.URLError as exc:
        print(f"Connection error: {exc.reason}", file=sys.stderr)
        return 2

    result = json.loads(body)
    print(json.dumps(result, indent=2))

    answers = result["answers"]
    usage = result["usage"]
    style = answers["art_style"]
    print("\n--- summary ---")
    print(f"art_style      : {style['choice']} (confidence {style['confidence']})")
    print(f"sing_along_fit : {answers['sing_along_fit']['score']}")
    print(f"loop_clean     : {answers['loop_clean']['noul']}")
    print(f"usage          : {usage['input_tokens']} in / {usage['output_tokens']} out")
    return 0


if __name__ == "__main__":
    sys.exit(main())