import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="absolute w-full bg-secondary py-6 mb-0 z-40">
        <div className="container">
          <div className="text-center text-secondary-foreground">
            <p className="text-sm">
              © 2025{" "}
              <a
                className="underline text-red-500 font-bold"
                href="https://ahmadarilsamsi.vercel.app/"
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
