export interface SessionSubjectType {
  name: string
  length: number
}

export interface SubjectNotesType {
  date: string
  notes: string
}

export interface SessionType {
  totalLength: number
  userID: string
  date: string
  notes?: string
  individualSubjects: SessionSubjectType[]
}

export interface DBSessionType extends SessionType {
  id: string
}

export interface LinkType {
  url: string
  description: string
}

export interface SubjectType {
  name: string
  description?: string
  timePracticed: number
  links: LinkType[]
}

export interface AddLinkType extends LinkType {
  subjectID: string
}

export interface DBSubjectType extends SubjectType {
  id: string
}

export interface AddSubjectType extends SubjectType {
  userID: string
}

export interface MySubjectType {
  subjectID: string,
  subjectName: string,
  timePracticed: number,
  subjectNotes: SubjectNotesType[],
}

export interface GoalType {
  description: string,
  subject: string,
  targetTime: number,
  deadline?: string,
  passed: boolean
}

export interface AddGoalType {
  goal: GoalType
  id: string
}

export interface UserType {
  username: string,
  joined: string,
  timePracticed: number,
  instrument?: string,
  sessions: SessionType[],
  mySubjects: MySubjectType[],
  goals: GoalType[]
}

export interface AddUserType {
  username: string,
  password: string,
  instrument?: string
}

export interface LoginType {
  username: string,
  password: string
}

export interface DBUserType extends UserType {
  id: string
}

export interface TokenUserType {
  id: string,
  username: string
}

export interface LoginResponse {
  token: string,
  user: UserType
}

type SubjectNotesInput = Omit<SubjectNotesType, 'date'>;

export interface SubjectNotesInputExtra extends SubjectNotesInput {
  subjectID: string
}

export type SessionInput = Omit<SessionType, 'date'>;

export interface EditUserInput {
  id: string,
  subjectNotes: SubjectNotesInputExtra
}
