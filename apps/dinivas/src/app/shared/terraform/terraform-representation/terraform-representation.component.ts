import { Component, OnInit, Input } from '@angular/core';
import { TFPlanRepresentation, TFResourceChange } from '@dinivas/api-interfaces';

@Component({
  selector: 'dinivas-terraform-representation',
  templateUrl: './terraform-representation.component.html',
  styleUrls: ['./terraform-representation.component.scss']
})
export class TerraformRepresentationComponent implements OnInit {
  @Input()
  planRepresentation!: TFPlanRepresentation;

  resourcesIconMap = {
    // Openstack
    openstack_compute_instance_v2: 'server2',
    openstack_compute_keypair_v2: 'key',
    openstack_networking_router_v2: 'router',
    openstack_networking_network_v2: 'network',
    openstack_networking_subnet_v2: 'subnet',
    openstack_networking_floatingip_v2: 'ip',
    //Digital Ocean
    digitalocean_droplet: 'server2',
    digitalocean_ssh_key: 'key',
    digitalocean_vpc: 'network',
    digitalocean_floating_ip_assignment: 'ip',
    // AWS
    aws_instance: 'server2',
    aws_key_pair: 'key',
    aws_nat_gateway: 'router',
    aws_internet_gateway: 'router',
    aws_vpc: 'network',
    aws_subnet: 'subnet',
    aws_eip: 'ip',
  };

  ngOnInit() {}

  shouldDisplayResource(resource: TFResourceChange): boolean {
    return (
      resource.type != 'null_resource' &&
      resource.change.actions[0] != 'read' &&
      resource.change.actions[0] != 'no-op' &&
      Object.keys(this.resourcesIconMap).indexOf(resource.type) > -1
    );
  }

  getDisplayableResourceChanges(): TFResourceChange[] {
    return this.planRepresentation ? this.planRepresentation.resource_changes.filter(r => this.shouldDisplayResource(r)) : [];
  }
}
