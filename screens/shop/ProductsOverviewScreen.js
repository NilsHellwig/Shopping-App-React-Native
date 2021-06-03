import React, {useState, useEffect, useCallback} from "react";
import { View, FlatList, Text, TouchableOpacity, Platform, ActivityIndicator, StyleSheet, Button } from "react-native";
import {useSelector, useDispatch} from "react-redux"
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart"
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../../const/Colors";
import * as productsActions from "../../store/actions/products"

const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        console.log("LOAD PRODUCTS");
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productsActions.fetchProducts());
        } catch(err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(()=> {
        const willFocusSub = props.navigation.addListener("willFocus", ()=>{
            loadProducts();
        });
        return() =>{
            willFocusSub.remove();
        }
    }, [loadProducts]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadProducts]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate("ProductDetail", {
            productId: id,
            productTitle: title
        });
    }

    if (error) {
        return <View style={styles.center}>
            <Text>An Error occured!</Text>
            <Button title="Try Again" onPress={loadProducts} color={Colors.primary}/>
        </View>
    }

    if (isLoading) {
        return <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary}/>
        </View>
    }

    if (!isLoading && products.length === 0) {
        return <View style={styles.center}>
            <Text>No products found!</Text>
       </View>
    }

    // Key Extractor is optional, because newer versions of Flatlist will detect the key in the products object
    // return <Text>Hallo</Text>
    return (<FlatList onRefresh={loadProducts} refreshing={isRefreshing} data={products} keyExtractor={item => item.id} renderItem={itemData => <ProductItem image={itemData.item.imageUrl} title={itemData.item.title} price={itemData.item.price} 
    onSelect={() => {
        selectItemHandler(itemData.item.id, itemData.item.title)
    }} 
    >
        <Button color={Colors.primary} title="View Details" onPress={() => {
        selectItemHandler(itemData.item.id, itemData.item.title)
    }}/>
        <Button color={Colors.primary} title="To Cart" onPress={() => {
            dispatch(cartActions.addToCart(itemData.item));
        }}/>
    </ProductItem>}/>)
};

ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle : "All Products",
        headerLeft: () => <TouchableOpacity onPress={() => {
            navData.navigation.toggleDrawer();
         }}>
         <View style={{marginLeft: 15, marginBottom: 10}}><Icon name={Platform.OS === "android" ? "md-menu": "ios-menu"} size={28} color="red"/></View>
        </TouchableOpacity>,
        headerRight : () => <TouchableOpacity onPress={() => {
           navData.navigation.navigate("CartScreen");
        }}>
        <View style={{marginRight: 15, marginBottom: 10}}><Icon name={Platform.OS === "android" ? "md-cart": "ios-cart"} size={28} color="red"/></View>
       </TouchableOpacity>
    }
};

const styles = new StyleSheet.create({
   center: {flex: 1, justifyContent: "center", alignItems: "center"}
})

export default ProductsOverviewScreen;
