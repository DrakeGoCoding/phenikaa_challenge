import "./index.css";

export default function Input({ type, value, disabled, onChange }) {
	return (
		<input
			className="custom-input"
			type={type}
			value={value}
			disabled={disabled}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}
