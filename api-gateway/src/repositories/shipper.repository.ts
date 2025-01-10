import { IClient, ICompany, ILoadData, IUser } from "../models/user.models" // Assuming IUser is defined in your models
const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
import path from "path"



const SHIPPER_PROTO_PATH = path.join("/app/metaVite_Proto_Files/shipper.proto")
const packageDefinition = protoLoader.loadSync(SHIPPER_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})
interface IResult {
    success: boolean
    data: any
    message: string
}

const carrierProto = grpc.loadPackageDefinition(packageDefinition).shipper
// const shipper_client = new (carrierProto as any).ShipperService(
//     "localhost:3003",
//     grpc.credentials.createInsecure()
// )
const shipper_client = new (carrierProto as any).ShipperService(
    "shipper-service:3003",
    grpc.credentials.createInsecure()
)


// Fetch shippers
export const fetchShippers = (): Promise<IUser[]> => {
    return new Promise((resolve, reject) => {
        shipper_client.GetAllShippers({}, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response?.shippers || [])
            }
        })
    })
}

// Fetch staffs (using the same logic, assuming similar proto service exists)
export const fetchStaffs = (): Promise<IUser[]> => {
    return new Promise((resolve, reject) => {
        shipper_client.GetAllStaffs({}, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response?.staffs || [])
            }
        })
    })
}

// Fetch bids (assuming similar proto service exists)
export const fetchBids = (): Promise<IUser[]> => {
    return new Promise((resolve, reject) => {
        shipper_client.GetAllBids({}, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response?.bids || [])
            }
        })
    })
}

// Fetch shipments (assuming similar proto service exists)
export const fetchShipments = (): Promise<IUser[]> => {
    return new Promise((resolve, reject) => {
        shipper_client.GetAllShipments({}, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response?.shipments || [])
            }
        })
    })
}

// Adding New Clients
export const addNewClients = (client: any): Promise<IResult> => {
    console.log(client)

    return new Promise((resolve, reject) => {
        shipper_client.RegisterNewClient(
            client,
            (error: any, response: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            }
        )
    })
}

// Adding New PickUp
export const addNewPickUp = (address: any): Promise<IResult> => {
    return new Promise((resolve, reject) => {
        shipper_client.RegisterNewPickup(
            address,
            (error: any, response: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            }
        )
    })
}
// Fetch shipments (assuming similar proto service exists)
export const fetchAllPickups = (id: string): Promise<IClient[]> => {
    return new Promise((resolve, reject) => {
        shipper_client.GetAllShipperPickUps(
            { id },
            (error: any, response: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response?.addresses || [])
                }
            }
        )
    })
}
// Fetch shipments (assuming similar proto service exists)
export const fetchAllClients = (id: string): Promise<IClient[]> => {
    return new Promise((resolve, reject) => {
        shipper_client.GetAllShipperClients(
            { id },
            (error: any, response: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response?.addresses || [])
                }
            }
        )
    })
}

export const fetchShipperData = (companyRefId: string): Promise<ICompany> => {
    return new Promise((resolve, reject) => {
        shipper_client.GetShipperInfo(
            { companyRefId },
            (error: any, response: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            }
        )
    })
}
export const fetchClientData = (companyRefId: string): Promise<ICompany> => {
    return new Promise((resolve, reject) => {
        shipper_client.GetClientInfo(
            { id: companyRefId },
            (error: any, response: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            }
        )
    })
}
export const fetchPickupData = (companyRefId: string): Promise<ICompany> => {
    return new Promise((resolve, reject) => {
        shipper_client.GetPickupInfo(
            { id: companyRefId },
            (error: any, response: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            }
        )
    })
}

export const deleteUserResource = (
    id: string,
    target: any
): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve, reject) => {
        shipper_client.DeleteUserResource(
            { id, target },
            (error: any, response: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            }
        )
    })
}
