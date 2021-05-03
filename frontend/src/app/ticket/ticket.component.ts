import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../services/ticket.service';
//para mensajes de alerta
import Swal from 'sweetalert2';


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  private ticket = null;

  constructor( private ticketService: TicketService,
               private route: ActivatedRoute,
               private router: Router,) { }

  ngOnInit(): void {

    console.log('componente ticket iniciando');

    this.ticket = this.route.snapshot.params['ticket'];

    if (this.ticket == null){
     
    }
    else {
      this.canjearTicket();
    }


  }

  canjearTicket() {

    console.log('empezamos canjear ticket: ', this.ticket);

    this.ticketService.canjearTicket(this.ticket).then((res) => {

      console.log('canjear ticket ha ido bien (ticket component)');
      console.log(res);

    }).catch((error) => {

      console.warn(error);
      Swal.fire({
        title: 'Ticket caducado',
        icon: 'error',
        showCloseButton: true,
        confirmButtonText: 'Aceptar',
      }).then( () => {

        // this.router.navigateByUrl('/');

      });
    });
  }

}
