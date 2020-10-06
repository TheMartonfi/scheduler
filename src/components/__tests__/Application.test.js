import React from "react";
import {
	render,
	cleanup,
	waitForElement,
	fireEvent,
	getByText,
	prettyDOM,
	getByTestId,
	getAllByTestId,
	getByAltText,
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

		console.log(prettyDOM(appointment));
	});
});
