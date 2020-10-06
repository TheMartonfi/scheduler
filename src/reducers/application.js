const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SPOTS = "SET_SPOTS";

export { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, SET_SPOTS };

export const reducer = (state, action) => {
	switch (action.type) {
		case SET_DAY:
			return { ...state, day: action.day };
		case SET_APPLICATION_DATA:
			return {
				...state,
				days: action.days,
				appointments: action.appointments,
				interviewers: action.interviewers,
			};
		case SET_INTERVIEW:
			return {
				...state,
				appointments: {
					...state.appointments,
					[action.id]: {
						...state.appointments[action.id],
						interview: action.interview,
					},
				},
			};
		case SET_SPOTS:
			return { ...state, days: action.days };
		default:
			throw new Error(
				`Tried to reduce with unsupported action type: ${action.type}`
			);
	}
};
