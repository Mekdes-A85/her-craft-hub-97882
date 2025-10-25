// @ts-nocheck
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Package, MessageSquare, TrendingUp, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddProductDialog } from "@/components/AddProductDialog";

const Supplier = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeOrders: 0,
    totalEarnings: 0,
    pendingMessages: 0,
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setCurrentProfile(profile);

      if (profile?.role !== "supplier") {
        navigate("/marketplace");
        return;
      }

      await fetchData(profile.id);
    } catch (error: any) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const fetchData = async (profileId: string) => {
    try {
      // Fetch products
      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("supplier_id", profileId);

      setProducts(productsData || []);

      // Fetch orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select(`
          *,
          product:products(name),
          client:profiles!orders_client_id_fkey(name)
        `)
        .eq("supplier_id", profileId)
        .order("created_at", { ascending: false });

      setOrders(ordersData || []);

      // Calculate stats
      const totalEarnings = ordersData?.reduce((sum: number, order: any) => 
        sum + parseFloat(order.amount), 0) || 0;

      setStats({
        totalProducts: productsData?.length || 0,
        activeOrders: ordersData?.filter((o: any) => o.status !== "delivered").length || 0,
        totalEarnings,
        pendingMessages: 0,
      });
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'in_progress' | 'ready' | 'delivered' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated",
      });

      if (currentProfile) {
        await fetchData(currentProfile.id);
      }
    } catch (error: any) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">HerTrade</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                ✓ Verified Supplier
              </Badge>
              <Link to="/profile">
                <Button variant="outline">My Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {currentProfile?.name}! 👋</h2>
          <p className="text-muted-foreground">Here's what's happening with your business today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="pb-3">
              <CardDescription>Total Products</CardDescription>
              <CardTitle className="text-3xl text-primary">{stats.totalProducts}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4" />
                <span>Active listings</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="pb-3">
              <CardDescription>Active Orders</CardDescription>
              <CardTitle className="text-3xl text-accent">{stats.activeOrders}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>Awaiting action</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="pb-3">
              <CardDescription>Total Earnings</CardDescription>
              <CardTitle className="text-3xl text-secondary">{stats.totalEarnings} ETB</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>This month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="pb-3">
              <CardDescription>Messages</CardDescription>
              <CardTitle className="text-3xl text-foreground">{stats.pendingMessages}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                <span>Unread messages</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-foreground">Recent Orders</h3>
            </div>
            
            {orders.map((order) => (
              <Card key={order.id} className="bg-gradient-card shadow-soft">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">{order.product?.name}</h4>
                      <p className="text-sm text-muted-foreground">Customer: {order.client?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-bold text-primary">{order.amount} ETB</p>
                    </div>
                    <div className="text-right space-y-3">
                      <Badge 
                        variant={order.status === "pending" ? "secondary" : order.status === "ready" ? "default" : "outline"}
                        className={order.status === "ready" ? "bg-accent" : ""}
                      >
                        {order.status === "pending" ? "⏳ Pending" : 
                         order.status === "in_progress" ? "🔨 In Progress" : 
                         order.status === "ready" ? "✓ Ready for Pickup" :
                         order.status === "delivered" ? "✓ Delivered" : order.status}
                      </Badge>
                      {order.status === "pending" && (
                        <Button 
                          size="sm" 
                          className="bg-gradient-warm w-full"
                          onClick={() => updateOrderStatus(order.id, "in_progress")}
                        >
                          Accept Order
                        </Button>
                      )}
                      {order.status === "in_progress" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => updateOrderStatus(order.id, "ready")}
                        >
                          Mark as Ready
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-foreground">My Products</h3>
              <Button className="bg-gradient-warm" onClick={() => setAddProductOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="bg-gradient-card shadow-soft">
                  <CardHeader className="p-0">
                    <div className="bg-gradient-warm h-32 flex items-center justify-center text-6xl">
                      {product.image || "🏺"}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">{product.name}</h4>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-lg font-bold text-primary">{product.price} ETB</p>
                      <Badge variant="outline">Stock: {product.stock}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="bg-gradient-card shadow-soft">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Chat interface coming soon...</p>
                <p className="text-sm text-muted-foreground mt-2">You have {stats.pendingMessages} unread messages</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddProductDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        onSuccess={() => {
          if (currentProfile) {
            fetchData(currentProfile.id);
          }
        }}
      />
    </div>
  );
};

export default Supplier;
