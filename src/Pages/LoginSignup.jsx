import React, {useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {authenticateUser, createUser} from '../services/authenticate';
import {Button, TextField, Typography} from '@mui/material'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import './css/LoginSignup.css'

const LoginSignup = (props) => {

    const [state, setState] = useState("Login");

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const defaultLocale = localStorage['locale'] ? localStorage['locale'] : 'en'; // English is default locale if none is set
    const localeList = [
        {name: 'English', code: 'en', lang: 'English'},
        {name: 'Italiano', code: 'it', lang: 'Italian'},
        {name: 'Français', code: 'fr', lang: 'French'}
    ];
    const [currentLocale, setCurrentLocale] = useState(defaultLocale);

    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [serverErr, setServerErr] = useState('');

    const dateInputRef = useRef(null);
    const handleChange = (e) => {
        setBirthDate(e.target.value);
    };

    const onChangeLanguage = (e) => {
        const selectedLocale = e.target.value;
        setCurrentLocale(selectedLocale);
        localStorage.setItem('locale', selectedLocale)
    }
    const validation = () => {
        return new Promise((resolve, reject) => {
            if (email === '' && password === '') {
                setEmailErr("Email is Required");
                setPasswordErr("Password is required")
                resolve({email: "Email is Required", password: "Password is required"});
            } else if (email === '') {
                setEmailErr("Email is Required")
                resolve({email: "Email is Required", password: ""});
            } else if (password === '') {
                setPasswordErr("Password is required")
                resolve({email: "", password: "Password is required"});
            } else if (password.length < 6) {
                setPasswordErr("must be 6 character")
                resolve({email: "", password: "must be 6 character"});
            } else {
                resolve({email: "", password: ""});
            }
        });
    };
    const formInputChange = (formField, value) => {
        if (formField === "email") {
            setEmail(value);
        }
        if (formField === "password") {
            setPassword(value);
        }
    };
    const handleLoginClick = () => {
        setEmailErr("");
        setPasswordErr("");
        validation()
            .then((res) => {
                if (res.email === '' && res.password === '') {
                    authenticateUser(email, password, (err, result) => {
                        if (err) {
                            console.log(err);
                            setServerErr(err.message);
                            return;
                        }
                        setServerErr('');
                        console.log(result.user);
                        window.location.href = '/';
                    });
                }
            }, err => console.log(err))
            .catch(err => console.log(err));
    }

    const handleSignUpClick = () => {
        setEmailErr("");
        setPasswordErr("");
        validation()
            .then((res) => {
                if (res.email === '' && res.password === '') {
                    createUser(email, password, firstname, lastname, birthDate, phoneNumber, currentLocale, (err, result) => {
                        if (err) {
                            console.log(err);
                            setServerErr(err.message);
                            return;
                        }
                        setServerErr('');
                        console.log(result.user);
                        window.location.href = '/';
                    });
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='login-signup'>
            <div className='login-signup-container'>
                <h1>{state}</h1>
                <div className='login-signup-fields'>
                    <TextField
                        value={email}
                        onChange={(e) => formInputChange("email", e.target.value)}
                        label="Email Address"
                        helperText={emailErr}
                    />
                    <TextField
                        value={password}
                        onChange={(e) => {
                            formInputChange("password", e.target.value)
                        }}
                        type="password"
                        label="Password"
                        helperText={passwordErr}
                    />
                    {state === 'Sign Up' ?
                        <TextField
                            value={firstname}
                            label="First Name"
                            onChange={(e) => setFirstname(e.target.value)}
                        /> : <></>
                    }
                    {state === 'Sign Up' ?
                        <TextField
                            value={lastname}
                            label="Last Name"
                            onChange={(e) => setLastname(e.target.value)}
                        /> : <></>
                    }
                    {state === 'Sign Up' ?
                        <input
                            className='login-signup-datepicker'
                            type="date"
                            onChange={handleChange}
                            ref={dateInputRef}
                        /> : <></>
                    }
                    {state === 'Sign Up' ?
                        <TextField
                            value={phoneNumber}
                            label="Phone Number"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        /> : <></>
                    }
                    {state === 'Sign Up' ?
                        <Select onChange={onChangeLanguage} defaultValue={currentLocale} className='login-signup-locale'>
                            {
                                localeList.map((locale, index) => (
                                    <MenuItem key={index} value={locale.code}>{locale.name}</MenuItem>
                                ))
                            }
                        </Select>
                        : <></>
                    }
                </div>
                {state === 'Sign Up' ?
                    <Button type='submit' variant='contained' onClick={handleSignUpClick}>Sign Up</Button>
                    :
                    <Button type='submit' variant='contained' onClick={handleLoginClick}>Login</Button>
                }
                {state === 'Sign Up' ?
                    <p className='login-signup-login'>Already have an account? <span onClick={() => {
                        setState("Login")
                    }}>Login here</span></p>
                    :
                    <p className='login-signup-login'>Create an account? <span onClick={() => {
                        setState("Sign Up")
                    }}>Click here</span></p>}
                <Typography variant="body" className='login-error'>{serverErr}</Typography>
            </div>
        </div>
    )
}
export default LoginSignup