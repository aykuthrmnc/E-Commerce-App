import ReactSelect from "react-select/async";

const colourStyles = {
  menu: (base) => ({
    ...base,
    zIndex: 999,
  }),
  control: (styles) => ({
    ...styles,
    height: 46,
  }),
  //   option: (styles, { data, isDisabled, isFocused, isSelected }) => {
  //     return {
  //       ...styles,
  //       backgroundColor: isDisabled ? "red" : "blue",
  //       color: "#FFF",
  //       cursor: isDisabled ? "not-allowed" : "default",
  //     };
  //   },
};

const Select = ({ onChange, options, value, ...props }) => {
  //   const handleChange = (selectedOption) => {
  //     console.log("handleChange => ", selectedOption);
  //   };

  //   const loadOptions = (searchValue, callback) => {
  //     setTimeout(() => {
  //       const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));
  //       console.log("loadOptions => ", searchValue, filteredOptions);
  //       callback(filteredOptions);
  //     }, 2000);
  //   };

  //   const loadOptions = async (inputValue, callback) => {
  //     const response = await axios.get(`/api/admin/roles`)
  //     const result = await response.data
  //     return await result.permissions.map((permission) => ({
  //       label: permission.name,
  //       value: permission.id
  //     }))
  //   };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(console.log(inputValue));
    }, 1000);
  };

  // useEffect(() => {
  //   const timeout = setTimeout(() => {

  //   }, 1000);
  //   return () => clearTimeout(timeout);
  // }, [count]);

  return (
    <ReactSelect
      placeholder="Seçiniz"
      noOptionsMessage={() => "Aranan kelime bulunamadı."}
      onChange={onChange}
      options={options}
      styles={colourStyles}
      isClearable
      props={props}
      cacheOptions
      defaultOptions={options}
      loadOptions={loadOptions}
    />
  );
};

export default Select;
