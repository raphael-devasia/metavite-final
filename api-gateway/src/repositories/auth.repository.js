"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitedUserVerification = exports.registerUserInDB = void 0;
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path_1 = __importDefault(require("path"));
const PROTO_PATH = path_1.default.join(__dirname, "../../../protos/auth.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const authProto = grpc.loadPackageDefinition(packageDefinition).auth;
const auth_client = new authProto.AuthService("localhost:3001", grpc.credentials.createInsecure());
const verification_client = new authProto.AuthService("localhost:3005", grpc.credentials.createInsecure());
const registerUserInDB = (user) => {
    return new Promise((resolve, reject) => {
        console.log(user);
        auth_client.Register({ user }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.registerUserInDB = registerUserInDB;
const InvitedUserVerification = (user) => {
    return new Promise((resolve, reject) => {
        console.log(user);
        verification_client.ValidateRegister({ user }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.InvitedUserVerification = InvitedUserVerification;
