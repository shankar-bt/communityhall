import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Hall } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Building2, X } from "lucide-react";
// Import leaflet css
import "leaflet/dist/leaflet.css";

// Icons for Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

export function HallMapModal({
  isOpen,
  onClose,
  halls,
  onSelect
}: {
  isOpen: boolean;
  onClose: () => void;
  halls: Hall[];
  onSelect: (h: Hall) => void;
}) {
  const { t } = useLanguage();
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    // Fix default marker icon issue with Leaflet in Vite
    import("leaflet").then((L) => {
      const DefaultIcon = L.icon({
        iconUrl: icon,
        iconRetinaUrl: iconRetina,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
      setCustomIcon(DefaultIcon);
    });
  }, []);

  // Chennai coordinates
  const defaultPosition: [number, number] = [13.0827, 80.2707];

  const mapHalls = halls.filter((h) => {
    const lat = parseFloat(h.latitude || "");
    const lng = parseFloat(h.longitude || "");
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  });

  let bounds: [[number, number], [number, number]] | undefined = undefined;
  if (mapHalls.length > 0) {
    const lats = mapHalls.map((h) => parseFloat(h.latitude!));
    const lngs = mapHalls.map((h) => parseFloat(h.longitude!));
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    if (minLat === maxLat && minLng === maxLng) {
      bounds = [
        [minLat - 0.05, minLng - 0.05],
        [maxLat + 0.05, maxLng + 0.05]
      ];
    } else {
      bounds = [
        [minLat, minLng],
        [maxLat, maxLng],
      ];
    }
  }

  const mapProps = bounds ? { bounds } : { center: defaultPosition, zoom: 11 };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] h-[80vh] p-0 overflow-hidden flex flex-col bg-white rounded-2xl shadow-2xl border-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-white z-10 shadow-sm flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Building2 className="h-5 w-5 text-blue-600" />
              {t("Community Halls Map")}
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="flex-1 relative bg-slate-50 w-full h-full z-0">
          {isOpen && customIcon && (
            <MapContainer
              {...mapProps}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mapHalls.map((h) => (
                <Marker
                  key={h.id}
                  position={[parseFloat(h.latitude!), parseFloat(h.longitude!)]}
                  icon={customIcon}
                >
                  <Popup className="rounded-xl overflow-hidden shadow-lg border-0">
                    <div className="p-1 min-w-[200px]">
                      <h3 className="font-bold text-[14px] text-slate-800 mb-1 leading-tight">
                        {t(h.name)}
                      </h3>
                      <p className="text-[11px] text-slate-500 mb-3 leading-tight break-words">
                        {h.address}
                      </p>
                      <div className="flex justify-between items-center mb-3 text-[12px]">
                        <span className="font-semibold text-slate-600">Rent:</span>
                        <span className="font-bold text-slate-800">₹{h.rent}</span>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onSelect(h);
                        }}
                        className="w-full bg-[#1e3a8a] text-white rounded-lg py-1.5 text-[12px] font-bold hover:bg-[#1e3a8a]/90 transition-colors"
                      >
                        {t("View Details")}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
