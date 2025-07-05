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

  const clearCart = async () => {
    try {
      // Delete all documents from the "cart" collection
      const querySnapshot = await getDocs(collection(db, "cart"));
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Clear the cart in the local state
      setcartItem([]);
      ToastAlert("you buy items", "success");
    } catch (error) {
      console.log("Error clearing cart:", error.message);
    }
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
