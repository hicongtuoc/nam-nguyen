"use client";

import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebaseConfig";

const saveUserToFirestore = async (user: any) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      provider: user.providerData[0]?.providerId,
      createdAt: new Date(),
      isAdmin: false,
    });
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await saveUserToFirestore(user);
    // Lưu thông tin user vào cookie
    document.cookie = `user=${JSON.stringify({
      uid: result.user.uid,
      email: result.user.email,
    })}; path=/;`;
    
    return { success: true, user };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
