import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const About = () => {
  const { ref: heroRef, isInView: heroInView } = useScrollReveal();
  const { ref: storyRef, isInView: storyInView } = useScrollReveal();
  const { ref: valuesRef, isInView: valuesInView } = useScrollReveal();
  const { ref: contactRef, isInView: contactInView } = useScrollReveal();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const values = [
    {
      title: "Craftsmanship",
      description: "Every piece is meticulously crafted by skilled artisans using traditional techniques passed down through generations.",
    },
    {
      title: "Sustainability",
      description: "We source only the finest sustainable materials and partner with ethical manufacturers committed to fair practices.",
    },
    {
      title: "Timeless Design",
      description: "Our designs transcend trends, creating pieces that remain elegant and relevant for years to come.",
    },
    {
      title: "Quality",
      description: "We never compromise on quality. Each product undergoes rigorous testing to ensure it meets our exacting standards.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section ref={heroRef} className="px-6 md:px-12 max-w-7xl mx-auto py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
              Our Story
            </span>
            <h1 className="mt-4 font-display text-5xl md:text-7xl font-semibold text-foreground">
              About Us
            </h1>
            <p className="mt-6 font-body text-lg text-muted-foreground leading-relaxed">
              Where timeless elegance meets modern sophistication
            </p>
          </motion.div>
        </section>

        {/* Brand Story */}
        <section ref={storyRef} className="px-6 md:px-12 max-w-7xl mx-auto py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-[4/5] bg-muted overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                  alt="Fashion atelier"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                Est. 2020
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
                A Legacy of Elegance
              </h2>
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                <p>
                  MAISON&MAISON was born from a passion for exceptional footwear and a vision to create 
                  shoes that embody both timeless elegance and contemporary design. Founded in the heart 
                  of Milan, our brand draws inspiration from Italian craftsmanship traditions while 
                  embracing modern innovation.
                </p>
                <p>
                  Our journey began in a small atelier where skilled artisans crafted each pair with 
                  meticulous attention to detail. Today, we continue that legacy, working with the 
                  finest materials sourced from Italy's most renowned tanneries.
                </p>
                <p>
                  Every shoe tells a story—of dedication, artistry, and the pursuit of perfection. 
                  We believe that true luxury lies in the details: the suppleness of premium leather, 
                  the precision of each stitch, and the comfort that comes from exceptional construction.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section ref={valuesRef} className="bg-muted/20 py-20">
          <div className="px-6 md:px-12 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                What We Stand For
              </span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-foreground">
                Our Values
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    {value.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} className="px-6 md:px-12 max-w-7xl mx-auto py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={contactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
              Get In Touch
            </span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-foreground">
              Contact Us
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={contactInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-foreground mt-1" />
                <div>
                  <h4 className="font-display text-lg font-semibold text-foreground">Visit Us</h4>
                  <p className="font-body text-muted-foreground">
                    Via Monte Napoleone 12<br />
                    20121 Milano, Italy
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-foreground mt-1" />
                <div>
                  <h4 className="font-display text-lg font-semibold text-foreground">Email Us</h4>
                  <p className="font-body text-muted-foreground">
                    hello@maisonandmaison.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-foreground mt-1" />
                <div>
                  <h4 className="font-display text-lg font-semibold text-foreground">Call Us</h4>
                  <p className="font-body text-muted-foreground">
                    +39 02 1234 5678
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-border">
                <h4 className="font-display text-lg font-semibold text-foreground mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  <a href="#" className="p-3 border border-border hover:bg-foreground hover:text-background transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-3 border border-border hover:bg-foreground hover:text-background transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-3 border border-border hover:bg-foreground hover:text-background transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              animate={contactInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                    Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-transparent border-border focus:border-foreground"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-transparent border-border focus:border-foreground"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                  Subject
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="bg-transparent border-border focus:border-foreground"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                  Message
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="bg-transparent border-border focus:border-foreground min-h-[150px]"
                  placeholder="Your message..."
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-foreground text-background hover:bg-foreground/90 font-body text-xs tracking-widest uppercase py-6"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </motion.form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
