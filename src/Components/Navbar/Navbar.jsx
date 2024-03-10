import React, {useContext, useEffect, useState} from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import {Link} from "react-router-dom";
import {ShopContext} from "../../Context/ShopContext";
import {logout, getCurrentUserAttr} from '../../services/authenticate';

const Navbar = () => {

    const [menu, setMenu] = useState("shop");

    const {getTotalCartItems} = useContext(ShopContext);

    const [user, setUser] = useState()
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUserAttr()
                setUser(user)
            } catch (err) {
                console.error(err)
            }
        }

        fetchUser()
    }, [])

    return (<div className='navbar'>
        <div className='nav-logo'>
            <img src={logo} alt=""/>
            <p>Shopper</p>
        </div>
        <ul className='nav-menu'>
            <li onClick={() => {
                setMenu("shop")
            }}><Link className='no-underline' to='/'>Shop</Link> {menu === "shop" ?
                <hr/> : <></>}</li>
            <li onClick={() => {
                setMenu("mens")
            }}><Link className='no-underline' to='/mens'>Mens</Link> {menu === "mens"
                ? <hr/> : <></>}</li>
            <li onClick={() => {
                setMenu("womens")
            }}><Link className='no-underline' to='/womens'>Womens</Link> {menu
            === "womens" ? <hr/>
                : <></>}</li>
            <li onClick={() => {
                setMenu("kids")
            }}><Link className='no-underline' to='/kids'>Kids</Link> {menu === "kids"
                ? <hr/> : <></>}</li>
        </ul>
        <div className='nav-login-cart'>
            {user != null ?
                <div>Hi {user.given_name} <button onClick={logout}>Logout</button></div>
                :
                <Link to='/login'>
                    <button>Login</button>
                </Link>
            }
            <Link to='/cart'><img src={cart_icon} alt=""/></Link>
            <div className='nav-cart-count'>{getTotalCartItems()}</div>
        </div>
    </div>)
}
export default Navbar
