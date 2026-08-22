import os
import numpy as np
from PIL import Image
import cv2
from datetime import datetime, timedelta

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(filepath, target_size=(224, 224)):
    """
    Preprocess image for model prediction
    
    Args:
        filepath: Path to the image file
        target_size: Target size for resizing (width, height)
    
    Returns:
        Preprocessed image array
    """
    try:
        # Read image
        img = Image.open(filepath)
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize
        img = img.resize(target_size)
        
        # Convert to array
        img_array = np.array(img)
        
        # Normalize pixel values to [0, 1]
        img_array = img_array.astype('float32') / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    except Exception as e:
        raise Exception(f"Error preprocessing image: {str(e)}")

def preprocess_image_opencv(filepath, target_size=(224, 224)):
    """
    Preprocess image using OpenCV
    
    Args:
        filepath: Path to the image file
        target_size: Target size for resizing (width, height)
    
    Returns:
        Preprocessed image array
    """
    try:
        # Read image
        img = cv2.imread(filepath)
        
        # Convert BGR to RGB
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Resize
        img = cv2.resize(img, target_size)
        
        # Normalize
        img = img.astype('float32') / 255.0
        
        # Add batch dimension
        img = np.expand_dims(img, axis=0)
        
        return img
    
    except Exception as e:
        raise Exception(f"Error preprocessing image with OpenCV: {str(e)}")

def normalize_features(features, feature_ranges=None):
    """
    Normalize feature values to [0, 1] range
    
    Args:
        features: Array of feature values
        feature_ranges: Dictionary of min/max values for each feature
    
    Returns:
        Normalized features
    """
    if feature_ranges is None:
        # Default ranges for common agricultural features
        feature_ranges = {
            'nitrogen': (0, 200),
            'phosphorus': (0, 200),
            'potassium': (0, 200),
            'temperature': (0, 50),
            'humidity': (0, 100),
            'ph': (0, 14),
            'rainfall': (0, 500)
        }
    
    normalized = []
    for i, (min_val, max_val) in enumerate(feature_ranges.values()):
        if max_val > min_val:
            norm_val = (features[i] - min_val) / (max_val - min_val)
            normalized.append(np.clip(norm_val, 0, 1))
        else:
            normalized.append(0)
    
    return np.array(normalized)

def load_model_safe(model_path):
    """
    Safely load a model with error handling
    
    Args:
        model_path: Path to the model file
    
    Returns:
        Loaded model or None
    """
    try:
        if not os.path.exists(model_path):
            print(f"Model not found at {model_path}")
            return None
        
        # Try loading with different methods based on file extension
        if model_path.endswith('.h5'):
            from tensorflow import keras
            model = keras.models.load_model(model_path)
        elif model_path.endswith('.pkl'):
            import joblib
            model = joblib.load(model_path)
        else:
            print(f"Unsupported model format: {model_path}")
            return None
        
        return model
    
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return None

def calculate_confidence(prediction_array):
    """
    Calculate confidence score from prediction array
    
    Args:
        prediction_array: Array of prediction probabilities
    
    Returns:
        Confidence score as percentage
    """
    max_prob = np.max(prediction_array)
    confidence = round(max_prob * 100, 2)
    return confidence

def get_top_predictions(predictions, labels, top_k=5):
    """
    Get top K predictions with labels
    
    Args:
        predictions: Array of prediction probabilities
        labels: List of class labels
        top_k: Number of top predictions to return
    
    Returns:
        List of tuples (label, confidence)
    """
    # Get indices of top predictions
    top_indices = np.argsort(predictions[0])[-top_k:][::-1]
    
    # Create list of predictions
    top_preds = []
    for idx in top_indices:
        label = labels[idx] if idx < len(labels) else f"Class_{idx}"
        confidence = round(predictions[0][idx] * 100, 2)
        top_preds.append((label, confidence))
    
    return top_preds

def validate_input_ranges(data, feature_ranges):
    """
    Validate that input values are within acceptable ranges
    
    Args:
        data: Dictionary of input features
        feature_ranges: Dictionary of acceptable ranges
    
    Returns:
        Tuple (is_valid, error_messages)
    """
    errors = []
    
    for feature, (min_val, max_val) in feature_ranges.items():
        if feature in data:
            value = data[feature]
            if value < min_val or value > max_val:
                errors.append(
                    f"{feature} value {value} is out of range [{min_val}, {max_val}]"
                )
    
    is_valid = len(errors) == 0
    return is_valid, errors

def format_response(status, data=None, message=None, error=None):
    """
    Format API response
    
    Args:
        status: Response status ('success' or 'error')
        data: Response data
        message: Success message
        error: Error message
    
    Returns:
        Formatted response dictionary
    """
    response = {'status': status}
    
    if data:
        response['data'] = data
    
    if message:
        response['message'] = message
    
    if error:
        response['error'] = error
    
    return response

def clean_temp_file(filepath):
    """
    Clean up temporary file
    
    Args:
        filepath: Path to the file to delete
    """
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
    except Exception as e:
        print(f"Error cleaning temp file: {str(e)}")

# Feature importance weights (for interpretability)
FEATURE_WEIGHTS = {
    'crop_recommendation': {
        'nitrogen': 0.20,
        'phosphorus': 0.18,
        'potassium': 0.18,
        'temperature': 0.15,
        'humidity': 0.12,
        'ph': 0.10,
        'rainfall': 0.07
    },
    'yield_prediction': {
        'area': 0.25,
        'temperature': 0.20,
        'rainfall': 0.20,
        'fertilizer': 0.15,
        'season': 0.10,
        'soil_type': 0.10
    }
}

def validate_historical_data(data):
    """Validate historical price data"""
    if not isinstance(data, list):
        raise ValueError("Historical data must be a list")
    
    if len(data) < 60:
        raise ValueError("Need at least 60 days of historical data")
    
    for item in data:
        if 'date' not in item or 'price' not in item:
            raise ValueError("Each data point must have 'date' and 'price' fields")
        
        try:
            datetime.fromisoformat(item['date'].replace('Z', '+00:00'))
        except:
            raise ValueError(f"Invalid date format: {item['date']}")
        
        if not isinstance(item['price'], (int, float)) or item['price'] <= 0:
            raise ValueError(f"Invalid price value: {item['price']}")
    
    return True

def prepare_dataframe(historical_data):
    """Convert historical data to pandas DataFrame"""
    df = pd.DataFrame(historical_data)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')
    df = df.reset_index(drop=True)
    return df

def calculate_metrics(predictions, historical_data):
    """Calculate prediction metrics"""
    prices = [d['price'] for d in historical_data[-30:]]
    avg_price = np.mean(prices)
    std_price = np.std(prices)
    
    return {
        'avgHistoricalPrice': float(avg_price),
        'stdDeviation': float(std_price),
        'dataQuality': 'good' if len(historical_data) >= 90 else 'moderate'
    }

def format_response(predictions, trend, volatility, recommendations, model_metrics):
    """Format API response"""
    return {
        'predictions': predictions,
        'trend': trend,
        'volatility': volatility,
        'recommendations': recommendations,
        'modelMetrics': model_metrics,
        'generatedAt': datetime.now().isoformat()
    }