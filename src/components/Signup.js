import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(''); // Added email state
  const [password, setPassword] = useState('');

  const nav = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, email, password }), // Updated to include email
      });

      if (response.ok) {
        alert('Signup successful');
        nav('/login');
        // Redirect or perform other actions after successful signup
      } else {
        console.error('Signup failed');
        // Handle signup failure
      }
    } catch (err) {
      console.error('Error during signup:', err);
      // Handle other errors, e.g., show an error message.
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
                  <h2 className="fw-bold">Signup</h2>
                  <div className="mb-3 my-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="d-grid">
                    <button
                      className="btn btn-outline-dark"
                      type="button"
                      onClick={handleSignup}
                    >
                      Signup
                    </button>
                  </div>
                  <div>
                    <p className="mb-0 text-center">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary fw-bold">
                        Login
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
