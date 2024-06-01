import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Text } from 'react-native';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const API_KEY = '2581b5abfc7c4fe6922f5e07b301f77f';
import AsyncStorage from '@react-native-async-storage/async-storage';



const FilterModal = ({ visible, onClose, applyFilter, suggestion }) => {
  const [cuisineOpen, setCuisineOpen] = useState(false);
  const [cuisineValue, setCuisineValue] = useState(null);
  const [cuisineItems, setCuisineItems] = useState([
    { label: 'Asian', value: 'Asian' },
    { label: 'European', value: 'European' },
    { label: 'Italian', value: 'Italian' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'American', value: 'American' },
  ]);

  const [dietOpen, setDietOpen] = useState(false);
  const [dietValue, setDietValue] = useState(null);
  const [dietItems, setDietItems] = useState([
    { label: 'Vegan', value: 'Vegan' },
    { label: 'Paleo', value: 'Paleo' },
  ]);


  const [includeIngredientsOpen, setIncludeIngredientsOpen] = useState(false);
  const [includeIngredientsValue, setIncludeIngredientsValue] = useState('');
  
  const [excludeIngredientsOpen, setExcludeIngredientsOpen] = useState(false);
  const [excludeIngredientsValue, setExcludeIngredientsValue] = useState('');

  const [maxReadyTimeOpen, setMaxReadyTimeOpen] = useState(false);
  const [maxReadyTimeValue, setMaxReadyTimeValue] = useState('');

  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [sortItems, setSortItems] = useState([
    { label: 'Price', value: 'Price' },
    { label: 'Time', value: 'Time' },
    { label: 'Popularity', value: 'Popularity' },
    { label: 'Healthiness', value: 'Healthiness' },
  ]);

  const [rankOpen, setRankOpen] = useState(false);
  const [rankValue, setRankValue] = useState(null);
  const [rankItems, setRankItems] = useState([
    { label: 'Minimum', value: '2' },
    { label: 'Maximum', value: '1' },
  ]);


  useEffect(() => {
    if (visible) {
      // Reset all state values to empty or null when the modal becomes visible
      setCuisineValue(null);
      setDietValue(null);
      setIncludeIngredientsValue('');
      setExcludeIngredientsValue('');
      setMaxReadyTimeValue('');
      setSortValue(null);
      setRankValue(null);
    }
  }, [visible]);

  const handleFilter = async() => {
    onClose();
    const filterData = {
      cuisine: cuisineValue,
      diet: dietValue,
      includeIngredients: includeIngredientsValue,
      excludeIngredients: excludeIngredientsValue,
      maxReadyTime: maxReadyTimeValue,
      sort: sortValue,
      rank: rankValue,
    };
    console.log(filterData); // Log the filter data
    let apiUrl = !suggestion ? 'https://api.spoonacular.com/recipes/complexSearch?' : 'https://api.spoonacular.com/recipes/findByIngredients?';

    if(suggestion)
    {
        const existingIngredients = await AsyncStorage.getItem('ingredients');
        const existingIngredientsArray = existingIngredients ? JSON.parse(existingIngredients) : [];
        
        console.log('array  is ',existingIngredientsArray)
        if (existingIngredientsArray.length > 0) {
        const ingredientNames = existingIngredientsArray.map(ingredient => ingredient.name).join(',+');
          console.log('ingrdients is ',ingredientNames)
          const apiKey = 'your_api_key'; // Replace 'your_api_key' with your actual API key
          const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientNames}`;
          console.log('url is ',url)
          apiUrl = url;
        }
    }
    // Iterate through the properties of filterData
    for (const key in filterData) {
      // Check if the value is not null or empty
      if (filterData[key] !== null && filterData[key] !== "") {
        // If not null or empty, add the key-value pair to the apiUrl
        apiUrl += `&${key}=${filterData[key]}&`;
      }
    }

    // Remove the trailing '&' from the apiUrl if it exists
    apiUrl = apiUrl.endsWith('&') ? apiUrl.slice(0, -1) : apiUrl;
    apiUrl += '&apiKey=2581b5abfc7c4fe6922f5e07b301f77f';
    console.log(apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if(suggestion)
          applyFilter(data)
        else
        applyFilter(data.results);
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  const renderDropDown = (label, openState, setOpenState, value, setValue, items, multiple = false) => {
    return (
      <View style={styles.filterSection}>
        <Text style={styles.title}>
          {label}
          <Icon
            name={openState ? 'chevron-up' : 'chevron-down'}
            size={20}
            onPress={() => setOpenState(!openState)}
          />
        </Text>
        {openState && (
          <DropDownPicker
            open={openState}
            value={value}
            items={items}
            setOpen={setOpenState}
            setValue={setValue}
            setItems={items => items} // This doesn't change, so no need for a state setter
            placeholder={`Choose ${label.toLowerCase()}`}
            style={{ zIndex: 999 }}
            onClose={() => setOpenState(false)}
            multiple={multiple}
            onChangeItem={item => setValue(item.value)}
          />
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Button icon="close" onPress={onClose} style={styles.closeButton} />
          {!suggestion ? 
            <View>
              {renderDropDown('Cuisine', cuisineOpen, setCuisineOpen, cuisineValue, setCuisineValue, cuisineItems)}
              {renderDropDown('Diet', dietOpen, setDietOpen, dietValue, setDietValue, dietItems)}
             
              <View style={styles.filterSection}>
                <Text style={styles.title}>
                  Include Ingredients
                  <Icon
                    name={includeIngredientsOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    onPress={() => setIncludeIngredientsOpen(!includeIngredientsOpen)}
                  />
                </Text>
                {includeIngredientsOpen && (
                  <TextInput
                    label="Include Ingredients"
                    value={includeIngredientsValue}
                    onChangeText={text => setIncludeIngredientsValue(text)}
                    style={styles.input}
                  />
                )}
              </View>
              <View style={styles.filterSection}>
                <Text style={styles.title}>
                  Exclude Ingredients
                  <Icon
                    name={excludeIngredientsOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    onPress={() => setExcludeIngredientsOpen(!excludeIngredientsOpen)}
                  />
                </Text>
                {excludeIngredientsOpen && (
                  <TextInput
                    label="Exclude Ingredients"
                    value={excludeIngredientsValue}
                    onChangeText={text => setExcludeIngredientsValue(text)}
                    style={styles.input}
                  />
                )}
              </View>
              <View style={styles.filterSection}>
                <Text style={styles.title}>
                  Max Ready Time
                  <Icon
                    name={maxReadyTimeOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    onPress={() => setMaxReadyTimeOpen(!maxReadyTimeOpen)}
                  />
                </Text>
                {maxReadyTimeOpen && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      value={`${maxReadyTimeValue}`}
                      onChangeText={text => setMaxReadyTimeValue(text)}
                      keyboardType="numeric"
                      style={[styles.input, { width: '100%', marginRight: 10 }]}
                    />
                  </View>
                )}
              </View>
              {renderDropDown('Sort', sortOpen, setSortOpen, sortValue, setSortValue, sortItems)}
            </View>
          :
            <View>
              {renderDropDown('Rank', rankOpen, setRankOpen, rankValue, setRankValue, rankItems)}
              <View style={[styles.filterSection]}>
                
              </View>
            </View>
          }
          <Button onPress={handleFilter} 
            mode="outlined"
            textColor="black"
            rippleColor="#FFDDB0"
            buttonColor="#FFEFCB" style={styles.filterButton}>Filter</Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  filterButton: {
    marginTop: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 5,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

export default FilterModal;
