"""
Disease detection model architecture.

Uses MobileNetV2 pretrained on ImageNet as a frozen feature extractor,
with a small custom classification head on top. This approach is chosen
specifically because it works reasonably well with small datasets
(~100 images per class) — training a CNN from scratch would need far
more data than that.
"""

import tensorflow as tf
from tensorflow.keras import layers, models


IMG_SIZE = (224, 224)
IMG_SHAPE = IMG_SIZE + (3,)


def build_model(num_classes: int, fine_tune_last_n_layers: int = 20) -> tf.keras.Model:
    """
    Builds and returns a compiled Keras model.

    Args:
        num_classes: number of disease classes (derived from folder count)
        fine_tune_last_n_layers: how many of the base model's top layers
            to unfreeze for fine-tuning. Keep this small with limited data
            to avoid overfitting.
    """
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=IMG_SHAPE,
        include_top=False,
        weights="imagenet",
    )

    # Freeze the base model initially
    base_model.trainable = False

    inputs = tf.keras.Input(shape=IMG_SHAPE)

    # MobileNetV2 expects inputs preprocessed with its own scheme
    x = tf.keras.applications.mobilenet_v2.preprocess_input(inputs)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.4)(x)  # higher dropout — helps with small dataset overfitting
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = models.Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    model._base_model_ref = base_model  # keep a handle for fine-tuning step in train.py
    return model


def unfreeze_for_fine_tuning(model: tf.keras.Model, fine_tune_last_n_layers: int = 20):
    """
    Call this after initial training to unfreeze the top N layers of the
    base model for a low-learning-rate fine-tuning pass. Optional step —
    train.py runs it automatically after the first training phase.
    """
    base_model = model._base_model_ref
    base_model.trainable = True

    for layer in base_model.layers[:-fine_tune_last_n_layers]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),  # much lower LR for fine-tuning
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model