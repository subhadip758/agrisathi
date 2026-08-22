import os

backend_dir = "C:/Users/Subhadip/Downloads/Agrisathi-V3-main/Agrisathi-V3-main/backend"

for root, dirs, files in os.walk(backend_dir):
    for f in files:
        if 'community' in f.lower() or 'reaction' in f.lower() or 'store' in f.lower():
            print(f"Found store file: {os.path.join(root, f)}")
