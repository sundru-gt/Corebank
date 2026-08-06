import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            Made by <span className="font-semibold text-gray-700">Shivendru Paul</span>
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-medium">Tech Stack:</span> MongoDB, Express.js, React, Node.js, Tailwind CSS
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
