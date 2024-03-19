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

type AlbumListingProps = {
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

const AlbumListing = ({queryResult, onAlbumSelected}: AlbumListingProps) => {
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
                    No albums found. Take a photo and create your first album !
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
                        <AlbumItem
                            onPress={() => onAlbumSelected?.(albumItem.item)}
                            width={itemSize}
                            item={albumItem.item}
                        />
                    )}
                    numColumns={numColumns}
                    contentContainerStyle={{gap}}
                    columnWrapperStyle={{gap}}
                />
            }
        </View>
    );
};

export default AlbumListing;

