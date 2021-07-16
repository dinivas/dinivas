import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class TerraformState {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  stateId: string;
  @Column()
  @ApiProperty()
  module: string;
  @Column('text', { nullable: true })
  @ApiProperty()
  state: string;
  @Column({ nullable: true })
  lockId: string;
  @Column({ nullable: true })
  lockVersion: string;
  @Column({ nullable: true })
  lockOperation: string;
  @Column({ nullable: true })
  lockDate: string;
  @Column({ nullable: true })
  lockWho: string;
  @Column({ nullable: true })
  lockInfo: string;
}