import {useQuery} from '@tanstack/react-query';
import AlbumListing from '../components/AlbumListing';
import React from 'react';
import Layout from '../components/Layout/Layout';
import LayoutTop from '../components/Layout/LayoutTop';
import LayoutBackButton from '../components/Layout/LayoutBackButton';
import LayoutContainer from '../components/Layout/LayoutContainer';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import Button from '../components/Button';
import InputTextField from '../components/InputTextField';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NavigationStackParamList} from '../components/Navigation/NavigationStack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Callout from '../components/Callout';
import {getAlbums} from '../services/album/album.service';

type MyAlbumsProps = BottomTabScreenProps<NavigationStackParamList, 'MyAlbums'>;

const MyAlbums = ({navigation, route}: MyAlbumsProps) => {
    const {album, creation, onSelect} = route.params;

    const hasAlbum = album !== undefined;
    const isCreating = creation === 'new';
    const isRenewing = creation === 'edit';
    const isChoosing = creation === 'choose';

    const [newAlbumName, setNewAlbumName] = React.useState(
        (hasAlbum && album.name) || '',
    );
    const [participants, setParticipants] = React.useState<string[]>([]);
    const [isEmailsValid, setIsEmailsValid] = React.useState<boolean>(true);

    const albums = useQuery<any[]>({
        queryKey: ['albums'],
        queryFn: getAlbums,
    });

    const onAlbumSelected = (album: any) => {
        onSelect(album);
        navigation.goBack();
    };

    const onCreateNewAlbum = () => {
        if (newAlbumName === '') {
            return;
        }

        if (participants.length > 0) {
            const emailsValid = participants.every(email =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            );
            if (!emailsValid) {
                setIsEmailsValid(false);
                return;
            }
        }

        onSelect({
            id: hasAlbum ? album.id : undefined,
            name: newAlbumName,
            new: isCreating,
            participants,
        });
        navigation.goBack();
    };

    const addParticipant = () => {
        setParticipants([...participants, '']);
    };

    const removeParticipant = (index: number) => {
        const newParticipants = [...participants];
        newParticipants.splice(index, 1);
        setParticipants(newParticipants);
    };

    const onDeleteAlbum = () => {
        onSelect({
            id: album.id,
            name: undefined,
            new: false,
        });
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
                    {isCreating && 'Create new album'}
                    {isRenewing && 'Edit album'}
                    {isChoosing && 'Choose an album'}
                </Text>
            </LayoutTop>
            <LayoutContainer>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 15,
                    }}>
                    {isCreating && <Text>I want to create a new album</Text>}
                    <InputTextField
                        name="albumName"
                        placeholder="Album name"
                        value={newAlbumName}
                        onChange={setNewAlbumName}
                    />

                    {!isEmailsValid && (
                        <Callout
                            title="Add participants"
                            type="danger"
                            dismissablePress={() => setIsEmailsValid(true)}>
                            <Text>
                                Participants must have a valid email address.
                                Please check the email addresses and try again.
                            </Text>
                        </Callout>
                    )}

                    <Callout title="Add participants" type="info">
                        <Text>
                            You can add participants to your album by entering
                            their email addresses.
                        </Text>
                    </Callout>

                    {participants.length > 0 && (
                        <Text>Participants ({participants.length})</Text>
                    )}
                    <ScrollView
                        style={{
                            maxHeight: Dimensions.get('window').height * 0.5,
                        }}>
                        {participants.map((participant, index) => (
                            <View
                                key={index}
                                style={{
                                    marginBottom: 20,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 10,
                                }}>
                                <InputTextField
                                    flex
                                    name="participant"
                                    placeholder="Participant email"
                                    value={participant}
                                    onChange={value => {
                                        const newParticipants = [
                                            ...participants,
                                        ];
                                        newParticipants[index] = value;
                                        setParticipants(newParticipants);
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => removeParticipant(index)}>
                                    <Ionicons
                                        name="remove"
                                        size={30}
                                        color="white"
                                        style={{
                                            backgroundColor: 'indianred',
                                            borderRadius: 50,
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                    <Button
                        color="lightblue"
                        content="Add participant"
                        onPress={() => addParticipant()}
                    />
                    <Button
                        content={
                            isCreating || isChoosing
                                ? 'Create album'
                                : 'Save changes'
                        }
                        onPress={onCreateNewAlbum}
                    />
                    {!isChoosing && !isCreating && (
                        <Button
                            content={'Delete album'}
                            color="indianred"
                            onPress={onDeleteAlbum}
                        />
                    )}
                </View>

                {isChoosing && (
                    <View
                        style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            gap: 15,
                            marginTop: 20,
                        }}>
                        <Text>Or, choose one of my album</Text>
                        <AlbumListing
                            queryResult={albums}
                            onAlbumSelected={onAlbumSelected}
                        />
                    </View>
                )}
            </LayoutContainer>
        </Layout>
    );
};

export default MyAlbums;

