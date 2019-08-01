import { Cloudprovider } from './../cloudprovider/cloudprovider.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  @ApiModelProperty()
  code: string;
  @Column('text', { nullable: true })
  @ApiModelProperty()
  description: string;
  @ManyToOne(type => Cloudprovider)
  @JoinColumn()
  cloud_provider: Cloudprovider;
  @Column({ nullable: true })
  floating_ip_pool: string;
  @Column({ nullable: true })
  public_router: string;
  @Column()
  monitoring: boolean = false;
  @Column()
  logging: boolean = false;
  @Column({ nullable: true })
  logging_stack: string;
}
