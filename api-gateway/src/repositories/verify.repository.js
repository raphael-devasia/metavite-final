"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = exports.registerInvitation = exports.loginUserInDB = void 0;
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path_1 = __importDefault(require("path"));
const VERIFY_PROTO_PATH = path_1.default.join(__dirname, "../../../protos/auth.proto");
const packageDefinition = protoLoader.loadSync(VERIFY_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const verifyProto = grpc.loadPackageDefinition(packageDefinition).auth;
const verify_client = new verifyProto.AuthService("localhost:3005", grpc.credentials.createInsecure());
const loginUserInDB = (username, password) => {
    return new Promise((resolve, reject) => {
        verify_client.Login({ username, password }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.loginUserInDB = loginUserInDB;
const registerInvitation = (user) => {
    return new Promise((resolve, reject) => {
        verify_client.InvitationRegister({ user }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.registerInvitation = registerInvitation;
const isAuthorized = (token, feature) => {
    return new Promise((resolve, reject) => {
        verify_client.RoleAuthorization({ token, feature }, (error, response) => {
            if (error) {
                console.log('the error is', error);
                reject(error);
            }
            else {
                console.log('the response is ', response);
                resolve(response);
            }
        });
    });
};
exports.isAuthorized = isAuthorized;
