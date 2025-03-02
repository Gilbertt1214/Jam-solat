import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';

interface LocationSelectorProps {
  onLocationSelect: (city: string, country: string) => void;
}

const popularLocations = [
  // Middle East
  { city: 'Mecca', country: 'Saudi Arabia', lat: 21.4225, lng: 39.8262 },
  { city: 'Medina', country: 'Saudi Arabia', lat: 24.5247, lng: 39.5692 },
  { city: 'Jerusalem', country: 'Palestine', lat: 31.7683, lng: 35.2137 },
  { city: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
  { city: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784 },
  { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
  
  // Indonesia - Major Cities
  { city: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456 },
  { city: 'Surabaya', country: 'Indonesia', lat: -7.2575, lng: 112.7521 },
  { city: 'Bandung', country: 'Indonesia', lat: -6.9175, lng: 107.6191 },
  { city: 'Medan', country: 'Indonesia', lat: 3.5952, lng: 98.6722 },
  { city: 'Makassar', country: 'Indonesia', lat: -5.1477, lng: 119.4327 },
  { city: 'Yogyakarta', country: 'Indonesia', lat: -7.7971, lng: 110.3688 },
  { city: 'Aceh', country: 'Indonesia', lat: 4.6951, lng: 96.7494 },
  { city: 'Palembang', country: 'Indonesia', lat: -2.9761, lng: 104.7754 },
  
  // Indonesia - Additional Cities
  { city: 'Semarang', country: 'Indonesia', lat: -6.9932, lng: 110.4203 },
  { city: 'Depok', country: 'Indonesia', lat: -6.4025, lng: 106.7942 },
  { city: 'Tangerang', country: 'Indonesia', lat: -6.1781, lng: 106.6300 },
  { city: 'Bekasi', country: 'Indonesia', lat: -6.2349, lng: 106.9896 },
  { city: 'Padang', country: 'Indonesia', lat: -0.9471, lng: 100.4172 },
  { city: 'Malang', country: 'Indonesia', lat: -7.9797, lng: 112.6304 },
  { city: 'Denpasar', country: 'Indonesia', lat: -8.6705, lng: 115.2126 },
  { city: 'Balikpapan', country: 'Indonesia', lat: -1.2379, lng: 116.8529 },
  { city: 'Banjarmasin', country: 'Indonesia', lat: -3.3186, lng: 114.5944 },
  { city: 'Manado', country: 'Indonesia', lat: 1.4748, lng: 124.8421 },
  { city: 'Mataram', country: 'Indonesia', lat: -8.5833, lng: 116.1167 },
  { city: 'Ambon', country: 'Indonesia', lat: -3.6954, lng: 128.1814 },
  { city: 'Pontianak', country: 'Indonesia', lat: -0.0263, lng: 109.3425 },
  { city: 'Kupang', country: 'Indonesia', lat: -10.1772, lng: 123.6070 },
  { city: 'Jambi', country: 'Indonesia', lat: -1.6101, lng: 103.6131 },
  { city: 'Pekanbaru', country: 'Indonesia', lat: 0.5070, lng: 101.4478 },
  { city: 'Samarinda', country: 'Indonesia', lat: -0.4948, lng: 117.1436 },
  { city: 'Tasikmalaya', country: 'Indonesia', lat: -7.3274, lng: 108.2207 },
  { city: 'Bandar Lampung', country: 'Indonesia', lat: -5.3971, lng: 105.2663 },
  { city: 'Cirebon', country: 'Indonesia', lat: -6.7320, lng: 108.5523 },
  { city: 'Surakarta', country: 'Indonesia', lat: -7.5755, lng: 110.8243 },
  { city: 'Jayapura', country: 'Indonesia', lat: -2.5916, lng: 140.6690 },
  { city: 'Palu', country: 'Indonesia', lat: -0.9003, lng: 119.8779 },
  { city: 'Kendari', country: 'Indonesia', lat: -3.9985, lng: 122.5129 },
  { city: 'Sorong', country: 'Indonesia', lat: -0.8761, lng: 131.2548 },
  { city: 'Gorontalo', country: 'Indonesia', lat: 0.5435, lng: 123.0568 },
  { city: 'Madiun', country: 'Indonesia', lat: -7.6298, lng: 111.5300 },
  { city: 'Sukabumi', country: 'Indonesia', lat: -6.9277, lng: 106.9300 },
  { city: 'Tegal', country: 'Indonesia', lat: -6.8694, lng: 109.1402 },
  { city: 'Bogor', country: 'Indonesia', lat: -6.5971, lng: 106.8060 },
];

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  const regions = [
    { name: 'All', count: popularLocations.length },
    { name: 'Middle East', count: popularLocations.filter(loc => ['Saudi Arabia', 'Palestine', 'Egypt', 'Turkey', 'UAE'].includes(loc.country)).length },
    { name: 'Indonesia', count: popularLocations.filter(loc => loc.country === 'Indonesia').length },
  ];
  
  const filteredLocations = popularLocations.filter(loc => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
      loc.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by region
    const matchesRegion = selectedRegion === null || 
      selectedRegion === 'All' || 
      (selectedRegion === 'Middle East' && ['Saudi Arabia', 'Palestine', 'Egypt', 'Turkey', 'UAE'].includes(loc.country)) ||
      (selectedRegion === 'Indonesia' && loc.country === 'Indonesia');
    
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <MapPin className="mr-2" size={20} />
        Select Location
      </h2>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Region filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {regions.map(region => (
          <button
            key={region.name}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedRegion === region.name
                ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setSelectedRegion(region.name === selectedRegion ? null : region.name)}
          >
            {region.name} ({region.count})
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {filteredLocations.map((location) => (
          <button
            key={`${location.city}-${location.country}`}
            className="p-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-md text-gray-800 dark:text-white transition-colors"
            onClick={() => onLocationSelect(location.city, location.country)}
          >
            {location.city}, {location.country}
          </button>
        ))}
      </div>
      
      {filteredLocations.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          No locations found. Try a different search term.
        </p>
      )}
    </div>
  );
};

export default LocationSelector;