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
const auth_service_1 = require("../services/auth.service");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_service_1 = require("../services/user.service");
const resource_service_1 = require("../services/resource.service");
const load_service_1 = require("../services/load.service");
const router = express_1.default.Router();
router.post("/invite-driver", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, auth_service_1.inviteUser)(req.body);
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
router.get("/staff-driver/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    const id = req.params.id;
    const token = req.query.token;
    console.log('the token is ', token);
    try {
        const response = yield (0, user_service_1.getDriver)(id, token);
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
// Route to fetch all bids
router.get("/bids/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    const id = req.params.id;
    try {
        const response = yield (0, resource_service_1.getAllBids)(token, id);
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
router.get("/active-bids/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    const id = req.params.id;
    try {
        const response = yield (0, resource_service_1.getAllActiveBids)(token, id);
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
router.post("/staff-driver/add-info/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const token = req.query.token;
    const data = req.body;
    try {
        const response = yield (0, user_service_1.addDriverInfo)(id, token, data);
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
router.post("/staff-driver/update-info/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const token = req.query.token;
    const data = req.body;
    try {
        const response = yield (0, user_service_1.updateDriverInfo)(id, token, data);
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
router.post("/truck/update-info/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let token = req.query.token;
    if (!token) {
        token = req.body.token;
    }
    const data = req.body;
    console.log('the token is ', data);
    try {
        const response = yield (0, user_service_1.updateTruckInfo)(id, token, data);
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
router.post("/update-carrier-info/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let token = req.query.token;
    if (!token) {
        token = req.body.token;
    }
    const data = req.body;
    console.log("the token is ", data);
    try {
        const response = yield (0, user_service_1.updateCarrierInfo)(id, token, data);
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
router.get("/get-drivers/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    const carrierId = req.params.id;
    console.log(carrierId);
    try {
        const response = yield (0, resource_service_1.getAllCompanyDrivers)(token, carrierId);
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
router.get("/trucks/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    const carrierId = req.params.id;
    console.log(carrierId);
    try {
        const response = yield (0, resource_service_1.getAllCompanyTrucks)(token, carrierId);
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
router.post("/add-truck", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const data = req.body;
    try {
        const response = yield (0, resource_service_1.addTruck)(token, data);
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
router.post("/post-bid", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const data = req.body;
    try {
        const response = yield (0, resource_service_1.addBid)(token, data);
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
router.get("/load-info/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('shipper info requested');
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
router.get("/staff-driver/load-info/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
// Route to fetch all bids
router.get("/shipments/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.get("/staff-driver/shipments/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.get("/truck/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    const id = req.params.id;
    const token = req.query.token;
    try {
        const response = yield (0, resource_service_1.getTruck)(token, id);
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
router.post("/staff-driver/update-load-info/:id", auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = router;
