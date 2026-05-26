import Button from "./Button";
import LocationForm from "./LocationForm";

import type { World } from "../types/world";

type WorldFormProps = {
  world: World;
  setWorld: (world: World) => void;
}

export default function WorldForm({
  world,
  setWorld,
}: WorldFormProps) {
  function addLocation() {
    setWorld({
      ...world,
      locations: [
        ...world.locations,
        {
          name: "",
          description: "",
        },
      ],
    });
  }

  function updateLocation(
    index: number,
    field: "name" | "description",
    value: string
  ) {
    const updatedLocations = [...world.locations];

    updatedLocations[index] = {
      ...updatedLocations[index],
      [field]: value,
    };

    setWorld({
      ...world,
      locations: updatedLocations,
    });
  }

  return (
    <div className="space-y-6 border p-6 rounded">
      <h2 className="text-2xl font-bold">
        World Building
      </h2>

      <input
        value={world.settingName}
        onChange={(e) =>
          setWorld({
            ...world,
            settingName: e.target.value,
          })
        }
        placeholder="Primary Setting Name"
        className="border px-3 py-2 rounded w-full"
      />

      <input
        value={world.settingStyle}
        onChange={(e) =>
          setWorld({
            ...world,
            settingStyle: e.target.value,
          })
        }
        placeholder="Setting Style"
        className="border px-3 py-2 rounded w-full"
      />

      <Button
        type="button"
        onClick={addLocation}
      >
        Add Location
      </Button>

      <div className="space-y-4">
        {world.locations.map((location, index) => (
          <LocationForm
            key={index}
            location={location}
            index={index}
            updateLocation={updateLocation}
          />
        ))}
      </div>
    </div>
  );
}