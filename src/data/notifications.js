export const DUMMY_NOTIFICATIONS = [
  {
    id: "notif_01",
    title: "Emergency Patient Intake",
    message: "Critical cardiac patient admitted to Trauma Bay 2. Triage team assigned.",
    time: "5 mins ago",
    unread: true,
    type: "alert", // 'alert' | 'lab' | 'appointment' | 'system'
    actionUrl: "/reception"
  },
  {
    id: "notif_02",
    title: "Pathology Test Results Ready",
    message: "CBC & Lipid Panel for Patient Eleanor Vance (#PAT-8842) are verified by Dr. Vance.",
    time: "18 mins ago",
    unread: true,
    type: "lab",
    actionUrl: "/dashboards/lab"
  },
  {
    id: "notif_03",
    title: "OPD Appointment Scheduled",
    message: "New Cardiology consultation booked with Dr. Alexander Wright for 02:30 PM.",
    time: "1 hour ago",
    unread: true,
    type: "appointment",
    actionUrl: "/dashboards/doctor"
  },
  {
    id: "notif_04",
    title: "Low Medicine Stock Alert",
    message: "Amoxicillin 500mg capsules stock reached minimum threshold (15 boxes left).",
    time: "2 hours ago",
    unread: false,
    type: "system",
    actionUrl: "/dashboards/pharmacy"
  },
  {
    id: "notif_05",
    title: "Nurse Duty Roster Updated",
    message: "Night Shift ICU ward assignments updated for Sister Clara Barton.",
    time: "4 hours ago",
    unread: false,
    type: "system",
    actionUrl: "/dashboards/nurse"
  }
];
