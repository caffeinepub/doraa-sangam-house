import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Ruler, Sparkles } from 'lucide-react';
import { useGetProduct } from '../../hooks/useQueries';

interface BanarasiQuickDetailsOverlayProps {
  productId: string;
  isVisible: boolean;
}

export function BanarasiQuickDetailsOverlay({ productId, isVisible }: BanarasiQuickDetailsOverlayProps) {
  const { data: product } = useGetProduct(productId);

  if (!product || !isVisible) return null;

  const hasColors = product.colors && product.colors.length > 0;
  const fabricDisplay = product.fabric && product.fabric.trim() !== '' ? product.fabric : 'Banarasi Silk';
  const hasBlousePairing = product.blousePairing && product.blousePairing.trim() !== '';

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
      <Card className="bg-background/98 backdrop-blur-xl border-primary/40 rounded-t-none rounded-b-[24px] shadow-2xl pointer-events-auto">
        <CardContent className="p-4 space-y-3">
          {/* Color variants - Show as swatches */}
          {hasColors && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Available Colors</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.slice(0, 5).map((color, idx) => {
                  // Generate color from color name for visual swatch
                  const colorHash = color.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                  const hue = colorHash % 360;
                  
                  return (
                    <div
                      key={idx}
                      className="group/swatch relative"
                      title={color}
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2 border-border/50 hover:border-primary/70 transition-all cursor-pointer shadow-sm"
                        style={{
                          background: `oklch(0.65 0.15 ${hue})`,
                        }}
                      />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap opacity-0 group-hover/swatch:opacity-100 transition-opacity">
                        {color}
                      </span>
                    </div>
                  );
                })}
                {product.colors.length > 5 && (
                  <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">
                    +{product.colors.length - 5}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Fabric - Always show with fallback to "Banarasi Silk" */}
          <Separator className="bg-border/30" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground/90">Fabric:</span>
            <span className="text-sm text-muted-foreground">{fabricDisplay}</span>
          </div>

          {/* Size chart link */}
          <Separator className="bg-border/30" />
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-primary hover:text-primary/80 hover:bg-primary/10 h-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Ruler className="w-4 h-4 mr-2" />
            Size chart
          </Button>

          {/* Blouse pairing */}
          {hasBlousePairing && (
            <>
              <Separator className="bg-border/30" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Blouse Pairing</p>
                <p className="text-sm text-foreground/90 line-clamp-2">{product.blousePairing}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
