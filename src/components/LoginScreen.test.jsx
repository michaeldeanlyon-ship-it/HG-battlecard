import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LoginScreen from './LoginScreen.jsx';

vi.mock('../firebase.js', () => ({ auth: {} }));
vi.mock('firebase/auth', () => ({ signInWithEmailAndPassword: vi.fn() }));

describe('LoginScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  async function fillAndSubmit(user, { email = 'rep@example.com', password = 'hunter2' } = {}) {
    await user.type(screen.getByLabelText('Email'), email);
    await user.type(screen.getByLabelText('Password'), password);
    await user.click(screen.getByRole('button', { name: /sign in/i }));
  }

  it('signs in with the trimmed email and password', async () => {
    signInWithEmailAndPassword.mockResolvedValue({});
    const user = userEvent.setup();
    render(<LoginScreen />);

    await user.type(screen.getByLabelText('Email'), '  rep@example.com  ');
    await user.type(screen.getByLabelText('Password'), 'hunter2');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'rep@example.com', 'hunter2'),
    );
  });

  it('shows a friendly message for a known error code', async () => {
    signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/wrong-password' });
    const user = userEvent.setup();
    render(<LoginScreen />);

    await fillAndSubmit(user);

    expect(await screen.findByText('Email or password is incorrect.')).toBeInTheDocument();
  });

  it('falls back to a generic message for an unmapped error code', async () => {
    signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/some-new-error' });
    const user = userEvent.setup();
    render(<LoginScreen />);

    await fillAndSubmit(user);

    expect(await screen.findByText('Could not sign in. Try again.')).toBeInTheDocument();
  });

  it('disables the submit button and shows a busy label while signing in', async () => {
    let resolveSignIn;
    signInWithEmailAndPassword.mockReturnValue(
      new Promise((resolve) => { resolveSignIn = resolve; }),
    );
    const user = userEvent.setup();
    render(<LoginScreen />);

    await fillAndSubmit(user);

    const button = screen.getByRole('button', { name: /signing in/i });
    expect(button).toBeDisabled();

    resolveSignIn({});
  });

  it('clears a previous error on the next submit attempt', async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/wrong-password' });
    const user = userEvent.setup();
    render(<LoginScreen />);

    await fillAndSubmit(user);
    expect(await screen.findByText('Email or password is incorrect.')).toBeInTheDocument();

    signInWithEmailAndPassword.mockReturnValue(new Promise(() => {}));
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.queryByText('Email or password is incorrect.')).not.toBeInTheDocument();
  });
});
