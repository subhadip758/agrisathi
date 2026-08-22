import os
import json
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
ML_DIR = os.path.join(BASE_DIR, 'ml_service')
MODELS_DIR = os.path.join(ML_DIR, 'models')
REPORTS_DIR = os.path.join(ML_DIR, 'reports')

class TestPlantDiseaseMLPipeline(unittest.TestCase):

    def test_audit_report_exists(self):
        report_path = os.path.join(ML_DIR, 'dataset_audit_report.json')
        self.assertTrue(os.path.exists(report_path), "Dataset audit report JSON should exist.")
        with open(report_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        self.assertIn('rice', data)
        self.assertIn('wheat', data)
        self.assertIn('tomato', data)

    def test_model_manifests_exist(self):
        for crop in ['rice', 'wheat', 'tomato', 'other']:
            manifest_path = os.path.join(MODELS_DIR, crop, 'model_manifest.json')
            self.assertTrue(os.path.exists(manifest_path), f"Manifest should exist for {crop}")
            with open(manifest_path, 'r', encoding='utf-8') as f:
                meta = json.load(f)
            self.assertEqual(meta['crop'], crop)
            self.assertIn('confidence_threshold', meta)

    def test_tflite_models_exist(self):
        for crop in ['rice', 'wheat', 'tomato', 'other']:
            tflite_path = os.path.join(MODELS_DIR, crop, f"{crop}_model.tflite")
            self.assertTrue(os.path.exists(tflite_path), f"TFLite model should exist for {crop}")
            self.assertGreaterThan(os.path.getsize(tflite_path), 1000, "TFLite file should be non-empty")

    def assertGreaterThan(self, val1, val2, msg=None):
        self.assertTrue(val1 > val2, msg or f"{val1} is not greater than {val2}")

    def test_benchmark_reports_exist(self):
        md_report = os.path.join(REPORTS_DIR, 'disease_model_benchmark_report.md')
        json_report = os.path.join(REPORTS_DIR, 'disease_model_benchmark_report.json')
        self.assertTrue(os.path.exists(md_report), "Markdown benchmark report should exist.")
        self.assertTrue(os.path.exists(json_report), "JSON benchmark report should exist.")

if __name__ == '__main__':
    unittest.main()
