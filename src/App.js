import { useEffect } from "react";
import agent from "./agent";
import Table from "./components/table";
import { APP_LOADED, CHANGE_PAGE, FILTER, TOGGLE_COLUMN } from "./store/actions";
import store from "./store";
import "./App.css";
import { useSelector } from "react-redux";
import TableControl from "./components/tablecontrol";
import Pagination from "./components/pagination";

function App() {
	const { data, headings, inProgress, pager, filter, total, page, pageSize } = useSelector((state) => state.common);

	const onLoad = () => {
		const pager = (filter, page, pageSize, modelType) => agent.fetch(filter, page, pageSize, modelType);
		store.dispatch({
			type: APP_LOADED,
			pager,
			payload: agent.fetch(),
		});
	};
	const onReload = () => {
		store.dispatch({
			type: FILTER,
			filter,
			payload: pager(filter, page),
		});
	};
	const onColumnCheck = (key) => {
		store.dispatch({
			type: TOGGLE_COLUMN,
			column: key,
		});
	};
	const onPageChange = (page) => {
		store.dispatch({
			type: CHANGE_PAGE,
			payload: pager(filter, page, pageSize),
		});
	};

	useEffect(() => {
		onLoad();
	}, []);

	return (
		<div className="app">
			<TableControl onReload={onReload} onColumnCheck={onColumnCheck} />
			<Table data={data} headings={headings} inProgress={inProgress} />
			{data && data.length > 0 ? (
				<Pagination
					className="pagination-bar"
					currentPage={page}
					pageSize={pageSize}
					total={total}
					onPageChange={onPageChange}
				/>
			) : null}
		</div>
	);
}

export default App;
