import db from "#db/client";

import { createTask } from "#db/queries/tasks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const ash = await createUser({
    username: "ash",
    password: "123456",
  });

  const ashTask1 = await createTask({
    title: "Buy groceries for the week",
    userId: ash.id,
  });

  const ashTask2 = await createTask({
    title: "Complete Block 39 workshop",
    userId: ash.id,
    done: true,
  });

  const ashTask3 = await createTask({
    title: "Schedule dentist appointment",
    userId: ash.id,
  });
}
