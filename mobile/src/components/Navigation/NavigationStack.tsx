import React from 'react';
import {
    StackNavigationOptions,
    createStackNavigator,
} from '@react-navigation/stack';
import Cart from '../../views/Cart';
import NavigationBar from './NavigationTab';
import Login from '../../views/Login';
import Register from '../../views/Register';
import Settings from '../../views/Settings';
import TakePhoto from '../../views/TakePhoto';
import Home from '../../views/Home';

interface screenOptionsProps {
    route: {
        name: string;
    };
}

export type NavigationStackParamList = {
    Login: undefined;
    Register: undefined;
    Cart: undefined;
    Settings: undefined;
    Tabs: undefined;
    QR: undefined;
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
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Tabs" component={Home} />
            <Stack.Screen name="QR" component={TakePhoto} />
        </Stack.Navigator>
    );
};

export default NavigationStack;
