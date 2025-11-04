import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Image,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; // Adjust this import path if needed
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft02Icon, StarIcon, Award02Icon, Dollar01Icon, Time01Icon } from '@hugeicons/core-free-icons';
import config from '../config';

const PRIMARY = '#E97B47';
const BG = '#FEFBF6';

// Interface for the detailed trainer profile
interface TrainerDetail {
    _id: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    bio?: string;
    averageRating: number;
    totalReviews: number;
    yearsOfExperience: number;
    certifications: { name?: string }[];
    services: { type?: string; description?: string; duration?: number; price?: number }[];
    specializations: string[];
    location: { city?: string; state?: string };
}

type Props = NativeStackScreenProps<RootStackParamList, 'TrainerDetail'>;

const TrainerDetail: React.FC<Props> = ({ route, navigation }) => {
    const { trainerId } = route.params;
    const [trainer, setTrainer] = useState<TrainerDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrainerDetails = async () => {
            console.log(`--- Debug: Fetching details for trainer ID: ${trainerId}`);
            try {
                const token = await AsyncStorage.getItem('authToken');
                console.log('--- Debug: Retrieved auth token:', token ? 'Token found.' : 'No token found.');
                if (!token) {
                    console.error("--- Debug Error: Auth token not found. Redirecting to login.");
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    return;
                }
                
                const apiUrl = `${config.apiUrl}/owner/trainers/${trainerId}`;
                console.log(`--- Debug: Making API call to: ${apiUrl}`);

                const response = await axios.get(apiUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log('--- Debug: API Response Success:', JSON.stringify(response.data, null, 2));
                setTrainer(response.data);

            } catch (err: any) {
                setError('Failed to load trainer details.');
                
                // START: DETAILED AXIOS ERROR LOGGING
                if (axios.isAxiosError(err)) {
                    console.error('--- Debug: Axios error fetching trainer details:');
                    if (err.response) {
                        // The server responded with a status code outside the 2xx range
                        console.error('--- Debug: Response Data:', JSON.stringify(err.response.data, null, 2));
                        console.error('--- Debug: Response Status:', err.response.status);
                    } else if (err.request) {
                        // The request was made but no response was received
                        console.error('--- Debug: No response received. Check network connection and server status.');
                        console.error('--- Debug: Request details:', err.request);
                    } else {
                        // Something happened in setting up the request
                        console.error('--- Debug: Error setting up request:', err.message);
                    }
                } else {
                    // A non-Axios, unexpected error
                    console.error('--- Debug: An unexpected error occurred:', err);
                }
                // END: DETAILED AXIOS ERROR LOGGING

            } finally {
                setIsLoading(false);
            }
        };

        fetchTrainerDetails();
    }, [trainerId]);

    if (isLoading) {
        return <ActivityIndicator size="large" color={PRIMARY} style={styles.loader} />;
    }

    if (error || !trainer) {
        return (
            <SafeAreaView style={styles.container}>
                 <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="#E97B47" />
                    </TouchableOpacity>
                    <Text style={styles.errorText}>{error || 'Trainer not found.'}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                     <TouchableOpacity onPress={() => navigation.goBack()}>
                        <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="#E97B47" />
                    </TouchableOpacity> 
                    {/* <Text style={styles.headerTitle}>Trainer Profile</Text> */}
                     <View style={{width: 24}} /> 
                </View>

                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    {trainer.profilePhoto ? (
                        <Image source={{ uri: trainer.profilePhoto }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.profileImagePlaceholder} />
                    )}
                    <Text style={styles.trainerName}>{`${trainer.firstName} ${trainer.lastName}`}</Text>
                    <Text style={styles.location}>{`${trainer.location.city}, ${trainer.location.state}`}</Text>
                    <View style={styles.ratingContainer}>
                        <HugeiconsIcon icon={StarIcon} size={16} color="#FFC107" />
                        <Text style={styles.ratingText}>{`${trainer.averageRating.toFixed(1)} (${trainer.totalReviews} reviews)`}</Text>
                    </View>
                </View>
                
                {/* Bio Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About Me</Text>
                    <Text style={styles.bioText}>{trainer.bio || 'No biography provided.'}</Text>
                </View>

                 {/* Certifications Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Certifications & Experience</Text>
                     <Text style={styles.experienceText}>{trainer.yearsOfExperience} years of professional experience</Text>
                    {trainer.certifications.map((cert, index) => (
                        <View key={index} style={styles.listItem}>
                           <HugeiconsIcon icon={Award02Icon} size={20} color={PRIMARY}/>
                           <Text style={styles.listItemText}>{cert.name}</Text>
                        </View>
                    ))}
                </View>

                {/* Services Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Services Offered</Text>
                    {trainer.services.map((service, index) => (
                        <View key={index} style={styles.serviceCard}>
                            <Text style={styles.serviceTitle}>{service.type}</Text>
                            <Text style={styles.serviceDescription}>{service.description}</Text>
                            <View style={styles.serviceMeta}>
                                <View style={styles.metaItem}>
                                    <HugeiconsIcon icon={Time01Icon} size={16} color="#555"/>
                                    <Text style={styles.metaText}>{service.duration} mins</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <HugeiconsIcon icon={Dollar01Icon} size={16} color="#555"/>
                                    <Text style={styles.metaText}>${service.price}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
             <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book a Session</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, justifyContent: 'space-between' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 50 },
    profileHeader: { alignItems: 'center', padding: 20 },
    profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
    profileImagePlaceholder: { width: 120, height: 120, borderRadius: 60, marginBottom: 15, backgroundColor: '#E0E0E0' },
    trainerName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    location: { fontSize: 16, color: '#666', marginTop: 4 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    ratingText: { marginLeft: 5, fontSize: 14, color: '#555' },
    section: { paddingHorizontal: 20, marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    bioText: { fontSize: 15, lineHeight: 22, color: '#555' },
    experienceText: { fontSize: 15, color: '#555', marginBottom: 10, fontStyle: 'italic'},
    listItem: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
    listItemText: {fontSize: 15, color: '#555', marginLeft: 10},
    serviceCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    serviceTitle: { fontSize: 16, fontWeight: 'bold', color: PRIMARY },
    serviceDescription: { fontSize: 14, color: '#666', marginVertical: 5 },
    serviceMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
    metaItem: { flexDirection: 'row', alignItems: 'center' },
    metaText: { marginLeft: 5, fontSize: 14, color: '#333' },
    bookButton: { backgroundColor: PRIMARY, padding: 18, margin: 20, borderRadius: 12, alignItems: 'center' },
    bookButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default TrainerDetail;
