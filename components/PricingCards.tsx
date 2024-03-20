import { SignedIn, SignedOut, auth, currentUser } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
// import CheckoutButton from "./CheckoutButton";

const tiers = [
  {
    name: "Starter",
    id: "starter",
    href: "#",
    priceMonthly: null,
    description:
      "Get started with Filedrop! Try Filedrop for free by registering yourself",
    storingGB: 20,
    features: [
      "Secure file storing",
      "Store upto 20GB of files",
      "Unlimited file operations",
      "Unlimited file sharing",
    ],
  },
  {
    name: "Pro",
    id: "pro",
    href: "#",
    priceMonthly: "₹199",
    description: "Make Filedrop as your primary file storing platform!",
    storingGB: 50,
    features: [
      "Secure file storing",
      "Store upto 50GB of files",
      "Unlimited file operations",
      "Unlimited file sharing",
      "Chat Support",
      "Priority support",
    ],
  },
];

const PricingCards = async ({ redirect }: { redirect: boolean }) => {
  const { userId } = auth();
  const user = await currentUser();

  user && console.log(user);

  return (
    <div>
      <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10"
          >
            <div>
              <h3
                id={tier.id + tier.name}
                className="text-base font-semibold leading-7 text-black"
              >
                {tier.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-x-2">
                {tier.priceMonthly ? (
                  <>
                    <span className="text-5xl font-bold tracking-tight text-gray-900">
                      {tier.priceMonthly}
                    </span>
                    <span className="text-base font-semibold leading-7 text-gray-900">
                      /month
                    </span>
                  </>
                ) : (
                  <span className="text-5xl tracking-tight font-bold text-gray-900">
                    Free
                  </span>
                )}
              </div>
              <h4 className="text-2xl font-bold mt-2 ">{tier.storingGB} GB</h4>
              <p className="mt-6 text-base leading-7 text-gray-600">
                {tier.description}
              </p>
              <ul
                role="list"
                className="mt-10 space-y-4 text-sm leading-6 text-gray-600"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-black"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={user ? "/dashboard" : "sign-in"}
              className="mt-8 block rounded-md bg-black/80 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-80 duration-200 ease-in-out"
            >
              {user ? "Go to Dashboard" : "Sign In"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCards;
