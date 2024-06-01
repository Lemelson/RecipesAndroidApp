import React, { useState,useEffect } from 'react';
import { View, Image, TextInput, Modal, TouchableOpacity, Text, FlatList, ScrollView } from 'react-native';
import { Button, Card,Searchbar } from 'react-native-paper';
import styles from '../styles/styles';
import { useNavigation } from '@react-navigation/native';
import RecipeCard from '../card/RecipeCard';
import BottomNav from '../card/BottomNav';
import { auth } from '../../Firebase/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';




const Favourite = () => {
   const [searchQuery, setSearchQuery] = React.useState('');
     const [favorites, setFavorites] = React.useState([]);

          const handleLogout = async () => {
    try {
      // Get all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
  
      // Get all data corresponding to the keys
      const data = await AsyncStorage.multiGet(keys);
  
      // Log all data
      console.log("Data in AsyncStorage before deletion:");
      data.forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });
  
      // Clear all data from AsyncStorage
      await AsyncStorage.clear();
      console.log('Data Cleared', 'All data has been cleared.');
      await auth.signOut();
      console.log('User Logged Out', 'All data has been cleared.');
  
      
      
      // Navigate to the login screen or any other appropriate screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
    }); // Replace 'LoginScreen' with the appropriate screen name
    } catch (error) {
      console.error('Error during data clearing:', error);
    }
  };
  
     const fetchFavorites = async () => {
  try {
    const favorites = await AsyncStorage.getItem('favorites');
    if (favorites) {
      setFavorites(JSON.parse(favorites));
      console.log('Fav is ',favorites)
    }
  } catch (error) {
    console.error('Error fetching favorites:', error);
  }
};

// Call fetchFavorites in useEffect to fetch favorites when the component mounts
useEffect(() => {
  fetchFavorites();
}, []);


   const navigation = useNavigation();

  const handleRecipeClick = (item) => {
    console.log(`Clicked on recipe: ${item}`);
        navigation.navigate('Detail',{detail:item})
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity onPress={() => handleRecipeClick(item)}>
      <RecipeCard title={item.title} serving={item.image} show={true}/>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <View style={[styles.searchFlex,{}]}>
          <Searchbar
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{ elevation: 0 }} // Set elevation to 0 to prevent content from moving up
          />
        </View>
       
       <View style={{ flex: 0.83 }}>
        <Text style={styles.suggestText}>Favourite Recipe</Text>
        {favorites.length > 0 ? (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipe}
            showsVerticalScrollIndicator={false} // Set this prop to false
          />
        ) : (
          <Text style={styles.notFound}>
            No  Favourite found
          </Text>
        )}
      </View>
        <View style={{ flex: 0.07}}>
          <BottomNav/>
        </View>
      </View>
    </View>
  );
};

export default Favourite;
