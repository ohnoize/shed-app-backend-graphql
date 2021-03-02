export interface SessionSubjectType {
  name: string
  length: number
}

export interface SubjectNotesType {
  SubjectID: string
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

export interface SubjectType {
  name: string
  description?: string
  timePracticed: number
}

export interface UserType {
    username: string,
    instrument?: string,
    sessions: SessionType[],
    subjectNotes: SubjectNotesType[]
}

export interface TokenUserType {
  id: string,
  username: string
}