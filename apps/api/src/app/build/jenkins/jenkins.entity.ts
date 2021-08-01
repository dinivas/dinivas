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
export class Jenkins {
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
  master_cloud_image: string;
  @Column({ nullable: true })
  master_cloud_flavor: string;
  @Column()
  use_floating_ip: boolean = false;
  @Column()
  link_to_keycloak: boolean = false;
  @Column({ nullable: true })
  @ApiProperty()
  keycloak_client_id: string;
  @Column({ nullable: true })
  master_admin_url: string;
  @Column({ nullable: true })
  master_admin_username: string;
  @Column({ nullable: true })
  master_admin_password: string;
  @Column({ nullable: true })
  architecture_type: string;
  @Column()
  use_existing_master: boolean;
  @Column({ nullable: true })
  existing_master_scheme: string;
  @Column({ nullable: true })
  existing_master_host: string;
  @Column({ nullable: true })
  existing_master_port: number;
  @Column({ nullable: true })
  existing_master_username: string;
  @Column({ nullable: true })
  existing_master_password: string;
  @Column({ nullable: true })
  slave_api_scheme: string;
  @Column({ nullable: true })
  slave_api_host: string;
  @Column({ nullable: true })
  slave_api_port: number;
  @Column({ nullable: true })
  slave_api_username: string;
  @Column({ nullable: true })
  slave_api_token: string;
  @Column({ nullable: false })
  keypair_name: string;
  @Column({ nullable: false })
  network_name: string;
  @Column({ nullable: false })
  network_subnet_name: string;
  @Column()
  manage_slave: boolean;
  @OneToMany(
    (type) => JenkinsSlaveGroup,
    (jenkinsSlaveGroup) => jenkinsSlaveGroup.jenkins,
    {
      cascade: true,
    }
  )
  slave_groups: JenkinsSlaveGroup[];
}

@Entity()
export class JenkinsSlaveGroup {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  @ApiProperty()
  code: string;
  @Column('simple-array')
  labels: string[] = [];
  @Column({ nullable: true })
  instance_count: number = 1;
  @Column({ nullable: true })
  slave_cloud_image: string;
  @Column({ nullable: true })
  slave_cloud_flavor: string;
  @ManyToOne((type) => Jenkins, (jenkins) => jenkins.slave_groups, {
    onDelete: 'CASCADE',
  })
  jenkins: Jenkins;
}
