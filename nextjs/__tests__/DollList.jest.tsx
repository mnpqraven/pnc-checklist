import { DollList } from "@/components/Doll";
import { MOCK_CROQUE, MOCK_HUBBLE } from "@/jest.setup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";

describe("DollList", () => {
  it("should render", () => {
    const queryClient = new QueryClient();
    const setStore = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <DollList
          store={[MOCK_CROQUE, MOCK_HUBBLE]}
          indexChange={() => {}}
          setStore={setStore}
        />
      </QueryClientProvider>
    );
    const croque = screen.queryByText(/Croque/i);
    expect(croque).toBeInTheDocument();
    const hubble = screen.queryByText(/Hubble/i);
    expect(hubble).toBeInTheDocument();
    const invalid = screen.queryByText(/Simo/i);
    expect(invalid).not.toBeInTheDocument();
  });

  it("handles indexChange", () => {
    const queryClient = new QueryClient();
    const indexHandler = jest.fn();
    const newUnitHandler = jest.fn();
    const deleteUnitHandler = jest.fn();
    const setStore = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <DollList
          store={[MOCK_CROQUE, MOCK_HUBBLE]}
          indexChange={indexHandler}
          setStore={setStore}
        />
      </QueryClientProvider>
    );
    const croqueElement = screen.getByText(/Croque/i);
    fireEvent.click(croqueElement);
    expect(indexHandler).toHaveBeenCalledTimes(1);
    expect(newUnitHandler).toHaveBeenCalledTimes(0);
    expect(deleteUnitHandler).toHaveBeenCalledTimes(0);
  });
});
