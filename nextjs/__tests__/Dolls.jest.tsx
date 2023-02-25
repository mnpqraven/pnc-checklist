import { fireEvent, render, act, screen } from "@testing-library/react";
import Dolls from "@/pages/dolls";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mockIPC } from "@tauri-apps/api/mocks";

const Dev = () => {
  const [dev, setDev] = useState("bruh");
  async function dev_set() {
    return "async_value";
  }
  async function init() {
    let t = await dev_set();
    setDev(t);
  }
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <p>{dev}</p>
    </>
  );
};

describe("Template for tests needing act", () => {
  it("should pass with async callback and await act(async fn())", async () => {
    await act(async () => {
      render(<Dev />);
    });
    expect(screen.getByText("async_value")).toBeInTheDocument();
  });
});

describe("dolls page", () => {
  it("should render", async () => {
    const queryClient = new QueryClient();
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <Dolls />
        </QueryClientProvider>
      );
    });

    const hubbleElement = screen.getByText("Hubble");
    const croqueElement = screen.getByText("Croque");
    expect(hubbleElement).toBeInTheDocument();
    expect(croqueElement).toBeInTheDocument();
  });

  it("should avoid calling pieceUpdate() twice", async () => {
    const queryClient = new QueryClient();
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <Dolls />
        </QueryClientProvider>
      );
    });

    const hubbleElement = screen.getByText("Hubble");
    const croqueElement = screen.getByText("Croque");

    await act(async () => {
      fireEvent.click(hubbleElement);
    });

    const hubbleGoalOffense = screen.getAllByTestId("MLRMatrix");
    expect(hubbleGoalOffense).toHaveLength(1);

    await act(async () => {
      fireEvent.click(croqueElement);
    });

    const croqueGoalOffense = screen.getAllByTestId("LowerLimit");
    expect(croqueGoalOffense).toHaveLength(2);
  });
});
