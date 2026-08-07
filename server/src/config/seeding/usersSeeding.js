import "../env.js";
import { prisma } from "../database.js";
import { Role } from "../../generated/prisma/enums.ts";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt"

const createRandomUser = async () => {
  const salt         = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(faker.lorem.word(5), salt);

  const firstName = faker.person.firstName();
  const lastName  = faker.person.lastName ();
  const fullname  = faker.person.fullName({firstName, lastName});

  return {
    fullname       : fullname,
    username       : faker.internet.username({firstName}),
    email          : faker.internet.email   ({firstName}),
    confirmed_email: Math.round(Math.random()) == 1,
    role           : Role.USER,
    date_of_birth  : faker.date.birthdate(),
    password_hash  : passwordHash
  };
};

const createAdmin = async () => {
  const salt                = await bcrypt.genSalt();
  const admin_password_hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

  return {
    fullname       : "Eric Gonçalves de Moura",
    username       : "ericmouradev",
    email          : "eric.moura.dev@gmail.com",
    confirmed_email: true,
    role           : Role.ADMIN,
    date_of_birth  : "2004-09-18T00:00:00Z",
    password_hash  : admin_password_hash,
  };
}

const userCount = 50;

const createUsers = async () => {
    console.log("seeding users...");
    for (let i = 0; i < userCount; i++)
    {
        const user = await createRandomUser();

        await prisma.users.create({data: user});
    }
    const admin = await createAdmin();
    await prisma.users.create({ data: admin });

    console.log("Finish seeding users.");
    process.exit(0);
}

createUsers();