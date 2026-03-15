import requests
from flask import Flask, Response

app = Flask(__name__)

@app.route("/mediafire/token")
def token():

    url = "https://www.mediafire.com/application/get_session_token.php"

    r = requests.post(url)

    return Response(r.text, content_type="application/json")

app.run(port=5000)