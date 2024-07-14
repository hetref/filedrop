import { db } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export const createUser = async ({
  email,
  userId,
}: {
  email: string;
  userId: string;
}) => {
  try {
    const docRef = await setDoc(doc(db, "users", email), {
      userId,
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
    // Query the collection users where the userId is equal to the userId passed in and delete the document with that userId, all the documents are named with the user's email id, and the document has userId in it
    // I cannot directly get the document using the userId, I need to query the collection and get the document with the userId and then delete the email (document) of the user to be deleted
    const q = query(collection(db, "users"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    console.log("QUERY SNAPSHOT", querySnapshot);
    querySnapshot.forEach(async (docs) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(docs.id, " => ", docs.data());
      console.log("DELETED", docs.id);
      // Delete the user document
      await deleteDoc(doc(db, "users", docs.id));

      // delete the document
      // await deleteDoc(doc(db, "users", doc.id));
      // const deleteDocument = await deleteDoc(doc(db, "users", docs.id));
      // console.log("DELETEDOCUMENT", deleteDocument);
    });

    // Delete the documents in the droppers collection with the userId
    await deleteDoc(doc(db, "droppers", userId));

    // await deleteDoc(doc(db, "droppers", userId));
    // await deleteDoc(doc(db, "droppers", userId));

    // const docRef = await deleteDoc(doc(db, "users", userId));
    return querySnapshot;

    // const docRef = await console.log("DOCREF", docRef);
    // return docRef;
  } catch (error) {
    console.error(error);
  }
};
