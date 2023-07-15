import ReactSelect from "react-select";

const style = {
  control: (base, { isFocused }) => ({
    ...base,
    height: 46,
    fontSize: "14px",
    // border: isFocused ? undefined : "1px solid #ced4da",
    // "&:active": {
    //   borderColor: "#ced4da",
    // },
    boxShadow: "none",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 98,
    fontSize: "14px",
  }),
  // option: (styles, { isDisabled, isFocused, isSelected }) => {
  //   return {
  //     ...styles,
  //     backgroundColor: isDisabled ? "" : isSelected ? "#ed5f1f" : isFocused ? "#ed5f1f66" : undefined,
  //     color: isDisabled ? "#ccc" : isSelected ? "#fff" : isFocused ? "#000" : undefined,
  //     cursor: isDisabled ? "not-allowed" : "default",
  //     ":active": {
  //       ...styles[":active"],
  //       backgroundColor: !isDisabled ? (isSelected ? undefined : "#ed5f1f") : undefined,
  //       color: "#fff",
  //     },
  //   };
  // },
};

const FormikSelect = ({ name, options, field, form, ...props }) => {

  return (
    <ReactSelect
      classNamePrefix="react-select"
      placeholder="Seçiniz..."
      noOptionsMessage={() => "Bulunamadı"}
      styles={style}
      value={options?.find((option) => option.value == field.value) || ""}
      options={options}
      onChange={(value) => form.setFieldValue(field.name, value?.value || "")}
      isClearable
      {...props}
    />
  );
};

export default FormikSelect;
