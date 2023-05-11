import Select from 'react-select';

export default function FilterSelect({
  onChange,
  options,
  value,
  name,
  label,
  className = '',
}) {
  const defaultValue = (options, value) => {
    return options ? options.find((option) => option.value === value) : '';
  };

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Select
        className={className}
        name={name}
        value={defaultValue(options, value)}
        onChange={(value) => {
          console.log('select value: ' + JSON.stringify(value));
          onChange(value);
        }}
        options={options}
      />
    </div>
  );
}

// Usage
{
  /* <FilterSelect
name="package"
label="Select package"
value={'value'}
// options={[
//   { value: 'one', label: 'One' },
//   { value: 'two', label: 'Two' },
//   { value: 'three', label: 'Three' },
// ]}
options={packageList}
onChange={(option) => {
  setFieldTouched('package', true);
  setFieldValue('package', option.value);
}}
/> */
}
