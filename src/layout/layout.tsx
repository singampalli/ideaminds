import React from "react";
import AppNavbar from "../components/AppNavbar"; // Optional: Your custom nav
import Footer from "../components/Footer"; // Optional: Your custom footer

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 shadow-md">
        <AppNavbar />
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto p-6 bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-4 text-center">
        <Footer />
      </footer>
    </div>
  );
}
