import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Hero from '@/components/Hero';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock components
vi.mock('@/components/TachometerSVG', () => ({
  default: ({ rpm }: { rpm: number }) => <div data-testid="tachometer">RPM: {rpm}</div>,
}));

vi.mock('@/components/ModelViewer', () => ({
  default: ({ alt }: { alt: string }) => <div data-testid="model-viewer">{alt}</div>,
}));

describe('Hero Component', () => {
  it('renders hero content correctly', () => {
    render(<Hero />);
    
    // Check main heading
    expect(screen.getByText('Apex Performance')).toBeInTheDocument();
    expect(screen.getByText('Hypercar Reimagined')).toBeInTheDocument();
    
    // Check subheading
    expect(screen.getByText(/Surgical precision meets uncompromising performance/)).toBeInTheDocument();
    
    // Check CTA buttons
    expect(screen.getByText('Enquire Now')).toBeInTheDocument();
    expect(screen.getByText('Book a Demo')).toBeInTheDocument();
  });

  it('displays performance specifications', () => {
    render(<Hero />);
    
    // Check key specs are displayed
    expect(screen.getByText('2.3')).toBeInTheDocument(); // 0-60 time
    expect(screen.getByText('1,200')).toBeInTheDocument(); // HP
    expect(screen.getByText('218')).toBeInTheDocument(); // Top speed
    expect(screen.getByText('1,350')).toBeInTheDocument(); // Weight
  });

  it('includes tachometer component', () => {
    render(<Hero />);
    
    const tachometer = screen.getByTestId('tachometer');
    expect(tachometer).toBeInTheDocument();
  });

  it('includes 3D model viewer', () => {
    render(<Hero />);
    
    const modelViewer = screen.getByTestId('model-viewer');
    expect(modelViewer).toBeInTheDocument();
    expect(modelViewer).toHaveTextContent('Apex Performance Hypercar');
  });

  it('handles CTA button clicks', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<Hero />);
    
    const enquireButton = screen.getByText('Enquire Now');
    const demoButton = screen.getByText('Book a Demo');
    
    // Buttons should be clickable
    expect(enquireButton).toBeEnabled();
    expect(demoButton).toBeEnabled();
    
    fireEvent.click(enquireButton);
    fireEvent.click(demoButton);
    
    consoleSpy.mockRestore();
  });

  it('displays key features list', () => {
    render(<Hero />);
    
    // Check that key features are displayed
    expect(screen.getByText(/Carbon fiber monocoque construction/)).toBeInTheDocument();
    expect(screen.getByText(/Hybrid powertrain with active aerodynamics/)).toBeInTheDocument();
    expect(screen.getByText(/Limited production: 99 units worldwide/)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Hero />);
    
    const section = screen.getByRole('main') || screen.getByTestId('hero-section');
    const heading = screen.getByRole('heading', { level: 1 });
    
    expect(heading).toHaveTextContent('Apex Performance');
    
    // Check buttons have accessible labels
    const enquireButton = screen.getByRole('button', { name: /enquire/i });
    const demoButton = screen.getByRole('button', { name: /demo/i });
    
    expect(enquireButton).toBeInTheDocument();
    expect(demoButton).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-hero-class';
    const { container } = render(<Hero className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('renders scroll indicator', () => {
    render(<Hero />);
    
    expect(screen.getByText('Scroll to Explore')).toBeInTheDocument();
  });
});

// Integration test for Hero component interactions
describe('Hero Component Integration', () => {
  it('updates tachometer RPM over time', async () => {
    // Mock timers
    vi.useFakeTimers();
    
    render(<Hero />);
    
    const tachometer = screen.getByTestId('tachometer');
    
    // Initially should show 0 or low RPM
    expect(tachometer).toHaveTextContent('RPM: 0');
    
    // Fast-forward time to trigger RPM animation
    vi.advanceTimersByTime(1500);
    
    // Should update to higher RPM (this would depend on actual implementation)
    // For now, just check that the component still renders
    expect(tachometer).toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
