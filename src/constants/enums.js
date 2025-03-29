export const CertificateTypeEnum = {
    AGENT_CERTIFICATE: 0,
    VESSEL_CERTIFICATE: 1,
};

export const CertificateStatusEnum = {
    NA: 0,
    PendingApproval: 1,
    Approved: 2,
    Rejected: 3
}

export const DocumentTypeEnum = {
    Certificate: 1,
    Payment: 2,
    Inspection: 3,
    InspectionTemplates: 4,
    ExitReport: 5
}

export const ApiType = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
};
export const VesselTypes = {
    1: "Oil Tanker",
    2: "Commercial-Others",
    3: "LGP-LNG"
}

export const PCTransactionTypes = Object.freeze({
    EntryPermit: { value: 1, label: "Entry Permit", color: "#1890ff" },
    EntryPermitPayment: { value: 2, label: "Pay Entry Permit", color: "#52c41a" },
    VesselArrived: { value: 3, label: "Arrived ?", color: "#6c757d" },
    Inspection: { value: 4, label: "Inspect", color: "#ff4d4f" },
    ExitPermit: { value: 5, label: "Exit Permit", color: "#13c2c2" },
    VesselDepartureConfirmation: { value: 6, label: "Departure Confirmation", color: "#389e0d" },
    ReInspection: { value: 7, label: "Re Inspect", color: "#ff4d4f" },
    InspectionFinePayment: { value: 8, label: "Pay Inspection Fine", color: "#52c41a" },

});
export const ApprovalStatus = Object.freeze({
    Pending: 1,
    Approved: 2,
    Rejected: 3,
    Excepted: 4,
});
export const GetKeyByValue = (obj, value) => {
    return Object.entries(obj).find(([key, val]) => val === value)?.[0] || null;
}




export const CertificateStatus = {
    NA: "NA",
    PendingApproval: "PendingApproval",
    Approved: "Approved",
    Rejected: "Rejected"
}

export const AgentStatus = {
    CREATED: "CREATED",
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    ACTIVE: "ACTIVE"
}

export const PreDepositRequestStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED"
}

export const PaymentMethods = Object.freeze({
    directDepositPayment: 1,
    preDepositPayment: 2,
});
