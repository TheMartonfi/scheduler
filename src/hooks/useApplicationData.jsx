import React from "react";
import axios from "axios";

const useApplicationData = () => {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_SPOTS = "SET_SPOTS";

  const initialState = {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value }
      case SET_APPLICATION_DATA:
        return { ...state, ...action.value }
      case SET_INTERVIEW:
        return { ...state, appointments: action.value }
      case SET_SPOTS:
        return { ...state, days: action.value }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  const setSpots = (id, add) => {

    let days = state.days.map((day) => {

      if (day.appointments.includes(id)) {
        add ? day.spots = day.spots + 1 : day.spots = day.spots - 1;
      }

      return day;
    });

    dispatch({ type: SET_SPOTS, value: days })
  };

  const bookInterview = (id, interview) => {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: appointments });
        // If the interview is not booked remove spot
        !state.appointments[id].interview && setSpots(id, false);
      });
  };

  const cancelInterview = (id) => {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: appointments });
        setSpots(id, true);
      });
  };

  React.useEffect(() => {

    const daysPromise = axios.get("/api/days");
    const appointmentsPromise = axios.get("/api/appointments");
    const interviewersPromise = axios.get("/api/interviewers");
    const promises = [daysPromise, appointmentsPromise, interviewersPromise];

    Promise.all(promises)
      .then((all) => {
        dispatch({
          type: SET_APPLICATION_DATA,
          value: { days: all[0].data, appointments: all[1].data, interviewers: all[2].data }
        });
      });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;