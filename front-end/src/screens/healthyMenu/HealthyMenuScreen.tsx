import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../../components/ScreenBackground';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';

interface Recipe {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  category: string;
  image?: string;
}

const HealthyMenuScreen = ({ navigation }: any) => {
  const { currentTheme } = useTheme();
  const { showToast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' },
    { id: 'breakfast', name: 'Breakfast', icon: 'sunny' },
    { id: 'lunch', name: 'Lunch', icon: 'restaurant' },
    { id: 'dinner', name: 'Dinner', icon: 'moon' },
    { id: 'snack', name: 'Snacks', icon: 'nutrition' },
    { id: 'vegetarian', name: 'Vegetarian', icon: 'leaf' },
  ];

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchQuery, selectedCategory, recipes]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      
      // Mock data
      const mockRecipes: Recipe[] = [
        {
          id: '1',
          name: 'Grilled Salmon with Quinoa',
          description: 'Healthy omega-3 rich meal perfect for dinner',
          calories: 450,
          protein: 35,
          carbs: 40,
          fat: 15,
          prepTime: 25,
          difficulty: 'Medium',
          category: 'dinner',
          ingredients: ['Salmon fillet', 'Quinoa', 'Broccoli', 'Lemon', 'Olive oil'],
          instructions: ['Cook quinoa', 'Grill salmon', 'Steam broccoli', 'Serve with lemon'],
        },
        {
          id: '2',
          name: 'Greek Yogurt Parfait',
          description: 'Protein-packed breakfast with fresh berries',
          calories: 280,
          protein: 20,
          carbs: 35,
          fat: 8,
          prepTime: 5,
          difficulty: 'Easy',
          category: 'breakfast',
          ingredients: ['Greek yogurt', 'Berries', 'Granola', 'Honey'],
          instructions: ['Layer yogurt', 'Add berries', 'Top with granola', 'Drizzle honey'],
        },
        {
          id: '3',
          name: 'Chicken Buddha Bowl',
          description: 'Balanced meal with grilled chicken and veggies',
          calories: 520,
          protein: 42,
          carbs: 55,
          fat: 18,
          prepTime: 30,
          difficulty: 'Medium',
          category: 'lunch',
          ingredients: ['Chicken breast', 'Brown rice', 'Sweet potato', 'Kale', 'Avocado'],
          instructions: ['Grill chicken', 'Roast sweet potato', 'Cook rice', 'Assemble bowl'],
        },
        {
          id: '4',
          name: 'Veggie Stir-Fry',
          description: 'Colorful vegetable medley with tofu',
          calories: 320,
          protein: 15,
          carbs: 42,
          fat: 12,
          prepTime: 20,
          difficulty: 'Easy',
          category: 'vegetarian',
          ingredients: ['Tofu', 'Mixed vegetables', 'Soy sauce', 'Ginger', 'Garlic'],
          instructions: ['Cut vegetables', 'Press tofu', 'Stir-fry everything', 'Add sauce'],
        },
        {
          id: '5',
          name: 'Energy Protein Balls',
          description: 'No-bake snack packed with protein',
          calories: 150,
          protein: 8,
          carbs: 18,
          fat: 6,
          prepTime: 15,
          difficulty: 'Easy',
          category: 'snack',
          ingredients: ['Oats', 'Peanut butter', 'Honey', 'Protein powder', 'Dark chocolate chips'],
          instructions: ['Mix ingredients', 'Roll into balls', 'Refrigerate', 'Enjoy'],
        },
      ];

      setRecipes(mockRecipes);
    } catch (error) {
      showToast('Failed to load recipes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = [...recipes];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.ingredients.some(i => i.toLowerCase().includes(query))
      );
    }

    setFilteredRecipes(filtered);
  };

  const renderRecipeCard = (recipe: Recipe) => (
    <TouchableOpacity
      key={recipe.id}
      style={[styles.recipeCard, { backgroundColor: currentTheme.cardBackground }]}
      activeOpacity={0.8}
    >
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      ) : (
        <View style={[styles.recipePlaceholder, { backgroundColor: currentTheme.primary + '20' }]}>
          <Ionicons name="restaurant" size={40} color={currentTheme.primary} />
        </View>
      )}

      <View style={styles.recipeContent}>
        <Text style={[styles.recipeName, { color: currentTheme.text }]} numberOfLines={2}>
          {recipe.name}
        </Text>

        <Text style={[styles.recipeDescription, { color: currentTheme.textSecondary }]} numberOfLines={2}>
          {recipe.description}
        </Text>

        <View style={styles.recipeInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={16} color={currentTheme.textSecondary} />
            <Text style={[styles.infoText, { color: currentTheme.textSecondary }]}>
              {recipe.prepTime} phút
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="flame" size={16} color="#FF6B6B" />
            <Text style={[styles.infoText, { color: currentTheme.text }]}>
              {recipe.calories} cal
            </Text>
          </View>
        </View>

        <View style={styles.macroRow}>
          <Text style={[styles.macroValue, { color: currentTheme.text }]}>P: {recipe.protein}g</Text>
          <Text style={[styles.macroValue, { color: currentTheme.text }]}>C: {recipe.carbs}g</Text>
          <Text style={[styles.macroValue, { color: currentTheme.text }]}>F: {recipe.fat}g</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={[styles.title, { color: currentTheme.text }]}>Healthy Menu</Text>

        <View style={[styles.searchBar, { backgroundColor: currentTheme.cardBackground }]}>
          <Ionicons name="search" size={20} color={currentTheme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: currentTheme.text }]}
            placeholder="Search recipes..."
            placeholderTextColor={currentTheme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={currentTheme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: selectedCategory === category.id
                    ? currentTheme.primary
                    : currentTheme.cardBackground,
                }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={20}
                color={selectedCategory === category.id ? '#FFF' : currentTheme.text}
              />
              <Text
                style={[
                  styles.categoryText,
                  { color: selectedCategory === category.id ? '#FFF' : currentTheme.text }
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={currentTheme.primary} />
          </View>
        ) : (
          <ScrollView style={styles.recipesContainer} showsVerticalScrollIndicator={false}>
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map(renderRecipeCard)
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="restaurant-outline" size={64} color={currentTheme.textSecondary} />
                <Text style={[styles.emptyText, { color: currentTheme.textSecondary }]}>
                  No recipes found
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
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
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    maxHeight: 60,
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipesContainer: {
    flex: 1,
  },
  recipeCard: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeImage: {
    width: 120,
    height: 160,
  },
  recipePlaceholder: {
    width: 120,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeContent: {
    flex: 1,
    padding: 12,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  recipeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  recipeDescription: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  recipeInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroItem: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  macroValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default HealthyMenuScreen;
