import React, {useEffect, useLayoutEffect, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../stores/user/userSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import defaultTheme from '../themes/defaultTheme';
import fs from 'react-native-fs';

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
    topText: {
        fontSize: defaultTheme.fontSize.normal,
        color: 'black',
    },
    topTextContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
});

const TakePhoto = ({navigation}: TakePhotoProps) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const {hasPermission, requestPermission} = useCameraPermission();
    const device = useCameraDevice('back');
    const cameraRef = React.useRef<Camera>(null);

    const [takenPhoto, setTakenPhoto] = React.useState<string>();
    const [takenPhotoSize, setTakenPhotoSize] = React.useState<number>();
    const [takenPhotoSizeText, setTakenPhotoSizeText] =
        React.useState<string>();
    const [takenPhotoSize1, setTakenPhotoSize1] = React.useState<number>();
    const [takenPhotoSize2, setTakenPhotoSize2] = React.useState<number>();

    useEffect(() => {
        if (takenPhotoSize === undefined) {
            setTakenPhotoSizeText('');
            return;
        }

        const photoSize =
            takenPhotoSize / 1000 > 1000
                ? (takenPhotoSize / 1000000).toFixed(2) + 'MB'
                : (takenPhotoSize / 1000).toFixed(2) + 'KB';
        setTakenPhotoSizeText(photoSize);
    }, [takenPhotoSize]);

    const [screenshotState, setScreenshotState] = useState<
        'idle' | 'taking' | 'compressing' | 'previewing'
    >('idle');
    const screenshotStateRef = React.useRef<
        'idle' | 'taking' | 'compressing' | 'previewing'
    >('idle');

    const [photoPath, setPhotoPath] = useState<string>();
    const photoPathRef = React.useRef<string>();

    useEffect(() => {
        screenshotStateRef.current = screenshotState;
    }, [screenshotState]);

    useEffect(() => {
        photoPathRef.current = photoPath;
    }, [photoPath]);

    const uploadPhoto = () => {
        if (takenPhoto) {
            navigation.navigate('UploadPhoto', {
                photo: takenPhoto,
                photoPath: photoPath,
                photoSize: takenPhotoSizeText,
            });
        }
    };

    const loadPhoto = async (path: string, first: boolean) => {
        setPhotoPath(path);
        let photoPath = 'file://' + path;

        // Load photo
        const image = await fs.readFile(photoPath, 'base64');
        setTakenPhoto('data:image/jpeg;base64,' + image);

        // Get the image size
        const stats = await fs.stat(path);
        setTakenPhotoSize(stats.size);

        if (!first) {
            setTakenPhotoSize2(stats.size);
            setScreenshotState('previewing');
        } else {
            setTakenPhotoSize1(stats.size);
        }
    };

    const takePhoto = () => {
        setScreenshotState('taking');

        cameraRef.current
            ?.takePhoto({
                enableShutterSound: false,
                // flash: 'on', // lol
                qualityPrioritization: 'speed',
            })
            .then(async photo => {
                setScreenshotState('compressing');

                await loadPhoto(photo.path, true);
                // Compress the image (good balance between quality and size)
                //un appel a ma fonction python
                const compressedImage = await ImageResizer.createResizedImage(
                    'file://' + photo.path,
                    photo.width,
                    photo.height,
                    'WEBP',
                    0,
                    undefined,
                    undefined,
                    false,
                );

                if (
                    screenshotStateRef.current === 'compressing' &&
                    photoPathRef.current === photo.path
                ) {
                    await loadPhoto(compressedImage.uri, false);
                }
            });
    };

    useLayoutEffect(() => {
        if (!hasPermission) requestPermission();
    }, [hasPermission, requestPermission]);

    const getStatusText = (state: string) => {
        let text = '';
        switch (state) {
            case 'idle':
                text = 'Take a photo !';
                break;
            case 'taking':
                text = 'Taking photo...';
                break;
            case 'compressing':
                text = 'Compressing photo...';
                break;
            case 'previewing':
                text = 'Photo taken';
                break;
            default:
                text = 'Take a photo !';
        }

        return text;
    };

    return (
        <Layout>
            <LayoutTop>
                <LayoutBackButton navigation={navigation} />
                <View style={styles.topTextContainer}>
                    <Text style={styles.topText}>
                        {getStatusText(screenshotState)}
                    </Text>
                    {takenPhotoSizeText && (
                        <>
                            <Text>•</Text>
                            <Text
                                style={[
                                    styles.topText,
                                    {
                                        color:
                                            screenshotState === 'previewing'
                                                ? 'green'
                                                : screenshotState === 'idle'
                                                ? 'black'
                                                : 'red',
                                    },
                                ]}>
                                {takenPhotoSizeText}
                                {screenshotState === 'previewing' &&
                                takenPhotoSize1 &&
                                takenPhotoSize2
                                    ? ' (' +
                                      Math.round(
                                          ((takenPhotoSize2 - takenPhotoSize1) /
                                              takenPhotoSize1) *
                                              100,
                                      ) +
                                      '%)'
                                    : ''}
                            </Text>
                        </>
                    )}
                </View>
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
                                                style={[
                                                    styles.takePhotoButton,
                                                    {
                                                        opacity:
                                                            screenshotState ===
                                                            'taking'
                                                                ? 0.5
                                                                : 1,
                                                        display:
                                                            screenshotState ===
                                                            'compressing'
                                                                ? 'none'
                                                                : 'flex',
                                                    },
                                                ]}
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
                                        setScreenshotState('idle');
                                        setTakenPhotoSize(undefined);
                                    }}
                                    content="Retry"
                                    color="#D3D3D3"
                                />
                                {screenshotState === 'previewing' && (
                                    <Button
                                        flex
                                        onPress={uploadPhoto}
                                        content="Continue"
                                    />
                                )}
                            </View>
                        ) : null}
                    </View>
                )}
            </LayoutContainer>
        </Layout>
    );
};

export default TakePhoto;
