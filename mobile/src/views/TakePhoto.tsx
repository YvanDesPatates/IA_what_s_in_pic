import React, {useLayoutEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Layout from '../components/Layout/Layout';
import LayoutTop from '../components/Layout/LayoutTop';
import LayoutBackButton from '../components/Layout/LayoutBackButton';
import LayoutContainer from '../components/Layout/LayoutContainer';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
} from 'react-native-vision-camera';
import Callout from '../components/Callout';
import Button from '../components/Button';
import {useMutation} from '@tanstack/react-query';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../stores/user/userSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Image as IMGC} from 'react-native-compressor';
import {uploadImage} from '../services/image/image.service';

type TakePhotoProps = {
    navigation: BottomTabNavigationProp<any>;
};

const styles = StyleSheet.create({
    checkoutView: {
        flex: 1,
        gap: 20,
        borderRadius: 10,
        marginBottom: 30,
    },
    cameraView: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    takePhotoButton: {
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: [{translateX: -35}],
        zIndex: 100,
    },
    photoTakenCross: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 100,
    },
    doubleBoutton: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
    },
});

const TakePhoto = ({navigation}: TakePhotoProps) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const {hasPermission, requestPermission} = useCameraPermission();
    const device = useCameraDevice('back');
    const cameraRef = React.useRef<Camera>(null);

    const [takenPhoto, setTakenPhoto] = React.useState<string>();

    const {mutate: productsMutation} = useMutation({
        mutationFn: (data: {token: string; image_path: string}) =>
            uploadImage(''),
        onSuccess: data => {
            console.log(data);
        },
        onError: error => {
            console.log(error);
        },
    });

    const uploadPhoto = () => {
        if (takenPhoto) {
            productsMutation({
                token: user.access_token,
                image_path: takenPhoto,
            });
        }
    };

    const fileReader = new FileReader();
    fileReader.onload = function () {
        const base64 = fileReader.result;
        setTakenPhoto(base64 as string);
    };

    const takePhoto = () => {
        cameraRef.current
            ?.takePhoto({
                enableShutterSound: false,
                // flash: 'on',
                qualityPrioritization: 'quality',
                enableAutoStabilization: true,
                enableAutoDistortionCorrection: true,
                enableAutoRedEyeReduction: true,
            })
            .then(async photo => {
                const imageCompressedPath = await IMGC.compress(
                    'file://' + photo.path,
                    {
                        quality: 0.8,
                    },
                );
                const result = await fetch(imageCompressedPath);
                const data = await result.blob();

                fileReader.readAsDataURL(data);
            });
    };

    useLayoutEffect(() => {
        if (!hasPermission) requestPermission();
    }, [hasPermission, requestPermission]);

    return (
        <Layout>
            <LayoutTop>
                <LayoutBackButton navigation={navigation} />
            </LayoutTop>
            <LayoutContainer>
                {!hasPermission && (
                    <View style={styles.checkoutView}>
                        <Callout type="danger" title="No access to camera">
                            <Text>
                                No access to camera. Please allow access to
                                camera in your phone settings or press the
                                button below to request access.
                            </Text>
                        </Callout>

                        <Button
                            onPress={requestPermission}
                            content="Request access"
                        />
                    </View>
                )}

                {hasPermission && (
                    <View style={styles.checkoutView}>
                        {!device && (
                            <Callout
                                type="danger"
                                title="No camera device found">
                                <Text>No camera device found</Text>
                            </Callout>
                        )}
                        {device && (
                            <>
                                <View style={styles.cameraView}>
                                    {takenPhoto ? (
                                        <Image
                                            style={styles.camera}
                                            source={{uri: takenPhoto}}
                                        />
                                    ) : (
                                        <>
                                            <Camera
                                                photo={true}
                                                zoom={device.neutralZoom}
                                                ref={cameraRef}
                                                style={styles.camera}
                                                device={device}
                                                isActive={true}
                                                enableZoomGesture={true}
                                            />
                                            <Ionicons
                                                style={styles.takePhotoButton}
                                                name={'ellipse'}
                                                size={70}
                                                color={'white'}
                                                onPress={takePhoto}
                                            />
                                        </>
                                    )}
                                </View>
                            </>
                        )}
                        {takenPhoto ? (
                            <View style={styles.doubleBoutton}>
                                <Button
                                    flex
                                    onPress={() => {
                                        setTakenPhoto(undefined);
                                    }}
                                    content="Retake"
                                />
                                <Button
                                    flex
                                    onPress={uploadPhoto}
                                    content="Upload"
                                />
                            </View>
                        ) : null}
                    </View>
                )}
            </LayoutContainer>
        </Layout>
    );
};

export default TakePhoto;
