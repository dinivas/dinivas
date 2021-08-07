import { ApiProperty } from '@nestjs/swagger';
import { Project } from './../../projects/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToMany,
} from 'typeorm';
@Entity()
export class Gitlab {
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
  cloud_image: string;
  @Column({ nullable: true })
  cloud_flavor: string;
  @Column()
  use_floating_ip: boolean = false;
  @Column()
  link_to_keycloak: boolean = false;
  @Column({ nullable: true })
  @ApiProperty()
  keycloak_client_id: string;
  @Column({ nullable: true })
  architecture_type: string;
  @Column()
  use_existing_instance: boolean;
  @Column()
  existing_instance_url: string;
  @Column({ nullable: false })
  keypair_name: string;
  @Column({ nullable: false })
  network_name: string;
  @Column({ nullable: false })
  network_subnet_name: string;
  @Column()
  manage_runner: boolean;
  @Column({ nullable: true })
  admin_username: string = 'admin';
  @Column({ nullable: true })
  admin_password: string = 'password';
  @OneToMany(() => GitlabRunner, (runners) => runners.gitlab, {
    cascade: true,
  })
  runners: GitlabRunner[];
}

@Entity()
export class GitlabRunner {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  @ApiProperty()
  code: string;
  @Column()
  @ApiProperty()
  runner_name: string;
  @Column()
  @ApiProperty()
  description: string;
  @Column()
  @ApiProperty()
  gitlab_token: string;
  @Column('simple-array')
  tags: string[] = [];
  @Column({ nullable: true })
  instance_count: number = 1;
  @Column({ nullable: true })
  runner_cloud_image: string;
  @Column({ nullable: true })
  runner_cloud_flavor: string;
  @Column({ nullable: false, default: true })
  runner_install_client: boolean = true;
  @Column({ nullable: true })
  concurrent_jobs_count: number = 1;
  @Column({ nullable: true })
  prometheus_listen_address: string = 'localhost:8787';
  @Column({ nullable: true })
  log_format: string = 'runner';
  @Column({ nullable: false })
  gitlab_url: string = 'https://gitlab.com/';
  @Column({ nullable: false })
  executor: 'shell' | 'docker' | 'docker+machine';
  @Column({ nullable: true })
  shell: string = '';
  @Column({ nullable: true })
  docker_image: string;
  @Column({ nullable: false, default: false })
  docker_privileged: boolean = false;
  @ManyToOne((type) => Gitlab, (gitlab) => gitlab.runners, {
    onDelete: 'CASCADE',
  })
  gitlab: Gitlab;
}
