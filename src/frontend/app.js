const API_BASE = "http://localhost:8080";

// -----------------------------
// Navigation
// -----------------------------
function showSection(sectionId) {
    document.querySelectorAll(".content-section").forEach(section => {
        section.classList.remove("active");
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    const activeNav = document.querySelector(
        `.nav-item[data-section="${sectionId}"]`
    );

    if (activeNav) {
        activeNav.classList.add("active");
    }

    const titles = {
        dashboard: "Dashboard",
        deliveries: "Deliveries",
        routes: "Route Optimizer",
        vehicles: "Vehicle Management",
        planning: "Smart Planning",
        ai: "AI Assistant"
    };

    const pageTitle = document.getElementById("pageTitle");

    if (pageTitle) {
        pageTitle.textContent = titles[sectionId] || "Dashboard";
    }
}

// -----------------------------
// Safe HTML
// -----------------------------
function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// -----------------------------
// API Helper
// -----------------------------
async function apiRequest(url) {
    const response = await fetch(API_BASE + url);

    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
}

// -----------------------------
// Load Deliveries
// -----------------------------
async function loadDeliveries() {
    const containers = [
        document.getElementById("recentDeliveries"),
        document.getElementById("allDeliveries")
    ];

    try {
        const deliveries = await apiRequest("/api/deliveries");

        updateDashboardStats(deliveries);

        const html = deliveries.map(delivery => `
            <div class="delivery-card">
                <div>
                    <strong>${escapeHtml(delivery.customerName)}</strong>
                    <p>
                        ${escapeHtml(delivery.pickupLocation)}
                        → 
                        ${escapeHtml(delivery.deliveryLocation)}
                    </p>
                </div>

                <div class="delivery-info">
                    <span class="priority ${escapeHtml(
                        (delivery.priority || "").toLowerCase()
                    )}">
                        ${escapeHtml(delivery.priority)}
                    </span>

                    <span>
                        ${escapeHtml(delivery.distanceKm)} km
                    </span>

                    <span>
                        ${escapeHtml(delivery.status)}
                    </span>
                </div>
            </div>
        `).join("");

        containers.forEach(container => {
            if (container) {
                container.innerHTML =
                    html || "<p>No deliveries found.</p>";
            }
        });

    } catch (error) {
        console.error(error);

        containers.forEach(container => {
            if (container) {
                container.innerHTML =
                    "<p>Unable to load deliveries. Is the Java server running?</p>";
            }
        });
    }
}

// -----------------------------
// Dashboard Statistics
// -----------------------------
function updateDashboardStats(deliveries) {
    const totalDeliveries =
        document.getElementById("totalDeliveries");

    const highPriority =
        document.getElementById("highPriority");

    const totalDistance =
        document.getElementById("totalDistance");

    if (totalDeliveries) {
        totalDeliveries.textContent = deliveries.length;
    }

    if (highPriority) {
        const highCount = deliveries.filter(
            d => (d.priority || "").toUpperCase() === "HIGH"
        ).length;

        highPriority.textContent = highCount;
    }

    if (totalDistance) {
        const distance = deliveries.reduce(
            (sum, d) => sum + Number(d.distanceKm || 0),
            0
        );

        totalDistance.textContent =
            `${distance.toFixed(0)} km`;
    }
}

// -----------------------------
// Priority Queue
// -----------------------------
async function loadPriority() {
    const resultContainer =
        document.getElementById("recentDeliveries");

    try {
        const deliveries =
            await apiRequest("/api/deliveries/priority");

        showSection("deliveries");

        resultContainer.innerHTML = `
            <div class="result-card">
                <h3>Priority Queue Result</h3>
                <p>Deliveries ordered by operational priority.</p>

                ${deliveries.map((delivery, index) => `
                    <div class="result-item">
                        <strong>#${index + 1}
                            ${escapeHtml(delivery.customerName)}
                        </strong>

                        <span class="priority ${escapeHtml(
                            (delivery.priority || "").toLowerCase()
                        )}">
                            ${escapeHtml(delivery.priority)}
                        </span>
                    </div>
                `).join("")}
            </div>
        `;

    } catch (error) {
        resultContainer.innerHTML =
            "<p>Unable to calculate priority queue.</p>";
    }
}

// -----------------------------
// Route Optimization - Dijkstra
// -----------------------------
async function optimizeRoute() {
    const from =
        document.getElementById("routeFrom").value;

    const to =
        document.getElementById("routeTo").value;

    const result =
        document.getElementById("routeResult");

    if (!from || !to) {
        result.innerHTML =
            "<p>Please select both locations.</p>";
        return;
    }

    if (from === to) {
        result.innerHTML =
            "<p>Pickup and destination must be different.</p>";
        return;
    }

    result.innerHTML = "<p>Calculating optimal route...</p>";

    try {
        const data = await apiRequest(
            `/api/routes/shortest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
        );

        result.innerHTML = `
            <div class="result-card success">
                <h3>Optimal Route Found</h3>

                <p>
                    <strong>Route:</strong>
                    ${data.route.map(escapeHtml).join(" → ")}
                </p>

                <p>
                    <strong>Distance:</strong>
                    ${Number(data.shortestDistanceKm).toFixed(0)} km
                </p>

                <p>
                    <strong>Algorithm:</strong>
                    ${escapeHtml(data.algorithm)}
                </p>
            </div>
        `;

    } catch (error) {
        console.error(error);

        result.innerHTML =
            "<p>Unable to calculate route. Check the selected locations.</p>";
    }
}

// -----------------------------
// Vehicle Assignment
// -----------------------------
async function loadVehicles() {
    const result =
        document.getElementById("vehicleResults");

    result.innerHTML =
        "<p>Assigning vehicles...</p>";

    try {
        const assignments =
            await apiRequest(
                "/api/optimization/vehicle-assignment"
            );

        result.innerHTML = `
            <div class="result-card">
                <h3>Vehicle Assignment</h3>

                ${assignments.map((assignment, index) => `
                    <div class="result-item">
                        <span>#${index + 1}</span>
                        <strong>${escapeHtml(assignment)}</strong>
                    </div>
                `).join("")}
            </div>
        `;

    } catch (error) {
        console.error(error);

        result.innerHTML =
            "<p>Unable to assign vehicles.</p>";
    }
}

// -----------------------------
// Smart Delivery Planning
// -----------------------------
async function loadPlanning() {
    const maxDistance =
        document.getElementById("maxDistance").value;

    const result =
        document.getElementById("planningResults");

    result.innerHTML =
        "<p>Optimizing delivery plan...</p>";

    try {
        const deliveries =
            await apiRequest(
                `/api/optimization/delivery-plan?maxDistance=${maxDistance}`
            );

        const totalDistance = deliveries.reduce(
            (sum, delivery) =>
                sum + Number(delivery.distanceKm || 0),
            0
        );

        result.innerHTML = `
            <div class="result-card success">
                <h3>Optimized Delivery Plan</h3>

                <p>
                    <strong>Maximum Distance:</strong>
                    ${maxDistance} km
                </p>

                <p>
                    <strong>Selected Distance:</strong>
                    ${totalDistance.toFixed(0)} km
                </p>

                <p>
                    <strong>Deliveries Selected:</strong>
                    ${deliveries.length}
                </p>

                <div class="planning-list">
                    ${deliveries.map((delivery, index) => `
                        <div class="result-item">
                            <span>#${index + 1}</span>

                            <strong>
                                ${escapeHtml(delivery.customerName)}
                            </strong>

                            <span>
                                ${escapeHtml(delivery.priority)}
                            </span>

                            <span>
                                ${Number(delivery.distanceKm).toFixed(0)} km
                            </span>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);

        result.innerHTML =
            "<p>Unable to create delivery plan.</p>";
    }
}

// -----------------------------
// AI Logistics Insight
// -----------------------------
async function generateAIInsight() {
    const result =
        document.getElementById("aiResult");

    result.innerHTML =
        "<p>Analyzing logistics data...</p>";

    try {
        const deliveries =
            await apiRequest("/api/deliveries");

        if (deliveries.length === 0) {
            result.innerHTML =
                "<p>No delivery data available for analysis.</p>";
            return;
        }

        const highPriority = deliveries.filter(
            d => (d.priority || "").toUpperCase() === "HIGH"
        ).length;

        const totalDistance = deliveries.reduce(
            (sum, d) => sum + Number(d.distanceKm || 0),
            0
        );

        let recommendation =
            "Operations look balanced. Continue monitoring delivery priorities and route efficiency.";

        if (highPriority >= 2) {
            recommendation =
                "Multiple high-priority deliveries detected. Consider assigning the fastest available vehicles and optimizing their routes first.";
        }

        if (totalDistance > 2000) {
            recommendation +=
                " The total delivery distance is relatively high, so route consolidation could reduce travel cost.";
        }

        result.innerHTML = `
            <div class="ai-insight">
                <h3>Smart Logistics Insight</h3>

                <p>${escapeHtml(recommendation)}</p>

                <div class="ai-metrics">
                    <span>
                        Deliveries: ${deliveries.length}
                    </span>

                    <span>
                        High Priority: ${highPriority}
                    </span>

                    <span>
                        Total Distance:
                        ${totalDistance.toFixed(0)} km
                    </span>
                </div>

                <small>
                    Current insight is generated from live logistics
                    data. The real AI prediction engine will be connected
                    in the next stage.
                </small>
            </div>
        `;

    } catch (error) {
        console.error(error);

        result.innerHTML =
            "<p>AI analysis unavailable. Check the backend.</p>";
    }
}

// -----------------------------
// Start Application
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
    showSection("dashboard");
    loadDeliveries();
});