import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; // adjust path if App.tsx is elsewhere

type OwnerProfileNavProp = NativeStackNavigationProp<
    RootStackParamList,
    'EditOwnerProfile'
>;

const OwnerProfile = () => {
    const [profile, setProfile] = useState<any>(null);
    const navigation = useNavigation<OwnerProfileNavProp>();

    useEffect(() => {
        // Replace with API call
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        // Example: GET /owners/:id
        const data = {
            firstName: 'Satya',
            lastName: 'Dwivedi',
            phone: '9876543210',
            location: { city: 'Delhi', state: 'Delhi' },
            dogs: [{ name: 'Rocky', breed: 'Labrador', age: 2 }],
            profilePhoto: '',
        };
        setProfile(data);
    };

    if (!profile) return <Text>Loading...</Text>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{
                        uri:
                            profile.profilePhoto ||
                            'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
                    }}
                    style={styles.photo}
                />
                <Text style={styles.name}>
                    {profile.firstName} {profile.lastName}
                </Text>
                <Text style={styles.phone}>{profile.phone}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>City</Text>
                <Text>{profile.location.city}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Dogs</Text>
                {profile.dogs.map((dog: any, i: number) => (
                    <Text key={i}>
                        {dog.name} ({dog.breed}, {dog.age} yrs)
                    </Text>
                ))}
            </View>

            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditOwnerProfile')}
            >
                <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { alignItems: 'center', marginBottom: 20 },
    photo: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
    name: { fontSize: 18, fontWeight: '600' },
    phone: { color: '#555' },
    section: { marginBottom: 15 },
    label: { fontWeight: '600', marginBottom: 5 },
    editButton: {
        backgroundColor: '#E97B47',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    editText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});

export default OwnerProfile;
