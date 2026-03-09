import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const shippingSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone number is required").max(20),
  address: z.string().trim().min(1, "Address is required").max(200),
  apartment: z.string().trim().max(100).optional(),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State/Province is required").max(100),
  zipCode: z.string().trim().min(1, "ZIP code is required").max(20),
  country: z.string().trim().min(1, "Country is required").max(100),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("€", ""));
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  const onSubmit = async (data: ShippingFormData) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to place an order.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        size: item.size,
        image: item.image,
        quantity: item.quantity,
      }));

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          items: orderItems,
          shipping_address: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            apartment: data.apartment,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: data.country,
          },
          total: `€${total.toFixed(2)}`,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (error: any) {
      toast({
        title: "Order failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 px-6 md:px-12 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Your cart is empty
          </h1>
          <p className="font-body text-muted-foreground mb-8">
            Add some items to your cart before checking out.
          </p>
          <Button onClick={() => navigate("/shop")} className="btn-filled">
            Continue Shopping
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-10">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Shipping Form */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">
              Shipping Address
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-muted-foreground">First Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-secondary border-border" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-muted-foreground">Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-secondary border-border" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-muted-foreground">Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="bg-secondary border-border" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-muted-foreground">Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} className="bg-secondary border-border" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body text-sm text-muted-foreground">Address</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-secondary border-border" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body text-sm text-muted-foreground">Apartment, suite, etc. (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-secondary border-border" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-muted-foreground">City</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-secondary border-border" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-muted-foreground">State / Province</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-secondary border-border" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-muted-foreground">ZIP Code</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-secondary border-border" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body text-sm text-muted-foreground">Country</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-secondary border-border" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-filled mt-8 h-12 text-base flex items-center justify-center gap-2"
                >
                  <Lock size={16} />
                  {isSubmitting ? "Placing Order..." : `Place Order — €${total.toFixed(2)}`}
                </Button>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-secondary p-6 sticky top-28">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="w-16 aspect-[3/4] bg-muted overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-foreground truncate">
                        {item.name}
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-1">
                        Size: {item.size} · Qty: {item.quantity}
                      </p>
                      <p className="font-body text-sm text-foreground mt-1">
                        {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? "Free" : `€${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-body">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="text-lg font-semibold text-foreground">
                    €{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {subtotal <= 200 && (
                <p className="font-body text-xs text-muted-foreground mt-4">
                  Free shipping on orders over €200
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Checkout;
