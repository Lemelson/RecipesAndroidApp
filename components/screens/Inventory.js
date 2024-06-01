import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Button, Searchbar } from 'react-native-paper';
import { auth } from '../../Firebase/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../styles/styles';
import RecipeCard from '../card/RecipeCard';
import BottomNav from '../card/BottomNav';
import AddIngredientModal from './AddIngredients';
import { useNavigation } from '@react-navigation/native';


const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedModalIndex, setSelectedModalIndex] = useState(null); // Track the index of the selected recipe card
  const [modalVisible, setModalVisible] = useState(false); // Track the modal visibility
  const navigation = useNavigation();

  
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

  useEffect(() => {
    fetchUniqueIngredients();
  }, []);

  const fetchUniqueIngredients = async () => {
    try {
      const existingIngredients = await AsyncStorage.getItem('ingredients');
      const existingIngredientsArray = existingIngredients ? JSON.parse(existingIngredients) : [];
      setInventoryItems(existingIngredientsArray);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const handleAddIngredient = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Toggle modal visibility and track the selected recipe card index
  const toggleModal = (index) => {
    if (index === selectedModalIndex) {
      setModalVisible(!modalVisible);
    } else {
      setSelectedModalIndex(index);
      setModalVisible(true);
    }
  };

  const renderRecipe = ({ item, index }) => {
    return (
      <RecipeCard
        title={item}
        serving={''}
        show={false}
        modalVisible={modalVisible && selectedModalIndex === index} // Pass down modal visibility for each recipe card
        setModalVisible={() => toggleModal(index)} // Pass down function to toggle modal visibility
        fetchIn={fetchUniqueIngredients}
      />
    );
  };

  // Filter inventory items based on search query
const filteredItems = useMemo(() => {
  if (!searchQuery) {
    return inventoryItems;
  } else {
    return inventoryItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }
}, [searchQuery, inventoryItems]);


  const filteredAndSortedItems = useMemo(() => {
    if (filteredItems && filteredItems.length > 0) {
      console.log('Recipe data is.... ', filteredItems);
      return filteredItems.sort(); // You can apply any sorting logic here
    } else {
      return filteredItems;
    }
  }, [filteredItems]);

  const memoizedModal = useMemo(() => (
    <AddIngredientModal visible={showModal} onClose={handleCloseModal} showNew={fetchUniqueIngredients} />
  ), [showModal]);

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
          <Button
              mode="outlined"
                      textColor="white"
                      rippleColor="#FFDDB0"
                      buttonColor="red"
                      onPress={() => handleLogout()}
                      style={{ borderColor: '#FDA738',width:110,marginBottom:10 }}
            >
              Logout
            </Button>
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 0.05, marginBottom: 10 }}>
          <Text style={styles.recipeDetail}>Refrigerator Inventory</Text>
        </View>
        <View style={[styles.searchFlex, {}]}>
          <Searchbar
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{ elevation: 0 }}
          />
        </View>
        <View style={{ flex: 0.1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <Button
              mode="outlined"
              textColor="black"
              rippleColor="#FFDDB0"
              buttonColor="#FFEFCB"
              onPress={handleAddIngredient}
              style={{ borderColor: '#FDA738' }}
            >
              Add New
            </Button>
          </View>
        </View>
       <View style={{ flex: 0.76 }}>
        {filteredAndSortedItems.length === 0 ? (
        <Text style={styles.notFound}>No ingredients found! {'\n'} Kindly add some ingredients</Text>
        ) : (
          <FlatList
            data={filteredAndSortedItems}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipe}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

        <View style={{ flex: 0.07 }}>
          <BottomNav from={'inventory'}/>
        </View>
      </View>
      {memoizedModal}
    </View>
  );
};

export default Inventory;
