export enum DBCollections {
  STUDENTS = "students",
  EVENTS = "events",
  SETTINGS = "settings",
  ATTENDANCE = "attendance",
  EVENT_STATS = "event_stats",
}

export enum Departments {
  CCS = "CCS",
  COE = "COE",
  CBAA = "CBAA",
  COHM = "COHM",
  SHS = "SHS",
  BSIT = "BSIT",
  BSCS = "BSCS",
}

export enum OrderBy {
  ASC = "asc",
  DESC = "desc",
}

export enum EventTypes {
  LOGIN = "login",
  LOGOUT = "logout",
}

export enum AttendanceStatus {
  NOT_LOGIN = "not_login",
  NOT_LOGOUT = "not_logout",
  COMPLETE = "complete",
}
