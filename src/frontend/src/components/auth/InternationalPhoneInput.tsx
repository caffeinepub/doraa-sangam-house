import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, ChevronsUpDown, Smartphone } from 'lucide-react';
import { PHONE_COUNTRIES, type CountryData } from '@/utils/phoneCountries';
import { validatePhoneNumber, type PhoneValidationResult } from '@/utils/phoneValidation';
import { cn } from '@/lib/utils';

interface InternationalPhoneInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  selectedCountry: CountryData;
  onCountryChange: (country: CountryData) => void;
  onValidationChange?: (result: PhoneValidationResult) => void;
  disabled?: boolean;
  error?: string;
  onBlur?: () => void;
}

export default function InternationalPhoneInput({
  id,
  label,
  value,
  onChange,
  selectedCountry,
  onCountryChange,
  onValidationChange,
  disabled = false,
  error,
  onBlur,
}: InternationalPhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter countries based on search
  const filteredCountries = PHONE_COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountrySelect = (country: CountryData) => {
    onCountryChange(country);
    setOpen(false);
    setSearchQuery('');
    // Focus input after country selection
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits and basic formatting characters
    const cleaned = e.target.value.replace(/[^\d\s-]/g, '');
    onChange(cleaned);
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
    
    // Validate on blur
    if (value && onValidationChange) {
      const result = validatePhoneNumber(value, selectedCountry);
      onValidationChange(result);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-foreground">{label}</Label>
      <div className="flex gap-2">
        {/* Country Selector - Compact */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                "w-[120px] justify-between bg-background/50 border-border/60 hover:border-primary hover:bg-primary/5",
                "transition-all duration-300",
                "hover:shadow-[0_0_16px_rgba(212,175,55,0.3)]",
                "gold-pulse-glow",
                error && "border-accent"
              )}
            >
              <span className="flex items-center gap-1.5 truncate">
                <span className="text-base">{selectedCountry.flag}</span>
                <span className="text-xs font-semibold">{selectedCountry.dialCode}</span>
              </span>
              <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0 bg-popover/95 backdrop-blur-xl border-border/40">
            <Command className="bg-transparent">
              <CommandInput 
                placeholder="Search country..." 
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="border-none focus:ring-0 h-9 text-sm"
              />
              <CommandEmpty className="text-sm py-4">No country found.</CommandEmpty>
              <CommandList>
                <ScrollArea className="h-[240px]">
                  <CommandGroup>
                    {filteredCountries.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={country.code}
                        onSelect={() => handleCountrySelect(country)}
                        className={cn(
                          "flex items-center gap-2 cursor-pointer py-2",
                          "hover:bg-primary/10 hover:text-primary",
                          "transition-all duration-200",
                          selectedCountry.code === country.code && "bg-primary/20 text-primary"
                        )}
                      >
                        <span className="text-lg">{country.flag}</span>
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="font-medium text-sm truncate">{country.name}</span>
                          <span className="text-xs text-muted-foreground ml-2 shrink-0">{country.dialCode}</span>
                        </div>
                        <Check
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            selectedCountry.code === country.code ? "opacity-100 text-accent" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Phone Number Input */}
        <div className="relative flex-1">
          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            ref={inputRef}
            id={id}
            type="tel"
            placeholder={selectedCountry.format || 'Enter phone number'}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={cn(
              "pl-10 bg-background/50 border-border/60 focus:border-primary",
              "transition-all duration-300",
              error && "border-accent focus:border-accent"
            )}
          />
        </div>
      </div>
      
      {/* Inline Error Message */}
      {error && (
        <div className="flex items-start gap-2 mt-2 p-3 rounded-md border-2 border-accent bg-accent/5">
          <div className="text-sm text-[oklch(var(--primary))] leading-relaxed">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
