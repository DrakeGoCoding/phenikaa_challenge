import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import Tooltip from "../tooltip";
import Dialog from "../dialog";
import { ReactComponent as ReloadSvg } from "../../assets/reload.svg";
import { ReactComponent as EyeSvg } from "../../assets/eye.svg";
import { ReactComponent as CsvSvg } from "../../assets/csv.svg";
import "./index.css";
import { TOGGLE_ALL_COLUMNS } from "../../store/actions";

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

function ExportCSVButton({ data, headers, fileName }) {
	return (
		<button className="second-btn">
			<CSVLink data={data} headers={headers} filename={fileName}>
				<CsvSvg />
			</CSVLink>
		</button>
	);
}

function TableControl({ onReload, onColumnCheck }) {
	const { data, headings, modelType } = useSelector((state) => state.common);
	const [isEyeDialogVisible, setEyeDialogVisible] = useState(false);

	const toggleEyeBtn = () => setEyeDialogVisible(!isEyeDialogVisible);

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

	return (
		<div className="table-control">
			<div className="left-side"></div>
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
						<button className="second-btn" onClick={toggleEyeBtn}>
							<EyeSvg />
						</button>
					</Tooltip>
				</Dialog>
				<Tooltip content="Export">
					<ExportCSVButton
						data={exportedData}
						headers={exportedHeaders}
						fileName={modelType}
					/>
				</Tooltip>
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
