import { Heart } from 'lucide-react';
import { BRAND_NAME } from '../assets/branding';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '#home', label: 'Home' },
    { href: '#collections', label: 'Collections' },
    { href: '#product', label: 'Product' },
    { href: '#checkout', label: 'Checkout' },
    { href: '#faq', label: 'FAQ' },
    { href: '#about', label: 'About' },
  ];

  return (
    <footer className="border-t border-border/40 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold">{BRAND_NAME}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Where tradition meets modernity at the confluence of quality and craftsmanship. 
              Discover our curated collection of premium products.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold">Connect</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Experience the confluence of tradition and innovation. Join us on a journey 
              of discovery and excellence.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 text-center">
          <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            © {currentYear}. Built with <Heart className="h-4 w-4 text-accent fill-accent" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-accent transition-colors duration-300"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
