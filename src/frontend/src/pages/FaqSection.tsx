import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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

export default function FaqSection() {
  const faqs = [
    {
      question: 'What types of products do you offer?',
      answer:
        'We curate a diverse collection of premium products ranging from artisanal crafts to contemporary designs. Each item is carefully selected for its quality, craftsmanship, and unique story.',
    },
    {
      question: 'How long does shipping take?',
      answer:
        'Standard shipping typically takes 5-7 business days. We also offer expedited shipping options for faster delivery. All orders are carefully packaged to ensure they arrive in perfect condition.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'We offer a 30-day return policy for most items. Products must be in their original condition with all tags attached. Please contact our customer service team to initiate a return.',
    },
    {
      question: 'Are your products authentic?',
      answer:
        'Absolutely. We work directly with verified artisans and suppliers to ensure every product is authentic. Each item comes with our quality guarantee and, where applicable, certificates of authenticity.',
    },
    {
      question: 'How can I contact customer support?',
      answer:
        'Our customer support team is available via email at support@doraasangamhouse.com or through our contact form. We typically respond within 24 hours during business days.',
    },
  ];

  return (
    <section id="faq" className="container py-24 md:py-32">
      <div className="max-w-3xl mx-auto">
        <RevealBlock>
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Find answers to common questions about our products, shipping, and policies.
            </p>
          </div>
        </RevealBlock>

        <RevealBlock delay={100}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border/40 rounded-lg px-6 bg-card/30 backdrop-blur hover:bg-card/50 transition-colors duration-300"
              >
                <AccordionTrigger className="text-left font-serif text-lg hover:text-primary transition-colors duration-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </RevealBlock>
      </div>
    </section>
  );
}
