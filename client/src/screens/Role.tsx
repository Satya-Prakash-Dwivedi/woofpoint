import { Button, Image, StyleSheet, Text, View, } from 'react-native'
import React from 'react'

const Role = () => {
    return (
        <View style={{ backgroundColor: '#fff2e6', height: 750 }}>
            <View style={styles.topSection}>
                <Text style={styles.heading}>Welcome!</Text>
                <Text style={styles.subHeading}>Choose how you'd like to join our community </Text>
            </View>
            <View style={styles.middleSection}>
                <View style={styles.card}>
                    <View style={styles.cardCircle}>
                        <Image style={styles.cardImage} source={{
                            uri: "https://images.rawpixel.com/image_png_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA0L2pvYjY4NS04OS1wLnBuZw.png"
                        }} />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.cardHeading}>I'm a Dog Owner</Text>
                        <Text style={styles.cardSubHeading}>Find the perfect trainer for your funny friend</Text>
                    </View>
                </View>
                <View style={styles.card}>
                    <View style={styles.cardCircle}>
                        <Image style={styles.cardImage} source={{
                            uri: "https://i.pinimg.com/736x/f6/7d/0e/f67d0eda913232d983e24d2ad4440d96.jpg"
                        }} />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.cardHeading}>I'm a Dog Trainer</Text>
                        <Text style={styles.cardSubHeading}>Share your expertise and grow your business</Text>
                    </View>
                </View>
            </View>
            <View style={styles.bottomSection}>
                <Text style={styles.bottomText}>Already have an account?</Text>
                <View style={styles.bottomButton}>
                    <Text style={styles.bottomText}>Sign in</Text>
                </View>
            </View>
        </View>
    )
}

export default Role

const styles = StyleSheet.create({
    topSection: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        margin: 20,
        marginTop: 30
    },
    heading: {
        fontSize: 40,
        fontWeight: 500
    },
    subHeading: {
        fontSize: 18,
        fontWeight: 500,
        color: 'grey',
        textAlign: 'center'
    },
    middleSection: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        marginTop: 50
    },
    card: {
        width: 300,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: 'grey',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowOpacity: 1
    },
    cardCircle: {
        width: 70,
        height: 70,
        backgroundColor: 'orange',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardImage: {
        width: 40,
        height: 40,
        borderRadius: 50
    },
    cardHeading: {
        fontSize: 18,
        marginBottom: 5,
        fontWeight: 600
    },
    cardSubHeading: {
        color: 'grey',
        textAlign: 'left',
        fontWeight: 500
    },
    cardText: {
        width: 150
    },
    bottomSection: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        marginTop: 80
    },
    bottomText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 500
    },
    bottomButton: {
        backgroundColor: 'orange',
        width: 80,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8
    }
})