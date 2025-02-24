import cv2
import numpy as np
import os
import sys
import tensorflow as tf

from sklearn.model_selection import train_test_split

EPOCHS = 10
IMG_WIDTH = 30
IMG_HEIGHT = 30
NUM_CATEGORIES = 43
TEST_SIZE = 0.4


def main():
    # Check command-line arguments
    if len(sys.argv) not in [2, 3]:
        sys.exit("Usage: python traffic.py data_directory [model.h5]")

    # Get image arrays and labels for all image files
    images, labels = load_data(sys.argv[1])

    # Split data into training and testing sets
    labels = tf.keras.utils.to_categorical(labels)
    x_train, x_test, y_train, y_test = train_test_split(
        np.array(images), np.array(labels), test_size=TEST_SIZE
    )

    # Get a compiled neural network
    model = get_model()

    # Fit model on training data
    model.fit(x_train, y_train, epochs=EPOCHS)

    # Evaluate neural network performance
    model.evaluate(x_test, y_test, verbose=2)

    # Save model to file
    if len(sys.argv) == 3:
        filename = sys.argv[2]
        model.save(filename)
        print(f"Model saved to {filename}.")


def load_data(data_dir):
    """
    Load image data from directory `data_dir`.

    Assume `data_dir` has one directory named after each category, numbered
    0 through NUM_CATEGORIES - 1. Inside each category directory will be some
    number of image files.

    Return tuple `(images, labels)`. `images` should be a list of all
    of the images in the data directory, where each image is formatted as a
    numpy ndarray with dimensions IMG_WIDTH x IMG_HEIGHT x 3. `labels` should
    be a list of integer labels, representing the categories for each of the
    corresponding `images`.
    """
    images, labels = [], []

    for directory in os.listdir(data_dir):
        dir_path = os.path.join(data_dir, directory)
        if os.path.isdir(dir_path):
            for file in os.listdir(dir_path):
                if os.path.isfile(os.path.join(dir_path, file)):
                    image = cv2.imread(os.path.join(dir_path, file),
                                       cv2.IMREAD_COLOR)

                    image = cv2.resize(image, (IMG_WIDTH, IMG_HEIGHT))
                    images.append(image)
                    labels.append(int(directory))

    return (images, labels)


def get_model():
    """
    Returns a compiled convolutional neural network model. Assume that the
    `input_shape` of the first layer is `(IMG_WIDTH, IMG_HEIGHT, 3)`.
    The output layer should have `NUM_CATEGORIES` units, one for each category.
    """
    # base size of the filter for each block
    filter_base_size = 32
    # regularization weight
    l2_weights = 1e-4
    # dropout rate
    drop_rate = 0.3

    model = tf.keras.Sequential()

    # The architecture uses a VGG16 like architecture with some modifi-
    # cations.There are 4 blocks hidden blocks, where each block
    # consists of 2 CNN layer with L2 regularization. It also
    # consists of maxpooling layer, and a dropout layer
    # before the output of each hidden block goes to next block as input.
    # The only dense layer is the output layer with Softmax activation
    # with number of unit equal to NUM_CLASSES

    # Block 1 layers
    model.add(
        tf.keras.layers.Conv2D(
            filter_base_size, kernel_size=3, padding='same',
            kernel_regularizer=tf.keras.regularizers.l2(l2_weights),
            input_shape=(IMG_WIDTH, IMG_HEIGHT, 3)))

    model.add(tf.keras.layers.Activation('relu'))

    model.add(tf.keras.layers.Conv2D(
        filter_base_size, kernel_size=3, padding='same',
        kernel_regularizer=tf.keras.regularizers.l2(l2_weights)))

    model.add(tf.keras.layers.Activation('relu'))

    model.add(tf.keras.layers.MaxPooling2D(pool_size=(2, 2)))
    model.add(tf.keras.layers.Dropout(drop_rate))

    # Block 2 layers
    model.add(tf.keras.layers.Conv2D(
        filter_base_size * 2, kernel_size=3, padding='same',
        kernel_regularizer=tf.keras.regularizers.l2(l2_weights)))

    model.add(tf.keras.layers.Activation('relu'))

    model.add(tf.keras.layers.Conv2D(
        filter_base_size * 2, kernel_size=3, padding='same',
        kernel_regularizer=tf.keras.regularizers.l2(l2_weights)))

    model.add(tf.keras.layers.Activation('relu'))

    model.add(tf.keras.layers.MaxPooling2D(pool_size=(2, 2)))
    model.add(tf.keras.layers.Dropout(drop_rate))

    # Block 3 layers
    model.add(tf.keras.layers.Conv2D(
        filter_base_size * 4, kernel_size=3, padding='same',
        kernel_regularizer=tf.keras.regularizers.l2(l2_weights)))

    model.add(tf.keras.layers.Activation('relu'))

    model.add(tf.keras.layers.Conv2D(
        filter_base_size * 4, kernel_size=3, padding='same',
        kernel_regularizer=tf.keras.regularizers.l2(l2_weights)))

    model.add(tf.keras.layers.Activation('relu'))

    model.add(tf.keras.layers.MaxPooling2D(pool_size=(2, 2)))
    model.add(tf.keras.layers.Dropout(drop_rate))

    # Block 4 layers
    model.add(tf.keras.layers.Conv2D(
        filter_base_size * 8, kernel_size=3, padding='same',
        kernel_regularizer=tf.keras.regularizers.l2(l2_weights)))

    model.add(tf.keras.layers.Activation('relu'))

    model.add(tf.keras.layers.Conv2D(
        filter_base_size * 8, kernel_size=3, padding='same',
        kernel_regularizer=tf.keras.regularizers.l2(l2_weights)))

    model.add(tf.keras.layers.Activation('relu'))

    model.add(tf.keras.layers.MaxPooling2D(pool_size=(2, 2)))
    model.add(tf.keras.layers.Dropout(drop_rate))

    # Flatten and  dense layer with NUM_CATEGORIES nodes for output
    model.add(tf.keras.layers.Flatten())
    model.add(tf.keras.layers.Dense(NUM_CATEGORIES, activation='softmax'))

    # Compile the model

    # learning rate
    learning_rate = 0.001
    loss = "categorical_crossentropy"
    optimizer = tf.keras.optimizers.Adam(learning_rate=learning_rate)
    model.compile(loss=loss, optimizer=optimizer, metrics=['accuracy'])
    return model


if __name__ == "__main__":
    main()
