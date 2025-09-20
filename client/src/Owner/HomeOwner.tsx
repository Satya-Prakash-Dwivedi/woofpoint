import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Image,
    ImageSourcePropType,
    Modal, Alert
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Menu01Icon, Home09Icon, Calendar02Icon, BubbleChatIcon, UserCircleIcon, CancelCircleIcon, FileEditIcon, LogoutSquare02Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import Colors from '../constants/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const PRIMARY: string = '#E97B47';
const BG: string = '#FEFBF6';

// Type definitions
interface Trainer {
    id: number;
    name: string;
    rating: number;
    reviews: number;
    distance: string;
    image?: ImageSourcePropType;
    specialization: string;
}

interface FilterButtonProps {
    title: string;
    value?: string;
    onPress: () => void;
}

interface TrainerCardProps {
    trainer: Trainer;
}

interface BottomNavItemProps {
    title: string;
    isActive?: boolean;
    onPress?: () => void;
}

type Props = NativeStackScreenProps<RootStackParamList, "OwnerHome">;

const OwnerHome: React.FC<Props> = ({ navigation, route }) => {
    const { token } = route.params;
    const [searchText, setSearchText] = useState<string>('');
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
    const [selectedDistance, setSelectedDistance] = useState<string>('');
    const [selectedRating, setSelectedRating] = useState<string>('');
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    }

    const handleEditProfile = () => {
        setIsMenuVisible(false);
        navigation.navigate('EditOwnerProfile', { token });
    };

    const handleLogout = async () => {
        setIsMenuVisible(false);

        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Call logout API
                            await axios.post(
                                'http://localhost:3001/api/auth/logout',
                                {},
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        'Content-Type': 'application/json',
                                    },
                                }
                            );
                        } catch (error) {
                            console.log('Logout API call failed, but continuing with local logout:', error);
                            // Continue with logout even if API call fails
                        }

                        try {
                            // Remove token from AsyncStorage
                            await AsyncStorage.removeItem('authToken');

                            // Navigate to login screen and reset stack
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (storageError) {
                            console.error('Error during logout:', storageError);
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    // Dummy trainer data with proper typing
    const trainers: Trainer[] = [
        {
            id: 1,
            name: 'Steve Jobs',
            rating: 4.8,
            reviews: 123,
            distance: '1.2 miles away',
            specialization: 'Obedience Training',
        },
        {
            id: 2,
            name: 'Osho',
            rating: 4.5,
            reviews: 210,
            distance: '2.5 miles away',
            specialization: 'Behavioral Training',
        },
        {
            id: 3,
            name: 'Thomas Shelby',
            rating: 4.9,
            reviews: 300,
            distance: '3 miles away',
            specialization: 'Swimming Training',
        },
    ];

    const handleSearchSubmit = (): void => {
        console.log('Search submitted:', searchText);
        // Implement search logic
    };

    const handleSpecializationFilter = (): void => {
        console.log('Specialization filter pressed');
        // Implement specialization filter logic
    };

    const handleDistanceFilter = (): void => {
        console.log('Distance filter pressed');
        // Implement distance filter logic
    };

    const handleRatingFilter = (): void => {
        console.log('Rating filter pressed');
        // Implement rating filter logic
    };

    const handleTrainerPress = (trainerId: number): void => {
        console.log('Trainer pressed:', trainerId);
        // Implement navigation to trainer details
    };

    const handleBottomNavPress = (tab: string): void => {
        console.log('Bottom nav pressed:', tab);
        // Implement bottom navigation logic
    };



    const FilterButton: React.FC<FilterButtonProps> = ({ title, value, onPress }) => (
        <TouchableOpacity style={styles.filterButton} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.filterText}>{title}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
    );

    const TrainerCard: React.FC<TrainerCardProps> = ({ trainer }) => (
        <TouchableOpacity
            style={styles.trainerCard}
            onPress={() => handleTrainerPress(trainer.id)}
            activeOpacity={0.7}
        >
            <View style={styles.trainerInfo}>
                <Text style={styles.distance}>{trainer.distance}</Text>
                <Text style={styles.trainerName}>{trainer.name}</Text>
                <Text style={styles.rating}>
                    {trainer.rating.toFixed(1)} · {trainer.reviews} reviews
                </Text>
            </View>
            <View style={styles.trainerImageContainer}>
                <View style={styles.trainerImagePlaceholder}>
                    <View style={styles.personIcon} />
                    <View style={styles.dogIcon} />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>

                <Text style={styles.headerTitle}>Woof Point</Text>
                <TouchableOpacity
                    onPress={toggleMenu}
                    activeOpacity={0.7}
                >
                    <HugeiconsIcon
                        icon={Menu01Icon}
                        size={30}
                        strokeWidth={1.5}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Enter ZIP code"
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={handleSearchSubmit}
                        returnKeyType="search"
                        keyboardType="numeric"
                        maxLength={10}
                    />
                </View>

                {/* Filter Buttons */}
                <View style={styles.filtersContainer}>
                    <FilterButton
                        title="Training"
                        value={selectedSpecialization}
                        onPress={handleSpecializationFilter}
                    />
                    <FilterButton
                        title="Distance"
                        value={selectedDistance}
                        onPress={handleDistanceFilter}
                    />
                    <FilterButton
                        title="Rating"
                        value={selectedRating}
                        onPress={handleRatingFilter}
                    />
                </View>

                {/* Trainers List */}
                <View style={styles.trainersContainer}>
                    {trainers.length > 0 ? (
                        trainers.map((trainer: Trainer) => (
                            <TrainerCard key={trainer.id} trainer={trainer} />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No trainers found in your area</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <HugeiconsIcon
                    icon={Home09Icon}
                    size={30}
                    strokeWidth={1.5}
                    color="black"
                />
                <HugeiconsIcon
                    icon={Calendar02Icon}
                    size={30}
                    strokeWidth={1.5}
                    color="black" />
                <HugeiconsIcon
                    icon={BubbleChatIcon}
                    size={30}
                    strokeWidth={1.5}
                    color="black" />
                <HugeiconsIcon
                    icon={UserCircleIcon}
                    size={30}
                    strokeWidth={1.5}
                    color="black" />
            </View>

            <Modal
                animationType='fade'
                transparent={true}
                visible={isMenuVisible}
                onRequestClose={() =>
                    setIsMenuVisible(false)
                }
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() =>
                        setIsMenuVisible(false)}
                    activeOpacity={1}
                >
                    <View style={styles.menuContainer}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.menuTitle}>Menu</Text>
                            <TouchableOpacity onPress={() => setIsMenuVisible(false)}>
                                <HugeiconsIcon icon={CancelCircleIcon} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.menuItems}>
                            <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
                                <HugeiconsIcon icon={FileEditIcon} />
                                <Text style={styles.menuItemText}>Edit Profile</Text>
                                <HugeiconsIcon icon={ArrowRight01Icon} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <HugeiconsIcon icon={LogoutSquare02Icon} color={PRIMARY} />
                                <Text style={[styles.menuItemText, { color: PRIMARY }]}>Logout</Text>
                                <HugeiconsIcon
                                    icon={ArrowRight01Icon}
                                    color={PRIMARY}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>

            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: BG,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    menuButton: {
        padding: 5,
        borderRadius: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: PRIMARY,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    searchContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    searchInput: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 10,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filtersContainer: {
        flexDirection: 'row',
        marginBottom: 25,
        gap: 10,
    },
    filterButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        paddingHorizontal: 5
    },
    dropdownIcon: {
        fontSize: 12,
        color: '#999',
    },
    trainersContainer: {
        gap: 15,
    },
    trainerCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F8F8F8',
    },
    trainerInfo: {
        flex: 1,
        paddingRight: 15,
        justifyContent: 'center',
    },
    distance: {
        fontSize: 14,
        color: '#999',
        marginBottom: 5,
        fontWeight: '400',
    },
    trainerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    rating: {
        fontSize: 14,
        color: '#666',
        fontWeight: '400',
    },
    trainerImageContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    trainerImagePlaceholder: {
        width: 70,
        height: 70,
        backgroundColor: '#A8C5A0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    personIcon: {
        width: 25,
        height: 25,
        backgroundColor: '#333',
        borderRadius: 12,
        position: 'absolute',
        top: 15,
        left: 15,
    },
    dogIcon: {
        width: 20,
        height: 15,
        backgroundColor: PRIMARY,
        borderRadius: 8,
        position: 'absolute',
        bottom: 15,
        right: 15,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: 10,
        justifyContent: 'space-between'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    menuContainer: {
        backgroundColor: '#fff',
        marginTop: 80,
        marginHorizontal: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    menuItems: {
        paddingVertical: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 8,
        marginHorizontal: 10,
    },
    menuItemText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        marginLeft: 5
    },
});

export default OwnerHome;