import axios from "axios";

const instance = axios.create({
	baseURL: `http://o-research-dev.orlab.com.vn/api/v1`,
	headers: {
		"content-type": "application/json; charset=utf8",
	},
});

instance.interceptors.response.use(
	(res) => {
		if (res && res.data) {
			return res.data;
		}
		return res;
	},
	(error) => {
		throw new Error(error.response.data.message);
	}
);

const agent = {
	fetch: (filter = {}, page = 0, pageSize = 100) =>
		instance.post("/filters/filter/", null, {
			params: {
				modelType: "journals",
				filter,
				page,
				pageSize,
				isPaginateDB: true,
				ignoreAssociation: true,
			},
		}),
};

export default agent;
