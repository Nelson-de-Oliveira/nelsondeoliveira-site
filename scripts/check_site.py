#!/usr/bin/env python3
from pathlib import Path
from urllib.parse import urlparse, unquote
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
IGNORE_SCHEMES = {"http", "https", "mailto", "tel", "javascript", "data"}

def local_target(value: str):
    value = value.strip()
    if not value or value.startswith("#"):
        return None
    p = urlparse(value)
    if p.scheme.lower() in IGNORE_SCHEMES or p.netloc:
        return None
    path = unquote(p.path)
    if not path:
        return None
    if path.startswith("/"):
        target = ROOT / path.lstrip("/")
    else:
        # Caller resolves relative links against the current file.
        return path
    return target

files = [p for p in ROOT.rglob("*") if p.is_file() and ".git" not in p.parts and not any(x in p.parts for x in ("__pycache__",))]
html_files = [p for p in files if p.suffix.lower() in {".html", ".xml"}]
missing = []

for source in html_files:
    text = source.read_text(encoding="utf-8", errors="replace")
    for attr in ("href", "src"):
        for raw in re.findall(rf'{attr}\s*=\s*["\']([^"\']+)["\']', text, flags=re.I):
            parsed = local_target(raw)
            if parsed is None:
                continue
            target = parsed if isinstance(parsed, Path) else (source.parent / parsed)
            target = target.resolve()
            if not str(target).startswith(str(ROOT.resolve())):
                continue
            # Directory links are valid if an index exists.
            if target.is_dir():
                target = target / "index.html"
            if not target.exists():
                missing.append(f"{source.relative_to(ROOT)} -> {raw}")

# Article count is intentionally not fixed: it must grow/shrink with future edits.
post_count = len(list((ROOT / "posts").glob("*.html")))
if post_count == 0:
    missing.append("posts/ is empty")

if missing:
    print("BROKEN LINKS / SITE ERRORS")
    for item in missing:
        print(" -", item)
    print(f"\nArtigos detectados: {post_count}")
    sys.exit(1)

print(f"OK — {post_count} artigos; {len(html_files)} HTML/XML files checked; no broken local links found.")
