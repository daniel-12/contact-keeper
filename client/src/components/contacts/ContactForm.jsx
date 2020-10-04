import React, {useState, useContext, useEffect} from 'react'; 
import ContactContext from '../../context/contact/contactContext';

const ContactForm = () => {
const contactContext = useContext(ContactContext);
const {addContact, current, clearCurrent, updateContact} = contactContext;

// If the null property is not null, put that data in the form state.
useEffect(() => {
    if(current !== null) {
        setContact(current);
    } else {
        setContact({
            name: '',
            email: '',
            phone: '',
            type: 'personal'
        });
    }
}, [contactContext, current]);

const [contact, setContact] = useState({             //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    name: '', 
    email: '',
    phone: '',
    type: 'personal'
});

const {name, email, phone, type} = contact;

    // We spread the current state, we only change a field at a time. We change a property with e.target.name
    const onChange = e => setContact({...contact, [e.target.name]: e.target.value});     //!!!!!!!!!!!!!!!!!!!!!!!!!!

    
    const onSubmit = e => {
        e.preventDefault();
        if(current === null) {
            addContact(contact);  // Send the form, then reset the form.    //!!!!!!!!!!!!!!!!!!!!!!!!!!
        } else {
            updateContact(contact);
        }
        setContact({
            name: '',
            email: '',
            phone: '',
            type: 'personal'
        });
    }
    
    // To clear the form we set property back to null. useEffect takes care of the rest.
    const clearAll = () => {
        clearCurrent();
    }

    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-primary">{current ? 'Edit Contact' : "Add Contact"}</h2>
            <input type="text" placeholder="Name" name="name" value={name} onChange={onChange}/>   
            <input type="email" placeholder="Email" name="email" value={email} onChange={onChange}/>
            <input type="text" placeholder="Phone" name="phone" value={phone} onChange={onChange}/>
            <h5>Contact Type</h5>
            <input type="radio" name="type" value="personal" checked={type === "personal"} onChange={onChange}/> Personal{' '}
            <input type="radio" name="type" value="professional" checked={type === "professional"} onChange={onChange}/> Professional
            <div>
                <input type="submit" value={current ? 'Edit Contact' : "Add Contact"} className="btn btn-primary btn-block"/>
            </div>
            {current && <div>
                <button className="btn btn-light btn-block" onClick={clearAll}>Clear</button>
                </div>}
        </form>
    )
}

export default ContactForm
