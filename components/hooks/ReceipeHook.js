import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useRecipeHook = () => {
  const [recipes, setRecipes] = useState([]);
  const API_KEY = '2581b5abfc7c4fe6922f5e07b301f77f';

  useEffect(() => {
    console.log('recipe Hook is called...')
    const fetchsSuggest = async () => {
      try {
        const existingIngredients = await AsyncStorage.getItem('ingredients');
        const existingIngredientsArray = existingIngredients ? JSON.parse(existingIngredients) : [];
        
        console.log('array  is ',existingIngredientsArray)
        if (existingIngredientsArray.length > 0) {
        const ingredientNames = existingIngredientsArray.map(ingredient => ingredient.name).join(',+');
          console.log('ingrdients is ',ingredientNames)
          const apiKey = 'your_api_key'; // Replace 'your_api_key' with your actual API key
          const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientNames}&apiKey=${API_KEY}`;
          console.log('url is ',url)
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch recipes');
          }
          
          const data = await response.json();
          setRecipes(data);
          // console.log('Suggested Data is ',data)
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchsSuggest();
  }, []);

  return recipes;
};

export default useRecipeHook;
