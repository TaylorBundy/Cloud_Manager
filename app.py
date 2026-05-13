from flask import Flask, jsonify, render_template, request
import requests
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

NDUS = os.environ.get("NDUS")
JSTOKEN = os.environ.get("JSTOKEN")
#NDUS = "Y2LRyrnteHui8ZhW2X2gzKRCEeyhICEYkF8LsqET"
#JSTOKEN = "96C96A66214BBDCBEF696B036D9733ECD92682E2C25C3225D4EAA1F33C793C75E0244B7B3D87AF09DA6A4580D6D72F6A33E20CC7698E28F85DA7FF48F3517149"

HEADERS = {
    "Cookie": f"NDUS={NDUS}",
    "User-Agent": "Mozilla/5.0"
}

# @app.route("/")
# def index():
#     return render_template("index.html")

@app.route("/archivos")
def archivos():
    # obtener carpeta desde URL
    carpeta = request.args.get("dir", "/")

    url = "https://www.terabox.com/api/list"

    params = {
        "app_id": "250528",
        "jsToken": JSTOKEN,
        "dir": carpeta,
        "page": 1,
        "num": 100
    }

    r = requests.get(
        url,
        headers=HEADERS,
        params=params
    )

    return r.json()

@app.route("/lista")
def lista():

    url = "https://www.terabox.com/api/filemanager"

    params = {
        "app_id": "250528",
        "jsToken": JSTOKEN,
        "dir": "/",
        "page": 1,
        "num": 100
    }

    r = requests.get(
        url,
        headers=HEADERS,
        params=params
    )

    return r.json()

@app.route("/download")
def download():

    fs_id = request.args.get("fs_id")

    url = "https://www.terabox.com/api/download"

    params = {
        "app_id": "250528",
        "jsToken": JSTOKEN,
        "fidlist": f"[{fs_id}]"
    }

    r = requests.get(
        url,
        headers=HEADERS,
        params=params
    )

    return jsonify(r.json())

if __name__ == "__main__":
    #app.run(debug=True, port=5000)
    app.run(host="0.0.0.0", debug=True, port=int(os.environ.get("PORT", 5000)))