import { useState, useMemo } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart, MapPin, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import NotFound from "@/pages/not-found";

import tshirtImg from "./assets/images/tshirt.png";
import pantsImg from "./assets/images/pants.png";
import tnSneakerImg from "./assets/images/tn-sneaker.png";

const queryClient = new QueryClient();

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  featured?: boolean;
}

const products: Product[] = [
  {
    id: "p1",
    name: "Camiseta personalizada",
    price: 49.99,
    image: tshirtImg,
  },
  {
    id: "p2",
    name: "Calça baggy moletom",
    price: 79.99,
    image: pantsImg,
  },
  {
    id: "p3",
    name: "TN sunset",
    price: 299.99,
    image: tnSneakerImg,
    featured: true,
  }
];

const neighborhoods = [
  { id: "boa-vista", name: "Jardim Boa Vista", shipping: 49.99 },
  { id: "lago", name: "Jardim do Lago", shipping: 49.99 },
];

function Storefront() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [neighborhood, setNeighborhood] = useState<string>("");

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: next };
    });
  };

  const subtotal = useMemo(() => {
    return Object.entries(cart).reduce((acc, [id, qty]) => {
      const product = products.find(p => p.id === id);
      return acc + (product ? product.price * qty : 0);
    }, 0);
  }, [cart]);

  const selectedNeighborhood = neighborhoods.find(n => n.id === neighborhood);
  const shipping = selectedNeighborhood ? selectedNeighborhood.shipping : 0;
  const total = subtotal + (subtotal > 0 ? shipping : 0);

  const handleCheckout = () => {
    if (Object.keys(cart).length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos antes de finalizar o pedido.",
        variant: "destructive"
      });
      return;
    }
    
    if (!neighborhood) {
      toast({
        title: "Bairro não selecionado",
        description: "Selecione o bairro para entrega.",
        variant: "destructive"
      });
      return;
    }

    const itemsText = Object.entries(cart).map(([id, qty]) => {
      const product = products.find(p => p.id === id);
      return `${qty}x ${product?.name} (R$ ${product?.price.toFixed(2).replace('.', ',')})`;
    }).join('\n');

    const message = `🔥 *Novo Pedido - Vitrine Streetwear*\n\n*Produtos:*\n${itemsText}\n\n*Entrega:*\nBairro: ${selectedNeighborhood?.name}\nFrete: R$ ${shipping.toFixed(2).replace('.', ',')}\n\n*Total a pagar: R$ ${total.toFixed(2).replace('.', ',')}*`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/551140028922?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground pb-24 font-sans selection:bg-primary selection:text-white">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF5733] to-[#FFC300] bg-clip-text text-transparent font-display tracking-wider flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="fire">🔥</span> VITRINE STREETWEAR
          </h1>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl mx-auto space-y-12">
        <section>
          <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
              <motion.div 
                key={product.id}
                className={product.featured ? "col-span-2" : "col-span-1"}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className={`overflow-hidden border-border bg-card h-full flex flex-col ${product.featured ? 'border-[#FFC300]/50 shadow-[0_0_15px_rgba(255,195,0,0.15)] relative' : ''}`}>
                  {product.featured && (
                    <div className="absolute top-2 left-2 z-10 bg-[#FF5733] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-widest font-display">
                      Destaque
                    </div>
                  )}
                  <div className={`relative ${product.featured ? 'aspect-[16/9]' : 'aspect-square'} overflow-hidden bg-muted`}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60"></div>
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1 justify-between gap-4 bg-gradient-to-b from-transparent to-background/50">
                    <div>
                      <h3 className="font-semibold text-lg leading-tight uppercase font-display tracking-wide">{product.name}</h3>
                      <p className="text-primary font-medium mt-1">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                      <span className="text-sm text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Qtd</span>
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full border-border hover:bg-primary hover:text-white hover:border-primary transition-colors"
                          onClick={() => handleUpdateQuantity(product.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center font-medium font-mono text-sm">
                          {cart[product.id] || 0}
                        </span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full border-border hover:bg-primary hover:text-white hover:border-primary transition-colors"
                          onClick={() => handleUpdateQuantity(product.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-6 bg-card border border-border p-6 rounded-xl">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold uppercase font-display tracking-widest">Entrega</h2>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground uppercase text-[10px] tracking-widest">Selecione seu bairro</label>
            <Select value={neighborhood} onValueChange={setNeighborhood}>
              <SelectTrigger className="w-full bg-background border-border h-12">
                <SelectValue placeholder="Escolha o bairro..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {neighborhoods.map(n => (
                  <SelectItem key={n.id} value={n.id} className="focus:bg-primary/20">
                    {n.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="space-y-4 bg-card border border-border p-6 rounded-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold uppercase font-display tracking-widest">Resumo do Pedido</h2>
          </div>
          
          <div className="space-y-3 font-mono text-sm pt-2">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Frete</span>
              <span>{subtotal > 0 && shipping > 0 ? `R$ ${shipping.toFixed(2).replace('.', ',')}` : '-'}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-foreground border-t border-border/40 pt-3 mt-3">
              <span className="font-sans uppercase font-display tracking-widest">Total</span>
              <span className="text-[#FFC300]">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-50">
        <div className="container max-w-4xl mx-auto">
          <Button 
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#FF5733] to-[#FFC300] hover:opacity-90 transition-opacity text-black border-none uppercase font-display tracking-widest shadow-[0_0_20px_rgba(255,87,51,0.3)]"
            onClick={handleCheckout}
          >
            Finalizar Pedido no WhatsApp <span className="ml-2 text-xl" role="img" aria-label="whatsapp">📱</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Storefront} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;