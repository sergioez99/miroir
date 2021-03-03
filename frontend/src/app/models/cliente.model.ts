
import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Cliente {

    constructor( public uid: string,
                 public email?: string,
                 public nombreEmpresa?: string,
                 public nombre?: string,
                 public nif?: string,
                 public telefono?: number) {}

}
