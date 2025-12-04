/**
 * Neural Particles - Home page
 * Entry point for the application
 * @module app/page
 */

import ParticlePage from "./components/ParticlePage";

/**
 * Home Page Component
 *
 * Root page that renders the ParticlePage component.
 * Kept minimal to maintain clean separation between
 * Next.js routing and application logic.
 *
 * @returns React component
 */
export default function Home() {
  return <ParticlePage />;
}
