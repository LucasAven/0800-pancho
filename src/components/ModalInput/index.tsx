import type { HTMLInputTypeAttribute } from "react";
import type { FieldError, UseFormRegister } from "react-hook-form";
import { cn } from "utils";

export interface IModalInputProps {
  id: string;
  name: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error: FieldError | undefined;
  errorMessage?: string;
  inputClassName?: string;
  required?: boolean;
}

const ModalInput: React.FC<IModalInputProps> = ({
  id,
  name,
  type = "text",
  placeholder = "",
  label,
  register,
  error,
  errorMessage = "Este campo es requerido",
  inputClassName = "",
  required = false,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium capitalize text-gray-400"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-md border border-gray-700 px-3 py-2 text-gray-900 accent-primary placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary",
          inputClassName
        )}
        {...register(name, { required, valueAsNumber: type === "number" })}
      />
      {error && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default ModalInput;
