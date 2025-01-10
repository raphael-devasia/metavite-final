"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resource_service_1 = require("../services/resource.service"); // Services for fetching data
const auth_middleware_1 = require("../middlewares/auth.middleware");
const load_service_1 = require("../services/load.service");
const user_service_1 = require("../services/user.service");
const router = express_1.default.Router();
// Route to fetch all drivers
router.get("/drivers", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    try {
        const response = yield (0, resource_service_1.getAllDrivers)(token);
        console.log(response);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
// Route to fetch all staffs
router.get("/staffs", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    try {
        const response = yield (0, resource_service_1.getAllStaffs)(token);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
// Route to fetch all vehicles
router.get("/vehicles", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    try {
        const response = yield (0, resource_service_1.getAllVehicles)(token);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
// Route to fetch all carriers
router.get("/carriers", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    try {
        const response = yield (0, resource_service_1.getAllCarriers)(token);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
// Route to fetch all shippers
router.get("/shippers", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    try {
        const response = yield (0, resource_service_1.getAllShippers)(token);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
// Route to fetch all bids
router.get("/bids/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    const shipperId = req.params.id;
    console.log(shipperId);
    try {
        const response = yield (0, load_service_1.getAllShipperBids)(token, shipperId);
        console.log("the pickup response is ", response);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
// Route to fetch all shipments
router.get("/shipments", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    try {
        const response = yield (0, resource_service_1.getAllShipments)(token);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
// Route to add client details
router.post("/add-client", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const client = req.body;
    try {
        const response = yield (0, resource_service_1.addClients)(token, client);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
router.post("/add-pickup", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const pickup = req.body;
    try {
        const response = yield (0, resource_service_1.addPickup)(token, pickup);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
// Route to fetch all shippers
router.get("/pick-ups/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    const shipperId = req.params.id;
    console.log(shipperId);
    try {
        const response = yield (0, resource_service_1.getAllPickups)(token, shipperId);
        console.log("the pickup response is ", response);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
// Route to fetch all shippers
router.get("/clients/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    const shipperId = req.params.id;
    console.log(shipperId);
    try {
        const response = yield (0, resource_service_1.getAllClients)(token, shipperId);
        console.log(response);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
router.post("/add-load", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const load = req.body;
    try {
        const response = yield (0, resource_service_1.addLoad)(token, load);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
router.get("/get-shipper/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    const id = req.params.id;
    const token = req.query.token;
    try {
        const response = yield (0, resource_service_1.getShipper)(token, id);
        console.log(response);
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
router.get("/load-info/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("shipper info requested");
    const id = req.params.id;
    const token = req.query.token;
    try {
        const response = yield (0, load_service_1.getLoadInfo)(token, id);
        console.log(response);
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
router.get("/pickup-info/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("shipper info requested");
    const id = req.params.id;
    const token = req.query.token;
    try {
        const response = yield (0, resource_service_1.getPickupInfo)(token, id);
        console.log(response);
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
router.get("/client-info/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("shipper info requested");
    const id = req.params.id;
    const token = req.query.token;
    try {
        const response = yield (0, resource_service_1.getClientInfo)(token, id);
        console.log(response);
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
router.get("/get-carrier/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    const id = req.params.id;
    const token = req.query.token;
    try {
        const response = yield (0, resource_service_1.getCarrier)(token, id);
        console.log(response);
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
router.post("/update-load-info/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const token = req.body.token;
    const target = req.body.id;
    try {
        const response = yield (0, load_service_1.updateLoadInfo)(id, token, target);
        console.log(response);
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
router.post("/delete-resource/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const token = req.body.token;
    const target = req.body.target;
    try {
        const response = yield (0, user_service_1.updateUserResource)(id, token, target);
        console.log(response);
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
router.post("/create-razorpay-order/", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const paymentData = req.body;
    try {
        const response = yield (0, resource_service_1.createRazorPay)(token, paymentData);
        console.log(response);
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
router.post("/verify-payment/", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const paymentData = req.body;
    try {
        const response = yield (0, resource_service_1.verifyRazorPay)(token, paymentData);
        console.log(response);
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
// Route to fetch all shippers
router.get("/payments", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    try {
        const response = yield (0, resource_service_1.getAllPayments)(token);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
// Route to fetch all shippers
router.get("/payments/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    const loadId = req.params.id;
    try {
        const response = yield (0, resource_service_1.getPayment)(token, loadId);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        });
    }
}));
exports.default = router;
