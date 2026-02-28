import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Settings, User, Shield, Store } from "lucide-react";

const AdminSettings = () => {
  const { user } = useAuth();

  const [storeName, setStoreName] = useState("E-Commerce Store");
  const [storeEmail, setStoreEmail] = useState(user?.email || "admin@ecommerce.com");

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Settings saved successfully");
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your store configuration</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Admin Profile */}
        <Card className="bg-white dark:bg-zinc-950">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              Admin Profile
            </CardTitle>
            <CardDescription className="text-xs">Your admin account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="font-semibold">{user?.name || "Admin User"}</p>
                <p className="text-sm text-muted-foreground">{user?.email || "admin@ecommerce.com"}</p>
                <Badge className="mt-1 bg-blue-50 text-blue-600 border-blue-200 text-[10px]">
                  <Shield className="h-3 w-3 mr-1" />
                  {user?.role || "admin"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Settings */}
        <Card className="bg-white dark:bg-zinc-950">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Store className="h-4 w-4" />
              Store Configuration
            </CardTitle>
            <CardDescription className="text-xs">Configure your store settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName" className="text-xs">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail" className="text-xs">Contact Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="bg-white dark:bg-zinc-950">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stack</span>
                <span className="font-medium">MERN (MongoDB, Express, React, Node.js)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Gateway</span>
                <span className="font-medium">Stripe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Authentication</span>
                <span className="font-medium">JWT (httpOnly Cookies)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
