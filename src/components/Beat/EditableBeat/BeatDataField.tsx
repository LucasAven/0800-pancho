import type { BeatEditable } from "types";
import { cn } from "utils";

interface InputBeatDataProps {
  name: string;
  value: string | boolean;
  setBeatEditedData: React.Dispatch<React.SetStateAction<BeatEditable>>;
  type?: string;
}

const InputBeatData: React.FC<InputBeatDataProps> = ({
  name,
  value,
  setBeatEditedData,
  type = "text",
}) => {
  const isBoolean = typeof value === "boolean";

  return (
    <input
      className={cn(
        "ml-2 text-white accent-primary",
        isBoolean
          ? "h-[1.1rem] w-[1.1rem] align-text-bottom"
          : "border-b-2 border-primary bg-transparent focus:outline-none"
      )}
      type={type}
      name={name}
      value={isBoolean ? undefined : value}
      checked={isBoolean ? value : undefined}
      onChange={(e) =>
        setBeatEditedData((prev) => ({
          ...prev,
          [name]: isBoolean ? e.target.checked : e.target.value,
        }))
      }
    />
  );
};

interface BeatDataFieldProps {
  name: string;
  value: string | boolean;
  type?: string;
  isEditing: boolean;
  children: React.ReactNode;
  setBeatEditedData: React.Dispatch<React.SetStateAction<BeatEditable>>;
}

const BeatDataField: React.FC<BeatDataFieldProps> = ({
  name,
  value,
  type = "text",
  isEditing,
  setBeatEditedData,
  children,
}) => {
  return (
    <>
      {isEditing ? (
        <InputBeatData
          name={name}
          type={type}
          setBeatEditedData={setBeatEditedData}
          value={value}
        />
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default BeatDataField;
