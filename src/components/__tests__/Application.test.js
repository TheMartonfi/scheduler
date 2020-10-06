import React from "react";
import {
	render,
	cleanup,
	waitForElement,
	fireEvent,
	getByText,
	getByTestId,
	getAllByTestId,
	getByAltText,
	queryByText,
	queryByAltText,
} from "@testing-library/react";
import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
	it("defaults to Monday and changes the schedule when a new day is selected", async () => {
		const { getByText } = render(<Application />);

		await waitForElement(() => getByText("Monday"));

		fireEvent.click(getByText("Tuesday"));

		expect(getByText("Leopold Silvers")).toBeInTheDocument();
	});

	it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
		const { container } = render(<Application />);
		const studentName = "Lydia Miller-Jones";

		await waitForElement(() => getByText(container, "Archie Cohen"));

		const appointment = getAllByTestId(container, "appointment")[0];

		fireEvent.click(getByAltText(appointment, "Add"));

		fireEvent.change(getByTestId(appointment, "student-name-input"), {
			target: { value: studentName },
		});

		fireEvent.click(getByAltText(appointment, "Tori Malcolm"));

		fireEvent.click(getByText(appointment, "Save"));

		expect(getByText(appointment, "SAVING")).toBeInTheDocument();

		await waitForElement(() => queryByText(appointment, studentName));

		const day = getAllByTestId(container, "day").find(day =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "no spots remaining")).toBeInTheDocument();
	});

	it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
		// 1. Render the Application.
		const { container, debug } = render(<Application />);

		// 2. Wait until the text "Archie Cohen" is displayed.
		await waitForElement(() => getByText(container, "Archie Cohen"));

		// 3. Click the "Delete" button on the booked appointment.
		const appointment = getAllByTestId(container, "appointment")[1];
		fireEvent.click(getByAltText(appointment, "Delete"));

		// 4. Check that the confirmation message is shown.
		expect(
			getByText(appointment, "Are you sure you would like to delete?")
		).toBeInTheDocument();

		// 5. Click the "Confirm" button on the confirmation.
		fireEvent.click(getByText(appointment, "Confirm"));

		// 6. Check that the element with the text "Deleting" is displayed.
		expect(getByText(appointment, "DELETING")).toBeInTheDocument();

		// 7. Wait until the element with the "Add" button is displayed.
		await waitForElement(() => queryByAltText(appointment, "Add"));

		// 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
		const day = getAllByTestId(container, "day").find(day =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
	});

	xit("loads data, edits an interview and keeps the spots remaining for Monday the same", () => {
		render(<Application />);
	});

	xit("shows the save error when failing to save an appointment", () => {
		render(<Application />);
	});

	xit("shows the delete error when failing to delete an existing appointment", () => {
		render(<Application />);
	});
});
