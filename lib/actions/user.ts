import { db, storage } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { deleteObject, listAll, ref } from "firebase/storage";

export const createUser = async ({
  email,
  userId,
}: {
  email: string;
  userId: string;
}) => {
  try {
    const docRef = await setDoc(doc(db, "droppers", userId), {
      userId,
      email,
    });
    console.log("DOCREF", docRef);
    return docRef;
  } catch (error) {
    console.error(error);
  }
};

export const deleteUser = async ({ userId }: { userId: string }) => {
  try {
    if (!userId) {
      console.log("RETURNING FROM DELETE FUNCTION");
      return;
    }

    // Delete the document from the "droppers" collection
    await deleteDoc(doc(db, "droppers", userId));
    console.log("Dropper deleted");

    // Reference to the user's files folder
    const folderRef = ref(storage, `droppers/${userId}/files`);

    // List all files in the folder
    const res = await listAll(folderRef);
    console.log("RES", res);

    // Create a promise for each file deletion
    const deletePromises = res.items.map(async (itemRef) => {
      console.log("ITEMREF", itemRef);
      await deleteObject(itemRef);
      console.log("File deleted");
    });

    // Wait for all file deletions to complete
    await Promise.all(deletePromises);
    console.log("All files deleted");

    // await deleteDoc(doc(db, "droppers", userId))
    //   .then(() => {
    //     console.log("Dropper deleted");
    //   })
    //   .catch((error) => {
    //     console.error("Error deleting dropper:", error);
    //   });

    // const folderRef = ref(storage, `droppers/${userId}/files`);

    // await listAll(folderRef)
    //   .then((res) => {
    //     console.log("RES", res);
    //     res.items.forEach(async (itemRef) => {
    //       console.log("ITEMREF", itemRef);
    //       await deleteObject(itemRef)
    //         .then(() => {
    //           console.log("File deleted");
    //         })
    //         .catch((error) => {
    //           console.log("Error deleting file:", error);
    //         });
    //       console.log("AFTER DELETE OBJECT");
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("Error listing files:", error);
    //   });
  } catch (error) {
    console.error(error);
  }
};
