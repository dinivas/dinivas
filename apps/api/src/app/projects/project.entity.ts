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
}
