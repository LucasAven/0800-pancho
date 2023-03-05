import type { HTMLInputTypeAttribute } from "react";
import { cn } from "utils";

interface InputEditableProps {
  name: string;
  value: string | boolean | number;
  setEditedData: React.Dispatch<
    React.SetStateAction<{ [name: string]: unknown }>
  >;
  type?: HTMLInputTypeAttribute;
}

const InputEditable: React.FC<InputEditableProps> = ({
  name,
  value,
  setEditedData,
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
        setEditedData((prev) => ({
          ...prev,
          [name]: isBoolean ? e.target.checked : e.target.value,
        }))
      }
    />
  );
};

interface EditableFieldProps {
  name: string;
  value: string | boolean | number;
  isEditing: boolean;
  children: React.ReactNode;
  setEditedData: React.Dispatch<
    React.SetStateAction<{ [name: string]: unknown }>
  >;
  type?: HTMLInputTypeAttribute;
}

const EditableField: React.FC<EditableFieldProps> = ({
  name,
  value,
  isEditing,
  setEditedData,
  children,
  type = "text",
}) => {
  return (
    <>
      {isEditing ? (
        <InputEditable
          name={name}
          type={type}
          setEditedData={setEditedData}
          value={value}
        />
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default EditableField;
