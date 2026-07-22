"use client";

import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { loginWithGoogle } from "../services/authService";

export default function GoogleSignInButton() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      console.log("Google button clicked");

      // Open Google account popup
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;
      console.log("Firebase User:", user);

      const idToken = await user.getIdToken();

      const data = await loginWithGoogle(idToken);

      console.log("Backend Response:", data);

      localStorage.setItem("token", data.token);

      router.push("/dashboard");

    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full rounded-full bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700"
    >
      Continue with Google
    </button>
  );
}