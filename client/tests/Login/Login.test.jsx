import { it, expect, describe, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../src/components/login/Login';
import { AuthContext } from '../../src/contexts/authContext';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe("Login Component", () => {

    it("Should show an error message that login or password don't match, when trying to login with wrong password", async () => {
        render(
            <AuthContext.Provider value={{ changeAuthState: vi.fn() }}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "pesho@abv.bg" } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrong password" } });

        fireEvent.submit(screen.getByTestId("login-form"));

        await waitFor(() => {
            expect(screen.getByText(/Login or password don't match/i)).toBeInTheDocument();
        });
    });

    it("Should navigate to home page after a successful login", async () => {

        const mockNavigate = vi.fn();
        useNavigate.mockReturnValue(mockNavigate);

        render(
            <AuthContext.Provider value={{ changeAuthState: vi.fn() }}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "pesho@abv.bg" } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "123456" } });

        fireEvent.submit(screen.getByTestId("login-form"));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

});

