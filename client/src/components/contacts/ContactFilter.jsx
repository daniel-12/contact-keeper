import React from 'react';
import ContactContext from '../../context/contact/contactContext';
import { useContext, useRef, useEffect } from 'react';

const ContactFilter = () => {
    const contactContext = useContext(ContactContext);
    const text = useRef('');

    useEffect(() => {
        if(contactContext.filtered === null) {
            text.current.value = '';
        }
    })

    // useRef is used here to reference the input field without needing to use or create a state.
    // Otherwise we would've had to use something like this to work with the input value: defaultValue={state.text}
    const onChange = e => {
        if(text.current.value !== '') {
            contactContext.filterContacts(e.target.value);
        } else {
            contactContext.clearFilter();
        }
    }

    return (
        <form>
            <input ref={text} type="text" placeholder="Filter Contacts..." onChange={onChange}/>
        </form>
    )
}

export default ContactFilter
