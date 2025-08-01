import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
    selectImage: () => void;
}

const UploadButton: React.FC<Props> = ({ selectImage }) => (
    <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
        <Text style={styles.uploadButtonText}>Select Profile Photo</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    uploadButton: {
        height: 50,
        width: 300,
        backgroundColor: '#E97B47',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#E97B47',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 6,
        alignSelf: 'center', // centers the button horizontally
        marginVertical: 12,  // space above and below
    },
    uploadButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.1,
    },
});

export default UploadButton;
