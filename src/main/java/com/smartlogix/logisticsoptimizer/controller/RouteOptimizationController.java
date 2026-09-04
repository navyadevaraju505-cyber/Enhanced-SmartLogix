package com.smartlogix.logisticsoptimizer.controller;

import com.smartlogix.logisticsoptimizer.service.RouteOptimizationService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteOptimizationController {

    private final RouteOptimizationService routeOptimizationService;

    public RouteOptimizationController(
            RouteOptimizationService routeOptimizationService) {
        this.routeOptimizationService = routeOptimizationService;
    }

    @GetMapping("/shortest")
    public Map<String, Object> findShortestRoute(
            @RequestParam String from,
            @RequestParam String to) {

        return routeOptimizationService.findShortestRoute(from, to);
    }
}