import React, { useMemo, useState } from 'react';
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
    Image,
    Alert,
} from 'react-native';
import axios from 'axios';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { launchImageLibrary, Asset } from "react-native-image-picker";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UploadButton from '../components/UploadButton';

// Maybe get this from your theme or branding configuration
const PRIMARY = '#E97B47';
const CARD_BG = '#FFF';
const BG = '#FEFBF6';
const INPUT_BORDER = '#F8F9FA';
const PLACEHOLDER = "#85929E"

const roleIcons: Record<string, string> = {
    owner: 'dog',
    trainer: 'dog-service'
};

const Signup: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [roleId, setRoleId] = useState<string | undefined>();
    const [phone, setPhone] = useState<string>('');
    const [zipCode, setZipCode] = useState<string>('');
    const [profilePhoto, setProfilePhoto] = useState<Asset | null>(null);

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (!response.didCancel && !response.errorCode) {
                const selected = response.assets?.[0];
                if (selected) {
                    setProfilePhoto(selected);
                }
            }
        });
    };

    const handleSignUp = async () => {
        if (!firstName || !lastName || !email || !password || !phone || !zipCode || !roleId || !profilePhoto) {
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

        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('zipCode', zipCode);
        formData.append('role', roleId!);
        formData.append('profilePhoto', {
            uri: profilePhoto.uri,
            name: profilePhoto.fileName || 'profile.jpg',
            type: profilePhoto.type || 'image/jpeg',
        } as any);

        try {
            const response = await axios.post(
                'http://localhost:3001/api/auth/signup',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            Alert.alert(
                'Success',
                'Account created successfully!',
                [{
                    text: 'OK', onPress: () => {
                        setFirstName('');
                        setLastName('');
                        setEmail('');
                        setPassword('');
                        setPhone('');
                        setZipCode('');
                        setProfilePhoto(null);
                        // Navigate to login or dashboard if you want
                    }
                }]
            );
        } catch (error: any) {
            let errorMessage = 'An unexpected error occurred. Please try again.';
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                if (status === 400) errorMessage = data.message || 'Invalid input data';
                else if (status === 409) errorMessage = 'An account with this email already exists';
                else if (status === 500) errorMessage = 'Server error. Please try again later.';
                else errorMessage = data.message || `Error: ${status}`;
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }
            Alert.alert('Signup Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Role buttons with icons as JSX
    const roleButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: '1',
            label: 'Dog Owner',
            value: 'owner',
            color: PRIMARY,
            labelStyle: styles.roleLabel,
            containerStyle: [
                styles.roleCard,
                roleId === 'owner' && styles.roleCardSelected
            ],
            // Custom: Show icon in label
            // You will inject the icon manually below!
        },
        {
            id: '2',
            label: 'Dog Trainer',
            value: 'trainer',
            color: PRIMARY,
            labelStyle: styles.roleLabel,
            containerStyle: [
                styles.roleCard,
                roleId === 'trainer' && styles.roleCardSelected
            ],
        }
    ]), [roleId]);

    const handleLogin = () => {
        // navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.content}>

                        {/* Page Title */}
                        <View style={styles.topContent}>
                            <Image source={{
                                uri: 'https://cdn-icons-png.freepik.com/512/12436/12436575.png'
                            }} style={{ width: 30, height: 30 }}
                            />
                            <Text style={styles.welcomeTitle}>
                                Create Account
                            </Text>
                        </View>
                        <Text style={styles.welcomeSubtitle}>
                            Join Woof Point today!
                        </Text>



                        {/* Role Section */}
                        <View style={styles.sectionCard}>
                            <View style={styles.subTopContent}>
                                <Image source={{ uri: 'https://cdn-icons-png.freepik.com/512/9850/9850178.png' }} style={{ width: 20, height: 20 }} />
                                <Text style={styles.sectionTitle}>
                                    Role
                                </Text>
                            </View>
                            <View style={styles.roleRow}>
                                {["owner", "trainer"].map((role, idx) => (
                                    <TouchableOpacity
                                        key={role}
                                        style={[
                                            styles.roleCard,
                                            roleId === role && styles.roleCardSelected
                                        ]}
                                        onPress={() => setRoleId(role)}
                                        activeOpacity={0.85}
                                    >
                                        {/* <Image source={{ uri: "https://e7.pngegg.com/pngimages/924/504/png-clipart-dog-paw-computer-icons-paw-print-animals-orange.png" }} style={{ width: 20, height: 20, borderRadius: 20 }} /> */}
                                        <Text style={[
                                            styles.roleLabel,
                                            roleId === role && { color: PRIMARY }
                                        ]}>
                                            {role === 'owner' ? 'Dog Owner' : 'Dog Trainer'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Form Card */}
                        <View style={styles.sectionCard}>
                            {/* Profile Image */}
                            <View style={styles.avatarSection}>
                                <TouchableOpacity onPress={selectImage} style={styles.avatarCircle}>
                                    {profilePhoto?.uri
                                        ? (<Image source={{ uri: profilePhoto.uri }} style={styles.avatarImg} />)
                                        : (<Icon name="camera-plus" size={36} color={PRIMARY} />)}
                                </TouchableOpacity>
                                <Text style={styles.avatarLabel}>Profile Photo</Text>
                            </View>
                            {/* Inputs */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    placeholder="First name"
                                    placeholderTextColor={PLACEHOLDER}
                                    autoCapitalize="words"
                                    autoComplete="name"
                                    editable={!isLoading}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    placeholder="Last name"
                                    placeholderTextColor={PLACEHOLDER}
                                    autoCapitalize="words"
                                    autoComplete="name"
                                    editable={!isLoading}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Email"
                                    placeholderTextColor={PLACEHOLDER}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    editable={!isLoading}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Password"
                                    placeholderTextColor={PLACEHOLDER}
                                    secureTextEntry
                                    autoComplete="new-password"
                                    editable={!isLoading}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="10-digit phone"
                                    placeholderTextColor={PLACEHOLDER}
                                    keyboardType="phone-pad"
                                    autoComplete="tel"
                                    maxLength={10}
                                    editable={!isLoading}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={zipCode}
                                    onChangeText={setZipCode}
                                    placeholder="Zip/Postal code"
                                    placeholderTextColor={PLACEHOLDER}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    editable={!isLoading}
                                />
                            </View>
                            {/* Upload Button (Optional if you want separate from avatar above) */}
                            <UploadButton selectImage={selectImage} />
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

                        {/* Terms Card */}
                        <View style={styles.termsSection}>
                            <Text style={styles.termsText}>
                                By creating an account, you agree to our{' '}
                                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                                <Text style={styles.termsLink}>Privacy Policy</Text>
                            </Text>
                        </View>

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

const styles = StyleSheet.create({
    topContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5
    },
    subTopContent: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
        margin: 10
    },
    container: {
        flex: 1,
        backgroundColor: BG,
    },
    keyboardAvoid: { flex: 1 },
    scrollContent: { flexGrow: 1 },

    content: {
        flex: 1,
        paddingHorizontal: 22,
        paddingBottom: 32,
        marginTop: 10,
    },

    welcomeTitle: {
        fontSize: 30,
        fontWeight: '800',
        color: '#2C3E50',
        textAlign: 'center',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    welcomeSubtitle: {
        fontSize: 17,
        color: '#5D6D7E',
        textAlign: 'center',
        marginBottom: 22,
        letterSpacing: 0.1,
    },

    sectionCard: {
        backgroundColor: CARD_BG,
        borderRadius: 18,
        padding: 18,
        marginBottom: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: PRIMARY,
        marginBottom: 10,
        flexDirection: 'row'
    },

    // Role Selection
    roleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    roleCard: {
        flex: 1,
        backgroundColor: '#F4E8DF',
        borderRadius: 14,
        alignItems: 'center',
        marginHorizontal: 8,
        paddingVertical: 14,
        borderWidth: 2,
        borderColor: 'transparent',
        elevation: 0,
        minWidth: 120,
    },
    roleCardSelected: {
        borderColor: PRIMARY,
        backgroundColor: '#FFD3B6',
        elevation: 3,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.19,
        shadowRadius: 6,
    },
    roleLabel: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 2,
        color: '#444',
    },


    // Upload/Avatar
    avatarSection: {
        alignItems: 'center',
        marginBottom: 14,
    },
    avatarCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: PRIMARY,
        marginBottom: 5,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        elevation: 6,
    },
    avatarImg: {
        width: '96%',
        height: '96%',
        borderRadius: 100,
        resizeMode: 'cover',
    },
    avatarLabel: {
        fontSize: 13,
        color: PLACEHOLDER,
        fontWeight: '500',
    },

    // Inputs
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FBFBFB',
        borderRadius: 12,
        borderWidth: 1.3,
        borderColor: INPUT_BORDER,
        marginBottom: 16,
        paddingLeft: 12,
        shadowColor: '#333',
        shadowOpacity: 0.025,
        shadowOffset: { width: 0, height: 1 },
        elevation: 0.5,
    },
    iconLeft: {
        marginRight: 6,
        opacity: 0.80,
    },
    input: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 5,
        paddingVertical: 12,
        fontSize: 16,
        color: '#2C3E50',
    },

    signupButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: PRIMARY,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 18,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 5,
    },
    signupButtonDisabled: {
        backgroundColor: '#FFCBA2',
        opacity: 0.7,
    },
    signupButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.13,
    },

    // Terms
    termsSection: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        marginBottom: 24,
    },
    termsText: {
        fontSize: 13,
        color: PLACEHOLDER,
        textAlign: 'center',
        lineHeight: 19,
    },
    termsLink: {
        color: PRIMARY,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },

    // Login 
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 15.5,
        color: '#5D6D7E',
    },
    loginLink: {
        fontSize: 15.5,
        color: PRIMARY,
        fontWeight: '600',
    }
});
