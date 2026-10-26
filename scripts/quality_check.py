#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "index.html"
CSS_FILES = [ROOT / "styles.css", ROOT / "v4-1.css"]


class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.assets = []
        self.ids = []
        self.errors = []
        self.has_lang = False
        self.has_viewport = False
        self.has_title = False
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.has_lang = bool((a.get("lang") or "").strip())
        if tag == "meta" and a.get("name", "").lower() == "viewport":
            self.has_viewport = True
        if tag == "title":
            self._in_title = True
        if tag == "img" and "alt" not in a:
            self.errors.append("Every img needs alt text")
        if tag == "button" and not a.get("type"):
            self.errors.append("Every button needs an explicit type")
        if a.get("id"):
            self.ids.append(a["id"])
        for key in ("src", "href"):
            value = a.get(key)
            if not value or value.startswith(("#", "data:", "mailto:", "tel:")):
                continue
            parsed = urlparse(value)
            if not parsed.scheme and not parsed.netloc:
                self.assets.append(value.split("?", 1)[0].split("#", 1)[0])

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title and data.strip():
            self.has_title = True


def main():
    errors = []
    html_text = HTML.read_text(encoding="utf-8")
    p = Parser()
    p.feed(html_text)
    p.close()

    if not p.has_lang:
        errors.append("html lang is missing")
    if not p.has_viewport:
        errors.append("viewport meta is missing")
    if not p.has_title:
        errors.append("title is empty")

    duplicates = sorted({x for x in p.ids if p.ids.count(x) > 1})
    if duplicates:
        errors.append("duplicate ids: " + ", ".join(duplicates))

    for rel in p.assets:
        path = (ROOT / rel).resolve()
        try:
            path.relative_to(ROOT.resolve())
        except ValueError:
            errors.append(f"local asset escapes repository: {rel}")
            continue
        if not path.exists():
            errors.append(f"missing local asset: {rel}")

    errors.extend(p.errors)

    if "↗" in html_text:
        errors.append("Use the geometric external-link icon instead of the emoji-like ↗ glyph")

    for css_path in CSS_FILES:
        if not css_path.exists():
            errors.append(f"missing stylesheet: {css_path.name}")
            continue
        css_text = css_path.read_text(encoding="utf-8")
        if css_text.count("{") != css_text.count("}"):
            errors.append(f"{css_path.name} has unbalanced braces")

    if errors:
        print("Quality check failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print("Site quality checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
