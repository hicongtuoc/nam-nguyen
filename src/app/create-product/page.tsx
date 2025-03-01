"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "../lib/firebaseConfig";
import { StatusProduct } from "@/types/enum";
import { useAuth } from "@/providers/AuthProvider";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const router = useRouter();
  const { user, userData, loading, logout } = useAuth();
  console.log("user", user);
  console.log("userData", userData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), {
      name,
      borrowedBy: null,
      history: [],
      createdBy: user?.email,
      status: StatusProduct.INACTIVE,
    });
    await router.push("/");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Tạo sản phẩm mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên sản phẩm"
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2">
          Tạo
        </button>
      </form>
    </div>
  );
}
