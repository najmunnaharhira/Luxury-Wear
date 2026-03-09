import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-border">
      {/* Main Footer */}
      <div className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Brand */}
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-semibold tracking-wider">
                MAISON<span className="font-light">&</span>MAISON
              </h3>
              <p className="mt-4 font-body text-sm text-muted-foreground max-w-md leading-relaxed">
                Timeless elegance crafted in Italy. Where tradition meets contemporary design 
                to create footwear that defines your every step.
              </p>
            </div>

            {/* Newsletter */}
            <div className="lg:text-right">
              <h4 className="font-body text-xs tracking-widest uppercase text-foreground mb-4">
                Subscribe to Our Newsletter
              </h4>
              <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-5 py-3 bg-transparent border border-border font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors w-full sm:w-72"
                />
                <button className="btn-filled whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-b border-border">
            <div>
              <h4 className="font-body text-xs font-medium tracking-widest uppercase mb-6 text-foreground">
                Shop
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">New Arrivals</a></li>
                <li><a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">Boots</a></li>
                <li><a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">Sneakers</a></li>
                <li><a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-body text-xs font-medium tracking-widest uppercase mb-6 text-foreground">
                About
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">Our Story</a></li>
                <li><a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">Craftsmanship</a></li>
                <li><a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">Sustainability</a></li>
                <li><a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-body text-xs font-medium tracking-widest uppercase mb-6 text-foreground">
                Help
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">Shipping</a></li>
                <li><a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">Returns</a></li>
                <li><a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">Size Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-body text-xs font-medium tracking-widest uppercase mb-6 text-foreground">
                Follow Us
              </h4>
              <div className="flex items-center gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram size={20} strokeWidth={1.5} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Facebook size={20} strokeWidth={1.5} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter size={20} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-body text-xs text-muted-foreground">
              © 2026 Maison & Maison. All rights reserved.
            </span>
            <div className="flex items-center gap-6">
              <a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;