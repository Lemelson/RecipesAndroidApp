import React, { useState } from 'react';
import { View, Image, Modal, TouchableOpacity, Text, Alert, Keyboard } from 'react-native';
import { Button, Card,Snackbar, TextInput } from 'react-native-paper';
import styles from '../styles/styles';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../card/BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage




const AddInventory = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [ingredient, setIngredient] = React.useState("");
  
  
    const areFieldsNotEmpty = () => {
        console.log('Title is ',title.trim())
        return title.trim() !== "" && ingredient.trim() !== "";
};
  
    const onToggleSnackBar = async() => {
       try {
      if (areFieldsNotEmpty()) {
        // Generate a unique key for each item
        const key = `inventoryItem_${Date.now()}`;

        // Save data to local storage with the generated key
        const item = { title, ingredient };
        await AsyncStorage.setItem(key, JSON.stringify(item));

        // Log the stored data
        console.log('Data stored:', item);

        setVisible(true);
        Keyboard.dismiss();
        setTimeout(() => {
          navigation.navigate('Inventory');
        }, 1500);
      } else {
        Alert.alert('Error', 'Kindly fill all fields before adding. Thanks');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
    

};
    const onDismissSnackBar = () => setVisible(false);
 


     
   
    
  return (
     <View style={styles.container}>
      <View style={styles.mainView}>
       
        <View style={{alignItems:'center',justifyContent:'center',flex:0.1,marginBottom:10}}>
            <Text style={styles.recipeDetail}>Add New Refrigerator Inventory</Text>
        </View>
        <View style={{ flex: 0.76 }}>
                <TextInput
                    label="Title"
                    value={title}
                    mode='outlined'
                    cursorColor='orange'
                    activeOutlineColor='#F6BD75'
                    onChangeText={text => setTitle(text)}
                    style={{marginVertical:10}}
                    />
            <TextInput
                    label="Ingredients"
                    value={ingredient}
                    mode='outlined'
                    cursorColor='orange'
                    activeOutlineColor='#F6BD75'
                    numberOfLines={5}
                    multiline={true}
                    onChangeText={text => setIngredient(text)}
                    style={{marginVertical:10}}
                    />
             
             <Button mode="contained" buttonColor='#FDAC40' rippleColor={'#E5FFE8'} onPress={onToggleSnackBar} style={{ marginVertical: 20, }} disabled={visible}> 
                Add
              </Button>
        </View>
        
        <View style={{flex:0.1}}>
           
        </View>
        <View style={{ flex: 0.07}}>
          <BottomNav/>
        </View>
         <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            style={{backgroundColor:'#18892C'}}
            duration={1500}>
            Added Successfully
         </Snackbar>
      </View>
    </View>
  )
}

export default AddInventory
