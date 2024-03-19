import React from 'react';
import Layout from '../components/Layout/Layout';
import LayoutContainer from '../components/Layout/LayoutContainer';
import LayoutHeader from '../components/Layout/LayoutHeader';
import {Text, View} from 'react-native';
import {StyleSheet} from 'react-native';
import InputTextField from '../components/InputTextField';
import Button from '../components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import LayoutTop from '../components/Layout/LayoutTop';
import LayoutBackButton from '../components/Layout/LayoutBackButton';
import defaultTheme from '../themes/defaultTheme';
import {useMutation} from '@tanstack/react-query';
import {register} from '../services/auth/auth.service';
import Callout from '../components/Callout';
import {RegisterPayload} from '../types/auth';

type RegisterProps = {
    navigation: BottomTabNavigationProp<any>;
};

const styles = StyleSheet.create({
    registerView: {
        flex: 1,
        flexDirection: 'column',
        marginBottom: 30,
        gap: 10,
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
    registerForm: {
        marginTop: 20,
        gap: 5,
    },
    registerFormContent: {
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

const Register = ({navigation}: RegisterProps) => {
    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    // const dispatch = useDispatch();

    const {mutate: registerMutation} = useMutation({
        mutationFn: (data: RegisterPayload) => register(data),
        onSuccess: async data => {
            if (data.email === email) {
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
            setError(err.message);
        },
    });

    const processRegister = () => {
        setError('');

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }

        registerMutation({
            email: email,
            name: name,
            pwd: password,
        });
    };

    return (
        <Layout>
            <LayoutTop>
                <LayoutBackButton navigation={navigation} />
            </LayoutTop>
            <LayoutContainer>
                <LayoutHeader title="Cash" subTitle="Manager">
                    <Ionicons
                        name="wallet"
                        color={defaultTheme.colors.primary}
                        size={28}
                    />
                </LayoutHeader>

                <View style={styles.registerView}>
                    <View style={styles.welcome}>
                        <Text style={styles.welcomeText1}>Welcome !</Text>
                        <Text style={styles.welcomeText2}>
                            Please enter your credentials to register
                        </Text>
                    </View>

                    {error !== '' && (
                        <Callout
                            type="danger"
                            title="Error"
                            dismissablePress={() => setError('')}>
                            <Text>{error}</Text>
                        </Callout>
                    )}

                    <View style={styles.registerForm}>
                        <InputTextField
                            name="Name"
                            icon="person"
                            placeholder="Name"
                            value={name}
                            onChange={setName}
                        />
                        <InputTextField
                            name="Email"
                            icon="mail"
                            placeholder="Email"
                            value={email}
                            onChange={setEmail}
                        />
                        <InputTextField
                            name="Password"
                            icon="lock-closed"
                            placeholder="Password"
                            password
                            value={password}
                            onChange={setPassword}
                        />
                        <InputTextField
                            name="Password"
                            icon="lock-closed"
                            placeholder="Password confirmation"
                            password
                            value={passwordConfirmation}
                            onChange={setPasswordConfirmation}
                        />
                    </View>

                    <View style={styles.submit}>
                        <Button content="Register" onPress={processRegister} />
                    </View>

                    {/* <View style={styles.version}>
                        <Text style={styles.versionText}>
                            version {version}
                        </Text>
                    </View> */}
                </View>
            </LayoutContainer>
        </Layout>
    );
};

export default Register;
