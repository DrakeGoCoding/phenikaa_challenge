export default function TableBody({ headings, data }) {
	if (!data || data.length === 0) return null;
	return (
		<tbody>
			{data.map((item) => {
				return (
					<tr key={item.id}>
						{Object.keys(headings).map((key) => {
							const { hidden, width, render } = headings[key];
							return hidden ? null : (
								<td
									key={`${item.id}-${key}`}
									style={{
										width: `${width}px`,
										minWidth: `${width}px`,
									}}
								>
									{render ? render(item[key]) : item[key]}
								</td>
							);
						})}
					</tr>
				);
			})}
		</tbody>
	);
}
