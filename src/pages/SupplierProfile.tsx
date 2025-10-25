// @ts-nocheck
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, MessageSquare } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SupplierProfile = () => {
  const { supplierId } = useParams();
  const [supplier, setSupplier] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (supplierId) {
      fetchSupplierData();
    }
  }, [supplierId]);

  const fetchSupplierData = async () => {
    try {
      const { data: supplierData, error: supplierError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supplierId)
        .single();

      if (supplierError) throw supplierError;
      setSupplier(supplierData);

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("supplier_id", supplierId)
        .eq("status", "active");

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (error: any) {
      console.error("Error fetching supplier:", error);
      toast({
        title: "Error",
        description: "Failed to load supplier profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <p className="text-foreground">Supplier not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">HerTrade</h1>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gradient-card shadow-soft mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-warm rounded-full flex items-center justify-center text-4xl">
                {supplier.avatar_url || "👤"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-foreground">{supplier.name}</h2>
                  {supplier.verified && (
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{supplier.bio || "No bio available"}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {supplier.phone && <span>📞 {supplier.phone}</span>}
                  {supplier.email && <span>✉️ {supplier.email}</span>}
                </div>
              </div>
              <Link to={`/chat/${supplier.id}`}>
                <Button className="bg-gradient-warm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat with Supplier
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-2xl font-bold text-foreground mb-6">Products</h3>
        
        {products.length === 0 ? (
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-12 text-center">
              <p className="text-xl text-muted-foreground">No products available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden shadow-soft hover:shadow-medium transition-all bg-gradient-card">
                <CardHeader className="p-0">
                  <div className="bg-gradient-warm h-48 flex items-center justify-center text-8xl">
                    {product.image || "🏺"}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg text-foreground mb-2">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                  <p className="text-2xl font-bold text-primary">{product.price} ETB</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierProfile;