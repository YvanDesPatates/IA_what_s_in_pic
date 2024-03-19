import {useQuery} from '@tanstack/react-query';
import AlbumListing from '../components/AlbumListing';
import {getAlbums} from '../services/image/image.service';
import React from 'react';
import Layout from '../components/Layout/Layout';
import LayoutTop from '../components/Layout/LayoutTop';
import LayoutBackButton from '../components/Layout/LayoutBackButton';
import LayoutContainer from '../components/Layout/LayoutContainer';
import {Text, View} from 'react-native';
import Button from '../components/Button';
import InputTextField from '../components/InputTextField';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NavigationStackParamList} from '../components/Navigation/NavigationStack';
import PhotoListing from '../components/PhotoListing';
import LayoutHeader from '../components/Layout/LayoutHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import defaultTheme from '../themes/defaultTheme';

type MyAlbumsProps = BottomTabScreenProps<NavigationStackParamList, 'Album'>;

const Album = ({navigation, route}: MyAlbumsProps) => {
    const {album} = route.params;

    const photos = useQuery<any[]>({
        queryKey: ['photos'],
        queryFn: getAlbums,
    });

    return (
        <Layout>
            <LayoutTop>
                <LayoutBackButton navigation={navigation} />
            </LayoutTop>
            <LayoutContainer>
                <LayoutHeader title="Album" subTitle={album.name} noBottomMargin>
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

