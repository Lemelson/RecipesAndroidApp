import React from 'react';
import { View, Text, ScrollView,Image } from 'react-native';
import { Button,Snackbar } from 'react-native-paper';
import styles from '../styles/styles';
import RecipeCard from '../card/RecipeCard';
import BottomNav from '../card/BottomNav';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const TrackingDetail = () => {
  const route = useRoute();
  const { detail } = route.params;
  console.log('here vere is ',detail)

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.1 }}>
          <Text style={[styles.recipeDetail, { color: 'black' }]}>{'Tracking Detail'}</Text>
        </View>
        <ScrollView
          style={{ flex: 0.8 }}
          showsVerticalScrollIndicator={false}
        >
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
             <View>
              <Text style={[styles.ingredientItem,{marginVertical:15}]}>{`\u2022`} <Text style={{color:'black',fontSize:19}}>Calories: {detail.calories}</Text></Text>
              <Text style={[styles.ingredientItem,{marginBottom:15}]}>{`\u2022`} <Text style={{color:'black',fontSize:19}}>Fat: {detail.fat}g</Text></Text>
              <Text style={[styles.ingredientItem,{marginBottom:15}]}>{`\u2022`} <Text style={{color:'black',fontSize:19}}>Carbs: {detail.carbs}g</Text></Text>
              <Text style={[styles.ingredientItem,{marginBottom:15}]}>{`\u2022`} <Text style={{color:'black',fontSize:19}}>Protein: {detail.protein}g</Text></Text>
            </View>
         
        </ScrollView>

        <View style={{ flex: 0.1 }}>
          
          <BottomNav />
        </View>
     
      </View>
    </View>
  );
};

export default TrackingDetail;
