import { Image, StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../constants/Colors'

// Navigation
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from '../../App'

type LandingProps = NativeStackScreenProps<RootStackParamList, 'Landing'>

const Landing = ({ navigation }: LandingProps) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.heading}>Woof Point</Text>
                    <Text style={styles.subHeading}>Connect with certified dog trainers
                        in your area</Text>
                    <Image
                        style={styles.heroImage}
                        source={{
                            uri: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI1LTA3L3NyLWltYWdlLTE5MDYyNS1iZTAzLXMtNTY3LWJhbm5lci1tY29ldWlkdy5qcGc.jpg"
                        }}
                    />
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                    >
                        <Text onPress={() => navigation.navigate("OwnerHome", { token: "" })} style={styles.buttonText}>Explore Trainers</Text>
                    </TouchableOpacity>

                    <View style={styles.authButtonsContainer}>
                        <TouchableOpacity
                            style={styles.authButton}
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text style={styles.buttonText}>Log In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.authButton}
                            onPress={() => navigation.navigate("Signup")}
                        >
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Landing

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff2e6',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    headerSection: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        flex: 1,
    },
    heading: {
        fontSize: 36,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 10,
        textAlign: 'center',
    },
    subHeading: {
        fontSize: 18,
        fontWeight: '400',
        color: Colors.secondary,
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 10,
        maxWidth: 300
    },
    heroImage: {
        height: 280,
        width: '90%',
        maxWidth: 350,
        borderRadius: 20,
        borderWidth: 4,
        borderColor: '#E97B47',
    },
    bottomSection: {
        backgroundColor: 'white',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    primaryButton: {
        backgroundColor: '#E97B47',
        paddingHorizontal: 10,
        paddingVertical: 12,
        width: '50%',
        maxWidth: 300,
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#E97B47',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    authButtonsContainer: {
        flexDirection: 'row',
        width: '90%',
        maxWidth: 300,
        justifyContent: 'space-between',
        gap: 15,
    },
    authButton: {
        backgroundColor: '#E97B47',
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#E97B47',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
})