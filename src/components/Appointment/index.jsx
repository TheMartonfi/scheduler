import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

const Appointment = props => {
	const { mode, transition, back } = useVisualMode(
		props.interview ? SHOW : EMPTY
	);

	// Properly transition interviews when modified by other clients
	React.useEffect(() => {
		if (props.interview && mode === EMPTY) {
			transition(SHOW);
		}
		if (props.interview === null && mode === SHOW) {
			transition(EMPTY);
		}
	}, [props.interview, transition, mode]);

	// Save interview and transition
	const save = (name, interviewer) => {
		const interview = {
			student: name,
			interviewer,
		};

		transition(SAVING);
		props
			.bookInterview(props.id, interview)
			.then(() => {
				transition(SHOW);
			})
			.catch(() => {
				transition(ERROR_SAVE, true);
			});
	};

	// Delete interview and transition
	const destroy = () => {
		transition(DELETING, true);
		props
			.cancelInterview(props.id)
			.then(() => {
				transition(EMPTY);
			})
			.catch(() => {
				transition(ERROR_DELETE, true);
			});
	};

	return (
		<article className="appointment" data-testid="appointment">
			<Header time={props.time} />
			{mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
			{mode === SHOW && props.interview && (
				<Show
					student={props.interview.student}
					interviewer={props.interview.interviewer.name}
					onEdit={() => transition(EDIT)}
					onDelete={() => transition(CONFIRM)}
				/>
			)}
			{mode === CREATE && (
				<Form
					interviewers={props.interviewers}
					onCancel={() => back()}
					onSave={save}
				/>
			)}
			{mode === SAVING && <Status message={SAVING} />}
			{mode === DELETING && <Status message={DELETING} />}
			{mode === CONFIRM && (
				<Confirm
					onCancel={() => back()}
					onConfirm={() => destroy()}
					message={"Are you sure you would like to delete?"}
				/>
			)}
			{mode === EDIT && (
				<Form
					interviewers={props.interviewers}
					name={props.interview.student}
					interviewer={props.interview.interviewer.id}
					onCancel={() => back()}
					onSave={save}
				/>
			)}
			{mode === ERROR_SAVE && (
				<Error onClose={() => back()} message={"Could not book appointment."} />
			)}
			{mode === ERROR_DELETE && (
				<Error
					onClose={() => back()}
					message={"Could not cancel appointment."}
				/>
			)}
		</article>
	);
};

export default Appointment;
