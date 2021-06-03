import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';

const CartItem = props => {
    return(<View style={styles.cartItem}>
        <Text style={styles.itemData}>
           <Text style={styles.quantity}>{props.quantity} </Text> 
           <Text style={styles.mainText}>{props.title}</Text>
        </Text>
        <View style={styles.itemData}>
            <Text style={styles.mainText}>${props.amount.toFixed(2)}</Text>
             {props.deletable && <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
               <Icon name={Platform.OS === "android" ? "md-trash": "ios-trash"} size={23} color="red"/>
            </TouchableOpacity> }
        </View>
    </View>)


}

const styles = StyleSheet.create({
    cartItem: {
       padding: 15,
       backgroundColor: "#eee",
       flexDirection: "row",
       justifyContent: "space-between",
       borderRadius: 10,
       marginBottom: 15
    },
    itemData: {
        flexDirection: "row",
        alignItems: "center"
    },
    quantity: {
        fontFamily: "Manrope_700Bold",
        color: "#888",
        fontSize: 16
    },
    mainText: {
        fontFamily: "Manrope_700Bold",
        fontSize: 16
    },
    deleteButton: {

    }
});

export default CartItem