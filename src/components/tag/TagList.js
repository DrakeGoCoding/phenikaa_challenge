import Tag from ".";

export default function TagList({ data }) {
	return (
		<div className="tag-list">
			{data.map((item, index) => (
				<Tag key={index} content={item} />
			))}
		</div>
	);
}
