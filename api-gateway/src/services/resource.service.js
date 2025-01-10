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
exports.verifyRazorPay = exports.createRazorPay = exports.getCarrier = exports.getPickupInfo = exports.getClientInfo = exports.getTruck = exports.getAllBids = exports.addBid = exports.addTruck = exports.getShipper = exports.getAllCompanyTrucks = exports.getAllCompanyDrivers = exports.getAllClients = exports.getAllPickups = exports.addPickup = exports.addLoad = exports.addClients = exports.getAllShipments = exports.getPayment = exports.getAllActiveBids = exports.getAllPayments = exports.getAllShippers = exports.getAllCarriers = exports.getAllVehicles = exports.getAllStaffs = exports.getAllDrivers = void 0;
const carrier_repository_1 = require("../repositories/carrier.repository");
const carrier_repository_2 = require("../repositories/carrier.repository");
const carrier_repository_3 = require("../repositories/carrier.repository");
const load_repositor_1 = require("../repositories/load.repositor");
const payment_repository_1 = require("../repositories/payment.repository");
const shipper_repository_1 = require("../repositories/shipper.repository");
const shipper_repository_2 = require("../repositories/shipper.repository");
const shipper_repository_3 = require("../repositories/shipper.repository");
const verify_repository_1 = require("../repositories/verify.repository");
// Generic function to check authorization and fetch data
const fetchResource = (token, permission, fetchFunction) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, verify_repository_1.isAuthorized)(token, permission);
    if (!(user === null || user === void 0 ? void 0 : user.isAuthorized)) {
        throw new Error("Unauthorized access");
    }
    return yield fetchFunction();
});
const fetchShipperResources = (token, permission, data, fetchFunction) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, verify_repository_1.isAuthorized)(token, permission);
    if (!(user === null || user === void 0 ? void 0 : user.isAuthorized)) {
        throw new Error("Unauthorized access");
    }
    return yield fetchFunction(data);
});
// Generic function to check authorization and post data
const registerResource = (token, permission, data, fetchFunction) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(token);
    const user = yield (0, verify_repository_1.isAuthorized)(token, permission);
    if (!(user === null || user === void 0 ? void 0 : user.isAuthorized)) {
        throw new Error("Unauthorized access");
    }
    return yield fetchFunction(data);
});
// Service to fetch all drivers
const getAllDrivers = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchResource(token, "GetAllDriverDetails", carrier_repository_1.fetchDrivers);
});
exports.getAllDrivers = getAllDrivers;
// Service to fetch all staffs
const getAllStaffs = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchResource(token, "GetAllStaffDetails", shipper_repository_2.fetchStaffs);
});
exports.getAllStaffs = getAllStaffs;
// Service to fetch all vehicles
const getAllVehicles = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchResource(token, "GetAllVehicleDetails", carrier_repository_2.fetchVehicles);
});
exports.getAllVehicles = getAllVehicles;
// Service to fetch all carriers
const getAllCarriers = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchResource(token, "GetCarriers", carrier_repository_3.fetchCarriers);
});
exports.getAllCarriers = getAllCarriers;
// Service to fetch all shippers
const getAllShippers = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchResource(token, "GetShippers", shipper_repository_1.fetchShippers);
});
exports.getAllShippers = getAllShippers;
// Service to fetch all Payments
const getAllPayments = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchResource(token, "GetPayments", payment_repository_1.fetchAllPayments);
});
exports.getAllPayments = getAllPayments;
// Service to fetch all Active bids
const getAllActiveBids = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchShipperResources(token, "GetBids", id, load_repositor_1.fetchActiveBids);
});
exports.getAllActiveBids = getAllActiveBids;
// Service to fetch all bids
const getPayment = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchShipperResources(token, "GetPayments", id, payment_repository_1.fetchPayment);
});
exports.getPayment = getPayment;
// Service to fetch all shipments
const getAllShipments = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchResource(token, "GetShipments", shipper_repository_3.fetchShipments);
});
exports.getAllShipments = getAllShipments;
// Service to add a new client
const addClients = (token, client) => __awaiter(void 0, void 0, void 0, function* () {
    return yield registerResource(token, "AddClient", client, shipper_repository_1.addNewClients);
});
exports.addClients = addClients;
// Service to add a new client
const addLoad = (token, load) => __awaiter(void 0, void 0, void 0, function* () {
    return yield registerResource(token, "AddLoad", load, load_repositor_1.addNewLoad);
});
exports.addLoad = addLoad;
// Service to add a new pickup
const addPickup = (token, pickup) => __awaiter(void 0, void 0, void 0, function* () {
    return yield registerResource(token, "AddPickup", pickup, shipper_repository_1.addNewPickUp);
});
exports.addPickup = addPickup;
// Service to add a new pickup
const getAllPickups = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchShipperResources(token, "GetAllPickups", id, shipper_repository_1.fetchAllPickups);
});
exports.getAllPickups = getAllPickups;
const getAllClients = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchShipperResources(token, "GetAllClients", id, shipper_repository_1.fetchAllClients);
});
exports.getAllClients = getAllClients;
// Service to fetch all drivers
const getAllCompanyDrivers = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchShipperResources(token, "GetAllCompanyDrivers", id, carrier_repository_1.fetchAllCompanyDrivers);
});
exports.getAllCompanyDrivers = getAllCompanyDrivers;
const getAllCompanyTrucks = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchShipperResources(token, "GetAllCompanyTrucks", id, carrier_repository_1.fetchAllCompanyTrucks);
});
exports.getAllCompanyTrucks = getAllCompanyTrucks;
const getShipper = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("checking the value swapped tokn and id", id);
    return yield fetchShipperResources(token, "GetShipperDetails", id, shipper_repository_1.fetchShipperData);
});
exports.getShipper = getShipper;
const addTruck = (token, truck) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("the first point data is ", token);
    return yield registerResource(token, "AddTruck", truck, carrier_repository_1.addNewTruck);
});
exports.addTruck = addTruck;
const addBid = (token, truck) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("the first point data is ", token);
    return yield registerResource(token, "AddBid", truck, load_repositor_1.addNewBid);
});
exports.addBid = addBid;
// Service to fetch all bids
const getAllBids = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchShipperResources(token, "GetBids", id, load_repositor_1.fetchActiveBids);
});
exports.getAllBids = getAllBids;
const getTruck = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("checking the value swapped tokn and id", id);
    return yield fetchShipperResources(token, "GetTruckDetails", id, carrier_repository_1.fetchTruckData);
});
exports.getTruck = getTruck;
const getClientInfo = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("checking the value swapped tokn and id", id);
    return yield fetchShipperResources(token, "GetClientInfo", id, shipper_repository_1.fetchClientData);
});
exports.getClientInfo = getClientInfo;
const getPickupInfo = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("checking the value swapped tokn and id", id);
    return yield fetchShipperResources(token, "GetPickupInfo", id, shipper_repository_1.fetchPickupData);
});
exports.getPickupInfo = getPickupInfo;
const getCarrier = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("checking the value swapped tokn and id", id);
    return yield fetchShipperResources(token, "GetCarrierDetails", id, carrier_repository_1.fetchCarrierDetails);
});
exports.getCarrier = getCarrier;
const createRazorPay = (token, paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("the first point data is ", paymentData);
    return yield registerResource(token, "createPayment", paymentData, payment_repository_1.newPaymentMethod);
});
exports.createRazorPay = createRazorPay;
const verifyRazorPay = (token, paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("the first point data is ", paymentData);
    return yield registerResource(token, "verifyPayment", paymentData, payment_repository_1.verifyPaymentMethod);
});
exports.verifyRazorPay = verifyRazorPay;
