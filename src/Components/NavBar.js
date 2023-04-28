import { useContext } from "react";
import { NavContext } from "../App";

const NavBar = () => {
  const { handleNavigate } = useContext(NavContext);
  return (
    <div id="nav">
      <button onClick={handleNavigate} id="">
        Explore
      </button>
      <button onClick={handleNavigate} id="profile">
        Profile
      </button>
      <button onClick={handleNavigate} id="">
        Search
      </button>
    </div>
  );
};

export default NavBar;
