import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, SafeAreaView,
  Platform, KeyboardAvoidingView, Image
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";

interface OwnerProfile {
    firstName: string;
    lastName: string;
    phone: string;
    profilePhoto?: string;
    location: { address: string; city: string; state: string; zipCode: string };
    dogs: any[];
  }  

interface Props {
  navigation: any;
}

const EditOwnerProfile: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState<OwnerProfile>({
    firstName: "",
    lastName: "",
    phone: "",
    profilePhoto: "",
    location: { address: "", city: "", state: "", zipCode: "" },
  dogs: [],
  });

  const goBack = () => navigation?.goBack();

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        return;
      }

      const response = await axios.get("http://localhost:3001/api/owner/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.profile;

      setForm({
        firstName: data.firstName || "",
  lastName: data.lastName || "",
  phone: data.phone || "",
  profilePhoto: data.profilePhoto || "",
  location: data.location || { address: "", city: "", state: "", zipCode: "" },
  dogs: data.dogs || [],
      });
    } catch (err: any) {
      console.error("Owner fetch error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to fetch profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field: keyof OwnerProfile, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleLocationChange = (field: keyof OwnerProfile["location"], value: string) => {
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };
  

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      await axios.put(
        "http://localhost:3001/api/owner/profile",
        {
            ...form,
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            profilePhoto: form.profilePhoto,
            location: form.location,
            dogs: form.dogs,
          },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Profile updated!", [{ text: "OK", onPress: () => goBack() }]);
    } catch (err: any) {
      console.error("Owner save error:", err.response?.data || err.message);
      Alert.alert("Error", "Update failed.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <HugeiconsIcon icon={ArrowLeft02Icon} />
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

          {/* User fields */}
<View style={styles.inputGroup}>
  <Text style={styles.label}>First Name</Text>
  <TextInput
    style={styles.input}
    value={form.firstName}
    onChangeText={(text) => handleChange("firstName", text)}
    placeholder="Enter First Name"
  />
</View>

<View style={styles.inputGroup}>
  <Text style={styles.label}>Last Name</Text>
  <TextInput
    style={styles.input}
    value={form.lastName}
    onChangeText={(text) => handleChange("lastName", text)}
    placeholder="Enter Last Name"
  />
</View>

<View style={styles.inputGroup}>
  <Text style={styles.label}>Phone</Text>
  <TextInput
    style={styles.input}
    value={form.phone}
    onChangeText={(text) => handleChange("phone", text)}
    placeholder="Enter Phone"
    keyboardType="phone-pad"
  />
</View>

{/* Location fields */}
<Text style={styles.sectionHeading}>Location</Text>

<View style={styles.inputGroup}>
  <Text style={styles.label}>Address</Text>
  <TextInput
    style={styles.input}
    value={form.location.address}
    onChangeText={(text) => handleLocationChange("address", text)}
    placeholder="Enter Address"
  />
</View>

<View style={styles.inputGroup}>
  <Text style={styles.label}>City</Text>
  <TextInput
    style={styles.input}
    value={form.location.city}
    onChangeText={(text) => handleLocationChange("city", text)}
    placeholder="Enter City"
  />
</View>

<View style={styles.inputGroup}>
  <Text style={styles.label}>State</Text>
  <TextInput
    style={styles.input}
    value={form.location.state}
    onChangeText={(text) => handleLocationChange("state", text)}
    placeholder="Enter State"
  />
</View>

<View style={styles.inputGroup}>
  <Text style={styles.label}>ZIP Code</Text>
  <TextInput
    style={styles.input}
    value={form.location.zipCode}
    onChangeText={(text) => handleLocationChange("zipCode", text)}
    placeholder="Enter ZIP Code"
    keyboardType="number-pad"
  />
</View>

{/* Dogs section */}
<Text style={styles.sectionHeading}>Dogs</Text>
{form.dogs.length > 0 ? (
  form.dogs.map((dog, index) => (
    <View key={index} style={styles.inputGroup}>
      <Text style={styles.label}>Dog {index + 1}</Text>
      <TextInput
        style={styles.input}
        value={dog.name}
        placeholder="Dog Name"
        onChangeText={(text) => {
          const updatedDogs = [...form.dogs];
          updatedDogs[index].name = text;
          setForm((prev) => ({ ...prev, dogs: updatedDogs }));
        }}
      />
    </View>
  ))
) : (
  <Text style={{ color: "#888" }}>No dogs added yet</Text>
)}

<TouchableOpacity
  style={styles.addDogButton}
  onPress={() => setForm((prev) => ({ ...prev, dogs: [...prev.dogs, { name: "" }] }))}
>
  <Text style={{ color: "#fff" }}>+ Add Dog</Text>
</TouchableOpacity>

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
  heading: { fontSize: 20, fontWeight: "600", flex: 1, textAlign: "center" },
  formContainer: { flex: 1, paddingHorizontal: 20 },
  scrollContent: { paddingVertical: 20 },
  photoContainer: { alignItems: "center", marginBottom: 20 },
  profilePhoto: {width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#E97B47",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6, },
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
  },
  saveButton: {
    backgroundColor: "#E97B47",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  saveButtonText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  addDogButton: {
    backgroundColor: "#555",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  
});

export default EditOwnerProfile;
