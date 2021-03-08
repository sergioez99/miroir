import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Cliente {

    constructor( public uid: string,
                 public rol: string,
                 public nombre?: string,
                 public nombreEmpresa?: string,
                 public nif?: string,
                 public email?: string,
                 public alta?: Date,
                 public activo?: boolean,
                 public telefono?: number,
                 public validado?: boolean,
                 public imagen?: string) {}

    get imagenUrl(): string {
        // Devolvemos la imagen en forma de peticilon a la API
        const token = localStorage.getItem('token') || '';
        if (!this.imagen) {
            return `${base_url}/upload/fotoperfil/no-imagen?token=${token}`;
        }
        return `${base_url}/upload/fotoperfil/${this.imagen}?token=${token}`;
    }
}
