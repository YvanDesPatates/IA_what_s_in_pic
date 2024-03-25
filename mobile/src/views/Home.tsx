import React from 'react';
import Layout from '../components/Layout/Layout';
import LayoutHeader from '../components/Layout/LayoutHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import LayoutContainer from '../components/Layout/LayoutContainer';
import {TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import defaultTheme from '../themes/defaultTheme';
import {useMutation, useQuery} from '@tanstack/react-query';
import AlbumListing from '../components/AlbumListing';
import {createAlbum, getAlbums} from '../services/album/album.service';
import Callout from '../components/Callout';

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

    // const screenWidth = Dimensions.get('window').width;
    // const numColumns = 2;
    // const gap = 5;
    // const paddingHorizontal = 30 * 2;

    // const availableSpace =
    //     screenWidth - (numColumns - 1) * gap - paddingHorizontal;
    // const itemSize = availableSpace / numColumns;

    const [lastDeleted, setLastDeleted] = React.useState<any>(null);

    const albums = useQuery<any[]>({
        queryKey: ['albums'],
        queryFn: getAlbums,
    });

    const onAlbumSelected = (album: any) => {
        navigation.navigate('Album', {
            album,
            onRefresh: (album: any) => {
                albums.refetch();
                setLastDeleted(album);
            },
        });
    };

    const creationMutation = useMutation({
        mutationFn: (album: any) => createAlbum(album),
        onError: err => {
            console.log(err);
        },
        onSuccess: () => {
            albums.refetch();
        },
    });

    const onCreateNewAlbum = (album: any) => {
        creationMutation.mutate({
            ...album,
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
                        pointerEvents: creationMutation.isPending
                            ? 'none'
                            : 'auto',
                        opacity: creationMutation.isPending ? 0.2 : 1,
                        flex: 1,
                        marginTop: 30,
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('MyAlbums', {
                                creation: 'new',
                                onSelect: onCreateNewAlbum,
                            });
                        }}
                        style={{
                            position: 'absolute',
                            zIndex: 100,
                            bottom: 20,
                            right: 0,
                            height: 60,
                            width: 60,
                            backgroundColor: defaultTheme.colors.primary,
                            borderRadius: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 3,
                            flex: 1,
                        }}>
                        <Ionicons name="add" size={28} color="white" />
                    </TouchableOpacity>

                    {creationMutation.isSuccess && (
                        <View
                            style={{
                                marginBottom: 20,
                            }}>
                            <Callout
                                title="Album created"
                                type="success"
                                dismissablePress={() => {
                                    creationMutation.reset();
                                }}>
                                <Text>
                                    Your album was created successfully.
                                </Text>
                            </Callout>
                        </View>
                    )}

                    {albums.isError && (
                        <View
                            style={{
                                marginBottom: 20,
                            }}>
                            <Callout
                                title="Error"
                                type="danger"
                                dismissablePress={() => {
                                    albums.refetch();
                                }}>
                                <Text>
                                    An error occurred while fetching albums. Tap
                                    to retry.
                                </Text>
                            </Callout>
                        </View>
                    )}

                    {lastDeleted && (
                        <View
                            style={{
                                marginBottom: 20,
                            }}>
                            <Callout
                                title="Album deleted"
                                type="danger"
                                dismissablePress={() => {
                                    setLastDeleted(null);
                                }}>
                                <Text>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                        }}>
                                        {lastDeleted.name}
                                    </Text>{' '}
                                    was deleted successfully.
                                </Text>
                            </Callout>
                        </View>
                    )}

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
