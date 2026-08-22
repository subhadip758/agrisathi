"""
Trains the disease detection model on images organized as:

    ml-services/datasets/disease_images/
        Tomato_Early_Blight/
            img1.jpg
            img2.jpg
            ...
        Tomato_Late_Blight/
            ...
        ...

Run from ml-services/ directory:
    python models/disease_detection/predict.py   (to test after training)
    python models/disease_detection/train.py
"""

import json
import os

import tensorflow as tf

from model import build_model, unfreeze_for_fine_tuning, IMG_SIZE

DATASET_DIR = os.path.join("datasets", "disease_images")
MODEL_OUT_PATH = os.path.join("models", "disease_detection", "disease_model.keras")
LABELS_OUT_PATH = os.path.join("models", "disease_detection", "class_labels.json")

BATCH_SIZE = 16          # small batch size suits a small dataset
VALIDATION_SPLIT = 0.2
INITIAL_EPOCHS = 15
FINE_TUNE_EPOCHS = 10
SEED = 123


def build_datasets():
    train_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_DIR,
        validation_split=VALIDATION_SPLIT,
        subset="training",
        seed=SEED,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_DIR,
        validation_split=VALIDATION_SPLIT,
        subset="validation",
        seed=SEED,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
    )

    class_names = train_ds.class_names
    return train_ds, val_ds, class_names


def build_augmentation():
    # Applied only to training data. Essential here — with ~100 images per
    # class this effectively multiplies the variety the model sees.
    return tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal"),
        tf.keras.layers.RandomRotation(0.15),
        tf.keras.layers.RandomZoom(0.15),
        tf.keras.layers.RandomContrast(0.15),
        tf.keras.layers.RandomBrightness(0.15),
    ])


def main():
    if not os.path.isdir(DATASET_DIR):
        raise FileNotFoundError(
            f"Expected dataset at '{DATASET_DIR}' with one subfolder per disease. "
            f"Add your image folders there before running this script."
        )

    train_ds, val_ds, class_names = build_datasets()
    num_classes = len(class_names)
    print(f"Found {num_classes} classes: {class_names}")

    augmentation = build_augmentation()
    train_ds = train_ds.map(lambda x, y: (augmentation(x, training=True), y))

    # Cache + prefetch for speed
    train_ds = train_ds.cache().prefetch(tf.data.AUTOTUNE)
    val_ds = val_ds.cache().prefetch(tf.data.AUTOTUNE)

    model = build_model(num_classes=num_classes)

    early_stop = tf.keras.callbacks.EarlyStopping(
        monitor="val_loss", patience=4, restore_best_weights=True
    )

    print("\n--- Phase 1: training classification head (base frozen) ---")
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=INITIAL_EPOCHS,
        callbacks=[early_stop],
    )

    print("\n--- Phase 2: fine-tuning top layers of base model ---")
    model = unfreeze_for_fine_tuning(model, fine_tune_last_n_layers=20)
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=FINE_TUNE_EPOCHS,
        callbacks=[early_stop],
    )

    os.makedirs(os.path.dirname(MODEL_OUT_PATH), exist_ok=True)
    model.save(MODEL_OUT_PATH)
    print(f"\nSaved model to {MODEL_OUT_PATH}")

    with open(LABELS_OUT_PATH, "w") as f:
        json.dump({str(i): name for i, name in enumerate(class_names)}, f, indent=2)
    print(f"Saved class labels to {LABELS_OUT_PATH}")

    val_loss, val_acc = model.evaluate(val_ds)
    print(f"\nFinal validation accuracy: {val_acc:.2%}")
    if val_acc < 0.6:
        print(
            "NOTE: validation accuracy is on the lower side, which is expected "
            "with ~100 images per class. Consider adding more images per "
            "disease folder and re-running this script when you can — nothing "
            "else in the pipeline needs to change."
        )


if __name__ == "__main__":
    main()