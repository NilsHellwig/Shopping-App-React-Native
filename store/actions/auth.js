import {AsyncStorage} from "react-native";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime))
    dispatch({type: AUTHENTICATE, userId: userId, token: token})
  };
};

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDR0UhDbGtSrPA9NMpv3Em0Gk5yRrN1jBU',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    // wie bei login wäre es gut, auch hier errors abzufragen
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();
    console.log(resData);
    dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
    const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDR0UhDbGtSrPA9NMpv3Em0Gk5yRrN1jBU',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Something went wrong!"
      if (errorId === "EMAIL_NOT_FOUND") {
          message = "This email could not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
          message = "This password is not valid!"
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);
    dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
    const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  console.log("saveToStorage: ", userId);
  AsyncStorage.setItem("userData", JSON.stringify({
    token: token,
    userId: userId,
    expiryDate: expirationDate.toISOString(),
  }))
}

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return {type: LOGOUT};
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer)
  } 
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
       dispatch(logout()); 
    }, expirationTime);
  }
};

