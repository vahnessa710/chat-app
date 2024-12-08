import { render, screen } from "@testing-library/react";
import Primary from "./Primary";

describe("Primary Component Tests", () => {
  const mockSetPrimary = jest.fn();

  test("renders the word 'slacking' when loggedUser is 'vahnessa.gonzales@gmail.com'", () => {
    render(
      <Primary
        primary={true}
        setPrimary={mockSetPrimary}
        loggedUser={{ uid: "vahnessa.gonzales@gmail.com" }}
      />
    );

    const slackingText = screen.getByText(/slacking/i);
    expect(slackingText).toBeInTheDocument();
  });


  test("checks if 'primary-container' is in the document when 'primary' is true", () => {
    render(
      <Primary
        primary={true}
        setPrimary={mockSetPrimary}
        loggedUser={{ uid: "test@example.com" }}
      />
    );

    const primaryContainer = screen.getByTestId("primary");
    expect(primaryContainer).toBeInTheDocument();
  });

  test("does not render 'primary-container' when 'primary' is false", () => {
    render(
      <Primary
        primary={false}
        setPrimary={mockSetPrimary}
        loggedUser={{ uid: "test@example.com" }}
      />
    );

    const primaryContainer = screen.queryByTestId("primary");
    expect(primaryContainer).not.toBeInTheDocument();
  });
});
