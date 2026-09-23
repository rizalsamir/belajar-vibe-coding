import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}

export async function registerUser(input: RegisterUserInput) {
  // Cek apakah email sudah terdaftar
  const existingUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existingUsers.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  // Hash password menggunakan bcrypt bawaan Bun
  const hashedPassword = await Bun.password.hash(input.password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  // Simpan user baru ke database
  await db.insert(users).values({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });

  return { success: true };
}

export async function getAllUsers() {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users);
}

export async function getUserById(id: number) {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return result[0] || null;
}

export async function updateUser(id: number, input: UpdateUserInput) {
  const updateData: { name?: string; email?: string; password?: string } = {};

  if (input.name) updateData.name = input.name;
  if (input.email) updateData.email = input.email;
  if (input.password) {
    updateData.password = await Bun.password.hash(input.password, {
      algorithm: "bcrypt",
      cost: 10,
    });
  }

  await db.update(users).set(updateData).where(eq(users.id, id));
  return getUserById(id);
}

export async function deleteUser(id: number) {
  await db.delete(users).where(eq(users.id, id));
  return { success: true };
}
