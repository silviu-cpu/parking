import { Injectable } from '@angular/core';
import { Car } from '../models/car.model'

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private parkingCapacity = 10;
  private parkingSlots: Car[] = [];

  constructor() {}

  getAvailableParkingSpaces(): number {
    // Calculate the number of parked vehicles (those with isParked set to true)
    const parkedVehiclesCount = this.parkingSlots.filter((car) => car.isParked).length;
    
    // Calculate the available parking spaces
    const availableSpaces = this.parkingCapacity - parkedVehiclesCount;
  
    return availableSpaces;
  }
  

  getVehicleList(): Car[] {
    return this.parkingSlots
  }

  parkVehicle(licensePlate: string, entryTime: Date): boolean {
    if (!licensePlate || !entryTime) {
      return false; // Validation failed
    }
  
    if (this.parkingSlots.length < this.parkingCapacity) {
      const vehicle: Car = {
        licensePlate,
        entryTime,
        exitTime: null,
        isParked: true
      };
      this.parkingSlots.push(vehicle)
      return true // Vehicle added successfully
    }
  
    return false // Parking lot is full
  }
  

  exitVehicle(licensePlate: string): Car | null {
    const exitedVehicleIndex = this.parkingSlots.findIndex((car) => car.licensePlate === licensePlate);
  
    if (exitedVehicleIndex !== -1) {
      const exitedVehicle = this.parkingSlots[exitedVehicleIndex];
      
      if (!exitedVehicle.isParked) {
        // The car has already exited, do nothing
        return null;
      }
  
      const exitTime = new Date(); // Get the current time as the exit time
      exitedVehicle.exitTime = exitTime;
  
      // Calculate the parking duration in milliseconds
      const entryTime = exitedVehicle.entryTime;
      const durationMilliseconds = exitTime.getTime() - entryTime.getTime();
  
      // Calculate the parking duration in hours (rounded up)
      const durationHours = Math.ceil(durationMilliseconds / (1000 * 60 * 60));
  
      // Calculate the parking fee based on the given rates
      let parkingFee = 10; // Initial fee for the first hour
      if (durationHours > 1) {
        parkingFee += (durationHours - 1) * 5; // Additional fee for each hour
      }
  
      exitedVehicle.parkingFee = parkingFee;
      exitedVehicle.isParked = false; // Set isParked to false for exited cars
     
      return exitedVehicle; // Return the exited vehicle with updated information
    }
  
    return null; // Return null if the vehicle is not found
  }
  
  
}
