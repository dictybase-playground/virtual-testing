import React from "react"
import FixedRow from "./FixedRow"
import { shallow } from "enzyme"
import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"

describe("FixedRow", () => {
  const spyRef = jest.spyOn(React, "useRef").mockReturnValue({
    current: {
      scrollTo: jest.fn(),
      scroll: jest.fn(),
    },
  })
  const wrapper = shallow(<FixedRow />)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render outer components", () => {
    expect(wrapper.find(Paper)).toHaveLength(1)
    expect(wrapper.find(List)).toHaveLength(1)
  })
  it("should initially render six rows", () => {
    expect(wrapper.find("#row-0")).toHaveLength(1)
    expect(wrapper.find("#row-1")).toHaveLength(1)
    expect(wrapper.find("#row-2")).toHaveLength(1)
    expect(wrapper.find("#row-3")).toHaveLength(1)
    expect(wrapper.find("#row-4")).toHaveLength(1)
    expect(wrapper.find("#row-5")).toHaveLength(1)

    expect(wrapper.find(ListItem)).toHaveLength(6)
  })
  it("should have expected text values", () => {
    expect(wrapper.find("#row-0").text()).toEqual("Row 0")
    expect(wrapper.find("#row-5").text()).toEqual("Row 5")
  })
  it("should not render seventh row", () => {
    expect(wrapper.find("#row-6")).toHaveLength(0)
  })
  it("should track scrolling on parent ref", () => {
    wrapper.find(Paper).simulate("scroll")
    console.log(wrapper.debug())
    // expect(spyRef).toHaveBeenCalledTimes(1)
  })
})
