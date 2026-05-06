"use client";

export default function Footer() {
  return (
    <footer
      className="px-8 py-12"
      style={{ backgroundColor: '#F8F6F3' }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span
          className="text-sm opacity-50"
          style={{ fontFamily: 'Georgia, serif', color: '#2A2235' }}
        >
          © 2025 李焕楷. All rights reserved.
        </span>
        <span
          className="text-sm opacity-50"
          style={{ fontFamily: 'Georgia, serif', color: '#2A2235' }}
        >
          Designed & built with intention.
        </span>
      </div>
    </footer>
  );
}