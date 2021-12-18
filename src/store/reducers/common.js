import { reorderArray } from "../../utils";
import {
	APP_LOADED,
	ASYNC_START,
	CHANGE_PAGE,
	DRAG_COLUMN,
	FILTER,
	SORT,
	TOGGLE_ALL_COLUMNS,
	TOGGLE_COLUMN,
	UPDATE_FILTER,
} from "../actions";

const initialState = {
	inProgress: false,
	headings: {
		id: {
			title: "id",
			ref: "id",
			isNumber: true,
			width: 120,
			fixed: true,
			sorter: (a, b) => a.id - b.id,
		},
		sourceId: {
			title: "source id",
			ref: "sourceId",
			width: 150,
			hidden: true,
			sorter: (a, b) => a.sourceId - b.sourceId,
		},
		title: {
			title: "title",
			ref: "title",
			width: 200,
			fixed: true,
			sorter: (a, b) => a.title.localeCompare(b.title),
		},
		issn: {
			title: "issn",
			ref: "issn",
			width: 120,
		},
		categoriesArray: {
			title: "categories",
			ref: "categories",
			width: 150,
			render: (data) => {
				return (
					<div className="tag-list">
						{data.map((item, index) => {
							return (
								<span className="tag" key={index}>
									{item}
								</span>
							);
						})}
					</div>
				);
			},
		},
		areasArray: {
			title: "areas",
			ref: "areas",
			width: 150,
			render: (data) => {
				return (
					<div className="tag-list">
						{data.map((item, index) => {
							return (
								<span className="tag" key={index}>
									{item}
								</span>
							);
						})}
					</div>
				);
			},
		},
		publisher: {
			title: "publisher",
			ref: "publisher",
			width: 200,
		},
		year: {
			title: "year",
			ref: "year",
			isNumber: true,
			width: 120,
			sorter: (a, b) => a.year - b.year,
		},
		country: {
			title: "country",
			ref: "country",
			width: 150,
			hidden: true,
		},
		region: {
			title: "region",
			ref: "region",
			width: 150,
			hidden: true,
		},
		totalDocs: {
			title: "total docs",
			ref: "totalDocs",
			isNumber: true,
			width: 150,
			hidden: true,
			sorter: (a, b) => a.totalDocs - b.totalDocs,
		},
		totalRefs: {
			title: "total refs",
			ref: "totalRefs",
			isNumber: true,
			width: 150,
			hidden: true,
			sorter: (a, b) => a.totalRefs - b.totalRefs,
		},
		impactFactor: {
			title: "impact factor",
			ref: "impactFactor",
			width: 200,
			hidden: true,
		},
		sjrNum: {
			title: "sjr",
			ref: "sjrNum",
			isNumber: true,
			width: 120,
			sorter: (a, b) => a.sjrNum - b.sjrNum,
		},
		sjrBestQuartile: {
			title: "best quartile",
			ref: "sjrBestQuartile",
			width: 180,
			hidden: true,
			sorter: (a, b) =>
				a.sjrBestQuartile.localeCompare(b.sjrBestQuartile),
		},
		rank: {
			title: "rank",
			ref: "rank",
			width: 120,
			fixed: true,
			sorter: (a, b) => a.rank.localeCompare(b.rank),
		},
	},
	sortDirection: 0,
	sortBy: "",
	filter: {},
	page: 1,
	pageSize: 100,
	total: 0,
	data: [],
	initialData: [],
	modelType: "journals",
};

export default function commonReducer(state = initialState, action) {
	switch (action.type) {
		case ASYNC_START:
			switch (action.subtype) {
				case APP_LOADED:
				case CHANGE_PAGE:
				case FILTER:
					return { ...state, inProgress: true };
				default:
					return state;
			}

		case APP_LOADED:
			return {
				...state,
				pager: action.pager,
				data: action.error ? initialState.initialData : action.payload.data,
				initialData: action.error ? initialState.initialData : action.payload.data,
				page: action.error ? initialState.page : action.payload.metaData.page,
				pageSize: action.error ? initialState.pageSize : action.payload.metaData.pageSize,
				total: action.error ? initialState.pageSize : action.payload.metaData.total,
				inProgress: false,
			};

		case DRAG_COLUMN: {
			let updatedHeadings = Object.entries({ ...state.headings });
			const from = updatedHeadings.findIndex(
				([key, value]) => key === action.from
			);
			const to = updatedHeadings.findIndex(
				([key, value]) => key === action.to
			);
			updatedHeadings = reorderArray(updatedHeadings, from, to);
			return { ...state, headings: Object.fromEntries(updatedHeadings) };
		}

		case CHANGE_PAGE:
			return {
				...state,
				data: action.error ? state.data : action.payload.data,
				initialData: action.error ? state.initialData : action.payload.data,
				sortBy: "",
				sortDirection: 0,
				page: action.error ? state.page : action.payload.metaData.page,
				pageSize: action.error ? state.pageSize : action.payload.metaData.pageSize,
				total: action.error ? state.pageSize : action.payload.metaData.total,
				inProgress: false,
			};

		case TOGGLE_COLUMN: {
			let updatedHeadings = { ...state.headings };
			updatedHeadings[action.column].hidden =
				!updatedHeadings[action.column].hidden;
			return {
				...state,
				headings: updatedHeadings,
			};
		}

		case TOGGLE_ALL_COLUMNS: {
			let updatedHeadings = Object.entries({ ...state.headings });
			updatedHeadings = updatedHeadings.map(([key, value]) => [
				key,
				{ ...value, hidden: value.fixed ? value.hidden : !action.all },
			]);
			return {
				...state,
				headings: Object.fromEntries(updatedHeadings),
			};
		}

		case UPDATE_FILTER: {
			let updatedFilter = { ...state.filter };
			if (action.value === undefined) {
				delete updatedFilter[action.key];
			} else {
				updatedFilter[action.key] = action.value;
			}
			return {
				...state,
				filter: updatedFilter,
			};
		}

		case FILTER:
			return {
				...state,
				data: action.error ? state.data : action.payload.data,
				initialData: action.error ? state.initialData : action.payload.data,
				sortBy: "",
				sortDirection: 0,
				page: action.error ? state.page : action.payload.metaData.page,
				pageSize: action.error ? state.pageSize : action.payload.metaData.pageSize,
				total: action.error ? state.pageSize : action.payload.metaData.total,
				inProgress: false,
			};

		case SORT: {
			const sorter = state.headings[action.key].sorter;
			let sortDirection = 0;
			let sortBy = "";
			let data = [...state.initialData];
			if (state.sortBy !== action.key) {
				state.sortDirection = 0;
			}
			switch (state.sortDirection) {
				case 0:
					data.sort(sorter);
					sortBy = action.key;
					sortDirection = 1;
					break;
				case 1:
					data.sort(sorter).reverse();
					sortBy = action.key;
					sortDirection = -1;
					break;
				case -1:
					sortDirection = 0;
					break;
				default:
					break;
			}

			return {
				...state,
				sorter: sorter,
				sortBy,
				sortDirection,
				data,
			};
		}

		default:
			return state;
	}
}
