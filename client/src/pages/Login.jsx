import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { EyeOff, Eye, ShoppingBag } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back!");
      navigate("/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf9f8]">
      {/* ─── LEFT SIDE (FORM) ───────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 md:px-16 lg:px-24 py-12 justify-center">

        {/* Form Container */}
        <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
            <p className="text-sm text-gray-500 font-medium">
              Choose from 10,000+ products across 400+ categories
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-gray-600 ml-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="johncanny@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full h-12 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#7a5c46]/50 shadow-sm bg-white text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5 relative">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-gray-600 ml-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="w-full h-12 pl-4 pr-10 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#7a5c46]/50 shadow-sm bg-white text-sm placeholder:text-gray-400 placeholder:tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between text-xs px-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-500 font-medium">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#7a5c46] focus:ring-[#7a5c46]"
                />
                <span>Remember Me</span>
              </label>
              <Link to="#" className="text-gray-500 hover:text-gray-800 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-4 bg-[#7a5c46] hover:bg-[#634937] text-white font-medium rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#7a5c46] hover:underline font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* ─── RIGHT SIDE (IMAGE) ──────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 p-8 lg:p-12 xl:p-24 justify-center items-center relative">
        <div className="w-full max-w-[480px] aspect-[4/5] rounded-[2rem] overflow-hidden bg-[#e6ddd5] relative shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1000&auto=format&fit=crop&q=80"
            alt="Minimalist Chair"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
