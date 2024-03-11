import 'react-native-gesture-handler';

import {Provider} from 'react-redux';
import {store} from './src/stores/store';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import NavigationStack from './src/components/Navigation/NavigationStack';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './src/services/api';
import Orientation from 'react-native-orientation-locker';

const App = () => {
    Orientation.lockToPortrait();

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <NavigationContainer>
                    <NavigationStack />
                </NavigationContainer>
            </Provider>
        </QueryClientProvider>
    );
};

export default App;
