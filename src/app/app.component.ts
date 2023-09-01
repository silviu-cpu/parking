import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CarService } from './services/car.service';
import { Car } from './models/car.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  license: string = ''
  entryTimeInput: string = ''
  parkedVehicles: Array<Car> = []
  availableParkingSlots: number = 0
  showMessage: boolean = false
  message: string = ''
  exitedVehicles: Car[] = []

  constructor(private carService: CarService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateCarLists()
    this.parkedVehicles = this.carService.getVehicleList()
    this.availableParkingSlots = this.carService.getAvailableParkingSpaces()
  }

  updateCarLists(): void {
    const allCars = this.carService.getVehicleList()
    this.parkedVehicles = allCars.filter((car) => car.isParked)
    this.exitedVehicles = allCars.filter((car) => !car.isParked)
    this.cdr.detectChanges()
  }

  updateAvailableParkingSlots(): void {
    this.availableParkingSlots = this.carService.getAvailableParkingSpaces()
  }

  addVehicle(): void {
    const entryTimeDate = new Date(this.entryTimeInput) // Convert the input string to a Date object
  
    if (isNaN(entryTimeDate.getTime())) {
      this.message = 'Please enter a valid entry time.'
      this.showMessage = true
      return
    }
  
    if (!this.license || !entryTimeDate) {
      this.message = 'Please enter both the license plate and entry time.'
      this.showMessage = true
      return
    }
  
    const isAdded = this.carService.parkVehicle(this.license, entryTimeDate)
  
    if (isAdded) {
      // Update available parking slots
      this.availableParkingSlots = this.carService.getAvailableParkingSpaces()
  
      // Clear the input fields after parking
      this.license = ''
      this.entryTimeInput = ''
  
      // Update the car lists
      this.updateCarLists()
    } else {
      // Handle the case where the vehicle couldn't be added (e.g., parking full)
      this.message = 'Parking is full. Cannot add more vehicles.'
      this.showMessage = true
    }
  }
  
  exitVehicle(licensePlate: string): void {
    const exitedVehicle = this.carService.exitVehicle(licensePlate)
    if (exitedVehicle) {
      // Update the vehicle list with exit information
      const index = this.parkedVehicles.findIndex((v) => v.licensePlate === exitedVehicle.licensePlate)
      if (index !== -1) {
        this.parkedVehicles[index] = exitedVehicle
      }
    }
    // Update available parking slots
    this.updateAvailableParkingSlots()
    this.updateCarLists()

    this.cdr.detectChanges() // Ensure change detection is triggered
  }

  closeMessage(): void {
    this.showMessage = false
    this.message = ''
  }

  isFutureDate(date: string): boolean {
    const currentDate = new Date()
    const selectedDate = new Date(date)
    return selectedDate > currentDate
  }
  
}
