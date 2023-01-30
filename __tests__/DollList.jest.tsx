import { DollList } from "@/components/Doll";
import { MOCK_CROQUE, MOCK_HUBBLE } from "@/jest.setup";
import { invoke } from "@tauri-apps/api/tauri";
import { fireEvent, render, screen } from "@testing-library/react";

describe("DollList", () => {
  it("should render", () => {
    render(
      <DollList
        list={[MOCK_CROQUE, MOCK_HUBBLE]}
        indexHandler={() => {}}
        newUnitHandler={() => {}}
        deleteUnitHandler={() => {}}
      />
    );
    const croque = screen.queryByText(/Croque/i);
    expect(croque).toBeInTheDocument();
    const hubble = screen.queryByText(/Hubble/i);
    expect(hubble).toBeInTheDocument();
    const invalid = screen.queryByText(/Simo/i);
    expect(invalid).not.toBeInTheDocument();
  });

  it("handles indexChange", () => {
    const indexHandler = jest.fn();
    const newUnitHandler = jest.fn();
    const deleteUnitHandler = jest.fn();
    render(
      <DollList
        list={[MOCK_CROQUE, MOCK_HUBBLE]}
        indexHandler={indexHandler}
        newUnitHandler={newUnitHandler}
        deleteUnitHandler={deleteUnitHandler}
      />
    );
    const croqueElement = screen.getByText(/Croque/i);
    fireEvent.click(croqueElement);
    expect(indexHandler).toHaveBeenCalledTimes(1);
    expect(newUnitHandler).toHaveBeenCalledTimes(0);
    expect(deleteUnitHandler).toHaveBeenCalledTimes(0);
  });
});
