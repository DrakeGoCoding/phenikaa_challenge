import classNames from "classnames";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DRAG_COLUMN, SORT } from "../../store/actions";
import { ReactComponent as UpSvg } from "../../assets/up.svg";
import { ReactComponent as DownSvg } from "../../assets/down.svg";

function SorterBtn({ activeUp, activeDown, sortBy, onSort }) {
	return (
		<span className="th-sorter th-utils-btn" onClick={() => onSort(sortBy)}>
			<UpSvg
				className={classNames("th-sorter-up", {
					active: activeUp,
				})}
			/>
			<DownSvg
				className={classNames("th-sorter-down", {
					active: activeDown,
				})}
			/>
		</span>
	);
}

export default function TableHeader({ headings }) {
	const dispatch = useDispatch();
	const { sortBy, sortDirection } = useSelector((state) => state.common);
	const headerRefs = useRef([]);
	const [dragStart, setDragStart] = useState(null);
	const [dragEnd, setDragEnd] = useState(null);

	const onColumnDragStart = (index) => {
		setDragStart(index);
	};

	const onColumnDragEnd = (e) => {
		setDragStart(null);
		setDragEnd(null);
	};

	const onColumnDragOver = (e) => {
		if (e.preventDefault) {
			e.preventDefault();
		}
		return false;
	};

	const onColumnDragEnter = (index) => {
		setDragEnd(index);
	};

	const onColumnDrop = (e) => {
		if (e.preventDefault) {
			e.preventDefault();
		}
		if (e.stopPropagation) {
			e.stopPropagation();
		}

		const from = headerRefs.current[dragStart];
		const to = headerRefs.current[dragEnd];
		if (from && to) {
			dispatch({
				type: DRAG_COLUMN,
				from: from.getAttribute("datatype"),
				to: to.getAttribute("datatype"),
			});
		}
	};

	const onSort = (key) => {
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
											<SorterBtn
												sortBy={key}
												onSort={onSort}
												activeUp={sortBy === key && sortDirection === 1}
												activeDown={sortBy === key && sortDirection === -1}
											/>
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
