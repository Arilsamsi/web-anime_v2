import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-secondary py-5">
        <div className="container">
          <div className="text-center text-secondary-foreground">
            <p className="text-sm">
              © 2025{" "}
              <a
                className="underline text-red-500 font-bold"
                href="https://github.com/Arilsamsi"
              >
                AnimeStrim
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
