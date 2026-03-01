import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { EyeOff, Eye, ShoppingBag } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      toast.success("Account created successfully!");
      navigate("/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf9f8]">
      {/* ─── LEFT SIDE (FORM) ───────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 md:px-16 lg:px-24 py-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-10">
          <ShoppingBag className="h-6 w-6 text-[#7a5c46]" />
          <span className="text-xl font-bold tracking-widest text-[#7a5c46] uppercase">
            Luxora
          </span>
        </Link>

        {/* Form Container */}
        <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-sm text-gray-500 font-medium">
              Join us to choose from 10,000+ products across 400+ categories
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 shadow-sm">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-gray-600 ml-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full h-11 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#7a5c46]/50 shadow-sm bg-white text-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-gray-600 ml-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="johncanny@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full h-11 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#7a5c46]/50 shadow-sm bg-white text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5 relative">
              <label htmlFor="password" className="text-xs font-semibold text-gray-600 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full h-11 pl-4 pr-10 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#7a5c46]/50 shadow-sm bg-white text-sm placeholder:tracking-normal focus:placeholder:tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 relative">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-600 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full h-11 pl-4 pr-10 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#7a5c46]/50 shadow-sm bg-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-4 bg-[#7a5c46] hover:bg-[#634937] text-white font-medium rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-[#7a5c46] hover:underline font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ─── RIGHT SIDE (IMAGE) ──────────────────────── */}
      <div className="hidden lg:block lg:w-1/2 p-4">
        <div className="w-full h-full rounded-[2rem] overflow-hidden bg-[#e6ddd5] relative">
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

export default Register;
