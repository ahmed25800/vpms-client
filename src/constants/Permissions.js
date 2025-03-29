export const PERMISSIONS = {
  VESSELS: {
    CREATE: "Create_Vessels",
    SCREEN: "Screen_Vessels",
    VIEW: "View_Vessels",
    UPDATE: "Update_Vessels",
    DELETE: "Delete_Vessels",
    SUBMIT_VESSEL_CERTIFICATES: "Submit_Vessel_Certificate",
    DELETE_VESSEL_CERTIFICATES: "Delete_Vessel_Certificate",
    VIEW_VESSEL_CERTIFICATES: "View_Vessel_Certificates"
  },
  USERS: {
    CREATE: "Create_Users",
    SCREEN: "Screen_Users",
    VIEW: "View_Users",
    UPDATE: "Update_Users",
    DELETE: "Delete_Users",
  },
  PORT_CALL: {
    CREATE: "Create_PortCall",
    SCREEN: "Screen_PortCall",
    VIEW: "View_PortCall",
    UPDATE: "Update_PortCall",
    DELETE: "Delete_PortCall",

  },
  ENTRY_PERMIT: {
    CREATE: "Create_Entry_Permit",
    SCREEN: "Screen_Entry_Permit",
    VIEW: "View_Entry_Permit",
    UPDATE: "Update_Entry_Permit",
    DELETE: "Delete_Entry_Permit",
    APPROVE: "Approve_Entry_Permit",
    REJECT: "Reject_Entry_Permit",
    EXCEPTION: "Except_Entry_Permit",
    DOCUMENT: {
      APPROVE: "Approve_Entry_Permit_Document",
      REJECT: "Reject_Entry_Permit_Document"
    }
  },
  ENTRY_PERMIT_PAYMENT: {
    CREATE: "Create_Entry_Permit_Payment",
    SCREEN: "Screen_Entry_Permit_Payment",
    VIEW: "View_Entry_Permit_Payment",
    UPDATE: "Update_Entry_Permit_Payment",
    DELETE: "Delete_Entry_Permit_Payment",
    APPROVE: "Approve_Entry_Permit_Payment",
    REJECT: "Reject_Entry_Permit_Payment",
    DOCUMENT: {
      APPROVE: "Approve_Entry_Permit_Payment_Document",
      REJECT: "Reject_Entry_Permit_Payment_Document"
    }
  },
  VESSEL_ARRIVAL: {
    CREATE: "Create_Vessel_Arrival",
    SCREEN: "Screen_Vessel_Arrival",
    VIEW: "View_Vessel_Arrival",
    UPDATE: "Update_Vessel_Arrival",
    DELETE: "Delete_Vessel_Arrival",
  },
  INSPECTION: {
    CREATE: "Create_Inspection",
    SCREEN: "Screen_Inspection",
    VIEW: "View_Inspection",
    UPDATE: "Update_Inspection",
    DELETE: "Delete_Inspection",
    APPROVE: "Approve_Inspection",
    REJECT: "Reject_Inspection",
    EXCEPTION: "Except_Inspection",
    DOCUMENT: {
      APPROVE: "Approve_Inspection_Document",
      REJECT: "Reject_Inspection_Document"
    }
  },
  INSPECTION_PAYMENT: {
    CREATE: "Create_Inspection_Payment",
    SCREEN: "Screen_Inspection_Payment",
    VIEW: "View_Inspection_Payment",
    UPDATE: "Update_Inspection_Payment",
    DELETE: "Delete_Inspection_Payment",
    APPROVE: "Approve_Inspection_Payment",
    REJECT: "Reject_Inspection_Payment",
    DOCUMENT: {
      APPROVE: "Approve_Inspection_Payment_Document",
      REJECT: "Reject_Inspection_Payment_Document"
    }
  },
  EXIT_PERMIT: {
    CREATE: "Create_Exit_Permit",
    SCREEN: "Screen_Exit_Permit",
    VIEW: "View_Exit_Permit",
    UPDATE: "Update_Exit_Permit",
    DELETE: "Delete_Exit_Permit",
    APPROVE: "Approve_Exit_Permit",
    REJECT: "Reject_Exit_Permit",
    EXCEPTION: "Except_Exit_Permit",

    DOCUMENT: {
      APPROVE: "Approve_Exit_Permit_Document",
      REJECT: "Reject_Exit_Permit_Document"
    }
  },
  VESSEL_DEPARTURE: {
    VIEW: "View_Vessel_Departure",
    Confirm: "Confirm_Vessel_Departure"
  },
  ENTRY_PERMIT_PAYMENT_REFUND: {
    APPROVE: "Approve_Entry_Permit_Payment_Refund",
    REJECT: "Reject_Entry_Permit_Payment_Refund",
    CREATE: "Create_Entry_Permit_Payment_Refund",
  },
  AGENTS: {
    CREATE: "Create_Agents",
    SCREEN: "Screen_Agents",
    VIEW: "View_Agents",
    UPDATE: "Update_Agents",
    DELETE: "Delete_Agents",
    APPROVE_AGENTS: "Approve_Agents",
    SCREEN_AGENTS_APPROVAL: "Screen_AgentsApproval",
    SCREEN_AGENTS_CERTIFICATES: "Screen_AgentsCertificates",
    SUBMIT_AGENTS_CERTIFICATES: "Submit_AgentsCertificates",
    APPROVE_AGENTS_CERTIFICATES: "Approve_AgentsCertificates",
    REJECT_AGENTS_CERTIFICATES: "Reject_AgentsCertificates",
    SCREEN_AGENTS_PREDEPOSITREQUESTS: "Screen_Agents_PreDepositRequests",
    VIEW_AGENTS_PREDEPOSITREQUESTS: "View_Agents_PreDepositRequests",
    CREATE_AGENTS_PREDEPOSITREQUESTS: "Create_Agents_PreDepositRequests",
    SCREEN_AGENTS_PREDEPOSITREQUESTS_APPROVAL: "Screen_Agents_PreDepositRequests_Approval",
    VIEW_AGENTS_PREDEPOSITREQUESTS_APPROVAL: "View_Agents_PreDepositRequests_Approval",
    APPROVE_AGENTS_PREDEPOSITREQUESTS: "Approve_Agents_PreDepositRequests",
    REJECT_AGENTS_PREDEPOSITREQUESTS: "Reject_Agents_PreDepositRequests",
    VIEW_AGENT_BALANCETRANSACTIONSREPORT: "View_Agent_BalanceTransactionReport",
  },
  DASHBOARD: {
    SCREEN: "Screen_Dashboard"
  },
};

export default PERMISSIONS;
