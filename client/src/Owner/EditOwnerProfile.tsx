import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EditOwnerProfile = () => {
    const [form, setForm] = useState<any>({});
    const navigation = useNavigation();

    useEffect(() => {
        // Fetch existing data
        setForm({
            firstName: 'Satya',
            lastName: 'Dwivedi',
            phone: '9876543210',
            city: 'Delhi',
            state: 'Delhi',
        });
    }, []);

    const handleSave = async () => {
        // PUT /owners/:id
        console.log('Saving...', form);
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} value={form.firstName} onChangeText={(t) => setForm({ ...form, firstName: t })} />

            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} value={form.lastName} onChangeText={(t) => setForm({ ...form, lastName: t })} />

            <Text style={styles.label}>Phone</Text>
            <TextInput style={styles.input} value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} />

            <Text style={styles.label}>City</Text>
            <TextInput style={styles.input} value={form.city} onChangeText={(t) => setForm({ ...form, city: t })} />

            <Text style={styles.label}>State</Text>
            <TextInput style={styles.input} value={form.state} onChangeText={(t) => setForm({ ...form, state: t })} />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    label: { fontWeight: '600', marginBottom: 5, marginTop: 15 },
    input: { borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 12, fontSize: 14 },
    saveButton: { backgroundColor: '#E97B47', padding: 14, borderRadius: 8, marginTop: 30 },
    saveText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});

export default EditOwnerProfile;
