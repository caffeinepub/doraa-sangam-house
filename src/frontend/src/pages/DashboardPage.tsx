import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Package, MapPin, LogOut, ArrowRight, Trash2, Edit, Loader2, Calendar, CreditCard, MapPinIcon } from 'lucide-react';
import { useStorefrontAuth } from '../hooks/useStorefrontAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { showProfileSaveSuccessToast, showProfileSaveErrorToast } from '../utils/premiumToasts';
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
        addresses: [],
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
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#F8F5F0' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-playfair font-extrabold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#C9A96E', letterSpacing: '0.15em' }}>
              My Account
            </h1>
            <p className="text-sm mt-2 font-lora" style={{ color: '#5C4B51', lineHeight: '2.0' }}>
              Manage your profile, orders, and preferences
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleContinueShopping}
              variant="outline"
              className="font-montserrat font-bold uppercase"
              style={{ borderColor: '#C9A96E', color: '#C9A96E' }}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="font-montserrat font-bold uppercase"
              style={{ borderColor: '#C9A96E', color: '#C9A96E' }}
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
              backgroundColor: '#FFFFFF',
              borderColor: '#C9A96E',
              borderWidth: '2px',
            }}
          >
            <TabsTrigger
              value="profile"
              className="rounded-xl font-montserrat font-bold uppercase data-[state=active]:shadow-warm-gold-glow transition-all duration-300"
              style={{ color: '#1A1A1A' }}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-xl font-montserrat font-bold uppercase data-[state=active]:shadow-warm-gold-glow transition-all duration-300"
              style={{ color: '#1A1A1A' }}
            >
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="rounded-xl font-montserrat font-bold uppercase data-[state=active]:shadow-warm-gold-glow transition-all duration-300"
              style={{ color: '#1A1A1A' }}
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
              className="border-2"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#C9A96E',
              }}
            >
              <CardHeader>
                <CardTitle className="font-playfair font-extrabold" style={{ color: '#C9A96E', letterSpacing: '0.1em' }}>
                  Profile Information
                </CardTitle>
                <CardDescription className="font-lora" style={{ color: '#5C4B51', lineHeight: '2.0' }}>
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-lora" style={{ color: '#1A1A1A' }}>Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="font-lora"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E', color: '#1A1A1A' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-lora" style={{ color: '#1A1A1A' }}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="font-lora"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E', color: '#1A1A1A' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-lora" style={{ color: '#1A1A1A' }}>Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="font-lora"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E', color: '#1A1A1A' }}
                  />
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="button-luxury font-montserrat font-bold uppercase w-full md:w-auto"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card
              className="border-2"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#C9A96E',
              }}
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="font-playfair font-extrabold" style={{ color: '#C9A96E', letterSpacing: '0.1em' }}>
                      Order History
                    </CardTitle>
                    <CardDescription className="font-lora" style={{ color: '#5C4B51', lineHeight: '2.0' }}>
                      View and track your orders
                    </CardDescription>
                  </div>
                  <Select onValueChange={handleFilterChange} defaultValue="all">
                    <SelectTrigger className="w-[200px] font-lora" style={{ borderColor: '#C9A96E', color: '#1A1A1A' }}>
                      <SelectValue placeholder="Filter by month" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E' }}>
                      {filterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="font-lora" style={{ color: '#1A1A1A' }}>
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
                      <div key={i} className="shimmer-skeleton h-24 rounded-lg" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#C9A96E' }} />
                    <p className="font-lora text-lg" style={{ color: '#5C4B51' }}>No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.orderId}
                        className="p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-warm-gold-glow"
                        style={{ backgroundColor: '#F8F5F0', borderColor: '#C9A96E' }}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-montserrat font-bold" style={{ color: '#1A1A1A' }}>Order #{order.orderId}</p>
                            <p className="text-sm font-lora" style={{ color: '#5C4B51' }}>Status: {order.status}</p>
                          </div>
                          <ArrowRight className="w-5 h-5" style={{ color: '#C9A96E' }} />
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
              className="border-2"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#C9A96E',
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-playfair font-extrabold" style={{ color: '#C9A96E', letterSpacing: '0.1em' }}>
                      Saved Addresses
                    </CardTitle>
                    <CardDescription className="font-lora" style={{ color: '#5C4B51', lineHeight: '2.0' }}>
                      Manage your delivery addresses
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleAddAddress}
                    className="button-luxury font-montserrat font-bold uppercase"
                  >
                    Add Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-4 rounded-lg border-2"
                      style={{ backgroundColor: '#F8F5F0', borderColor: address.isDefault ? '#C9A96E' : '#F5F0E6' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-montserrat font-bold" style={{ color: '#1A1A1A' }}>{address.name}</p>
                          {address.isDefault && (
                            <Badge className="mt-1" style={{ backgroundColor: '#C9A96E', color: '#1A1A1A' }}>
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingAddress(address);
                              setIsAddingAddress(false);
                            }}
                            style={{ color: '#C9A96E' }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteAddress(address.id)}
                            style={{ color: '#C9A96E' }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm font-lora" style={{ color: '#5C4B51', lineHeight: '1.9' }}>
                        {address.line1}
                        {address.line2 && `, ${address.line2}`}
                        <br />
                        {address.city}, {address.state} {address.pincode}
                        <br />
                        {address.phone}
                      </p>
                      {!address.isDefault && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="mt-3 font-montserrat font-bold uppercase"
                          style={{ borderColor: '#C9A96E', color: '#C9A96E' }}
                        >
                          Set as Default
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Address Edit Dialog */}
      <Dialog open={!!editingAddress} onOpenChange={(open) => !open && setEditingAddress(null)}>
        <DialogContent style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E' }}>
          <DialogHeader>
            <DialogTitle className="font-playfair font-extrabold" style={{ color: '#C9A96E' }}>
              {isAddingAddress ? 'Add New Address' : 'Edit Address'}
            </DialogTitle>
            <DialogDescription className="font-lora" style={{ color: '#5C4B51' }}>
              {isAddingAddress ? 'Enter the details for your new address' : 'Update your address details'}
            </DialogDescription>
          </DialogHeader>
          {editingAddress && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addressName" className="font-lora" style={{ color: '#1A1A1A' }}>Address Label</Label>
                <Input
                  id="addressName"
                  value={editingAddress.name}
                  onChange={(e) => setEditingAddress({ ...editingAddress, name: e.target.value })}
                  placeholder="e.g., Home, Office"
                  className="font-lora"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E', color: '#1A1A1A' }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="line1" className="font-lora" style={{ color: '#1A1A1A' }}>Address Line 1</Label>
                <Input
                  id="line1"
                  value={editingAddress.line1}
                  onChange={(e) => setEditingAddress({ ...editingAddress, line1: e.target.value })}
                  className="font-lora"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E', color: '#1A1A1A' }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="line2" className="font-lora" style={{ color: '#1A1A1A' }}>Address Line 2</Label>
                <Input
                  id="line2"
                  value={editingAddress.line2}
                  onChange={(e) => setEditingAddress({ ...editingAddress, line2: e.target.value })}
                  className="font-lora"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E', color: '#1A1A1A' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="font-lora" style={{ color: '#1A1A1A' }}>City</Label>
                  <Input
                    id="city"
                    value={editingAddress.city}
                    onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                    className="font-lora"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E', color: '#1A1A1A' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="font-lora" style={{ color: '#1A1A1A' }}>State</Label>
                  <Input
                    id="state"
                    value={editingAddress.state}
                    onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })}
                    className="font-lora"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E', color: '#1A1A1A' }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="font-lora" style={{ color: '#1A1A1A' }}>Pincode</Label>
                  <Input
                    id="pincode"
                    value={editingAddress.pincode}
                    onChange={(e) => setEditingAddress({ ...editingAddress, pincode: e.target.value })}
                    className="font-lora"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E', color: '#1A1A1A' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressPhone" className="font-lora" style={{ color: '#1A1A1A' }}>Phone</Label>
                  <Input
                    id="addressPhone"
                    value={editingAddress.phone}
                    onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })}
                    className="font-lora"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E', color: '#1A1A1A' }}
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveAddress}
                className="button-luxury font-montserrat font-bold uppercase w-full"
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
