import React from 'react';
import Layout from '../components/Layout/Layout';
import LayoutContainer from '../components/Layout/LayoutContainer';
import LayoutHeader from '../components/Layout/LayoutHeader';
import {Keyboard, Text, TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native';
import InputTextField from '../components/InputTextField';
import Button from '../components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import SeparatorText from '../components/SeparatorText';
import LayoutTop from '../components/Layout/LayoutTop';
import LayoutSettingsButton from '../components/Layout/LayoutSettingsButton';
import defaultTheme from '../themes/defaultTheme';
import {useMutation} from '@tanstack/react-query';
import {login} from '../services/auth/auth.service';
import Callout from '../components/Callout';
import {useDispatch} from 'react-redux';
import {LoginPayload} from '../types/auth';

type LoginProps = {
    navigation: BottomTabNavigationProp<any>;
};

const styles = StyleSheet.create({
    loginView: {
        flex: 1,
        flexDirection: 'column',
    },
    welcome: {
        width: '100%',
    },
    welcomeText1: {
        fontSize: defaultTheme.fontSize.large,
        color: 'black',
    },
    welcomeText2: {
        fontSize: defaultTheme.fontSize.normal,
        color: 'gray',
    },
    loginForm: {
        marginTop: 50,
        gap: 20,
    },
    submit: {
        marginTop: 50,
    },
    version: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    versionText: {
        color: 'gray',
        fontSize: defaultTheme.fontSize.normal,
    },
});

const Login = ({navigation}: LoginProps) => {
    const [username, setUsername] = React.useState('test@gmail.com');
    const [password, setPassword] = React.useState('test');
    const [error, setError] = React.useState('');

    const {mutate: loginMutation, isPending: isLoginPending} = useMutation({
        mutationFn: (loginPayload: LoginPayload) => login(loginPayload),
        onSuccess: async data => {
            if (data.email === username) {
                // dispatch(accessTokenChanged(data.access_token));
                try {
                    // const profile = await getProfile(data.access_token);
                    // dispatch(userProfileChanged(profile));
                    navigation.reset({
                        index: 0,
                        routes: [{name: 'Tabs'}],
                    });
                } catch (err: any) {
                    setError(err.message);
                }
            }
        },
        onError: err => {
            console.log(err);

            setError(err.message);
        },
    });

    const processLogin = () => {
        setError('');
        loginMutation({email: username, pwd: password});
    };

    const redirectRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <Layout>
            <LayoutTop>
                <LayoutSettingsButton navigation={navigation} />
            </LayoutTop>
            <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
                <LayoutContainer>
                    <LayoutHeader title="Image" subTitle="Compressor">
                        <Ionicons
                            name="wallet"
                            color={defaultTheme.colors.primary}
                            size={28}
                        />
                    </LayoutHeader>

                    <View style={styles.loginView}>
                        <View style={styles.welcome}>
                            <Text style={styles.welcomeText1}>
                                Welcome back !
                            </Text>
                            <Text style={styles.welcomeText2}>
                                Please enter your username and password
                            </Text>
                        </View>

                        <View style={styles.loginForm}>
                            {error !== '' && (
                                <Callout
                                    type="danger"
                                    title="Error"
                                    dismissablePress={() => setError('')}>
                                    <Text>{error}</Text>
                                </Callout>
                            )}

                            <InputTextField
                                name="Username"
                                icon="person"
                                placeholder="Username"
                                value={username}
                                onChange={setUsername}
                            />
                            <InputTextField
                                name="Password"
                                icon="lock-closed"
                                placeholder="Password"
                                password
                                value={password}
                                onChange={setPassword}
                            />
                        </View>

                        <View style={styles.submit}>
                            <Button
                                content="Log in"
                                onPress={processLogin}
                                loading={isLoginPending}
                            />
                        </View>

                        <View>
                            <SeparatorText
                                content="You don't have an account ?"
                                verticalSpace={30}
                            />
                            <Button
                                content="Register"
                                onPress={redirectRegister}
                                color="black"
                                textColor="white"
                            />
                        </View>

                        {/* <View style={styles.version}>
                            <Text style={styles.versionText}>
                                version {version}
                            </Text>
                        </View> */}
                    </View>
                </LayoutContainer>
            </TouchableOpacity>
        </Layout>
    );
};

export default Login;
