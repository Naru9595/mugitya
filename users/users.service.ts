import { Injectable } from '@nestjs/common';
import { User } from './user';

@Injectable()
export class UsersService {

    users: User[] = [];

    create(user: User) {
        this.users.push(user)
    }

    findAll() {
        return this.users
    }
}

