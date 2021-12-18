import "./index.css";

export default function Input({ type, value, onChange }) {
	return (
		<input
			className="custom-input"
			type={type}
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}
