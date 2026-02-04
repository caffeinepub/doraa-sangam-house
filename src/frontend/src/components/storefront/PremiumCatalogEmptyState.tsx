import { Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PremiumCatalogEmptyStateProps {
  onAction?: () => void;
  actionLabel?: string;
}

export default function PremiumCatalogEmptyState({
  onAction,
  actionLabel = 'Explore Collections',
}: PremiumCatalogEmptyStateProps) {
  return (
    <div className="container py-24 md:py-32">
      <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur border-border/40">
        <CardContent className="pt-16 pb-16 text-center">
          <div className="relative inline-block mb-8">
            <Package className="h-24 w-24 text-muted-foreground/30 mx-auto" />
            <Sparkles className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-pulse" />
          </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
