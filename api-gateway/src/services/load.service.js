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
exports.updateLoadInfo = exports.getLoadInfo = exports.getAllAdminBids = exports.getAllShipperBids = void 0;
const load_repositor_1 = require("../repositories/load.repositor");
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
// Service to fetch all bids for Specific Shipper
const getAllShipperBids = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchShipperResources(token, "GetShipperBids", id, load_repositor_1.fetchShipperBids);
});
exports.getAllShipperBids = getAllShipperBids;
// Service to fetch all bids for Specific Shipper
const getAllAdminBids = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('the thing is ', token);
    return yield fetchShipperResources(token, "GetAdminBids", id, load_repositor_1.fetchShipperBids);
});
exports.getAllAdminBids = getAllAdminBids;
const getLoadInfo = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("checking the value swapped tokn and id", id);
    return yield fetchShipperResources(token, "GetLoadInfo", id, load_repositor_1.fetchLoadData);
});
exports.getLoadInfo = getLoadInfo;
const updateLoadInfo = (id, token, bidId) => __awaiter(void 0, void 0, void 0, function* () {
    const isAuthorizedToAccess = yield (0, verify_repository_1.isAuthorized)(token, "UpdateLoad");
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(verify_repository_1.isAuthorized);
        return yield (0, load_repositor_1.postLoadUpdate)(id, bidId);
    }
    return false;
});
exports.updateLoadInfo = updateLoadInfo;
