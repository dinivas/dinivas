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
export class Instance {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  @ApiModelProperty()
  code: string;
  @Column('text', { nullable: true })
  @ApiModelProperty()
  description: string;
  @ManyToOne(type => Project, { nullable: false })
  @JoinColumn()
  project: Project;
  @Column()
  use_floating_ip: boolean;
  @Column({ nullable: false })
  cloud_image: string;
  @Column({ nullable: false })
  cloud_flavor: string;
  @Column({ nullable: false })
  keypair_name: string;
  @Column({ nullable: false })
  network_name: string;
  @Column({ nullable: false })
  network_subnet_name: string;
  @Column({ nullable: false })
  availability_zone: string;
}
