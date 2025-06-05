import React, { useState, useEffect } from "react";

function App() {
  const [joke, setJoke] = useState("");

  const fetchJoke = async () => {
    try {
      const response = await fetch("/joke"); // Calls Flask API
      const data = await response.json();
      setJoke(data.joke);
    } catch (error) {
      console.error("Error fetching joke:", error);
    }
  };

  const addToFavorites = async () => {
    await fetch("/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ joke }),
    });
  };

  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    const res = await fetch("/favorites");
    const data = await res.json();
    setFavorites(data.favorites);
  };

  const removeFavorite = async (jokeToRemove) => {
    await fetch("/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ joke: jokeToRemove }),
    });
    fetchFavorites();
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Random Dad Joke Generator 🤣</h1>
      <p style={{ fontSize: "24px" }}>{joke}</p>
      <button onClick={fetchJoke}>Get Another Joke</button>
      <button onClick={addToFavorites} style={{ marginLeft: "10px" }}>
        Add to Favorites
      </button>
      <div>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={fetchFavorites}
            style={{ marginTop: "20px", display: "block" }}
          >
            Show Favorites
          </button>
        </div>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {favorites.map((fav, index) => (
            <li key={index} style={{ margin: "10px 0" }}>
              {fav}
              <button
                onClick={() => removeFavorite(fav)}
                style={{ marginLeft: "10px" }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p style={{ fontStyle: "italic", color: "#888", textAlign: "center" }}>
        Click "Show Favorites" to see your saved jokes!
      </p>
    </div>
  );
}

export default App;
