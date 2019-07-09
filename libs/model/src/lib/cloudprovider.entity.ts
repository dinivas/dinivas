import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cloudprovider {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  cloud: string;
  @Column('text')
  description: string;
  @Column('text')
  config: string;
}
