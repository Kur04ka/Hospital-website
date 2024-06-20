import React from "react";
import { MuiTelInput } from "mui-tel-input";

const PhoneNumber = () => {
	const [value, setValue] = React.useState("");

	const handleChange = (newValue: any) => {
		setValue(newValue);
	};

	return (
		<MuiTelInput
			label="Телефон"
			required
			fullWidth
			value={value}
			onChange={handleChange}
		/>
	);
};

export default PhoneNumber;
