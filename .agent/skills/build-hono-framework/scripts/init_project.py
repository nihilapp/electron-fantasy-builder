import argparse
import re
from pathlib import Path

# Configuration
PROJECT_ROOT = (
    Path(__file__).resolve().parents[4]
)  # .agent/skills/build-hono-framework/scripts -> project_root
TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"


def extract_typescript_code(markdown_content: str) -> str:
    """Extracts code from ```typescript ... ``` blocks."""
    pattern = r"```typescript\s+(.*?)\s+```"
    match = re.search(pattern, markdown_content, re.DOTALL)
    if match:
        return match.group(1)
    return ""


def main():
    parser = argparse.ArgumentParser(description="Initialize Hono Project")
    parser.add_argument(
        "--base-dir",
        default="src",
        help="Base directory for Hono project (default: 'src')",
    )
    args = parser.parse_args()

    print(f"🚀 Initializing Hono Project Structure in '{args.base_dir}'...")

    # Paths
    src_dir = PROJECT_ROOT / args.base_dir

    # Create Directories
    for d in [src_dir]:
        d.mkdir(parents=True, exist_ok=True)
        print(f"📁 Verified directory: {d}")

    # Files to Generate
    # (Template Name, Target Path, Target Filename)
    files_map = [
        ("main.template.md", src_dir, "main.ts"),
        ("app.template.md", src_dir, "app.ts"),
    ]

    for tpl_name, target_dir, target_file in files_map:
        tpl_path = TEMPLATES_DIR / tpl_name
        dest_path = target_dir / target_file

        if not tpl_path.exists():
            print(f"❌ Template not found: {tpl_path}")
            continue

        if dest_path.exists():
            print(f"⚠️  File already exists, skipping: {dest_path}")
            continue

        markdown_content = tpl_path.read_text(encoding="utf-8")
        code_content = extract_typescript_code(markdown_content)

        if not code_content:
            print(f"⚠️  No TypeScript code block found in: {tpl_name}")
            continue

        dest_path.write_text(code_content, encoding="utf-8")
        print(f"✅ Created: {dest_path.relative_to(PROJECT_ROOT)}")

    print("\n🎉 Project initialization complete!")
    print("Next steps:")
    print("1. Install dependencies: `npm install hono @hono/node-server`")
    print(f"2. Run server: `npx tsx {args.base_dir}/main.ts`")


if __name__ == "__main__":
    main()
