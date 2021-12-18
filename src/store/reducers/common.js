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
} from "../actions";

const initialState = {
	inProgress: false,
	headings: {
		id: {
			title: "id",
			width: 120,
			fixed: true,
			sorter: (a, b) => a.id - b.id
		},
		sourceId: {
			title: "source id",
			width: 150,
			hidden: true,
			sorter: (a, b) => a.sourceId - b.sourceId,
		},
		title: {
			title: "title",
			width: 200,
			fixed: true,
			sorter: (a, b) => a.title.localeCompare(b.title),
		},
		issn: {
			title: "issn",
			width: 120,
		},
		categoriesArray: {
			title: "categories",
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
			width: 200,
		},
		year: {
			title: "year",
			width: 120,
			sorter: (a, b) => a.year - b.year,
		},
		country: {
			title: "country",
			width: 150,
			hidden: true,
		},
		region: {
			title: "region",
			width: 150,
			hidden: true,
		},
		totalDocs: {
			title: "total docs",
			width: 150,
			hidden: true,
			sorter: (a, b) => a.totalDocs - b.totalDocs,
		},
		totalRefs: {
			title: "total refs",
			width: 150,
			hidden: true,
			sorter: (a, b) => a.totalRefs - b.totalRefs,
		},
		impactFactor: {
			title: "impact factor",
			width: 200,
			hidden: true,
		},
		sjrNum: {
			title: "sjr",
			width: 120,
			sorter: (a, b) => a.sjrNum - b.sjrNum,
		},
		sjrBestQuartile: {
			title: "best quartile",
			width: 180,
			hidden: true,
			sorter: (a, b) =>
				a.sjrBestQuartile.localeCompare(b.sjrBestQuartile),
		},
		rank: {
			title: "rank",
			width: 120,
			fixed: true,
			sorter: (a, b) => a.rank.localeCompare(b.rank),
		},
	},
	sortDirection: 0,
	sortBy: "",
	data: [],
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
				filter: {},
				data: action.payload.data,
				initialData: action.payload.data,
				...action.payload.metaData,
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
				data: action.payload.data,
				initialData: action.payload.data,
				sortBy: "",
				sortDirection: 0,
				...action.payload.metaData,
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

		case FILTER:
			return {
				...state,
				filter: action.filter,
				data: action.payload.data,
				initialData: action.payload.data,
				sortBy: "",
				sortDirection: 0,
				...action.payload.metaData,
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
