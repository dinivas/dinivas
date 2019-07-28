import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class TerraformState {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  projectId: number;
  @Column()
  @ApiModelProperty()
  module: string;
  @Column('text', { nullable: true })
  @ApiModelProperty()
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