import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { GeoService } from '../../services/geo.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    config: NgbCarouselConfig,
    private GeoService: GeoService
  ) { }

  ngOnInit(): void {

    this.GeoService.getRegiones();

  }

}
