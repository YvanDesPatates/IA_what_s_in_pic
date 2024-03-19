import React from 'react';
import Layout from '../components/Layout/Layout';
import LayoutHeader from '../components/Layout/LayoutHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import LayoutContainer from '../components/Layout/LayoutContainer';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import AlbumItem from '../components/AlbumItem';
import defaultTheme from '../themes/defaultTheme';
import {useQuery} from '@tanstack/react-query';
import {getAlbums} from '../services/image/image.service';
import AlbumListing from '../components/AlbumListing';

type HomeProps = {
    navigation: BottomTabNavigationProp<any>;
};

const styles = StyleSheet.create({
    productView: {
        flex: 1,
        marginVertical: 30,
        marginHorizontal: -(30 + 1),
        marginLeft: 0,
    },
    cartIcon: {
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: defaultTheme.colors.primary,
        borderRadius: 50,
        width: 18,
        height: 20,
        textAlign: 'center',
        lineHeight: 18,
        fontSize: defaultTheme.fontSize.xsmall,
        color: 'white',
    },
    qrButton: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    qrButtonText: {
        fontSize: defaultTheme.fontSize.small,
        color: 'black',
        paddingBottom: 5,
    },
});

const Home = ({navigation}: HomeProps) => {
    // const user = useSelector(selectUser);

    // const openCart = () => {
    //     navigation.navigate('Cart');
    // };

    const screenWidth = Dimensions.get('window').width;
    const numColumns = 2;
    const gap = 5;
    const paddingHorizontal = 30 * 2;

    const availableSpace =
        screenWidth - (numColumns - 1) * gap - paddingHorizontal;
    const itemSize = availableSpace / numColumns;

    // const cartItemsCount = useSelector(selectCartItemsCount);

    // const defaultImage = require('../assets/yellow-chair.png');
    const albums = useQuery<any[]>({
        queryKey: ['albums'],
        queryFn: getAlbums,
    });

    // const albums = {
    //     isFetching: false,
    //     refetch: () => {},
    //     data: [
    //         {
    //             id: 1,
    //             name: 'My album',
    //             // photo: '/images.png',
    //         },
    //     ],
    // };

    const onAlbumSelected = (album: any) => {
        navigation.navigate('Album', {
            album,
        });
    };

    return (
        <Layout>
            {/* <LayoutTop>
                <View />
                <TouchableOpacity onPress={openCart}>
                    <Ionicons
                        style={styles.cartIcon}
                        name="cart-outline"
                        size={28}
                        color="black"
                    />
                    <Text style={styles.cartBadge}>{cartItemsCount}</Text>
                </TouchableOpacity>
            </LayoutTop> */}
            <LayoutContainer>
                <LayoutHeader title="Your" subTitle="Albums" noBottomMargin>
                    <TouchableOpacity
                        style={styles.qrButton}
                        onPress={() => {
                            navigation.navigate('TakePhoto');
                        }}>
                        <Text style={styles.qrButtonText}>Take a photo</Text>
                        <Ionicons name="camera" size={28} color="black" />
                    </TouchableOpacity>
                </LayoutHeader>

                <View
                    style={{
                        flex: 1,
                        marginTop: 30,
                    }}>
                    <AlbumListing
                        queryResult={albums}
                        onAlbumSelected={onAlbumSelected}
                    />
                </View>
            </LayoutContainer>
        </Layout>
    );
};

export default Home;
