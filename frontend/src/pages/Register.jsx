import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import shoe from "../assets/image.png";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", password2: "" });
  const [busy, setBusy] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      alert("Passwords do not match");
      return;
    }
    setBusy(true);
    const res = await register({ email: form.email, password: form.password });
    setBusy(false);
    if (res.ok) navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 h-[90vh]">
        {/* Left form (note: for register image should be right) */}
        <div className="p-8 md:p-12 flex flex-col justify-center h-full">
          <h1 className="text-3xl font-extrabold mb-3">Create Account</h1>
          <p className="text-sm text-gray-500 mb-8">
            Sign up to start adding favorites, tracking orders and creating wishlists.
          </p>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-sm text-gray-500">Enter your email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="johndoe@mail.domain"
                className="mt-2 w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Enter your Password</label>
              <div className="mt-2 relative">
                <input
                  required
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  minLength={6}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-100 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Confirm Password</label>
              <input
                required
                type="password"
                value={form.password2}
                onChange={(e) => setForm({ ...form, password2: e.target.value })}
                placeholder="Confirm password"
                minLength={6}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={busy}
                className="w-full px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-60"
              >
                {busy ? "Creating..." : "Create account"}
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-500 font-medium">Login</Link>
            </p>
          </form>
        </div>

        {/* Right image */}
        <div
          className="hidden md:block h-full"
          style={{
            backgroundImage: `url(${shoe})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: 520,
          }}
        />
      </div>
    </div>
  );
}
