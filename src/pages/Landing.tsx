import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, ShoppingBag, MessageSquare, Truck } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">HerTrade</h1>
        </div>
        <nav className="flex gap-4">
          <Link to="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-gradient-warm">Get Started</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Empowering Ethiopian<br />
          <span className="text-primary">Women Artisans</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with talented craftswomen creating beautiful pottery, handwoven textiles, 
          and traditional jewelry. Support local entrepreneurs, get authentic products delivered to your door.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/auth?role=supplier">
            <Button size="lg" className="bg-gradient-warm shadow-medium hover:shadow-soft transition-all">
              I'm a Supplier
            </Button>
          </Link>
          <Link to="/auth?role=client">
            <Button size="lg" variant="outline" className="border-2 border-primary">
              I'm a Client
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all">
            <ShoppingBag className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-foreground">Marketplace Access</h3>
            <p className="text-muted-foreground">
              Create your profile, showcase your handcrafted products, and reach customers nationwide
            </p>
          </div>
          
          <div className="bg-gradient-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all">
            <MessageSquare className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-foreground">Direct Communication</h3>
            <p className="text-muted-foreground">
              Chat with clients directly. SMS support for those without smartphones
            </p>
          </div>
          
          <div className="bg-gradient-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all">
            <Truck className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-foreground">Integrated Logistics</h3>
            <p className="text-muted-foreground">
              Reliable delivery system connecting suppliers to clients with secure payment processing
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-warm rounded-3xl p-12 text-center text-white shadow-medium">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-5xl font-bold mb-2">500+</p>
              <p className="text-lg opacity-90">Women Entrepreneurs</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">2K+</p>
              <p className="text-lg opacity-90">Happy Customers</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">10K+</p>
              <p className="text-lg opacity-90">Products Delivered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground border-t border-border mt-16">
        <p>&copy; 2025 HerTrade. Empowering women entrepreneurs across Ethiopia.</p>
      </footer>
    </div>
  );
};

export default Landing;
