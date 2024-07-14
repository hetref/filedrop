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

    // Reference to the user's files subcollection
    const subCollectionRef = collection(db, `droppers/${userId}/files`);

    // Query all documents in the subcollection
    const subCollectionQuery = query(subCollectionRef);
    const querySnapshot = await getDocs(subCollectionQuery);

    // Create a promise for each document deletion in the subcollection
    const deleteSubCollectionPromises = querySnapshot.docs.map(
      async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref);
        console.log(
          `File document ${docSnapshot.id} deleted from subcollection`
        );
      }
    );

    // Wait for all subcollection document deletions to complete
    await Promise.all(deleteSubCollectionPromises);
    console.log("All subcollection documents deleted");

    // Delete the main document from the "droppers" collection
    await deleteDoc(doc(db, "droppers", userId));
    console.log("Dropper document deleted");

    // Reference to the user's files folder in storage
    const folderRef = ref(storage, `droppers/${userId}/files`);

    // List all files in the storage folder
    const res = await listAll(folderRef);
    console.log("RES", res);

    // Create a promise for each file deletion in storage
    const deleteStoragePromises = res.items.map(async (itemRef) => {
      console.log("ITEMREF", itemRef);
      await deleteObject(itemRef);
      console.log("File deleted from storage");
    });

    // Wait for all storage file deletions to complete
    await Promise.all(deleteStoragePromises);
    console.log("All files deleted from storage");

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
