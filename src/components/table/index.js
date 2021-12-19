import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import Spinner from "../spinner";
import "./index.css";

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
