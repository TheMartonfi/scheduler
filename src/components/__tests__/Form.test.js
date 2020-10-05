import React from "react";
import { render, cleanup, fireEvent, prettyDOM } from "@testing-library/react";
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

  it("calls onSave function when the name is defined", () => {
    const studentName = "Lydia Miller-Jones";
    const onSave = jest.fn();
    const { queryByText, getByText } = render(
      <Form interviewers={interviewers} name={studentName} onSave={onSave} />
    );

    console.log(prettyDOM(getByText("Save")));
    fireEvent.click(getByText("Save"));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(studentName, null);
  });
});
