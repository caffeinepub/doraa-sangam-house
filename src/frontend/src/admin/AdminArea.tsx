import { AdminProductsProvider } from './state/AdminProductsProvider';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductsPage from './pages/AdminProductsPage';
import { ADMIN_ROUTES } from './adminConfig';

interface AdminAreaProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export default function AdminArea({ currentPath, navigate }: AdminAreaProps) {
  const renderPage = () => {
    if (currentPath === ADMIN_ROUTES.PRODUCTS) {
      return <AdminProductsPage />;
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
