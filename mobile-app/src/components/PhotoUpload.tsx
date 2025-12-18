import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Camera, X, Image as ImageIcon } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface PhotoUploadProps {
  photos: string[];
  onAddPhoto: () => void;
  onRemovePhoto: (index: number) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photos,
  onAddPhoto,
  onRemovePhoto,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fotoğraf Ekle (Opsiyonel)</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
            <Pressable
              style={styles.removeButton}
              onPress={() => onRemovePhoto(index)}
            >
              <X size={16} color={Colors.surface} />
            </Pressable>
          </View>
        ))}
        {photos.length < 5 && (
          <Pressable style={styles.addButton} onPress={onAddPhoto}>
            <Camera size={24} color={Colors.primary} />
            <Text style={styles.addButtonText}>Fotoğraf Ekle</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background,
  },
  addButtonText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

