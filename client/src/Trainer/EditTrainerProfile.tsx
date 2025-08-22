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
    Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TrainerProfile {
    firstName: string;
    lastName: string;
    phone: string;
    zipCode: string;
    yearsOfExperience: string;
    bio: string;
    profilePhoto?: string;
    certifications: string[];
    services: { type: string; description: string; duration: number; price: number }[];
    location: { address: string; city: string; state: string };
    specializations: string[];
}

interface Props {
    navigation: any;
}

const EditTrainerProfile: React.FC<Props> = ({ navigation }) => {
    const [form, setForm] = useState<TrainerProfile>({
        firstName: "",
        lastName: "",
        phone: "",
        zipCode: "",
        specializations: [""],
        bio: "",
        yearsOfExperience: "",
        profilePhoto: "",
        certifications: [""],
        services: [{ type: "", description: "", duration: 0, price: 0 }],
        location: { address: "", city: "", state: "" },
    });

    const goBack = () => {
        if (navigation && navigation.goBack) navigation.goBack();
    };

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                Alert.alert("Error", "No token found. Please log in again.");
                return;
            }

            const response = await axios.get("http://localhost:3001/api/trainer/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = response.data;

            setForm({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                phone: data.phone || "",
                zipCode: data.zipCode || "",
                bio: data.portfolio?.bio || "",
                yearsOfExperience: data.businessInfo?.yearsOfExperience?.toString() || "",
                profilePhoto: data.profilePhoto || "",
                certifications: (data.businessInfo?.certifications || []).map((c: any) => c.name),
                services: data.services || [{ type: "", description: "", duration: 0, price: 0 }],
                location: data.location || { address: "", city: "", state: "" },
                specializations: data.portfolio?.specializations || [],
            });
        } catch (err: any) {
            console.error("Profile fetch error:", err.response?.data || err.message);
            Alert.alert("Error", "Failed to fetch profile.");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (field: keyof TrainerProfile, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) return;

            await axios.put(
                "http://localhost:3001/api/trainer/profile",
                {
                    ...form,
                    bio: form.bio,
                    services: form.services,
                    yearsOfExperience: Number(form.yearsOfExperience),
                    certifications: form.certifications.map((name) => ({ name })),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert("Success", "Profile updated!", [{ text: "OK", onPress: () => goBack() }]);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Update failed.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={goBack} style={styles.backButton}>
                        <Text style={styles.backArrow}>‹</Text>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.heading}>Edit Profile</Text>
                    <View style={{ width: 60 }} />
                </View>

                <ScrollView style={styles.formContainer} contentContainerStyle={styles.scrollContent}>
                    {/* Profile Photo */}
                    <View style={styles.photoContainer}>
                        {form.profilePhoto ? (
                            <Image source={{ uri: form.profilePhoto }} style={styles.profilePhoto} />
                        ) : (
                            <View style={[styles.profilePhoto, styles.placeholder]}>
                                <Text style={styles.placeholderText}>
                                    {form.firstName ? form.firstName.charAt(0).toUpperCase() : "?"}
                                </Text>
                            </View>
                        )}
                        <Text style={styles.photoLabel}>Profile Photo</Text>
                    </View>

                    {/* Basic Info */}
                    {[
                        { label: "First Name", field: "firstName" },
                        { label: "Last Name", field: "lastName" },
                        { label: "Phone", field: "phone", keyboardType: "phone-pad" },
                        { label: "ZIP Code", field: "zipCode", keyboardType: "number-pad" },
                        { label: "Bio", field: "bio", multiline: true },
                        { label: "Experience (Years)", field: "yearsOfExperience", keyboardType: "numeric" },
                    ].map(({ label, field, multiline }) => (
                        <View key={field} style={styles.inputGroup}>
                            <Text style={styles.label}>{label}</Text>
                            <TextInput
                                style={[styles.input, multiline && styles.multilineInput]}
                                value={(form as any)[field] || ""}
                                onChangeText={(text) => handleChange(field as keyof TrainerProfile, text)}
                                placeholder={`Enter ${label}`}
                                placeholderTextColor="#C7C7CC"
                                multiline={multiline}
                            />
                        </View>
                    ))}

                    {/* Certifications */}
                    <Text style={styles.sectionTitle}>Certifications</Text>
                    {form.certifications?.map((cert, idx) => (
                        <TextInput
                            key={idx}
                            style={styles.input}
                            value={cert}
                            onChangeText={(text) => {
                                const updated = [...form.certifications];
                                updated[idx] = text;
                                handleChange("certifications", updated);
                            }}
                            placeholder="Enter Certification"
                        />
                    ))}
                    <TouchableOpacity
                        onPress={() => handleChange("certifications", [...form.certifications, ""])}
                        style={styles.addButton}
                    >
                        <Text style={styles.addButtonText}>+ Add Certification</Text>
                    </TouchableOpacity>

                    {/* Services */}
                    <Text style={styles.sectionTitle}>Services</Text>
                    {form.services?.map((service, idx) => (
                        <View key={idx} style={styles.serviceBlock}>
                            <TextInput
                                style={styles.input}
                                placeholder="Service Name"
                                value={service.type}
                                onChangeText={(t) => {
                                    const updated = [...form.services];
                                    updated[idx].type = t;
                                    handleChange("services", updated);
                                }}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Description"
                                value={service.description}
                                onChangeText={(t) => {
                                    const updated = [...form.services];
                                    updated[idx].description = t;
                                    handleChange("services", updated);
                                }}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Duration (mins)"
                                keyboardType="numeric"
                                value={service.duration.toString()}
                                onChangeText={(t) => {
                                    const updated = [...form.services];
                                    updated[idx].duration = Number(t);
                                    handleChange("services", updated);
                                }}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Price"
                                keyboardType="numeric"
                                value={service.price.toString()}
                                onChangeText={(t) => {
                                    const updated = [...form.services];
                                    updated[idx].price = Number(t);
                                    handleChange("services", updated);
                                }}
                            />
                        </View>
                    ))}
                    <TouchableOpacity
                        onPress={() =>
                            handleChange("services", [
                                ...form.services,
                                { type: "", description: "", duration: 0, price: 0 },
                            ])
                        }
                        style={styles.addButton}
                    >
                        <Text style={styles.addButtonText}>+ Add Service</Text>
                    </TouchableOpacity>

                    {/* Specializations */}
                    {/* ✅ Specializations — choose from existing services */}
                    <Text style={styles.sectionTitle}>Specializations (select up to 3)</Text>
                    {form.services
                        ?.filter((s) => s.type?.trim()) // ignore empty services
                        .map((service, idx) => {
                            const serviceType = service.type;
                            const isSelected = form.specializations.includes(serviceType);

                            return (
                                <TouchableOpacity
                                    key={idx}
                                    style={[
                                        styles.specializationOption,
                                        isSelected && styles.specializationSelected,
                                    ]}
                                    onPress={() => {
                                        let updated = [...form.specializations];
                                        if (isSelected) {
                                            updated = updated.filter((s) => s !== serviceType);
                                        } else {
                                            if (updated.length < 3) {
                                                updated.push(serviceType);
                                            } else {
                                                Alert.alert("Limit reached", "You can select up to 3 specializations only.");
                                            }
                                        }
                                        handleChange("specializations", updated);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.specializationText,
                                            isSelected && styles.specializationTextSelected,
                                        ]}
                                    >
                                        {serviceType}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}

                    {/* Location */}
                    <Text style={styles.sectionTitle}>Location</Text>
                    {["address", "city", "state"].map((field) => (
                        <TextInput
                            key={field}
                            style={styles.input}
                            placeholder={`Enter ${field}`}
                            value={(form.location as any)[field]}
                            onChangeText={(text) =>
                                handleChange("location", { ...form.location, [field]: text })
                            }
                        />
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
    safeArea: { flex: 1, backgroundColor: "#F7F7F7" },
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: Platform.OS === "ios" ? 0 : 20,
        paddingBottom: 10,
        backgroundColor: "#F7F7F7",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E0E0E0",
    },
    backButton: { flexDirection: "row", alignItems: "center" },
    backArrow: { fontSize: 28, color: "#E97B47" },
    backText: { fontSize: 16, color: "#E97B47" },
    heading: { fontSize: 20, fontWeight: "600", flex: 1, textAlign: "center" },
    formContainer: { flex: 1, paddingHorizontal: 20 },
    scrollContent: { paddingVertical: 20 },

    photoContainer: { alignItems: "center", marginBottom: 20 },
    profilePhoto: { width: 100, height: 100, borderRadius: 50 },
    placeholder: { justifyContent: "center", alignItems: "center", backgroundColor: "#ddd" },
    placeholderText: { fontSize: 36, fontWeight: "600", color: "#e26110ff" },
    photoLabel: { marginTop: 10, fontSize: 14, color: "#333" },

    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: "500", marginBottom: 8, color: "#555" },
    input: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        fontSize: 14,
        marginBottom: 10,
    },
    multilineInput: { height: 100, textAlignVertical: "top" },

    sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 10, color: "#333" },
    serviceBlock: { marginBottom: 15 },

    addButton: {
        marginBottom: 20,
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#eee",
    },
    addButtonText: { fontSize: 14, color: "#333" },

    saveButton: {
        backgroundColor: "#E97B47",
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    saveButtonText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
    specializationOption: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
    },
    specializationSelected: {
        borderColor: "#E97B47",
        backgroundColor: "#FDECE5",
    },
    specializationText: {
        fontSize: 16,
        color: "#333",
    },
    specializationTextSelected: {
        color: "#E97B47",
        fontWeight: "600",
    },

});

export default EditTrainerProfile;
