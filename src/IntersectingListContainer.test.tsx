import React from "react"
import { mount } from "enzyme"
import { MockedProvider } from "@apollo/react-testing"
import { act } from "react-dom/test-utils"
import IntersectingListContainer from "./IntersectingListContainer"
import IntersectingList from "./IntersectingList"
import { GET_STRAIN_LIST } from "./query"

const wait = (amount = 0) =>
  new Promise((resolve) => setTimeout(resolve, amount))

describe("IntersectingListContainer", () => {
  beforeAll(() => {
    let window = global as any
    window.IntersectionObserver = jest.fn((callback, options) => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
    }))
  })
  describe("loading and inital data display", () => {
    const mocks = [
      {
        request: {
          query: GET_STRAIN_LIST,
          variables: {
            cursor: 0,
            limit: 10,
            filter: "",
          },
        },
        result: {
          data: {
            listStrains: {
              nextCursor: 123456,
              strains: [
                {
                  id: "DBS0238532",
                  label: "γS13",
                },
              ],
            },
          },
        },
      },
    ]
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IntersectingListContainer />
      </MockedProvider>,
    )
    it("renders loading message first", () => {
      expect(wrapper.find("p").text()).toContain("Loading...")
    })
    it("renders expected components after receiving data", async () => {
      await act(async () => {
        await wait()
        wrapper.update()
      })
      expect(wrapper.find(IntersectingList)).toHaveLength(1)
    })
  })

  describe("error handling", () => {
    const mocks = [
      {
        request: {
          query: GET_STRAIN_LIST,
          variables: {
            cursor: 0,
            limit: 10,
            filter: "",
          },
        },
        result: {
          errors: [
            {
              message: "Strains not found",
              path: [],
              extensions: { code: "NotFound" },
              locations: undefined,
              nodes: undefined,
              source: undefined,
              positions: undefined,
              originalError: undefined,
              name: "",
            },
          ],
        },
      },
    ]
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IntersectingListContainer />
      </MockedProvider>,
    )
    it("handles errors as expected", async () => {
      await act(async () => {
        await wait()
        wrapper.update()
      })
      expect(wrapper.find("p").text()).toContain("Error :(")
    })
  })
})
