import React from 'react';
import {
    Image,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Layout from '../components/Layout/Layout';
import LayoutTop from '../components/Layout/LayoutTop';
import LayoutBackButton from '../components/Layout/LayoutBackButton';
import LayoutContainer from '../components/Layout/LayoutContainer';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import LayoutHeader from '../components/Layout/LayoutHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputTextField from '../components/InputTextField';
import Button from '../components/Button';
import {Album} from '../types/album';
import {useSelector} from 'react-redux';
import {selectUser} from '../stores/user/userSlice';
import defaultTheme from '../themes/defaultTheme';
import {NavigationStackParamList} from '../components/Navigation/NavigationStack';
import {Buffer} from 'buffer';

type UploadPhotoProps = BottomTabScreenProps<
    NavigationStackParamList,
    'UploadPhoto'
>;

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    viewContainer: {
        flex: 1,
    },
    productForm: {
        flex: 1,
        gap: 10,
    },
    photoField: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    imagePreviewView: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    imagePreviewText: {
        fontSize: defaultTheme.fontSize.small,
    },
});

const UploadPhoto = ({navigation, route}: UploadPhotoProps) => {
    const user = useSelector(selectUser);
    const defaultImage = require('../assets/yellow-chair.png');

    const [photoTime, setPhotoTime] = React.useState<Date>(new Date());
    const [imageName, setImageName] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [album, setAlbum] = React.useState<any>();

    type ProductCreation = Album & {seller_id: string};

    // const {mutate: uploadMutation} = useMutation({
    //     mutationFn: (data: {clientId: string; asset: Asset}) =>
    //         uploadImage(data.clientId, data.asset),
    //     onSuccess: async data => {
    //         console.log('data', data);
    //     },
    //     onError: async error => {
    //         console.log('error', error);
    //     },
    // });

    // const {mutate: addProductMutation} = useMutation({
    //     mutationFn: (data: {token: string; product: ProductCreation}) =>
    //         createProduct(data.token, data.product),
    //     onSuccess: async data => {
    //         console.log('data', data);
    //         setImageName('');
    //         setDescription('');
    //         setAlbum('');
    //     },
    //     onError: async error => {
    //         console.log('error', error);
    //     },
    // });

    // const addPhoto = () => {
    //     launchCamera({mediaType: 'photo'}, async response => {
    //         const firstImage = response.assets && response.assets[0];
    //         if (firstImage) {
    //             // uploadMutation({
    //             //     clientId: IMGUR_CLIENT_ID ?? '',
    //             //     asset: firstImage,
    //             // });
    //             setPhoto('photo');
    //         }
    //     });
    // };

    // const addProduct = () => {
    //     const product: ProductCreation = {
    //         name: imageName,
    //         description,
    //         price: price ?? 0,
    //         photo: album ?? defaultImage,
    //         id: uuid.v4().toString(),
    //         seller_id: user.id,
    //     };

    //     addProductMutation({
    //         token: user.access_token,
    //         product,
    //     });
    // };

    const buttonValidation = imageName && description && album ? true : false;

    const onSelectAlbum = (album: any) => {
        setAlbum(album);
    };

    const upload = () => {
        const imageBytes = Buffer.from(route.params.photo, 'base64');

        // console.log('imageBytes', imageBytes);
    };

    return (
        <KeyboardAvoidingView style={styles.viewContainer} behavior={'height'}>
            <Layout style={styles.view}>
                <LayoutTop>
                    <LayoutBackButton navigation={navigation} />
                </LayoutTop>
                <LayoutContainer>
                    <LayoutHeader title="Add" subTitle="Your image">
                        <TouchableOpacity>
                            <Ionicons
                                name="bag-add"
                                size={28}
                                color={defaultTheme.colors.primary}
                            />
                        </TouchableOpacity>
                    </LayoutHeader>

                    <View style={styles.productForm}>
                        {/* Load image BASE64 */}
                        <View style={styles.imagePreviewView}>
                            {route.params.photo && (
                                <Image
                                    source={{
                                        uri: route.params.photo,
                                    }}
                                    style={styles.imagePreview}
                                />
                            )}
                            <View
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                <View>
                                    <Text style={styles.imagePreviewText}>
                                        Photo taken on
                                    </Text>
                                    <Text style={styles.imagePreviewText}>
                                        {photoTime.toLocaleDateString()} at{' '}
                                        {photoTime.toLocaleTimeString()}
                                    </Text>
                                </View>
                                <Text style={{color: 'green'}}>
                                    {route.params.photoSize}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 15,
                                marginBottom: 20,
                            }}>
                            <Text>Name</Text>
                            <InputTextField
                                value={imageName}
                                onChange={setImageName}
                                name="ProductName"
                                icon="pricetag-outline"
                                placeholder="Image name"
                            />

                            <Text>Description</Text>
                            <InputTextField
                                value={description}
                                onChange={setDescription}
                                name="Description"
                                icon="pricetag-outline"
                                placeholder="Description"
                            />

                            <Text>Album</Text>
                            <Button
                                disableBordersRadius={[
                                    'topLeft',
                                    'topRight',
                                    'bottomLeft',
                                    'bottomRight',
                                ]}
                                color="lightgray"
                                content={
                                    album
                                        ? album.name +
                                          (album.new ? ' (new)' : '')
                                        : 'Choose an album'
                                }
                                onPress={() => {
                                    navigation.navigate('MyAlbums', {
                                        onSelect: onSelectAlbum,
                                    });
                                }}
                            />
                        </View>
                        <Button
                            disabled={buttonValidation ? false : true}
                            color={
                                buttonValidation
                                    ? defaultTheme.colors.primary
                                    : 'gray'
                            }
                            content={
                                buttonValidation
                                    ? 'Upload my photo'
                                    : 'You must fill all fields to upload'
                            }
                            textColor={buttonValidation ? 'black' : 'white'}
                            onPress={upload}
                        />
                    </View>
                </LayoutContainer>
            </Layout>
            {/* <Button
                disabled={buttonValidation ? false : true}
                color={buttonValidation ? defaultTheme.colors.primary : 'gray'}
                textColor={buttonValidation ? 'black' : 'white'}
                content={
                    buttonValidation
                        ? 'Upload my photo'
                        : 'You must fill all fields to upload your photo'
                }
                disableBordersRadius={[
                    'bottomLeft',
                    'bottomRight',
                    'topLeft',
                    'topRight',
                ]}
                onPress={addProduct}
            /> */}
        </KeyboardAvoidingView>
    );
};

export default UploadPhoto;
