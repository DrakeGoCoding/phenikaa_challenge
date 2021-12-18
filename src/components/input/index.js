import { forwardRef } from "react";
import "./index.css";

const Input = forwardRef((props, ref) => {
	const onKeyUp = (e) => {
		if (e.key === "Enter") {
			props.onEnter();
		}
	};

	return (
		<input
			className="custom-input"
			ref={ref}
			type={props.type}
			value={props.value}
			disabled={props.disabled}
			onChange={(e) => props.onChange(e.target.value)}
			onKeyUp={onKeyUp}
		/>
	);
})

export default Input;
