package com.smartlogix.logisticsoptimizer.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RouteOptimizationService {

    // Represents a road connection between two locations
    private static class Edge {
        String destination;
        double distance;

        Edge(String destination, double distance) {
            this.destination = destination;
            this.distance = distance;
        }
    }

    // Represents a location and its current shortest distance
    private static class Node implements Comparable<Node> {
        String location;
        double distance;

        Node(String location, double distance) {
            this.location = location;
            this.distance = distance;
        }

        @Override
        public int compareTo(Node other) {
            return Double.compare(this.distance, other.distance);
        }
    }

    // Graph containing locations and road distances
    private final Map<String, List<Edge>> graph = new HashMap<>();

    public RouteOptimizationService() {

        // ============================================================
        // CHENNAI → BENGALURU CORRIDOR
        // ============================================================

        addRoad("Chennai", "Sriperumbudur", 40);
        addRoad("Sriperumbudur", "Kanchipuram", 35);
        addRoad("Kanchipuram", "Vellore", 70);
        addRoad("Vellore", "Ambur", 50);
        addRoad("Ambur", "Vaniyambadi", 20);
        addRoad("Vaniyambadi", "Krishnagiri", 50);
        addRoad("Krishnagiri", "Hosur", 50);
        addRoad("Hosur", "Electronic City", 35);
        addRoad("Electronic City", "Bengaluru", 20);

        // Alternate Chennai-side connection
        addRoad("Chennai", "Tiruvallur", 45);
        addRoad("Tiruvallur", "Sriperumbudur", 35);

        // ============================================================
        // BENGALURU → HYDERABAD CORRIDOR
        // ============================================================

        addRoad("Bengaluru", "Hoskote", 30);
        addRoad("Hoskote", "Kolar", 55);
        addRoad("Kolar", "Palamaner", 65);
        addRoad("Palamaner", "Chittoor", 35);
        addRoad("Chittoor", "Tirupati", 70);
        addRoad("Tirupati", "Puttur", 55);
        addRoad("Puttur", "Nellore", 120);
        addRoad("Nellore", "Ongole", 130);
        addRoad("Ongole", "Guntur", 150);
        addRoad("Guntur", "Vijayawada", 35);
        addRoad("Vijayawada", "Suryapet", 150);
        addRoad("Suryapet", "Hyderabad", 140);

        // ============================================================
        // HYDERABAD → PUNE CORRIDOR
        // ============================================================

        addRoad("Hyderabad", "Zaheerabad", 100);
        addRoad("Zaheerabad", "Humnabad", 85);
        addRoad("Humnabad", "Kalaburagi", 80);
        addRoad("Kalaburagi", "Solapur", 230);
        addRoad("Solapur", "Indapur", 110);
        addRoad("Indapur", "Baramati", 65);
        addRoad("Baramati", "Daund", 65);
        addRoad("Daund", "Pune", 80);

        // Alternate Hyderabad connection
        addRoad("Hyderabad", "Vikarabad", 75);
        addRoad("Vikarabad", "Zaheerabad", 110);

        // ============================================================
        // PUNE → MUMBAI CORRIDOR
        // ============================================================

        addRoad("Pune", "Pimpri-Chinchwad", 20);
        addRoad("Pimpri-Chinchwad", "Talegaon", 25);
        addRoad("Talegaon", "Lonavala", 35);
        addRoad("Lonavala", "Khandala", 10);
        addRoad("Khandala", "Panvel", 75);
        addRoad("Panvel", "Navi Mumbai", 20);
        addRoad("Navi Mumbai", "Mumbai", 30);

        // Mumbai-side connection
        addRoad("Mumbai", "Thane", 25);
        addRoad("Thane", "Navi Mumbai", 35);

        // ============================================================
        // BENGALURU → MYSURU CORRIDOR
        // ============================================================

        addRoad("Bengaluru", "Kengeri", 20);
        addRoad("Kengeri", "Bidadi", 20);
        addRoad("Bidadi", "Ramanagara", 30);
        addRoad("Ramanagara", "Channapatna", 25);
        addRoad("Channapatna", "Maddur", 25);
        addRoad("Maddur", "Mandya", 45);
        addRoad("Mandya", "Srirangapatna", 45);
        addRoad("Srirangapatna", "Mysuru", 15);

        // ============================================================
        // CHENNAI → PUNE CORRIDOR
        // ============================================================

        addRoad("Vellore", "Tiruvannamalai", 90);
        addRoad("Tiruvannamalai", "Krishnagiri", 120);

        addRoad("Bengaluru", "Tumakuru", 70);
        addRoad("Tumakuru", "Chitradurga", 140);
        addRoad("Chitradurga", "Davanagere", 60);
        addRoad("Davanagere", "Hubballi", 160);
        addRoad("Hubballi", "Belagavi", 100);
        addRoad("Belagavi", "Kolhapur", 110);
        addRoad("Kolhapur", "Satara", 120);
        addRoad("Satara", "Pune", 120);

        // ============================================================
        // ADDITIONAL HYDERABAD → MUMBAI CONNECTION
        // ============================================================

        addRoad("Solapur", "Barshi", 70);
        addRoad("Barshi", "Latur", 125);
        addRoad("Latur", "Ahmednagar", 250);
        addRoad("Ahmednagar", "Pune", 120);
    }

    // ================================================================
    // ADD TWO-WAY ROAD
    // ================================================================

    private void addRoad(String from, String to, double distance) {

        graph.computeIfAbsent(from, k -> new ArrayList<>())
                .add(new Edge(to, distance));

        graph.computeIfAbsent(to, k -> new ArrayList<>())
                .add(new Edge(from, distance));
    }

    // ================================================================
    // NORMALIZE LOCATION NAMES
    // Supports both Bangalore and Bengaluru
    // ================================================================

    private String normalizeLocation(String location) {

        if (location == null) {
            return null;
        }

        String cleaned = location.trim();

        if (cleaned.equalsIgnoreCase("Bangalore")) {
            return "Bengaluru";
        }

        if (cleaned.equalsIgnoreCase("Bengaluru")) {
            return "Bengaluru";
        }

        if (cleaned.equalsIgnoreCase("Mysore")) {
            return "Mysuru";
        }

        if (cleaned.equalsIgnoreCase("Mysuru")) {
            return "Mysuru";
        }

        return cleaned;
    }

    // ================================================================
    // DIJKSTRA'S SHORTEST PATH ALGORITHM
    // USING PRIORITY QUEUE
    // ================================================================

    public Map<String, Object> findShortestRoute(
            String start,
            String destination) {

        // Convert aliases to the graph's official names
        start = normalizeLocation(start);
        destination = normalizeLocation(destination);

        // Validate locations
        if (start == null || destination == null) {
            throw new RuntimeException(
                    "Start location and destination are required"
            );
        }

        if (!graph.containsKey(start)) {
            throw new RuntimeException(
                    "Start location not found: " + start
            );
        }

        if (!graph.containsKey(destination)) {
            throw new RuntimeException(
                    "Destination location not found: " + destination
            );
        }

        // ============================================================
        // INITIALIZE DISTANCES
        // ============================================================

        Map<String, Double> distances = new HashMap<>();

        // Stores the previous location used to reach each location
        Map<String, String> previous = new HashMap<>();

        // Initially every location is infinitely far away
        for (String location : graph.keySet()) {
            distances.put(location, Double.MAX_VALUE);
        }

        // Starting location has distance 0
        distances.put(start, 0.0);

        // ============================================================
        // PRIORITY QUEUE
        // ============================================================

        PriorityQueue<Node> priorityQueue = new PriorityQueue<>();

        priorityQueue.add(
                new Node(start, 0.0)
        );

        // ============================================================
        // DIJKSTRA
        // ============================================================

        while (!priorityQueue.isEmpty()) {

            // Get location with smallest known distance
            Node current = priorityQueue.poll();

            // Ignore outdated queue entries
            if (current.distance >
                    distances.get(current.location)) {

                continue;
            }

            // Stop once destination has been reached
            if (current.location.equals(destination)) {
                break;
            }

            // Explore all neighbouring locations
            for (Edge edge :
                    graph.getOrDefault(
                            current.location,
                            Collections.emptyList())) {

                double newDistance =
                        current.distance + edge.distance;

                // If a shorter route is found
                if (newDistance <
                        distances.get(edge.destination)) {

                    distances.put(
                            edge.destination,
                            newDistance
                    );

                    // Remember how we reached this location
                    previous.put(
                            edge.destination,
                            current.location
                    );

                    // Add updated distance to Priority Queue
                    priorityQueue.add(
                            new Node(
                                    edge.destination,
                                    newDistance
                            )
                    );
                }
            }
        }

        // ============================================================
        // BUILD COMPLETE ROUTE
        // ============================================================

        List<String> route = new ArrayList<>();

        String current = destination;

        // Destination could not be reached
        if (distances.get(destination) == Double.MAX_VALUE) {
            throw new RuntimeException(
                    "No route available between "
                            + start + " and " + destination
            );
        }

        // Walk backwards using the previous map
        while (current != null) {

            route.add(current);

            if (current.equals(start)) {
                break;
            }

            current = previous.get(current);
        }

        // Reverse so route starts from origin
        Collections.reverse(route);

        // ============================================================
        // RETURN RESULT
        // ============================================================

        Map<String, Object> result =
                new LinkedHashMap<>();

        result.put("from", start);
        result.put("to", destination);

        result.put(
                "shortestDistanceKm",
                distances.get(destination)
        );

        // This contains ALL intermediate locations
        result.put("route", route);

        result.put(
                "numberOfStops",
                route.size()
        );

        result.put(
                "algorithm",
                "Dijkstra + Priority Queue"
        );

        return result;
    }
}