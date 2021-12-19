import { useState } from "react";
import "./index.css";

export default function Tooltip({ content, position = "bottom", children }) {
	const [visible, setVisible] = useState(false);

	const handleMouseOver = () => {
		setVisible(true);
		setTimeout(() => {
			setVisible(false);
		}, 3000);
	};
	const handleMouseLeave = () => setVisible(false);

	return (
		<div className="tooltip" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
			{visible && <div className={`tooltip-content ${position}`}>{content}</div>}
			{children}
		</div>
	);
}
