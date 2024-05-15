import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity("packages")
export class PackageEntity{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    created_at?: Date;

    @Column()
    updated_at?: Date;
    
    @Column()
    pickup_date?: Date;

    @Column()
    status!: string;

    @ManyToOne(() => UserEntity, user => user.packages, { nullable: false })
  user?: UserEntity;
}