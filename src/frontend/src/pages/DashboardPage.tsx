import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Package, MapPin, LogOut, ArrowRight, Trash2, Edit, Loader2, Calendar, CreditCard, MapPinIcon } from 'lucide-react';
import { useStorefrontAuth } from '../hooks/useStorefrontAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { showProfileSaveSuccessToast, showProfileSaveErrorToast } from '../utils/premiumToasts';
import { showBasicErrorToast } from '../utils/errorToasts';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetOrdersByYearMonth } from '../hooks/useQueries';
import type { OrderRecord } from '../backend';
import { useQueryClient } from '@tanstack/react-query';

interface DashboardPageProps {
  navigate: (path: string) => void;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface FilterOption {
  value: string;
  label: string;
}

export default function DashboardPage({ navigate }: DashboardPageProps) {
  const { logout, getReturnPath, clearReturnPath, clearOTPSession } = useStorefrontAuth();
  const { clear: clearII } = useInternetIdentity();
  const { profile, isLoading: profileLoading, isSaving, saveProfile } = useUserProfile();
  const queryClient = useQueryClient();

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Home',
      phone: '+919876543210',
      line1: '123 Main Street',
      line2: 'Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true,
    },
  ]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Orders state
  const [orderFilterYear, setOrderFilterYear] = useState<number | null>(null);
  const [orderFilterMonth, setOrderFilterMonth] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const { data: orders = [], isLoading: ordersLoading } = useGetOrdersByYearMonth(orderFilterYear, orderFilterMonth);

  const returnPath = getReturnPath();

  // Load profile data into form when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleLogout = async () => {
    // Clear all session data
    clearOTPSession();
    clearReturnPath();
    localStorage.removeItem('doraa-flash-message');
    
    // Clear React Query cache
    queryClient.clear();
    
    // Clear Internet Identity
    await clearII();
    
    // Navigate to login
    navigate('/login?tab=signin');
  };

  const handleContinueShopping = () => {
    if (returnPath) {
      clearReturnPath();
      navigate(returnPath);
    } else {
      navigate('/');
    }
  };

  const handleSaveProfile = async () => {
    if (isSaving) return;
    
    try {
      await saveProfile({
        name: fullName,
        email: email,
        phone: phone,
      });
      showProfileSaveSuccessToast();
    } catch (error) {
      console.error('Profile save error:', error);
      showProfileSaveErrorToast();
      showBasicErrorToast('Error: Failed to save profile');
    }
  };

  const handleAddAddress = () => {
    setEditingAddress({
      id: Date.now().toString(),
      name: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    setIsAddingAddress(true);
  };

  const handleSaveAddress = () => {
    if (editingAddress) {
      if (isAddingAddress) {
        setAddresses([...addresses, editingAddress]);
      } else {
        setAddresses(addresses.map((a) => (a.id === editingAddress.id ? editingAddress : a)));
      }
      setEditingAddress(null);
      setIsAddingAddress(false);
    }
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleFilterChange = (value: string) => {
    if (value === 'all') {
      setOrderFilterYear(null);
      setOrderFilterMonth(null);
    } else {
      const [year, month] = value.split('-').map(Number);
      setOrderFilterYear(year);
      setOrderFilterMonth(month);
    }
  };

  const formatOrderDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-500 bg-green-500/10';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'shipped':
        return 'text-blue-500 bg-blue-500/10';
      case 'delivered':
        return 'text-primary bg-primary/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  // Generate year/month filter options (last 12 months)
  const filterOptions: FilterOption[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    filterOptions.push({
      value: `${year}-${month}`,
      label: date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }),
    });
  }

  return (
    <div className="min-h-screen dashboard-scope">
      {/* Dashboard Content */}
      <div className="container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold mb-2 text-pearl-off-white">My Dashboard</h1>
              <p className="text-pearl-off-white/70">Manage your account and orders</p>
            </div>
            <div className="flex items-center gap-3">
              {returnPath && (
                <Button
                  onClick={handleContinueShopping}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 dashboard-interactive-glow min-h-[44px]"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              )}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-gold border-gold hover:bg-gold/10 gold-pulse-glow min-h-[44px]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <Separator className="bg-pearl-blue/20" />

          {/* Dashboard Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-pearl-blue/10 rounded-3xl p-2">
              <TabsTrigger 
                value="profile" 
                className="rounded-2xl data-[state=active]:bg-pearl-blue/30 data-[state=active]:text-pearl-off-white min-h-[44px]"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="rounded-2xl data-[state=active]:bg-pearl-blue/30 data-[state=active]:text-pearl-off-white min-h-[44px]"
              >
                <Package className="mr-2 h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="addresses" 
                className="rounded-2xl data-[state=active]:bg-pearl-blue/30 data-[state=active]:text-pearl-off-white min-h-[44px]"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Addresses
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-card/50 backdrop-blur border-pearl-blue/20 rounded-3xl">
                <CardHeader>
                  <CardTitle className="font-serif text-pearl-off-white">Profile Information</CardTitle>
                  <CardDescription className="text-pearl-off-white/60">Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-pearl-off-white/80">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="Enter your name"
                            className="bg-background/50 border-pearl-blue/30 text-pearl-off-white min-h-[44px]"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={isSaving}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-pearl-off-white/80">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="bg-background/50 border-pearl-blue/30 text-pearl-off-white min-h-[44px]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSaving}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-pearl-off-white/80">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91XXXXXXXXXX"
                            className="bg-background/50 border-pearl-blue/30 text-pearl-off-white min-h-[44px]"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={isSaving}
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={handleSaveProfile} 
                        disabled={isSaving} 
                        className="bg-pearl-blue hover:bg-pearl-blue/90 text-black font-semibold min-h-[44px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card className="bg-card/50 backdrop-blur border-pearl-blue/20 rounded-3xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-serif text-pearl-off-white">Order History</CardTitle>
                      <CardDescription className="text-pearl-off-white/60">View and track your orders</CardDescription>
                    </div>
                    <Select
                      value={orderFilterYear && orderFilterMonth ? `${orderFilterYear}-${orderFilterMonth}` : 'all'}
                      onValueChange={handleFilterChange}
                    >
                      <SelectTrigger className="w-[200px] bg-background/50 border-pearl-blue/30 text-pearl-off-white min-h-[44px]">
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        {filterOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-pearl-off-white/60">
                      <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p>No orders yet</p>
                      <Button
                        onClick={handleContinueShopping}
                        variant="link"
                        className="text-gold hover:text-gold/80 mt-2 min-h-[44px]"
                      >
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card
                          key={order.orderId}
                          className="bg-background/50 border-pearl-blue/30 hover:border-gold/40 transition-all cursor-pointer rounded-2xl"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold font-mono text-sm text-pearl-off-white">{order.orderId}</h4>
                                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-sm text-pearl-off-white/60 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatOrderDate(order.timestamp)}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-pearl-blue/30 text-pearl-off-white hover:bg-pearl-blue/10 min-h-[44px]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder(order);
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                            <Separator className="my-3 bg-pearl-blue/20" />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-pearl-off-white/60">
                                <CreditCard className="h-4 w-4" />
                                <span>Payment ID: {order.paymentId.slice(0, 20)}...</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-6">
              <Card className="bg-card/50 backdrop-blur border-pearl-blue/20 rounded-3xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-serif text-pearl-off-white">Saved Addresses</CardTitle>
                      <CardDescription className="text-pearl-off-white/60">Manage your delivery addresses</CardDescription>
                    </div>
                    <Button
                      onClick={handleAddAddress}
                      className="bg-pearl-blue hover:bg-pearl-blue/90 text-black font-semibold min-h-[44px]"
                    >
                      Add New Address
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <Card key={address.id} className="bg-background/50 border-pearl-blue/30 rounded-2xl">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-pearl-off-white">{address.name}</h4>
                                {address.isDefault && (
                                  <span className="text-xs px-2 py-1 rounded bg-gold/20 text-gold">Default</span>
                                )}
                              </div>
                              <p className="text-sm text-pearl-off-white/70">
                                {address.line1}
                                {address.line2 && `, ${address.line2}`}
                              </p>
                              <p className="text-sm text-pearl-off-white/70">
                                {address.city}, {address.state} {address.pincode}
                              </p>
                              <p className="text-sm text-pearl-off-white/70">{address.phone}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-pearl-blue/30 text-pearl-off-white hover:bg-pearl-blue/10 min-h-[44px]"
                                onClick={() => {
                                  setEditingAddress(address);
                                  setIsAddingAddress(false);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/30 text-red-500 hover:bg-red-500/10 min-h-[44px]"
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-black/95 border-pearl-blue/30 text-pearl-off-white">
          <DialogHeader>
            <DialogTitle className="font-serif">Order Details</DialogTitle>
            <DialogDescription className="text-pearl-off-white/60">
              Order ID: {selectedOrder?.orderId}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-pearl-off-white">Shipping Address</h4>
                <p className="text-sm text-pearl-off-white/70">{selectedOrder.shippingAddress.name}</p>
                <p className="text-sm text-pearl-off-white/70">{selectedOrder.shippingAddress.street}</p>
                <p className="text-sm text-pearl-off-white/70">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                  {selectedOrder.shippingAddress.postalCode}
                </p>
                <p className="text-sm text-pearl-off-white/70">{selectedOrder.shippingAddress.phone}</p>
              </div>
              <Separator className="bg-pearl-blue/20" />
              <div>
                <h4 className="font-semibold mb-2 text-pearl-off-white">Payment Information</h4>
                <p className="text-sm text-pearl-off-white/70">Payment ID: {selectedOrder.paymentId}</p>
                <p className="text-sm text-pearl-off-white/70">Status: {selectedOrder.status}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Address Edit Dialog */}
      <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
        <DialogContent className="bg-black/95 border-pearl-blue/30 text-pearl-off-white">
          <DialogHeader>
            <DialogTitle className="font-serif">{isAddingAddress ? 'Add New Address' : 'Edit Address'}</DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-pearl-off-white/80">Address Name</Label>
                <Input
                  value={editingAddress.name}
                  onChange={(e) => setEditingAddress({ ...editingAddress, name: e.target.value })}
                  placeholder="e.g., Home, Office"
                  className="bg-background/50 border-pearl-blue/30 text-pearl-off-white min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-pearl-off-white/80">Phone</Label>
                <Input
                  value={editingAddress.phone}
                  onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })}
                  placeholder="+91XXXXXXXXXX"
                  className="bg-background/50 border-pearl-blue/30 text-pearl-off-white min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-pearl-off-white/80">Address Line 1</Label>
                <Input
                  value={editingAddress.line1}
                  onChange={(e) => setEditingAddress({ ...editingAddress, line1: e.target.value })}
                  placeholder="Street address"
                  className="bg-background/50 border-pearl-blue/30 text-pearl-off-white min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-pearl-off-white/80">Address Line 2</Label>
                <Input
                  value={editingAddress.line2}
                  onChange={(e) => setEditingAddress({ ...editingAddress, line2: e.target.value })}
                  placeholder="Apartment, suite, etc."
                  className="bg-background/50 border-pearl-blue/30 text-pearl-off-white min-h-[44px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-pearl-off-white/80">City</Label>
                  <Input
                    value={editingAddress.city}
                    onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                    className="bg-background/50 border-pearl-blue/30 text-pearl-off-white min-h-[44px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-pearl-off-white/80">State</Label>
                  <Input
                    value={editingAddress.state}
                    onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })}
                    className="bg-background/50 border-pearl-blue/30 text-pearl-off-white min-h-[44px]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-pearl-off-white/80">Pincode</Label>
                <Input
                  value={editingAddress.pincode}
                  onChange={(e) => setEditingAddress({ ...editingAddress, pincode: e.target.value })}
                  className="bg-background/50 border-pearl-blue/30 text-pearl-off-white min-h-[44px]"
                />
              </div>
              <Button 
                onClick={handleSaveAddress} 
                className="w-full bg-pearl-blue hover:bg-pearl-blue/90 text-black font-semibold min-h-[44px]"
              >
                Save Address
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
