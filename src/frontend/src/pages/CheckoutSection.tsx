import { Shield, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function CheckoutSection() {
  const features = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Your payment information is encrypted and protected with industry-leading security.',
    },
    {
      icon: Lock,
      title: 'Privacy Protected',
      description: 'We never share your personal information with third parties.',
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Options',
      description: 'Choose from various payment methods for your convenience.',
    },
  ];

  return (
    <section id="checkout" className="container py-24 md:py-32">
      <div className="max-w-4xl mx-auto">
        <RevealBlock>
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Secure Checkout</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Shop with confidence knowing your information is safe and secure.
            </p>
          </div>
        </RevealBlock>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <RevealBlock key={feature.title} delay={100 + index * 100}>
              <div className="premium-card-hover group text-center p-8 rounded-xl bg-card/50 backdrop-blur border border-border">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary group-hover:text-accent transition-colors duration-300" />
                <h3 className="text-xl font-serif font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </RevealBlock>
          ))}
        </div>

        <RevealBlock delay={400}>
          <div className="text-center">
            <Button
              size="lg"
              className="premium-button-hover bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-pearl hover:shadow-glow-gold transition-all duration-300"
            >
              Continue Shopping
            </Button>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
