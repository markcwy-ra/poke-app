import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { NavContext, UserContext } from "../../App";
import NavBar from "../../Components/NavBar/NavBar";
import "./PokeStatsScreen.css";
import PokeData from "./PokeData";
import { get, ref, set } from "firebase/database";
import { database } from "../../firebase";
import { ref as storeRef, getStorage, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";

const PokeStatsScreen = ({ topten, wishlist }) => {
  const [editPokeName, setEditPokeName] = useState(false)
  const [editLevel, setEditLevel] = useState("")
  const [fileInputFile, setFileInputFile] = useState(null)
  const [fileInputValue, setFileInputValue] = useState("")
  const { link } = useParams();
  const { handleNavigate } = useContext(NavContext);
  const { user } = useContext(UserContext);
  const [first, ...rest] = link.split("-");
  const listName = first;
  const pokeName = rest.join("-");
  const STORE_IMAGE_KEY = "images";

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
      if (e.target.value <= 100) {
        setEditLevel(e.target.value)
      } else {
        alert("Please enter a level below 100")

      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (listName == "topten") {

      const fileRef = storeRef(storage, `${STORE_IMAGE_KEY}/${fileInputFile.name}`);
      uploadBytesResumable(fileRef, fileInputFile).then(() => {
        getDownloadURL(fileRef)
          .then((url) => {
            console.log("URL:", url);
            // msg.url = url;
            //Making a reference to the database, to the location where we want to edit (database, URL), the URL is found from accessing our Firebase database console:
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
              copiedData['nickName'] = editPokeName
              // console.log(copiedData['name'])
              // console.log(copiedData)

              copiedData['level'] = editLevel
              // console.log(copiedData['level'])
              //set(pokeRef, var of the copied and edited object) [the actual updating of the firebase]
              copiedData['customImg'] = url
              set(pokeRef, copiedData)
            })
          })
      })

    } else if (listName == "wishlist") {
      let pokeRef = ref(database, `users/${user.name.toLowerCase()}/wishlist/${pokeName}`)
      get(pokeRef).then((response) => {
        let copiedData = { ...response.val() }
        if (copiedData.length == 10) {
          console.log('cannot add to wishlist anymore')
        }
      })
    }
  }

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setFileInputFile(e.target.files[0]);
    console.log(e.target.value)
    setFileInputValue(e.target.value)
  };


  return (
    <div className="contents">
      <div id="poke-stats">
        <button onClick={handleNavigate} id="">
          Back
        </button>
        <div >
          <PokeData topten={topten} wishlist={wishlist} />
          {
            (listName == "topten") ?
              <button className="edit-poke-name" onClick={handleEditPokeName}>Edit Pokemon</button> : null
          }

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
                    value={editPokeName}
                  />
                  <br />
                  <input
                    type="text"
                    onChange={handleChange}
                    id="level"
                    placeholder="enter pokemon level"
                    className="field-css"
                    value={editLevel}
                  />
                  <br />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    id="image"
                    placeholder="upload new image"
                  />
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
