import React, { useState,useEffect ,} from 'react';
import { View, Image, Modal, TouchableOpacity, Text, FlatList, BackHandler, Alert } from 'react-native';
import { Button, TextInput, Menu, Divider, Checkbox, RadioButton,Searchbar } from 'react-native-paper';
import styles from '../styles/styles';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import RecipeCard from '../card/RecipeCard';
import BottomNav from '../card/BottomNav';
import useRecipeHook from '../hooks/ReceipeHook';
import { useRoute } from '@react-navigation/native';
import FilterModal from './FilterModal';

import { auth } from '../../Firebase/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';



  //Home + FAV https://api.spoonacular.com/recipes/complexSearch apply on this if some has value then after question mark add it
  //neutrians : https://api.spoonacular.com/recipes/findByIngredients ranks + ignorepantry
//Filter working one...
//Search is working one
//picked go to neutrion tracking and fetch result from there

    //2581b5abfc7c4fe6922f5e07b301f77f

const Home = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [recipeData, setRecipeData] = useState([]); // Initialize recipeData as an empty array
    const [nutritionData, setNutritionData] = useState(null);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [suggestedRecipe, setSuggestedRecipe] =useState([]);
    const [suggested,setSuggested]= useState(false);
    const route = useRoute();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
      const [refreshing, setRefreshing] = useState(false); // State variable for refreshing

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

  // handleLogout();

    const API_KEY = '2581b5abfc7c4fe6922f5e07b301f77f';
    let recipe= [];
    let share;

    const { from1,selectedItem } = route.params || 'Home';
    let from = from1;
    if(from === undefined)
    {
      from = 'Home'
    }

    if(from=='Home')
    {
      share='home'
      
    }
    else
    {
      share='heart'
      
    }
    
    
 const fetchsSuggest = async () => {
  console.log('Im here buddy;');
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
          setSuggestedRecipe(data);
          // console.log('Suggested Data is ',data)
        }
        else
        {
          setSuggestedRecipe([]);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    
      

      const Reset = () => {
        console.log('rest works')
          setSuggested(false)
          // console.log('home is fetching',suggested);
          fetchRecipes();
  };



      const ViewAll = () =>{
          console.log('View ALL IS CLICKED..')
          setFilteredRecipes(suggestedRecipe);
          setSuggested(true);
      }

    useEffect(() => {
      console.log('In from HUseEFfect ')
    if (from == 'Home') {
      setSuggested(false)
      fetchRecipes();
      fetchsSuggest();
      
    } else {
      setRecipeData([]);
      setSuggested(false)
      console.log('Fav is fetching',recipeData);
      fetchFavorites();
    }
  }, [from]);

  
 
  console.log('from is', from, '+',searchQuery.length === 0 && from !== 'Fav'&& !suggested);


  const fetchRecipes = async () => {
        console.log('In fetching Home Recipe ...')

     try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?number=100&apiKey=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRecipeData(data.results);
        // console.log('Setted')
      } catch (error) {
        // console.log('Error:', error);
      }
  };

  const fetchFavorites = async () => {
    console.log('In fetching FAV Recipe ...')

    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const parsedFavorites = JSON.parse(favorites);
        setRecipeData(parsedFavorites);
        // console.log('Fav is '+parsedFavorites);
      }
      else
      {
        // console.log('Empty')
        setRecipeData([]);
      }
    } catch (error) {
      
      console.log('Error fetching favorites:', error);
    }
  };


      useEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);



    const handleRecipeClick = async (item) => {
      console.log('I m here AT handleRecipeClick ');
      let instructions,actualnutrition;
      //https://api.spoonacular.com/recipes/716429/information?includeNutrition=false&apiKey=2581b5abfc7c4fe6922f5e07b301f77f
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${item.id}/analyzedInstructions?apiKey=2581b5abfc7c4fe6922f5e07b301f77f`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const instruc = await response.json();
      instructions = instruc
    } catch (error) {
      console.log('Error:', error);
    }
     try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes//${item.id}/nutritionWidget.json?apiKey=2581b5abfc7c4fe6922f5e07b301f77f`
        );
        const data = await response.json();
        console.log('data is ',data.calories)
        actualnutrition = data;
        setNutritionData(data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${item.id}/information?includeNutrition=false&apiKey=2581b5abfc7c4fe6922f5e07b301f77f`
        );
        const data = await response.json();

        // Extracting required information
        const {
          cookingMinutes,
          readyInMinutes,
          servings,
          healthScore,
          pricePerServing,
          extendedIngredients
        } = data;

        // console.log('Cooking Minutes:', cookingMinutes);
        // console.log('Ready In Minutes:', readyInMinutes);
        // console.log('Servings:', servings);
        // console.log('Summary:', summary);
        // console.log('Health Score:', healthScore);
        // console.log('Price Per Serving:', pricePerServing);

        // Extracting extended ingredient names
        const ingredientNames = extendedIngredients.map(
          (ingredient) => ingredient.nameClean
        );
        // console.log('Ingredient Names:', ingredientNames);
        navigation.navigate('Detail', { detail: { title: item.title,image :item.image, instructions,cookingMinutes,readyInMinutes,servings,healthScore,pricePerServing,ingredientNames,actualnutrition } });

      } catch (error) {
        console.log('Error fetching data:', error);
      }
     
  };


  
   useFocusEffect(
    React.useCallback(() => {
      // Called when the screen gains focus
      console.log('Screen is focused');
      fetchsSuggest();
      // Perform any actions needed when the screen gains focus
      return () => {
        // Called when the screen loses focus
        from = '';
        console.log('Screen is unfocused');
        // Perform any actions needed when the screen loses focus
      };
    }, [])
  );

  useEffect(() => {
    if (recipeData && recipeData.length > 0) {
      console.log('Recipe data is.... ', recipeData);
      const filtered = recipeData.filter(recipe =>
        recipe!==null && // Check if title is not null or undefined
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
    else
    {
      setFilteredRecipes([]);
    }
  }, [recipeData, searchQuery]);


  const renderRecipe = ({ item }) => (
      <RecipeCard
        title={item.title}
        serving={item.image}
        show={true}
        onPress={() => handleRecipeClick(item)}
        item={item}
        component={from}
        fav={fetchFavorites}
      />
    );


  
const onRefresh = () => {
    setRefreshing(true);
    // Call the function to refresh data here
    setTimeout(() => {
      // Perform your data fetching or refreshing logic here
      if (from == 'Home') {
        fetchRecipes();
        fetchsSuggest();
      } else {
        fetchFavorites();
      }
      setRefreshing(false);
    }, 1000); // Simulate a delay for demonstration
  };

  useEffect(()=>{
    console.log('In Empty bracket one')
  },[from,share])


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
          <TouchableOpacity
        activeOpacity={1} // Disable touch feedback
        onPress={() => onRefresh()} // Handle onPress event to trigger refresh
      ></TouchableOpacity>
        <View style={[styles.searchFlex,{flexDirection:'row'}]}>
          <View style={{flex:0.7}}> 
          <Searchbar
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{ elevation: 0 }} // Set elevation to 0 to prevent content from moving up
          />
          </View>
          <View style={{flex:0.3,marginLeft:10,marginTop:5}}>
             {from !== 'Fav' ? (
            <Button
              mode="outlined"
                      textColor="black"
                      rippleColor="#FFDDB0"
                      buttonColor="#FFEFCB"
                      onPress={() => setModalVisible(true)}
                      style={{ borderColor: '#FDA738' }}
            >
              Filter
            </Button>
) : (
  <></>
)}
            <FilterModal visible={modalVisible} onClose={() => setModalVisible(false)} applyFilter={setFilteredRecipes} suggestion={suggested}/>

          </View>
        </View>
        {searchQuery.length === 0 && from !== 'Fav'&& !suggested && ( // https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,+flour,+sugar&apiKey=2581b5abfc7c4fe6922f5e07b301f77f
          <View style={[styles.suggestArea,{}]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.suggestText}>Suggestion</Text>
              {suggestedRecipe.length > 0 ? (
              <Button mode="outlined" textColor='black' rippleColor={"#FFDDB0"} onPress={() => ViewAll()}>
                View All
              </Button>):(<></>)}
            </View>
              {suggestedRecipe.length > 0 ? (
                <RecipeCard
                  title={suggestedRecipe[0].title}
                  serving={suggestedRecipe[0].image}
                  onPress={() => handleRecipeClick(suggestedRecipe[0])}
                  item={suggestedRecipe[0]}
                  show={true}
                  component={from}
                  fav={fetchFavorites}
                />
              ) : (
              <Text style={styles.notFound}>Kindly add some ingredients to view suggestion </Text>

              )}

          </View>
        )}
        <View style={{ flex:from !=='Fav' && !suggested && searchQuery.length === 0 ? 0.58 : 0.86 }}>
          <Text style={styles.suggestText}>{from ==='Fav' ? 'Favourite' : !suggested ? 'All Recipe':'Suggested Recipe'}</Text>
           {filteredRecipes.length > 0 ? (
            <FlatList
              data={filteredRecipes}
              keyExtractor={(item) => item.title}
              renderItem={renderRecipe}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.notFound}>
              No Recipe found
            </Text>
          )}
        </View>
        <TouchableOpacity/>

        <View style={{ flex: 0.07}} >
          <BottomNav from={share} />
        </View>
      </View>
    </View>
  );
};

export default Home;



//  const handleFilter = () => {
//     const filterData = {
//       cuisine,
//       diet,
//       intolerances,
//       includeIngredients,
//       excludeIngredients,
//       maxReadyTime,
//       sort
//     };
//     console.log(filterData); // Log the filter data