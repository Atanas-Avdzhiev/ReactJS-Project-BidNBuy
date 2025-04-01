import { it, expect, describe, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../src/components/home/Home';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe("Testing Home Component", () => {

    it("Should show the title BidNBuy on home page", async () => {

        render(<Home />);

        await waitFor(() => {
            const title = screen.getByTestId("home-title");
            expect(title).toBeInTheDocument();
            expect(title).toBeVisible();
            expect(title).toHaveTextContent("BidNBuy");
            expect(title).toHaveStyle({
                "font-size": "1.5em",
                "font-weight": "bold",
                "color": "6A4E23"
            });
        });
    });

    it("Should show the sub-titles on home page", async () => {
        render(<Home />);

        await waitFor(() => {
            const subtitle1 = screen.getByText(/Discover, bid, and win!/i);
            const subtitle2 = screen.getByText(/Sell your items or score incredible deals at BidNBuy, the ultimate auction marketplace./i);
            expect(subtitle1).toBeInTheDocument();
            expect(subtitle1).toBeVisible();
            expect(subtitle2).toBeInTheDocument();
            expect(subtitle2).toBeVisible();
        });
    });

    it("Should show the button 'Explore' on home page and if it redirects when clicked to /auctions/catalog", async () => {

        const mockNavigate = vi.fn();
        useNavigate.mockReturnValue(mockNavigate);

        render(<Home />);

        await waitFor(() => {
            const exploreButton = screen.getByText(/Explore/i);
            expect(exploreButton).toBeInTheDocument();
            expect(exploreButton).toBeVisible();

            fireEvent.click(exploreButton);
            expect(mockNavigate).toHaveBeenCalledWith("/auctions/catalog");
        });

    });

    it("Should show the text 'New to bidding?' on home page", async () => {
        render(<Home />);

        await waitFor(() => {
            const newToBiddingElement = screen.getByText(/New to bidding\?/i);
            expect(newToBiddingElement).toBeInTheDocument();
            expect(newToBiddingElement).toBeVisible();
        });

    });

    it("Should show the text 'Latest Auctions' on home page", async () => {
        render(<Home />);

        await waitFor(() => {
            const latestAuctionsElement = screen.getByText(/Latest Auctions/i);
            expect(latestAuctionsElement).toBeInTheDocument();
            expect(latestAuctionsElement).toBeVisible();
        });
    });

});