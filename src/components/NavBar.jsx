const NavBar = ({}) => {
  return (
    <nav className="navbar flex">
      <h1 className="heading">
        <span className="heading-standout">P</span>eer
        <span className="heading-standout">E</span>dit
      </h1>
      <a href="https://www.linkedin.com/in/siddahmed/" target="_blank">
        <img src="/linkedin.svg" alt="linkedin" className="logo" />
      </a>
      <a href="https://github.com/siddAhmed/PeerEdit" target="_blank">
        <img src="/github.svg" alt="github" className="logo" />
      </a>
    </nav>
  );
};

export default NavBar;
