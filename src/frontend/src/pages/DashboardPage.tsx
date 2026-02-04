import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { User, Package, MapPin, LogOut, ArrowRight, Trash2, Edit } from 'lucide-react';
import { useStorefrontAuth } from '../hooks/useStorefrontAuth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

export default function DashboardPage({ navigate }: DashboardPageProps) {
  const { logout, getReturnPath, clearReturnPath } = useStorefrontAuth();
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
  const [orderFilter, setOrderFilter] = useState('all');

  const returnPath = getReturnPath();

  const handleLogout = async () => {
    await logout(async () => {});
    navigate('/login');
  };

  const handleContinueShopping = () => {
    if (returnPath) {
      clearReturnPath();
      navigate(returnPath);
    } else {
      navigate('/');
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

  return (
    <div className="container py-12 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your account and orders</p>
          </div>
          <div className="flex items-center gap-3">
            {returnPath && (
              <Button
                onClick={handleContinueShopping}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gold-pulse-glow"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-primary border-primary hover:bg-primary/10 gold-pulse-glow"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Separator />

        {/* Dashboard Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/20">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Package className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="addresses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              Addresses
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-border/40">
              <CardHeader>
                <CardTitle className="font-serif">Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your name" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="+91XXXXXXXXXX" className="bg-background/50" />
                  </div>
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gold-pulse-glow">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-serif">Order History</CardTitle>
                    <CardDescription>View and track your orders</CardDescription>
                  </div>
                  <Select value={orderFilter} onValueChange={setOrderFilter}>
                    <SelectTrigger className="w-[180px] bg-background/50">
                      <SelectValue placeholder="Filter orders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>No orders yet</p>
                  <Button
                    onClick={handleContinueShopping}
                    variant="link"
                    className="text-primary hover:text-accent mt-2"
                  >
                    Start Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-serif">Saved Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses</CardDescription>
                  </div>
                  <Button
                    onClick={handleAddAddress}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gold-pulse-glow"
                  >
                    Add New Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.map((address) => (
                  <Card key={address.id} className="bg-background/50 border-border/60">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{address.name}</h4>
                            {address.isDefault && (
                              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Default</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{address.phone}</p>
                          <p className="text-sm text-muted-foreground">
                            {address.line1}, {address.line2}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingAddress(address);
                              setIsAddingAddress(false);
                            }}
                            className="hover:bg-primary/10 hover:text-primary gold-pulse-glow"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="hover:bg-destructive/10 hover:text-destructive gold-pulse-glow"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Address Edit/Add Dialog */}
      <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-border/40">
          <DialogHeader>
            <DialogTitle className="font-serif">{isAddingAddress ? 'Add New Address' : 'Edit Address'}</DialogTitle>
            <DialogDescription>Fill in the address details below</DialogDescription>
          </DialogHeader>
          {editingAddress && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="addr-name">Address Name</Label>
                  <Input
                    id="addr-name"
                    value={editingAddress.name}
                    onChange={(e) => setEditingAddress({ ...editingAddress, name: e.target.value })}
                    placeholder="Home, Office, etc."
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addr-phone">Phone</Label>
                  <Input
                    id="addr-phone"
                    value={editingAddress.phone}
                    onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })}
                    placeholder="+91XXXXXXXXXX"
                    className="bg-background/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-line1">Address Line 1</Label>
                <Input
                  id="addr-line1"
                  value={editingAddress.line1}
                  onChange={(e) => setEditingAddress({ ...editingAddress, line1: e.target.value })}
                  placeholder="Street address"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-line2">Address Line 2</Label>
                <Input
                  id="addr-line2"
                  value={editingAddress.line2}
                  onChange={(e) => setEditingAddress({ ...editingAddress, line2: e.target.value })}
                  placeholder="Apartment, suite, etc."
                  className="bg-background/50"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="addr-city">City</Label>
                  <Input
                    id="addr-city"
                    value={editingAddress.city}
                    onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addr-state">State</Label>
                  <Input
                    id="addr-state"
                    value={editingAddress.state}
                    onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addr-pincode">Pincode</Label>
                  <Input
                    id="addr-pincode"
                    value={editingAddress.pincode}
                    onChange={(e) => setEditingAddress({ ...editingAddress, pincode: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingAddress(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAddress}
              className="bg-accent text-accent-foreground hover:bg-accent/90 gold-pulse-glow"
            >
              Save Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
