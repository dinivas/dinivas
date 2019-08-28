import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'dinivas-postgresql-wizard-vars',
  templateUrl: './postgresql-wizard-vars.component.html',
  styleUrls: ['./postgresql-wizard-vars.component.scss']
})
export class PostgresqlWizardVarsComponent implements OnInit {

  planApplied: EventEmitter<any>;

  applyApplied: EventEmitter<any>;

  constructor() { }

  ngOnInit() {
  }

  onPlan(){
    this.planApplied.emit('plan emited');
  }

  onApply(){
    this.applyApplied.emit('apply emited');
  }
}
