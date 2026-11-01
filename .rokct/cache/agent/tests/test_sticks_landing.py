# Copyright (c) 2026 ROKCT INTELLIGENCE (PTY) LTD
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, version 3.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.

"""agent_sdk 1.24.0: the Sticks website's block (app_type sticks).

What the block is made of and the rules it keeps: only its own files
compose there ("common": false), it owns the root page, it registers the
site metadata and the Back to top style in base's one-line contract, every
file it names exists, its colours are black and white, its icons are
Remixicon, the footer is base's SiteCredit with no wordmark, the header logo
links to "/", reduced motion is honoured, no phone screen is a picture
committed here, and the pure modules behave under node
(tests/sticks-landing.test.mts).

Stdlib only. Run: python3 agent/nextjs/tests/test_sticks_landing.py
"""

import json
import os
import re
import shutil
import subprocess
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SDK_ROOT = os.path.abspath(os.path.join(HERE, os.pardir))
STICKS = os.path.join(SDK_ROOT, "templates", "sticks")
LANDING = os.path.join(STICKS, "components", "custom", "landing")
IMPORT_RE = re.compile(r'(from\s+|import\()\s*"([^"]+)"')
HEX = re.compile(r"#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b")


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def block():
    with open(os.path.join(SDK_ROOT, "manifest.json"), encoding="utf-8") as f:
        return json.load(f)["app_type"]["sticks"]


def landing(name):
    return read(os.path.join(LANDING, name))


class TestSticksBlock(unittest.TestCase):
    def test_the_block_opts_out_of_the_top_level(self):
        self.assertIs(block()["common"], False)

    def test_every_install_source_exists_and_lives_in_the_persona_folder(self):
        targets = []
        for entry in block()["installs"]:
            self.assertTrue(entry["from"].startswith("templates/sticks/"), entry["from"])
            self.assertTrue(os.path.exists(os.path.join(SDK_ROOT, entry["from"])), entry["from"])
            targets.append(entry["to"])
        self.assertEqual(len(targets), len(set(targets)))
        self.assertIn("app/page.tsx", targets)
        installed = {os.path.relpath(os.path.join(r, f), STICKS) for r, _, fs in os.walk(STICKS) for f in fs}
        sources = {e["from"][len("templates/sticks/"):] for e in block()["installs"]}
        self.assertEqual(installed, sources, "every file under templates/sticks is installed")

    def test_registry_lines_are_base_one_line_contract(self):
        lines = {i["placeholder"]: i["replacement"] for i in block()["integrations"]}
        self.assertEqual(set(lines), {"// @rokct-sdk-site-metadata-start", "// @rokct-sdk-back-to-top-style-start"})
        for replacement in lines.values():
            self.assertRegex(
                replacement,
                r'^  \{ id: "sticks-[a-z-]+", load: \(\) => import\("@/components/custom/landing/sticks-[a-z-]+"\) \},$',
            )
        targets = {e["to"] for e in block()["installs"]}
        for replacement in lines.values():
            module = re.search(r'import\("@/([^"]+)"\)', replacement).group(1)
            self.assertIn(module + ".ts", targets)

    def test_requires_are_not_installed_and_no_auth(self):
        targets = {e["to"] for e in block()["installs"]}
        for req in block()["requires"]:
            self.assertNotIn(req, targets)
        everything = "".join(read(os.path.join(r, f)) for r, _, fs in os.walk(STICKS) for f in fs)
        for word in ("header-auth", "/login", "/register", "auth_sdk/"):
            self.assertNotIn(word, everything.replace("composes no auth_sdk", ""))

    def test_imports_resolve_to_installs_requires_or_packages(self):
        targets = {e["to"] for e in block()["installs"]}
        allowed = set(block()["requires"])
        packages = set(block()["dependencies"]) | {"react", "next", "next/font/google"}
        for name in os.listdir(LANDING):
            for _, spec in IMPORT_RE.findall(landing(name)):
                if spec.startswith("./"):
                    self.assertTrue(
                        any(t.startswith("components/custom/landing/" + spec[2:] + ".") for t in targets),
                        f"{name}: {spec}",
                    )
                elif spec.startswith("@/"):
                    rel = spec[2:]
                    hits = [t for t in targets | allowed if os.path.splitext(t)[0] == rel]
                    self.assertTrue(hits, f"{name}: {spec}")
                else:
                    self.assertIn(spec, packages, f"{name}: {spec}")


class TestSticksDesignRules(unittest.TestCase):
    def test_colours_are_black_white_and_greys(self):
        for name in ("sticks-landing.css",):
            for value in HEX.findall(landing(name)):
                v = value[1:]
                if len(v) == 3:
                    v = "".join(c * 2 for c in v)
                r, g, b = (int(v[i:i + 2], 16) for i in (0, 2, 4))
                self.assertLessEqual(max(r, g, b) - min(r, g, b), 8, f"{value} is not a neutral")
        icon = read(os.path.join(STICKS, "app", "icon.svg"))
        self.assertEqual(set(HEX.findall(icon)), {"#0A0A0A", "#FFFFFF"})

    def test_scrollbar_is_ink_on_paper_in_both_themes(self):
        css = landing("sticks-landing.css")
        self.assertIn("scrollbar-color:var(--stx-ink) var(--stx-paper)", css)
        self.assertIn("html.dark:has(.stx){ --stx-paper:#0A0A0A; --stx-ink:#FAFAFA }", css)

    def test_reduced_motion_is_honoured(self):
        self.assertIn("@media (prefers-reduced-motion:reduce)", landing("sticks-landing.css"))
        self.assertIn('matchMedia("(prefers-reduced-motion: reduce)")', landing("sticks-landing.client.tsx"))

    def test_icons_are_remixicon_only(self):
        for name in os.listdir(LANDING):
            for _, spec in IMPORT_RE.findall(landing(name)):
                self.assertNotIn("lucide", spec)
                self.assertNotIn("heroicons", spec)
                self.assertNotIn("fontawesome", spec)

    def test_footer_is_the_site_credit_and_no_wordmark(self):
        page = landing("sticks-landing.tsx")
        self.assertIn('<SiteCredit as="span" siteName={STICKS_SITE_NAME} year={2026}', page)
        footer = page[page.index('<footer className="foot">'):]
        self.assertNotIn("SticksMark", footer)
        self.assertNotIn("<h", footer)
        self.assertIn('STICKS_SITE_NAME = "Sticks"', landing("sticks-landing-config.ts"))

    def test_header_logo_links_home(self):
        self.assertRegex(landing("sticks-landing.client.tsx"), r'<a className="brand" href="/"')

    def test_screens_come_from_the_tour_not_from_here(self):
        for root, _, files in os.walk(STICKS):
            for f in files:
                self.assertFalse(f.endswith((".png", ".webp", ".jpg", ".jpeg")), f)
        self.assertIn("raw.githubusercontent.com/${STICKS_APP_REPO}/main/${STICKS_TOUR_DIR}", landing("sticks-sources.ts"))

    def test_crowd_is_top_down_and_backgrounds_fade(self):
        art = landing("sticks-art.tsx")
        self.assertIn("buildCrowd()", art)
        self.assertEqual(art.count('className="cr-face"'), 1, "one face in the crowd, the one who looks up")
        self.assertIn("mask-image:radial-gradient", landing("sticks-landing.css"))


class TestSticksUnderNode(unittest.TestCase):
    STAGED = ("sticks-sources.ts", "sticks-crowd.ts", "sticks-landing-config.ts")

    def test_behaviour_under_node(self):
        node = shutil.which("node")
        self.assertIsNotNone(node, "node (22.6+) runs the Sticks suite")
        with tempfile.TemporaryDirectory() as tmp:
            for name in self.STAGED:
                src = landing(name)
                src = re.sub(r'from "\./([a-z-]+)"', r'from "./\1.ts"', src)
                with open(os.path.join(tmp, name), "w", encoding="utf-8") as f:
                    f.write(src)
            shutil.copy(os.path.join(HERE, "sticks-landing.test.mts"), tmp)
            run = subprocess.run(
                [node, "--experimental-strip-types", "--no-warnings", "--test", os.path.join(tmp, "sticks-landing.test.mts")],
                capture_output=True, text=True, timeout=120, cwd=tmp,
            )
        self.assertEqual(run.returncode, 0, run.stdout + run.stderr)
        self.assertRegex(run.stdout, re.compile(r"^# fail 0$", re.M))
        self.assertGreaterEqual(int(re.search(r"^# pass (\d+)$", run.stdout, re.M).group(1)), 12)


if __name__ == "__main__":
    unittest.main()
