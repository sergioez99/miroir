import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  holaMundo(): string {
    document.write('<div>dsñghasdfñlgkahñsdfglih</div>');

    return '"hola mis amigos"';
  }

}
