import React from 'react';
import {
    Dimensions,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import AlbumItem from './AlbumItem';
import {UseQueryResult} from '@tanstack/react-query';

type PhotoListingProps = {
    queryResult: UseQueryResult<any[], any>;
    onAlbumSelected?: (album: any) => void;
};

const styles = StyleSheet.create({
    productView: {
        flex: 1,
        // marginVertical: 30,
        marginHorizontal: -(30 + 1),
        marginLeft: 0,
    },
});

const PhotoListing = ({queryResult, onAlbumSelected}: PhotoListingProps) => {
    const screenWidth = Dimensions.get('window').width;
    const numColumns = 2;
    const gap = 5;
    const paddingHorizontal = 30 * 2;
    const availableSpace =
        screenWidth - (numColumns - 1) * gap - paddingHorizontal;
    const itemSize = availableSpace / numColumns;

    return (
        <View style={styles.productView}>
            {queryResult.data?.length === 0 && (
                <Text>
                    No photo found. Take a photo and create your first album !
                </Text>
            )}
            {
                <FlatList
                    refreshControl={
                        <RefreshControl
                            enabled={true}
                            refreshing={queryResult.isFetching}
                            onRefresh={queryResult.refetch}
                        />
                    }
                    overScrollMode="never"
                    fadingEdgeLength={50}
                    data={queryResult.data?.map(album => ({
                        ...album,
                        // photo:
                        //     typeof album.photo === 'string'
                        //         ? defaultImage
                        //         : album.photo,
                    }))}
                    renderItem={albumItem => (
                        <View
                            style={{
                                width: itemSize,
                                height: itemSize,
                            }}></View>
                    )}
                    numColumns={numColumns}
                    contentContainerStyle={{gap}}
                    columnWrapperStyle={{gap}}
                />
            }
        </View>
    );
};

export default PhotoListing;

