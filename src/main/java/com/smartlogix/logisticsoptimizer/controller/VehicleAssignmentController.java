package com.smartlogix.logisticsoptimizer.controller;

import com.smartlogix.logisticsoptimizer.model.DeliveryOrder;
import com.smartlogix.logisticsoptimizer.model.Vehicle;
import com.smartlogix.logisticsoptimizer.repository.DeliveryOrderRepository;
import com.smartlogix.logisticsoptimizer.service.VehicleAssignmentService;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/optimization")
@CrossOrigin(origins = "*")
public class VehicleAssignmentController {

    private final DeliveryOrderRepository repository;
    private final VehicleAssignmentService assignmentService;

    public VehicleAssignmentController(
            DeliveryOrderRepository repository,
            VehicleAssignmentService assignmentService) {

        this.repository = repository;
        this.assignmentService = assignmentService;
    }

    @GetMapping("/vehicle-assignment")
    public List<String> assignVehicles() {

        List<DeliveryOrder> deliveries = repository.findAll();

        List<Vehicle> vehicles = Arrays.asList(
                new Vehicle("KA-01-AB-1001", 400, true),
                new Vehicle("KA-01-CD-2002", 600, true),
                new Vehicle("KA-01-EF-3003", 800, true),
                new Vehicle("KA-01-GH-4004", 1200, true)
        );

        return assignmentService.assignVehicles(
                deliveries,
                vehicles
        );
    }
}