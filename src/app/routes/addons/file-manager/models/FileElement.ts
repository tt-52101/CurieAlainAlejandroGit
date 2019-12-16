export class FileElement {
  id?: string;
  isFolder: boolean;
  name: string;
  parent: string;
  type?: string; //Antes el objeto no tenía esta propiedad/atributo
  children?: []; //Antes el objeto no tenía esta propiedad/atributo
  item?: string; //Antes el objeto no tenía esta propiedad/atributo
  level?: number; //Antes el objeto no tenía esta propiedad/atributo
  expandable?: boolean; //Antes el objeto no tenía esta propiedad/atributo
  isLoading?: boolean; //Antes el objeto no tenía esta propiedad/atributo
}
