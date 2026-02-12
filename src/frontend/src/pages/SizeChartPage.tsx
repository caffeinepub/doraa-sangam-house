import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Ruler } from 'lucide-react';
import { useSpaLocation } from '../hooks/useSpaLocation';

export default function SizeChartPage() {
  const [location, navigate] = useSpaLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  return (
    <section className="min-h-screen py-16 px-4 md:px-8">
      <div className="container max-w-4xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 text-primary hover:text-primary/80 hover:bg-primary/10"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Size Chart Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-primary/30 shadow-xl">
          <CardHeader className="border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Ruler className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-3xl font-serif text-foreground">Size Chart</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <p className="text-muted-foreground text-lg">
              This is a placeholder size chart page. Detailed sizing information will be added soon.
            </p>

            <div className="bg-muted/20 rounded-lg p-6 border border-border/30">
              <h3 className="text-xl font-semibold text-foreground mb-4">Standard Saree Dimensions</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Length: 5.5 to 6 meters</li>
                <li>• Width: 1.1 to 1.2 meters</li>
                <li>• Blouse piece: 0.8 meters (included)</li>
              </ul>
            </div>

            <div className="bg-muted/20 rounded-lg p-6 border border-border/30">
              <h3 className="text-xl font-semibold text-foreground mb-4">Blouse Sizing Guide</h3>
              <p className="text-muted-foreground">
                Our blouse pieces can be tailored to your measurements. Please consult with your tailor for the perfect fit.
              </p>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleBack}
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
