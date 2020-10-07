import React from "react";
import axios from "axios";
import {
	reducer,
	SET_DAY,
	SET_APPLICATION_DATA,
	SET_INTERVIEW,
	SET_SPOTS,
} from "../reducers/application";

const useApplicationData = () => {
	const initialState = {
		day: "Monday",
		days: [],
		appointments: {},
		interviewers: {},
	};

	const [state, dispatch] = React.useReducer(reducer, initialState);
	const setDay = day => dispatch({ type: SET_DAY, day });

	const bookInterview = (id, interview) => {
		const appointment = {
			...state.appointments[id],
			interview: { ...interview },
		};

		return axios.put(`/api/appointments/${id}`, appointment).then(() => {
			// This extra dispatch is only here for the tests to pass
			// The websocket does the same thing
			dispatch({ type: SET_INTERVIEW, id, interview: { ...interview } });
		});
	};

	const cancelInterview = id => {
		const appointment = {
			...state.appointments[id],
			interview: null,
		};

		return axios.delete(`/api/appointments/${id}`, appointment).then(() => {
			// This extra dispatch is only here for the tests to pass
			// The websocket does the same thing
			dispatch({ type: SET_INTERVIEW, id, interview: null });
		});
	};

	// Get application data from api
	React.useEffect(() => {
		const daysPromise = axios.get("/api/days");
		const appointmentsPromise = axios.get("/api/appointments");
		const interviewersPromise = axios.get("/api/interviewers");
		const promises = [daysPromise, appointmentsPromise, interviewersPromise];

		Promise.all(promises).then(all => {
			const days = all[0].data;
			const appointments = all[1].data;
			const interviewers = all[2].data;

			dispatch({
				type: SET_APPLICATION_DATA,
				days,
				appointments,
				interviewers,
			});
		});
	}, []);

	// Websocket connection that listens for interview changes
	React.useEffect(() => {
		const webSocket = new WebSocket(
			process.env.REACT_APP_WEBSOCKET_URL ||
				"ws://themartonfi-scheduler-api.herokuapp.com"
		);

		webSocket.onmessage = event => {
			const data = JSON.parse(event.data);
			const id = data.id;
			const interview = data.interview;

			if (data.type === SET_INTERVIEW) {
				if (interview) {
					dispatch({ type: SET_INTERVIEW, id, interview: { ...interview } });
				} else {
					dispatch({ type: SET_INTERVIEW, id, interview: null });
				}
			}
		};

		return () => {
			webSocket.close();
		};
	}, []);

	// Update spots when appointments change
	React.useEffect(() => {
		let days = state.days.map(day => {
			let spots = 0;

			day.appointments.forEach(appointment => {
				if (!state.appointments[appointment].interview) {
					spots++;
				}
			});

			return { ...day, spots };
		});

		dispatch({ type: SET_SPOTS, days });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.appointments]);

	return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
