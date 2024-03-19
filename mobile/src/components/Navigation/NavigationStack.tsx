import React from 'react';
import {
    StackNavigationOptions,
    createStackNavigator,
} from '@react-navigation/stack';
import Login from '../../views/Login';
import Register from '../../views/Register';
import Settings from '../../views/Settings';
import TakePhoto from '../../views/TakePhoto';
import Home from '../../views/Home';
import UploadPhoto from '../../views/UploadPhoto';
import MyAlbums from '../../views/MyAlbums';
import Album from '../../views/Album';

interface screenOptionsProps {
    route: {
        name: string;
    };
}

export type NavigationStackParamList = {
    Login: undefined;
    Register: undefined;
    // Cart: undefined;
    Settings: undefined;
    Tabs: undefined;
    TakePhoto: undefined;
    UploadPhoto: {
        photo: string;
        photoSize: number;
    };
    MyAlbums: {
        onSelect: (album: any) => void;
    };
    Album: {
        album: any;
    };
};

const navigatorOptions: ({
    route,
}: screenOptionsProps) => StackNavigationOptions = ({route}) => ({
    headerShown: false,
    headerTitle: route.name,
});

const NavigationStack = () => {
    const Stack = createStackNavigator<NavigationStackParamList>();

    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={navigatorOptions}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            {/* <Stack.Screen name="Cart" component={Cart} /> */}
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Tabs" component={Home} />
            <Stack.Screen name="TakePhoto" component={TakePhoto} />
            <Stack.Screen name="UploadPhoto" component={UploadPhoto} />
            <Stack.Screen name="MyAlbums" component={MyAlbums} />
            <Stack.Screen name="Album" component={Album} />
        </Stack.Navigator>
    );
};

export default NavigationStack;
