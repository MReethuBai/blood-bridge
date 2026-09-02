import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix standard Leaflet default icon URLs in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Icons for Hospital and Donors
const createHospitalIcon = () => {
  return L.divIcon({
    className: "custom-hospital-marker",
    html: `<div style="background-color: #DC2626; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 10px rgba(220, 38, 38, 0.4); font-size: 16px;">🏥</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const createDonorIcon = (score, bg) => {
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#6B7280";
  return L.divIcon({
    className: "custom-donor-marker",
    html: `<div style="background-color: ${color}; color: white; padding: 2px 6px; border-radius: 12px; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); white-space: nowrap;">🩸 ${bg} (${score} pts)</div>`,
    iconSize: [60, 24],
    iconAnchor: [30, 12],
  });
};

export default function DonorMap({ 
  hospitalLocation, 
  matchedDonors, 
  donors, 
  hospitalName = "Emergency Hospital",
  center 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const activeDonors = matchedDonors || donors || [];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let lat = 12.9716;
    let lng = 77.5946;

    if (hospitalLocation && typeof hospitalLocation.lat === "number" && typeof hospitalLocation.lng === "number") {
      lat = hospitalLocation.lat;
      lng = hospitalLocation.lng;
    } else if (Array.isArray(center) && center.length >= 2) {
      lat = center[0];
      lng = center[1];
    }

    // Initialize Map
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([lat, lng], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([lat, lng], 12);
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Add Hospital Marker
    const hospitalMarker = L.marker([lat, lng], { icon: createHospitalIcon() }).addTo(map);
    hospitalMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px;">
        <h4 style="margin: 0 0 4px; font-weight: bold; color: #1E293B;">🏥 ${hospitalName}</h4>
        <p style="margin: 0; font-size: 12px; color: #64748B;">Emergency Request Location (${lat.toFixed(4)}, ${lng.toFixed(4)})</p>
      </div>
    `);

    // Add Proximity Distance Circles (5km and 15km)
    L.circle([lat, lng], {
      color: "#DC2626",
      fillColor: "#FCA5A5",
      fillOpacity: 0.1,
      radius: 5000, // 5km
    }).addTo(map);

    L.circle([lat, lng], {
      color: "#64748B",
      fillColor: "#E2E8F0",
      fillOpacity: 0.05,
      radius: 15000, // 15km
      dashArray: "4, 6"
    }).addTo(map);

    // Add Matched Donor Markers (Limit map pins to top 30 for performance)
    const bounds = L.latLngBounds([[lat, lng]]);
    let validDonorCount = 0;

    activeDonors.slice(0, 40).forEach((donor) => {
      const dLat = donor.lat || donor.latitude;
      const dLng = donor.lng || donor.longitude;
      if (typeof dLat === "number" && typeof dLng === "number") {
        validDonorCount++;
        const marker = L.marker([dLat, dLng], {
          icon: createDonorIcon(donor.suitability_score || 85, donor.blood_group || "O+")
        }).addTo(map);

        bounds.extend([dLat, dLng]);

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 180px; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="color: #0F172A; font-size: 13px;">${donor.name || "Verified Donor"}</strong>
              <span style="background: #EEF2FF; color: #4338CA; font-weight: bold; font-size: 10px; padding: 2px 6px; border-radius: 4px;">${donor.donor_code || "D001"}</span>
            </div>
            <div style="font-size: 12px; color: #334155; line-height: 1.4;">
              <div><strong>Blood Group:</strong> <span style="color: #DC2626; font-weight: bold;">${donor.blood_group}</span></div>
              <div><strong>Distance:</strong> ${donor.distance_km || 2.5} km away</div>
              <div><strong>AI Match Score:</strong> <span style="color: #059669; font-weight: bold;">${donor.suitability_score || 90} / 100</span></div>
              <div><strong>Mobile:</strong> ${donor.phone || "+91 98765 43210"}</div>
              <div style="font-size: 11px; color: #64748B; margin-top: 4px;">${donor.is_available ? "🟢 Available" : "🔴 Unavailable"}</div>
            </div>
          </div>
        `);
      }
    });

    if (validDonorCount > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

  }, [hospitalLocation, matchedDonors, donors, hospitalName, center]);

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-xs px-3 py-2 rounded-lg text-xs border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span> Hospital
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> High Score (&ge;80)
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Medium Score (60-79)
        </div>
      </div>
    </div>
  );
}
