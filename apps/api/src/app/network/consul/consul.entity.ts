import { ApiProperty } from '@nestjs/swagger';
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
  @ManyToOne(() => Project, { nullable: false })
  @JoinColumn()
  project: Project;
  @Column({ unique: true })
  @ApiProperty()
  code: string;
  @Column('text', { nullable: true })
  @ApiProperty()
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
  client_instance_count: number = 0;
  @Column({ nullable: false })
  cluster_domain: string;
  @Column({ nullable: false })
  cluster_datacenter: string;
  @Column({ nullable: false })
  server_image: string;
  @Column({ nullable: false })
  server_flavor: string;
  @Column({ nullable: true })
  client_image: string;
  @Column({ nullable: true })
  client_flavor: string;
  @Column()
  use_floating_ip: boolean = false;
  @Column({default: false})
  managed_by_project: boolean = false;
}
