import os
import glob
import hashlib
import json
import numpy as np
from PIL import Image

def get_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def evaluate_physical_images():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    datasets_dir = os.path.join(base_dir, 'datasets')
    
    print("================================================================")
    print("AGRISATHI PHYSICAL IMAGE DISK AUDIT & MANIFEST GENERATION")
    print("================================================ process\n")
    
    image_files = []
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
        image_files.extend(glob.glob(os.path.join(datasets_dir, '**', ext), recursive=True))
        
    print(f"Total Physical Image Files Found on Disk: {len(image_files)}")
    
    manifest = []
    class_counts = {}
    
    for idx, filepath in enumerate(image_files[:100]): # Audit up to 100 physical images
        rel_path = os.path.relpath(filepath, base_dir)
        filename = os.path.basename(filepath)
        size_bytes = os.path.getsize(filepath)
        sha256 = get_sha256(filepath)
        
        parts = rel_path.split(os.sep)
        crop_folder = parts[1] if len(parts) > 1 else 'unknown'
        
        parent_dir = os.path.basename(os.path.dirname(filepath))
        label = parent_dir if parent_dir != crop_folder else filename.split('.')[0]
        
        class_counts[label] = class_counts.get(label, 0) + 1
        
        try:
            with Image.open(filepath) as img:
                w, h = img.size
                format_type = img.format
                img_rgb = img.convert('RGB')
                arr = np.array(img_rgb)
                
                r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
                green_mask = (g > r) & (g > b) & (g > 40)
                green_ratio = float(np.sum(green_mask) / arr[:,:,0].size)
        except Exception as e:
            w, h, format_type, green_ratio = 0, 0, 'UNKNOWN', 0.0
            
        record = {
            'index': idx + 1,
            'filename': filename,
            'relative_path': rel_path.replace('\\', '/'),
            'size_bytes': size_bytes,
            'sha256': sha256,
            'crop_folder': crop_folder,
            'ground_truth_label': label,
            'dimensions': f"{w}x{h}",
            'format': format_type,
            'real_green_pixel_ratio': round(green_ratio, 4)
        }
        manifest.append(record)
        
    print("\n--- SAMPLE PHYSICAL IMAGE RECORDS FROM DISK ---")
    for r in manifest[:10]:
        print(f"[{r['index']}] {r['filename']} ({r['dimensions']}) | SHA256: {r['sha256'][:16]}... | Crop: {r['crop_folder']} | Label: {r['ground_truth_label']} | Green Ratio: {r['real_green_pixel_ratio']}")
        
    manifest_path = os.path.join(base_dir, 'reports', 'physical_image_manifest.json')
    os.makedirs(os.path.dirname(manifest_path), exist_ok=True)
    with open(manifest_path, 'w') as f:
        json.dump({'total_physical_images': len(image_files), 'sample_manifest': manifest}, f, indent=2)
        
    print(f"\nPhysical image manifest saved to: {manifest_path}")
    print("================================================================")

if __name__ == '__main__':
    evaluate_physical_images()
