import React, {useEffect, useState} from "react";
import {View, FlatList, Platform, TouchableOpacity, Text, ActivityIndicator, StyleSheet} from "react-native";
import {useSelector, useDispatch} from "react-redux"
import Icon from 'react-native-vector-icons/Ionicons';
import OrderItem from "../../components/shop/OrderItem";
import * as ordersActions from "../../store/actions/orders";
import { Colors } from "react-native/Libraries/NewAppScreen";

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();
    useEffect(() => {
      setIsLoading(true);
      dispatch(ordersActions.fetchOrders()).then(()=>{
        setIsLoading(false);
      });
    }, [dispatch]);
    if (isLoading) {
      return <View style={StyleSheet.centered}>
        <ActivityIndicator size="large" color={Colors.primary}/>
      </View>
    }

    if (orders.length === 0) {
      return <View style={{flex: 1, justifyContent: "center", alignItems:"center"}}>
          <Text>No orders found, maybe start ordering some?</Text>
      </View>
    }

    return <FlatList data={orders} keyExtractor={item => item.id} renderItem={itemData => <OrderItem items={itemData.item.items} amount={itemData.item.totalAmount} date={itemData.item.readableDate}/>}/>
};

OrdersScreen.navigationOptions = navData => {
    return {
      headerTitle: "Your Orders",
      headerLeft: () => <TouchableOpacity onPress={() => {
        navData.navigation.toggleDrawer();
     }}>
     <View style={{marginLeft: 15, marginBottom: 10}}><Icon name={Platform.OS === "android" ? "md-menu": "ios-menu"} size={28} color="red"/></View>
    </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default OrdersScreen;