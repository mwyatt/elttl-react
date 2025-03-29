"use server";

import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";

const testUser = {
  id: "1",
  email: "1",
  password: "2",
};

export async function login(prevState, formData) {
  // const { email, password } = formData;

  if (formData.get('email') !== testUser.email || formData.get('password') !== testUser.password) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  await createSession(testUser.id);

  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}