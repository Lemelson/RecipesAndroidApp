import React from 'react';
import { View, Text, ScrollView,Image } from 'react-native';
import { Button,Snackbar } from 'react-native-paper';
import styles from '../styles/styles';
import RecipeCard from '../card/RecipeCard';
import BottomNav from '../card/BottomNav';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Detail = () => {
  const route = useRoute();
  const { detail } = route.params;
  console.log('here vere is ',detail)
  const [visible, setVisible] = React.useState(false);

  
const onToggleSnackBar = async () => {
  setVisible(true);
  try {



    // Fetch existing data from AsyncStorage
    const existingData = await AsyncStorage.getItem('nutrition');
    let newData = [];
    
    // Parse existing data if it exists
    if (existingData) {
      newData = JSON.parse(existingData);
    }
    
    // Check if the new data already exists in the existing data
    const isExisting = newData.some(item => item.title === detail.title);
    
    if (!isExisting) {
      // Add new data to the existing data
      const { calories } = detail.actualnutrition;
      const { carbs } = detail.actualnutrition;
      const { fat } = detail.actualnutrition;
      const { protein } = detail.actualnutrition;

      
      newData.push({
        title: detail.title,
        image: detail.image,
        calories: calories,
        carbs:carbs,
        fat:fat,
        protein:protein

         // Assuming detail.actualnutrition is an array
      });
      
      // Store the merged data back into AsyncStorage
      await AsyncStorage.setItem('nutrition', JSON.stringify(newData));
    } else {
      console.log('Data already exists');
    }
    
    // Fetch and log all stored data from AsyncStorage
    const storedData = await AsyncStorage.getItem('nutrition');
    console.log('Stored Data:', storedData);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

  const onDismissSnackBar = () => setVisible(false);

  const navigation = useNavigation();
  

  // Split ingredients based on '|'
  let ingredientList;
  if(detail.instructions)
    ingredientList = detail.instructions
  console.log('list is ',ingredientList)  
  //ingredientList = detail.ingredients.split('|');

  console.log('detail is ',detail.actualnutrition)
 


  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.07 }}>
          <Text style={[styles.recipeDetail, { color: 'black' }]}>{'Recipe Detail'}</Text>
        </View>
        <ScrollView
          style={{ flex: 0.77 }}
          showsVerticalScrollIndicator={false}
        >
          {
            !detail.calories ?(
            <View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
             <Image
                style={{
                  width: 120,
                  height: 120,
                  resizeMode: 'cover',
                  borderRadius: 40, // Half of the width or height
                }}
                source={{ uri: detail.image }} // Replace this with your image URL
              />
            <Text style={styles.recipeDetail}>{detail.title}</Text>
          </View>
          <Text style={styles.header}>Ready In Minutes:    <Text style={styles.ingredientItem}>{detail.readyInMinutes}</Text></Text>
          <Text style={styles.header}>Cooking Minutes:     <Text style={styles.ingredientItem}>{detail.cookingMinutes  <= 0 ? detail.readyInMinutes : detail.cookingMinutes}</Text> </Text>
          <Text style={styles.header}>Servings:     <Text style={styles.ingredientItem}>{detail.servings}</Text></Text>
          <Text style={styles.header}>Health Score:     <Text style={styles.ingredientItem}>{detail.healthScore}</Text></Text>
          <Text style={styles.header}>Price Per Serving:     <Text style={styles.ingredientItem}>{detail.pricePerServing}</Text></Text>
            <Text style={styles.header1}>Nutrition:</Text>
              <Text style={styles.header}>Calories:     <Text style={styles.ingredientItem}>{detail.actualnutrition.calories}</Text></Text>
              <Text style={styles.header}>Carbs:     <Text style={styles.ingredientItem}>{detail.actualnutrition.carbs}</Text></Text>
              <Text style={styles.header}>Fat:     <Text style={styles.ingredientItem}>{detail.actualnutrition.fat}</Text></Text>
              <Text style={styles.header}>Protein:     <Text style={styles.ingredientItem}>{detail.actualnutrition.protein}</Text></Text>


            <Text style={styles.header1}>Ingredients:</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View>
                {detail.ingredientNames.map((ingredient, index) => (
                  <View key={index}>
                    <Text style={styles.ingredientItem}>
                      {`\u2022`} <Text style={{ color: 'black', fontSize: 14 }}>{ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</Text>
                    </Text>
                  </View>
                ))}
              </View>

            {/* Render ingredients as a list */}
            <View>
              <Text style={styles.header1}>Instructions: </Text>
              {ingredientList.map((ingredient, index) => (
                <View key={index}>
                  {ingredient.steps.map((step, stepIndex) => (
                    <Text key={stepIndex} style={styles.ingredientItem}>
                      {`\u2022`} <Text style={{color:'black',fontSize:14}}> {step.step} </Text>
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* {detail.servings?(
            <View>
              <View style={{ flexDirection: 'row' }}>
            <Text style={styles.header}>Serving:</Text>
            <Text style={{ marginHorizontal: 30, marginVertical: 10, fontFamily: 'LibreFranklin_600SemiBold' }}> {detail.servings}</Text>
          </View>
          <Text style={styles.header}>Instructions:</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[]}>{detail.instructions}</Text>
          </View>
            </View>
          ):(<></>)} */}
            </View>
            )
            :
            (
            <View>
              <Text style={[styles.ingredientItem,{marginVertical:15}]}>{`\u2022`} <Text style={{color:'black',fontSize:19}}>Calories: {detail.calories}</Text></Text>
              <Text style={[styles.ingredientItem,{marginBottom:15}]}>{`\u2022`} <Text style={{color:'black',fontSize:19}}>Fat: {detail.fat_total_g}g</Text></Text>
              <Text style={[styles.ingredientItem,{marginBottom:15}]}>{`\u2022`} <Text style={{color:'black',fontSize:19}}>Sugar: {detail.sugar_g}g</Text></Text>
              <Text style={[styles.ingredientItem,{marginBottom:15}]}>{`\u2022`} <Text style={{color:'black',fontSize:19}}>Protein: {detail.protein_g}g</Text></Text>
              <Text style={[styles.ingredientItem,{marginBottom:15}]}>{`\u2022`} <Text style={{color:'black',fontSize:19}}>Carbohydrates: {detail.carbohydrates_total_g}g</Text></Text>
            </View>
            )
          }
         
        </ScrollView>

        <View style={{ flex: 0.2 }}>
          <Button mode="contained" buttonColor='#FDAC40' rippleColor={'#E5FFE8'} onPress={onToggleSnackBar} style={{ marginVertical: 20,visible:detail.servings? true:false, }}>
            Picked
          </Button>
          <BottomNav />
        </View>
        <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            style={{backgroundColor:'#18892C'}}>
            Added Successfully
      </Snackbar>
      </View>
    </View>
  );
};

export default Detail;
