import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css']
})
export class VerificacionComponent implements OnInit {

  token;


  constructor( private router :Router,
               private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.verificarToken();
  }

  verificarToken() {
    this.token = this.route.snapshot.params['token'];

    console.log('esto? ', this.token);

  }

}
