import { useDispatch, useSelector } from "react-redux";
import { useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import Tooltip from "../tooltip";
import Dialog from "../dialog";
import Select from "../select";
import Input from "../input";
import { ReactComponent as ReloadSvg } from "../../assets/reload.svg";
import { ReactComponent as EyeSvg } from "../../assets/eye.svg";
import { ReactComponent as CloseSvg } from "../../assets/close.svg";
import { ReactComponent as LoadingSvg } from "../../assets/loading.svg";
import { FILTER, TOGGLE_ALL_COLUMNS, UPDATE_FILTER } from "../../store/actions";
import "./index.css";

function ColumnDialog({ headings, onColumnCheck }) {
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
					<input
						type="checkbox"
						checked={isCheckingAll}
						onChange={onColumnCheckAll}
					/>
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

function FilterDialog({ headings, filter, onFilter }) {
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
	const changeNewFilterValue = (value) =>
		setNewFilter({ ...newFilter, value });

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
									<CloseSvg
										onClick={() => removeFilter(key)}
									/>
								</td>
								<td>
									<Select
										options={columnOptions}
										value={key}
										disabled={true}
									/>
								</td>
								<td>
									<Input
										ref={newFilterInputRef}
										type="text"
										disabled={true}
										value={filter[key]}
									/>
								</td>
							</tr>
						);
					})}
					<tr>
						<td>
							<LoadingSvg />
						</td>
						<td>
							<Select
								value={newFilter.key}
								options={columnOptions}
								onChange={changeNewFilterKey}
							/>
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
				<button
					className="add-filter-btn text-btn"
					onClick={appendNewFilter}
				>
					+ ADD FILTER
				</button>
				<button
					className="start-filter-btn base-btn"
					onClick={onFilter}
				>
					Start
				</button>
			</div>
		</div>
	);
}

function ExportCSVButton({ data, headers, fileName }) {
	return (
		<CSVLink data={data} headers={headers} filename={fileName}>
			<button className="export-csv-btn base-btn">Export CSV</button>
		</CSVLink>
	);
}

function TableControl({ onReload, onColumnCheck }) {
	const dispatch = useDispatch();
	const { data, headings, filter, pager, page, modelType } = useSelector(
		(state) => state.common
	);
	const [isEyeDialogVisible, setEyeDialogVisible] = useState(false);
	const [isFilterDialogVisible, setFilterDialogVisible] = useState(false);

	const toggleViewsDialog = () => setEyeDialogVisible(!isEyeDialogVisible);
	const toggleFilterDialog = () =>
		setFilterDialogVisible(!isFilterDialogVisible);

	const exportedData = useMemo(() => {
		return data.map((item) => {
			const exportedItem = {};
			const itemKeys = Object.keys(item);
			itemKeys.forEach((key) => {
				if (headings[key] && !headings[key].hidden) {
					exportedItem[key] = item[key];
				}
			});
			return exportedItem;
		});
	}, [data, headings]);

	const exportedHeaders = useMemo(() => {
		const exportHeader = [];
		Object.keys(headings).forEach((key) => {
			if (headings[key] && !headings[key].hidden) {
				exportHeader.push({
					label: headings[key].title,
					key,
				});
			}
		});
		return exportHeader;
	}, [headings]);

	const onFilter = () => {
		const mutatedFilter = { ...filter };
		Object.values(headings).forEach((value) => {
			if (mutatedFilter[value.ref] && value.isNumber) {
				mutatedFilter[value.ref] = Number(mutatedFilter[value.ref]) || 0;
			}
		});
		dispatch({
			type: FILTER,
			payload: pager(mutatedFilter, page),
		});
	};

	return (
		<div className="table-control">
			<div className="left-side">
				<Dialog
					visible={isFilterDialogVisible}
					position="bottom-left"
					content={
						<FilterDialog
							headings={headings}
							filter={filter}
							onFilter={onFilter}
						/>
					}
				>
					<button className="base-btn" onClick={toggleFilterDialog}>
						Filter
					</button>
				</Dialog>
				<ExportCSVButton
					data={exportedData}
					headers={exportedHeaders}
					fileName={modelType}
				/>
			</div>
			<div className="right-side">
				<Dialog
					visible={isEyeDialogVisible}
					position="bottom-right"
					content={
						<ColumnDialog
							headings={headings}
							onColumnCheck={onColumnCheck}
						/>
					}
				>
					<Tooltip content="Views">
						<button
							className="second-btn"
							onClick={toggleViewsDialog}
						>
							<EyeSvg />
						</button>
					</Tooltip>
				</Dialog>
				<Tooltip content="Reload">
					<button className="second-btn" onClick={onReload}>
						<ReloadSvg />
					</button>
				</Tooltip>
			</div>
		</div>
	);
}

export default TableControl;
