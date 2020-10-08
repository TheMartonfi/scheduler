import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import Form from "components/Appointment/Form";

afterEach(cleanup);

describe("Form", () => {
	const interviewers = [
		{
			id: 1,
			name: "Sylvia Palmer",
			avatar: "https://i.imgur.com/LpaY82x.png",
		},
	];

	it("renders without student name if not provided", () => {
		const { getByPlaceholderText } = render(
			<Form interviewers={interviewers} />
		);

		expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
	});

	it("renders with initial student name", () => {
		const studentName = "Lydia Miller-Jones";
		const { getByTestId } = render(
			<Form interviewers={interviewers} name={studentName} />
		);

		expect(getByTestId("student-name-input")).toHaveValue(studentName);
	});

	it("validates that the student name is not blank", () => {
		const onSave = jest.fn();
		const { getByText } = render(
			<Form interviewers={interviewers} onSave={onSave} />
		);

		fireEvent.click(getByText("Save"));

		expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
		expect(onSave).not.toHaveBeenCalled();
	});

	it("validates that the student name is not blank", () => {
		const onSave = jest.fn();
		const { getByText } = render(
			<Form interviewers={interviewers} onSave={onSave} />
		);

		fireEvent.click(getByText("Save"));

		expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
		expect(onSave).not.toHaveBeenCalled();
	});

	it("can successfully save after trying to submit an empty student name", () => {
		const onSave = jest.fn();
		const {
			getByText,
			getByPlaceholderText,
			queryByText,
			getByAltText,
		} = render(<Form interviewers={interviewers} onSave={onSave} />);

		fireEvent.click(getByText("Save"));

		expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
		expect(onSave).not.toHaveBeenCalled();

		fireEvent.change(getByPlaceholderText("Enter Student Name"), {
			target: { value: "Lydia Miller-Jones" },
		});

		fireEvent.click(getByAltText("Sylvia Palmer"));
		fireEvent.click(getByText("Save"));

		expect(queryByText(/student name cannot be blank/i)).toBeNull();

		expect(onSave).toHaveBeenCalledTimes(1);
		expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
	});

	it("calls onCancel and resets the input field", () => {
		const studentName = "Lydia Mill-Jones";
		const onCancel = jest.fn();
		const { getByText, getByPlaceholderText, queryByText } = render(
			<Form
				interviewers={interviewers}
				name={studentName}
				onSave={jest.fn()}
				onCancel={onCancel}
			/>
		);

		fireEvent.click(getByText("Save"));

		fireEvent.change(getByPlaceholderText("Enter Student Name"), {
			target: { value: studentName },
		});

		fireEvent.click(getByText("Cancel"));

		expect(queryByText(/student name cannot be blank/i)).toBeNull();
		expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
		expect(onCancel).toHaveBeenCalledTimes(1);
	});
});
