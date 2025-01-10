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
const auth_repository_1 = require("../repositories/auth.repository");
const router = express_1.default.Router();
router.post("/register", auth_middleware_1.validateRegister, auth_middleware_1.attachToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const { email, role, companyRefId, name, phoneNumber, token } = req.body;
        if (role === "driver") {
            let user = {
                email,
                role,
                companyRefId,
                name,
                phoneNumber,
                token,
            };
            const isInvited = yield (0, auth_repository_1.InvitedUserVerification)(user);
            if (!isInvited.success) {
                let response = {
                    message: "You are not invited to register",
                };
                return res.status(400).json(response);
            }
        }
        const response = yield (0, auth_service_1.registerUser)(req.body);
        if (response.message === "Email already exists for this role") {
            res.status(409).json(response);
        }
        else {
            res.status(201).json(response);
        }
    }
    catch (error) {
        res.status(500).json({ message: " Internal Server Error" });
    }
}));
router.post("/login", auth_middleware_1.validateLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const response = yield (0, auth_service_1.loginUser)(username, password);
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
