import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../../App';
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from '../config';

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const Login: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Enhanced validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email.trim());
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const handleLogin = async () => {
        // Validation checks...
        if (!email.trim() || !password || !validateEmail(email) || !validatePassword(password)) {
            Alert.alert('Validation Error', 'Please check your email and password.');
            return;
        }

        setIsLoading(true);

        try {
            const loginData = {
                email: email.toLowerCase().trim(),
                password: password.trim(),
            };

            const response = await axios.post(
                `${config.apiUrl}/auth/login`,
                loginData,
                { timeout: 10000 }
            );

            const { token, user } = response.data;

            await AsyncStorage.setItem("authToken", token);
            await AsyncStorage.setItem("authUser", JSON.stringify(user));
            
            Alert.alert('Success', 'Logged in successfully!', [{
                text: 'OK',
                onPress: () => {
                    const role = user.role;
                    if (role === "owner") {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "OwnerHome", params: { token } }],
                        });
                    } else if (role === "trainer") {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "TrainerHome", params: { token } }],
                        });
                    }
                }
            }]);

        } catch (error: any) {
            let errorMessage = 'Something went wrong. Please try again.';
            if (error.response) {
                const status = error.response.status;
                if (status === 401) {
                    errorMessage = 'Invalid email or password';
                } else if (status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection.';
            }
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingContainer}
            >
                <View style={styles.contentContainer}>
                    <View style={styles.topSection}>
                        <Text style={styles.topSectionHeading}>Welcome Back</Text>
                        <Text style={styles.topSectionText}>Log in to continue</Text>
                    </View>

                    <View style={styles.formSection}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder='Enter your email'
                                placeholderTextColor={'#999'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                maxLength={254}
                                editable={!isLoading}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Enter your password'
                                value={password}
                                onChangeText={setPassword}
                                placeholderTextColor={'#999'}
                                secureTextEntry
                                maxLength={128}
                                editable={!isLoading}
                            />
                        </View>
                    </View>

                    <View style={styles.bottomContainer}>
                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Log In</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.forgot}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                        <View style={styles.bottomSection}>
                            <Text style={styles.bottomText}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                                <Text style={[styles.bottomText, { color: '#e88b5a' }]}> Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFBF6',
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
    },
    topSection: {
        alignItems: 'center',
        gap: 5,
        marginBottom: 40,
    },
    topSectionHeading: {
        fontSize: 32,
        fontWeight: '700',
        color: '#E97B47',
    },
    topSectionText: {
        fontSize: 16,
        color: '#333',
    },
    formSection: {
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#444'
    },
    input: {
        fontSize: 16,
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        color: '#000',
        borderWidth: 1,
        borderColor: '#eee'
    },
    bottomContainer: {
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e88b5a',
        paddingVertical: 15,
        borderRadius: 12,
        width: '100%',
        marginVertical: 10,
    },
    buttonDisabled: {
        backgroundColor: '#A8A8A8',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff'
    },
    forgot: {
        paddingVertical: 10,
    },
    forgotText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#e88b5a'
    },
    bottomSection: {
        flexDirection: 'row',
        marginTop: 20,
    },
    bottomText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333'
    }
})
