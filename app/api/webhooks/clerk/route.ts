import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser } from "@/lib/actions/user";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import { deleteObject, listAll, ref } from "firebase/storage";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  // CREATE
  if (eventType === "user.created") {
    const { id, email_addresses } = evt.data;

    const user = {
      userId: id,
      email: email_addresses[0].email_address,
    };

    const newUser = await createUser(user);
    // console.log("Created user:", user, id);

    return NextResponse.json({ message: "OK", user: newUser });
  }

  // UPDATE
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name,
      lastName: last_name,
      username: username!,
      photo: image_url,
    };

    // const updatedUser = await updateUser(id, user);
    console.log("Updated user:", user, id);

    return NextResponse.json({ message: "OK", user });
  }

  // DELETE
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (!id) {
      console.error("User ID is null");
      return NextResponse.json({ message: "User ID is null" }, { status: 400 });
    }

    try {
      await deleteUser({ userId: id })
        .then(() => {
          console.log("SUCCESS DELETE USER");
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
      // await deleteDoc(doc(db, "droppers", id))
      //   .then(() => {
      //     console.log("Dropper deleted");
      //   })
      //   .catch((error) => {
      //     console.error("Error deleting dropper:", error);
      //   });

      // // Delete the user documents from storage -> /droppers/user_2j9nmrYq10zuZ7tepDXrrDwSkSB/files
      // const folderRef = ref(storage, `droppers/${id}/files`);

      // await listAll(folderRef)
      //   .then((res) => {
      //     res.items.forEach((itemRef) => {
      //       deleteObject(itemRef)
      //         .then(() => {
      //           console.log("File deleted");
      //         })
      //         .catch((error) => {
      //           console.log("Error deleting file:", error);
      //         });
      //     });
      //   })
      //   .catch((error) => {
      //     console.error("Error listing files:", error);
      //   });
    } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { message: "Error deleting user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "OK", status: 200 });
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}
