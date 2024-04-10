import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import auth from "./firebase";

export default function Login({ setLogin, setAdmin, setLoginStatus }) {
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [step, setStep] = useState(1);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLogin(true);
      setLoginStatus("Logout");
      nav("/");
    }
  }, [setLogin, nav]);

  const sendOtp = async () => {
    try {
      const formattedPhoneNumber = `+91${phone}`;
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      const newConfirmation = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        recaptcha
      );
      setConfirmation(newConfirmation);
      setStep(2);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      if (response.ok) {
        const data = await response.json();

        setToken(data.token);

        if (phone === "123") {
          setAdmin(true);
          setLogin(true);
          setLoginStatus("Logout");
          localStorage.setItem("token", "admin");
          nav("/");
        } else {
          sendOtp();
        }
      } else {
        console.error("Authentication failed");
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  const verifyOtp = async () => {
    try {
      const recaptchaContainer = document.getElementById("recaptcha");
      const recaptcha = new RecaptchaVerifier(auth, recaptchaContainer, {
        size: "invisible",
      });
      recaptcha.render();

      if (!confirmation) {
        alert("Confirmation object is missing. Please retry OTP verification.");
        return;
      }

      const data = await confirmation.confirm(otp);
      if (data.user) {
        alert("Login successful");
        if (phone === "123" && password === "123") {
          setAdmin(true);
        }
        setLogin(true);
        setLoginStatus("Logout");
        localStorage.setItem("token", token);
        nav("/");
      } else {
        alert("OTP verification failed");
      }
    } catch (e) {
      console.error(e);
      alert("OTP verification failed");
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card bg-white">
              <div className="card-body p-5">
                <form className="mb-3">
                  <h2 className="fw-bold">LaptopPlaza.Login</h2>
                  {step === 1 && (
                    <>
                      <div className="mb-3 my-3">
                        <label htmlFor="phone" className="form-label">
                          Phone Number
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="phone"
                          placeholder="+91"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div id="recaptcha"></div>
                      <div className="d-grid my-3">
                        <button
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={handleLogin}
                        >
                          Login
                        </button>
                      </div>
                      <div>
                        <p className="mb-0 text-center">
                          Don't have an account?{" "}
                          <Link to="/signup" className="text-primary fw-bold">
                            Sign Up
                          </Link>
                        </p>
                      </div>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="otp" className="form-label">
                          OTP
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="otp"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                      <div id="recaptcha"></div>
                      <div className="d-grid">
                        <button
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={verifyOtp}
                        >
                          Verify OTP
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
