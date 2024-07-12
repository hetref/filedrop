import { db } from "@/firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

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
