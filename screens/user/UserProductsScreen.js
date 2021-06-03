import React from "react";
import {Text, FlatList, Button, TouchableOpacity, View, Alert} from "react-native";
import {useSelector, useDispatch} from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../../const/Colors";
import ProductItem from "../../components/shop/ProductItem"

import * as productsActions from "../../store/actions/products"

const UserProductsScreen = props => {
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

    const editProductHandler = (id) => {
        props.navigation.navigate("EditProduct", {productId: id});
    };

    const deleteHandler = (id) => {
        Alert.alert("Are you sure?", "Do you really want to delete this item?", [
          {text: "No", style: "default"},
          {text: "Yes", style: "destructive", onPress: () => {
              dispatch(productsActions.deleteProduct(id))
          }}
        ])
    }

    if (userProducts.length === 0) {
        return <View style={{flex: 1, justifyContent: "center", alignItems:"center"}}>
            <Text>No products found, maybe start creating some?</Text>
        </View>
    }

    return <FlatList data={userProducts} keyExtractor={item => item.id} renderItem={itemData => <ProductItem image={itemData.item.imageUrl} title={itemData.item.title} price={itemData.item.price} 
    onSelect={()=>{
        editProductHandler(itemData.item.id);
    }}>
        <Button color={Colors.primary} title="Edit" onPress={() => {
        editProductHandler(itemData.item.id);
    }}/>
        <Button color={Colors.primary} title="Delete" onPress={deleteHandler.bind(this, itemData.item.id)}/>
    </ProductItem>}/>
}

UserProductsScreen.navigationOptions = navData => {
    return {
        headerTitle: "Your Products",
        headerLeft: (() => <TouchableOpacity onPress={() => {
            navData.navigation.toggleDrawer();
         }}>
         <View style={{marginLeft: 15, marginBottom: 10}}><Icon name={Platform.OS === "android" ? "md-menu": "ios-menu"} size={28} color="red"/></View>
        </TouchableOpacity>),
        headerRight: (() => <TouchableOpacity onPress={() => {
            navData.navigation.navigate("EditProduct");
         }}>
         <View style={{marginRight: 15, marginBottom: 10}}><Icon name={Platform.OS === "android" ? "md-create": "ios-create"} size={28} color="red"/></View>
        </TouchableOpacity>),
    }
}

export default UserProductsScreen;