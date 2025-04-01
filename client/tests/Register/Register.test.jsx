import { it, expect, describe, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../../src/components/register/Register';
import { AuthContext } from '../../src/contexts/authContext';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

const getRandomString = (length = 15) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

describe("Register Component", () => {

    it("Should show an error message that user already exists, when trying to register with already existing email", async () => {
        render(
            <AuthContext.Provider value={{ changeAuthState: vi.fn() }}>
                <BrowserRouter>
                    <Register />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "pesho@abv.bg" } });
        fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "3591234567890" } });

        const [passwordInput, confirmPasswordInput] = screen.getAllByLabelText(/Password:/i);
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        fireEvent.change(confirmPasswordInput, { target: { value: '123456' } });

        fireEvent.submit(screen.getByTestId("register-form"));

        await waitFor(() => {
            expect(screen.getByText(/A user with the same email already exists/i)).toBeInTheDocument();
        });
    });

    it("Should navigate to home page after a successful registration", async () => {

        const mockNavigate = vi.fn();
        useNavigate.mockReturnValue(mockNavigate);

        render(
            <AuthContext.Provider value={{ changeAuthState: vi.fn() }}>
                <BrowserRouter>
                    <Register />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: `${getRandomString()}@abv.bg` } });
        fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "3591234567890" } });

        const [passwordInput, confirmPasswordInput] = screen.getAllByLabelText(/Password:/i);
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        fireEvent.change(confirmPasswordInput, { target: { value: '123456' } });

        fireEvent.submit(screen.getByTestId("register-form"));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("Should show an error message that email is invalid", async () => {
        render(
            <AuthContext.Provider value={{ changeAuthState: vi.fn() }}>
                <BrowserRouter>
                    <Register />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalid email" } });
        fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "3591234567890" } });

        const [passwordInput, confirmPasswordInput] = screen.getAllByLabelText(/Password:/i);
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        fireEvent.change(confirmPasswordInput, { target: { value: '123456' } });

        fireEvent.submit(screen.getByTestId("register-form"));

        await waitFor(() => {
            expect(screen.getByText(/Invalid email format!/i)).toBeInTheDocument();
        });
    });

    it("Should show an error message that phone is invalid", async () => {
        render(
            <AuthContext.Provider value={{ changeAuthState: vi.fn() }}>
                <BrowserRouter>
                    <Register />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: `${getRandomString()}@abv.bg` } });
        fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "invalid phone" } });

        const [passwordInput, confirmPasswordInput] = screen.getAllByLabelText(/Password:/i);
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        fireEvent.change(confirmPasswordInput, { target: { value: '123456' } });

        fireEvent.submit(screen.getByTestId("register-form"));

        await waitFor(() => {
            expect(screen.getByText(/Phone Number must contain only digits and be between 10 and 15 digits long./i)).toBeInTheDocument();
        });
    });

    it("Should show an error message that passwords do not match", async () => {
        render(
            <AuthContext.Provider value={{ changeAuthState: vi.fn() }}>
                <BrowserRouter>
                    <Register />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: `${getRandomString()}@abv.bg` } });
        fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "3591234567890" } });

        const [passwordInput, confirmPasswordInput] = screen.getAllByLabelText(/Password:/i);
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'invalid confirm password' } });

        fireEvent.submit(screen.getByTestId("register-form"));

        await waitFor(() => {
            expect(screen.getByText(/Passwords do not match!/i)).toBeInTheDocument();
        });
    });

    it("Should show an error message that password is invalid (too short password)", async () => {
        render(
            <AuthContext.Provider value={{ changeAuthState: vi.fn() }}>
                <BrowserRouter>
                    <Register />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: `${getRandomString()}@abv.bg` } });
        fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "3591234567890" } });

        const [passwordInput, confirmPasswordInput] = screen.getAllByLabelText(/Password:/i);
        fireEvent.change(passwordInput, { target: { value: '123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: '123' } });

        fireEvent.submit(screen.getByTestId("register-form"));

        await waitFor(() => {
            expect(screen.getByText(/Password must be at least 6 characters long!/i)).toBeInTheDocument();
        });
    });
});

