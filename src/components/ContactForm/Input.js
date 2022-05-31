import { useState } from "react";
import { ErrorMessage } from "@hookform/error-message";

const Input = ({
  placeholder,
  name,
  type,
  validations,
  register,
  errors,
  getValues,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <div
      className={
        isFocus || getValues(name).length > 0
          ? "contact__input-container --focused"
          : "contact__input-container"
      }
    >
      <label htmlFor={name}>{placeholder}</label>
      {type.toLowerCase() !== "textarea" && (
        <input
          type={type}
          id={name}
          name={name}
          {...register(name, { ...validations })}
          aria-describedby={`required-${name}`}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
      )}
      {type.toLowerCase() === "textarea" && (
        <textarea
          id={name}
          name={name}
          rows={1}
          {...register(name, {
            ...validations,
          })}
          aria-describedby={`required-${name}`}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
      )}
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p id={`required-${name}`} className="contact__error-msg">
            {message}
          </p>
        )}
      />
    </div>
  );
};

export default Input;
