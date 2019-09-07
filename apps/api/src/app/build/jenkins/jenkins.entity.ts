import { ApiModelProperty } from '@nestjs/swagger';
import { Project } from './../../projects/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToMany
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
  @Column()
  use_existing_master: boolean;
  @Column({ nullable: true })
  existing_master_url: string;
  @Column({ nullable: true })
  existing_master_username: string;
  @Column({ nullable: true })
  existing_master_password: string;
  @Column()
  manage_slave: boolean;
  @OneToMany(
    type => JenkinsSlaveGroup,
    jenkinsSlaveGroup => jenkinsSlaveGroup.jenkins
  )
  slave_groups: JenkinsSlaveGroup[];
}

@Entity()
export class JenkinsSlaveGroup {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  @ApiModelProperty()
  code: string;
  @Column('simple-array')
  labels: string[] = [];
  @Column({ nullable: true })
  instance_count: number = 1;
  @Column({ nullable: true })
  slave_cloud_image: string;
  @Column({ nullable: true })
  slave_cloud_flavor: string;
  @ManyToOne(type => Jenkins, jenkins => jenkins.slave_groups)
  jenkins: Jenkins;
}
