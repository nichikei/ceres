import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ScreenBackground from '../../components/ScreenBackground';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';
import { recognizeFood } from '../../services/aiService';
import { createFoodLog } from '../../services/api';

interface RecognizedFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

const FoodRecognitionScreen = ({ navigation }: any) => {
  const { currentTheme } = useTheme();
  const { showToast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [recognizing, setRecognizing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recognizedFood, setRecognizedFood] = useState<RecognizedFood | null>(null);
  const [selectedMealType, setSelectedMealType] = useState('lunch');

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: 'sunny', color: '#FFA726' },
    { id: 'lunch', label: 'Lunch', icon: 'restaurant', color: '#42A5F5' },
    { id: 'dinner', label: 'Dinner', icon: 'moon', color: '#AB47BC' },
    { id: 'snack', label: 'Snack', icon: 'nutrition', color: '#66BB6A' },
  ];

  const pickImage = async (source: 'camera' | 'gallery') => {
    try {
      const permission = source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permission.status !== 'granted') {
        showToast(`${source === 'camera' ? 'Camera' : 'Gallery'} permission required`, 'error');
        return;
      }

      const launchOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3] as [number, number],
        quality: 0.7,
      };

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync(launchOptions)
        : await ImagePicker.launchImageLibraryAsync(launchOptions);

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setImage(imageUri);
        setRecognizedFood(null);
        await analyzeFoodImage(imageUri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      showToast('Failed to pick image', 'error');
    }
  };

  const analyzeFoodImage = async (imageUri: string) => {
    try {
      setRecognizing(true);
      
      // TODO: Replace with actual AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: RecognizedFood = {
        name: 'Grilled Chicken Breast',
        calories: 350,
        protein: 45,
        carbs: 5,
        fat: 16,
        confidence: 0.92,
      };
      
      setRecognizedFood(mockResult);
      showToast(`Nhận diện: ${mockResult.name}`, 'success');
    } catch (error) {
      showToast('Lỗi nhận diện', 'error');
    } finally {
      setRecognizing(false);
    }
  };

  const saveFoodLog = async () => {
    if (!recognizedFood) return;
    
    try {
      setSaving(true);
      await createFoodLog({
        foodName: recognizedFood.name,
        mealType: selectedMealType,
        calories: recognizedFood.calories,
        protein: recognizedFood.protein,
        carbs: recognizedFood.carbs,
        fat: recognizedFood.fat,
        eatenAt: new Date().toISOString(),
      });
      showToast('Saved!', 'success');
      navigation.goBack();
    } catch (error: any) {
      showToast('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { color: currentTheme.text }]}>Food Recognition</Text>

        {!image ? (
          <View style={styles.uploadContainer}>
            <View style={[styles.uploadPlaceholder, { borderColor: currentTheme.border }]}>
              <Ionicons name="camera-outline" size={64} color={currentTheme.textSecondary} />
              <Text style={[styles.uploadText, { color: currentTheme.textSecondary }]}>
                Take a photo or select from gallery
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: currentTheme.primary }]}
                onPress={() => pickImage('camera')}
              >
                <Ionicons name="camera" size={24} color="#FFF" />
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: currentTheme.secondary }]}
                onPress={() => pickImage('gallery')}
              >
                <Ionicons name="images" size={24} color="#FFF" />
                <Text style={styles.uploadButtonText}>From Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.foodImage} />
              <TouchableOpacity
                style={[styles.retakeButton, { backgroundColor: currentTheme.cardBackground }]}
                onPress={() => {
                  setImage(null);
                  setRecognizedFood(null);
                }}
              >
                <Ionicons name="refresh" size={20} color={currentTheme.text} />
                <Text style={[styles.retakeText, { color: currentTheme.text }]}>Retake</Text>
              </TouchableOpacity>
            </View>

            {recognizing ? (
              <View style={[styles.recognizingCard, { backgroundColor: currentTheme.cardBackground }]}>
                <ActivityIndicator size="large" color={currentTheme.primary} />
                <Text style={[styles.recognizingText, { color: currentTheme.text }]}>
                  Analyzing food...
                </Text>
              </View>
            ) : recognizedFood ? (
              <>
                <View style={[styles.resultCard, { backgroundColor: currentTheme.cardBackground }]}>
                  <View style={styles.resultHeader}>
                    <Text style={[styles.foodName, { color: currentTheme.text }]}>
                      {recognizedFood.name}
                    </Text>
                    <View style={[styles.confidenceBadge, { backgroundColor: currentTheme.primary }]}>
                      <Ionicons name="checkmark-circle" size={16} color="#FFF" />
                      <Text style={styles.confidenceText}>
                        {(recognizedFood.confidence * 100).toFixed(0)}%
                      </Text>
                    </View>
                  </View>

                  <View style={styles.macroRow}>
                    <Text style={[styles.macroText, { color: currentTheme.text }]}>
                      🔥 {recognizedFood.calories} cal • P: {recognizedFood.protein}g • C: {recognizedFood.carbs}g
                    </Text>
                  </View>
                </View>

                <Text style={[styles.sectionLabel, { color: currentTheme.text }]}>
                  Loại bữa ăn
                </Text>
                <View style={styles.mealTypeContainer}>
                  {mealTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.mealTypeButton,
                        {
                          backgroundColor: selectedMealType === type.id
                            ? type.color
                            : currentTheme.cardBackground,
                          borderColor: currentTheme.border,
                        }
                      ]}
                      onPress={() => setSelectedMealType(type.id)}
                    >
                      <Ionicons
                        name={type.icon as any}
                        size={24}
                        color={selectedMealType === type.id ? '#FFF' : currentTheme.text}
                      />
                      <Text
                        style={[
                          styles.mealTypeLabel,
                          { color: selectedMealType === type.id ? '#FFF' : currentTheme.text }
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    { backgroundColor: currentTheme.primary },
                    saving && styles.saveButtonDisabled
                  ]}
                  onPress={saveFoodLog}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={24} color="#FFF" />
                      <Text style={styles.saveButtonText}>Save to Diary</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  uploadContainer: {
    marginTop: 20,
  },
  uploadPlaceholder: {
    height: 300,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 8,
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  foodImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
  },
  retakeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  retakeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recognizingCard: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  recognizingText: {
    marginTop: 16,
    fontSize: 16,
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  foodName: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  confidenceText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  macroRow: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  macroText: {
    fontSize: 15,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  mealTypeButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  mealTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FoodRecognitionScreen;
