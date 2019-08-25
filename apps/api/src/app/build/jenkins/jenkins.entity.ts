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
export class Jenkins {
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
  master_cloud_image: string;
  @Column({ nullable: true })
  master_cloud_flavor: string;
  @Column()
  use_floating_ip: boolean = false;
}
