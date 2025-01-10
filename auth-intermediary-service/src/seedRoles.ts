import { Document } from "mongoose"
import { getRoleModel, IRole } from "./models/roles.model"

const DEFAULT_ROLES: Omit<IRole, keyof Document>[] = [
        {
            role: "appAdmin",
            allowedFeatures: [
                "ManageUsers",
                "ManageRoles",
                "ViewReports",
                "ApproveRequests",
                "CreateShipment",
                "ViewShipments",
                "AssignDriver",
                "TrackShipment",
                "AddDriver",
                "ViewDrivers",
                "AssignLoads",
                "TrackLoads",
                "ViewAssignedLoads",
                "UpdateLoadStatus",
                "updateDriverInfo",
                "TrackRoute",
                "GetDriverDetails",
                "GetStaffDetails",
                "GetVehicleDetails",
                "GetCarrierDetails",
                "GetShipperDetails",
                "GetBidDetails",
                "GetShipmentDetails",
                "GetAllDriverDetails",
                "GetAllStaffDetails",
                "GetAllVehicleDetails",
                "GetAllCarrierDetails",
                "GetAllShipperDetails",
                "GetAllBidDetails",
                "GetAllShipmentDetails",
                "AddOnBoarding",
                "GetTruckDetails",
                "UpdateTruck",
                "DeleteUserResource",
                "GetPayments",
                "GetAdminBids",
                "GetLoadInfo",
                "GetBids",
            ],
        },
        {
            role: "shipperAdmin",
            allowedFeatures: [
                "CreateShipment",
                "ViewShipments",
                "AssignDriver",
                "TrackShipment",
                "AddPickup",
                "AddClient",
                "GetAllPickups",
                "GetAllClients",
                "AddLoad",
                "GetShipperDetails",
                "GetShipperBids",
                "GetLoadInfo",
                "GetShipperDetails",
                "GetCarrierDetails",
                "UpdateLoad",
                "createPayment",
                "GetPickupInfo",
                "GetClientInfo",
                "DeleteUserResource",
                "verifyPayment",
                "GetPayments",
            ],
        },
        {
            role: "carrierAdmin",
            allowedFeatures: [
                "AddDriver",
                "ViewDrivers",
                "AssignLoads",
                "TrackLoads",
                "GetBids",
                "GetLoadInfo",
                "GetAllCompanyDrivers",
                "GetDriverDetails",
                "AddTruck",
                "GetAllCompanyTrucks",
                "updateDriverInfo",
                "AddOnBoarding",
                "GetTruckDetails",
                "UpdateTruck",
                "GetShipperDetails",
                "GetCarrierDetails",
                "AddBid",
                "DeleteUserResource",
                "GetPayments",
                "UpdateLoad",
                "UpdateCompany",
            ],
        },
        {
            role: "driver",
            allowedFeatures: [
                "ViewAssignedLoads",
                "UpdateLoadStatus",
                "TrackRoute",
                "GetDriverDetails",
                "AddOnBoarding",
                "UpdateTruck",
                "GetShipperBids",
                "GetLoadInfo",
                "UpdateLoad",
                "updateDriverInfo",
            ],
        },
        {
            role: "shipperStaff",
            allowedFeatures: ["ViewShipments", "TrackShipment"],
        },
    ]

  export const seedRoles = async (): Promise<void> => {
      const RoleModel = getRoleModel()

      try {
          const existingRoles = await RoleModel.find()
          if (existingRoles.length > 0) {
              console.log(
                  `Skipping role seeding: ${existingRoles.length} roles exist`
              )
              return
          }

          await RoleModel.deleteMany({})
          await RoleModel.insertMany(DEFAULT_ROLES)
          console.log("Roles seeded successfully")
      } catch (error) {
          console.error("Role seeding failed:", error)
          throw error
      }
  }
