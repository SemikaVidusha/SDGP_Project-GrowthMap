import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { X, MapPin, Navigation } from 'lucide-react';
import { Button } from '../ui/button';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

export default function InstituteMapModal({ resource, userLocation, onClose }) {
  if (!resource) return null;
  const inst = resource.institute;
  const hasInstCoords = inst?.lat && inst?.lng;
  const hasUserCoords = userLocation?.lat && userLocation?.lng;

  const SRI_LANKA_CENTER = [7.8731, 80.7718];

  const mapCenter = hasInstCoords
     ? [inst.lat, inst.lng]
    : hasUserCoords
    ? [userLocation.lat, userLocation.lng]
    : SRI_LANKA_CENTER;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{inst?.name || resource.name}</p>
              <p className="text-xs text-slate-500">{inst?.address || 'Institute Location'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-xs text-slate-600">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Institute</span>
          {hasUserCoords && <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> Your Location</span>}
          {userLocation?.source === 'manual' && <span className="flex items-center gap-1.5">📍 {userLocation.manualLabel}</span>}
          {userLocation?.source === 'ip' && <span className="flex items-center gap-1.5">🌐 IP-detected: {userLocation.city}</span>}
        </div>

        {/* Map */}
        <div className="h-72 sm:h-96 w-full">
          {hasInstCoords ? (
            <MapContainer center={mapCenter} zoom={hasInstCoords ? 13 : 8} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[inst.lat, inst.lng]}>
                <Popup>
                  <div className="text-sm font-medium">{inst.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{inst.address}</div>
                </Popup>
              </Marker>
              {hasUserCoords && (
                <>
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={purpleIcon}>
                    <Popup>📍 Your Location</Popup>
                  </Marker>
                  <Circle center={[userLocation.lat, userLocation.lng]} radius={400} color="#7c3aed" fillOpacity={0.12} />
                </>
              )}
            </MapContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-500 gap-2">
              <MapPin className="w-8 h-8 text-slate-300" />
              <p className="text-sm">Location data not available for this resource</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Navigation className="w-3.5 h-3.5" />
            {resource.skill} · {resource.type}
          </div>
          <div className="flex gap-2">
            {hasInstCoords && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${inst.lat},${inst.lng}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                >
                <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs"
                >
                Open in Google Maps
                </Button>
            </a>

            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}