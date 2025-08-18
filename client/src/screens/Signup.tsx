import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

// Constants for consistent styling
const PRIMARY = '#E97B47';
const BG = '#FEFBF6';
const INPUT_BORDER = '#E0E0E0';
const PLACEHOLDER = "#85929E";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const Signup: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [roleId, setRoleId] = useState<string | undefined>();
    const [phone, setPhone] = useState('');
    const [zipCode, setZipCode] = useState('');

    const handleSignUp = async () => {
        // Validation logic remains unchanged for correctness
        if (!firstName || !lastName || !email || !password || !phone || !zipCode || !roleId) {
            Alert.alert('Validation Error', 'Please fill all fields');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Validation Error', 'Password must be at least 6 characters long');
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            Alert.alert('Validation Error', 'Phone must be a 10-digit number');
            return;
        }
        if (!/^\d{5,6}$/.test(zipCode)) {
            Alert.alert('Validation Error', 'Zip code must be 5 or 6 digits');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:3001/api/auth/signup", {
                firstName, lastName, email, password, phone, zipCode, role: roleId
            });

            const token: string | undefined = response?.data?.token;
            if (!token) {
                Alert.alert('Signup Succeeded', 'No token returned. Please log in.');
                navigation.replace('Login');
                return;
            }

            Alert.alert('Success', 'Account created successfully!', [{
                text: 'OK',
                onPress: () => {
                    // clear
                    setFirstName(''); setLastName(''); setEmail(''); setPassword('');
                    setPhone(''); setZipCode(''); setRoleId(undefined);
                    // ✅ go to UploadPhoto with token
                    navigation.replace('UploadPhoto', { token });
                }
            }]);

        } catch (error: any) {
            let errorMessage = 'An unexpected error occurred. Please try again.';
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                if (status === 400) errorMessage = data.error || 'Invalid input data';
                else if (status === 409) errorMessage = 'An account with this email already exists';
                else if (status === 500) errorMessage = 'Server error. Please try again later.';
                else errorMessage = data.error || `Error: ${status}`;
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }
            Alert.alert('Signup Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join Woof Point today!</Text>

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="First name"
                                placeholderTextColor={PLACEHOLDER}
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Last name"
                                placeholderTextColor={PLACEHOLDER}
                                value={lastName}
                                onChangeText={setLastName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={PLACEHOLDER}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={PLACEHOLDER}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="10-digit phone"
                                placeholderTextColor={PLACEHOLDER}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Zip/Postal code"
                                placeholderTextColor={PLACEHOLDER}
                                value={zipCode}
                                onChangeText={setZipCode}
                                keyboardType="number-pad"
                            />
                        </View>

                        <Text style={styles.roleTitle}>I am a:</Text>
                        <View style={styles.roleContainer}>
                            <TouchableOpacity
                                onPress={() => setRoleId("owner")}
                                style={[styles.roleButton, roleId === "owner" && styles.roleButtonActive]}
                            >
                                <Text style={[styles.roleText, roleId === "owner" && styles.roleTextActive]}>Dog Owner</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setRoleId("trainer")}
                                style={[styles.roleButton, roleId === "trainer" && styles.roleButtonActive]}
                            >
                                <Text style={[styles.roleText, roleId === "trainer" && styles.roleTextActive]}>Dog Trainer</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                            onPress={handleSignUp}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.signupButtonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: PRIMARY
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#888',
        marginBottom: 30,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#F7F7F7',
        borderWidth: 1,
        borderColor: INPUT_BORDER,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 12,
        fontSize: 14,
    },
    roleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        marginBottom: 10,
        textAlign: 'center',
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 14,
        marginHorizontal: 5,
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    roleButtonActive: {
        backgroundColor: PRIMARY,
        borderColor: PRIMARY,
    },
    roleText: {
        color: '#555',
        fontWeight: '600',
        fontSize: 15,
    },
    roleTextActive: {
        color: '#fff',
    },
    signupButton: {
        backgroundColor: PRIMARY,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    signupButtonDisabled: {
        backgroundColor: '#A8A8A8',
    },
    signupButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});