import "./index.css";

export default function Dialog({
	visible,
	content,
	position = "bottom",
	children,
}) {
	return (
		<div className="dialog">
			{visible && (
				<div className={`dialog-content ${position}`}>{content}</div>
			)}
			{children}
		</div>
	);
}
