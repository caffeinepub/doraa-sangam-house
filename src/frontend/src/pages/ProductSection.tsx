import { Award, Shield, Truck, Package } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

function RevealBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { elementRef, isRevealed } = useScrollReveal({
    threshold: 0.2,
    rootMargin: '0px 0px -80px 0px',
  });

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal-enhanced ${isRevealed ? 'scroll-reveal-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function ProductSection() {
  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Every product meets our rigorous standards for excellence and craftsmanship.',
    },
    {
      icon: Shield,
      title: 'Authenticity Guaranteed',
      description: 'We verify the authenticity of every item in our collection.',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to ensure your items arrive promptly.',
    },
    {
      icon: Package,
      title: 'Luxury Packaging',
      description: 'Each order is beautifully packaged to create an unforgettable unboxing experience.',
    },
  ];

  return (
    <section id="product" className="container py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        <RevealBlock>
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Our Promise to You</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              We're committed to delivering exceptional quality and service with every purchase.
            </p>
          </div>
        </RevealBlock>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <RevealBlock key={feature.title} delay={100 + index * 100}>
              <div className="premium-card-hover group text-center p-8 rounded-xl bg-card/50 backdrop-blur border border-border">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary group-hover:text-accent transition-colors duration-300" />
                <h3 className="text-xl font-serif font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </section>
  );
}
