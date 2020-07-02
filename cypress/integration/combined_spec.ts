/// <reference types="cypress" />

describe("InfiniteList", () => {
  it("shows more rows on scroll", () => {
    cy.visit("/test")
    cy.contains("Row 1")
    cy.get("#parent-ref").scrollTo(0, 400)
    cy.contains("Row 12")
    cy.get("#row-20").should("not.exist")
    cy.get("#parent-ref").scrollTo(0, 800)
    cy.contains("Row 18")
  })
})
