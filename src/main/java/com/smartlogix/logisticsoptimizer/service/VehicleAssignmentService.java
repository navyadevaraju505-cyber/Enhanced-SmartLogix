package com.smartlogix.logisticsoptimizer.service;

import com.smartlogix.logisticsoptimizer.model.DeliveryOrder;
import com.smartlogix.logisticsoptimizer.model.Vehicle;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class VehicleAssignmentService {

    public List<String> assignVehicles(
            List<DeliveryOrder> deliveries,
            List<Vehicle> vehicles) {

        List<String> assignments = new ArrayList<>();

        // Greedy strategy:
        // Process high-priority deliveries first
        deliveries.sort(
                Comparator.comparingInt(
                        delivery -> getPriorityValue(delivery.getPriority())
                )
        );

        // Use the smallest suitable available vehicle
        // to avoid wasting vehicle capacity.
        vehicles.sort(
                Comparator.comparingDouble(Vehicle::getCapacityKg)
        );

        for (DeliveryOrder delivery : deliveries) {

            Vehicle selectedVehicle = null;

            for (Vehicle vehicle : vehicles) {

                if (vehicle.isAvailable()) {

                    // Estimated shipment weight:
                    // 1 kg per km, capped at 1000 kg.
                    double estimatedWeight =
                            Math.min(delivery.getDistanceKm(), 1000);

                    if (vehicle.getCapacityKg() >= estimatedWeight) {
                        selectedVehicle = vehicle;
                        break;
                    }
                }
            }

            if (selectedVehicle != null) {

                selectedVehicle.setAvailable(false);

                assignments.add(
                        "Delivery #" + delivery.getId()
                                + " (" + delivery.getCustomerName() + ")"
                                + " -> Vehicle "
                                + selectedVehicle.getVehicleNumber()
                );

            } else {

                assignments.add(
                        "Delivery #" + delivery.getId()
                                + " (" + delivery.getCustomerName() + ")"
                                + " -> No suitable vehicle available"
                );
            }
        }

        return assignments;
    }

    private int getPriorityValue(String priority) {

        if (priority == null) {
            return 3;
        }

        return switch (priority.toUpperCase()) {
            case "HIGH" -> 1;
            case "MEDIUM" -> 2;
            case "LOW" -> 3;
            default -> 3;
        };
    }
}