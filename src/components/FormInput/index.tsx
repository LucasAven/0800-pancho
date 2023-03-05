/* eslint-disable @typescript-eslint/no-explicit-any */
import { type HTMLInputTypeAttribute, useState } from "react";
import type {
  UseFormRegister,
  RegisterOptions,
  UseFormGetValues,
  FieldError,
} from "react-hook-form";
import { cn } from "utils";

export interface IFormInputProps {
  placeholder: string;
  name: string;
  type: HTMLInputTypeAttribute | "textarea";
  validations: RegisterOptions;
  register: UseFormRegister<any>;
  error: FieldError | undefined;
  getValues: UseFormGetValues<any>;
  className?: string;
}

const FormInput: React.FC<IFormInputProps> = ({
  placeholder,
  name,
  type,
  validations,
  register,
  error,
  getValues,
  className = "",
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <div className={cn("relative mt-7 flex flex-col uppercase", className)}>
      <label
        htmlFor={name}
        className={cn(
          "absolute w-full max-w-full py-2 capitalize text-baseText transition-all",
          (isFocus || (getValues(name) as string).length > 0) &&
            "translate-x-[-12%] translate-y-[-15px] scale-75 p-0 text-sm"
        )}
      >
        {placeholder}
      </label>
      {type !== "textarea" && (
        <input
          type={type}
          id={name}
          {...register(name, { ...validations })}
          aria-describedby={`required-${name}`}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          className={cn(
            "w-full border-b-[1px] border-solid border-baseText bg-transparent px-1 py-2 font-sans text-base tracking-[0.3px] text-baseText outline-none"
          )}
        />
      )}
      {type === "textarea" && (
        <textarea
          id={name}
          rows={1}
          {...register(name, { ...validations })}
          aria-describedby={`required-${name}`}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(e) => {
            void register(name, { ...validations }).onChange(e);
            e.target.style.height = "inherit";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className={cn(
            "w-full border-b-[1px] border-solid border-baseText bg-transparent px-1 py-2 font-sans text-base tracking-[0.3px] text-baseText outline-none",
            "textarea-scrollbar",
            "max-h-24 resize-none"
          )}
        />
      )}

      {error && (
        <p id={`required-${name}`} className="pt-1 text-xs text-error">
          {error?.message}
        </p>
      )}
    </div>
  );
};

export default FormInput;
