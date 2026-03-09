import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Fashion editorial - Woman in camel coat"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-foreground/20" />
      </div>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="hero-text text-background drop-shadow-2xl opacity-0 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            FW 25-26
          </h1>
          <div className="flex items-center justify-center gap-4 md:gap-8 mt-4 opacity-0 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <span className="text-4xl md:text-6xl text-background/80 font-display">/</span>
            <span className="hero-text text-accent drop-shadow-2xl">Sale</span>
          </div>
        </div>
      </div>

      {/* Bottom Sale Banner */}
      <div className="absolute bottom-0 left-0 right-0 announcement-bar opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
        -30% Sale on the Entire FW25-26 Collection
      </div>
    </section>
  );
};

export default Hero;
