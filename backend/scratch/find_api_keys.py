import os

root_dir = "C:/Users/Subhadip/Downloads/Agrisathi-V3-main/Agrisathi-V3-main"
target = "AQ.Ab8"

print(f"Scanning {root_dir} for secret pattern '{target}'...")

found = []
for root, dirs, files in os.walk(root_dir):
    if '.git' in root or 'node_modules' in root:
        continue
    for f in files:
        filePath = os.path.join(root, f)
        try:
            with open(filePath, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
                if target in content and not f.endswith('.env'):
                    found.append((filePath, content.count(target)))
        except Exception:
            pass

print(f"Total secret occurrences found in non-.env files: {len(found)}")
for path, count in found:
    print(f"  {path} ({count} times)")
