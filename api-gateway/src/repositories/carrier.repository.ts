const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
import path from "path"
import { ICompany, IUser, IUserInvitation } from "../models/user.models"


const CARRIER_PROTO_PATH = path.join("/app/metaVite_Proto_Files/carrier.proto")
const packageDefinition = protoLoader.loadSync(CARRIER_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

const carrierProto = grpc.loadPackageDefinition(packageDefinition).carrier

// const carrier_client = new (carrierProto as any).CarrierService(
//     "localhost:3002",
//     grpc.credentials.createInsecure()
// )
const carrier_client = new (carrierProto as any).CarrierService(
    "carrier-service:3002",
    grpc.credentials.createInsecure()
)

export const fetchDriverInformation = (id: string): Promise<IUser> => {
    return new Promise((resolve, reject) => {
        carrier_client.GetDriverInfo({ id }, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
    })
}


// Fetch drivers
export const fetchDrivers = (): Promise<IUser[]> => {
    
    
    return new Promise((resolve, reject) => {
        carrier_client.GetAllDrivers({}, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response?.drivers || [])
            }
        })
    })
}

// Fetch vehicles
export const fetchVehicles = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        carrier_client.GetAllVehicles({}, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                console.log(response);
                
                resolve(response)
            }
        })
    })
}

// Fetch carriers
export const fetchCarriers = (): Promise<IUser[]> => {
    return new Promise((resolve, reject) => {
        carrier_client.GetAllCarriers({}, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response?.carriers || [])
            }
        })
    })
}
// Fetch One carriers
export const fetchCarrierDetails = (companyRefId: string): Promise<ICompany> => {
    return new Promise((resolve, reject) => {
        console.log("the last place ", companyRefId)

        carrier_client.GetCompanyInfo(
            { companyRefId },
            (error: any, response: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response )
                }
            }
        )
    })
}

// Fetch One carriers
export const postDriverOnBoarding = (id: string, driver:any): Promise<ICompany> => {
    return new Promise((resolve, reject) => {
        carrier_client.PostDriverOnboarding(
            { id ,driver},
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
// Fetch One carriers
export const postTruckUpdate = (id: string, truck:any): Promise<any> => {
    return new Promise((resolve, reject) => {
        carrier_client.PostTruckUpdate(
            { id ,truck},
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
export const postCarrierUpdate = (id: string, data: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        carrier_client.PostCarrierUpdate(
            { id, data },
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
export const updateDriverDetails = (id: string, driver: any): Promise<ICompany> => {
    return new Promise((resolve, reject) => {
        carrier_client.updateDriverDetails(
            { id, driver },
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


export const fetchAllCompanyDrivers = (id:string): Promise<IUser[]|null> => {
    return new Promise((resolve, reject) => {
        console.log('get all company drivers',id);
        
        carrier_client.GetAllCompanyDrivers(
            { id },
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

export const addNewTruck = (truck: string): Promise<any| null> => {
    return new Promise((resolve, reject) => {
        console.log('the truck is ',truck);
        
        carrier_client.RegisterNewTruck(
            { truck },
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

export const fetchAllCompanyTrucks = (id: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        carrier_client.GetAllCarrierTrucks(
            { id },
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


export const fetchTruckData = (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        carrier_client.fetchTruckData({ id }, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
    })
}
