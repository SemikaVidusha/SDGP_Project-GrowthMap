import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, ChevronDown } from 'lucide-react';

const PROVINCES = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa"
];


export default function LocationDetector({ onLocationDetected }) {
  const [status, setStatus] = useState('idle'); // idle | loading | granted | denied | manual
  const [userLocation, setUserLocation] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState({ province: '', city: '' });


  useEffect(() => {
    // Auto-detect on mount
    detectLocation();
  }, []);

  const detectLocation = () => {
    setStatus('loading');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, source: 'gps' };
          setUserLocation(loc);
          setStatus('granted');
          onLocationDetected(loc);
        },
        () => {
          // Try IP-based as fallback
          fetchIPLocation();
        }
      );
    } else {
      fetchIPLocation();
    }
  };

  const fetchIPLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data.latitude && data.longitude) {
        const loc = { lat: data.latitude, lng: data.longitude, city: data.city, country: data.country_name, source: 'ip' };
        setUserLocation(loc);
        setStatus('granted');
        onLocationDetected(loc);
      } else {
        setStatus('denied');
      }
    } catch {
      setStatus('denied');
    }
  };

  const applyManual = () => {
  if (!manual.province) return;

  const loc = {
    manualLabel: `${manual.city ? manual.city + ', ' : ''}${manual.province}, Sri Lanka`,
    country: "Sri Lanka",
    source: 'manual'
    };

    setUserLocation(loc);
    setStatus('granted');
    setShowManual(false);
    onLocationDetected(loc);
};


  const selectedCountry = COUNTRIES.find(c => c.name === manual.country);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-xs border ${
        status === 'granted' ? 'bg-green-50 text-green-700 border-green-200' :
        status === 'loading' ? 'bg-blue-50 text-blue-600 border-blue-200' :
        'bg-amber-50 text-amber-700 border-amber-200'
      }`}>
        {status === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
        {status === 'loading' && 'Detecting location...'}
        {status === 'granted' && userLocation && (
          userLocation.source === 'manual' ? `📍 ${userLocation.manualLabel}` :
          userLocation.source === 'ip' ? `📍 ${userLocation.city || 'Detected'} (IP)` :
          '📍 GPS location detected'
        )}
        {status === 'denied' && 'Location unavailable'}
        {status === 'idle' && 'Location not detected'}
      </div>

      <button onClick={() => setShowManual(s => !s)}
        className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 underline underline-offset-2">
        Set manually <ChevronDown className={`w-3 h-3 transition-transform ${showManual ? 'rotate-180' : ''}`} />
      </button>

      {status === 'denied' && (
        <button onClick={detectLocation} className="text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2">
          Retry GPS
        </button>
      )}

      
      <select
        value={manual.province}
        onChange={e => setManual(m => ({ ...m, province: e.target.value }))}
        className="flex-1 min-w-28 text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-purple-300"
      >
      <option value="">Select Province</option>
        {PROVINCES.map(p => (
      <option key={p} value={p}>{p}</option>
    ))}
      </select>

    </div>
  );
}