import { shallow } from "enzyme";
import React from "react";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("matches snapshot", () => {
    const wrapper = shallow(<SearchBar value="" onValueChange={() => {}} />);

    expect(wrapper).toMatchSnapshot();
  });

  it("calls onValueChanged when value has changed", () => {
    const handleValueChange = jest.fn();
    const wrapper = shallow(
      <SearchBar value={"test value"} onValueChange={handleValueChange} />
    );

    expect(handleValueChange).not.toHaveBeenCalled();

    wrapper.simulate("change", { target: { value: "new value" } });

    expect(handleValueChange).toHaveBeenCalledTimes(1);
  });
});
