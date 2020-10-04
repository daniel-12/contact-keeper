import React, {useReducer} from 'react';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import {v4 as uuidv4} from 'uuid';
import {
    SET_ALERT,
    REMOVE_ALERT
} from '../Types';

const AlertState = props => {
    const initialState = [];

    // state = contactReducer | dispatch = initialState.
    const [state, dispatch] = useReducer(alertReducer, initialState);

    // Set Alert
    const setAlert = (msg, type) => {
        const id = uuidv4();
        dispatch({
            type: SET_ALERT,
            payload: { msg, type, id }
        });

        setTimeout(() => dispatch({
            type: REMOVE_ALERT, 
            payload: id
        }), 5000);
    }
    
    return(        // we can use state bc we brought that in from useReducer?
                   // We return and export ContactState and wrap our application in app.js with it.
                   // Every piece of state needs to be declared. Contact, current etc.
        <AlertContext.Provider value={{
            alerts: state,
            setAlert
            }}>  
            {props.children}
        </AlertContext.Provider>
    )
}

export default AlertState;