import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PremiumCatalogErrorStateProps {
  onRetry?: () => void;
}

export default function PremiumCatalogErrorState({ onRetry }: PremiumCatalogErrorStateProps) {
  return (
    <div className="container py-24 md:py-32">
      <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur border-destructive/40">
        <CardContent className="pt-16 pb-16 text-center">
          <div className="relative inline-block mb-8">
            <AlertCircle className="h-24 w-24 text-destructive/70 mx-auto" />
          </div>
          <h3 className="text-3xl font-serif font-bold mb-4 text-foreground">
            Unable to Load Products
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            We're having trouble connecting to our catalog. Please check your connection and try again.
          </p>
          {onRetry && (
            <Button
              onClick={onRetry}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:scale-105"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
