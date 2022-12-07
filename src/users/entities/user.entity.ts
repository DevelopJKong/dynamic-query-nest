import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { CoreEntity } from './../../common/entities/core.entity';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  @IsPhoneNumber()
  phoneNum: string;

  @Column({ default: false, nullable: true })
  verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
        return true;
      } catch (error) {
        new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      new InternalServerErrorException();
    }
  }
}
