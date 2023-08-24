"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  QuerySnapshot,
  query,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

interface Item {
  name?: string | undefined;
  price?: number | undefined;
  id?: string | undefined;
}

export default function Home() {
  const [items, setItems] = useState<Array<Item>>();
  const [total, setTotal] = useState<number>(0);
  const [newItem, setNewItem] = useState<Item>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  // Handle change in inputs values.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewItem({ ...newItem, [e.target.name]: value });
  };

  // Add item to database.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newItem?.name === "" || newItem?.price === undefined)
      return setError("Please enter item name and price to continue.");
    else {
      setError("");
      try {
        await addDoc(collection(db, "items"), {
          name: newItem.name,
          price: newItem.price,
        });
        setNewItem({ name: undefined, price: undefined, id: undefined });
      } catch (e: any) {
        setError(e.message);
      }
    }
  };

  // Read item from database.
  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr: any = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });

      setItems(itemsArr);
      setLoading(false);

      // Read total from fetched items from database.
      const calculateTotal = (itemsArr: Array<Item>) => {
        const total = itemsArr?.reduce((acc, item) => {
          return acc + parseFloat(`${item.price}`);
        }, 0);
        setTotal(total);
      };

      calculateTotal(itemsArr);
      return () => unsubscribe();
    });
  }, []);

  // Delete item from database.
  const handleDelete = async (id: string | undefined) => {
    if (id === undefined) return setError("Item not found.");
    await deleteDoc(doc(db, "items", id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <section className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Expense Tracker</h1>
        {loading ? (
          <section className="bg-slate-800 p-4 rounded-lg w-full h-full">
            <h2 className="text-2xl p-4 text-center">Loading...</h2>
          </section>
        ) : (
          <section className="bg-slate-800 p-4 rounded-lg">
            <form
              className="grid grid-cols-6 gap-3 items-center text-black"
              onSubmit={handleSubmit}
            >
              {error === "" ? (
                ""
              ) : (
                <p className="col-span-6 text-white font-semibold tracking-wider p-4 bg-slate-950 border border-red-500">
                  {error}
                </p>
              )}
              <input
                className="col-span-3 p-3 border"
                type="text"
                name="name"
                placeholder="Enter Item"
                value={newItem?.name === undefined ? "" : newItem?.name}
                onChange={handleChange}
              />
              <input
                className="col-span-2 p-3 border"
                type="number"
                name="price"
                placeholder="Enter $"
                value={newItem?.price === undefined ? "" : newItem?.price}
                onChange={handleChange}
              />
              <button
                className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-base md:text-xl col-span-1"
                type="submit"
              >
                Add
              </button>
            </form>

            <ul>
              {items?.map((item: Item) => {
                return (
                  <li
                    className="my-4 w-full flex justify-between bg-slate-950"
                    key={item.id}
                  >
                    <div className="p-4 w-full flex justify-between">
                      <span className="capitalize">{item.name}</span>
                      <span className="">${item.price}</span>
                    </div>

                    <button
                      className="ml-8 p-4 border-l-2 border-l-slate-900 hover:bg-slate-900 w-20"
                      onClick={() => handleDelete(item?.id)}
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>

            {items!!?.length < 1 && !loading ? (
              ""
            ) : (
              <div className="p-4 w-full flex justify-between bg-slate-950">
                <span className="capitalize">Total</span>
                <span className="">${total}</span>
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
