import {
  AiFillGithub as GhLogo,
  AiFillLinkedin as LinkedinLogo,
} from "react-icons/ai";

import { IconContext } from "react-icons";
import { HStack } from "@chakra-ui/react";

const NavBar = ({}) => {
  return (
    <nav className="navbar flex">
      <h1 className="heading not-selectable">
        <a href="/">
          <span className="heading-standout">P</span>eer
          <span className="heading-standout">E</span>dit
        </a>
      </h1>
      <HStack>
        <IconContext.Provider value={{ color: "white", size: "1.7em" }}>
          <a href="https://www.linkedin.com/in/siddahmed/" target="_blank">
            {/* <img src="/linkedin.svg" alt="linkedin" className="logo" /> */}
            <LinkedinLogo />
          </a>
          <a href="https://github.com/siddAhmed/PeerEdit" target="_blank">
            {/* <img src="/github.svg" alt="github" className="logo" /> */}
            <GhLogo />
          </a>
        </IconContext.Provider>
      </HStack>
    </nav>
  );
};

export default NavBar;
