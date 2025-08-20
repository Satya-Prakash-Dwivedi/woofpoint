import React, { useState } from "react";
import { View, Button, Image, Alert, StyleSheet } from "react-native";
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
        <View style={styles.container}>
            {photo?.uri && (
                <Image source={{ uri: photo.uri }} style={styles.image} />
            )}
            <Button title="Pick a Photo" onPress={pickImage} />
            <Button
                title={uploading ? "Uploading..." : "Upload Photo"}
                onPress={uploadImage}
                disabled={uploading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    image: { width: 200, height: 200, borderRadius: 100, marginBottom: 20 },
});

export default UploadPhoto;