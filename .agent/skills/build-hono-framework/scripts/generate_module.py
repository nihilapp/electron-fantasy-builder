import argparse
import re
from pathlib import Path

# Configuration
PROJECT_ROOT = (
    Path(__file__).resolve().parents[4]
)  # .agent/skills/build-hono-framework/scripts -> project_root
TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"


def to_camel_case(s: str) -> str:
    return s[0].lower() + s[1:]


def to_pascal_case(s: str) -> str:
    return s[0].upper() + s[1:]


def extract_typescript_code(markdown_content: str) -> str:
    """Extracts code from ```typescript ... ``` blocks."""
    pattern = r"```typescript\s+(.*?)\s+```"
    match = re.search(pattern, markdown_content, re.DOTALL)
    if match:
        return match.group(1)
    return ""


def main():
    parser = argparse.ArgumentParser(description="Generate Hono Framework Module")
    parser.add_argument(
        "entity", help="Entity Name (PascalCase), e.g. 'Project' or 'Auth'"
    )
    parser.add_argument(
        "--base-dir",
        default="src",
        help="Base directory for Hono modules (default: 'src')",
    )
    args = parser.parse_args()

    entity_pascal = to_pascal_case(args.entity)
    entity_camel = to_camel_case(args.entity)

    # Base Path
    base_path = PROJECT_ROOT / args.base_dir

    # Paths
    # 1. Domain Directory: {base_dir}/{entity}/
    domain_dir = base_path / entity_camel

    # 2. Schema Directories: {base_dir}/common/db/schema/{local,remote}/
    schema_local_dir = base_path / "common/db/schema/local"
    schema_remote_dir = base_path / "common/db/schema/remote"

    # 3. VO Directory: src/zod-schema/ (Fixed project convention)
    vo_dir = PROJECT_ROOT / "src/zod-schema"

    print(f"🚀 Generating module for entity: {entity_pascal}...")

    # Create Directories
    for d in [domain_dir, schema_local_dir, schema_remote_dir, vo_dir]:
        d.mkdir(parents=True, exist_ok=True)
        print(f"📁 Verified directory: {d}")

    # Files to Generate
    # (Template Name, Target Path, Target Filename)
    files_map = [
        ("controller.template.md", domain_dir, f"{entity_pascal}Controller.ts"),
        ("service.template.md", domain_dir, f"{entity_pascal}Service.ts"),
        ("mapper.template.md", domain_dir, f"{entity_pascal}Mapper.ts"),
        ("table.local.template.md", schema_local_dir, f"{entity_camel}s.table.ts"),
        ("table.remote.template.md", schema_remote_dir, f"{entity_camel}s.table.ts"),
        ("vo.schema.template.md", vo_dir, f"{entity_camel}.schema.ts"),
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

        # Replace Variables
        # __Entity__ -> Project
        # __entity__ -> project
        content = code_content.replace("__Entity__", entity_pascal)
        content = content.replace("__entity__", entity_camel)

        dest_path.write_text(content, encoding="utf-8")
        print(f"✅ Created: {dest_path.relative_to(PROJECT_ROOT)}")

    # 4. Update src/types/vo.types.ts
    update_vo_types(PROJECT_ROOT, entity_camel, entity_pascal)

    print("\n🎉 Module generation complete!")
    print("Don't forget to:")
    print(
        f"1. Add '{entity_camel}s.table.ts' to '{args.base_dir}/common/db/schema/local/index.ts' (if exists)"
    )
    print(f"2. Add controller to '{args.base_dir}/index.ts' or 'honoApp.ts'")


def update_vo_types(project_root: Path, entity_camel: str, entity_pascal: str):
    """
    Updates src/types/vo.types.ts to include the new VO type.
    """
    vo_types_path = project_root / "src/types/vo.types.ts"

    if not vo_types_path.exists():
        print(f"⚠️  {vo_types_path} not found. Skipping VO type update.")
        return

    content = vo_types_path.read_text(encoding="utf-8")

    # 1. Add Import
    # pattern: import type { ... } from '@zod-schema/...';
    # Add new import after the last @zod-schema import
    import_statement = f"import type {{ {entity_camel}Schema }} from '@zod-schema/{entity_camel}.schema';"

    if import_statement in content:
        print("⚠️  VO import already exists in vo.types.ts")
    else:
        # Find the last @zod-schema import
        import_matches = list(
            re.finditer(r"import type .*? from '@zod-schema/.*?';", content)
        )
        if import_matches:
            last_import = import_matches[-1]
            insert_pos = last_import.end()
            content = (
                content[:insert_pos] + "\n" + import_statement + content[insert_pos:]
            )
        else:
            # Fallback: Add after imports
            content = import_statement + "\n" + content

    # 2. Add Type Definition
    # pattern: export type ... = z.infer<...>;
    type_def = f"/** {entity_pascal} VO. {entity_camel}Schema와 동일. */\nexport type {entity_pascal}Vo = z.infer<typeof {entity_camel}Schema>;"

    if f"export type {entity_pascal}Vo" in content:
        print("⚠️  VO type definition already exists in vo.types.ts")
    else:
        # Check if file ends with newline
        if not content.endswith("\n"):
            content += "\n"
        content += "\n" + type_def + "\n"

    vo_types_path.write_text(content, encoding="utf-8")
    print("✅ Updated: src/types/vo.types.ts")


if __name__ == "__main__":
    main()
