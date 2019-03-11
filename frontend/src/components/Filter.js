import React from "react";

const Filter = props => {
  const {
    instruction,
    options,
    seeAllOptions,
    selected,
    onChange,
    className
  } = props;
  return (
    <select
      className={className}
      value={selected}
      onChange={e => onChange(e.target.value)}
    >
      <option value={seeAllOptions}>{instruction}</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Filter;
