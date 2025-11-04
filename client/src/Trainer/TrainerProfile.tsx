import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../config";

interface TrainerProfile {
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    yearsOfExperience: number;
    bio: string;
    certifications: { name: string }[];
    services: { type: string; description: string; duration: number; price: number }[];
    specializations: string[];
    location: { address: string; city: string; state: string };
}

const TrainerProfileScreen = ({ navigation }: any) => {
    const [profile, setProfile] = useState<TrainerProfile | null>(null);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await axios.get(`${config.apiUrl}/trainer/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data;
            setProfile({
                firstName: data.firstName,
                lastName: data.lastName,
                profilePhoto: data.profilePhoto,
                yearsOfExperience: data.businessInfo?.yearsOfExperience || 0,
                bio: data.portfolio?.bio || "",
                certifications: data.businessInfo?.certifications || [],
                services: data.services || [],
                specializations: data.portfolio?.specializations || [],
                location: data.location || { address: "", city: "", state: "" },
            });
        } catch (err) {
            console.error("Error fetching profile", err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (!profile) return <Text style={{ margin: 20 }}>Loading...</Text>;

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Sticky Header */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>My Profile</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    {profile.profilePhoto ? (
                        <Image source={{ uri: profile.profilePhoto }} style={styles.profilePhoto} />
                    ) : (
                        <View style={[styles.profilePhoto, styles.placeholder]}>
                            <Text style={styles.placeholderText}>
                                {profile.firstName ? profile.firstName.charAt(0) : "?"}
                            </Text>
                        </View>
                    )}
                    <Text style={styles.name}>
                        {profile.firstName} {profile.lastName}
                    </Text>
                    <View style={styles.specializations}>
                        {profile.specializations.slice(0, 3).map((spec, idx) => (
                            <Text key={idx} style={styles.specTag}>
                                {spec}
                            </Text>
                        ))}
                    </View>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate("EditTrainerProfile")}
                    >
                        <Text style={styles.editText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* About Me */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>About Me</Text>
                    <Text style={styles.meta}>{profile.yearsOfExperience}+ years experience</Text>
                    <Text style={styles.body}>{profile.bio}</Text>
                </View>

                {/* Certifications */}
                {profile.certifications.length > 0 && (
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Certifications</Text>
                        <View style={styles.badges}>
                            {profile.certifications.map((cert, idx) => (
                                <Text key={idx} style={styles.badge}>
                                    {cert.name}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}

                {/* Services */}
                {profile.services.length > 0 && (
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Services Offered</Text>
                        {profile.services.map((s, idx) => (
                            <View key={idx} style={styles.card}>
                                <Text style={styles.cardTitle}>{s.type}</Text>
                                <Text style={styles.body}>{s.description}</Text>
                                <Text style={styles.meta}>
                                    {s.duration} mins | $ {s.price}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Location */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    <Text style={styles.body}>
                        {profile.location.address}, {profile.location.city},{" "}
                        {profile.location.state}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#F7F7F7" },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#ddd",
        backgroundColor: "#fff",
    },
    backArrow: { fontSize: 26, color: "#E97B47" },
    topBarTitle: { fontSize: 18, fontWeight: "600", color: "#333" },

    container: { flex: 1, padding: 16 },
    header: { alignItems: "center", marginBottom: 20 },
    profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 12,
        borderWidth: 3,
        borderColor: "#E97B47",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
    placeholder: { justifyContent: "center", alignItems: "center", backgroundColor: "#ddd" },
    placeholderText: { fontSize: 40, fontWeight: "bold", color: "#fff" },
    name: { fontSize: 24, fontWeight: "700", color: "#333" },
    specializations: { flexDirection: "row", marginTop: 8, flexWrap: "wrap", justifyContent: "center" },
    specTag: {
        backgroundColor: "#E97B47",
        color: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        marginHorizontal: 4,
        marginBottom: 6,
        fontSize: 13,
        fontWeight: "500",
    },
    editButton: {
        marginTop: 14,
        backgroundColor: "#333",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    editText: { color: "#fff", fontWeight: "600", fontSize: 14 },

    sectionCard: {
        marginVertical: 10,
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
    },
    sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#333" },
    body: { fontSize: 14, color: "#555", lineHeight: 20 },
    meta: { fontSize: 13, color: "#777", marginBottom: 6 },
    badges: { flexDirection: "row", flexWrap: "wrap" },
    badge: {
        backgroundColor: "#eee",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        margin: 4,
        fontSize: 13,
        fontWeight: "500",
    },
    card: {
        backgroundColor: "#fafafa",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#eee",
    },
    cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4, color: "#333" },
});

export default TrainerProfileScreen;
