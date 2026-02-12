import { Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PremiumCatalogEmptyStateProps {
  onAction?: () => void;
  actionLabel?: string;
  showAdminCta?: boolean;
  onAdminAction?: () => void;
}

export default function PremiumCatalogEmptyState({
  onAction,
  actionLabel = 'Explore Collections',
  showAdminCta = false,
  onAdminAction,
}: PremiumCatalogEmptyStateProps) {
  return (
    <div className="container py-24 md:py-32">
      <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur border-border/40">
        <CardContent className="pt-16 pb-16 text-center">
          <div className="relative inline-block mb-8">
            <Package className="h-24 w-24 text-muted-foreground/30 mx-auto" />
            <Sparkles className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-pulse" />
          </div>
          
          {showAdminCta ? (
            <>
              <h3 className="text-3xl font-serif font-bold mb-4" style={{ color: '#D4AF37' }}>
                No products yet — add in admin panel
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Start building your catalog by adding products through the admin panel.
              </p>
              {onAdminAction && (
                <Button
                  onClick={onAdminAction}
                  size="lg"
                  className="bg-[#7FB3D5] text-white hover:bg-[#6A9BC0] transition-all duration-300 hover:shadow-[0_0_20px_rgba(127,179,213,0.5)] hover:scale-105"
                >
                  Go to Admin Panel
                </Button>
              )}
            </>
          ) : (
            <>
              <h3 className="text-3xl font-serif font-bold mb-4">Our Collection Awaits</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                We're curating an exquisite selection of premium pieces just for you. Check back soon to discover timeless
                elegance.
              </p>
              {onAction && (
                <Button
                  onClick={onAction}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gold-pulse-glow premium-button-hover"
                >
                  {actionLabel}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
