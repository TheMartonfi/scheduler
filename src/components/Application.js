import React from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import getAppointmentsForDay from "helpers/selectors";

export default function Application(props) {
  
  const setDay = day => setState(prev => ({ ...prev, day }));
  const [state, setState] = React.useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const dailyAppointments = [ ...getAppointmentsForDay(state, state.day), { id: "last", time: "5pm" }];

  React.useEffect(() => {

    const daysPromise = axios.get("api/days");
    const appointmentsPromise = axios.get("api/appointments");
    const interviewersPromise = axios.get("api/interviewers");
    const promises = [daysPromise, appointmentsPromise, interviewersPromise];

    Promise.all(promises)
      .then((all) => {
        setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data }));
      });
  }, []);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
    className="sidebar--centered"
    src="images/logo.png"
    alt="Interview Scheduler"
  />
  <hr className="sidebar__separator sidebar--centered" />
  <nav className="sidebar__menu">
    <DayList
    days={state.days}
    value={state.day}
    onChange={setDay}
    />
  </nav>
  <img
    className="sidebar__lhl sidebar--centered"
    src="images/lhl.png"
    alt="Lighthouse Labs"
  />
      </section>
      <section className="schedule">
        {dailyAppointments.map((appointment) => {
          return <Appointment key={appointment.id} {...appointment} />
        })}
      </section>
    </main>
  );
};