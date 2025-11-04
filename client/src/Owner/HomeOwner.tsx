import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Image,
    ActivityIndicator,
    Modal,
    Alert,
    Platform 
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Menu01Icon, Home09Icon, Calendar02Icon, UserCircleIcon, CancelCircleIcon, FileEditIcon, LogoutSquare02Icon, ArrowRight01Icon, AddCircleIcon, Search01Icon, StarIcon } from '@hugeicons/core-free-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

// Design System Colors & Constants
const PRIMARY = '#E97B47';
const BG = '#FEFBF6';
const TEXT_PRIMARY = '#333';
const TEXT_SECONDARY = '#666';
const BORDER_COLOR = '#F0F0F0';
const WHITE = '#FFFFFF';

// Type definitions
interface Trainer {
    _id: string;
    firstName: string;
    lastName: string;
    averageRating: number;
    totalReviews: number;
    location: {
        city: string;
        state: string;
    };
    profilePhoto?: string;
    specializations: string[];
}

interface TrainerCardProps {
    trainer: Trainer;
    onPress: () => void;
}

type Props = NativeStackScreenProps<RootStackParamList, "OwnerHome">;

const OwnerHome: React.FC<Props> = ({ navigation, route }) => {
    const { token } = route.params;
    const [searchText, setSearchText] = useState<string>('');
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const authToken = await AsyncStorage.getItem("authToken");
                if (!authToken) {
                    throw new Error("Authentication token not found.");
                }

                const response = await axios.get('http://localhost:3001/api/owner/trainers', {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setTrainers(response.data);
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch trainers:", err);
                setError("Failed to load trainers. Please try again later.");
                if (err.response?.status === 401) {
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrainers();
    }, []);

    const toggleMenu = () => setIsMenuVisible(!isMenuVisible);
    const handlePetProfile = () => {
        setIsMenuVisible(false);
        navigation.navigate('AddPet', { token });
    };
    const handleEditProfile = () => {
        setIsMenuVisible(false);
        navigation.navigate('EditOwnerProfile', { token });
    };
    const handleTrainerPress = (trainerId: string) => {
        navigation.navigate('TrainerDetail', { trainerId });
    };

    const handleLogout = () => {
        setIsMenuVisible(false);
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await axios.post('http://localhost:3001/api/auth/logout', {}, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                    } catch (error) {
                        console.log('Logout API call failed, continuing local logout.');
                    }
                    await AsyncStorage.removeItem('authToken');
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                },
            },
        ]);
    };

    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color={PRIMARY} style={styles.loader} />;
        }
        if (error) {
            return <View style={styles.emptyStateContainer}><Text style={styles.emptyStateText}>{error}</Text></View>;
        }
        if (trainers.length === 0) {
            return <View style={styles.emptyStateContainer}><Text style={styles.emptyStateText}>No trainers found in your area</Text></View>;
        }
        return trainers.map((trainer) => (
            <TrainerCard key={trainer._id} trainer={trainer} onPress={() => handleTrainerPress(trainer._id)} />
        ));
    };

    const TrainerCard: React.FC<TrainerCardProps> = ({ trainer, onPress }) => (
        <TouchableOpacity style={styles.trainerCard} onPress={onPress} activeOpacity={0.8}>
            <Image 
                source={trainer.profilePhoto ? { uri: trainer.profilePhoto } : require('../assets/images/default-avatar.png')} 
                style={styles.trainerImage} 
            />
            <View style={styles.trainerInfo}>
                <Text style={styles.trainerName} numberOfLines={1}>{`${trainer.firstName} ${trainer.lastName}`}</Text>
                <Text style={styles.trainerLocation}>{`${trainer.location.city}, ${trainer.location.state}`}</Text>
                <View style={styles.ratingContainer}>
                    <HugeiconsIcon icon={StarIcon} size={16} color="#FFC107" />
                    <Text style={styles.ratingText}>
                        {trainer.averageRating.toFixed(1)}
                        <Text style={styles.reviewsText}> ({trainer.totalReviews} reviews)</Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Woof Point</Text>
                <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                    <HugeiconsIcon icon={Menu01Icon} size={28} strokeWidth={2} color={TEXT_PRIMARY} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.searchContainer}>
                   
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by ZIP code..."
                        placeholderTextColor={TEXT_SECONDARY}
                        value={searchText}
                        onChangeText={setSearchText}
                        returnKeyType="search"
                        keyboardType="numeric"
                    />
                    <HugeiconsIcon icon={Search01Icon} size={20} color={TEXT_SECONDARY} style={styles.searchIcon} /> 
                </View>

                <Text style={styles.sectionTitle}>Top Rated Trainers</Text>
                <View style={styles.trainersContainer}>
                    {renderContent()}
                </View>
            </ScrollView>

            <View style={styles.bottomNav}>
                 <TouchableOpacity style={styles.bottomNavItem}>
                    <HugeiconsIcon icon={Home09Icon} size={28} strokeWidth={2} color={PRIMARY} />
                    <Text style={[styles.bottomNavText, { color: PRIMARY }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomNavItem}>
                    <HugeiconsIcon icon={Calendar02Icon} size={28} strokeWidth={2} color={TEXT_SECONDARY} />
                    <Text style={styles.bottomNavText}>Bookings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate("OwnerProfile")}>
                    <HugeiconsIcon icon={UserCircleIcon} size={28} strokeWidth={2} color={TEXT_SECONDARY} />
                    <Text style={styles.bottomNavText}>Profile</Text>
                </TouchableOpacity>
            </View>

            <Modal animationType='fade' transparent={true} visible={isMenuVisible} onRequestClose={toggleMenu}>
                <TouchableOpacity style={styles.modalOverlay} onPress={toggleMenu} activeOpacity={1}>
                    <View style={styles.menuContainer}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.menuTitle}>Menu</Text>
                            <TouchableOpacity onPress={toggleMenu}>
                                <HugeiconsIcon icon={CancelCircleIcon} size={24} color={TEXT_SECONDARY} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.menuItems}>
                            <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
                                <HugeiconsIcon icon={FileEditIcon} size={22} color={TEXT_SECONDARY} />
                                <Text style={styles.menuItemText}>Edit Profile</Text>
                                <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={TEXT_SECONDARY} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={handlePetProfile}>
                                <HugeiconsIcon icon={AddCircleIcon} size={22} color={TEXT_SECONDARY} />
                                <Text style={styles.menuItemText}>Add Your Pet</Text>
                                <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={TEXT_SECONDARY} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <HugeiconsIcon icon={LogoutSquare02Icon} size={22} color={PRIMARY} />
                                <Text style={[styles.menuItemText, { color: PRIMARY }]}>Logout</Text>
                                <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={PRIMARY} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: WHITE,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: PRIMARY },
    menuButton: { padding: 5 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: WHITE,
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        paddingHorizontal: 15,
    },
    searchIcon: { 
        // position: 'absolute', 
        marginLeft: 10,
        // marginRight: 15 , 
    },
    searchInput: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        color: TEXT_PRIMARY,
        // paddingLeft: 10, 
        // Add a little padding on the right for balance
        // paddingRight: 15,
    },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 15 },
    trainersContainer: { gap: 15 },
    trainerCard: {
        flexDirection: 'row',
        backgroundColor: WHITE,
        padding: 12,
        borderRadius: 16,
        shadowColor: '#9e6b52',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    trainerImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 15,
        backgroundColor: BORDER_COLOR,
    },
    trainerInfo: { flex: 1, justifyContent: 'center' },
    trainerName: { fontSize: 18, fontWeight: 'bold', color: TEXT_PRIMARY, marginBottom: 4 },
    trainerLocation: { fontSize: 14, color: TEXT_SECONDARY, marginBottom: 6 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { marginLeft: 5, fontSize: 14, color: TEXT_PRIMARY, fontWeight: '500' },
    reviewsText: { color: TEXT_SECONDARY, fontWeight: '400' },
    emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 50 },
    emptyStateText: { fontSize: 16, color: TEXT_SECONDARY, textAlign: 'center' },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: WHITE,
        paddingTop: 10,
        paddingBottom: Platform.OS === 'ios' ? 25 : 10, // <-- 2. ERROR FIXED
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: BORDER_COLOR,
        justifyContent: 'space-around',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 5,
    },
    bottomNavItem: { alignItems: 'center', gap: 4 },
    bottomNavText: { fontSize: 12, color: TEXT_SECONDARY, fontWeight: '500' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
    menuContainer: {
        backgroundColor: BG,
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '80%',
        paddingTop: 60,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    menuTitle: { fontSize: 20, fontWeight: 'bold', color: TEXT_PRIMARY },
    menuItems: { paddingVertical: 10 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    menuItemText: {
        flex: 1,
        fontSize: 16,
        color: TEXT_SECONDARY,
        fontWeight: '500',
        marginLeft: 15,
    },
});

export default OwnerHome;

