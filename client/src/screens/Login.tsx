import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../../App';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        console.log("Login pressed")

        // Enhanced validation checks
        if (!email.trim()) {
            Alert.alert('Validation Error', 'Email is required');
            return;
        }

        if (!password) {
            Alert.alert('Validation Error', 'Password is required');
            return;
        }

        // Email validation
        if (!validateEmail(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address');
            return;
        }

        // Password validation
        if (!validatePassword(password)) {
            Alert.alert('Validation Error', 'Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {
            const loginData = {
                email: email.toLowerCase().trim(),
                password: password.trim(),
            };

            console.log('Login data:', { email: loginData.email, passwordLength: loginData.password.length });

            const response = await axios.post(
                'http://localhost:3001/api/auth/login',
                loginData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000, // 10 second timeout
                }
            );

            console.log('Login successful:', response.data);

            const { token, user } = response.data;

            // Store token
            await AsyncStorage.setItem("authToken", token);

            // Handle successful login
            Alert.alert(
                'Success',
                'Logged in successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Clear form
                            setEmail('');
                            setPassword('');

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
                    }
                ]
            );

        } catch (error: any) {
            console.error('Login error:', error);

            let errorMessage = 'Something went wrong. Please try again.';

            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 400) {
                    errorMessage = data.error || 'Invalid input data';
                } else if (status === 401) {
                    errorMessage = 'Invalid email or password';
                } else if (status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else {
                    errorMessage = data.error || `Error: ${status}`;
                }
            } else if (error.request) {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout. Please try again.';
            }

            Alert.alert('Login Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
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
            <View>
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
                <View style={styles.forgot}>
                    <Text style={styles.forgotText}>Forgot Password ?</Text>
                </View>
                <View style={styles.bottomSection} >
                    <Text style={styles.bottomText}>Don't have an account?</Text>
                    <Text onPress={() => navigation.navigate("Signup")} style={[styles.bottomText, { color: '#e88b5a' }]}>  Sign Up</Text>
                </View>
            </View>
        </View >
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        backgroundColor: '#FEFBF6',
        height: 750
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: '600',
        color: '#e88b5a'
    },
    topSection: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        margin: 20
    },
    topSectionHeading: {
        fontSize: 30,
        fontWeight: 600,
        color: '#E97B47',
    },
    topSectionText: {
        fontSize: 16,
        fontWeight: 600
    },
    formSection: {
        marginVertical: 40
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 600,
        marginLeft: 10,
        paddingVertical: 10
    },
    input: {
        fontSize: 14,
        fontWeight: 400,
        marginHorizontal: 15,
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        color: '#000'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e88b5a',
        padding: 12,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 20,
    },
    buttonDisabled: {
        backgroundColor: '#A8A8A8',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 700,
        color: '#fff'
    },
    forgot: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        margin: 10
    },
    forgotText: {
        fontSize: 16,
        fontWeight: 700,
        color: '#e88b5a'
    },
    bottomSection: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    bottomText: {
        fontSize: 16,
        fontWeight: 600
    }
})