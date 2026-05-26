import type { Location } from "../types/location";

type LocationFormProps = {
  location: Location;
  index: number;

  updateLocation: (
    index: number,
    field: keyof Location,
    value: string
  ) => void;
};

export default function LocationForm({
  location,
  index,
  updateLocation,
}: LocationFormProps) {
  return (
    <div className="border p-4 rounded space-y-3">
      <h3 className="font-bold">
        Location {index + 1}
      </h3>

      <input
        value={location.name}
        onChange={(e) =>
          updateLocation(index, "name", e.target.value)
        }
        placeholder="Location Name"
        className="border px-3 py-2 rounded w-full"
      />

      <textarea
        value={location.description}
        onChange={(e) =>
          updateLocation(
            index,
            "description",
            e.target.value
          )
        }
        placeholder="Location Description"
        className="border px-3 py-2 rounded w-full"
      />
    </div>
  );
}