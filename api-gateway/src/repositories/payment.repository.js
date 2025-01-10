"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPayment = exports.fetchAllPayments = exports.verifyPaymentMethod = exports.newPaymentMethod = void 0;
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path_1 = __importDefault(require("path"));
const LOAD_PROTO_PATH = path_1.default.join(__dirname, "../../../protos/payment.proto");
const packageDefinition = protoLoader.loadSync(LOAD_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const paymentProto = grpc.loadPackageDefinition(packageDefinition).payment;
const payment_client = new paymentProto.PaymentService("localhost:3009", grpc.credentials.createInsecure());
const newPaymentMethod = (paymentData) => {
    return new Promise((resolve, reject) => {
        const { amount, loadId, shipperId, carrierId } = paymentData;
        console.log('final data is', amount, loadId);
        payment_client.CreateOrder({ amount, loadId, shipperId, carrierId }, (error, response) => {
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
exports.newPaymentMethod = newPaymentMethod;
const verifyPaymentMethod = (paymentData) => {
    return new Promise((resolve, reject) => {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, loadId, } = paymentData;
        console.log("final data is", razorpay_payment_id, razorpay_order_id);
        payment_client.VerifyPayment({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            loadId,
        }, (error, response) => {
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
exports.verifyPaymentMethod = verifyPaymentMethod;
const fetchAllPayments = () => {
    console.log('reaching here too');
    return new Promise((resolve, reject) => {
        payment_client.GetAllPayments({}, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                console.log('the data which i am getting is ', response);
                resolve(response);
            }
        });
    });
};
exports.fetchAllPayments = fetchAllPayments;
// Fetch bids (assuming similar proto service exists)
const fetchPayment = (id) => {
    return new Promise((resolve, reject) => {
        payment_client.GetPayment({ id }, (error, response) => {
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
exports.fetchPayment = fetchPayment;
