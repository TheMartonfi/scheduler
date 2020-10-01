export function getAppointmentsForDay(state, day) {

  const appointments = []; 

  state.days.forEach((dayObject) => {
    if (dayObject.name === day) {
      dayObject.appointments.forEach((appointment) => {
        appointments.push(state.appointments[appointment]);
      });
    }
  });

  return appointments;
};