import PricingCards from "@/components/PricingCards";
import { deleteUser } from "@/lib/actions/user";
import { AlertTriangle } from "lucide-react";

const page = () => {
  // TODO: Delete Dropper handling.

  // const deleteDropper = async ({ userId }: { userId: string }) => {
  //   // const { userId } = auth();
  //   if (!userId) {
  //     console.error("User ID is null");
  //     return;
  //   }

  //   // const q = query(collection(db, "droppers"), where("userId", "==", userId));

  //   // const querySnapshot = await getDocs(q);
  //   // querySnapshot.forEach(async (docs) => {
  //   //   console.log(docs.id, " => ", docs.data());

  //   // const deleteDocument = await deleteDoc(doc(db, "droppers", docs.id));
  //   // console.log("DELETEDOCUMENT", deleteDocument);
  //   // });

  //   // await deleteDoc(doc(db, "droppers", userId));
  //   // return querySnapshot;
  // };

  return (
    <div className="isolate overflow-hidden ">
      <div className="mx-auto max-w-7xl px-6 pb-96 pt-26 text-center sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h3 className="bg-white flex justify-center items-center gap-4 rounded-full text-black p-4 mb-12">
            <AlertTriangle className="text-red-900" /> We are currently in
            developing stage! We will notify you once we are on production.
          </h3>
          <h2 className="text-xl font-semibold leading-7 dark:text-yellow-400">
            Pricing
          </h2>
          <form
            action={async () => {
              "use server";
              // const { userId } = auth();
              await deleteUser({ userId: "user_2jEi529cZuIPoBHwu3NWHX1lTzG" });
            }}
          >
            <button type="submit">Delete Dropper</button>
          </form>
          <p className="mt-2 text-4xl font-bold tracking-tight dark:text-white sm:text-5xl">
            The right price for you,{" "}
            <br className="hidden sm:inline lg:hidden" />
            whoever you are
          </p>
        </div>
        <div className="relative mt-6">
          <p className="mx-auto max-w-2xl text-lg leading-8 dark:text-white/60">
            Were 99% sure we have a plan to match 100% of your needs
          </p>
          <svg
            viewBox="0 0 1208 1024"
            className="absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
          >
            <ellipse
              cx={604}
              cy={512}
              fill="url(#radial-gradient-pricing)"
              rx={604}
              ry={512}
            />
            <defs>
              <radialGradient id="radial-gradient-pricing">
                <stop stopColor="#454545" />
                <stop offset={1} stopColor="#1c1c1c" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flow-root bg-white pb-24 sm:pb-32">
        <div className="-mt-80">
          <PricingCards redirect={true} />
        </div>
      </div>
    </div>
  );
};

export default page;
