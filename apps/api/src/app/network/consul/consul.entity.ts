import { ApiModelProperty } from '@nestjs/swagger';
import { Project } from './../../projects/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column
} from 'typeorm';
@Entity()
export class Consul {
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
  @Column({ nullable: false })
  keypair_name: string;
  @Column({ nullable: false })
  network_name: string;
  @Column({ nullable: false })
  network_subnet_name: string;
  @Column({ nullable: true })
  server_instance_count: number = 1;
  @Column({ nullable: true })
  client_instance_count: number = 1;
  @Column({ nullable: false })
  cluster_domain: string;
  @Column({ nullable: false })
  cluster_datacenter: string;
  @Column({ nullable: false })
  server_image: string;
  @Column({ nullable: false })
  server_flavor: string;
  @Column({ nullable: false })
  client_image: string;
  @Column({ nullable: false })
  client_flavor: string;
  @Column()
  use_floating_ip: boolean = false;
}
