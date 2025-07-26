import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Modal,
    FlatList,
    Alert, // Added for error handling
} from 'react-native';
import axios from 'axios';

// Define types for role selection
type UserRole = 'owner' | 'trainer' | '';

interface RoleOption {
    label: string;
    value: 'owner' | 'trainer';
}

interface RoleDropdownProps {
    selectedRole: UserRole;
    onRoleChange: (role: UserRole) => void;
}

// Role Dropdown Component
const RoleDropdown: React.FC<RoleDropdownProps> = ({ selectedRole, onRoleChange }) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const roles: RoleOption[] = [
        { label: 'Dog Owner', value: 'owner' },
        { label: 'Dog Trainer', value: 'trainer' },
    ];

    const handleRoleSelect = (role: RoleOption) => {
        onRoleChange(role.value);
        setIsVisible(false);
    };

    const getDisplayText = (): string => {
        if (!selectedRole) return 'Select your role';
        const role = roles.find(r => r.value === selectedRole);
        return role ? role.label : 'Select your role';
    };

    return (
        <View style={roleStyles.container}>
            <Text style={roleStyles.label}>Role</Text>

            <TouchableOpacity
                style={roleStyles.dropdown}
                onPress={() => setIsVisible(true)}
            >
                <Text style={[
                    roleStyles.dropdownText,
                    !selectedRole && roleStyles.placeholderText
                ]}>
                    {getDisplayText()}
                </Text>
                <Text style={roleStyles.arrow}>▼</Text>
            </TouchableOpacity>

            <Modal
                visible={isVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsVisible(false)}
            >
                <TouchableOpacity
                    style={roleStyles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsVisible(false)}
                >
                    <View style={roleStyles.modalContent}>
                        <FlatList
                            data={roles}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={roleStyles.roleOption}
                                    onPress={() => handleRoleSelect(item)}
                                >
                                    <Text style={roleStyles.roleText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const Signup: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<UserRole>('');
    const [isLoading, setIsLoading] = useState<boolean>(false); // Added loading state

    const handleSignUp = async () => {
        // Validation check
        if (!firstName || !lastName || !email || !password || !role) {
            Alert.alert('Validation Error', 'Please fill all fields');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address');
            return;
        }

        // Password validation (minimum 6 characters)
        if (password.length < 6) {
            Alert.alert('Validation Error', 'Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {
            const signupData = {
                firstName,
                lastName,
                email: email.toLowerCase().trim(),
                password,
                role
            };

            console.log('Sending signup data:', signupData);

            const response = await axios.post(
                'http://localhost:3001/api/auth/signup',
                signupData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000, // 10 second timeout
                }
            );

            console.log('Signup successful:', response.data);

            // Handle successful signup
            Alert.alert(
                'Success',
                'Account created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Clear form
                            setFirstName('');
                            setLastName('');
                            setEmail('');
                            setPassword('');
                            setRole('');

                            // Navigate to login or dashboard
                            // navigation.navigate('Login'); // Uncomment when using navigation
                        }
                    }
                ]
            );

        } catch (error: any) {
            console.error('Signup error:', error);

            let errorMessage = 'An unexpected error occurred. Please try again.';

            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const data = error.response.data;

                if (status === 400) {
                    errorMessage = data.message || 'Invalid input data';
                } else if (status === 409) {
                    errorMessage = 'An account with this email already exists';
                } else if (status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else {
                    errorMessage = data.message || `Error: ${status}`;
                }
            } else if (error.request) {
                // Network error
                errorMessage = 'Network error. Please check your connection and try again.';
            }

            Alert.alert('Signup Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = (newRole: UserRole) => {
        setRole(newRole);
    };

    const handleLogin = () => {
        console.log('Login pressed');
        // Navigate to login screen
        // navigation.navigate('Login'); // Uncomment when using navigation
    };

    const handleBack = () => {
        console.log('Back pressed');
        // Navigate back to landing screen
        // navigation.goBack(); // Uncomment when using navigation
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        {/* <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Text style={styles.backButtonText}>←</Text>
                        </TouchableOpacity> */}
                        <Text style={styles.headerTitle}>Sign Up</Text>
                        <View style={styles.headerSpacer} />
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={styles.welcomeTitle}>Create Account</Text>
                        <Text style={styles.welcomeSubtitle}>Join Woof Point today</Text>

                        {/* Form */}
                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>First Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    placeholder="Enter your first name"
                                    placeholderTextColor="#85929E"
                                    autoCapitalize="words"
                                    autoComplete="name"
                                    editable={!isLoading}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Last Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    placeholder="Enter your last name"
                                    placeholderTextColor="#85929E"
                                    autoCapitalize="words"
                                    autoComplete="name"
                                    editable={!isLoading}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#85929E"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    editable={!isLoading}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Create a password"
                                    placeholderTextColor="#85929E"
                                    secureTextEntry
                                    autoComplete="new-password"
                                    editable={!isLoading}
                                />
                            </View>

                            {/* Role Selection Dropdown */}
                            <View style={styles.inputContainer}>
                                <RoleDropdown
                                    selectedRole={role}
                                    onRoleChange={handleRoleChange}
                                />
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.signupButton,
                                    isLoading && styles.signupButtonDisabled
                                ]}
                                onPress={handleSignUp}
                                disabled={isLoading}
                            >
                                <Text style={styles.signupButtonText}>
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Terms */}
                        <Text style={styles.termsText}>
                            By creating an account, you agree to our{' '}
                            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                            <Text style={styles.termsLink}>Privacy Policy</Text>
                        </Text>

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={handleLogin}>
                                <Text style={styles.loginLink}>Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Signup;

// Role Dropdown Styles
const roleStyles = StyleSheet.create({
    container: {
        marginBottom: 0,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#F8F9FA',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    dropdownText: {
        fontSize: 16,
        color: '#2C3E50',
    },
    placeholderText: {
        color: '#85929E',
    },
    arrow: {
        fontSize: 12,
        color: '#85929E',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        minWidth: 250,
        maxHeight: 200,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    roleOption: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F8F9FA',
    },
    roleText: {
        fontSize: 16,
        color: '#2C3E50',
        fontWeight: '500',
    },
});

// Updated styles with loading state
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFBF6',
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 32,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    backButtonText: {
        fontSize: 20,
        color: '#2C3E50',
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '600',
        color: '#2C3E50',
        textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    welcomeTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2C3E50',
        textAlign: 'center',
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 20,
        color: '#5D6D7E',
        textAlign: 'center',
        marginBottom: 48,
    },
    form: {
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: '#2C3E50',
        borderWidth: 1,
        borderColor: '#F8F9FA',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    signupButton: {
        backgroundColor: '#E97B47',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#E97B47',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    signupButtonDisabled: {
        backgroundColor: '#BDC3C7',
        shadowOpacity: 0.1,
    },
    signupButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.1,
    },
    termsText: {
        fontSize: 14,
        color: '#85929E',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    termsLink: {
        color: '#E97B47',
        fontWeight: '500',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
        color: '#5D6D7E',
    },
    loginLink: {
        fontSize: 16,
        color: '#E97B47',
        fontWeight: '600',
    },
});