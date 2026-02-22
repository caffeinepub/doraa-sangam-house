import { Heart } from 'lucide-react';
import { BRAND_NAME } from '../assets/branding';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? encodeURIComponent(window.location.hostname) : 'unknown-app';

  const quickLinks = [
    { href: '#home', label: 'Home' },
    { href: '#collections', label: 'Collections' },
    { href: '#product', label: 'Product' },
    { href: '#checkout', label: 'Checkout' },
    { href: '#faq', label: 'FAQ' },
    { href: '#about', label: 'About' },
  ];

  return (
    <footer 
      className="border-t backdrop-blur-xl"
      style={{
        backgroundColor: '#F8F5F0',
        borderColor: 'rgba(201, 169, 110, 0.3)',
      }}
    >
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="font-playfair font-extrabold text-xl" style={{ color: '#C9A96E', letterSpacing: '0.1em' }}>
              {BRAND_NAME}
            </h3>
            <p className="text-sm font-lora leading-relaxed" style={{ color: '#5C4B51', lineHeight: '2.0' }}>
              Where tradition meets modernity at the confluence of quality and craftsmanship. 
              Discover our curated collection of premium products.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-playfair font-extrabold text-xl" style={{ color: '#C9A96E', letterSpacing: '0.1em' }}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="text-sm font-lora transition-colors duration-300 inline-block hover:text-[#C9A96E]"
                    style={{ color: '#5C4B51' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-playfair font-extrabold text-xl" style={{ color: '#C9A96E', letterSpacing: '0.1em' }}>
              Connect
            </h3>
            <p className="text-sm font-lora leading-relaxed" style={{ color: '#5C4B51', lineHeight: '2.0' }}>
              Experience the confluence of tradition and innovation. Join us on a journey 
              of discovery and excellence.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t text-center" style={{ borderColor: 'rgba(201, 169, 110, 0.3)' }}>
          <p className="flex items-center justify-center gap-1.5 text-sm font-lora" style={{ color: '#5C4B51' }}>
            © {currentYear}. Built with <Heart className="h-4 w-4 fill-current" style={{ color: '#C9A96E' }} /> using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium transition-colors duration-300"
              style={{ color: '#C9A96E' }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
