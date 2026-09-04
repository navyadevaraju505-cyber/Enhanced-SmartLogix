package com.smartlogix.logisticsoptimizer.model;

public class Vehicle {

    private String vehicleNumber;
    private double capacityKg;
    private boolean available;

    public Vehicle() {
    }

    public Vehicle(String vehicleNumber, double capacityKg, boolean available) {
        this.vehicleNumber = vehicleNumber;
        this.capacityKg = capacityKg;
        this.available = available;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public double getCapacityKg() {
        return capacityKg;
    }

    public void setCapacityKg(double capacityKg) {
        this.capacityKg = capacityKg;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}