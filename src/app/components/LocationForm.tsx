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
      <textarea
        value={location.description}
        onChange={(e) => updateLocation(index, "description", e.target.value)}
        placeholder="Location Description"
        className={inputClass}
      />
    </div>
  );
}
