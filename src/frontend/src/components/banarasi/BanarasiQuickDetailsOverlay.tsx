import { useState } from 'react';
import { DUMMY_PRODUCTS } from '../../data/dummyProducts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Star,
  Share2,
  Ruler,
  Truck,
  CreditCard,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';

interface BanarasiQuickDetailsOverlayProps {
  productId: string;
  isVisible: boolean;
}

export function BanarasiQuickDetailsOverlay({
  productId,
  isVisible,
}: BanarasiQuickDetailsOverlayProps) {
  const product = DUMMY_PRODUCTS.find((p) => p.id === productId);

  if (!product || product.category !== 'banarasi' || !isVisible) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <Card className="absolute inset-x-0 bottom-0 z-10 bg-background/98 backdrop-blur-xl border-t-2 border-primary/30 shadow-luxury animate-in slide-in-from-bottom-4 duration-300">
      <CardContent className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Color Swatches */}
        {product.swatches && product.swatches.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Available Colors</p>
            <div className="flex gap-2 flex-wrap">
              {product.swatches.map((swatch) => (
                <div
                  key={swatch.color}
                  className="group relative"
                  title={swatch.color}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-border hover:border-primary transition-colors cursor-pointer shadow-sm"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-popover px-2 py-1 rounded">
                    {swatch.color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Fabric & Pattern */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Fabric</p>
            <p className="text-base font-serif text-foreground">{product.fabric || 'Pure Banarasi Silk'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Pattern</p>
            <p className="text-base text-foreground">{product.patternDescription || 'Traditional Weave'}</p>
          </div>
        </div>

        <Separator />

        {/* Price & Rating */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-3xl font-serif font-bold text-accent">
              ₹{product.price.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-accent text-accent'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>
        </div>

        <Separator />

        {/* Size Chart Accordion */}
        {product.sizes && product.sizes.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="size-chart" className="border-border/50">
              <AccordionTrigger className="text-sm font-medium hover:text-primary">
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Size Chart
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {product.sizes.map((size, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-2 text-sm p-2 rounded bg-muted/30"
                    >
                      <div>
                        <span className="font-medium">Size:</span> {size.size}
                      </div>
                      <div>
                        <span className="font-medium">Bust:</span> {size.bust}
                      </div>
                      <div>
                        <span className="font-medium">Waist:</span> {size.waist}
                      </div>
                      <div>
                        <span className="font-medium">Length:</span> {size.length}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          {product.codAvailable && (
            <Badge variant="secondary" className="flex items-center gap-1 justify-center py-2 bg-accent/20 text-accent border-accent/30">
              <CreditCard className="h-3 w-3" />
              COD Available
            </Badge>
          )}
          {product.expressDelivery && (
            <Badge variant="secondary" className="flex items-center gap-1 justify-center py-2 bg-primary/20 text-primary border-primary/30">
              <Truck className="h-3 w-3" />
              Express Delivery
            </Badge>
          )}
        </div>

        {/* Blouse Suggestions */}
        {product.blouseSuggestions && product.blouseSuggestions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Pair with Blouse
              </p>
              <div className="grid grid-cols-2 gap-3">
                {product.blouseSuggestions.map((blouse, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <img
                      src={blouse.imageUrl}
                      alt={blouse.name}
                      className="w-12 h-12 rounded object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{blouse.name}</p>
                      <p className="text-sm text-accent font-semibold">₹{blouse.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
