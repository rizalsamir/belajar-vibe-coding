import { Elysia, t } from "elysia";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  registerUser,
  updateUser,
} from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api/users" })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        await registerUser(body);
        set.status = 201;
        return { data: "OK" };
      } catch (error: any) {
        if (error.message === "Email sudah terdaftar") {
          set.status = 400;
          return { data: "Email sudah terdaftar" };
        }
        set.status = 500;
        return { data: error.message || "Terjadi kesalahan pada server" };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .get("/", async () => {
    const list = await getAllUsers();
    return { data: list };
  })
  .get("/:id", async ({ params: { id }, set }) => {
    const user = await getUserById(Number(id));
    if (!user) {
      set.status = 404;
      return { data: "User tidak ditemukan" };
    }
    return { data: user };
  })
  .put(
    "/:id",
    async ({ params: { id }, body, set }) => {
      const user = await getUserById(Number(id));
      if (!user) {
        set.status = 404;
        return { data: "User tidak ditemukan" };
      }
      const updated = await updateUser(Number(id), body);
      return { data: updated };
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        email: t.Optional(t.String()),
        password: t.Optional(t.String()),
      }),
    }
  )
  .delete("/:id", async ({ params: { id }, set }) => {
    const user = await getUserById(Number(id));
    if (!user) {
      set.status = 404;
      return { data: "User tidak ditemukan" };
    }
    await deleteUser(Number(id));
    return { data: "OK" };
  });
