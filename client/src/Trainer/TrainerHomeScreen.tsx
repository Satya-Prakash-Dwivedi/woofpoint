import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Menu01Icon, Home09Icon, Calendar02Icon, BubbleChatIcon, UserCircleIcon, CancelCircleIcon, FileEditIcon, LogoutSquare02Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

const PRIMARY = "#E97B47";

const dummySummary = {
    bookings: 3,
    earnings: 150,
    messages: 5,
};

const dummySessions = [
    {
        id: "1",
        name: "Max",
        time: "10:00 AM - 11:00 AM",
        avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
        id: "2",
        name: "Bella",
        time: "1:00 PM - 2:00 PM",
        avatar: "https://i.pravatar.cc/100?img=45",
    },
    {
        id: "3",
        name: "Charlie",
        time: "4:00 PM - 5:00 PM",
        avatar: "https://i.pravatar.cc/100?img=32",
    },
];

type Props = NativeStackScreenProps<RootStackParamList, "TrainerHome">;

const TrainerHome: React.FC<Props> = ({ navigation, route }) => {
    const { token } = route.params;
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const handleEditProfile = () => {
        setIsMenuVisible(false);
        navigation.navigate('EditTrainerProfile', { token });
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

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {/* Left Spacer */}
                {/* <View style={{ width: 28 }} /> */}
                <Text style={styles.headerTitle}>Summary</Text>

                {/* Hamburger Icon */}
                <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                    <HugeiconsIcon
                        icon={Menu01Icon}
                        size={30}
                        strokeWidth={1.5}
                    />
                </TouchableOpacity>
            </View>

            {/* Summary */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Today's Bookings</Text>
                    <Text style={styles.summaryValue}>{dummySummary.bookings}</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Earnings</Text>
                    <Text style={styles.summaryValue}>${dummySummary.earnings}</Text>
                </View>
                <View style={[styles.summaryCard, { flex: 1 }]}>
                    <Text style={styles.summaryLabel}>Messages</Text>
                    <Text style={styles.summaryValue}>{dummySummary.messages}</Text>
                </View>
            </View>

            {/* Upcoming */}
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            <FlatList
                data={dummySessions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.sessionCard}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        <View>
                            <Text style={styles.sessionName}>
                                Training Session with {item.name}
                            </Text>
                            <Text style={styles.sessionTime}>{item.time}</Text>
                        </View>
                    </View>
                )}
            />

            {/* Bottom Nav */}
            <View style={styles.navBar}>
                <TouchableOpacity>
                    <HugeiconsIcon
                        icon={Home09Icon}
                        size={30}
                        strokeWidth={1.5}
                        color="black"
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <HugeiconsIcon
                        icon={Calendar02Icon}
                        size={30}
                        strokeWidth={1.5}
                        color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <HugeiconsIcon
                        icon={BubbleChatIcon}
                        size={30}
                        strokeWidth={1.5}
                        color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("TrainerProfile")}>
                    <HugeiconsIcon
                        icon={UserCircleIcon}
                        size={30}
                        strokeWidth={1.5}
                        color="black" />
                </TouchableOpacity>
            </View>

            {/* Hamburger Menu Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                // backdropColor={'black'}
                visible={isMenuVisible}
                onRequestClose={() => setIsMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setIsMenuVisible(false)}
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

export default TrainerHome;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    headerTitle: { fontSize: 18, fontWeight: "600", position: 'absolute', left: 0, right: 0, textAlign: 'center' },
    menuButton: {
        marginLeft: "auto",
    },
    sectionTitle: { fontSize: 18, fontWeight: "700", marginLeft: 16, marginTop: 8 },
    summaryContainer: {
        flexDirection: "row",
        margin: 16,
        justifyContent: "space-between",
    },
    summaryCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    summaryLabel: { fontSize: 14, color: "#555" },
    summaryValue: { fontSize: 20, fontWeight: "700", marginTop: 8 },
    sessionCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 1,
    },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
    sessionName: { fontSize: 16, fontWeight: "600" },
    sessionTime: { fontSize: 14, color: "#777" },
    navBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: "#eee",
    },

    // Hamburger Menu Styles
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