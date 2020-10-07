// I know this import is uncessary but eslint was screaming at me
import cy from "cypress";

describe("Navigation", () => {
	it("should visit root", () => {
		cy.visit("/");
	});

	it("should navigate to Tuesday", () => {
		cy.visit("/");
		cy.contains("[data-testid=day]", "Tuesday")
			.click()
			.should("have.class", "day-list__item--selected");
	});
});
