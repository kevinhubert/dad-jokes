from flask import Flask, render_template, jsonify
import requests
from flask_cors import CORS
from flask import request
from flask import logging

app = Flask(__name__, template_folder="frontend/public")
CORS(app)

favorites_list = []

def get_random_joke():
    url = "https://icanhazdadjoke.com/"
    headers = {"Accept": "application/json"}
    
    try:
        response = requests.get(url, headers=headers)
        print("Status Code:", response.status_code)
        print("Response:", response.text)

        if response.status_code == 200:
            return response.json()["joke"]
        else:
            return "Oops! Couldn't fetch a joke right now."
    except Exception as e:
        print("Error fetching joke:", e)
        return "Error occurred."

# endpoint to serve a joke
@app.route("/joke")
def joke():
    return jsonify({"joke": get_random_joke()})  # Return JSON response

# Add a favorite
@app.route("/favorites", methods=["POST"])
def add_favorite():
    data = request.get_json()
    app.logger.info("Received data for favorites: %s", data)
    joke = data.get("joke")
    # if joke and joke not in favorites_list:
    favorites_list.append(joke)
    return jsonify({"favorites": favorites_list})

# Get favorites list
@app.route("/favorites", methods=["GET"])
def get_favorites():
    app.logger.info("Favorites list requested: %s", favorites_list)
    return jsonify({"favorites": favorites_list})

# Remove a joke from favorites
@app.route("/favorites", methods=["DELETE"])
def remove_favorite():
    data = request.get_json()
    joke = data.get("joke")
    if joke in favorites_list:
        favorites_list.remove(joke)
    return jsonify({"favorites": favorites_list})


if __name__ == "__main__":
    app.run(debug=True)