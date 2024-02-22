import React, {useContext} from 'react'
import './CartItems.css'
import {ShopContext} from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const {getTotalCartAmount, all_product, cartItems, removeFromCart} = useContext(ShopContext);
  return (
      <div className='cart-items'>
        <div className='cart-items-format-main'>
          <p>Products</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr/>
        {all_product.map((e) => {
          if (cartItems[e.id] > 0) {
            return <div>
              <div className='cart-items-format cart-items-format-main'>
                <img className='cart-icon-product-icon' src={e.image} alt=""/>
                <p>{e.name}</p>
                <p>£{e.new_price}</p>
                <button
                    className='cart-items-quantity'>{cartItems[e.id]}</button>
                <p>£{e.new_price * cartItems[e.id]}</p>
                <img className='cart-icon-remove-icon' src={remove_icon} alt=""
                     onClick={() => {
                       removeFromCart(e.id)
                     }}/>
              </div>
              <hr/>
            </div>
          }
          return null;
        })}
        <div className='cart-items-down'>
          <div className='cart-items-total'>
            <h1>Cart Totals</h1>
            <div>
              <div className='cart-items-total-item'>
                <p>Subtotal</p>
                <p>£{getTotalCartAmount()}</p>
              </div>
              <hr/>
              <div className='cart-items-total-item'>
                <p>Shipping Cost</p>
                <p>Free</p>
              </div>
              <hr/>
              <div className='cart-items-total-item'>
                <h3>Total</h3>
                <h3>£{getTotalCartAmount()}</h3>
              </div>
            </div>
            <button>PROCEED TO CHECKOUT</button>
          </div>
          <div className='cart-items-promo-code'>
            <p>If you have a promo code, Enter it here</p>
            <div className='cart-items-promo-box'>
              <input type='text' placeholder='promo code'/>
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
  )
}
export default CartItems
