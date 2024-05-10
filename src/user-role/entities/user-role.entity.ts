/* eslint-disable prettier/prettier */
import { UserRoleName } from '../user-role.type';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id:string

  @Column({
    unique: true,
    nullable: false,
  })
  role_name: UserRoleName;

  @OneToMany(() => User, (user) => user.roles)
  users: User[];
}
