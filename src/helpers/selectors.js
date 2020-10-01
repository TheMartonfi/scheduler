export function getAppointmentsForDay(state, day) {

  const appointments = []; 
  let appointmentsId;

  state.days.forEach((dayObject) => {
    if (dayObject.name === day) {
      appointmentsId = dayObject.appointments
    }
  });

  appointmentsId && appointmentsId.forEach((appointmentId) => {
    appointments.push(state.appointments[appointmentId]);
  });


  return appointments;
};