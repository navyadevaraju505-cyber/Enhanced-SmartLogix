package com.smartlogix.logisticsoptimizer.controller;

import com.smartlogix.logisticsoptimizer.model.DeliveryOrder;
import com.smartlogix.logisticsoptimizer.repository.DeliveryOrderRepository;
import com.smartlogix.logisticsoptimizer.service.DeliveryPriorityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "*")
public class DeliveryPriorityController {

    private final DeliveryOrderRepository repository;
    private final DeliveryPriorityService priorityService;

    public DeliveryPriorityController(
            DeliveryOrderRepository repository,
            DeliveryPriorityService priorityService) {
        this.repository = repository;
        this.priorityService = priorityService;
    }

    @GetMapping("/priority")
    public List<DeliveryOrder> getPrioritizedDeliveries() {

        List<DeliveryOrder> deliveries = repository.findAll();

        return priorityService.prioritizeDeliveries(deliveries);
    }
}