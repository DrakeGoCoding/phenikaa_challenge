import "./index.css";

export default function Select({ value, options, onChange }) {
	return (
		<select
			className="custom-select"
			onChange={(e) => onChange(e.target.value)}
			value={value}
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
