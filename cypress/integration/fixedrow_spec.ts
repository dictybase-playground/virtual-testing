/// <reference types="cypress" />

describe("FixedRow", () => {
  it("shows more rows on scroll", () => {
    cy.visit("/")
    cy.contains("Row 1")
    cy.get("#parent-ref").scrollTo(0, 500)
    cy.contains("Row 10")
    cy.get("#row-12").should("not.exist")
  })
})
