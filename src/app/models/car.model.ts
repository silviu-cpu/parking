export interface Car {
    licensePlate: string
    entryTime: Date
    exitTime?: Date | null
    parkingFee?: Number
    isParked: boolean
}