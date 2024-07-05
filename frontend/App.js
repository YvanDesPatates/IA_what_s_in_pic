import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, View} from "react-native";

import axios from "axios";
import Button from './components/Button';
import ImageViewer from './components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import {useState} from 'react';

const PlaceholderImage = require("./assets/place-holder-image.webp");

export default function App() {
    const [imageToShow, setimageToShow] = useState();
    const [imageToSend, setimageToSend] = useState();
    const [prediction, setPrediction] = useState("make your first prediction !")
    const base_url = "https://b1d0-147-99-27-201.ngrok-free.app"
    const url = base_url+'/predict';

    /**
     * ATTENTION ne marche que sur navigateur car, sous android, launchImageLibraryAsync() ne retourne que l'uri sans les données en base64.
     * Je n'ai pas réussi à lire le fichier en base64 pour le mettre dans la variable setimageToSend
     */
    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.15,
        });

        if (!result.canceled) {
            setimageToShow(result.assets[0].uri)
            setimageToSend(result.assets[0].uri)
        } else {
            alert('You did not select any image.');
        }
    };

    const openCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            base64: true,
            quality: 0.15,
        });

        if (!result.cancelled) {
            setimageToShow(result.assets[0].uri)
            setimageToSend(result.assets[0].base64)
        } else {
            alert('You did not select any image.');
        }
    };

    const getPredictionAsync = async () => {
        if (!imageToShow){
            setPrediction("you have to pick an image first !")
            return
        }

        const formData = new FormData();
        formData.append('image', imageToSend);

        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                setPrediction(response.data.prediction);
            })
            .catch(error => {
                setPrediction( JSON.stringify(error) );
            });
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Text style={styles.text}>
                    what's in the pic ??
                </Text>
                <Text style={styles.text}>
                    maybe there is a ...
                </Text>
                <Text style={styles.text}>
                    {prediction}
                </Text>
                <ImageViewer
                    placeholderImageSource={PlaceholderImage}
                    selectedImage={imageToShow}
                />
            </View>
            <View style={styles.footerContainer}>
                <Button theme="primary" label="Choose a photo" onPress={openCamera}/>
                <Button theme="primary" label="Predict what's in this photo" onPress={getPredictionAsync}/>
            </View>
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        paddingTop: 58,
        alignItems: 'center',
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: 'center',
    },
    text: {
        color: 'white',
    }
});
