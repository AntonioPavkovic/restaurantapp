import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace, MdClose } from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import EmptyCart from "../img/emptyCart.svg";
import CartItem from "./CartItem";

const CartContainer = () => {
  const [{ cartShow, cartItems, user }, dispatch] = useStateValue();
  const [flag, setFlag] = useState(1);
  const [tot, setTot] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [formError, setFormError] = useState("");

  const showCart = () => {
    dispatch({
      type: actionType.SET_CART_SHOW,
      cartShow: !cartShow,
    });
  };

  useEffect(() => {
    let totalPrice = cartItems.reduce(function (accumulator, item) {
      return accumulator + item.qty * item.price;
    }, 0);
    setTot(totalPrice);
  }, [cartItems]);

  const clearCart = () => {
    dispatch({
      type: actionType.SET_CARTITEMS,
      cartItems: [],
    });

    localStorage.setItem("cartItems", JSON.stringify([]));
  };

  const handleCheckout = () => {
    setShowForm(true);
  };

  const handleOrderPlacement = () => {
    if (!name || !phoneNumber || !address) {
      setFormError("Please fill out all fields");
    } else {
      // Perform order placement logic here (e.g., saving the order to a database)

      // Clear the cart items
      dispatch({
        type: actionType.SET_CARTITEMS,
        cartItems: [],
      });

      // Display success message
      setOrderSuccess(true);
      setShowForm(false);
    }
  };

  const handleOrderSuccessClose = () => {
    setOrderSuccess(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 200 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 200 }}
      className="fixed top-0 right-0 w-full md:w-375 h-screen bg-white drop-shadow-md flex flex-col z-[101]"
    >
      <div className="w-full flex items-center justify-between p-4 cursor-pointer">
        <motion.div whileTap={{ scale: 0.75 }} onClick={showCart}>
          <MdOutlineKeyboardBackspace className="text-textColor text-3xl" />
        </motion.div>
        <p className="text-textColor text-lg font-semibold">Cart</p>

        <motion.p
          whileTap={{ scale: 0.75 }}
          className="flex items-center gap-2 p-1 px-2 my-2 bg-gray-100 rounded-md hover:shadow-md cursor-pointer text-textColor text-base"
          onClick={clearCart}
        >
          Clear <RiRefreshFill />
        </motion.p>
      </div>

      {showForm ? (
        <div className="w-full h-full bg-gray-900 bg-opacity-75 fixed top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md relative">
            <motion.div
              whileTap={{ scale: 0.75 }}
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setShowForm(false)}
            >
              <MdClose className="text-gray-500 text-2xl" />
            </motion.div>
            <h2 className="text-2xl font-semibold mb-4">Order Information</h2>
            {/* Form fields for name, phone number, and address */}
            {/* Replace with your own form implementation */}
            <input
              type="text"
              placeholder="Name"
              className="mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="mb-4"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              className="mb-4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="flex items-center justify-between">
              <p className="text-lg">Price to Pay:</p>
              <p className="text-lg font-semibold">${tot + 2.5}</p>
            </div>

            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleOrderPlacement}
            >
              Place Order
            </button>
            {formError && <p className="text-red-500">{formError}</p>}
          </div>
        </div>
      ) : orderSuccess ? (
        <div className="w-full h-full bg-gray-900 bg-opacity-75 fixed top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md">
            <motion.div
              whileTap={{ scale: 0.75 }}
              className="absolute top-4 right-4 cursor-pointer"
              onClick={handleOrderSuccessClose}
            >
              <MdClose className="text-gray-500 text-2xl" />
            </motion.div>
            <h2 className="text-2xl font-semibold mb-4">Order Successfully Placed!</h2>
            <p>Your order has been placed successfully.</p>
          </div>
        </div>
      ) : (
        <React.Fragment>
          {cartItems && cartItems.length > 0 ? (
            <div className="w-full h-full bg-cartBg rounded-t-[2rem] flex flex-col">
              {/* cart Items section */}
              <div className="w-full h-340 md:h-42 px-6 py-10 flex flex-col gap-3 overflow-y-scroll scrollbar-none">
                {/* cart Item */}
                {cartItems &&
                  cartItems.length > 0 &&
                  cartItems.map((item) => (
                    <CartItem key={item.id} item={item} setFlag={setFlag} flag={flag} />
                  ))}
              </div>

              {/* cart total section */}
              <div className="w-full flex-1 bg-cartTotal rounded-t-[2rem] flex flex-col items-center justify-evenly px-8 py-2">
                <div className="w-full flex items-center justify-between">
                  <p className="text-gray-400 text-lg">Sub Total</p>
                  <p className="text-gray-400 text-lg">$ {tot}</p>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p className="text-gray-400 text-lg">Delivery</p>
                  <p className="text-gray-400 text-lg">$ 2.50</p>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-lg font-semibold">$ {tot + 2.5}</p>
                </div>
                <button
                  type="button"
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <img src={EmptyCart} alt="empty-cart" className="h-44" />
              <p className="text-2xl text-gray-400 mt-8">Your cart is empty!</p>
            </div>
          )}
        </React.Fragment>
      )}
    </motion.div>
  );
};

export default CartContainer;
