import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {TouchableOpacity} from 'react-native';
import defaultTheme from '../themes/defaultTheme';

type ProductItemProps = {
    width: number;
    item: any;
    myProduct?: boolean;
    onDeleted?: () => void;
    onPress?: (id: string) => void;
};

const styles = StyleSheet.create({
    productItem: {
        backgroundColor: '#f6f6f6',
        borderRadius: 10,
        shadowOffset: {width: 0, height: 2},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 2,
        // padding: 20,
    },
    productItemContent: {
        padding: 20,
        flex: 1,
    },
    productIcons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    productImages: {
        flexDirection: 'row',
        justifyContent: 'center',
        // marginTop: 20,
        // marginBottom: 30,
        height: 100,
        flex: 1,
    },
    productImage: {
        resizeMode: 'contain',
        height: '100%',
    },
    productInfo: {
        flexDirection: 'column',
        gap: 6,
        marginBottom: 10,
    },
    productInfoText1: {
        fontSize: defaultTheme.fontSize.normal,
        color: 'black',
    },
    productInfoText2: {
        fontSize: defaultTheme.fontSize.normal,
        fontWeight: '700',
        color: 'black',
    },
    productLabel: {
        fontSize: defaultTheme.fontSize.normal,
        color: 'black',
    },
});

const AlbumItem = ({
    width,
    item,
    myProduct,
    onDeleted,
    onPress,
}: ProductItemProps) => {
    // const user = useSelector(selectUser);

    // const dispatch = useDispatch();
    // const [added, setAdded] = useState(false);

    // const {mutate: deleteProductMutation} = useMutation({
    //     mutationFn: (data: {token: string; product_id: string}) =>
    //         deleteProduct(data.token, data.product_id),
    //     onSuccess: async data => {
    //         onDeleted && onDeleted();
    //     },
    //     onError: async error => {
    //         console.log('error', error);
    //     },
    // });

    // const addProduct = () => {
    //     // dispatch(cartAdded(product));
    //     setAdded(true);
    //     setTimeout(() => setAdded(false), 1000);
    // };

    // const deleteProductFromListing = () => {
    //     Alert.alert(
    //         'Delete product',
    //         'Are you sure you want to delete this product?',
    //         [
    //             {
    //                 text: 'Cancel',
    //                 style: 'cancel',
    //             },
    //             {
    //                 text: 'Delete',
    //                 onPress: () => {
    //                     // deleteProductMutation({
    //                     //     token: user.access_token,
    //                     //     product_id: product.id,
    //                     // });
    //                 },
    //             },
    //         ],
    //     );
    // };

    return (
        <TouchableOpacity onPress={() => onPress && onPress(item.id ?? '')}>
            <View style={{...styles.productItem, width}}>
                <View style={styles.productItemContent}>
                    {/* <View style={styles.productIcons}> */}
                    <Text style={styles.productLabel}>{item.name}</Text>
                    {/* </View> */}
                    {/* <View style={styles.productIcons}>
                    {myProduct && (
                        <TouchableOpacity onPress={deleteProductFromListing}>
                            <Ionicons
                                name={'trash'}
                                size={20}
                                color="indianred"
                            />
                        </TouchableOpacity>
                    )}
                </View> */}

                    <View style={styles.productImages}>
                        {/* <Image style={styles.productImage}
                         source={product.photo} /> */}
                    </View>

                    <View style={styles.productInfo}>
                        {/* <Text style={styles.productInfoText1}>
                        {product.name}</Text> */}
                        <Text style={styles.productInfoText2}>
                            {/* {product.price} € */}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default AlbumItem;
