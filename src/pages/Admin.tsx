import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Users, ShoppingBag, Shield, AlertCircle } from "lucide-react";

const pendingVerifications = [
  { id: 1, name: "Aster Tadesse", type: "Supplier", phone: "+251911234567", date: "2025-01-15", documents: 3 },
  { id: 2, name: "Tigist Haile", type: "Supplier", phone: "+251922345678", date: "2025-01-14", documents: 2 },
  { id: 3, name: "John Doe", type: "Client", phone: "+251933456789", date: "2025-01-14", documents: 1 },
];

const systemStats = {
  totalUsers: 1247,
  activeSuppliers: 348,
  totalOrders: 5621,
  pendingVerifications: 12,
};

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">HerTrade Admin</h1>
            </div>
            <Badge className="bg-gradient-warm">Admin Dashboard</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">Monitor and manage the HerTrade platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="pb-3">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl text-foreground">{systemStats.totalUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Clients & Suppliers</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="pb-3">
              <CardDescription>Active Suppliers</CardDescription>
              <CardTitle className="text-3xl text-primary">{systemStats.activeSuppliers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShoppingBag className="w-4 h-4" />
                <span>Verified artisans</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="pb-3">
              <CardDescription>Total Orders</CardDescription>
              <CardTitle className="text-3xl text-accent">{systemStats.totalOrders}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShoppingBag className="w-4 h-4" />
                <span>All time</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="pb-3">
              <CardDescription>Pending Verifications</CardDescription>
              <CardTitle className="text-3xl text-secondary">{systemStats.pendingVerifications}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <span>Needs attention</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="verifications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="verifications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-foreground">Pending Identity Verifications</h3>
            </div>

            {pendingVerifications.map((verification) => (
              <Card key={verification.id} className="bg-gradient-card shadow-soft">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-foreground">{verification.name}</h4>
                        <Badge variant="outline">{verification.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Phone: {verification.phone}</p>
                      <p className="text-sm text-muted-foreground">Submitted: {verification.date}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{verification.documents} documents uploaded</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Documents
                      </Button>
                      <Button size="sm" className="bg-accent text-accent-foreground">
                        Verify
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive">
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-gradient-card shadow-soft">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">User management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-gradient-card shadow-soft">
              <CardContent className="p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Order management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="bg-gradient-card shadow-soft">
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Reports and analytics coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
