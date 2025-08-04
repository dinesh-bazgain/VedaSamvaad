import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl bg-[url('./assets/images/bg-pattern.svg')]">
      {/* ----------------- Logo Section - Simplified ---------------- */}
      <img src="./assets/images/logo.png" className="w-[min(30vw, 250px)]" />

      {/* ---------------- Login Form ---------------- */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/10 backdrop-blur-md text-white border-gray-600 p-6 flex flex-col gap-5 rounded-xl shadow-xl w-full max-w-md"
      >
        {/* ... rest of your form code remains the same ... */}
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src="./assets/images/arrowIcon.png"
              className="w-5 cursor-pointer"
              alt="Back"
            />
          )}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-3 border border-gray-600 rounded-lg focus:outline-none bg-white/5"
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Id"
              required
              className="p-3 border border-gray-600 rounded-lg focus:outline-none bg-white/5"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="p-3 border border-gray-600 rounded-lg focus:outline-none bg-white/5"
            />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-3 border border-gray-600 rounded-lg focus:outline-none bg-white/5"
            placeholder="Share a short bio about yourself..."
            required
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-[#C0353A] to-[#24366A] text-white rounded-lg cursor-pointer hover:opacity-90 transition-all mt-2"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-300 mt-2">
          <input type="checkbox" required className="accent-[#138808]" />
          <p>Agree to our terms & privacy policy</p>
        </div>

        <div className="mt-3 text-center">
          {currState === "Sign up" ? (
            <p className="text-gray-300">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className="text-blue-400 cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-gray-300">
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Sign up");
                }}
                className="text-blue-400 cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
