import React, { useState } from 'react';
import { View, Modal, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddIngredientModal = ({ visible, onClose,showNew }) => {
  const [ingredientInput, setIngredientInput] = useState('');

  const handleAddIngredient = async () => {
    const ingredients = ingredientInput.split(',').map((ingredient) => ingredient.trim());
    console.log('Entered Ingredients:', ingredients);
    try {
    // Split the input string by commas and trim each ingredient
    const trimmedIngredients = ingredientInput.split(',').map(ingredient => ingredient.trim());
    
    // Filter out any empty strings
    const validIngredients = trimmedIngredients.filter(ingredient => ingredient.length > 0);

    // Create an array to hold the new ingredient objects
    const newIngredients = validIngredients.map((name, index) => ({
      id: Date.now().toString() + index, // Generate unique IDs for each ingredient
      name
    }));

    // Retrieve existing ingredients from AsyncStorage
    const existingIngredients = await AsyncStorage.getItem('ingredients');
    const existingIngredientsArray = existingIngredients ? JSON.parse(existingIngredients) : [];

    // Add the new ingredients to the existing array
    const updatedIngredients = [...existingIngredientsArray, ...newIngredients];

    // Store the updated array back in AsyncStorage
    await AsyncStorage.setItem('ingredients', JSON.stringify(updatedIngredients));

    console.log('updatedIngredients is ',updatedIngredients)
    showNew();
    // Update state to reflect the new ingredients

    // Clear the input field
    setIngredientInput('');
  } catch (error) {
    console.error('Error adding ingredients:', error);
  }

    // Close the modal
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Ingredient</Text>
          <TextInput
            placeholder="Enter ingredient(s) separated by comma"
            value={ingredientInput}
            onChangeText={setIngredientInput}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleAddIngredient} style={styles.addButton}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    maxWidth: 700,
    alignItems: 'center'
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10
  },
  addButton: {
    backgroundColor: '#FDA738',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    width: '100%'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  }
});

export default AddIngredientModal;
