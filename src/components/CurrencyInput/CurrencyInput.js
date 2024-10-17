import React, { useEffect, useState } from "react";

export const CurrencyInput = ({ className, disabled, onChange, value: externalValue }) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    setDisplayValue(externalValue.toString());
  }, [externalValue]);

  const handleChange = (event) => {
    const val = event.target.value;

    if (val === "") {
      setDisplayValue("");
      onChange && onChange("");
      return;
    }

    // Replace local decimal separator with "."
    const standardizedValue = val.replace(/[,،⸲⸴⹁⹉、︐︑﹐﹑，､.·٫ ]/gi, ".");

    // Validate the number
    const isValidNumber = /^[0-9]*[.]?[0-9]*$/.test(standardizedValue);
    const isLengthValid = standardizedValue.length <= 20;

    if (isValidNumber && isLengthValid) {
      setDisplayValue(val);
      if (standardizedValue === ".") {
        onChange && onChange(0);
      } else {
        const decimalValue = parseFloat(standardizedValue);
        onChange && onChange(decimalValue);
      }
    }
  };

  return (
    <input
      className={className}
      disabled={disabled}
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder="0"
    />
  );
};
