import { parseQuery } from "./parseQuery";

describe("parseQuery", () => {
  test.each([
    ["b:example", "b", "example"],
    ["b:", "b", ""],
    [":example", "", "example"],
    [":", "", ""],
    ["example", "", "example"],
    ["", "", ""],
  ])(`"%s" => "%s", "%s"`, (query, expectedFilter, expectedPattern) => {
    const { filter, pattern } = parseQuery(query);
    expect(filter).toEqual(expectedFilter);
    expect(pattern).toEqual(expectedPattern);
  });
});
