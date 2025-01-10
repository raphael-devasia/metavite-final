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
exports.updateDriverInfo = exports.updateUserResource = exports.updateCarrierInfo = exports.updateTruckInfo = exports.addDriverInfo = exports.getDriver = void 0;
const carrier_repository_1 = require("../repositories/carrier.repository");
const shipper_repository_1 = require("../repositories/shipper.repository");
const verify_repository_1 = require("../repositories/verify.repository");
const getDriver = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    const isAuthorizedToAccess = yield (0, verify_repository_1.isAuthorized)(token, "GetDriverDetails");
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(verify_repository_1.isAuthorized);
        return yield (0, carrier_repository_1.fetchDriverInformation)(id);
    }
    return false;
});
exports.getDriver = getDriver;
const addDriverInfo = (id, token, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(token);
    const isAuthorizedToAccess = yield (0, verify_repository_1.isAuthorized)(data.token, "AddOnBoarding");
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(verify_repository_1.isAuthorized);
        return yield (0, carrier_repository_1.postDriverOnBoarding)(id, data);
    }
    return false;
});
exports.addDriverInfo = addDriverInfo;
const updateTruckInfo = (id, token, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(token);
    const isAuthorizedToAccess = yield (0, verify_repository_1.isAuthorized)(data.token, "UpdateTruck");
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(verify_repository_1.isAuthorized);
        return yield (0, carrier_repository_1.postTruckUpdate)(id, data);
    }
    return false;
});
exports.updateTruckInfo = updateTruckInfo;
const updateCarrierInfo = (id, token, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(token);
    const isAuthorizedToAccess = yield (0, verify_repository_1.isAuthorized)(data.token, "UpdateCompany");
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(verify_repository_1.isAuthorized);
        return yield (0, carrier_repository_1.postCarrierUpdate)(id, data);
    }
    return false;
});
exports.updateCarrierInfo = updateCarrierInfo;
const updateUserResource = (id, token, target) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(token);
    console.log('the target body is ', target);
    const isAuthorizedToAccess = yield (0, verify_repository_1.isAuthorized)(token, "DeleteUserResource");
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(verify_repository_1.isAuthorized);
        return yield (0, shipper_repository_1.deleteUserResource)(id, target);
    }
    return false;
});
exports.updateUserResource = updateUserResource;
const updateDriverInfo = (id, token, data) => __awaiter(void 0, void 0, void 0, function* () {
    const isAuthorizedToAccess = yield (0, verify_repository_1.isAuthorized)(data.token, "updateDriverInfo");
    if (isAuthorizedToAccess.isAuthorized) {
        console.log(verify_repository_1.isAuthorized);
        return yield (0, carrier_repository_1.updateDriverDetails)(id, data);
    }
    return false;
});
exports.updateDriverInfo = updateDriverInfo;
// export const getShipper = async (id: string, token: string) => {
//     const isAuthorizedToAccess = await isAuthorized(token, "GetShipperDetails")
//     if (isAuthorizedToAccess.isAuthorized) {
//         console.log(isAuthorized)
//         return await fetchDriverInformation(id)
//     }
//     return false
// }
// export const getCarrier = async (id: string, token: string) => {
//     const isAuthorizedToAccess = await isAuthorized(token, "GetCarrierDetails")
//     if (isAuthorizedToAccess.isAuthorized) {
//         console.log(isAuthorized)
//         return await fetchDriverInformation(id)
//     }
//     return false
// }
