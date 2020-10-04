import React, {useReducer} from 'react';
import ContactContext from './contactContext';
import contactReducer from './contactReducer';
import axios from 'axios';
import {
    ADD_CONTACT,
    GET_CONTACTs,
    CLEAR_CONTACTS,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT,
    FILTER_CONTACTS,
    CLEAR_FILTER,
    CONTACT_ERROR
} from '../Types';

const ContactState = props => {
    const initialState = {
        contacts: null,
        current: null,
        filtered: null,
        error: null
    };

    // state = contactReducer | dispatch = initialState.
    const [state, dispatch] = useReducer(contactReducer, initialState);

    // Get Contacts
    const getContacts = async () => {

        try {
           const res = await axios.get('/api/contacts');

            dispatch({ 
                type: GET_CONTACTs,
                 payload: res.data 
                });
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.msg
            })
        }

    }
    // Add Contact
    const addContact = async contact => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('/api/contacts', contact, config);
            dispatch({ 
                type: ADD_CONTACT,
                 payload: res.data 
                });
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.msg
            })
        }

    }

    // Delete
    const deleteContact = async id => {
        try {
          await axios.delete(`/api/contacts/${id}`);

            dispatch({ 
                type: DELETE_CONTACT,
                 payload: id 
                });
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.msg
            })
        }
    }

        // update contact
        const updateContact = async contact => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
    
            try {     // MongoDB has an underscore id.
                const res = await axios.put(`/api/contacts/${contact._id}`, contact, config);
                dispatch({
                    type: UPDATE_CONTACT,
                     payload: res.data
                    });

            } catch (err) {
                dispatch({
                    type: CONTACT_ERROR,
                    payload: err.response.msg
                })
            }
        }

    const clearContacts = () => {
        dispatch({type: CLEAR_CONTACTS});
    }

    // Set Current Contact
    // Temporarily puts the payload under the current property
    const setCurrent = contact => {
        dispatch({ type: SET_CURRENT, payload: contact });
    }

    // clear current contact
    const clearCurrent = id => {
        dispatch({ type: CLEAR_CURRENT});
    }

    // filter contacts
    const filterContacts = text => {
        dispatch({ type: FILTER_CONTACTS, payload: text });
    }

    // clear filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER });
    }

    return(        // we can use state bc we brought that in from useReducer?
                   // We return and export ContactState and wrap our application in app.js with it.
                   // Every piece of state needs to be declared. Contact, current etc.
        <ContactContext.Provider value={{
            contacts: state.contacts,
            current: state.current,
            filtered: state.filtered,
            error: state.error,
            filterContacts,
            clearFilter,
            setCurrent,
            getContacts,
            clearCurrent,
            updateContact,
            addContact,
            deleteContact,
            clearContacts
            }}>  
            {props.children}
        </ContactContext.Provider>
    )
}

export default ContactState;