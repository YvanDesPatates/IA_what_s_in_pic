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

type MyAlbumsProps = BottomTabScreenProps<NavigationStackParamList, 'MyAlbums'>;

const MyAlbums = ({navigation, route}: MyAlbumsProps) => {
    const [newAlbumName, setNewAlbumName] = React.useState('');

    const albums = useQuery<any[]>({
        queryKey: ['albums'],
        queryFn: getAlbums,
    });

    const onAlbumSelected = (album: any) => {
        route.params.onSelect(album);
        navigation.goBack();
    };

    const onCreateNewAlbum = () => {
        route.params.onSelect({name: newAlbumName, new: true});
        navigation.goBack();
    };

    return (
        <Layout>
            <LayoutTop>
                <LayoutBackButton navigation={navigation} />
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: 'black',
                    }}>
                    Choose an album
                </Text>
            </LayoutTop>
            <LayoutContainer>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 15,
                    }}>
                    <Text>I want to create a new album</Text>
                    <InputTextField
                        name="albumName"
                        placeholder="Album name"
                        value={newAlbumName}
                        onChange={setNewAlbumName}
                    />
                    <Button
                        content="Create new album"
                        onPress={onCreateNewAlbum}
                    />
                </View>

                <View
                    style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        gap: 15,
                        marginTop: 20,
                    }}>
                    <Text>Or, choose your album</Text>
                    <AlbumListing
                        queryResult={albums}
                        onAlbumSelected={onAlbumSelected}
                    />
                </View>
            </LayoutContainer>
        </Layout>
    );
};

export default MyAlbums;

