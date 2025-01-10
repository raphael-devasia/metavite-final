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
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteUser = exports.loginUser = exports.registerUser = void 0;
const auth_repository_1 = require("../repositories/auth.repository");
const verify_repository_1 = require("../repositories/verify.repository");
const registerUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userRegister = yield (0, auth_repository_1.registerUserInDB)(user);
    return userRegister;
});
exports.registerUser = registerUser;
const loginUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, verify_repository_1.loginUserInDB)(username, password);
});
exports.loginUser = loginUser;
const inviteUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, verify_repository_1.registerInvitation)(user);
});
exports.inviteUser = inviteUser;
