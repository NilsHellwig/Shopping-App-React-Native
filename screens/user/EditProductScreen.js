import React, { useEffect, useState, useCallback, useReducer } from "react"; // useReducer does nothing to do with Redux
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Alert, KeyboardAvoidingView, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from "react-redux"
import * as productsActions from "../../store/actions/products"

import Input from "../../components/UI/Input"
import Colors from "../../const/Colors"

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const EditProductScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const prodId = props.navigation.getParam("productId");
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: ""
    }, inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,

    },
    formIsValid: editedProduct ? true : false
  })

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{text: "Okay"}]);
    }
  }, [error])

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form.", [{ text: "Okay" }])
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      if (editedProduct) {
        await dispatch(productsActions.updateProduct(prodId, formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl));
      } else {
        await dispatch(productsActions.createProduct(formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl, +formState.inputValues.price));
      }
      props.navigation.goBack();
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false)
  }, [dispatch, prodId, formState]);

  useEffect(() => {

    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);
  // default ist eigentlich unnötig, da es der standard ist
  // in der Doku gibt es viele Anpassungen dazu

  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
    dispatchFormState({ type: FORM_INPUT_UPDATE, value: inputValue, isValid: inputValidity, input: inputIdentifier });
  }, [dispatchFormState]);

  if (isLoading) {
    return <View style={styles.centered}>
      <ActivityIndicator size="large" color={Colors} />
    </View>
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={100}>
      <ScrollView>
        <View style={styles.form}>
          <Input id="title" label="Title" required errorText="Please enter a valid title!" keyboardType="default" autoCapitalize="sentences" returnKeyType="next" onInputChange={inputChangeHandler} initialValue={editedProduct ? editedProduct.title : ""} initiallyValid={!!editedProduct} />
          <Input id="imageUrl" label="Image Url" required errorText="Please enter a valid image url!" keyboardType="default" returnKeyType="next" initialValue={editedProduct ? editedProduct.imageUrl : ""} initiallyValid={!!editedProduct} onInputChange={inputChangeHandler} />
          {editedProduct ? null :
            <Input id="price" label="Price" required min={0.1} errorText="Please enter a valid price!" keyboardType="decimal-pad" returnKeyType="next" onInputChange={inputChangeHandler} />
          }
          <Input id="description" label="Description" required minLength={5} errorText="Please enter a valid description!" keyboardType="default" autoCapitalize="sentences" multiline numberOfLines={3} initialValue={editedProduct ? editedProduct.description : ""} initiallyValid={!!editedProduct} onInputChange={inputChangeHandler} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>)
};

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId") ? "Edit Product" : "Add Product",
    headerRight: (() => <TouchableOpacity onPress={submitFn}>
      <View style={{ marginRight: 15, marginBottom: 10 }}><Icon name={Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"} size={28} color="red" /></View>
    </TouchableOpacity>),
  };
}

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default EditProductScreen