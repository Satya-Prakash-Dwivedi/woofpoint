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

    // Enhanced validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email.trim());
    };

    const validatePassword = (password: string): { isValid: boolean; message?: string } => {
        if (password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long' };
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one lowercase letter' };
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one uppercase letter' };
        }
        if (!/(?=.*\d)/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one number' };
        }
        return { isValid: true };
    };

    const validateName = (name: string): boolean => {
        return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name.trim());
    };

    const validatePhone = (phone: string): boolean => {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length === 10;
    };

    const validateZipCode = (zipCode: string): boolean => {
        const cleanZip = zipCode.replace(/\D/g, '');
        return cleanZip.length >= 5 && cleanZip.length <= 6;
    };

    const handleSignUp = async () => {
        // Comprehensive validation
        if (!firstName.trim()) {
            Alert.alert('Validation Error', 'First name is required');
            return;
        }
        if (!validateName(firstName)) {
            Alert.alert('Validation Error', 'First name must be at least 2 characters and contain only letters, spaces, hyphens, and apostrophes');
            return;
        }

        if (!lastName.trim()) {
            Alert.alert('Validation Error', 'Last name is required');
            return;
        }
        if (!validateName(lastName)) {
            Alert.alert('Validation Error', 'Last name must be at least 2 characters and contain only letters, spaces, hyphens, and apostrophes');
            return;
        }

        if (!email.trim()) {
            Alert.alert('Validation Error', 'Email is required');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address');
            return;
        }

        if (!password) {
            Alert.alert('Validation Error', 'Password is required');
            return;
        }
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            Alert.alert('Validation Error', passwordValidation.message || 'Invalid password');
            return;
        }

        if (!phone.trim()) {
            Alert.alert('Validation Error', 'Phone number is required');
            return;
        }
        if (!validatePhone(phone)) {
            Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number');
            return;
        }

        if (!zipCode.trim()) {
            Alert.alert('Validation Error', 'Zip code is required');
            return;
        }
        if (!validateZipCode(zipCode)) {
            Alert.alert('Validation Error', 'Zip code must be 5 or 6 digits');
            return;
        }

        if (!roleId) {
            Alert.alert('Validation Error', 'Please select whether you are a Dog Owner or Dog Trainer');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:3001/api/auth/signup", {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.toLowerCase().trim(),
                password,
                phone: phone.replace(/\D/g, ''), // Clean phone number
                zipCode: zipCode.replace(/\D/g, ''), // Clean zip code
                role: roleId
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
                    navigation.navigate("UploadPhoto", {
                        token: response.data.token,
                        role: roleId as "owner" | "trainer",
                    });
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
                                maxLength={50}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Last name"
                                placeholderTextColor={PLACEHOLDER}
                                value={lastName}
                                onChangeText={setLastName}
                                maxLength={50}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={PLACEHOLDER}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                maxLength={100}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)"
                                placeholderTextColor={PLACEHOLDER}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                maxLength={50}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="10-digit phone"
                                placeholderTextColor={PLACEHOLDER}
                                value={phone}
                                onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Zip/Postal code"
                                placeholderTextColor={PLACEHOLDER}
                                value={zipCode}
                                onChangeText={(text) => setZipCode(text.replace(/[^0-9]/g, ''))}
                                keyboardType="number-pad"
                                maxLength={6}
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