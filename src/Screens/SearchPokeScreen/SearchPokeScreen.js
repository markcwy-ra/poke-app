import React, { useContext } from "react";
import { useState } from "react";
import "./SearchPokeScreen.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

import {
  faMagnifyingGlass,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { get, ref, set } from "firebase/database";
import { database } from "../../firebase";
import { NavContext, UserContext } from "../../App";

//comment
const SearchPokeScreen = ({ DB_USERS_KEY }) => {
  const [input, setInput] = useState("");
  const [pokeData, setPokeData] = useState(null);
  const [pokeName, setPokeName] = useState("");
  const { user } = useContext(UserContext);
  const { navigate } = useContext(NavContext);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const inputValidation = (userInput) => {
    const regex = /^[A-Za-z0-9 ]+$/;
    const hyphenatedString = "-";
    if (input == "") {
      alert("please enter a pokemon name");
    } else if (!regex.test(input)) {
      alert("please remove any special characters in input");
    } else if (input.includes(hyphenatedString)) {
      alert("your input contains hyphen")
    } else if (input.match(/\d+/g) !== null) {
      alert("your input contains numbers")
    } else if (input.replace(/\./g, "-")) {
      return input.toLowerCase();
    }
    return input.toLowerCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = inputValidation(input);

    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${result}`)
      .then((response) => {
        // setPokeData()
        const retrievedData = {
          type: response.data.types[0].type.name,
          imgURL: response.data.sprites.front_default,
        };
        setPokeName(response.data.name); //storing the response data as a state
        setPokeData(retrievedData); // --ditto--
      });
  };

  const handleClick = (e) => {
    console.log(e.target);
    const pokeRef = ref(
      database,
      DB_USERS_KEY + "/" + user.uid + "/" + e.target.id + "/" + pokeName
    );
    const listOrderRef = ref(
      database,
      DB_USERS_KEY + "/" + user.uid + "/" + e.target.id + "order"
    );
    get(pokeRef).then((data) => {
      if (data.exists()) {
        alert("pokemon in list");
      } else {
        set(pokeRef, pokeData) //setPokeData(retrievedData);
          .then(() => {
            get(listOrderRef).then((data) => {
              if (data.exists()) {
                const newList = [...data.val(), pokeName];
                set(listOrderRef, newList);
              } else {
                set(listOrderRef, [pokeName]);
              }
            });
          });
      }
    });
  };
  return (
    <div className="pokeSearch">
      <button
        className="back"
        onClick={() => {
          navigate("/profile");
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} size="2xl" />
      </button>

      <h1 className="addPoke">Add Pokemon</h1>
      <div>
        <div className="flex-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="enter pokemon name"
              className="pokeSearchBox"
              onChange={handleChange}
              value={input}
            ></input>

            <button type="submit" className="pokeSearchIcon">
              <FontAwesomeIcon icon={faMagnifyingGlass} />{" "}
            </button>
          </form>
        </div>

        <br />

        <div>
          {pokeName ? (
            <div className="flex-container">
              <div className="flex-item results">{pokeName}</div>
              <button
                className="flex-item plus"
                onClick={handleClick}
                id="topten"
              >
                +
              </button>
              <button
                className="flex-item star"
                onClick={handleClick}
                id="wishlist"
              >
                ★
              </button>
            </div>) : null
          }
        </div>

        <br />
      </div>
    </div>
  );
};
export default SearchPokeScreen;
