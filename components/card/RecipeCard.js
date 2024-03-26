import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button, Modal, Portal, Card, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/styles';

const RecipeCard = ({ title, serving, show, modalVisible, setModalVisible, onPress, fetchIn, item ,component,fav}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if the item is already favorited when the component mounts
    checkIsFavorite();
  }, []);

  const checkIsFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const parsedFavorites = JSON.parse(favorites);
        const isFav = parsedFavorites.some(fav => fav.id === item.id);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.log('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      let favorites = await AsyncStorage.getItem('favorites');
      console.log('Item i getted is ',favorites)
      favorites = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(fav => fav !== null && fav.id !== item.id);

        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        console.log('Removed is ',updatedFavorites)
        if(component=='Fav'){
            fav()
        }
      } else {
        // Add to favorites
        favorites.push(item);
        console.log('Added is ',favorites)
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDeleteIngredient = async () => {
    try {
      
      const existingIngredients = await AsyncStorage.getItem('ingredients');
      const existingIngredientsArray = existingIngredients ? JSON.parse(existingIngredients) : [];
      const updatedIngredients = existingIngredientsArray.filter(ingredient => ingredient.id !== title.id);
      await AsyncStorage.setItem('ingredients', JSON.stringify(updatedIngredients));
      fetchIn();
    } catch (error) {
      console.log('Error removing ingredient:', error);
    }
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => show ? onPress() : setModalVisible(!modalVisible)}>
        <Card style={{ marginTop: 10, backgroundColor: "#FDA738" }}>
          <Card.Content>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {show ? (
                <>
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      resizeMode: 'cover',
                      borderRadius: 40,
                    }}
                    source={{ uri: serving }}
                  />
                  <Text variant="titleLarge" style={styles.title} numberOfLines={1} ellipsizeMode="clip">{title}</Text>
                </>
              ) : (
                <>
                  {title != undefined && title !== null && (
                    <Text variant="titleLarge" style={styles.title} numberOfLines={1} ellipsizeMode="clip">{title.name}</Text>
                  )}
                </>
              )}
              {show && (
                <IconButton
                  icon={isFavorite ? 'heart' : 'heart-outline'}
                  color={isFavorite ? 'red' : 'white'}
                  size={25}
                  style={customStyles.favoriteIcon}
                  onPress={toggleFavorite}
                />
              )}
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>

      <Portal>
        <Modal visible={modalVisible} dismissable={false} contentContainerStyle={customStyles.modalContainer}>
          <View style={customStyles.modalContent}>
            <Text style={customStyles.modalText}>Are you sure you want to delete the ingredient?</Text>
            <Button mode="contained" style={customStyles.deleteButton} onPress={handleDeleteIngredient}>Delete Ingredient</Button>
            <Button mode="outlined" onPress={() => setModalVisible(false)}>Cancel</Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const customStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalContent: {
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  deleteButton: {
    marginBottom: 10,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default RecipeCard;
