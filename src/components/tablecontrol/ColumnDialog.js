import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { TOGGLE_ALL_COLUMNS } from "../../store/actions";

export default function ColumnDialog({ headings, onColumnCheck }) {
	const dispatch = useDispatch();

	const isCheckingAll = useMemo(() => {
		return Object.values(headings).every((value) => !value.hidden);
	}, [headings]);

	const onColumnCheckAll = () => {
		dispatch({ type: TOGGLE_ALL_COLUMNS, all: !isCheckingAll });
	};

	return (
		<div className="columns-dialog">
			<div className="column-checkall">
				<div className="checkbox-container">
					<span style={{ marginRight: "4px" }}>Select fields:</span>
					<input type="checkbox" checked={isCheckingAll} onChange={onColumnCheckAll} />
					<span>all</span>
				</div>
			</div>
			<div className="column-list">
				{Object.keys(headings).map((key) => {
					return (
						<div key={key} className="checkbox-container">
							<input
								type="checkbox"
								checked={!headings[key].hidden}
								disabled={headings[key].fixed}
								onChange={() => onColumnCheck(key)}
							/>
							<span>{headings[key].title}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
