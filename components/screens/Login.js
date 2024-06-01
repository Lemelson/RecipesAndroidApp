import { StyleSheet, Text, View, TextInput, Button, Image, Pressable, Alert, Platform, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HelperText } from 'react-native-paper';
import { auth } from '../../Firebase/Firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

export default function Login() {
  const [password, onChangePassword] = useState('');
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [loading, setLoading] = useState(false);

  const onBlurEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(email === '' || emailRegex.test(email));
  };

  const onChangeEmail = (text) => {
    setEmail(text);
  };

  const navigation = useNavigation();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          navigation.navigate('Home');
        }
      } catch (error) {
        console.log('Error checking user login status: ', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigation.navigate('Home');
      } else {
        await checkUserLoggedIn();
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  const handleSignInButtonPress = async () => {
    if (!email.length) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password.length) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const existingUserData = await AsyncStorage.getItem('userData');
      const existingUser = existingUserData ? JSON.parse(existingUserData) : null;

      if (!existingUser || existingUser.uid !== user.uid) {
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        console.log("User data added to AsyncStorage.");
      }

      console.log("User with email " + user.email + " signed in");
      onChangeEmail('');
      onChangePassword('');

      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Wrong Credentials', 'Check your mail or password again!');

      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error Code: ", errorCode);
      console.log("Error Message: ", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('PasswordReset');
  }

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
            <TextInput
              numberOfLines={4}
              maxLength={40}
              value={email}
              onChangeText={onChangeEmail}
              onBlur={onBlurEmail}
              style={[styles.input, { borderColor: isValidEmail ? 'gray' : 'red' }]}
              placeholder="Email"
            />
            {!isValidEmail && (
              <HelperText type="error" visible={!isValidEmail}>
                Please enter a valid email address.
              </HelperText>
            )}
          </>

          <View style={styles.passwordContainer}>
            <TextInput
              numberOfLines={4}
              secureTextEntry={visible}
              maxLength={40}
              value={password}
              onChangeText={onChangePassword}
              style={styles.input}
              placeholder="Password"
            />
            <Pressable style={styles.eyeIcon} onPress={() => { setVisible(!visible); setShow(!show); }}>
              <MaterialCommunityIcons
                name={show ? 'eye-off-outline' : 'eye-outline'}
                size={26}
                color={'rgba(0,0,0,0.5)'}
              />
            </Pressable>
          </View>

          <Pressable style={styles.button} onPress={handleSignInButtonPress}>
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.signUpContainer}>
          <Pressable onPress={handleSignUpPress}>
            <Text style={styles.signUpText}>Not a member? <Text style={styles.signUpLinkText}>Sign Up</Text></Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5B4',
  },
  header: {
    flex: 0.32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  scrollView: {
    flex: 0.68,
    paddingVertical: 100,
    marginTop: 20,
  },
  inputContainer: {
    flex: 0.43,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    padding: 10,
    width: 340,
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 20,
    color: 'black',
  },
  passwordContainer: {
    position: 'relative',
    width: 340,
  },
  eyeIcon: {
    position: 'absolute',
    right: Platform.OS === 'ios' ? 15 : 15,
    top: 35,
  },
  button: {
    marginTop: 30,
    width: 340,
    paddingVertical: 10,
    backgroundColor: '#FF8C00',
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  signUpText: {
    fontSize: 16,
    color: '#FF8C00',
  },
  signUpLinkText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
