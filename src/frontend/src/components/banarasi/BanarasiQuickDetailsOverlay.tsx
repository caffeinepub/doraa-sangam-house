import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Ruler, Sparkles } from 'lucide-react';
import { useGetProduct } from '../../hooks/useQueries';
import { useSpaLocation } from '../../hooks/useSpaLocation';

interface BanarasiQuickDetailsOverlayProps {
  productId: string;
  isVisible: boolean;
}

export function BanarasiQuickDetailsOverlay({ productId, isVisible }: BanarasiQuickDetailsOverlayProps) {
  const { data: product } = useGetProduct(productId);
  const [location, navigate] = useSpaLocation();

  if (!product || !isVisible) return null;

  // Dummy placeholder values as per Phase 2 spec
  const dummyColors = ['Red', 'Blue', 'Green'];
  const dummyFabric = 'Banarasi Silk';
  const dummyBlousePairing = 'Matching silk blouse included';

  const handleSizeChartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/size-chart');
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
      <Card className="bg-background/98 backdrop-blur-xl border-primary/40 rounded-t-none rounded-b-[28px] shadow-2xl pointer-events-auto">
        <CardContent className="p-4 space-y-3">
          {/* Color variants - Dummy placeholder swatches */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Available Colors</p>
            <div className="flex flex-wrap gap-2">
              {dummyColors.map((color, idx) => {
                // Generate visual color from name
                const colorMap: Record<string, string> = {
                  Red: 'oklch(0.55 0.22 25)',
                  Blue: 'oklch(0.55 0.18 250)',
                  Green: 'oklch(0.55 0.18 145)',
                };
                
                return (
                  <div
                    key={idx}
                    className="group/swatch relative"
                    title={color}
                  >
                    <div
                      className="w-8 h-8 rounded-full border-2 border-border/50 hover:border-primary/70 transition-all cursor-pointer shadow-sm"
                      style={{
                        background: colorMap[color] || 'oklch(0.65 0.15 180)',
                      }}
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap opacity-0 group-hover/swatch:opacity-100 transition-opacity">
                      {color}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fabric - Dummy placeholder */}
          <Separator className="bg-border/30" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground/90">Fabric:</span>
            <span className="text-sm text-muted-foreground">{dummyFabric}</span>
          </div>

          {/* Size chart link - Navigate to dummy page */}
          <Separator className="bg-border/30" />
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-primary hover:text-primary/80 hover:bg-primary/10 h-8"
            onClick={handleSizeChartClick}
          >
            <Ruler className="w-4 h-4 mr-2" />
            Size chart
          </Button>

          {/* Blouse pairing - Dummy placeholder */}
          <Separator className="bg-border/30" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">Blouse Pairing</p>
            <p className="text-sm text-foreground/90 line-clamp-2">{dummyBlousePairing}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
