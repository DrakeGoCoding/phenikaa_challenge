import { useEffect, useState } from "react";
import agent from "./agent";
import "./App.css";
import Table from "./Table";

function App() {
	const [data, setData] = useState(null);
	const [metaData, setMetaData] = useState({
		page: undefined,
		pageSize: undefined,
		total: undefined,
	});

	const fetchData = async () => {
		try {
			const res = await agent.fetch();
			const { data, metaData } = res;
			setData(data);
			setMetaData(metaData);
		} catch (error) {
			alert(error.message);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="App">
			<Table data={data} metaData={metaData} />
		</div>
	);
}

export default App;
