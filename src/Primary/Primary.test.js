import { render, screen, fireEvent } from "@testing-library/react";
import Primary from "./Primary";

describe("Primary Component", () => {
  let setPrimaryMock;

  beforeEach(() => {
    // Mock the `setPrimary` function
    setPrimaryMock = jest.fn();
  });

  test("renders primary text when 'primary' is true", () => {
    render(<Primary primary={true} setPrimary={setPrimaryMock} />);

    const primaryContainer = screen.getByTestId("primary");

    // Verify the primary container is in the document
    expect(primaryContainer).toBeInTheDocument();
  });

  test("does not render primary text when 'primary' is false", () => {
    render(<Primary primary={false} setPrimary={setPrimaryMock} />);

    const primaryContainer = screen.queryByTestId("primary");

    // Verify the primary container is NOT rendered
    expect(primaryContainer).not.toBeInTheDocument();
  });

  test("closes primary when clicking outside the container", () => {
    const { container } = render(<Primary primary={true} setPrimary={setPrimaryMock} />);
    const primaryContainer = screen.getByTestId("primary");

    // Simulate a click outside the container
    fireEvent.mouseDown(container);

    // Ensure setPrimary is called with false
    expect(setPrimaryMock).toHaveBeenCalledWith(false);

    // Simulate a click inside the container
    fireEvent.mouseDown(primaryContainer);

    // Ensure setPrimary is NOT called when clicking inside
    expect(setPrimaryMock).toHaveBeenCalledTimes(1);
  });
});
