import os

backend_dir = "C:/Users/Subhadip/Downloads/Agrisathi-V3-main/Agrisathi-V3-main/backend"

for root, dirs, files in os.walk(backend_dir):
    for f in files:
        if f.endswith('.js') or f.endswith('.py'):
            fpath = os.path.join(root, f)
            try:
                with open(fpath, 'r', encoding='utf-8') as fp:
                    content = fp.read()
                    if 'is_crop_mismatch' in content or 'is_mismatch' in content:
                        print(f"Match in: {fpath}")
                        for idx, line in enumerate(content.splitlines()):
                            if 'is_crop_mismatch' in line or 'is_mismatch' in line:
                                print(f"  L{idx+1}: {line}")
            except Exception as e:
                pass
