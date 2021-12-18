import classNames from "classnames";
import { DOTS, usePagination } from "../../hooks/usePagination";
import { ReactComponent as NextSvg } from "../../assets/next.svg";
import { ReactComponent as PrevSvg } from "../../assets/prev.svg";
import "./index.css";

export default function Pagination({
	onPageChange,
	total,
	siblingCount = 1,
	currentPage,
	pageSize,
	className,
}) {
	const paginationRange = usePagination({
		currentPage,
		total,
		siblingCount,
		pageSize,
	});

	if (currentPage === 0 || paginationRange.length < 2) {
		return null;
	}

	const onNext = () => {
		onPageChange(currentPage + 1);
	};

	const onPrevious = () => {
		onPageChange(currentPage - 1);
	};

	let lastPage = paginationRange[paginationRange.length - 1];
	return (
		<ul
			className={classNames("pagination-container", {
				[className]: className,
			})}
		>
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
		</ul>
	);
}
