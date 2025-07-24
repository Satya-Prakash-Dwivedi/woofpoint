import { Image, StyleSheet, Text, View, SafeAreaView, ScrollView, Button, TouchableOpacity } from 'react-native'
import React from 'react'

// Navigation
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from '../../App'

type LandingProps = NativeStackScreenProps<RootStackParamList, 'Landing'>

const Landing = ({ navigation }: LandingProps) => {
    return (
        <SafeAreaView style={{ backgroundColor: '#fff2e6' }}>
            <ScrollView>
                <View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.heading}>Woof Point</Text>
                        <Text style={styles.subHeading}>Connect with certified dog trainers in your area</Text>
                        <Image style={styles.Image} source={{
                            uri: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI1LTA3L3NyLWltYWdlLTE5MDYyNS1iZTAzLXMtNTY3LWJhbm5lci1tY29ldWlkdy5qcGc.jpg"
                        }} />
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.subHeadingtwo}>Why Choose Woof Point?</Text>
                        <View style={styles.card}>
                            <View style={styles.cardCircle}>
                                <Image style={styles.cardImage}
                                    source={{
                                        uri: "https://images.rawpixel.com/image_png_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA0L2pvYjY4NS04OS1wLnBuZw.png"
                                    }} />
                            </View>
                            <Text style={styles.cardHeading}>
                                Verified Experts
                            </Text>
                            <Text style={styles.cardSubHeading}>
                                Certified professionals with proven track record
                            </Text>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.cardCircle}>
                                <Image style={styles.cardImage}
                                    source={{
                                        uri: "https://img.freepik.com/free-vector/target-goal-with-arrow-flat-style_78370-8120.jpg"
                                    }} />
                            </View>
                            <Text style={styles.cardHeading}>
                                Tailored Training
                            </Text>
                            <Text style={styles.cardSubHeading}>
                                Custom programs designed for your dog's unique needs
                            </Text>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.cardCircle}>
                                <Image style={styles.cardImage}
                                    source={{
                                        uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXjlajDWJaboK5yVOvA4Dn3o0N2GhEuz44AQ&s"
                                    }} />
                            </View>
                            <Text style={styles.cardHeading}>
                                Track Progress
                            </Text>
                            <Text style={styles.cardSubHeading}>
                                Monitor Development and celebrate every milestone
                            </Text>
                        </View>
                    </View>
                    <View style={styles.Bottom}>
                        <View style={styles.BottomButton}>
                            <Text style={styles.BottomText}>Explore Trainers</Text>
                        </View>
                        <View style={{ flex: 2, flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.BottomAuth]}
                            >
                                <Button
                                    color={'white'}
                                    title='Log In'
                                    onPress={() => navigation.navigate("Login")}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.BottomAuth]}
                            >
                                <Button
                                    color={'white'}
                                    title='Sign Up'
                                    onPress={() => navigation.navigate("Signup")}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Landing

const styles = StyleSheet.create({
    heading: {
        fontSize: 35,
        fontWeight: '700',
        margin: 10
    },
    subHeading: {
        fontSize: 18,
        fontWeight: 400,
        color: '#6C7A89'
    },
    Image: {
        height: 250,
        width: 350,
        borderRadius: 20,
        borderWidth: 4,
        borderColor: 'orange',
        margin: 20
    },
    subHeadingtwo: {
        fontWeight: 600,
        fontSize: 20,
        marginBottom: 20
    },
    card: {
        width: 330,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.25,
        boxShadow: 'black',
        borderRadius: 10,
        padding: 20,
        margin: 20
    },
    cardCircle: {
        height: 50,
        width: 50,
        backgroundColor: 'orange',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    cardImage: {
        height: 30,
        width: 30,
        borderRadius: 50
    },
    cardHeading: {
        fontSize: 19,
        fontWeight: 600,
        margin: 10
    },
    cardSubHeading: {
        fontSize: 16,
        fontWeight: 500,
        color: 'grey',
        textAlign: 'center'
    },
    Bottom: {
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 20,
        marginTop: 30,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        shadowColor: 'grey',
        shadowOpacity: 0.25,
    },
    BottomButton: {
        backgroundColor: 'orange',
        padding: 10,
        width: 300,
        alignItems: 'center',
        borderRadius: 10
    },
    BottomText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 600,
        textAlign: 'center'
    },
    BottomAuth: {
        backgroundColor: 'orange',
        width: 145,
        marginTop: 10,
        borderRadius: 10,
        color: 'white'
    },
})