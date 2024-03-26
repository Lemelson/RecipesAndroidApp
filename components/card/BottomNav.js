import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Entypo, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const FooterCard = (from) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  console.log('from is ',from.from)
  const [selectedItem, setSelectedItem] = useState('');
  let i =0;

  // useEffect(() => {
  //   if (isFocused) {
  //     // Update the selected item when the screen gains focus
  //     // Example: get the selected item from navigation state or route params
  //     const currentSelectedItem = // Code to get the current selected item (e.g., from route params)
  //     setSelectedItem(currentSelectedItem);
  //   }
  // }, [isFocused]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    console.log('on clicks works on the ',item,' and selected is ',selectedItem)

    switch (item) {
      case 'home':
        navigation.navigate('Home', { from1: 'Home', selectedItem: 'home' });
        break;
      case 'inventory':
        navigation.navigate('Inventory', { selectedItem: 'inventory' });
        break;
      case 'tracking':
        navigation.navigate('Tracking', { to: 'Tracking', selectedItem: 'tracking' });
        break;
      case 'heart':
        navigation.navigate('Home', { from1: 'Fav', selectedItem: 'heart' });
        break;
      default:
        break;
    }
  };

  const renderIcon = (item) => {
    console.log('selected item is ',selectedItem,' item is ',item,' i is ',i);
    i++;

    const iconColor = from.from === item ? '#FDAC40' : '#000';

    switch (item) {
      case 'home':
        return <AntDesign name="home" size={24} color={iconColor} />;
      case 'inventory':
        return <Entypo name="archive" size={24} color={iconColor} />;
      case 'tracking':
        return <MaterialIcons name="location-on" size={24} color={iconColor} />;
      case 'heart':
        return <FontAwesome name="heart" size={24} color={iconColor} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => handleItemClick('home')}
      >
        {renderIcon('home')}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => handleItemClick('inventory')}
      >
        {renderIcon('inventory')}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => handleItemClick('tracking')}
      >
        {renderIcon('tracking')}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => handleItemClick('heart')}
      >
        {renderIcon('heart')}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FooterCard;
