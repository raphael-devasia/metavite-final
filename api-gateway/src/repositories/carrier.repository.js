"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTruckData = exports.fetchAllCompanyTrucks = exports.addNewTruck = exports.fetchAllCompanyDrivers = exports.updateDriverDetails = exports.postCarrierUpdate = exports.postTruckUpdate = exports.postDriverOnBoarding = exports.fetchCarrierDetails = exports.fetchCarriers = exports.fetchVehicles = exports.fetchDrivers = exports.fetchDriverInformation = void 0;
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path_1 = __importDefault(require("path"));
const CARRIER_PROTO_PATH = path_1.default.join(__dirname, "../../../protos/carrier.proto");
const packageDefinition = protoLoader.loadSync(CARRIER_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const carrierProto = grpc.loadPackageDefinition(packageDefinition).carrier;
const carrier_client = new carrierProto.CarrierService("localhost:3002", grpc.credentials.createInsecure());
const fetchDriverInformation = (id) => {
    return new Promise((resolve, reject) => {
        carrier_client.GetDriverInfo({ id }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.fetchDriverInformation = fetchDriverInformation;
// Fetch drivers
const fetchDrivers = () => {
    return new Promise((resolve, reject) => {
        carrier_client.GetAllDrivers({}, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve((response === null || response === void 0 ? void 0 : response.drivers) || []);
            }
        });
    });
};
exports.fetchDrivers = fetchDrivers;
// Fetch vehicles
const fetchVehicles = () => {
    return new Promise((resolve, reject) => {
        carrier_client.GetAllVehicles({}, (error, response) => {
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
exports.fetchVehicles = fetchVehicles;
// Fetch carriers
const fetchCarriers = () => {
    return new Promise((resolve, reject) => {
        carrier_client.GetAllCarriers({}, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve((response === null || response === void 0 ? void 0 : response.carriers) || []);
            }
        });
    });
};
exports.fetchCarriers = fetchCarriers;
// Fetch One carriers
const fetchCarrierDetails = (companyRefId) => {
    return new Promise((resolve, reject) => {
        console.log("the last place ", companyRefId);
        carrier_client.GetCompanyInfo({ companyRefId }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.fetchCarrierDetails = fetchCarrierDetails;
// Fetch One carriers
const postDriverOnBoarding = (id, driver) => {
    return new Promise((resolve, reject) => {
        carrier_client.PostDriverOnboarding({ id, driver }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.postDriverOnBoarding = postDriverOnBoarding;
// Fetch One carriers
const postTruckUpdate = (id, truck) => {
    return new Promise((resolve, reject) => {
        carrier_client.PostTruckUpdate({ id, truck }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.postTruckUpdate = postTruckUpdate;
const postCarrierUpdate = (id, data) => {
    return new Promise((resolve, reject) => {
        carrier_client.PostCarrierUpdate({ id, data }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.postCarrierUpdate = postCarrierUpdate;
const updateDriverDetails = (id, driver) => {
    return new Promise((resolve, reject) => {
        carrier_client.updateDriverDetails({ id, driver }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.updateDriverDetails = updateDriverDetails;
const fetchAllCompanyDrivers = (id) => {
    return new Promise((resolve, reject) => {
        console.log('get all company drivers', id);
        carrier_client.GetAllCompanyDrivers({ id }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.fetchAllCompanyDrivers = fetchAllCompanyDrivers;
const addNewTruck = (truck) => {
    return new Promise((resolve, reject) => {
        console.log('the truck is ', truck);
        carrier_client.RegisterNewTruck({ truck }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.addNewTruck = addNewTruck;
const fetchAllCompanyTrucks = (id) => {
    return new Promise((resolve, reject) => {
        carrier_client.GetAllCarrierTrucks({ id }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.fetchAllCompanyTrucks = fetchAllCompanyTrucks;
const fetchTruckData = (id) => {
    return new Promise((resolve, reject) => {
        carrier_client.fetchTruckData({ id }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.fetchTruckData = fetchTruckData;
