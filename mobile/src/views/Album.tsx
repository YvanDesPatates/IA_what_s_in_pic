import {useMutation, useQuery} from '@tanstack/react-query';
import React from 'react';
import Layout from '../components/Layout/Layout';
import LayoutTop from '../components/Layout/LayoutTop';
import LayoutBackButton from '../components/Layout/LayoutBackButton';
import LayoutContainer from '../components/Layout/LayoutContainer';
import {Text, TouchableOpacity, View} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NavigationStackParamList} from '../components/Navigation/NavigationStack';
import PhotoListing from '../components/PhotoListing';
import LayoutHeader from '../components/Layout/LayoutHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import defaultTheme from '../themes/defaultTheme';
import {
    deleteAlbum,
    getAlbums,
    updateAlbum,
} from '../services/album/album.service';

type MyAlbumsProps = BottomTabScreenProps<NavigationStackParamList, 'Album'>;

const Album = ({navigation, route}: MyAlbumsProps) => {
    const {album, onRefresh} = route.params;

    const photos = useQuery<any[]>({
        queryKey: ['photos'],
        queryFn: getAlbums,
    });

    const updateMutation = useMutation({
        mutationFn: (album: any) => updateAlbum(album),
        onError: err => {
            console.log(err);
        },
        onSuccess: () => {
            console.log('Album updated');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (album: any) => deleteAlbum(album),
        onError: err => {
            console.log(err);
        },
        onSuccess: () => {
            onRefresh(album);
            navigation.goBack();
        },
    });

    const onUpdateAlbum = (album: any) => {
        updateMutation.mutate({
            ...album,
        });
    };

    const onDeleteAlbum = (album: any) => {
        deleteMutation.mutate({
            ...album,
        });
    };

    return (
        <Layout>
            <LayoutTop>
                <LayoutBackButton navigation={navigation} />
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('MyAlbums', {
                            album: album,
                            creation: 'edit',
                            onSelect: (album: any) => {
                                if (
                                    album.id &&
                                    album.name === undefined &&
                                    album.new == false
                                ) {
                                    onDeleteAlbum(album);
                                } else {
                                    onUpdateAlbum(album);
                                }
                            },
                        });
                    }}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 15,
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: defaultTheme.fontSize.normal,
                            color: 'black',
                        }}>
                        Settings
                    </Text>
                    <Ionicons name="settings-outline" size={28} color="black" />
                </TouchableOpacity>
            </LayoutTop>
            <LayoutContainer
                loading={
                    photos.isFetching ||
                    updateMutation.isPending ||
                    deleteMutation.isPending
                }>
                <LayoutHeader
                    title="Album"
                    subTitle={album.name}
                    noBottomMargin>
                    <Ionicons
                        name="images-outline"
                        size={28}
                        color={defaultTheme.colors.primary}
                    />
                </LayoutHeader>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 15,
                    }}>
                    <PhotoListing queryResult={photos} />
                </View>
            </LayoutContainer>
        </Layout>
    );
};

export default Album;

