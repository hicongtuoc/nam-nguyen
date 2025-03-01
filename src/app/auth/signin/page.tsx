"use client";
import { signInWithGoogle } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const handleLogin = async () => {
    const result = await signInWithGoogle();
    await alert(result.success ? "Đăng nhập thành công!" : `Lỗi: ${result.message}`);
    await router.push("/");
  };

  return <button onClick={handleLogin} className="bg-blue-500 text-white p-3">Đăng nhập với Google</button>;
}
