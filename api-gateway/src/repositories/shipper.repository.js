"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserResource = exports.fetchPickupData = exports.fetchClientData = exports.fetchShipperData = exports.fetchAllClients = exports.fetchAllPickups = exports.addNewPickUp = exports.addNewClients = exports.fetchShipments = exports.fetchBids = exports.fetchStaffs = exports.fetchShippers = void 0;
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path_1 = __importDefault(require("path"));
const SHIPPER_PROTO_PATH = path_1.default.join(__dirname, "../../../protos/shipper.proto");
const packageDefinition = protoLoader.loadSync(SHIPPER_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const carrierProto = grpc.loadPackageDefinition(packageDefinition).shipper;
const shipper_client = new carrierProto.ShipperService("localhost:3003", grpc.credentials.createInsecure());
// Fetch shippers
const fetchShippers = () => {
    return new Promise((resolve, reject) => {
        shipper_client.GetAllShippers({}, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve((response === null || response === void 0 ? void 0 : response.shippers) || []);
            }
        });
    });
};
exports.fetchShippers = fetchShippers;
// Fetch staffs (using the same logic, assuming similar proto service exists)
const fetchStaffs = () => {
    return new Promise((resolve, reject) => {
        shipper_client.GetAllStaffs({}, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve((response === null || response === void 0 ? void 0 : response.staffs) || []);
            }
        });
    });
};
exports.fetchStaffs = fetchStaffs;
// Fetch bids (assuming similar proto service exists)
const fetchBids = () => {
    return new Promise((resolve, reject) => {
        shipper_client.GetAllBids({}, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve((response === null || response === void 0 ? void 0 : response.bids) || []);
            }
        });
    });
};
exports.fetchBids = fetchBids;
// Fetch shipments (assuming similar proto service exists)
const fetchShipments = () => {
    return new Promise((resolve, reject) => {
        shipper_client.GetAllShipments({}, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve((response === null || response === void 0 ? void 0 : response.shipments) || []);
            }
        });
    });
};
exports.fetchShipments = fetchShipments;
// Adding New Clients
const addNewClients = (client) => {
    console.log(client);
    return new Promise((resolve, reject) => {
        shipper_client.RegisterNewClient(client, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.addNewClients = addNewClients;
// Adding New PickUp
const addNewPickUp = (address) => {
    return new Promise((resolve, reject) => {
        shipper_client.RegisterNewPickup(address, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.addNewPickUp = addNewPickUp;
// Fetch shipments (assuming similar proto service exists)
const fetchAllPickups = (id) => {
    return new Promise((resolve, reject) => {
        shipper_client.GetAllShipperPickUps({ id }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve((response === null || response === void 0 ? void 0 : response.addresses) || []);
            }
        });
    });
};
exports.fetchAllPickups = fetchAllPickups;
// Fetch shipments (assuming similar proto service exists)
const fetchAllClients = (id) => {
    return new Promise((resolve, reject) => {
        shipper_client.GetAllShipperClients({ id }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve((response === null || response === void 0 ? void 0 : response.addresses) || []);
            }
        });
    });
};
exports.fetchAllClients = fetchAllClients;
const fetchShipperData = (companyRefId) => {
    return new Promise((resolve, reject) => {
        shipper_client.GetShipperInfo({ companyRefId }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.fetchShipperData = fetchShipperData;
const fetchClientData = (companyRefId) => {
    return new Promise((resolve, reject) => {
        shipper_client.GetClientInfo({ id: companyRefId }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.fetchClientData = fetchClientData;
const fetchPickupData = (companyRefId) => {
    return new Promise((resolve, reject) => {
        shipper_client.GetPickupInfo({ id: companyRefId }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.fetchPickupData = fetchPickupData;
const deleteUserResource = (id, target) => {
    return new Promise((resolve, reject) => {
        shipper_client.DeleteUserResource({ id, target }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.deleteUserResource = deleteUserResource;
