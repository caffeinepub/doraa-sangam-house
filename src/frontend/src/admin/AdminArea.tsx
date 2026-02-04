import { AdminProductsProvider } from './state/AdminProductsProvider';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminProductCreatePage from './pages/AdminProductCreatePage';
import AdminProductEditPage from './pages/AdminProductEditPage';
import { ADMIN_ROUTES } from './adminConfig';

interface AdminAreaProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export default function AdminArea({ currentPath, navigate }: AdminAreaProps) {
  const renderPage = () => {
    if (currentPath === ADMIN_ROUTES.PRODUCTS_CREATE) {
      return <AdminProductCreatePage navigate={navigate} />;
    }
    
    if (currentPath.startsWith(ADMIN_ROUTES.PRODUCTS_EDIT)) {
      const productId = currentPath.split('/').pop();
      return <AdminProductEditPage navigate={navigate} productId={productId} />;
    }
    
    if (currentPath === ADMIN_ROUTES.PRODUCTS) {
      return <AdminProductsPage navigate={navigate} />;
    }
    
    return <AdminDashboard />;
  };

  return (
    <AdminProductsProvider>
      <AdminLayout currentPath={currentPath} navigate={navigate}>
        {renderPage()}
      </AdminLayout>
    </AdminProductsProvider>
  );
}
