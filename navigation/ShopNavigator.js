import { createStackNavigator } from "react-navigation-stack"
import {createAppContainer, createSwitchNavigator} from "react-navigation"
import {DrawerItems} from "react-navigation-drawer"
import {createDrawerNavigator} from "react-navigation-drawer"
import {Platform, Text, SafeAreaView, Button, View} from "react-native";
import CartScreen from "../screens/shop/CartScreen"
import OrdersScreen from "../screens/shop/OrdersScreen"
import Colors from "../const/Colors";
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen"
import ProductDetailScreen from "../screens/shop/ProductDetailScreen"
import Icon from 'react-native-vector-icons/Ionicons';
import React from "react"
import UserProductsScreen from "../screens/user/UserProductsScreen"
import EditProductScreen from "../screens/user/EditProductScreen";
import AuthScreen from "../screens/user/AuthScreen"
import StartupScreen from "../screens/StartupScreen"
import {useDispatch} from "react-redux"
import * as authActions from "../store/actions/auth"

const defaultNavOptions = {
        headerStyle: {
            backgroundColor: Platform.OS === "android" ? Colors.primary : ""
        },
        headerTitleStyle: {
            fontFamily: "Manrope_200ExtraLight"
        },
        headerTintColor: Platform.OS === "android" ? "white": Colors.primary,
}

const ProductsNavigator = createStackNavigator({
   ProductsOverview: ProductsOverviewScreen,
   ProductDetail: ProductDetailScreen,
   CartScreen: CartScreen,
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (<Icon name={Platform.OS === "android" ? "md-cart": "ios-cart"} size={28} color={drawerConfig.tintColor}/>)
     },
    defaultNavigationOptions: defaultNavOptions
});

const OrdersNavigator = createStackNavigator(
    {
      Orders: OrdersScreen
    },
    {
      navigationOptions: {
        drawerIcon: drawerConfig => (
            <Icon name={Platform.OS === "android" ? "md-list": "ios-list"} size={28} color={drawerConfig.tintColor}/>
        )
      },
      defaultNavigationOptions: defaultNavOptions
    }
  );
  
  const AdminNavigator = createStackNavigator(
      {
        UserProducts: UserProductsScreen,
        EditProduct: EditProductScreen
      },
      {
        navigationOptions: {
          drawerIcon: drawerConfig => (
            <Icon name={Platform.OS === "android" ? "md-create": "ios-create"} size={28} color={drawerConfig.tintColor}/>
          )
        },
        defaultNavigationOptions: defaultNavOptions
      }
    );
  
  const ShopNavigator = createDrawerNavigator(
    {
      Products: ProductsNavigator,
      Orders: OrdersNavigator,
      Admin: AdminNavigator
    },
    {
      contentOptions: {
        activeTintColor: Colors.primary,
      },
      contentComponent: props => {
         const dispatch = useDispatch();
         return (<View style={{flex: 1, paddingTop: 20}}>
           <SafeAreaView forceInset={{top: "always", horizontal: "never"}}>
              <DrawerItems {...props}/>
              <Button title="Logout" color={Colors.primary} onPress={() => {
                dispatch(authActions.logout());
              }}/>
           </SafeAreaView>
         </View>)
      }
    }
  );

  const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
  }, {
    defaultNavigationOptions: defaultNavOptions
  });

  const MainNavigator = createSwitchNavigator({
      Startup: StartupScreen,
      Auth: AuthNavigator,
      Shop: ShopNavigator

  });
  
  export default createAppContainer(MainNavigator);