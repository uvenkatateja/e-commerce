import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Heart, 
  ShoppingBag, 
  MapPin, 
  Lock, 
  LogOut, 
  Truck
} from "lucide-react";

const OrderHistory = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("shipping");
  const [activeSection, setActiveSection] = useState("orders");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my-orders");
        // Sort orders newest first
        const sortedOrders = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const onShippingOrders = orders.filter(
    (o) => o.paymentStatus === "paid" && new Date(o.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000 > Date.now()
  );
  
  const arrivedOrders = orders.filter(
    (o) => o.paymentStatus === "paid" && new Date(o.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000 <= Date.now()
  );

  const canceledOrders = orders.filter(
    (o) => o.paymentStatus !== "paid"
  );

  let displayedOrders = [];
  if (activeTab === "shipping") displayedOrders = onShippingOrders;
  if (activeTab === "arrived") displayedOrders = arrivedOrders;
  if (activeTab === "canceled") displayedOrders = canceledOrders;

  const menuItems = [
    { icon: User, label: "Profile", id: "profile" },
    { icon: Heart, label: "Wishlist", id: "wishlist" },
    { icon: ShoppingBag, label: "My Order", id: "orders" },
    { icon: MapPin, label: "Saved Address", id: "address" },
    { icon: Lock, label: "Change Password", id: "password" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-[1280px]">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
        
        {/* ─── LEFT SIDEBAR ─────────────────────────────────── */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="mb-6 lg:mb-8 px-2 hidden lg:block">
            <p className="text-xs text-gray-400 font-semibold tracking-wide uppercase mb-1">Good Morning,</p>
            <h2 className="text-[22px] font-bold text-gray-900 line-clamp-1 break-all">{user?.name || "Customer"}</h2>
          </div>

          <nav className="flex flex-row lg:flex-col gap-2.5 overflow-x-auto pb-4 lg:pb-0 scrollbar-none snap-x w-full">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex-shrink-0 snap-start flex items-center gap-3.5 px-6 py-4 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeSection === item.id 
                    ? "bg-[#1c1c1c] text-white shadow-md shadow-gray-200"
                    : "text-gray-700 hover:bg-gray-100 bg-[#f8f9fa]"
                }`}
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={2.5} />
                {item.label}
              </button>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex-shrink-0 snap-start flex items-center gap-3.5 px-6 py-4 rounded-2xl font-bold text-sm transition-all text-red-500 hover:bg-red-50 bg-[#f8f9fa] lg:mt-2 border border-transparent hover:border-red-100 whitespace-nowrap"
            >
              <LogOut className="h-[18px] w-[18px]" strokeWidth={2.5} />
              Logout
            </button>
          </nav>
        </div>

        {/* ─── RIGHT CONTENT ─────────────────────────────────── */}
        <div className="flex-1 w-full min-w-0">
          
          {/* Mobile-only greeting */}
          <div className="mb-6 px-2 lg:hidden">
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-0.5">Good Morning,</p>
            <h2 className="text-xl font-bold text-gray-900">{user?.name || "Customer"}</h2>
          </div>
          
          {/* PROFILE VIEW */}
          {activeSection === "profile" && (
            <div className="w-full animate-in fade-in duration-300">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">My Profile</h1>
              <div className="border border-gray-100 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] p-6 lg:p-10 mb-8">
                <div className="max-w-md space-y-5">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2 block">Full Name</label>
                    <input type="text" readOnly value={user?.name || ""} className="w-full h-12 bg-gray-50/80 border border-gray-100 rounded-2xl px-5 text-gray-900 font-bold focus:outline-none focus:border-gray-300 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2 block">Email Address</label>
                    <input type="email" readOnly value={user?.email || ""} className="w-full h-12 bg-gray-50/80 border border-gray-100 rounded-2xl px-5 text-gray-500 font-semibold focus:outline-none focus:border-gray-300 transition-colors" />
                  </div>
                  <div className="pt-4">
                    <button className="w-full h-12 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-colors shadow-sm">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WISHLIST VIEW */}
          {activeSection === "wishlist" && (
            <div className="w-full animate-in fade-in duration-300">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">My Wishlist</h1>
              <div className="py-20 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-center bg-gray-50/50">
                <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Your wishlist is empty</h3>
                <p className="text-gray-500 font-medium text-sm">Explore products and add them to your wishlist.</p>
                <div className="mt-8">
                  <Link to="/products" className="inline-flex items-center justify-center h-12 px-8 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                    Start Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* SAVED ADDRESS VIEW */}
          {activeSection === "address" && (
            <div className="w-full animate-in fade-in duration-300">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Saved Addresses</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 bg-white rounded-[2rem] p-6 lg:p-8 relative hover:border-gray-300 transition-colors">
                  <div className="absolute top-6 right-6 px-3 py-1 bg-gray-100 text-gray-600 font-black text-[10px] uppercase tracking-widest rounded-full">Default</div>
                  <MapPin className="h-6 w-6 text-gray-900 mb-4" />
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Home</h3>
                  <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
                    123 E-Commerce St, Business City<br/>
                    Illinois, 12345<br/>
                    United States
                  </p>
                  <button className="text-sm font-bold text-gray-900 underline decoration-2 underline-offset-4">Edit Address</button>
                </div>
                
                <div className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-[2rem] p-6 lg:p-8 flex flex-col items-center justify-center min-h-[220px] hover:bg-gray-50 cursor-pointer transition-colors text-gray-400 hover:text-gray-600">
                  <div className="h-12 w-12 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-3">
                    <span className="text-2xl font-light mb-1">+</span>
                  </div>
                  <p className="font-bold text-sm tracking-wide">Add New Address</p>
                </div>
              </div>
            </div>
          )}

          {/* CHANGE PASSWORD VIEW */}
          {activeSection === "password" && (
            <div className="w-full animate-in fade-in duration-300">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Change Password</h1>
              <div className="border border-gray-100 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] p-6 lg:p-10 mb-8">
                <div className="max-w-md space-y-5">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2 block">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full h-12 bg-gray-50/80 border border-gray-100 rounded-2xl px-5 text-gray-900 font-bold focus:outline-none focus:bg-white focus:border-gray-900 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2 block">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full h-12 bg-gray-50/80 border border-gray-100 rounded-2xl px-5 text-gray-900 font-bold focus:outline-none focus:bg-white focus:border-gray-900 transition-colors" />
                  </div>
                  <div className="pt-4">
                    <button className="w-full h-12 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-colors shadow-sm">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS VIEW */}
          {activeSection === "orders" && (
            <div className="w-full animate-in fade-in duration-300">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">My Orders</h1>
              
              {/* TABS */}
              <div className="flex items-center bg-[#f8f9fa] p-[5px] rounded-[1.25rem] mb-8 lg:mb-10 w-fit flex-shrink-0 overflow-x-auto max-w-full print:hidden">
                <button 
                  onClick={() => setActiveTab("shipping")}
                  className={`flex items-center gap-2 px-6 lg:px-8 py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
                    activeTab === "shipping" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-400 hover:text-gray-600 font-semibold"
                  }`}
                >
                  On Shipping
                  <span className={`flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] pb-px ${
                    activeTab === "shipping" ? "bg-gray-900 text-white" : "bg-gray-300 text-gray-600"
                  }`}>
                    {onShippingOrders.length}
                  </span>
                </button>
                <button 
                  onClick={() => setActiveTab("arrived")}
                  className={`flex items-center gap-2 px-6 lg:px-10 py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
                    activeTab === "arrived" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-400 hover:text-gray-600 font-semibold"
                  }`}
                >
                  <span className="opacity-90">Arrived</span>
                  <span className={`flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] pb-px ${
                    activeTab === "arrived" ? "bg-gray-900 text-white" : "bg-gray-300 text-gray-600"
                  }`}>{arrivedOrders.length}</span>
                </button>
                <button 
                  onClick={() => setActiveTab("canceled")}
                  className={`flex items-center gap-2 px-6 lg:px-10 py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
                    activeTab === "canceled" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-400 hover:text-gray-600 font-semibold"
                  }`}
                >
                  <span className="opacity-90">Canceled</span>
                  <span className={`flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] pb-px ${
                    activeTab === "canceled" ? "bg-gray-900 text-white" : "bg-gray-300 text-gray-600"
                  }`}>{canceledOrders.length}</span>
                </button>
              </div>

              {/* ORDERS LIST */}
              <div className="space-y-6">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-64 bg-gray-100 rounded-[2rem] w-full"></div>
                    <div className="h-64 bg-gray-100 rounded-[2rem] w-full"></div>
                  </div>
                ) : displayedOrders.length === 0 ? (
                  <div className="py-16 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-center bg-gray-50/50">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Orders Found</h3>
                    <p className="text-gray-500 font-medium text-sm">You haven't placed any orders here yet.</p>
                  </div>
                ) : (
                  displayedOrders.map((order) => (
                    <div key={order._id} className="border border-gray-100 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] p-6 lg:p-8 hover:border-gray-200 transition-colors w-full overflow-hidden">
                      
                      {/* Order Header */}
                      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div className="flex items-center gap-3">
                          <ShoppingBag className="h-[20px] w-[20px] lg:h-[22px] lg:w-[22px] text-gray-800" strokeWidth={2} />
                          <span className="font-bold text-base lg:text-lg tracking-tight text-gray-900">
                            CTH-{order._id.slice(-5).toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fff4ec] border border-[#ffe0cc]">
                          <div className="w-[6px] h-[6px] rounded-full bg-[#f87834]"></div>
                          <span className="text-[10px] lg:text-[11px] font-black tracking-wide uppercase text-[#e9641d] whitespace-nowrap">
                            {activeTab === 'shipping' ? 'On Deliver' : activeTab === 'arrived' ? 'Delivered' : 'Canceled'}
                          </span>
                        </div>
                      </div>

                      {/* Shipping Timeline Graphic */}
                      <div className="flex items-center gap-2 md:gap-4 text-[10.5px] md:text-[11.5px] text-gray-900 font-bold mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Truck className="h-4 w-4 text-gray-500" />
                          <span>Illinois, United States</span>
                        </div>
                        <div className="flex-1 border-t-2 border-dashed border-gray-200 min-w-[30px] mx-2"></div>
                        <span className="text-gray-400 font-semibold tracking-wide flex-shrink-0">
                          Estimated arrival: {new Date(new Date(order.createdAt).getTime() + 7*24*60*60*1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <div className="flex-1 border-t-2 border-dashed border-gray-200 min-w-[30px] mx-2 hidden sm:block"></div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{user?.name?.split(' ')[0] || "Customer"}'s House, <span className="text-gray-500">Indonesia</span></span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-4 mb-8">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 lg:gap-6 border border-gray-100/80 rounded-[1.5rem] lg:rounded-3xl p-3 pr-4 lg:pr-6 items-center bg-[#fafafa]">
                            {/* Placeholder image matched to aesthetic */}
                            <div className="w-16 h-20 md:w-24 md:h-28 bg-[#d8dbdf] rounded-[1rem] lg:rounded-2xl flex-shrink-0 overflow-hidden relative">
                               {item.productId?.imageUrl ? (
                                 <img src={item.productId.imageUrl} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                               ) : idx % 2 === 0 ? (
                                 // Mock image 1 for aesthetic missing images
                                 <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop" alt="Jacket" className="w-full h-full object-cover mix-blend-multiply" />
                               ) : (
                                 // Mock image 2 for aesthetic missing images
                                 <img src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&h=200&fit=crop" alt="Hat" className="w-full h-full object-cover mix-blend-multiply" />
                               )}
                            </div>
                            <div className="flex flex-col justify-center py-2 flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-[13px] md:text-sm mb-1.5 line-clamp-2 pr-2">{item.title}</h4>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="text-[13px] md:text-sm font-bold text-gray-900">
                                  Rp {(item.priceAtPurchase * 15000).toLocaleString('id-ID')}
                                </p>
                                <span className="text-gray-400 font-semibold text-xs ml-0.5 opacity-80">x{item.quantity}</span>
                              </div>
                              <p className="text-[11px] font-black text-gray-500 mt-2 tracking-wide uppercase">
                                {idx % 2 === 0 ? 'M' : 'L'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50/50">
                        <div className="text-[12px] lg:text-[13px] font-bold text-gray-500">
                          Total: <span className="font-bold text-gray-900 ml-1 text-[13px] lg:text-sm">Rp {(order.totalAmount * 15000).toLocaleString('id-ID')}</span>
                        </div>
                        <button className="px-5 lg:px-6 py-2.5 bg-[#f4f4f4] hover:bg-[#eaeaea] text-gray-900 text-[10px] lg:text-[11px] font-bold rounded-full transition-colors uppercase tracking-wider">
                          Details
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
