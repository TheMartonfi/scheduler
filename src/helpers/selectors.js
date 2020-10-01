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

export function getInterview(state, interview) {
  
  return interview ? { ...interview, interviewer: state.interviewers[String(interview.interviewer)] } : null;
};

export function getInterviewersForDay(state, day) {
  
  const interviewers = []; 

  state.days.forEach((dayObject) => {
    if (dayObject.name === day) {
      dayObject.interviewers.forEach((interviewer) => {
        interviewers.push(state.interviewers[interviewer]);
      });
    }
  });

  return interviewers;

};

