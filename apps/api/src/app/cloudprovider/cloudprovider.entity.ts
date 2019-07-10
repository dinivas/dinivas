import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class Cloudprovider {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  @ApiModelProperty()
  cloud: string;
  @Column('text', {nullable: true})
  @ApiModelProperty()
  description: string;
  @Column('text')
  @ApiModelProperty()
  config: string;
}
