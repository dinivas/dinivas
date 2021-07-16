import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RabbitMQDTO } from '@dinivas/api-interfaces';
import { TerraformModuleEntityInfo } from '../../../shared/terraform/terraform-module-entity-info';

@Component({
  selector: 'dinivas-rabbitmq-status',
  templateUrl: './rabbitmq-status.component.html',
  styleUrls: ['./rabbitmq-status.component.scss']
})
export class RabbitmqStatusComponent implements OnInit {
  rabbitMQInfo: TerraformModuleEntityInfo<RabbitMQDTO>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.parent.data.subscribe(
      data => (this.rabbitMQInfo = data.currentRabbitmqInfo)
    );
  }
}
