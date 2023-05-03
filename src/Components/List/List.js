import { useContext } from "react";
import "./List.css";
import { NavContext } from "../../App";

const List = ({ list, listOrder, id }) => {
  const { navigate } = useContext(NavContext);
  let displayList = listOrder.map((pokemon, index) => {
    return (
      <button
        className="list-item"
        key={pokemon}
        onClick={() => {
          navigate("profile/" + id + "-" + pokemon);
        }}
      >
        <h2>{index + 1}</h2>

        <h1>{pokemon}</h1>
        <img src={list[pokemon].imgURL} alt={pokemon} />
      </button>
    );
  });

  return <div id="list">{displayList}</div>;
};

export default List;
