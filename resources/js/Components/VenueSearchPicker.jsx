import { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sub-komponen untuk menggerakkan peta ke posisi baru
function MapFlyTo({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 16, { duration: 1.2 });
        }
    }, [center, map]);
    return null;
}

/**
 * VenueSearchPicker
 *
 * Props:
 *  - onSelect(result): dipanggil saat user memilih satu lokasi
 *    result = { display_name, lat, lon, address: { city, town, ... } }
 *  - initialLat, initialLng: koordinat awal (saat edit)
 *  - initialVenueName: nama venue awal (saat edit)
 */
export default function VenueSearchPicker({ onSelect, initialLat, initialLng, initialVenueName }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(
        initialLat && initialLng
            ? { lat: parseFloat(initialLat), lng: parseFloat(initialLng), name: initialVenueName || '' }
            : null
    );
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchNominatim = useCallback(async (q) => {
        if (!q || q.trim().length < 3) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=id&limit=6&addressdetails=1`;
            const res = await fetch(url, {
                headers: { 'Accept-Language': 'id' }
            });
            const data = await res.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (err) {
            console.error('Nominatim error:', err);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    function handleQueryChange(e) {
        const val = e.target.value;
        setQuery(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchNominatim(val), 500);
    }

    function handleSelect(result) {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const addr = result.address || {};
        const city = addr.city || addr.town || addr.village || addr.county || addr.state || '';
        const displayName = result.display_name;

        // Ambil nama pendek (sebelum koma pertama) sebagai venue_name
        const shortName = displayName.split(',')[0].trim();

        setSelectedLocation({ lat, lng, name: shortName });
        setQuery(shortName);
        setSuggestions([]);
        setShowSuggestions(false);

        onSelect({
            lat,
            lng,
            venueName: shortName,
            city,
            displayName,
        });
    }

    function clearSelection() {
        setSelectedLocation(null);
        setQuery('');
        setSuggestions([]);
        onSelect({ lat: '', lng: '', venueName: '', city: '', displayName: '' });
    }

    return (
        <div className="space-y-3">
            {/* Search Input */}
            <div ref={wrapperRef} className="relative">
                <div className="relative flex items-center">
                    <svg className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={handleQueryChange}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        placeholder="Cari nama venue atau kota... (mis: Gelora Bung Karno, Jatim Expo)"
                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm bg-[#fafafa] focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                    />
                    {loading && (
                        <div className="absolute right-3.5 w-4 h-4">
                            <svg className="animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                        </div>
                    )}
                    {!loading && selectedLocation && (
                        <button type="button" onClick={clearSelection} className="absolute right-3.5 text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    )}
                </div>

                {/* Dropdown Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
                        {suggestions.map((result, idx) => {
                            const parts = result.display_name.split(',');
                            const mainName = parts[0].trim();
                            const subName = parts.slice(1, 4).join(',').trim();
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelect(result)}
                                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 leading-snug truncate">{mainName}</p>
                                        <p className="text-xs text-gray-400 mt-0.5 truncate">{subName}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* No results */}
                {showSuggestions && !loading && query.length >= 3 && suggestions.length === 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-4 text-sm text-gray-500 text-center">
                        Lokasi tidak ditemukan. Coba kata kunci yang berbeda.
                    </div>
                )}
            </div>

            {/* Hint text */}
            {!selectedLocation && (
                <p className="text-xs text-gray-400">
                    💡 Ketik minimal 3 karakter untuk mencari. Hasil dari OpenStreetMap.
                </p>
            )}

            {/* Map Preview setelah lokasi dipilih */}
            {selectedLocation && (
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    {/* Preview Header */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border-b border-green-100">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className="text-xs font-semibold text-green-700">Lokasi berhasil ditemukan — Konfirmasi peta di bawah</span>
                    </div>
                    {/* Leaflet Mini Map */}
                    <div style={{ height: '220px', width: '100%' }}>
                        <MapContainer
                            center={[selectedLocation.lat, selectedLocation.lng]}
                            zoom={16}
                            scrollWheelZoom={false}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                attribution='&copy; Google Maps'
                                url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                maxZoom={19}
                            />
                            <MapFlyTo center={[selectedLocation.lat, selectedLocation.lng]} />
                            <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
                        </MapContainer>
                    </div>
                    <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400">
                            Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
