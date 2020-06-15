import React from "react"
import { shallow } from "enzyme"
import InfiniteList from "./InfiniteList"
import Paper from "@material-ui/core/Paper"

// just adding basic rendering test to start

describe("InfiniteList", () => {
  describe("initial render", () => {
    const props = {
      data: [],
      loadMore: jest.fn(),
      hasMore: true,
    }
    const wrapper = shallow(<InfiniteList {...props} />)
    it("should render initial components", () => {
      expect(wrapper.find(Paper)).toHaveLength(1)
    })
  })
})
