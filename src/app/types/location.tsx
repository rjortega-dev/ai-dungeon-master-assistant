//NOTE: locationType, climate, governmentType required, change to optional or keep?
export type Location = {
  name: string;
  locationType?: string;
  description?: string;

  climate?: string;
  governmentType?: string;

  status: "SAFE" | "DANGEROUS" | "DESTROYED" | "OCCUPIED" | "UNKNOWN";
  importance?: string;
  secrets?: string;
  rumors?: string;
};