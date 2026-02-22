import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun } from 'lucide-react';

export default function ThemeSwitcher() {
  return (
    <Card
      className="border-2"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#C9A96E',
      }}
    >
      <CardHeader>
        <CardTitle className="font-playfair font-extrabold" style={{ color: '#C9A96E', letterSpacing: '0.1em' }}>
          Appearance
        </CardTitle>
        <CardDescription className="font-lora" style={{ color: '#5C4B51', lineHeight: '2.0' }}>
          Customize your theme preference
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <button
            className="flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-300"
            style={{
              backgroundColor: '#F8F5F0',
              borderColor: '#C9A96E',
              boxShadow: '0 0 18px rgba(201, 169, 110, 0.45)',
            }}
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full"
              style={{ backgroundColor: '#C9A96E' }}
            >
              <Sun className="w-6 h-6" style={{ color: '#1A1A1A' }} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-montserrat font-bold" style={{ color: '#1A1A1A' }}>Light</p>
              <p className="text-sm font-lora" style={{ color: '#5C4B51' }}>Premium light aesthetic theme (Active)</p>
            </div>
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: '#C9A96E' }}
            />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
