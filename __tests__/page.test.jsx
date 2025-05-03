import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Page from '../src/app/page';

// Mock the Next.js router
jest.mock('next/navigation', () => ({
   useRouter: jest.fn(),
}));

// Mock Clerk's useUser hook
jest.mock('@clerk/nextjs', () => ({
   useUser: jest.fn(),
}));

describe('Home Page', () => {
   // Setup mocks before each test
   beforeEach(() => {
      // Mock router implementation
      const pushMock = jest.fn();
      useRouter.mockReturnValue({
         push: pushMock,
      });
   });

   it('renders a loading spinner when page is loading', () => {
      // Mock the user as loading
      useUser.mockReturnValue({
         isLoaded: false,
         isSignedIn: false,
      });

      render(<Page />);

      // Check if loading spinner elements are in the document
      const loadingSpinner = screen.getByTestId('loading-spinner');
      expect(loadingSpinner).toBeInTheDocument();
   });

   it('redirects to dashboard when user is signed in', () => {
      // Mock the user as signed in
      useUser.mockReturnValue({
         isLoaded: true,
         isSignedIn: true,
      });

      const pushMock = jest.fn();
      useRouter.mockReturnValue({
         push: pushMock,
      });

      render(<Page />);

      // Check if router.push was called with correct path
      expect(pushMock).toHaveBeenCalledWith('/dashboard');
   });

   it('redirects to sign-in when user is not signed in', () => {
      // Mock the user as not signed in
      useUser.mockReturnValue({
         isLoaded: true,
         isSignedIn: false,
      });

      const pushMock = jest.fn();
      useRouter.mockReturnValue({
         push: pushMock,
      });

      render(<Page />);

      // Check if router.push was called with correct path
      expect(pushMock).toHaveBeenCalledWith('/sign-in');
   });
});
