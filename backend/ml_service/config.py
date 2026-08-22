# AgriSathi Plant Disease ML Configuration
DATASET_CONFIG = {
    'rice': {
        'name': 'AgriSathi Rice Leaf Disease Dataset',
        'classes': ['Bacterial Leaf Blight', 'Brown Spot', 'Rice Blast', 'Healthy Rice'],
        'confidence_threshold': 0.65
    },
    'wheat': {
        'name': 'AgriSathi Wheat Disease Dataset',
        'classes': ['Common Bunt', 'Loose Smut', 'Septoria Blight', 'Wheat Rust', 'Healthy Wheat'],
        'confidence_threshold': 0.65
    },
    'tomato': {
        'name': 'AgriSathi Tomato Leaf Disease Dataset',
        'classes': ['Early Blight', 'Late Blight', 'Septoria Spot', 'Yellow Leaf Curl', 'Healthy Tomato'],
        'confidence_threshold': 0.65
    },
    'other': {
        'name': 'AgriSathi General Crop Disease Dataset',
        'classes': ['Powdery Mildew', 'Leaf Rust', 'Foliar Spot', 'Healthy Plant'],
        'confidence_threshold': 0.60
    }
}
