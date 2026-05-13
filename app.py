from flask import Flask, jsonify, render_template, request
import requests
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

NDUS = os.environ.get("NDUS")
JSTOKEN = os.environ.get("JSTOKEN")
#NDUS = "Y2LRyrnteHui8ZhW2X2gzKRCEeyhICEYkF8LsqET"
#JSTOKEN = "96C96A66214BBDCBEF696B036D9733ECD92682E2C25C3225D4EAA1F33C793C75E0244B7B3D87AF09DA6A4580D6D72F6A33E20CC7698E28F85DA7FF48F3517149"
coockie = 'csrfToken=SBdzAmxs-Mb975UsNY2C262r; browserid=SsnVPHUWjb0tS8dL5eu-7ynIxCgG-WmfhaYaozmTNwB8B2T5dl2X7ibiMqQ=; __stripe_mid=cc79b488-8707-41de-9f4d-c3fb24d83b2e76eaa7; TSID=h7A1mxCr2cqWL0or8GaVGUFI4KBJV6ww; __bid_n=19e1edb1b2ecfd3f344207; ndus=Y2LRyrnteHui8ZhW2X2gzKRCEeyhICEYkF8LsqET; lang=en; __stripe_sid=386415a4-1755-423f-839b-c4c445827d7a621117; ndut_fmt=FA37CBD1DA1605846785B0BD665C38630776BC8835DF6ED1C9FBC46D2FD26CB3; ndut_fmv=f8b828e3b9bd03beffc2752270908978e9c3ba3c6a344ee70def2e90977dad2ed29777504c8f6d024e23b51018ed10966565587e84629e958e48c69a34db0f0bff8257cecb556c7a51a1fdfbc9804c39a66365090dca217731d4958460c6a56c1486fcc21c76960f02981ca6e55ca5c3; g_state={"i_l":0,"i_ll":1778659574604,"i_e":{"enable_itp_optimization":0},"i_et":1778629389921,"i_b":"4lYMRkRcynLuHWQ9eQpcKNJ4gQR2z8DKepLHSwg/K7E"}'

HEADERS = {
    "Cookie": coockie,
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

    url = "https://www.terabox.com/api/filemetas"

    params = {
        "app_id": "250528",
        "jsToken": JSTOKEN,
        "target": json.dumps([int(fs_id)]),
        "dlink": 1
    }

    r = requests.get(
        url,
        headers=HEADERS,
        params=params
    )

    return r.json()

if __name__ == "__main__":
    #app.run(debug=True, port=5000)
    app.run(host="0.0.0.0", debug=True, port=int(os.environ.get("PORT", 5000)))