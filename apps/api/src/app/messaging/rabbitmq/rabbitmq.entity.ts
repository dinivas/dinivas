import { ApiModelProperty } from '@nestjs/swagger';
import { Project } from '../../projects/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column
} from 'typeorm';
@Entity({name: 'rabbitmq'})
export class RabbitMQ {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(type => Project, { nullable: false })
  @JoinColumn()
  project: Project;
  @Column({ unique: true })
  @ApiModelProperty()
  code: string;
  @Column('text', { nullable: true })
  @ApiModelProperty()
  description: string;
  @Column({ nullable: true })
  architecture_type: string;
  @Column({ nullable: true })
  cluster_cloud_image: string;
  @Column({ nullable: true })
  cluster_cloud_flavor: string;
  @Column()
  use_floating_ip: boolean = false;
  @Column({ nullable: false })
  keypair_name: string;
  @Column({ nullable: false })
  network_name: string;
  @Column({ nullable: false })
  network_subnet_name: string;
  @Column({ nullable: false })
  cluster_instance_count: number;
  @Column({ nullable: false })
  enabled_plugin_list: string;
  @Column({ nullable: false })
  cluster_availability_zone: string;
}
