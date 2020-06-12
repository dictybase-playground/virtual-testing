/// <reference types="cypress" />

describe("InfiniteList", () => {
  it("shows more rows on scroll", () => {
    cy.visit("/")
    cy.contains("cytB-")
    cy.get("#parent-ref").scrollTo(0, 500)
    cy.contains("gnt15-")
    cy.get("#row-20").should("not.exist")
  })
})
