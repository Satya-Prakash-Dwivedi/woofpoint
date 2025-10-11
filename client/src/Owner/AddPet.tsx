import React, { useEffect, useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, Alert, SafeAreaView,
    Platform, KeyboardAvoidingView, ActivityIndicator
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft02Icon, DeleteThrowIcon, AddCircleIcon, Edit01Icon } from "@hugeicons/core-free-icons";
import DropDownPicker from 'react-native-dropdown-picker'; // 👈 Import the library

interface Dog {
    _id?: string;
    name: string;
    breed: string;
    age: number;
    size: string;
    photos: string[];
}

interface Props {
    navigation: any;
}

const AddPetProfile: React.FC<Props> = ({ navigation }) => {
    // Dropdown state variables
    const [open, setOpen] = useState(false);
    const [sizeItems, setSizeItems] = useState([
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
    ]);

    const [dogs, setDogs] = useState<Dog[]>([]);
    const [loading, setLoading] = useState(true);
    const [newDog, setNewDog] = useState<Dog>({ name: "", breed: "", age: 0, size: "", photos: [] });
    const [editingDogId, setEditingDogId] = useState<string | null>(null);

    const goBack = () => navigation?.goBack();

    const fetchDogs = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                Alert.alert("Error", "No token found. Please log in again.");
                setLoading(false);
                return;
            }

            const response = await axios.get("http://localhost:3001/api/owner/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setDogs(response.data.profile.dogs || []);
            setLoading(false);
        } catch (err: any) {
            console.error("Dogs fetch error:", err.response?.data || err.message);
            Alert.alert("Error", "Failed to fetch dogs.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDogs();
    }, []);

    const handleAddDog = async () => {
        try {
            if (!newDog.name || !newDog.breed) {
                Alert.alert("Error", "Dog name and breed are required.");
                return;
            }
            const token = await AsyncStorage.getItem("authToken");
            if (!token) return;

            const response = await axios.post(
                "http://localhost:3001/api/owner/dogs",
                newDog,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDogs(prevDogs => [...prevDogs, response.data.dog]);
            setNewDog({ name: "", breed: "", age: 0, size: "", photos: [] });
            Alert.alert("Success", `${newDog.name} has been added!`);
        } catch (err: any) {
            console.error("Add dog error:", err.response?.data || err.message);
            Alert.alert("Error", "Failed to add dog.");
        }
    };

    const handleDeleteDog = async (dogId: string) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to remove this pet?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("authToken");
                            if (!token) return;

                            await axios.delete(
                                `http://localhost:3001/api/owner/dogs/${dogId}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            setDogs(prevDogs => prevDogs.filter(dog => dog._id !== dogId));
                            Alert.alert("Success", "Pet removed successfully.");
                        } catch (err: any) {
                            console.error("Delete dog error:", err.response?.data || err.message);
                            Alert.alert("Error", "Failed to delete pet.");
                        }
                    },
                },
            ]
        );
    };

    const handleEditDog = (dog: Dog) => {
        setNewDog(dog);
        setEditingDogId(dog._id || null);
    };

    const handleUpdateDog = async () => {
        try {
            if (!newDog.name || !newDog.breed) {
                Alert.alert("Error", "Dog name and breed are required.");
                return;
            }
            const token = await AsyncStorage.getItem("authToken");
            if (!token) return;

            await axios.put(
                `http://localhost:3001/api/owner/dogs/${editingDogId}`,
                newDog,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDogs(prevDogs => prevDogs.map(d => d._id === editingDogId ? newDog : d));
            setNewDog({ name: "", breed: "", age: 0, size: "", photos: [] });
            setEditingDogId(null);
            Alert.alert("Success", "Pet profile updated!");
        } catch (err: any) {
            console.error("Update dog error:", err.response?.data || err.message);
            Alert.alert("Error", "Failed to update pet.");
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#E97B47" />
            </View>
        );
    }

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
                    <Text style={styles.heading}>Your Pets</Text>
                    <View style={{ width: 60 }} />
                </View>

                <ScrollView style={styles.formContainer} contentContainerStyle={styles.scrollContent}>
                    {/* List of existing dogs */}
                    <Text style={styles.sectionHeading}>My Dogs</Text>
                    {dogs.length > 0 ? (
                        dogs.map((dog, index) => (
                            <View key={dog._id || index} style={styles.dogCard}>
                                <View style={styles.dogInfo}>
                                    <Text style={styles.dogName}>{dog.name}</Text>
                                    <Text style={styles.dogDetail}>Breed: {dog.breed}</Text>
                                    <Text style={styles.dogDetail}>Age: {dog.age}</Text>
                                    <Text style={styles.dogDetail}>Size: {dog.size}</Text>
                                </View>
                                <View style={styles.dogActions}>
                                    <TouchableOpacity onPress={() => handleEditDog(dog)} style={styles.actionButton}>
                                        <HugeiconsIcon icon={Edit01Icon} size={20} color="#E97B47" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteDog(dog._id!)} style={[styles.actionButton, styles.deleteButton]}>
                                        <HugeiconsIcon icon={DeleteThrowIcon} size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={{ color: "#888", textAlign: "center", marginBottom: 20 }}>No pets added yet.</Text>
                    )}

                    {/* Form to add/edit a new dog */}
                    <Text style={styles.sectionHeading}>{editingDogId ? "Edit Pet" : "Add a New Pet"}</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={newDog.name}
                            onChangeText={(text) => setNewDog(prev => ({ ...prev, name: text }))}
                            placeholder="Dog's Name"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Breed</Text>
                        <TextInput
                            style={styles.input}
                            value={newDog.breed}
                            onChangeText={(text) => setNewDog(prev => ({ ...prev, breed: text }))}
                            placeholder="Dog's Breed"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Age</Text>
                        <TextInput
                            style={styles.input}
                            value={newDog.age.toString()}
                            onChangeText={(text) => setNewDog(prev => ({ ...prev, age: parseInt(text) || 0 }))}
                            placeholder="Age in years"
                            keyboardType="number-pad"
                        />
                    </View>

                    {/* Size Dropdown Menu */}
                    <View style={[styles.inputGroup, Platform.OS !== 'android' && { zIndex: 10 }]}>
                        <Text style={styles.label}>Size</Text>
                        <DropDownPicker
                            open={open}
                            value={newDog.size}
                            items={sizeItems}
                            setOpen={setOpen}
                            setValue={(callback: any) => {
                                setNewDog(prev => ({ ...prev, size: callback() }));
                            }}
                            setItems={setSizeItems}
                            style={styles.dropdown}
                            containerStyle={styles.dropdownContainer}
                            dropDownContainerStyle={styles.dropdownListContainer}
                            placeholder="Select Size"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={editingDogId ? handleUpdateDog : handleAddDog}
                    >
                        <HugeiconsIcon icon={editingDogId ? Edit01Icon : AddCircleIcon} size={24} color="#fff" />
                        <Text style={styles.saveButtonText}>{editingDogId ? "Update Pet" : "Add Pet"}</Text>
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
    sectionHeading: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 20,
        marginBottom: 10,
        color: "#333",
    },
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
        flexDirection: "row",
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginLeft: 10,
    },
    dogCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dogInfo: { flex: 1 },
    dogName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    dogDetail: { fontSize: 14, color: '#666', marginTop: 2 },
    dogActions: { flexDirection: 'row', alignItems: 'center' },
    actionButton: {
        padding: 8,
        borderRadius: 5,
        marginLeft: 10,
    },
    deleteButton: {
        backgroundColor: '#ff4d4f',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
    },
    dropdown: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
    },
    dropdownContainer: {
        height: 50,
    },
    dropdownListContainer: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
    }
});

export default AddPetProfile;