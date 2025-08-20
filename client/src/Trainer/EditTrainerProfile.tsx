import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TrainerProfile {
    firstName: string;
    lastName: string;
    phone: string;
    zipCode: string;
    specialization: string;
    bio: string;
    experience: string;
}

interface Props {
    navigation: any; // You can type this more specifically if using TypeScript with React Navigation
}

const EditTrainerProfile: React.FC<Props> = ({ navigation }) => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        zipCode: "",
        specialization: "",
        bio: "",
        experience: "",
    });

    // Go back function
    const goBack = () => {
        if (navigation && navigation.goBack) {
            navigation.goBack();
        }
    };

    // Fetch trainer profile on mount
    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            console.log("Token from storage:", token); // ✅ Check

            if (!token) {
                Alert.alert("Error", "No token found. Please log in again.");
                return;
            }

            const response = await axios.get("http://localhost:3001/api/trainer/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Fetched trainer profile:", response.data); // ✅ Debug
            setForm(response.data);
        } catch (err: any) {
            console.error("Profile fetch error:", err.response?.data || err.message);
            Alert.alert("Error", "Failed to fetch profile.");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (field: keyof TrainerProfile, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) return;

            const response = await axios.put(
                "http://localhost:3001/api/trainer/profile",
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert(
                "Success",
                "Profile updated!",
                [
                    {
                        text: "OK",
                        onPress: () => goBack() // Navigate back after user acknowledges success
                    }
                ]
            );
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Update failed.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* iOS-style Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={goBack}
                        style={styles.backButton}
                    >
                        {/* Custom back arrow using Text */}
                        <Text style={styles.backArrow}>‹</Text>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.heading}>Edit Profile</Text>
                    {/* Spacer to center the title */}
                    <View style={{ width: 60 }} />
                </View>

                <ScrollView
                    style={styles.formContainer}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {(
                        [
                            { label: "First Name", field: "firstName" },
                            { label: "Last Name", field: "lastName" },
                            { label: "Phone", field: "phone", keyboardType: "phone-pad" },
                            { label: "ZIP Code", field: "zipCode", keyboardType: "number-pad" },
                            { label: "Specialization", field: "specialization" },
                            { label: "Bio", field: "bio", multiline: true },
                            { label: "Experience (Years)", field: "experience", keyboardType: "numeric" },
                        ] as any[]
                    ).map(({ label, field, keyboardType, multiline }) => (
                        <View key={field} style={styles.inputGroup}>
                            <Text style={styles.label}>{label}</Text>
                            <TextInput
                                style={[styles.input, multiline && styles.multilineInput]}
                                value={form[field as keyof TrainerProfile]}
                                onChangeText={(text) => handleChange(field as keyof TrainerProfile, text)}
                                placeholder={`Enter ${label}`}
                                placeholderTextColor="#C7C7CC"
                                keyboardType={keyboardType}
                                multiline={multiline}
                                returnKeyType="done"
                            />
                        </View>
                    ))}

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F7F7F7",
    },
    container: {
        flex: 1,
        backgroundColor: "#F7F7F7",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 0 : 20,
        paddingBottom: 10,
        backgroundColor: "#F7F7F7",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E0E0E0",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 10,
        paddingVertical: 5,
    },
    backArrow: {
        fontSize: 28,
        color: "#E97B47",
        fontWeight: "300",
        marginRight: 4,
        marginTop: -2, // Slight adjustment for better alignment
    },
    backText: {
        fontSize: 16,
        color: "#E97B47",
        fontWeight: "400",
    },
    heading: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333",
        flex: 1,
        textAlign: "center",
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingVertical: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
        color: "#555",
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#E0E0E0",
        fontSize: 16,
        color: "#000",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    multilineInput: {
        height: 120,
        textAlignVertical: "top",
    },
    saveButton: {
        backgroundColor: "#E97B47",
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        shadowColor: "#E97B47",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default EditTrainerProfile;