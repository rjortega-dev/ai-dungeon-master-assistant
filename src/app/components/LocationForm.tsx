import type { Location } from "../types/location";

type LocationFormProps = {
  location: Location;
  index: number;
  updateLocation: (index: number, field: keyof Location, value: string) => void;
};

const inputClass =
  "bg-background border border-accent/30 text-foreground placeholder:text-muted px-3 py-2 rounded-lg w-full focus:outline-none focus:border-accent transition-colors";

export default function LocationForm({
  location,
  index,
  updateLocation,
}: LocationFormProps) {
  return (
    <div className="bg-background/50 border border-accent/20 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-foreground/90 text-sm uppercase tracking-wider">
        Location {index + 1}
      </h3>
      <input
        value={location.name}
        onChange={(e) => updateLocation(index, "name", e.target.value)}
        placeholder="Location Name"
        className={inputClass}
      />
      <input
        value={location.locationType}
        onChange={(e) => updateLocation(index, "locationType", e.target.value)}
        placeholder="Location Type"
        className={inputClass}
      />
      <textarea
        value={location.description}
        onChange={(e) => updateLocation(index, "description", e.target.value)}
        placeholder="Location Description"
        className={inputClass}
      />
      <input
        value={location.climate}
        onChange={(e) => updateLocation(index, "climate", e.target.value)}
        placeholder="Climate"
        className={inputClass}
      />
      <input
        value={location.governmentType}
        onChange={(e) => updateLocation(index, "governmentType", e.target.value)}
        placeholder="Government Type"
        className={inputClass}
      />
      <select
        value={location.status}
        onChange={(e) => updateLocation(index, "status", e.target.value)}
        className={inputClass}
      >
        <option value="UNKNOWN">Unknown</option>
        <option value="SAFE">Safe</option>
        <option value="DANGEROUS">Dangerous</option>
        <option value="DESTROYED">Destroyed</option>
        <option value="OCCUPIED">Occupied</option>
      </select>
      <textarea
        value={location.importance ?? ""}
        onChange={(e) => updateLocation(index, "importance", e.target.value)}
        placeholder="Importance"
        className={inputClass}
      />
      <textarea
        value={location.secrets ?? ""}
        onChange={(e) => updateLocation(index, "secrets", e.target.value)}
        placeholder="Secrets (DM Only)"
        className={inputClass}
      />
      <textarea
        value={location.rumors ?? ""}
        onChange={(e) => updateLocation(index, "rumors", e.target.value)}
        placeholder="Rumors"
        className={inputClass}
      />
    </div>
  );
}
