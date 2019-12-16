/**
 * Mínimo de datos de un usuario
 */
export interface BasicUser {
    username: string;
    password: string;
}
export interface TimeTableI {

}

export interface UserI {
    id: number;
    username: string;
    name?: string;
    roles?: string[];
    groups?: string[];
    timetable?: TimeTableI;
}