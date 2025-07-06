import "./styles.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ToastAlert } from "../../utils/toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const index = (props) => {
  const [cartItem, setcartItem] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [load, setLoad] = useState();

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "cart"));
    const tempArr = [];

    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      // console.log(doc.data());
      tempArr.push({
        id: doc.id,
        item: doc.data(),
      });
    });

    setcartItem([...tempArr]);
  };

  const deletItem = async (id) => {
    setLoad(true);
    try {
      await deleteDoc(doc(db, "cart", id));
      setRefresh(!refresh);
      console.log("delete ");
      ToastAlert("Item Deleted", "success");
      setLoad(false);
    } catch (error) {
      console.log("error", error.message);
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  // Check for successful payment return from Stripe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status');
    
    if (paymentStatus === 'success') {
      // Clear cart after successful payment
      const clearCartAfterPayment = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "cart"));
          querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
          setcartItem([]);
          ToastAlert("Payment successful! Items purchased.", "success");
          
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.log("Error clearing cart after payment:", error);
        }
      };
      if ( paymentStatus === 'cancel') {
        ToastAlert("Payment cancelled.", "error");
      }
      
      clearCartAfterPayment();
    }
  }, []);

  const clearCart = async () => {
      const totalAmount = cartItem.reduce(
        (total, obj) => total + (parseInt(obj.item.value.prize) * parseInt(obj.item.value.quantity)),
        0
      );
    const line_items = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Cart Items',
          },
          unit_amount: totalAmount * 100, // $50
        },
        quantity: 1,
      },
    ];
  
    const params = new URLSearchParams();

  params.append('payment_method_types[]', 'card');
  params.append('mode', 'payment');
  params.append('success_url', window.location.origin + '/cart?payment_status=success');
  params.append('cancel_url', window.location.origin + '/cart?payment_status=cancel');

  // line_items[0][price_data][currency]=usd
  params.append('line_items[0][price_data][currency]', 'usd');
  params.append('line_items[0][price_data][product_data][name]', 'Cart Items');
  params.append('line_items[0][price_data][unit_amount]', (totalAmount * 100).toString()); // $50
  params.append('line_items[0][quantity]', '1');
  
  
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });
  
    const session = await response.json();
  
    if (session.error) {
      ToastAlert(`Error: ${session.error.message}`, "error");
      return;
    }
  
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: session.id });

    ToastAlert("Payment successful! Items purchased.", "success");
    
  };

  // console.log(cartItem)
  return (
    <>
      <section id="cart" className="section-p1 my-[8rem]">
        <table
          width="100%"
          className="border border-2 border-[#e2e8f0] rounded-full"
        >
          <thead>
            <tr>
              <td>Remove</td>
              <td>Image</td>
              <td>Product</td>
              <td>Price</td>
              <td>Quantity</td>
              <td>Subtotal</td>
            </tr>
          </thead>
          <tbody>
            {cartItem.map((obj, index) => (
              <tr key={index}>
                <td>
                  <a
                    className="cursor-pointer"
                    onClick={() => deletItem(obj.id)}
                  >
                    <CloseRoundedIcon />
                  </a>
                </td>
                <td className="flex justify-center ms-[2rem]">
                  <img src={obj.item.value.thumbnail} alt="" />
                </td>
                <td>{obj.item.value.title}</td>
                <td>{"$" + obj.item.value.prize}</td>
                <td>
                  <input
                    type="number"
                    value={obj.item.value.quantity}
                    disabled
                  />
                </td>
                <td>
                  {"$" +
                    parseInt(obj.item.value.prize) *
                      parseInt(obj.item.value.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="cart-add" className="section-p1">
        <div id="subtotal" className="overflow-x-auto">
          <h3>Cart Totals</h3>
          <table>
            <tbody>
              <tr>
                <td>Card Subtotal</td>
                <td>
                  {"$" +
                    cartItem.reduce(
                      (subtotal, obj) =>
                        subtotal +
                        parseInt(obj.item.value.prize) *
                          parseInt(obj.item.value.quantity),
                      0
                    )}
                </td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>Free</td>
              </tr>
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>
                    {"$" +
                      cartItem.reduce(
                        (subtotal, obj) =>
                          subtotal +
                          parseInt(obj.item.value.prize) *
                            parseInt(obj.item.value.quantity),
                        0
                      )}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
          <button className="normal" onClick={clearCart}>
            Proceed To Checkout
          </button>
        </div>
      </section>
    </>
  );
};

export default index;
