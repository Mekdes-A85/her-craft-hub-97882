import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, MessageSquare, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = ["All", "Pottery", "Handcraft", "Jewelry", "Textiles"];

  useEffect(() => {
    checkAuthAndFetchProducts();
  }, []);

  const checkAuthAndFetchProducts = async () => {
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

      if (profile?.role === "supplier") {
        navigate("/supplier");
        return;
      }

      fetchProducts();
    } catch (error: any) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          supplier:profiles(*)
        `)
        .eq("status", "active");

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string) => {
    if (!currentProfile) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .insert({
          user_id: currentProfile.id,
          product_id: productId,
          quantity: 1,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Info",
            description: "This item is already in your cart",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Success",
        description: "Added to cart",
      });
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.supplier?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">HerTrade</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/cart">
                <Button variant="outline" size="icon">
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline">My Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for products or suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-gradient-warm" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden shadow-soft hover:shadow-medium transition-all bg-gradient-card">
              <Link to={`/supplier-profile/${product.supplier.id}`}>
                <CardHeader className="p-0 cursor-pointer hover:opacity-90 transition-opacity">
                  <div className="bg-gradient-warm h-48 flex items-center justify-center text-8xl">
                    {product.image || "🏺"}
                  </div>
                </CardHeader>
              </Link>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                  {product.supplier?.verified && (
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <Link to={`/supplier-profile/${product.supplier.id}`}>
                  <p className="text-muted-foreground text-sm mb-3 hover:text-primary cursor-pointer">
                    by {product.supplier?.name}
                  </p>
                </Link>
                <p className="text-2xl font-bold text-primary">{product.price} ETB</p>
              </CardContent>
              <CardFooter className="p-6 pt-0 gap-2">
                <Button className="flex-1 bg-gradient-warm" onClick={() => addToCart(product.id)}>
                  Add to Cart
                </Button>
                <Link to={`/chat/${product.supplier.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No products found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
