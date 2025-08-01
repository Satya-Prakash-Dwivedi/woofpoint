import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    ImageSourcePropType,
} from 'react-native';

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

const HomeScreen: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
    const [selectedDistance, setSelectedDistance] = useState<string>('');
    const [selectedRating, setSelectedRating] = useState<string>('');

    // Dummy trainer data with proper typing
    const trainers: Trainer[] = [
        {
            id: 1,
            name: 'Sarah Miller',
            rating: 4.8,
            reviews: 123,
            distance: '1.2 miles away',
            specialization: 'Obedience Training',
        },
        {
            id: 2,
            name: 'Mark Thompson',
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

    const handleMenuPress = (): void => {
        console.log('Menu pressed');
        // Implement menu navigation logic
    };

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

    const BottomNavItem: React.FC<BottomNavItemProps> = ({
        title,
        isActive = false,
        onPress
    }) => (
        <TouchableOpacity
            style={styles.navItem}
            onPress={onPress || (() => handleBottomNavPress(title))}
            activeOpacity={0.7}
        >
            <View style={[styles.navIcon, isActive && styles.activeNavIcon]} />
            <Text style={[styles.navText, isActive && styles.activeNavText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={handleMenuPress}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuLine} />
                    <View style={styles.menuLine} />
                    <View style={styles.menuLine} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Home</Text>
                <View style={styles.headerSpacer} />
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
                <BottomNavItem title="Home" isActive={true} />
                <BottomNavItem title="Bookings" />
                <BottomNavItem title="Messages" />
                <BottomNavItem title="Profile" />
            </View>
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
    menuLine: {
        width: 20,
        height: 2,
        backgroundColor: '#333',
        marginVertical: 2,
        borderRadius: 1,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerSpacer: {
        width: 30,
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
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        gap: 5,
        paddingVertical: 5,
    },
    navIcon: {
        width: 24,
        height: 24,
        backgroundColor: '#CCC',
        borderRadius: 4,
    },
    activeNavIcon: {
        backgroundColor: '#333',
    },
    navText: {
        fontSize: 12,
        color: '#999',
        fontWeight: '400',
    },
    activeNavText: {
        color: '#333',
        fontWeight: '500',
    },
});

export default HomeScreen;