import { useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { UPDATE_FILTER } from "../../store/actions";
import { ReactComponent as CloseSvg } from "../../assets/close.svg";
import { ReactComponent as LoadingSvg } from "../../assets/loading.svg";
import Select from "../select";
import Input from "../input";

export default function FilterDialog({ headings, filter, onFilter }) {
	const filterTableBodyRef = useRef(null);
	const newFilterInputRef = useRef(null);
	const dispatch = useDispatch();

	const columnOptions = useMemo(() => {
		return Object.keys(headings).map((key) => {
			return {
				title: headings[key].title,
				value: headings[key].ref,
				isNumber: headings[key].isNumber,
			};
		});
	}, [headings]);

	const [newFilter, setNewFilter] = useState({
		key: "id",
		value: "",
	});

	const changeNewFilterKey = (value) => {
		setNewFilter({ ...newFilter, key: value });
	};
	const changeNewFilterValue = (value) => setNewFilter({ ...newFilter, value });

	const updateFilter = (key, value) => {
		dispatch({ type: UPDATE_FILTER, key, value });
	};

	const appendNewFilter = () => {
		if (!newFilter.value) {
			newFilterInputRef.current.focus();
			return;
		}
		updateFilter(newFilter.key, newFilter.value);
		setNewFilter({ key: "id", value: "" });
	};

	const removeFilter = (key) => {
		updateFilter(key, undefined);
	};

	return (
		<div className="filter-dialog">
			<table className="filter-table">
				<thead>
					<tr>
						<th></th>
						<th>COLUMN</th>
						<th>VALUE</th>
					</tr>
				</thead>
				<tbody ref={filterTableBodyRef}>
					{Object.keys(filter).map((key) => {
						return (
							<tr key={key}>
								<td>
									<CloseSvg onClick={() => removeFilter(key)} />
								</td>
								<td>
									<Select options={columnOptions} value={key} disabled={true} />
								</td>
								<td>
									<Input ref={newFilterInputRef} type="text" disabled={true} value={filter[key]} />
								</td>
							</tr>
						);
					})}
					<tr>
						<td>
							<LoadingSvg />
						</td>
						<td>
							<Select value={newFilter.key} options={columnOptions} onChange={changeNewFilterKey} />
						</td>
						<td>
							<Input
								type="text"
								ref={newFilterInputRef}
								value={newFilter.value}
								onChange={changeNewFilterValue}
								onEnter={appendNewFilter}
							/>
						</td>
					</tr>
				</tbody>
			</table>
			<div className="filter-dialog-footer">
				<button className="add-filter-btn text-btn" onClick={appendNewFilter}>
					+ ADD FILTER
				</button>
				<button className="start-filter-btn base-btn" onClick={onFilter}>
					Start
				</button>
			</div>
		</div>
	);
}
