import { reorderArray } from "../../utils";
import {
	APP_LOADED,
	ASYNC_START,
	CHANGE_PAGE,
	DRAG_COLUMN,
	FILTER,
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
			sorter: () => {}
		},
		sourceId: {
			title: "source id",
			width: 150,
			hidden: true,
			sorter: () => {}
		},
		title: {
			title: "title",
			width: 200,
			fixed: true,
			sorter: () => {}
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
			sorter: () => {}
		},
		country: {
			title: "country",
			width: 150,
			hidden: true
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
			sorter: () => {}
		},
		totalRefs: {
			title: "total refs",
			width: 150,
			hidden: true,
			sorter: () => {}
		},
		impactFactor: {
			title: "impact factor",
			width: 200,
			hidden: true
		},
		sjrNum: {
			title: "sjr",
			width: 120,
			sorter: () => {}
		},
		sjrBestQuartile: {
			title: "best quartile",
			width: 180,
			hidden: true,
			sorter: () => {}
		},
		rank: {
			title: "rank",
			width: 120,
			fixed: true,
			sorter: () => {}
		},
	},
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
				data: action.error ? state.data : action.payload.data,
				...action.payload.metaData,
				inProgress: false,
			};

		default:
			return state;
	}
}
