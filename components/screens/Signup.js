import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Image, Pressable, Alert, ScrollView, Platform, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// import GoogleLogo from './styles/GoogleLogo';
// import FacebookLogo from './styles/FacebookLogo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import zxcvbn from 'zxcvbn';
import { HelperText } from 'react-native-paper';
import { auth } from '../../Firebase/Firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

export default function SignUp() {
  // Input fields
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [password, onChangePassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const onBlurEmail = () => {
    // Validate email format using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(email === '' || emailRegex.test(email));
  };

  const onChangeEmail = (text) => {
    setEmail(text);
  };

  const handleSignInPress = () => {
    navigation.navigate('LoginScreen');
  };

  const handleSignupPress = async () => {
    // Validation checks
    if (!email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      // Store user data in AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      // Log user data and storage success
      console.log("User Data: ", user.email);
      console.log("User data stored in AsyncStorage successfully.");
      console.log("User Data: ", user);

      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log("Error Code: ", error.code);
      console.log("Error Message: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordStrength = () => {
    if (!isPasswordFocused) {
      return null; // Don't render the password strength if the password field is not focused
    }

    const strengthLabels = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
    const strengthColors = ['#FF0000', '#FF4500', '#FFD700', '#7CFC00', '#008000'];

    return (
      <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10, alignSelf: 'flex-start', marginLeft: Platform.OS === 'ios' ? '6%' : '10%' }}>
        <Text>Strength: </Text>
        <Text style={{ color: strengthColors[passwordStrength], textAlign: 'left' }}>{strengthLabels[passwordStrength]}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Image
        style={{
            width: 150,
            height: 150,
            borderRadius: 75, // Half of width and height to make it circular
            overflow: 'hidden', // Ensures the image stays within the circular border
        }}
        source={require('../../assets/recipe.jpg')}
      />     
    </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.inputContainer}>
          <>
            <View style={styles.inputWrapper}>
              <TextInput
                numberOfLines={4}
                maxLength={40}
                onChangeText={onChangeEmail}
                onBlur={onBlurEmail}
                style={[
                  styles.input,
                  { borderColor: isValidEmail ? 'gray' : 'red' }
                ]}
                placeholder="Email"
              />
              {!isValidEmail && (
                <HelperText type="error" visible={!isValidEmail}>
                  Please enter a valid email address.
                </HelperText>
              )}
            </View>
          </>

          <View style={styles.inputWrapper}>
            <TextInput
              numberOfLines={4}
              secureTextEntry={visible}
              maxLength={40}
              onChangeText={(password) => {
                onChangePassword(password);
                const result = zxcvbn(password);
                setPasswordStrength(result.score);
              }}
              style={styles.input}
              placeholder="Password"
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <Pressable style={styles.eyeIcon} onPress={() => {
              setVisible(!visible);
              setShow(!show);
            }}>
              <MaterialCommunityIcons
                name={show ? 'eye-off-outline' : 'eye-outline'}
                size={26}
                color={'rgba(0,0,0,0.5)'}
              />
            </Pressable>
            {renderPasswordStrength()}
          </View>

          <Pressable style={styles.button} onPress={handleSignupPress}>
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.signInContainer}>
          <Pressable onPress={handleSignInPress}>
            <Text style={styles.signInText}>Already a member? <Text style={styles.signInLinkText}>Sign In</Text></Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEBCC',
  },
  header: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:30
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  scrollView: {
    flex: 0.6,
    paddingVertical: 20,
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    width: 340,
    marginTop: 20,
  },
  input: {
    padding: 10,
    width: '100%',
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    color: 'black',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  button: {
    marginTop: 30,
    width: 340,
    paddingVertical: 15,
    backgroundColor: '#FF8C00',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signInText: {
    fontSize: 16,
    color: '#FF8C00',
  },
  signInLinkText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
