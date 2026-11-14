import React, { useState, useCallback, useMemo } from "react";
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useMap 
} from "@vis.gl/react-google-maps";
import { 
  MapPin, 
  ShieldCheck, 
  Users, 
  Navigation, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Maximize2,
  Compass,
  Zap,
  Coffee,
  Info
} from "lucide-react";
import { audio } from "../utils/audio";
import { analytics } from "../utils/analytics";
import { RadarHotspot } from "./LiveHangoutsRadar";

interface GoogleHangoutsMapProps {
  hotspots: RadarHotspot[];
  selectedHotspot: RadarHotspot | null;
  onSelectHotspot: (spot: RadarHotspot) => void;
  onBookCompanion: (companionName: string, location: string) => void;
  triggerBoom?: () => void;
  selectedCity: "all" | "Gurugram" | "Delhi" | "Noida";
}

// City bounding centers
const CITY_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  all: { lat: 28.5355, lng: 77.1650, zoom: 11 },
  Gurugram: { lat: 28.4800, lng: 77.0800, zoom: 12.5 },
  Delhi: { lat: 28.6000, lng: 77.2250, zoom: 12.5 },
  Noida: { lat: 28.5100, lng: 77.3800, zoom: 12.5 },
};

// Map Camera Controller Helper
function MapCameraController({ selectedCity, selectedHotspot }: { 
  selectedCity: "all" | "Gurugram" | "Delhi" | "Noida";
  selectedHotspot: RadarHotspot | null;
}) {
  const map = useMap();

  React.useEffect(() => {
    if (!map) return;
    if (selectedHotspot && selectedHotspot.lat && selectedHotspot.lng) {
      map.panTo({ lat: selectedHotspot.lat, lng: selectedHotspot.lng });
      map.setZoom(13.5);
    } else {
      const target = CITY_CENTERS[selectedCity] || CITY_CENTERS.all;
      map.panTo({ lat: target.lat, lng: target.lng });
      map.setZoom(target.zoom);
    }
  }, [map, selectedCity, selectedHotspot]);

  return null;
}

export default function GoogleHangoutsMap({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onBookCompanion,
  triggerBoom,
  selectedCity
}: GoogleHangoutsMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const [activeInfoWindowSpot, setActiveInfoWindowSpot] = useState<RadarHotspot | null>(selectedHotspot);

  // Sync with prop when parent selection changes
  React.useEffect(() => {
    if (selectedHotspot) {
      setActiveInfoWindowSpot(selectedHotspot);
    }
  }, [selectedHotspot]);

  const handleMarkerClick = useCallback((spot: RadarHotspot) => {
    audio.playClick();
    onSelectHotspot(spot);
    setActiveInfoWindowSpot(spot);
    analytics.trackHotspotInspect(spot.name, spot.city, spot.currentActive);
    if (triggerBoom) triggerBoom();
  }, [onSelectHotspot, triggerBoom]);

  const defaultCenter = useMemo(() => {
    return CITY_CENTERS[selectedCity] || CITY_CENTERS.all;
  }, [selectedCity]);

  if (!apiKey) {
    return (
      <div className="w-full h-80 sm:h-96 bg-[#071330] rounded-[24px] border-[3px] border-[#0b1f5c] p-6 flex flex-col items-center justify-center text-center text-white">
        <MapPin className="w-12 h-12 text-[#ffc933] mb-3 animate-bounce" />
        <h4 className="text-lg font-black mb-1">Google Maps API Key Configuring...</h4>
        <p className="text-xs text-white/70 max-w-md mb-4">
          Google Maps Platform is enabled. If you see this message, please verify that <code>VITE_GOOGLE_MAPS_API_KEY</code> is loaded in your environment.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[500px] rounded-2xl sm:rounded-[24px] overflow-hidden border-[3px] border-[#0b1f5c] shadow-[5px_5px_0_#0b1f5c] sm:shadow-[6px_6px_0_#0b1f5c] bg-[#eaf3ff]">
      <APIProvider apiKey={apiKey} libraries={["marker"]}>
        <Map
          defaultCenter={{ lat: defaultCenter.lat, lng: defaultCenter.lng }}
          defaultZoom={defaultCenter.zoom}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio", "gmp_git_agentskills_v1"]}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
        >
          <MapCameraController 
            selectedCity={selectedCity} 
            selectedHotspot={selectedHotspot} 
          />

          {/* Render markers for each NCR hotspot */}
          {hotspots.map((spot) => {
            const isSelected = selectedHotspot?.id === spot.id;
            const glyphColor = isSelected ? "#ffc933" : "#ffffff";
            const background = spot.city === "Gurugram" 
              ? "#1f4ee0" 
              : spot.city === "Delhi" 
              ? "#ff6b4a" 
              : "#0b1f5c";

            return (
              <AdvancedMarker
                key={spot.id}
                position={{ lat: spot.lat, lng: spot.lng }}
                title={`${spot.name} (${spot.currentActive} active companions)`}
                onClick={() => handleMarkerClick(spot)}
              >
                {/* Custom Neo-Brutalist Map Pin Badge */}
                <div className={`relative group cursor-pointer transition-transform duration-200 ${
                  isSelected ? "scale-110 z-50" : "hover:scale-105 z-20"
                }`}>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-[2.5px] border-[#0b1f5c] shadow-[3px_3px_0_#0b1f5c] text-white font-extrabold text-xs transition-colors ${
                    isSelected 
                      ? "bg-[#ffc933] text-[#0b1f5c]" 
                      : spot.city === "Gurugram" 
                      ? "bg-[#1f4ee0]" 
                      : spot.city === "Delhi" 
                      ? "bg-[#ff6b4a]" 
                      : "bg-[#0b1f5c]"
                  }`}>
                    <span className="text-sm">{spot.icon}</span>
                    <span className="font-mono tracking-tight font-black">{spot.currentActive}</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  </div>

                  {/* Little pin triangle needle */}
                  <div className={`w-0 h-0 mx-auto border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-[1px] ${
                    isSelected ? "border-t-[#ffc933]" : "border-t-[#0b1f5c]"
                  }`}></div>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Interactive InfoWindow for Selected Hotspot */}
          {activeInfoWindowSpot && (
            <InfoWindow
              position={{ lat: activeInfoWindowSpot.lat, lng: activeInfoWindowSpot.lng }}
              onCloseClick={() => setActiveInfoWindowSpot(null)}
              headerContent={
                <div className="flex items-center gap-1.5 font-black text-sm text-[#0b1f5c] pr-2">
                  <span className="text-base">{activeInfoWindowSpot.icon}</span>
                  <span>{activeInfoWindowSpot.name}</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#1f4ee0]">
                    {activeInfoWindowSpot.city}
                  </span>
                </div>
              }
            >
              <div className="max-w-[260px] sm:max-w-[290px] p-1 text-[#0b1f5c] font-sans">
                {/* 3 Free Hangouts Perk Callout */}
                <div className="bg-[#ffc933]/30 border border-[#0b1f5c]/30 rounded-lg p-2 mb-2 text-[11px] font-bold text-[#0b1f5c] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1f4ee0] shrink-0" />
                  <span>First 3 Hangouts here are 100% Free! (₹0 fee)</span>
                </div>

                <p className="text-[11px] text-[#4a5a8a] mb-2 leading-relaxed font-medium">
                  {activeInfoWindowSpot.address}
                </p>

                {/* Companions on-site */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-[#0b1f5c] mb-1.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#1f4ee0]" />
                      Active Companions:
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
                      {activeInfoWindowSpot.currentActive} Live
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {activeInfoWindowSpot.activeCompanions.map((comp, idx) => (
                      <div 
                        key={idx}
                        className="bg-white p-1.5 rounded-lg border border-[#0b1f5c]/20 flex items-center justify-between gap-1 shadow-2xs hover:border-[#1f4ee0] transition-colors"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-base">{comp.emoji}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-black truncate">{comp.name}</p>
                            <p className="text-[10px] text-[#4a5a8a] truncate">{comp.activity}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            audio.playClick();
                            onBookCompanion(comp.name, activeInfoWindowSpot.name);
                          }}
                          className="px-2 py-1 bg-[#1f4ee0] hover:bg-[#0b1f5c] text-white text-[10px] font-black rounded-md shrink-0 cursor-pointer transition-colors"
                        >
                          Book Free
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions: Google Maps Directions & Book Spot */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#0b1f5c]/10">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${activeInfoWindowSpot.name}, ${activeInfoWindowSpot.city}, India`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-slate-100 text-[#0b1f5c] border border-[#0b1f5c] rounded-lg text-[10px] font-black cursor-pointer transition-colors shadow-2xs"
                  >
                    <Navigation className="w-3 h-3 text-[#1f4ee0]" />
                    Directions
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      onBookCompanion("", activeInfoWindowSpot.name);
                    }}
                    className="flex-1 py-1.5 px-2 bg-[#ffc933] hover:bg-[#e0ad1f] text-[#0b1f5c] border border-[#0b1f5c] rounded-lg text-[10px] font-black cursor-pointer transition-colors shadow-[1px_1px_0_#0b1f5c]"
                  >
                    Meet at Hub
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Floating Map Legend & Control Overlay */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 pointer-events-none sm:pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md border-[2px] border-[#0b1f5c] rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-[2px_2px_0_#0b1f5c] sm:shadow-[3px_3px_0_#0b1f5c] flex items-center gap-2 text-[10px] sm:text-xs font-black text-[#0b1f5c]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#1f4ee0] inline-block"></span> Gurugram
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ff6b4a] inline-block"></span> Delhi
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#0b1f5c] inline-block"></span> Noida
          </div>
        </div>
      </div>

      {/* Verified Safety Badge Overlay */}
      <div className="hidden sm:block absolute bottom-3 right-3 z-10 pointer-events-none">
        <div className="bg-[#0b1f5c]/90 text-white backdrop-blur-md border-[2px] border-white/30 rounded-xl px-3 py-1.5 shadow-md flex items-center gap-2 text-[11px] font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Verified Public Zones</span>
        </div>
      </div>
    </div>
  );
}
