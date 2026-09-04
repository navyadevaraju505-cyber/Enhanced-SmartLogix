/* =========================================================
   SMARTLOGIX V2
   Smart Delivery & Logistics Optimizer
   ========================================================= */

const API_BASE = "";

let deliveries = [];


/* =========================================================
   NAVIGATION
   ========================================================= */

function showSection(sectionId) {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    const target = document.getElementById(sectionId);

    if (target) {
        target.classList.add("active");
    }

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    const activeNav = Array.from(
        document.querySelectorAll(".nav-item")
    ).find(button =>
        button.getAttribute("onclick")?.includes(
            `'${sectionId}'`
        )
    );

    if (activeNav) {
        activeNav.classList.add("active");
    }

    const pageNames = {
        dashboard: "Command Center",
        deliveries: "Deliveries",
        routes: "Route Optimizer",
        vehicles: "Fleet Management",
        planning: "Smart Planning",
        analytics: "Analytics"
    };

    const pageName =
        pageNames[sectionId] || "SmartLogix";

    const pageTitle =
        document.getElementById("pageTitle");

    const breadcrumb =
        document.getElementById("breadcrumbText");

    if (pageTitle) {
        pageTitle.textContent = pageName;
    }

    if (breadcrumb) {
        breadcrumb.textContent = pageName;
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (sectionId === "analytics") {
        updateAnalytics();
    }
}


/* =========================================================
   API REQUEST HELPER
   ========================================================= */

async function apiRequest(url, options = {}) {

    const response = await fetch(
        API_BASE + url,
        {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        }
    );

    if (!response.ok) {
        throw new Error(
            `Request failed: ${response.status}`
        );
    }

    return response.json();
}


/* =========================================================
   LOAD DELIVERIES
   ========================================================= */

async function loadDeliveries() {

    const recentContainer =
        document.getElementById(
            "recentDeliveries"
        );

    const tableBody =
        document.getElementById(
            "allDeliveries"
        );

    try {

        if (recentContainer) {
            recentContainer.innerHTML =
                `<div class="loading-state">
                    Loading delivery data...
                </div>`;
        }

        const data =
            await apiRequest(
                "/api/deliveries"
            );

        deliveries =
            Array.isArray(data)
                ? data
                : [];

        updateDashboardStats();

        renderRecentDeliveries();

        renderDeliveryTable(
            deliveries
        );

        updateAnalytics();

    } catch (error) {

        console.error(
            "Delivery loading error:",
            error
        );

        if (recentContainer) {
            recentContainer.innerHTML =
                `<div class="loading-state">
                    Unable to load delivery data.
                </div>`;
        }

        if (tableBody) {
            tableBody.innerHTML =
                `<tr>
                    <td colspan="6">
                        <div class="loading-state">
                            Backend connection unavailable.
                        </div>
                    </td>
                </tr>`;
        }
    }
}


/* =========================================================
   DASHBOARD STATISTICS
   ========================================================= */

function updateDashboardStats() {

    const total =
        deliveries.length;


    const high =
        deliveries.filter(
            delivery =>
                normalize(delivery.priority) === "HIGH"
        ).length;


    const totalDistance =
        deliveries.reduce(
            (sum, delivery) =>
                sum +
                Number(
                    delivery.distanceKm || 0
                ),
            0
        );


    const active =
        deliveries.filter(
            delivery => {

                const status =
                    normalize(
                        delivery.status
                    );

                return (
                    status === "PENDING" ||
                    status === "IN TRANSIT"
                );
            }
        ).length;


    setText(
        "totalDeliveries",
        total
    );

    setText(
        "highPriority",
        high
    );

    setText(
        "totalDistance",
        formatNumber(
            totalDistance
        )
    );

    setText(
        "activeDeliveries",
        active
    );
}


/* =========================================================
   RECENT DELIVERIES
   ========================================================= */

function renderRecentDeliveries() {

    const container =
        document.getElementById(
            "recentDeliveries"
        );

    if (!container) {
        return;
    }


    if (!deliveries.length) {

        container.innerHTML =
            `<div class="empty-state">

                <div class="empty-icon">
                    ▣
                </div>

                <h3>
                    No deliveries found
                </h3>

                <p>
                    There are currently no
                    delivery records.
                </p>

            </div>`;

        return;
    }


    const recent =
        deliveries.slice(0, 5);


    container.innerHTML =
        recent.map(
            delivery => {

                const priority =
                    normalize(
                        delivery.priority
                    );

                const status =
                    normalize(
                        delivery.status
                    );

                return `
                    <div class="delivery-row">

                        <div class="delivery-id">
                            #${delivery.id ?? "--"}
                        </div>

                        <div class="delivery-customer">
                            ${escapeHtml(
                                delivery.customerName ||
                                "Unknown"
                            )}
                        </div>

                        <div class="delivery-route">
                            ${escapeHtml(
                                delivery.pickupLocation ||
                                "-"
                            )}
                            →
                            ${escapeHtml(
                                delivery.deliveryLocation ||
                                "-"
                            )}
                        </div>

                        <div>
                            <span
                                class="priority-badge
                                ${priorityClass(priority)}">

                                ${priority || "NORMAL"}

                            </span>
                        </div>

                        <div class="delivery-distance">
                            ${formatNumber(
                                delivery.distanceKm || 0
                            )}
                            km
                        </div>

                    </div>
                `;
            }
        ).join("");
}


/* =========================================================
   DELIVERY TABLE
   ========================================================= */

function renderDeliveryTable(list) {

    const tableBody =
        document.getElementById(
            "allDeliveries"
        );

    if (!tableBody) {
        return;
    }


    if (!list.length) {

        tableBody.innerHTML =
            `<tr>

                <td colspan="6">

                    <div class="empty-state">

                        <div class="empty-icon">
                            ⌕
                        </div>

                        <h3>
                            No matching deliveries
                        </h3>

                        <p>
                            Try changing your
                            search or filters.
                        </p>

                    </div>

                </td>

            </tr>`;

        return;
    }


    tableBody.innerHTML =
        list.map(
            delivery => {

                const priority =
                    normalize(
                        delivery.priority
                    );

                const status =
                    normalize(
                        delivery.status
                    );

                return `
                    <tr>

                        <td>
                            <strong>
                                #${delivery.id ?? "--"}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(
                                delivery.customerName ||
                                "Unknown"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                delivery.pickupLocation ||
                                "-"
                            )}
                            →
                            ${escapeHtml(
                                delivery.deliveryLocation ||
                                "-"
                            )}
                        </td>

                        <td>

                            <span
                                class="priority-badge
                                ${priorityClass(priority)}">

                                ${priority || "NORMAL"}

                            </span>

                        </td>

                        <td>
                            ${formatNumber(
                                delivery.distanceKm || 0
                            )}
                            km
                        </td>

                        <td>

                            <span
                                class="status-badge
                                ${statusClass(status)}">

                                ${status || "UNKNOWN"}

                            </span>

                        </td>

                    </tr>
                `;
            }
        ).join("");
}


/* =========================================================
   SEARCH + FILTER
   ========================================================= */

function filterDeliveries() {

    const search =
        (
            document.getElementById(
                "deliverySearch"
            )?.value || ""
        )
        .toLowerCase()
        .trim();


    const priority =
        document.getElementById(
            "priorityFilter"
        )?.value || "ALL";


    const status =
        document.getElementById(
            "statusFilter"
        )?.value || "ALL";


    const filtered =
        deliveries.filter(
            delivery => {

                const customer =
                    String(
                        delivery.customerName || ""
                    ).toLowerCase();


                const pickup =
                    String(
                        delivery.pickupLocation || ""
                    ).toLowerCase();


                const destination =
                    String(
                        delivery.deliveryLocation || ""
                    ).toLowerCase();


                const deliveryStatus =
                    normalize(
                        delivery.status
                    );


                const deliveryPriority =
                    normalize(
                        delivery.priority
                    );


                const matchesSearch =
                    !search ||
                    customer.includes(search) ||
                    pickup.includes(search) ||
                    destination.includes(search) ||
                    deliveryStatus
                        .toLowerCase()
                        .includes(search);


                const matchesPriority =
                    priority === "ALL" ||
                    deliveryPriority === priority;


                const matchesStatus =
                    status === "ALL" ||
                    deliveryStatus === status;


                return (
                    matchesSearch &&
                    matchesPriority &&
                    matchesStatus
                );
            }
        );


    renderDeliveryTable(
        filtered
    );
}


/* =========================================================
   ROUTE OPTIMIZER
   ========================================================= */

async function optimizeRoute() {

    const from =
        document.getElementById(
            "routeFrom"
        )?.value;


    const to =
        document.getElementById(
            "routeTo"
        )?.value;


    const result =
        document.getElementById(
            "routeResult"
        );


    if (!from || !to) {
        return;
    }


    if (from === to) {

        result.innerHTML =
            `<div class="empty-state">

                <div class="empty-icon">
                    !
                </div>

                <h3>
                    Invalid route
                </h3>

                <p>
                    Origin and destination
                    must be different.
                </p>

            </div>`;

        return;
    }


    result.innerHTML =
        `<div class="loading-state">
            Running Dijkstra optimization...
        </div>`;


    try {

        const data =
            await apiRequest(
                `/api/routes/shortest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
            );


        const route =
            Array.isArray(data.route)
                ? data.route
                : [];


        const distance =
            Number(
                data.shortestDistanceKm || 0
            );


        /*
         * This is only an estimated travel time
         * calculated by the frontend.
         */
        const estimatedHours =
            distance > 0
                ? distance / 60
                : 0;


        result.innerHTML =
            `
            <div class="route-result">

                <div class="route-summary">

                    <div class="route-metric">

                        <span>
                            SHORTEST DISTANCE
                        </span>

                        <strong>
                            ${formatNumber(distance)}
                            <small>km</small>
                        </strong>

                    </div>


                    <div class="route-metric">

                        <span>
                            EST. TRAVEL TIME
                        </span>

                        <strong>
                            ${formatHours(
                                estimatedHours
                            )}
                        </strong>

                    </div>

                </div>


                <div class="section-kicker">
                    OPTIMIZED PATH
                </div>


                <div class="route-timeline">

                    ${route.map(
                        (location, index) => `

                            <div class="route-node">
                                ${escapeHtml(location)}
                            </div>

                            ${
                                index <
                                route.length - 1
                                    ? `
                                        <span
                                            class="route-arrow">
                                            →
                                        </span>
                                      `
                                    : ""
                            }

                        `
                    ).join("")}

                </div>


                <div class="optimization-note">

                    <span class="note-icon">
                        ✓
                    </span>

                    <div>

                        <strong>
                            Route optimized successfully
                        </strong>

                        <p>
                            Calculated using
                            ${
                                escapeHtml(
                                    data.algorithm ||
                                    "Dijkstra + Priority Queue"
                                )
                            }.
                        </p>

                    </div>

                </div>

            </div>
            `;

    } catch (error) {

        console.error(
            "Route optimization error:",
            error
        );

        result.innerHTML =
            `<div class="empty-state">

                <div class="empty-icon">
                    !
                </div>

                <h3>
                    Optimization failed
                </h3>

                <p>
                    Unable to calculate the route.
                    Make sure the Spring Boot backend
                    is running.
                </p>

            </div>`;
    }
}


/* =========================================================
   VEHICLE ASSIGNMENT — GREEDY
   ========================================================= */

async function loadVehicles() {

    const container =
        document.getElementById(
            "vehicleResults"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        `<div class="loading-state">
            Running greedy fleet optimization...
        </div>`;


    try {

        const data =
            await apiRequest(
                "/api/optimization/vehicle-assignment"
            );


        const assignments =
            Array.isArray(data)
                ? data
                : [];


        if (!assignments.length) {

            container.innerHTML =
                `<div class="empty-state">

                    <div class="empty-icon">
                        ▰
                    </div>

                    <h3>
                        No assignments generated
                    </h3>

                    <p>
                        No vehicle allocation
                        data is available.
                    </p>

                </div>`;

            return;
        }


        container.innerHTML =
            `<div class="vehicle-results">

                ${assignments.map(
                    (assignment, index) => {

                        const text =
                            String(
                                assignment
                            );


                        const parts =
                            text.split("->");


                        const delivery =
                            parts[0]?.trim() ||
                            `Delivery ${index + 1}`;


                        const vehicle =
                            parts[1]?.trim() ||
                            "Unassigned";


                        return `
                            <div
                                class="vehicle-assignment">

                                <div>

                                    <strong>
                                        ${escapeHtml(
                                            delivery
                                        )}
                                    </strong>

                                    <span>
                                        Priority-aware allocation
                                    </span>

                                </div>


                                <div>

                                    <span>
                                        ASSIGNED VEHICLE
                                    </span>

                                    <strong>
                                        ${escapeHtml(
                                            vehicle
                                        )}
                                    </strong>

                                </div>

                            </div>
                        `;
                    }
                ).join("")}

            </div>`;

    } catch (error) {

        console.error(
            "Vehicle assignment error:",
            error
        );

        container.innerHTML =
            `<div class="empty-state">

                <div class="empty-icon">
                    !
                </div>

                <h3>
                    Assignment failed
                </h3>

                <p>
                    Unable to run the fleet
                    optimization engine.
                </p>

            </div>`;
    }
}


/* =========================================================
   SMART PLANNING — DYNAMIC PROGRAMMING
   ========================================================= */

async function loadPlanning() {

    const container =
        document.getElementById(
            "planningResults"
        );


    const input =
        document.getElementById(
            "maxDistance"
        );


    if (!container) {
        return;
    }


    const maxDistance =
        Number(
            input?.value || 1500
        );


    if (maxDistance <= 0) {

        container.innerHTML =
            `<div class="empty-state">

                <div class="empty-icon">
                    !
                </div>

                <h3>
                    Invalid constraint
                </h3>

                <p>
                    Maximum distance must be
                    greater than zero.
                </p>

            </div>`;

        return;
    }


    container.innerHTML =
        `<div class="loading-state">
            Running dynamic programming optimization...
        </div>`;


    try {

        const data =
            await apiRequest(
                `/api/optimization/delivery-plan?maxDistance=${encodeURIComponent(maxDistance)}`
            );


        renderPlanningResult(
            data,
            maxDistance
        );

    } catch (error) {

        console.error(
            "Planning error:",
            error
        );

        container.innerHTML =
            `<div class="empty-state">

                <div class="empty-icon">
                    !
                </div>

                <h3>
                    Planning failed
                </h3>

                <p>
                    Unable to generate the
                    optimized delivery plan.
                </p>

            </div>`;
    }
}


/* =========================================================
   SMART PLANNING RESULT
   ========================================================= */

function renderPlanningResult(
    data,
    maxDistance
) {

    const container =
        document.getElementById(
            "planningResults"
        );


    /*
     * IMPORTANT:
     * Our Spring Boot backend returns the selected
     * deliveries directly as a JSON array.
     *
     * Example:
     *
     * [
     *   {
     *      customerName: "Medical Center",
     *      distanceKm: 710
     *   },
     *   {
     *      customerName: "ABC Electronics",
     *      distanceKm: 350
     *   }
     * ]
     */

    const selected =
        Array.isArray(data)
            ? data
            : [];


    if (!selected.length) {

        container.innerHTML =
            `<div class="empty-state">

                <div class="empty-icon">
                    ◆
                </div>

                <h3>
                    No optimized deliveries
                </h3>

                <p>
                    No delivery combination fits
                    the ${formatNumber(
                        maxDistance
                    )} km constraint.
                </p>

            </div>`;

        return;
    }


    /*
     * Calculate the actual distance from
     * the selected deliveries.
     */

    const usedDistance =
        selected.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.distanceKm || 0
                ),
            0
        );


    /*
     * Calculate priority score.
     */

    const totalValue =
        selected.reduce(
            (sum, item) =>
                sum +
                priorityValue(
                    item.priority
                ),
            0
        );


    const utilization =
        maxDistance > 0
            ? Math.min(
                100,
                (
                    usedDistance /
                    maxDistance
                ) * 100
            )
            : 0;


    container.innerHTML =
        `
        <div class="planning-output">

            <div class="planning-metrics">

                <div class="route-metric">

                    <span>
                        SELECTED ORDERS
                    </span>

                    <strong>
                        ${selected.length}
                    </strong>

                </div>


                <div class="route-metric">

                    <span>
                        DISTANCE USED
                    </span>

                    <strong>
                        ${formatNumber(
                            usedDistance
                        )}
                        <small>
                            km
                        </small>
                    </strong>

                </div>


                <div class="route-metric">

                    <span>
                        CAPACITY UTILIZATION
                    </span>

                    <strong>
                        ${utilization.toFixed(0)}%
                    </strong>

                </div>

            </div>


            <div class="planning-progress">

                <div class="progress-header">

                    <span>
                        DISTANCE BUDGET
                    </span>

                    <strong>
                        ${formatNumber(
                            usedDistance
                        )}
                        /
                        ${formatNumber(
                            maxDistance
                        )}
                        km
                    </strong>

                </div>


                <div class="progress-track">

                    <div
                        class="progress-fill"
                        style="width:${utilization}%">
                    </div>

                </div>

            </div>


            <div class="selected-list">

                <div class="section-kicker">
                    SELECTED DELIVERIES
                </div>


                ${selected.map(
                    (item, index) => {

                        const customer =
                            item.customerName ||
                            `Delivery #${
                                item.id ||
                                index + 1
                            }`;


                        const distance =
                            Number(
                                item.distanceKm || 0
                            );


                        const priority =
                            normalize(
                                item.priority ||
                                "MEDIUM"
                            );


                        return `
                            <div
                                class="selected-delivery">

                                <div
                                    class="selected-number">

                                    ${String(
                                        index + 1
                                    ).padStart(2, "0")}

                                </div>


                                <div
                                    class="selected-info">

                                    <strong>
                                        ${escapeHtml(
                                            customer
                                        )}
                                    </strong>

                                    <span>
                                        ${priority}
                                        •
                                        ${escapeHtml(
                                            item.pickupLocation ||
                                            "-"
                                        )}
                                        →
                                        ${escapeHtml(
                                            item.deliveryLocation ||
                                            "-"
                                        )}
                                    </span>

                                </div>


                                <div
                                    class="selected-distance">

                                    ${formatNumber(
                                        distance
                                    )}
                                    km

                                </div>

                            </div>
                        `;
                    }
                ).join("")}

            </div>


            <div class="optimization-note">

                <span class="note-icon">
                    ✓
                </span>

                <div>

                    <strong>
                        Optimal delivery plan generated
                    </strong>

                    <p>
                        Dynamic Programming selected
                        ${selected.length}
                        deliveries using
                        ${formatNumber(
                            usedDistance
                        )} km of the
                        ${formatNumber(
                            maxDistance
                        )} km limit.
                    </p>

                </div>

            </div>

        </div>
        `;
}


/* =========================================================
   ANALYTICS
   ========================================================= */

function updateAnalytics() {

    if (!deliveries.length) {

        setText(
            "highCount",
            0
        );

        setText(
            "mediumCount",
            0
        );

        setText(
            "lowCount",
            0
        );

        setBar(
            "highBar",
            0
        );

        setBar(
            "mediumBar",
            0
        );

        setBar(
            "lowBar",
            0
        );

        return;
    }


    const high =
        deliveries.filter(
            delivery =>
                normalize(
                    delivery.priority
                ) === "HIGH"
        ).length;


    const medium =
        deliveries.filter(
            delivery =>
                normalize(
                    delivery.priority
                ) === "MEDIUM"
        ).length;


    const low =
        deliveries.filter(
            delivery =>
                normalize(
                    delivery.priority
                ) === "LOW"
        ).length;


    const total =
        deliveries.length;


    setText(
        "highCount",
        high
    );

    setText(
        "mediumCount",
        medium
    );

    setText(
        "lowCount",
        low
    );


    setBar(
        "highBar",
        (high / total) * 100
    );

    setBar(
        "mediumBar",
        (medium / total) * 100
    );

    setBar(
        "lowBar",
        (low / total) * 100
    );
}


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function setBar(
    id,
    percentage
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.style.width =
            `${Math.max(
                0,
                Math.min(
                    100,
                    percentage
                )
            )}%`;
    }
}


function normalize(value) {

    return String(
        value ?? ""
    )
    .trim()
    .toUpperCase()
    .replace(/-/g, " ");
}


function priorityClass(
    priority
) {

    switch (
        normalize(priority)
    ) {

        case "HIGH":
            return "priority-high";

        case "MEDIUM":
            return "priority-medium";

        case "LOW":
            return "priority-low";

        default:
            return "";
    }
}


function statusClass(
    status
) {

    const normalized =
        normalize(status);


    if (
        normalized ===
        "DELIVERED"
    ) {
        return "status-delivered";
    }


    if (
        normalized ===
        "PENDING"
    ) {
        return "status-pending";
    }


    return "";
}


function priorityValue(
    priority
) {

    switch (
        normalize(priority)
    ) {

        case "HIGH":
            return 3;

        case "MEDIUM":
            return 2;

        case "LOW":
            return 1;

        default:
            return 0;
    }
}


function formatNumber(
    value
) {

    const number =
        Number(value || 0);

    return number.toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 1
        }
    );
}


function formatHours(
    hours
) {

    if (
        !hours ||
        hours <= 0
    ) {
        return "—";
    }


    const wholeHours =
        Math.floor(hours);


    const minutes =
        Math.round(
            (
                hours -
                wholeHours
            ) * 60
        );


    if (
        wholeHours === 0
    ) {
        return `${minutes} min`;
    }


    if (
        minutes === 0
    ) {
        return `${wholeHours} hr`;
    }


    return `${wholeHours}h ${minutes}m`;
}


function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );
}


/* =========================================================
   APPLICATION START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        showSection(
            "dashboard"
        );

        loadDeliveries();

    }
);