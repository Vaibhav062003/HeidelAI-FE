// components/Login.js
import { auth, provider, signInWithPopup, signOut } from "@/components/firebase";

const Login = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User Info:", result.user);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Sign in with Google</button>
      <button onClick={handleLogout}>Sign out</button>
    </div>
  );
};

export default Login;
