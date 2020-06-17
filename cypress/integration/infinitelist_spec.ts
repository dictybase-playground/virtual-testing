/// <reference types="cypress" />

describe("InfiniteList", () => {
  it("shows more rows on scroll", () => {
    cy.visit("/")
    cy.contains("Use Infinite Scroll").click()
    cy.contains("DBP0001070")
    cy.get("#parent-ref").scrollTo(0, 500)
    cy.contains("DBP0001060")
    cy.get("#row-20").should("not.exist")
  })
})
