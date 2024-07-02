import { Component, OnInit } from '@angular/core';
import { CsrfService } from './csrf.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-csrf-app';
  token: string = '';

  constructor(private csrfService: CsrfService) {}

  ngOnInit() {
    this.loadCsrfToken();
  }

  loadCsrfToken() {
    this.csrfService.loadCsrfToken().subscribe(response => {
      this.csrfService.setCsrfToken(response.csrfToken);
    });
  }

  getToken() {
    this.csrfService.getToken().subscribe(response => {
      this.token = response.token;
    });
  }
}
