import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { DRAG_COLUMN, SORT } from "../../store/actions";
import Spinner from "../spinner";
import { ReactComponent as UpSvg } from "../../assets/up.svg";
import { ReactComponent as DownSvg } from "../../assets/down.svg";
import "./index.css";

function TableHeader({ headings }) {
	const dispatch = useDispatch();
	const { sortBy, sortDirection } = useSelector((state) => state.common);
	const headerRefs = useRef([]);

	const onColumnDragStart = (index) => {
		headerRefs.current[index].classList.add("from");
	};

	const onColumnDragEnd = (e) => {
		headerRefs.current.forEach((col) => {
			if (col) {
				col.classList.remove("from");
				col.classList.remove("to");
			}
		});
	};

	const onColumnDragOver = (e) => {
		if (e.preventDefault) {
			e.preventDefault();
		}
		return false;
	};

	const onColumnDragEnter = (index) => {
		headerRefs.current[index].classList.add("to");
	};

	const onColumnDragLeave = (index) => {
		headerRefs.current[index].classList.remove("to");
	};

	const onColumnDrop = (e) => {
		if (e.preventDefault) {
			e.preventDefault();
		}
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		const from = headerRefs.current.find(
			(col) => col && col.classList.contains("from")
		);
		const to = headerRefs.current.find(
			(col) => col && col.classList.contains("to")
		);
		if (from && to) {
			dispatch({
				type: DRAG_COLUMN,
				from: from.getAttribute("datatype"),
				to: to.getAttribute("datatype"),
			});
		}
	};

	const onSortBy = (key) => {
		dispatch({ type: SORT, key });
	};

	return (
		<thead>
			<tr>
				{Object.keys(headings).map((key, index) => {
					const { hidden, width, title, sorter } = headings[key];
					return (
						!hidden && (
							<th
								key={key}
								draggable
								onDragStart={() => onColumnDragStart(index)}
								onDragEnter={() => onColumnDragEnter(index)}
								onDragLeave={() => onColumnDragLeave(index)}
								onDragOver={onColumnDragOver}
								onDragEnd={onColumnDragEnd}
								onDrop={onColumnDrop}
								datatype={key}
								ref={(el) => (headerRefs.current[index] = el)}
								style={{
									width: `${width}px`,
									minWidth: `${width}px`,
								}}
							>
								<div className="th-content">
									<div className="th-title">
										<span>{title}</span>
										{sorter && (
											<span
												className="th-sorter th-utils-btn"
												onClick={() => onSortBy(key)}
											>
												<UpSvg
													className={classNames(
														"th-sorter-up",
														{
															active:
																sortBy ===
																	key &&
																sortDirection ===
																	1,
														}
													)}
												/>
												<DownSvg
													className={classNames(
														"th-sorter-down",
														{
															active:
																sortBy ===
																	key &&
																sortDirection ===
																	-1,
														}
													)}
												/>
											</span>
										)}
									</div>
								</div>
							</th>
						)
					);
				})}
			</tr>
		</thead>
	);
}

function TableBody({ headings, data }) {
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

export default function Table({ data, headings, inProgress }) {
	return (
		<div className="table-wrapper">
			{inProgress ? <Spinner /> : null}
			{!headings || headings.length === 0 ? null : (
				<table>
					<TableHeader headings={headings} />
					<TableBody headings={headings} data={data} />
				</table>
			)}
			{data && data.length > 0 ? null : (
				<div className="table-empty">
					<span className="message">No data available in table</span>
				</div>
			)}
		</div>
	);
}
