import React, { useState } from "react";
import { View, Text, Image, Alert, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { launchImageLibrary, Asset } from "react-native-image-picker";
import axios from "axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "UploadPhoto">;

const UploadPhoto: React.FC<Props> = ({ navigation, route }) => {
    const { token, role } = route.params;
    const [photo, setPhoto] = useState<Asset | null>(null);
    const [uploading, setUploading] = useState(false);

    const pickImage = () => {
        launchImageLibrary(
            { mediaType: "photo", quality: 0.7 },
            (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    Alert.alert("Error", response.errorMessage || "Something went wrong");
                    return;
                }
                if (response.assets && response.assets.length > 0) {
                    setPhoto(response.assets[0]);
                }
            }
        );
    };

    const uploadImage = async () => {
        if (!photo || !photo.uri) {
            Alert.alert("Please select an image first");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("profilePhoto", {
            uri: photo.uri,
            type: photo.type || "image/jpeg",
            name: photo.fileName || "photo.jpg",
        } as any);

        try {
            console.log('Starting upload...');
            const res = await axios.post(
                "http://localhost:3001/api/auth/upload-photo",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${route.params.token}`,
                    },
                }
            );

            console.log('Upload response:', res.data);
            Alert.alert("Success", "Photo uploaded successfully");

            // Redirect based on role
            if (route.params.role === "trainer") {
                navigation.replace("TrainerHome", { token });
            } else {
                navigation.replace("OwnerHome", { token });
            }
        } catch (err: any) {
            console.error('Upload error:', err);
            const errorMessage = err.response?.data?.error ||
                err.response?.data?.details ||
                err.message ||
                'Upload failed';
            Alert.alert("Upload failed", errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Upload Profile Photo</Text>
                    <Text style={styles.subtitle}>
                        Add a photo to personalize your profile
                    </Text>
                </View>

                {/* Photo Container */}
                <View style={styles.photoContainer}>
                    <View style={styles.imageWrapper}>
                        {photo?.uri ? (
                            <Image source={{ uri: photo.uri }} style={styles.image} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Text style={styles.placeholderText}>No photo selected</Text>
                            </View>
                        )}

                        {/* Overlay for selected image */}
                        {photo?.uri && (
                            <TouchableOpacity
                                style={styles.editOverlay}
                                onPress={pickImage}
                                disabled={uploading}
                            >
                                <Text style={styles.editText}>✏️</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Image Info */}
                    {photo?.uri && (
                        <View style={styles.imageInfo}>
                            <Text style={styles.imageInfoText}>
                                {photo.fileName || 'Selected Image'}
                            </Text>
                            {photo.fileSize && (
                                <Text style={styles.fileSizeText}>
                                    {(photo.fileSize / 1024 / 1024).toFixed(2)} MB
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.pickButton]}
                        onPress={pickImage}
                        disabled={uploading}
                    >
                        <Text style={styles.pickButtonText}>
                            {photo?.uri ? ' Choose Different Photo' : 'Pick a Photo'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.uploadButton,
                            (!photo?.uri || uploading) && styles.disabledButton
                        ]}
                        onPress={uploadImage}
                        disabled={!photo?.uri || uploading}
                    >
                        {uploading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text style={styles.uploadButtonText}>Uploading...</Text>
                            </View>
                        ) : (
                            <Text style={styles.uploadButtonText}>
                                Upload Photo
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Skip Option */}
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => {
                        if (route.params.role === "trainer") {
                            navigation.replace("TrainerHome", { token });
                        } else {
                            navigation.replace("OwnerHome", { token });
                        }
                    }}
                    disabled={uploading}
                >
                    <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#2C3E50",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#7F8C8D",
        textAlign: "center",
        lineHeight: 22,
    },
    photoContainer: {
        alignItems: "center",
        marginBottom: 50,
    },
    imageWrapper: {
        position: "relative",
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: "#E97B47",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 12,
    },
    placeholderContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "#FFFFFF",
        borderWidth: 3,
        borderColor: "#E0E6ED",
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
    },
    placeholderIcon: {
        marginBottom: 12,
    },
    placeholderIconText: {
        fontSize: 48,
        opacity: 0.6,
    },
    placeholderText: {
        fontSize: 16,
        color: "#95A5A6",
        fontWeight: "500",
    },
    editOverlay: {
        position: "absolute",
        bottom: 8,
        right: 8,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E97B47",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    editText: {
        fontSize: 18,
        color: "#FFF",
    },
    imageInfo: {
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    imageInfoText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2C3E50",
        marginBottom: 4,
    },
    fileSizeText: {
        fontSize: 12,
        color: "#7F8C8D",
    },
    buttonContainer: {
        gap: 16,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 56,
    },
    pickButton: {
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#E97B47",
        shadowColor: "#E97B47",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    pickButtonText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#E97B47",
    },
    uploadButton: {
        backgroundColor: "#E97B47",
        shadowColor: "#E97B47",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    uploadButtonText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    disabledButton: {
        backgroundColor: "#BDC3C7",
        shadowOpacity: 0,
        elevation: 0,
    },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    skipButton: {
        marginTop: 24,
        paddingVertical: 12,
        alignItems: "center",
    },
    skipText: {
        fontSize: 16,
        color: "#95A5A6",
        fontWeight: "500",
        textDecorationLine: "underline",
    },
});

export default UploadPhoto;