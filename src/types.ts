export interface SessionSubjectType {
  name: string
  length: number
}

export interface SubjectNotesType {
  subjectID: string
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

export interface SubjectType {
  name: string
  description?: string
  timePracticed: number
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

export interface UserType {
  username: string,
  joined: string,
  instrument?: string,
  sessions: SessionType[],
  mySubjects: MySubjectType[]
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

export type SessionInput = Omit<SessionType, 'date'>;

export interface EditUserInput {
  id: string,
  subjectNotes: SubjectNotesInput
}
