import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface OwnerProfile {
  firstName: string;
  lastName: string;
  phone: string;
  profilePhoto?: string;
  location: { address: string; city: string; state: string; zipCode: string };
  dogs: any[];
}

const OwnerProfile = ({ navigation }: any) => {
  const [profile, setProfile] = useState<OwnerProfile | null>(null);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:3001/api/owner/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data.profile;

      setProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        profilePhoto: data.profilePhoto,
        location: data.location || {
          address: "",
          city: "",
          state: "",
          zipCode: "",
        },
        dogs: data.dogs || [],
      });
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <Text>Loading...</Text>;

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

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {profile.profilePhoto ? (
            <Image source={{ uri: profile.profilePhoto }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.placeholder]}>
              <Text style={styles.placeholderText}>
                {profile.firstName ? profile.firstName.charAt(0) : "?"}
              </Text>
            </View>
          )}
          <Text style={styles.name}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.phone}>{profile.phone}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditOwnerProfile")}
          >
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Dogs Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>My Pets</Text>
          {profile.dogs.length > 0 ? (
            profile.dogs.map((dog: any, i: number) => (
              <View key={i} style={styles.dogCard}>
                <Text style={styles.cardTitle}>{dog.name}</Text>
                <Text style={styles.body}>
                  {dog.breed} • {dog.age} yrs
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.body}>No dogs added yet</Text>
          )}
        </View>

        {/* Location Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.body}>
            {profile.location.address}, {profile.location.city},{" "}
            {profile.location.state} {profile.location.zipCode}
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
  photo: {
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
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
  },
  placeholderText: { fontSize: 40, fontWeight: "bold", color: "#fff" },
  name: { fontSize: 24, fontWeight: "700", color: "#333" },
  phone: { fontSize: 14, color: "#555", marginTop: 4 },

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  body: { fontSize: 14, color: "#555", lineHeight: 20 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4, color: "#333" },

  dogCard: {
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
});

export default OwnerProfile;
