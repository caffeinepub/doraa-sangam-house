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
import ThemeSwitcher from '../components/ThemeSwitcher';

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
        addresses: [], // Include empty addresses array to match UserProfile type
      });
      showProfileSaveSuccessToast();
    } catch (error) {
      console.error('Failed to save profile:', error);
      showProfileSaveErrorToast();
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
    if (!editingAddress) return;

    if (isAddingAddress) {
      setAddresses([...addresses, editingAddress]);
    } else {
      setAddresses(addresses.map((addr) => (addr.id === editingAddress.id ? editingAddress : addr)));
    }

    setEditingAddress(null);
    setIsAddingAddress(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'All Orders' },
    { value: '2024-01', label: 'January 2024' },
    { value: '2024-02', label: 'February 2024' },
    { value: '2024-03', label: 'March 2024' },
  ];

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

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--heading-color)' }}>
              My Account
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--muted-text)' }}>
              Manage your profile, orders, and preferences
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleContinueShopping}
              variant="outline"
              className="font-button font-bold uppercase"
              style={{ borderColor: 'var(--gold-border)', color: 'var(--gold-accent)' }}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="font-button font-bold uppercase"
              style={{ borderColor: 'var(--gold-border)', color: 'var(--gold-accent)' }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList
            className="grid w-full grid-cols-3 mb-8 p-1 rounded-2xl"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--gold-border)',
              borderWidth: '2px',
            }}
          >
            <TabsTrigger
              value="profile"
              className="rounded-xl font-button font-bold uppercase data-[state=active]:shadow-gold-glow transition-all duration-300"
              style={{
                color: 'var(--text-color)',
              }}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-xl font-button font-bold uppercase data-[state=active]:shadow-gold-glow transition-all duration-300"
              style={{
                color: 'var(--text-color)',
              }}
            >
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="rounded-xl font-button font-bold uppercase data-[state=active]:shadow-gold-glow transition-all duration-300"
              style={{
                color: 'var(--text-color)',
              }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Addresses
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Profile Information */}
            <Card
              className="border-2 backdrop-blur-sm"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--gold-border)',
              }}
            >
              <CardHeader>
                <CardTitle className="text-xl font-serif" style={{ color: 'var(--heading-color)' }}>
                  Profile Information
                </CardTitle>
                <CardDescription style={{ color: 'var(--muted-text)' }}>
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileLoading ? (
                  <div className="space-y-4">
                    <div className="shimmer-skeleton h-10 rounded" />
                    <div className="shimmer-skeleton h-10 rounded" />
                    <div className="shimmer-skeleton h-10 rounded" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName" style={{ color: 'var(--text-color)' }}>
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="border-2"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--input-border)',
                          color: 'var(--text-color)',
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" style={{ color: 'var(--text-color)' }}>
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="border-2"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--input-border)',
                          color: 'var(--text-color)',
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" style={{ color: 'var(--text-color)' }}>
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="border-2"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--input-border)',
                          color: 'var(--text-color)',
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="w-full font-button font-bold uppercase button-luxury mt-4"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Profile'
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card
              className="border-2 backdrop-blur-sm"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--gold-border)',
              }}
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-serif" style={{ color: 'var(--heading-color)' }}>
                      Order History
                    </CardTitle>
                    <CardDescription style={{ color: 'var(--muted-text)' }}>
                      View and track your orders
                    </CardDescription>
                  </div>
                  <Select onValueChange={handleFilterChange} defaultValue="all">
                    <SelectTrigger
                      className="w-[200px] border-2"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--text-color)',
                      }}
                    >
                      <SelectValue placeholder="Filter by month" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="shimmer-skeleton h-24 rounded" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-text)' }} />
                    <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                      No orders yet
                    </p>
                    <p className="text-sm mb-6" style={{ color: 'var(--muted-text)' }}>
                      Start shopping to see your orders here
                    </p>
                    <Button onClick={handleContinueShopping} className="button-luxury">
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.orderId}
                        className="p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-gold-glow"
                        style={{
                          backgroundColor: 'var(--option-bg)',
                          borderColor: 'var(--input-border)',
                        }}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" style={{ color: 'var(--gold-accent)' }} />
                              <span className="font-semibold" style={{ color: 'var(--text-color)' }}>
                                {order.orderId}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-text)' }}>
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(Number(order.timestamp)).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-text)' }}>
                              <MapPinIcon className="w-4 h-4" />
                              <span>
                                {order.shippingAddress.city}, {order.shippingAddress.state}
                              </span>
                            </div>
                          </div>
                          <div
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: 'var(--gold-accent)',
                              color: 'var(--card-bg)',
                            }}
                          >
                            {order.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card
              className="border-2 backdrop-blur-sm"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--gold-border)',
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-serif" style={{ color: 'var(--heading-color)' }}>
                      Saved Addresses
                    </CardTitle>
                    <CardDescription style={{ color: 'var(--muted-text)' }}>
                      Manage your delivery addresses
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddAddress} className="button-luxury">
                    Add Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-text)' }} />
                    <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                      No addresses saved
                    </p>
                    <p className="text-sm mb-6" style={{ color: 'var(--muted-text)' }}>
                      Add an address for faster checkout
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="p-4 rounded-xl border-2 relative"
                        style={{
                          backgroundColor: 'var(--option-bg)',
                          borderColor: address.isDefault ? 'var(--gold-accent)' : 'var(--input-border)',
                        }}
                      >
                        {address.isDefault && (
                          <div
                            className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: 'var(--gold-accent)',
                              color: 'var(--card-bg)',
                            }}
                          >
                            Default
                          </div>
                        )}
                        <div className="space-y-2 mb-4">
                          <p className="font-semibold" style={{ color: 'var(--text-color)' }}>
                            {address.name}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--muted-text)' }}>
                            {address.line1}
                          </p>
                          {address.line2 && (
                            <p className="text-sm" style={{ color: 'var(--muted-text)' }}>
                              {address.line2}
                            </p>
                          )}
                          <p className="text-sm" style={{ color: 'var(--muted-text)' }}>
                            {address.city}, {address.state} {address.pincode}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--muted-text)' }}>
                            {address.phone}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingAddress(address);
                              setIsAddingAddress(false);
                            }}
                            style={{ borderColor: 'var(--gold-border)', color: 'var(--gold-accent)' }}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          {!address.isDefault && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSetDefaultAddress(address.id)}
                                style={{ borderColor: 'var(--gold-border)', color: 'var(--gold-accent)' }}
                              >
                                Set Default
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteAddress(address.id)}
                                style={{ borderColor: 'var(--gold-border)', color: 'var(--gold-accent)' }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent
          className="max-w-2xl"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--gold-border)',
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--heading-color)' }}>Order Details</DialogTitle>
            <DialogDescription style={{ color: 'var(--muted-text)' }}>
              {selectedOrder?.orderId}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                  Shipping Address
                </h4>
                <p className="text-sm" style={{ color: 'var(--muted-text)' }}>
                  {selectedOrder.shippingAddress.name}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted-text)' }}>
                  {selectedOrder.shippingAddress.street}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted-text)' }}>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                  {selectedOrder.shippingAddress.postalCode}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted-text)' }}>
                  {selectedOrder.shippingAddress.phone}
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                  Payment Information
                </h4>
                <p className="text-sm" style={{ color: 'var(--muted-text)' }}>
                  Payment ID: {selectedOrder.paymentId}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted-text)' }}>
                  Status: {selectedOrder.status}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Address Edit Dialog */}
      <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
        <DialogContent
          className="max-w-2xl"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--gold-border)',
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--heading-color)' }}>
              {isAddingAddress ? 'Add New Address' : 'Edit Address'}
            </DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addressName" style={{ color: 'var(--text-color)' }}>
                  Address Name
                </Label>
                <Input
                  id="addressName"
                  value={editingAddress.name}
                  onChange={(e) => setEditingAddress({ ...editingAddress, name: e.target.value })}
                  placeholder="e.g., Home, Office"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--text-color)',
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine1" style={{ color: 'var(--text-color)' }}>
                  Address Line 1
                </Label>
                <Input
                  id="addressLine1"
                  value={editingAddress.line1}
                  onChange={(e) => setEditingAddress({ ...editingAddress, line1: e.target.value })}
                  placeholder="Street address"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--text-color)',
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine2" style={{ color: 'var(--text-color)' }}>
                  Address Line 2
                </Label>
                <Input
                  id="addressLine2"
                  value={editingAddress.line2}
                  onChange={(e) => setEditingAddress({ ...editingAddress, line2: e.target.value })}
                  placeholder="Apartment, suite, etc. (optional)"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--text-color)',
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" style={{ color: 'var(--text-color)' }}>
                    City
                  </Label>
                  <Input
                    id="city"
                    value={editingAddress.city}
                    onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                    placeholder="City"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--text-color)',
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" style={{ color: 'var(--text-color)' }}>
                    State
                  </Label>
                  <Input
                    id="state"
                    value={editingAddress.state}
                    onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })}
                    placeholder="State"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--text-color)',
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode" style={{ color: 'var(--text-color)' }}>
                    Pincode
                  </Label>
                  <Input
                    id="pincode"
                    value={editingAddress.pincode}
                    onChange={(e) => setEditingAddress({ ...editingAddress, pincode: e.target.value })}
                    placeholder="Pincode"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--text-color)',
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressPhone" style={{ color: 'var(--text-color)' }}>
                    Phone
                  </Label>
                  <Input
                    id="addressPhone"
                    value={editingAddress.phone}
                    onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })}
                    placeholder="Phone number"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--text-color)',
                    }}
                  />
                </div>
              </div>
              <Button onClick={handleSaveAddress} className="w-full button-luxury">
                Save Address
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
