/// <reference types="cypress" />

describe("FixedRow", () => {
  it("shows more rows on scroll", () => {
    cy.visit("/")
    cy.contains("Row 0")
    cy.get("#parent-ref").scrollTo(0, 500)
    cy.contains("Row 10")
    cy.get("#row-11").should("not.exist")
  })
})
