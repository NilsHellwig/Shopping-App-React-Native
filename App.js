import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ShopNavigator from "./navigation/ShopNavigator"
import productsReducer from "./store/reducers/products";
import AppLoading from 'expo-app-loading';
import { useFonts, Manrope_200ExtraLight, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { composeWithDevTools } from "redux-devtools-extension"; // react native debuger cmd + t // bei App remote debugging erlauben
import cartReducer from "./store/reducers/cart";
import ordersReducer from "./store/reducers/orders"
import ReduxThunk from "redux-thunk"
import authReducer from "./store/reducers/auth"
import NavigationContainer from "./navigation/NavigationContainer"

const rootReducer = combineReducers({
   products: productsReducer,
   cart: cartReducer,
   orders: ordersReducer,
   auth: authReducer,
});


const store = createStore(rootReducer, composeWithDevTools(), applyMiddleware(ReduxThunk));

/* 

REQUIRED INSTALATIONS

* npm install redux react-redux react-navigation
* expo install react-native-gesture-handler react-native-reanimated
* npm install react-navigation-stack
* expo install expo-app-loading
* expo install expo-font @expo-google-fonts/manrope
* npm install --save-dev redux-devtools-extension
* npm install react-native-vector-icons
* npm install react-navigation-drawer
* npm install react-native-screens
* npm install --save moment
* npm install --save redux-thunk
* npm install --save expo-linear-gradient

AVAILABLE FONTS

Manrope_200ExtraLight
Manrope_300Light
Manrope_400Regular
Manrope_500Medium
Manrope_600SemiBold
Manrope_700Bold
Manrope_800ExtraBold

*/

export default function App() {
  let [fontsLoaded] = useFonts({
    Manrope_200ExtraLight, Manrope_700Bold
  });

  if (!fontsLoaded) {
    console.log("Hello");
    return <AppLoading />;
  }
  return (<Provider store={store}><NavigationContainer/></Provider>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
