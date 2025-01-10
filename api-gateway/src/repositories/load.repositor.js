"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLoadUpdate = exports.addNewBid = exports.fetchActiveBids = exports.fetchBids = exports.fetchLoadData = exports.fetchShipperBids = exports.addNewLoad = void 0;
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path_1 = __importDefault(require("path"));
const LOAD_PROTO_PATH = path_1.default.join(__dirname, "../../../protos/load.proto");
const packageDefinition = protoLoader.loadSync(LOAD_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const carrierProto = grpc.loadPackageDefinition(packageDefinition).load;
const load_client = new carrierProto.LoadService("localhost:3007", grpc.credentials.createInsecure());
// Adding New Load
const addNewLoad = (load) => {
    console.log(load);
    return new Promise((resolve, reject) => {
        load_client.AddNewLoad(load, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.addNewLoad = addNewLoad;
// Fetch bids (assuming similar proto service exists)
const fetchShipperBids = (id) => {
    return new Promise((resolve, reject) => {
        load_client.GetShipperBids({ id }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                console.log(response);
                resolve(response);
            }
        });
    });
};
exports.fetchShipperBids = fetchShipperBids;
const fetchLoadData = (id) => {
    return new Promise((resolve, reject) => {
        load_client.GetLoadInfo({ id }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                console.log(response);
                resolve(response);
            }
        });
    });
};
exports.fetchLoadData = fetchLoadData;
// Fetch bids (assuming similar proto service exists)
const fetchBids = (id) => {
    return new Promise((resolve, reject) => {
        load_client.GetAllBids({ id }, (error, response) => {
            console.log('all bids received', response);
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.fetchBids = fetchBids;
const fetchActiveBids = (id) => {
    return new Promise((resolve, reject) => {
        console.log('the bid id is ', id);
        load_client.GetAllActiveBids({ id }, (error, response) => {
            console.log("all bids received", response);
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.fetchActiveBids = fetchActiveBids;
const addNewBid = (bid) => {
    return new Promise((resolve, reject) => {
        console.log("the bid is ", bid);
        load_client.AddBid({ bid }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.addNewBid = addNewBid;
const postLoadUpdate = (id, bidId) => {
    return new Promise((resolve, reject) => {
        console.log('the final in api', id, bidId);
        load_client.PostLoadUpdate({ id, bidId }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.postLoadUpdate = postLoadUpdate;
