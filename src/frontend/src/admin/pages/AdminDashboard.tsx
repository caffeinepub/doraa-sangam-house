import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FolderOpen, Upload, Clock } from 'lucide-react';
import { useAdminProducts } from '../state/AdminProductsProvider';

export default function AdminDashboard() {
  const { products } = useAdminProducts();

  const metrics = [
    {
      title: 'Products',
      value: products.length,
      description: 'Total products in catalog',
      icon: Package,
      color: 'text-primary',
    },
    {
      title: 'Categories',
      value: 7,
      description: 'Banarasi collections',
      icon: FolderOpen,
      color: 'text-accent',
    },
    {
      title: 'Draft Uploads',
      value: 0,
      description: 'Pending image uploads',
      icon: Upload,
      color: 'text-muted-foreground',
    },
    {
      title: 'Pending Reviews',
      value: 0,
      description: 'Products awaiting review',
      icon: Clock,
      color: 'text-muted-foreground',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your admin panel (placeholder data)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card
              key={metric.title}
              className="bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardHeader>
          <CardTitle>Welcome to Admin Panel</CardTitle>
          <CardDescription>
            This is a placeholder dashboard. Navigate to Products to manage your catalog.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• All data is stored in frontend state only (session-lifetime)</p>
          <p>• No backend persistence is implemented yet</p>
          <p>• Product CRUD operations work with in-memory state</p>
        </CardContent>
      </Card>
    </div>
  );
}
