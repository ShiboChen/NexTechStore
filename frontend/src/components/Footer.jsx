import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-4 bg-blue-400 text-base-content">
      <aside>
        <p>Copyright © {currentYear} - All right reserved by NexTechStore</p>
      </aside>
    </footer>
  );
};

export default Footer;
