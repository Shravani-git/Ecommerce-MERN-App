import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import banner from "../assets/banner.png";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await login({ email: form.email, password: form.password });
    setBusy(false);
    if (res.ok) navigate(from, { replace: true });
  };

  return (
    <div className=" flex items-center justify-center bg-gray-50 min-h-screen p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 h-[90vh]">
        {/* Left image */}
        <div
          className="hidden md:block bg-gray-900 h-full"
          style={{
            backgroundImage: `url(${banner})`,
            backgroundSize: "cover",
            backgroundPosition: "top",
            minHeight: 520,
          }}
        />

        {/* Right form */}
        <div className="p-8 md:p-12 flex flex-col justify-center h-full">
          <h1 className="text-3xl font-extrabold mb-3">Welcome Back!</h1>
          <p className="text-sm text-gray-500 mb-8">
            Log in now to explore all the features and benefits of our platform and see what's new.
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

            {/* <div className="flex items-center justify-between text-sm text-gray-500">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                Remember my account
              </label>
              <Link to="#" className="hover:underline">Forgot Password?</Link>
            </div> */}

            <div className="mt-6 relative">
              {/* big orange button hugging the bottom-right like the design */}
              <button
                type="submit"
                disabled={busy}
                className="w-full md:w-auto px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg md:rounded-br-3xl hover:bg-orange-600 disabled:opacity-60"
              >
                {busy ? "Logging in..." : "Login"}
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-orange-500 font-medium">Register Now</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
