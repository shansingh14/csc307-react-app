import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";
import axios from "axios";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  const fetchUsers = async () => {
    const promise = await fetch("http://localhost:8000/users");
    return promise;
  };

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const updateList = async (person) => {
    try {
      await postUser(person)
        .then((res) => res.json())
        .then((user) => setCharacters([...characters, user]))
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const postUser = async (person) => {
    const promise = await fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    if (promise.status === 201) {
      return promise;
    } else {
      console.error("User Insertion Failed");
    }
  };

  const removeOneCharacter = async (index) => {
    const userId = characters[index].id;

    try {
      const response = await deleteUser(userId);

      if (response) {
        const updated = characters.filter((character, i) => {
          return i !== index;
        });
        setCharacters(updated);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (userId) => {
    const response = await axios.delete(
      `http://localhost:8000/users/${userId}`
    );

    if (response.status === 204) {
      return response;
    } else {
      console.error("User Deletion Failed");
    }
  };

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
