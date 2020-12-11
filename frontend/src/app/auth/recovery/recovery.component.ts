import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {

  public formRecovery: FormGroup | null = null;
  public formSubmit = false;

  constructor( private fb: FormBuilder,
               private router: Router) { }

  ngOnInit(): void {
    this.formRecovery = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  recovery() {
    console.log (this.formRecovery);
  }

}
