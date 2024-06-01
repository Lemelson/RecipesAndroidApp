import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, Modal, TouchableOpacity, Text, FlatList } from 'react-native';
import { Button, Searchbar } from 'react-native-paper';
import styles from '../styles/styles';
import { useNavigation } from '@react-navigation/native';
import RecipeCard from '../card/RecipeCard';
import BottomNav from '../card/BottomNav';
import { auth } from '../../Firebase/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const Tracking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackData, setTrackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

      const { selectedItem } = route.params ;

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

   const Reset = () => {
        console.log('rest works')
        fetchData();
          
  };

   const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem('nutrition');
        if (data !== null) {
          const parsedData = JSON.parse(data);
          const trackItems = parsedData.map(item => ({
            title: item.title,
            image: item.image,
            calories: item.calories,
            carbs: item.carbs,
            fat: item.fat,
            protein: item.protein
          }));
          setTrackData(trackItems);
          setFilteredData(trackItems); // Set filteredData initially with all data
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  useEffect(() => {
   
    fetchData();
  }, []);

  useEffect(() => {
    // Filter trackData based on searchQuery whenever searchQuery changes
    const filtered = trackData.filter(recipe =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, trackData]);

  const handleRecipeClick = (item) => {
    navigation.navigate('TrackingDetail', { detail: item });
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity onPress={() => handleRecipeClick(item)}>
      <RecipeCard
        title={item.title}
        serving={item.image}
        onPress={() => handleRecipeClick(item)}
        show={true}
      />
    </TouchableOpacity>
  );

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
          <Text style={styles.recipeDetail}>Nutritional Tracking...</Text>
        </View>
        <View style={[styles.searchFlex, {}]}>
          <Searchbar
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{ elevation: 0 }}
          />
        </View>
        <View style={{ flex: 0.86 }}>
          {filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.title}
              renderItem={renderRecipe}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.notFound}>
              No Nutritional Found {'\n'} Pick some Recipe to View 
            </Text>
          )}
        </View>

        <View style={{ flex: 0.07 }}>
          <BottomNav reset={Reset} from={'tracking'} selectedItem={selectedItem}/>
        </View>
      </View>
    </View>
  );
}

export default Tracking;
