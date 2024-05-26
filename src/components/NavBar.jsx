import { AiFillGithub as GhLogo } from "react-icons/ai";

import { IconContext } from "react-icons";
import { TbProgressHelp } from "react-icons/tb";
import { HStack } from "@chakra-ui/react";

const NavBar = ({ tour }) => {
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
          <TbProgressHelp
            className="help-icon"
            title="Replay app tour."
            onClick={() => {
              tour.start();
            }}
          />
          <a href="https://github.com/siddAhmed/PeerEdit" target="_blank">
            <GhLogo />
          </a>
        </IconContext.Provider>
      </HStack>
    </nav>
  );
};

export default NavBar;
