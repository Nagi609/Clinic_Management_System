module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/backend/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = /*TURBOPACK member replacement*/ __turbopack_context__.g;
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        'query',
        'error',
        'warn'
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
const __TURBOPACK__default__export__ = prisma;
}),
"[project]/app/api/visits/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/backend/lib/db.ts [app-route] (ecmascript)");
;
;
// Utility: return JSON with status
function json(data, status = 200) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
        status
    });
}
async function GET(request) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) return json({
            error: "Unauthorized"
        }, 401);
        const visits = await __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].visitRecord.findMany({
            where: {
                userId
            },
            include: {
                Patient: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        suffix: true
                    }
                },
                User: {
                    select: {
                        fullName: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return json({
            visits
        });
    } catch (error) {
        console.error("GET visits error:", error);
        return json({
            error: "Internal server error"
        }, 500);
    }
}
async function POST(request) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) return json({
            error: "Unauthorized"
        }, 401);
        const { patientId, visitorName, visitDate, reason, symptoms, treatment, notes } = await request.json();
        if (!visitDate || !reason || !symptoms || !treatment) {
            return json({
                error: "Missing required fields"
            }, 400);
        }
        // Validate patient ownership if patientId provided
        if (patientId) {
            const patient = await __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].patient.findUnique({
                where: {
                    id: patientId
                }
            });
            if (!patient || patient.userId !== userId) {
                return json({
                    error: "Patient not found or unauthorized"
                }, 404);
            }
        }
        // Walk-in visit requires visitorName
        if (!patientId && !visitorName) {
            return json({
                error: "Either patient selection or visitor name is required"
            }, 400);
        }
        const visit = await __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].visitRecord.create({
            data: {
                patientId: patientId ?? null,
                visitorName: patientId ? null : visitorName ?? null,
                visitDate,
                reason,
                symptoms,
                treatment,
                notes: notes ?? null,
                userId
            }
        });
        return json({
            visit
        }, 201);
    } catch (error) {
        console.error("POST visit error:", error);
        return json({
            error: "Internal server error"
        }, 500);
    }
}
async function PUT(request) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) return json({
            error: "Unauthorized"
        }, 401);
        const { id, patientId, visitorName, visitDate, reason, symptoms, treatment, notes } = await request.json();
        if (!id) return json({
            error: "Visit ID required"
        }, 400);
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].visitRecord.findUnique({
            where: {
                id
            }
        });
        if (!existing || existing.userId !== userId) {
            return json({
                error: "Visit not found or unauthorized"
            }, 404);
        }
        // Validate patient if changed
        if (patientId && patientId !== existing.patientId) {
            const patient = await __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].patient.findUnique({
                where: {
                    id: patientId
                }
            });
            if (!patient || patient.userId !== userId) {
                return json({
                    error: "Patient not found or unauthorized"
                }, 404);
            }
        }
        const updatedVisit = await __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].visitRecord.update({
            where: {
                id
            },
            data: {
                patientId: patientId ?? null,
                visitorName: patientId ? null : visitorName ?? null,
                visitDate,
                reason,
                symptoms,
                treatment,
                notes: notes ?? null
            }
        });
        return json({
            visit: updatedVisit
        });
    } catch (error) {
        console.error("PUT visit error:", error);
        return json({
            error: "Internal server error"
        }, 500);
    }
}
async function DELETE(request) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) return json({
            error: "Unauthorized"
        }, 401);
        const { id } = await request.json();
        if (!id) return json({
            error: "Visit ID required"
        }, 400);
        const visit = await __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].visitRecord.findUnique({
            where: {
                id
            }
        });
        if (!visit || visit.userId !== userId) {
            return json({
                error: "Visit not found or unauthorized"
            }, 404);
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].visitRecord.delete({
            where: {
                id
            }
        });
        return json({
            message: "Visit deleted successfully"
        });
    } catch (error) {
        console.error("DELETE visit error:", error);
        return json({
            error: "Internal server error"
        }, 500);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__28e71e63._.js.map