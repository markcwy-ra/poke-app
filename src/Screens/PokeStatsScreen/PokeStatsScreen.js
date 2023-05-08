import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { NavContext, UserContext } from "../../App";
import NavBar from "../../Components/NavBar/NavBar";
import "./PokeStatsScreen.css";
import PokeData from "./PokeData";
import { get, ref, set } from "firebase/database";
import { database } from "../../firebase";

const PokeStatsScreen = ({ topten, wishlist }) => {
  const [editPokeName, setEditPokeName] = useState(false)
  const [editLevel, setEditLevel] = useState("")
  const { link } = useParams();
  const { handleNavigate } = useContext(NavContext);
  const { user } = useContext(UserContext);
  const [first, ...rest] = link.split("-");
  const listName = first;
  const pokeName = rest.join("-");

  let pokeData;
  if (listName === "topten") {
    pokeData = topten[pokeName];
  } else if (listName === "wishlist") {
    pokeData = wishlist[pokeName];
  }

  let typeList = pokeData.type.map((type) => (
    <div key={type} className={`poke-type ${type}`}>
      {type}
    </div>
  ));

  const handleEditPokeName = () => {
    setEditPokeName(true)
    console.log("change pokemon name", editPokeName)
  }

  const handleChange = (e) => {
    if (e.target.id === "name-change") {
      setEditPokeName(e.target.value)
    } else if (e.target.id === "level") {
      setEditLevel(e.target.value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (listName == "topten") {
      //Making a reference to the database, to the location where we want to edit (database, URL):
      let pokeRef = ref(database, `users/${user.name.toLowerCase()}/topten/${pokeName}`)
      //Retrieve the reference above in the following line:
      get(pokeRef).then((response) => {
        // response.val() gives the value at the URL
        //Make a copy of the response data which is currently an object
        let copiedData = { ...response.val() }
        // console.log(response)
        console.log(copiedData)
        //Reassign value based on updated state (name and level and image URL)
        //Update the object (copiedData's property of 'name') to the state
        //similar to : object-name.property = new value
        copiedData['name'] = editPokeName
        // console.log(copiedData['name'])
        // console.log(copiedData)

        copiedData['level'] = editLevel
        // console.log(copiedData['level'])
        //set(pokeRef, var of the copied and edited object) [the actual updating of the firebase]
        set(pokeRef, copiedData)
      })
    }
  }

  // const handleFileChange = (e) => {
  //   console.log(e.target.files[0]);

  // };

  return (
    <div className="contents">
      <div id="poke-stats">
        <button onClick={handleNavigate} id="">
          Back
        </button>
        <div >
          <PokeData topten={topten} wishlist={wishlist} />
          <button className="edit-poke-name" onClick={handleEditPokeName}>Edit Pokemon</button>
          {
            (editPokeName) ?
              <div>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    onChange={handleChange}
                    id="name-change"
                    placeholder="enter new name for pokemon"
                    className="field-css"
                  />
                  <br />
                  <input
                    type="text"
                    onChange={handleChange}
                    id="level"
                    placeholder="enter pokemon level"
                    className="field-css"
                  />
                  <br />
                  {/* <input
                    type="file"
                    // onChange={handleFileChange}
                    id="image"
                    placeholder="upload new image"
                  /> */}
                  <button type="submit">Submit</button>
                </form>


              </div>
              : (console.log("can't change name"))
          }
        </div>


      </div>
      <NavBar />
    </div>
  );
};

export default PokeStatsScreen;
