import React, {useReducer} from 'react';
import AuthContext from './authContext';
import axios from 'axios';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR ,
    LOGIN_SUCCESS,
    LOGIN_FAIL ,
    LOGOUT,
    CLEAR_ERRORS 
} from '../Types';

const AuthState = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        error: null,
        user: null
    };

    // state = contactReducer | dispatch = initialState.
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load User
    const loadUser = async () => {
        // Load token into global headers.
        // Also call setauthtoken() in app.js so it gets called every time the component loads.
        if(localStorage.token) {
            setAuthToken(localStorage.token);
        }

        try {
            const res = await axios.get('/api/auth');
// res.data = token.
            dispatch({
                type: USER_LOADED,
                payload: res.data
            });
        } catch (err) {
            dispatch({type: AUTH_ERROR});
        }
    }

    // Register User
    // formData equals the data we enter to register the user.
    const register = async formData => {
        // Since we're sending json data we need content-type to application/json.
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            // We don't have to write the whole URL localhost5000 bc it's already in the proxy in package.json
            // Ther response will be the payload. Which is a token in this case.
            const res = await axios.post('/api/users', formData, config);
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });
            // Call load user here and also in the page that you redirect to after they register e.g. home page.
            loadUser();

        } catch (err) {
            dispatch({
                type: REGISTER_FAIL,
                payload: err.response.data.msg
            })
        }
    }

    // Login User
    const login = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/auth', formData,config);

            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });

            loadUser();

        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,
                payload: err.response.data.msg
            })
        }
    }

    // Logout
    const logout = () => dispatch({type: LOGOUT});

    // Clear Errors
    const clearErrors = () => dispatch({type: CLEAR_ERRORS});
    
    return(        // we can use state bc we brought that in from useReducer?
                   // We return and export ContactState and wrap our application in app.js with it.
                   // Every piece of state needs to be declared. Contact, current etc.
        <AuthContext.Provider value={{
            token: state.token,
            isAuthenticated: state.isAuthenticated,
            loading: state.loading,
            user: state.user,
            error: state.error,
            register,
            clearErrors,
            loadUser,
            login,
            logout
            }}>  
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState;