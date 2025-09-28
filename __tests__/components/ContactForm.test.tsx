import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ContactForm from '@/components/ContactForm';

// Mock fetch
global.fetch = vi.fn();

describe('ContactForm Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders form with all required fields', () => {
    render(<ContactForm />);
    
    // Check form title
    expect(screen.getByText('Contact Our Specialists')).toBeInTheDocument();
    
    // Check required form fields
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/region/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/inquiry type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    
    // Check submit button
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(<ContactForm />);
    
    expect(screen.getByText('+1 (555) APEX-001')).toBeInTheDocument();
    expect(screen.getByText('contact@apex-performance.com')).toBeInTheDocument();
    expect(screen.getByText('1 Performance Drive')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles, CA 90210')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    // Try to submit empty form
    await user.click(submitButton);
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/please select your region/i)).toBeInTheDocument();
      expect(screen.getByText(/please select an inquiry type/i)).toBeInTheDocument();
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<ContactForm />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    // Enter invalid email
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    // Should show email validation error
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    // Mock successful API response
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Thank you!' }),
    });

    render(<ContactForm />);
    
    // Fill out form with valid data
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '+1 555 123 4567');
    await user.selectOptions(screen.getByLabelText(/region/i), 'north-america');
    await user.selectOptions(screen.getByLabelText(/inquiry type/i), 'purchase');
    await user.type(screen.getByLabelText(/message/i), 'I am interested in purchasing an Apex hypercar.');
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);
    
    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/sending message/i)).toBeInTheDocument();
    });
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/message sent!/i)).toBeInTheDocument();
      expect(screen.getByText(/thank you! we'll be in touch within 2 hours/i)).toBeInTheDocument();
    });
    
    // Should have called the API
    expect(fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.stringContaining('John Doe'),
    }));
  });

  it('handles API errors gracefully', async () => {
    // Mock API error response
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Server error' }),
    });

    render(<ContactForm />);
    
    // Fill out form with valid data
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.selectOptions(screen.getByLabelText(/region/i), 'north-america');
    await user.selectOptions(screen.getByLabelText(/inquiry type/i), 'purchase');
    await user.type(screen.getByLabelText(/message/i), 'Test message that is long enough to pass validation.');
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/try again/i)).toBeInTheDocument();
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });

  it('prevents spam with honeypot field', async () => {
    render(<ContactForm />);
    
    // Find honeypot field (should be hidden)
    const honeypotField = document.querySelector('input[name="honeypot"]') as HTMLInputElement;
    expect(honeypotField).toBeInTheDocument();
    expect(honeypotField.style.display).toBe('none');
    
    // Fill honeypot field (simulating bot behavior)
    fireEvent.change(honeypotField, { target: { value: 'bot content' } });
    
    // Fill other fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.selectOptions(screen.getByLabelText(/region/i), 'north-america');
    await user.selectOptions(screen.getByLabelText(/inquiry type/i), 'purchase');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);
    
    // Should show error for bot detection
    await waitFor(() => {
      expect(screen.getByText(/bot detected/i)).toBeInTheDocument();
    });
  });

  it('resets form after successful submission', async () => {
    // Mock successful API response
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactForm />);
    
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
    
    // Fill form
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.selectOptions(screen.getByLabelText(/region/i), 'north-america');
    await user.selectOptions(screen.getByLabelText(/inquiry type/i), 'purchase');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // Wait for success and form reset
    await waitFor(() => {
      expect(screen.getByText(/message sent!/i)).toBeInTheDocument();
    });
    
    // Form should be reset
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
    });
  });

  it('calls success callback when provided', async () => {
    const onSuccess = vi.fn();
    
    // Mock successful API response
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactForm onSuccess={onSuccess} />);
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.selectOptions(screen.getByLabelText(/region/i), 'north-america');
    await user.selectOptions(screen.getByLabelText(/inquiry type/i), 'purchase');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
      }));
    });
  });

  it('calls error callback when provided', async () => {
    const onError = vi.fn();
    
    // Mock API error
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(<ContactForm onError={onError} />);
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.selectOptions(screen.getByLabelText(/region/i), 'north-america');
    await user.selectOptions(screen.getByLabelText(/inquiry type/i), 'purchase');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.stringContaining('Network error'));
    });
  });

  it('has proper accessibility attributes', () => {
    render(<ContactForm />);
    
    // Check form has proper labels
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageInput = screen.getByLabelText(/message/i);
    
    expect(nameInput).toHaveAttribute('id');
    expect(emailInput).toHaveAttribute('id');
    expect(messageInput).toHaveAttribute('id');
    
    // Check required fields have proper attributes
    expect(nameInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(messageInput).toBeRequired();
    
    // Check submit button
    const submitButton = screen.getByRole('button', { name: /send message/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});
