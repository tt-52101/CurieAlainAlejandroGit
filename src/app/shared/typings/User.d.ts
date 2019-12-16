export interface BasicUser {
  userName: string;
  password: string;
}

export interface Preferences {
  kanban: {
    askForDescription: boolean
  }
}