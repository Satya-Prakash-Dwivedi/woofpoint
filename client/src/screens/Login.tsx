import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const Login = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>Log In</Text>
            </View>
            <View style={styles.topSection}>
                <Text style={styles.topSectionHeading}>Welcome Back</Text>
                <Text style={styles.topSectionText}>Log in to continue</Text>
            </View>
            <View style={styles.formSection}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} placeholder='Enter your email' placeholderTextColor={'#999'}
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput style={styles.input} placeholder='Enter your password'
                        placeholderTextColor={'#999'}
                        secureTextEntry
                    />
                </View>
            </View>
            <View>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Log In</Text>
                </View>
                <View style={styles.forgot}>
                    <Text style={styles.forgotText}>Forgot Password ?</Text>
                </View>
                <View style={styles.bottomSection} >
                    <Text style={styles.bottomText}>Don't have an account?</Text>
                    <Text style={[styles.bottomText, { color: '#e88b5a' }]}>  Sign Up</Text>
                </View>
            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        backgroundColor: '#FEFBF6',
        height: 750
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 600,
        color: '#e88b5a'
    },
    topSection: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        margin: 20
    },
    topSectionHeading: {
        fontSize: 30,
        fontWeight: 600
    },
    topSectionText: {
        fontSize: 16,
        fontWeight: 600
    },
    formSection: {
        marginVertical: 40
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 600,
        marginLeft: 10,
        paddingVertical: 10
    },
    input: {
        fontSize: 14,
        fontWeight: 400,
        marginHorizontal: 15,
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        color: '#000'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e88b5a',
        padding: 12,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 20,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 700,
        color: '#fff'
    },
    forgot: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        margin: 10
    },
    forgotText: {
        fontSize: 14,
        fontWeight: 700,
        color: '#e88b5a'
    },
    bottomSection: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
    },
    bottomText: {
        fontSize: 16,
        fontWeight: 600
    }
})