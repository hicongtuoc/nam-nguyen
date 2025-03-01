"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "./lib/firebaseConfig";
import { StatusProduct } from "@/types/enum";
import { useAuth } from "@/providers/AuthProvider";

interface Product {
  id: string;
  name: string;
  status: StatusProduct;
  borrowedBy?: string;
  history: { user: string; date: string }[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { user, userData, loading, logout } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });
  
    return () => unsubscribe(); // Cleanup khi component unmount
  }, []);

  const handleBorrow = async (product: Product) => {
    if (!user) return;
    const productRef = doc(db, "products", product.id);
    await updateDoc(productRef, {
      status: StatusProduct.ACTIVE,
      borrowedBy: user.email,
      history: [
        ...product.history,
        { user: user.email, date: new Date().toISOString() },
      ],
    });
  };

  const handleReturn = async (product: Product) => {
    if (!user || product.borrowedBy !== user.email) return;
    const productRef = doc(db, "products", product.id);
    await updateDoc(productRef, {
      status: StatusProduct.INACTIVE,
      borrowedBy: null,
    });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Demo
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <img src={user?.photoURL || ""} alt="Avatar" width={50} />
              <button onClick={logout}>Đăng xuất</button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="p-4">
          <h1 className="text-xl font-bold">Danh sách sản phẩm</h1>
          <ul>
            {products.map((product) => (
              <li
                key={product.id}
                className="p-2 border-b flex justify-between items-center"
              >
                <span>
                  {product.name} -{" "}
                  {product.borrowedBy && `(${product.borrowedBy})`}
                  {product.status === StatusProduct.ACTIVE
                    ? "Đã mượn"
                    : "Chưa mượn"}{" "}
                </span>
                <div>
                  <button
                    onClick={() => handleBorrow(product)}
                    className="bg-blue-500 text-white p-2 m-1"
                  >
                    Mượn
                  </button>
                  <button
                    onClick={() => handleReturn(product)}
                    className="bg-red-500 text-white p-2 m-1"
                  >
                    Trả đồ
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
