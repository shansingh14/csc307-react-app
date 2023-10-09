import express from "express";
import cors from "cors"

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};


const generateRandomID = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  const getRandomChar = (chars) =>
    chars[Math.floor(Math.random() * chars.length)];

  const randomLetters = Array.from({ length: 3 }, () =>
    getRandomChar(letters)
  ).join("");
  const randomNumbers = Array.from({ length: 3 }, () =>
    getRandomChar(numbers)
  ).join("");

  return randomLetters + randomNumbers;
};

const getUniqueID = (array) => {
  let id;
  const idExists = (id) => array.some((item) => item.id === id);

  do {
    id = generateRandomID();
  } while (idExists(id));

  return id;
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const newId = getUniqueID(users["users_list"]);
  userToAdd.id = newId;
  addUser(userToAdd);
  res.status(201).send(userToAdd);
});

app.delete("/users/:id", (req, res) => {
  const userToDelete = req.params["id"];
  deleteUser(userToDelete);
  res.status(204).send("Deletion Successful");
});

const deleteUser = (body) => {
  users["users_list"] = users["users_list"].filter(function (obj) {
    return obj.id !== body;
  });
};

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


