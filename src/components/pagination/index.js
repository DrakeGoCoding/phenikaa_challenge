import classNames from "classnames";
import { DOTS, usePagination } from "../../hooks/usePagination";
import { ReactComponent as NextSvg } from "../../assets/next.svg";
import { ReactComponent as PrevSvg } from "../../assets/prev.svg";
import "./index.css";

function Pagination({ onPageChange, onPageSizeChange, total, siblingCount = 1, currentPage, pageSize }) {
	const paginationRange = usePagination({
		currentPage,
		total,
		siblingCount,
		pageSize,
	});

	if (currentPage === 0 || paginationRange.length < 2) {
		return null;
	}

	const lastPage = paginationRange[paginationRange.length - 1];
	const onNext = () => onPageChange(currentPage + 1);
	const onPrevious = () => onPageChange(currentPage - 1);

	return (
		<ul className="pagination-container">
			<li
				className={classNames("pagination-item", {
					disabled: currentPage === 1,
				})}
				onClick={onPrevious}
			>
				<PrevSvg />
			</li>
			{paginationRange.map((pageNumber, index) => {
				if (pageNumber === DOTS) {
					return (
						<li key={index} className="pagination-item dots">
							{DOTS}
						</li>
					);
				}

				return (
					<li
						key={index}
						className={classNames("pagination-item", {
							selected: pageNumber === currentPage,
						})}
						onClick={() => onPageChange(pageNumber)}
					>
						{pageNumber}
					</li>
				);
			})}
			<li
				className={classNames("pagination-item", {
					disabled: currentPage === lastPage,
				})}
				onClick={onNext}
			>
				<NextSvg />
			</li>
			<li>
				<select
					className="pagination-item pagination-options"
					value={pageSize}
					onChange={(e) => onPageSizeChange(e.target.value)}
				>
					<option value={10}>10/page</option>
					<option value={20}>20/page</option>
					<option value={50}>50/page</option>
					<option value={100}>100/page</option>
				</select>
			</li>
		</ul>
	);
}

export default Pagination;
