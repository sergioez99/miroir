
import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Prenda {

    constructor( public uid: string,
                 public rol: string,
                 public nombre?: string,
                 public descripcion?: string,
                 public talla?: string[],
                 public activo?: boolean,
                 public imagen?: string)
                 {}
/*
    get imagenUrl(): string {
        // Devolvemos la imagen en forma de peticilon a la API
        const token = localStorage.getItem('token') || '';
        if (!this.imagen) {
            return `${base_url}/upload/fotoperfil/no-imagen?token=${token}`;
        }
        return `${base_url}/upload/fotoperfil/${this.imagen}?token=${token}`;

    }
    */
}
