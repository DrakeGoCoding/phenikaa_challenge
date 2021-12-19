import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import Tooltip from "../tooltip";
import Dialog from "../dialog";
import { ReactComponent as ReloadSvg } from "../../assets/reload.svg";
import { ReactComponent as EyeSvg } from "../../assets/eye.svg";
import { FILTER } from "../../store/actions";
import "./index.css";
import ColumnDialog from "./ColumnDialog";
import FilterDialog from "./FilterDialog";

function ExportCSVButton({ data, headers, fileName }) {
	return (
		<CSVLink data={data} headers={headers} filename={fileName}>
			<button className="export-csv-btn base-btn">Export CSV</button>
		</CSVLink>
	);
}

export default function TableControl({ onReload, onColumnCheck }) {
	const dispatch = useDispatch();
	const { data, headings, filter, pager, page, modelType } = useSelector((state) => state.common);
	const [isEyeDialogVisible, setEyeDialogVisible] = useState(false);
	const [isFilterDialogVisible, setFilterDialogVisible] = useState(false);

	const toggleViewsDialog = () => setEyeDialogVisible(!isEyeDialogVisible);
	const toggleFilterDialog = () => setFilterDialogVisible(!isFilterDialogVisible);

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
					content={<FilterDialog headings={headings} filter={filter} onFilter={onFilter} />}
				>
					<button className="base-btn" onClick={toggleFilterDialog}>
						Filter
					</button>
				</Dialog>
				<ExportCSVButton data={exportedData} headers={exportedHeaders} fileName={modelType} />
			</div>
			<div className="right-side">
				<Dialog
					visible={isEyeDialogVisible}
					position="bottom-right"
					content={<ColumnDialog headings={headings} onColumnCheck={onColumnCheck} />}
				>
					<Tooltip content="Views">
						<button className="second-btn" onClick={toggleViewsDialog}>
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
