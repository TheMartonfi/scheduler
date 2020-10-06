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
import axios from "__mocks__/axios";

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
		const { container } = render(<Application />);

		await waitForElement(() => getByText(container, "Archie Cohen"));

		const appointment = getAllByTestId(
			container,
			"appointment"
		).find(appointment => queryByText(appointment, "Archie Cohen"));

		fireEvent.click(getByAltText(appointment, "Delete"));

		expect(
			getByText(appointment, "Are you sure you would like to delete?")
		).toBeInTheDocument();

		fireEvent.click(getByText(appointment, "Confirm"));

		expect(getByText(appointment, "DELETING")).toBeInTheDocument();

		await waitForElement(() => queryByAltText(appointment, "Add"));

		const day = getAllByTestId(container, "day").find(day =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
	});

	it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
		const { container } = render(<Application />);
		const studentName = "Lydia Miller-Jones";

		await waitForElement(() => getByText(container, "Archie Cohen"));

		const appointment = getAllByTestId(
			container,
			"appointment"
		).find(appointment => queryByText(appointment, "Archie Cohen"));

		fireEvent.click(getByAltText(appointment, "Edit"));

		expect(getByTestId(appointment, "student-name-input")).toBeInTheDocument();

		fireEvent.change(getByTestId(appointment, "student-name-input"), {
			target: { value: studentName },
		});

		fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

		fireEvent.click(getByText(appointment, "Save"));

		expect(getByText(appointment, "SAVING")).toBeInTheDocument();

		await waitForElement(() => queryByText(appointment, studentName));

		expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

		const day = getAllByTestId(container, "day").find(day =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
	});

	it("shows the save error when failing to save an appointment", async () => {
		axios.put.mockRejectedValueOnce();

		const { container, debug } = render(<Application />);
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

		await waitForElement(() =>
			queryByText(appointment, "Could not book appointment.")
		);
	});

	it("shows the delete error when failing to delete an existing appointment", async () => {
		axios.delete.mockRejectedValueOnce();

		const { container } = render(<Application />);

		await waitForElement(() => getByText(container, "Archie Cohen"));

		const appointment = getAllByTestId(
			container,
			"appointment"
		).find(appointment => queryByText(appointment, "Archie Cohen"));

		fireEvent.click(getByAltText(appointment, "Delete"));

		expect(
			getByText(appointment, "Are you sure you would like to delete?")
		).toBeInTheDocument();

		fireEvent.click(getByText(appointment, "Confirm"));

		expect(getByText(appointment, "DELETING")).toBeInTheDocument();

		await waitForElement(() =>
			queryByText(appointment, "Could not cancel appointment.")
		);
	});
});
