/// <reference types="cypress" />

describe("IntersectingList", () => {
  it("shows more rows on scroll", () => {
    cy.visit("/")
    cy.contains("Use Intersecting").click()
    cy.contains("DBS0351367")
    cy.get("#parent-ref").scrollTo(0, 500)
    cy.contains("DBS0351356")
    cy.get("#row-20").should("not.exist")
  })
})
