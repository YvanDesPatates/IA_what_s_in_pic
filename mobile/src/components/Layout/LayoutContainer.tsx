import React from 'react';
import {StyleSheet, View} from 'react-native';

type LayoutContainerProps = {
    children: React.ReactNode;
    loading?: boolean;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const LayoutContainer = ({loading, children}: LayoutContainerProps) => {
    return (
        <View
            style={{
                ...styles.container,
                ...(loading && {opacity: 0.5, pointerEvents: 'none'}),
            }}>
            {children}
        </View>
    );
};

export default LayoutContainer;
