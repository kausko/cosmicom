const MODE = "PROD"; // toggle between TEST and PROD

const SERVER_URI = MODE === "TEST" ? "http://localhost:8000" : "https://cosmicom.herokuapp.com"

export default SERVER_URI;