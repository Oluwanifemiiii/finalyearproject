import React from 'react';

const Footer = () => {
  const productList = ["Crowdfunding", "Donation", "Project", "Members"];
  const contactList = ["oluwanifemi.ipaye@pau.edu.ng", "github.com/oluwanifemiiiii", "Contact Us"];
  const useFullLink = ["Home", "About Us", "Privacy Policy", "Terms of Service"];
  return (
    <footer className="text-center text-white backgroundMain lg:text-left">
      <div className="mx-6 py-10 text-center md:text-left">
        <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="">
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              Oluwanifemi Ipaye
            </h6>
            <p>
              A passionate software developer with a focus on building innovative solutions that make a difference.
            </p>   
          </div>
          <div className="">
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              Products
            </h6>
            {productList.map((el, i) => (
              <p className="mb-4" key={i + 1}>
                <a href="#!">{el}</a>
              </p>
            ))}
          </div>
          <div className="">
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              Contact
            </h6>
            {contactList.map((el, i) => (
              <p className="mb-4" key={i + 1}>
                <a href="#!">{el}</a>
              </p>
            ))}
          </div>
          <div className="">
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              Useful Links
            </h6>
            {useFullLink.map((el, i) => (
              <p className="mb-4" key={i + 1}>
                <a href="#!">{el}</a>
              </p>
            ))}
        </div>
        </div>
      </div>
      <div className="text-center p-6 backgroundMain">
       <span>© 2025 Oluwanifemi Ipaye. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;