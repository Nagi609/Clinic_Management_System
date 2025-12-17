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
"[project]/app/api/patients/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
// ======= Validation Helpers =======
const validateNameField = (name)=>!!name?.trim() && /^[a-zA-Z\s]*$/.test(name.trim());
const validatePhone = (phone)=>typeof phone === 'string' && /^09\d{9}$/.test(phone);
const validateIdNumber = (idNumber)=>typeof idNumber === 'string' && /^[a-zA-Z0-9-]+$/.test(idNumber);
const parseAttachments = (attachments)=>{
    if (!attachments) return null;
    try {
        return JSON.stringify(attachments);
    } catch  {
        return null;
    }
};
async function GET(request) {
    try {
        const userId = request.headers.get('x-user-id');
        if (!userId) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
        const patients = await __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].patient.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            patients
        });
    } catch (error) {
        console.error('Get patients error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch patients'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const userId = request.headers.get('x-user-id');
        if (!userId) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
        const data = await request.json();
        // Parse numeric fields
        data.yearLevel = data.yearLevel ? parseInt(data.yearLevel) : null;
        data.block = data.block ? parseInt(data.block) : null;
        const errors = [];
        // ===== Basic validations =====
        if (!validateNameField(data.firstName)) errors.push('First name is required and must be letters only');
        if (data.middleName && !validateNameField(data.middleName)) errors.push('Middle name must contain letters only');
        if (!validateNameField(data.lastName)) errors.push('Last name is required and must be letters only');
        if (data.suffix && !validateNameField(data.suffix)) errors.push('Suffix must contain letters only');
        if (!data.dateOfBirth) errors.push('Date of birth is required');
        if (isNaN(Date.parse(data.dateOfBirth))) errors.push('Invalid date of birth');
        if (!data.gender) errors.push('Gender is required');
        if (!validatePhone(data.phone)) errors.push('Phone must start with 09 and be exactly 11 digits');
        if (!data.role || ![
            'student',
            'teaching_staff',
            'non_teaching_staff'
        ].includes(data.role)) errors.push('Valid role is required');
        if (!validateIdNumber(data.idNumber)) errors.push('Valid ID number is required');
        // ===== Role-specific =====
        if (data.role === 'student') {
            if (![
                'CICT',
                'CBME'
            ].includes(data.program)) errors.push('Valid program is required for students');
            if (!data.course) errors.push('Course is required for students');
            if (!data.yearLevel || data.yearLevel < 1 || data.yearLevel > 4) errors.push('Year level must be 1–4');
            if (data.block && (data.block < 1 || data.block > 5)) errors.push('Block must be 1–5');
        }
        if (data.role === 'teaching_staff') {
            if (![
                'CICT',
                'CBME'
            ].includes(data.department)) errors.push('Valid department is required');
        }
        if (data.role === 'non_teaching_staff') {
            if (!data.staffCategory) errors.push('Staff category is required');
        }
        // ===== Emergency contact =====
        if (!data.primaryContactName?.trim()) errors.push('Primary contact name is required');
        if (!data.primaryContactRelationship?.trim()) errors.push('Primary contact relationship is required');
        if (!validatePhone(data.primaryContactPhone)) errors.push('Primary contact phone is invalid');
        if (errors.length > 0) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            errors
        }, {
            status: 400
        });
        // ===== CREATE =====
        const patient = await __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].patient.create({
            data: {
                ...data,
                dateOfBirth: new Date(data.dateOfBirth).toISOString(),
                middleName: data.middleName || null,
                suffix: data.suffix || null,
                email: data.email || null,
                address: data.address || null,
                program: data.role === 'student' ? data.program : null,
                course: data.role === 'student' ? data.course : null,
                yearLevel: data.role === 'student' ? data.yearLevel : null,
                block: data.role === 'student' ? data.block : null,
                department: data.role === 'teaching_staff' ? data.department : null,
                staffCategory: data.role === 'non_teaching_staff' ? data.staffCategory : null,
                pastIllnesses: data.pastIllnesses || null,
                surgeries: data.surgeries || null,
                currentMedication: data.currentMedication || null,
                allergies: data.allergies || null,
                medicalNotes: data.medicalNotes || null,
                primaryContactAddress: data.primaryContactAddress || null,
                secondaryContactName: data.secondaryContactName || null,
                secondaryContactRelationship: data.secondaryContactRelationship || null,
                secondaryContactPhone: data.secondaryContactPhone || null,
                secondaryContactAddress: data.secondaryContactAddress || null,
                attachments: parseAttachments(data.attachments),
                userId
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            patient
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Create patient error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to save patient',
            details: error.message
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const userId = request.headers.get('x-user-id');
        if (!userId) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
        const data = await request.json();
        const { id, ...updateData } = data;
        // Parse numeric fields
        updateData.yearLevel = updateData.yearLevel ? parseInt(updateData.yearLevel) : null;
        updateData.block = updateData.block ? parseInt(updateData.block) : null;
        const errors = [];
        if (!id) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Patient ID is required'
        }, {
            status: 400
        });
        // ===== Basic validations =====
        if (!validateNameField(updateData.firstName)) errors.push('First name is required and must be letters only');
        if (updateData.middleName && !validateNameField(updateData.middleName)) errors.push('Middle name must contain letters only');
        if (!validateNameField(updateData.lastName)) errors.push('Last name is required and must be letters only');
        if (updateData.suffix && !validateNameField(updateData.suffix)) errors.push('Suffix must contain letters only');
        if (!updateData.dateOfBirth) errors.push('Date of birth is required');
        if (isNaN(Date.parse(updateData.dateOfBirth))) errors.push('Invalid date of birth');
        if (!updateData.gender) errors.push('Gender is required');
        if (!validatePhone(updateData.phone)) errors.push('Phone must start with 09 and be exactly 11 digits');
        if (!updateData.role || ![
            'student',
            'teaching_staff',
            'non_teaching_staff'
        ].includes(updateData.role)) errors.push('Valid role is required');
        if (!validateIdNumber(updateData.idNumber)) errors.push('Valid ID number is required');
        // ===== Role-specific =====
        if (updateData.role === 'student') {
            if (![
                'CICT',
                'CBME'
            ].includes(updateData.program)) errors.push('Valid program is required for students');
            if (!updateData.course) errors.push('Course is required for students');
            if (!updateData.yearLevel || updateData.yearLevel < 1 || updateData.yearLevel > 4) errors.push('Year level must be 1–4');
            if (updateData.block && (updateData.block < 1 || updateData.block > 5)) errors.push('Block must be 1–5');
        }
        if (updateData.role === 'teaching_staff') {
            if (![
                'CICT',
                'CBME'
            ].includes(updateData.department)) errors.push('Valid department is required');
        }
        if (updateData.role === 'non_teaching_staff') {
            if (!updateData.staffCategory) errors.push('Staff category is required');
        }
        // ===== Emergency contact =====
        if (!updateData.primaryContactName?.trim()) errors.push('Primary contact name is required');
        if (!updateData.primaryContactRelationship?.trim()) errors.push('Primary contact relationship is required');
        if (!validatePhone(updateData.primaryContactPhone)) errors.push('Primary contact phone is invalid');
        if (errors.length > 0) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            errors
        }, {
            status: 400
        });
        // ===== UPDATE =====
        const patient = await __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].patient.update({
            where: {
                id,
                userId
            },
            data: {
                ...updateData,
                dateOfBirth: new Date(updateData.dateOfBirth).toISOString(),
                middleName: updateData.middleName || null,
                suffix: updateData.suffix || null,
                email: updateData.email || null,
                address: updateData.address || null,
                program: updateData.role === 'student' ? updateData.program : null,
                course: updateData.role === 'student' ? updateData.course : null,
                yearLevel: updateData.role === 'student' ? updateData.yearLevel : null,
                block: updateData.role === 'student' ? updateData.block : null,
                department: updateData.role === 'teaching_staff' ? updateData.department : null,
                staffCategory: updateData.role === 'non_teaching_staff' ? updateData.staffCategory : null,
                pastIllnesses: updateData.pastIllnesses || null,
                surgeries: updateData.surgeries || null,
                currentMedication: updateData.currentMedication || null,
                allergies: updateData.allergies || null,
                medicalNotes: updateData.medicalNotes || null,
                primaryContactAddress: updateData.primaryContactAddress || null,
                secondaryContactName: updateData.secondaryContactName || null,
                secondaryContactRelationship: updateData.secondaryContactRelationship || null,
                secondaryContactPhone: updateData.secondaryContactPhone || null,
                secondaryContactAddress: updateData.secondaryContactAddress || null,
                attachments: parseAttachments(updateData.attachments)
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            patient
        });
    } catch (error) {
        console.error('Update patient error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to update patient',
            details: error.message
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const userId = request.headers.get('x-user-id');
        if (!userId) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
        const { id } = await request.json();
        if (!id) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Patient ID is required'
        }, {
            status: 400
        });
        await __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].patient.delete({
            where: {
                id,
                userId
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Patient deleted successfully'
        });
    } catch (error) {
        console.error('Delete patient error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to delete patient',
            details: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f2ce9293._.js.map