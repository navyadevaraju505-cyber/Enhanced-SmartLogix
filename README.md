# SmartLogix — Intelligent Delivery & Logistics Optimization Platform

SmartLogix is a Java-based delivery and logistics optimization platform designed to improve delivery planning, route selection, vehicle assignment, and operational decision-making.

The system combines a Spring Boot backend, MySQL database, and professional web dashboard with practical Data Structures and Algorithms used in real logistics workflows.

---

## 🚀 Key Features

### 📦 Delivery Management
- View all delivery orders
- Search deliveries
- Filter by priority and status
- Track delivery distance and status
- REST API based delivery management

### 🗺️ Route Optimization
- Finds the shortest route between locations
- Uses **Dijkstra's Shortest Path Algorithm**
- Uses a **Priority Queue** for efficient route processing
- Displays optimized route and distance

### 🚚 Fleet Management
- Assigns deliveries to available vehicles
- Prioritizes high-priority deliveries
- Uses a **Greedy Algorithm**
- Displays vehicle assignments

### 📊 Smart Delivery Planning
- Selects valuable deliveries within a distance constraint
- Uses **Dynamic Programming**
- Calculates selected orders and distance utilization
- Helps optimize delivery planning

### 📈 Analytics
- Delivery priority distribution
- High, medium, and low priority statistics
- Operational overview

---

## 🧠 Data Structures & Algorithms

| Concept | Application |
|---|---|
| Graph | Represents the logistics road network |
| Dijkstra Algorithm | Finds shortest delivery routes |
| Priority Queue | Efficiently processes routes and delivery priorities |
| Greedy Algorithm | Assigns deliveries to vehicles |
| Dynamic Programming | Optimizes delivery selection under constraints |

---

## 🏗️ Technology Stack

### Backend
- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Maven

### Database
- MySQL

### Frontend
- HTML5
- CSS3
- JavaScript

### Development Tools
- VS Code
- MySQL Workbench
- Git
- GitHub

---

## 🏛️ Architecture

```text
                    SmartLogix
                        │
        ┌───────────────┴───────────────┐
        │                               │
   Web Dashboard                   REST APIs
        │                               │
 HTML / CSS / JS                 Spring Boot
                                        │
                              ┌─────────┴─────────┐
                              │                   │
                         Services            Repository
                              │                   │
                              │                 JPA
                              │                   │
                              └─────────┬─────────┘
                                        │
                                      MySQL


Project done by Navya D , UI/UX Enhancement by @NireekshaAP07 , Report and presentation by team - Navya D, Nireeksha A P Neha C B , Navyashree B K