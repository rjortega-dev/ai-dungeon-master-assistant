import Button from "./Button";
import LocationForm from "./LocationForm";
import { WorldSetting } from "@/features/campaigns/generation/input-schemas";

type WorldFormProps = {
  world: WorldSetting;
  setWorld: (world: WorldSetting) => void;
};

const inputClass =
  "bg-background border border-accent/30 text-foreground placeholder:text-muted px-3 py-2 rounded-lg w-full focus:outline-none focus:border-accent transition-colors";

export default function WorldForm({ world, setWorld }: WorldFormProps) {
  function addLocation() {
    setWorld({
      ...world,
      locations: [...world.locations, { name: "", description: "" }],
    });
  }

  function updateLocation(
    index: number,
    field: "name" | "description",
    value: string,
  ) {
    const updatedLocations = [...world.locations];
    updatedLocations[index] = { ...updatedLocations[index], [field]: value };
    setWorld({ ...world, locations: updatedLocations });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-accent-text">World Building</h2>
      <input
        value={world.name}
        onChange={(e) => setWorld({ ...world, name: e.target.value })}
        placeholder="Primary Setting Name"
        className={inputClass}
      />
      <input
        value={world.settingStyle}
        onChange={(e) => setWorld({ ...world, settingStyle: e.target.value })}
        placeholder="Setting Style"
        className={inputClass}
      />
      <Button type="button" onClick={addLocation}>
        Add Location
      </Button>
      <div className="space-y-3">
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
