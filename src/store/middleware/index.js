import { ASYNC_START } from "../actions";

export const promiseMiddleware = (store) => (next) => (action) => {
	if (isPromise(action.payload)) {
		store.dispatch({ type: ASYNC_START, subtype: action.type });

		action.payload.then(
			(res) => {
				action.payload = res;
				store.dispatch(action);
			},
			(error) => {
				action.error = true;
				action.payload = error.response.data;
				store.dispatch(action);
			}
		);

		return;
	}

	next(action);
};

function isPromise(v) {
	return v && typeof v.then === "function";
}
