/// <reference types="cypress" />

describe("IntersectingPhenotypeList", () => {
  it("shows more rows on scroll", () => {
    cy.visit("/")
    cy.contains("Use Intersecting (Phenotype)").click()
    cy.contains("DBS0350576")
    cy.get("#parent-ref").scrollTo(0, 500)
    cy.contains("DBS0349879")
    cy.contains("DBS0350580")
    cy.get("#parent-ref").scrollTo(0, 1000)
    cy.get("#row-15").should("not.exist")
  })
})
