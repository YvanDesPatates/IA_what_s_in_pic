import numpy as np
import keras
from keras.applications.resnet50 import ResNet50, preprocess_input, decode_predictions
import sys

# Accessing command-line arguments
image_path = sys.argv[1]
output_path = sys.argv[2]



print(image_path, output_path)
model = ResNet50(weights='imagenet')


def preprocess_image(image_path):
    img = keras.preprocessing.image.load_img(image_path, target_size=(224, 224))
    x = keras.preprocessing.image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    return x


preprocessed_image = preprocess_image(image_path)

predictions = model.predict(preprocessed_image)
predicted_classes = decode_predictions(predictions)[0][0][1]

# writing results in the file
with open(output_path, 'w') as file:
    file.truncate(0)
    file.write(predicted_classes)
