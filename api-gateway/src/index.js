"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require("body-parser");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const carrier_routes_1 = __importDefault(require("./routes/carrier.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const shipper_routes_1 = __importDefault(require("./routes/shipper.routes"));
const morgan = require("morgan");
const detect = require("detect-port");
dotenv.config();
const app = (0, express_1.default)();
const DEFAULT_PORT = 4000;
app.use(morgan("combined"));
app.use(express_1.default.json());
app.use(cors({
    origin: "http://localhost:4200", // Replace this with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods if needed
    credentials: true, // Enable if you need cookies
}));
app.use(bodyParser.json());
//THIS SECTION IS FOR THE ROUTES RELATED TO DIFFERENT SERVICES
app.use(auth_routes_1.default);
app.use(carrier_routes_1.default);
app.use(admin_routes_1.default);
app.use(shipper_routes_1.default);
detect(DEFAULT_PORT).then((port) => {
    if (port === DEFAULT_PORT) {
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    }
    else {
        console.log(`Port ${DEFAULT_PORT} is in use. Running on port ${port}.`);
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    }
});
