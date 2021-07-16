import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cloudprovider {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  @ApiProperty()
  cloud: string;
  @Column('text', {nullable: true})
  @ApiProperty()
  description: string;
  @Column('text')
  @ApiProperty()
  config: string;
}
