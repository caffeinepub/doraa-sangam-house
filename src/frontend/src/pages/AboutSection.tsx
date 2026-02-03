import { Heart, Users, Award, Sparkles } from 'lucide-react';
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

export default function AboutSection() {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Quality',
      description: 'Every product reflects our unwavering commitment to excellence and craftsmanship.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We build lasting relationships with artisans, suppliers, and customers alike.',
    },
    {
      icon: Award,
      title: 'Heritage & Innovation',
      description: 'Honoring traditional methods while embracing modern design and sustainability.',
    },
    {
      icon: Sparkles,
      title: 'Curated Excellence',
      description: 'Each item is handpicked to ensure it meets our highest standards.',
    },
  ];

  return (
    <section id="about" className="container py-24 md:py-32">
      <div className="max-w-4xl mx-auto">
        <RevealBlock>
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
              About DoRaa Sangam House
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At the confluence of tradition and modernity, we curate exceptional products that tell stories of
              craftsmanship, heritage, and timeless elegance.
            </p>
          </div>
        </RevealBlock>

        <RevealBlock delay={100}>
          <div className="prose prose-lg prose-invert max-w-none mb-16 space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              DoRaa Sangam House was founded on the belief that true luxury lies in the perfect harmony of
              quality, authenticity, and design. The word "Sangam" means confluence—a meeting point where
              different streams come together to create something greater.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our collection represents this philosophy: a carefully curated selection where traditional
              craftsmanship meets contemporary aesthetics, where heritage techniques blend with modern
              innovation, and where each product embodies both beauty and purpose.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We work directly with skilled artisans and trusted suppliers who share our values of quality,
              sustainability, and ethical practices. Every item in our collection is chosen not just for its
              aesthetic appeal, but for the story it tells and the craftsmanship it represents.
            </p>
          </div>
        </RevealBlock>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <RevealBlock key={value.title} delay={200 + index * 100}>
              <div className="premium-card-hover group p-8 rounded-xl bg-card/50 backdrop-blur border border-border">
                <value.icon className="h-10 w-10 mb-4 text-primary group-hover:text-accent transition-colors duration-300" />
                <h3 className="text-xl font-serif font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </section>
  );
}
