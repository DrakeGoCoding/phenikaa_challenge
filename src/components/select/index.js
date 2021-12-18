import "./index.css";

export default function Select({ value, options, disabled, onChange }) {
	return (
		<select
			className="custom-select"
			onChange={(e) => onChange(e.target.value)}
			value={value}
			disabled={disabled}
		>
			{options &&
				options.map((option) => {
					return (
						<option key={option.value} value={option.value}>
							{option.title}
						</option>
					);
				})}
		</select>
	);
}
