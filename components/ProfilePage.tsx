"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import ProfilePictureUpdateModal from "./ProfilePictureUpdateModal";
import PasswordResetModal from "./PasswordResetModal";

export default function ProfilePage() {
  const { user } = useUser() as any;
  const [passwordReset, setPasswordReset] = useState(false);
  const [updateProfilePicture, setUpdateProfilePicture] = useState(false);

  return (
    <>
      <div className="space-y-6 px-4 py-6">
        <div
          className="
            grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-1 items-center
            sm:grid-cols-[auto_1fr_auto] sm:grid-rows-1
          "
        >
          <div className="text-sm text-gray-600">Profile</div>

          <div
            className="
              col-start-2 row-start-1 row-span-2 self-center justify-self-end
              sm:col-start-3 sm:row-start-1 sm:row-span-1 sm:self-auto sm:justify-self-end
            "
          >
            <Button
              size="sm"
              className="flex items-center gap-1 whitespace-nowrap"
              onClick={() => setUpdateProfilePicture(true)}
            >
              Update profile
            </Button>
          </div>


          <div
            className="
              col-start-1 row-start-2 col-span-2
              sm:col-start-2 sm:row-start-1 sm:col-span-1
              flex items-center gap-2 truncate
            "
          >
            <img
              src={user?.imageUrl || "/user.svg"}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <span className="font-medium text-sm text-black truncate">
              {user?.fullName}
            </span>
          </div>
        </div>

        <div
          className="
            grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-1 items-center
            sm:grid-cols-[auto_1fr_auto] sm:grid-rows-1
          "
        >
          <div className="text-sm text-gray-600">Email</div>

          {/* empty top-right placeholder so grid keeps structure */}
          <div className="col-start-2 row-start-1 sm:hidden" />

          <div
            className="
              col-start-1 row-start-2 col-span-2
              sm:col-start-2 sm:row-start-1 sm:col-span-1
              text-sm truncate
            "
          >
            {user?.primaryEmailAddress?.emailAddress}
          </div>
        </div>

        {/** PASSWORD ROW **/}
        <div
          className="
            grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-1 items-center
            sm:grid-cols-[auto_1fr_auto] sm:grid-rows-1
          "
        >
          <div className="text-sm text-gray-600">Password</div>

          <div className="col-start-2 row-start-1 justify-self-end sm:col-start-3 sm:row-start-1">
            <Button
              size="sm"
              onClick={() => setPasswordReset(true)}
              className="whitespace-nowrap"
            >
              Reset password
            </Button>
          </div>

          {/* blank content cell on mobile */}
          <div className="col-start-1 row-start-2 sm:col-start-2 sm:row-start-1" />
        </div>

        {/** CONNECTED ACCOUNTS ROW **/}
        {user?.verifiedExternalAccounts?.length > 0 && (
          <div
            className="
              grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-1 items-center
              sm:grid-cols-[auto_1fr_auto] sm:grid-rows-1
            "
          >
            <div className="text-sm text-gray-600">Connected Accounts</div>
            <div className="col-start-2 row-start-1 sm:hidden" />
            <div
              className="
                col-start-1 row-start-2 col-span-2
                sm:col-start-2 sm:row-start-1 sm:col-span-1
                flex items-center gap-3 overflow-x-auto
              "
            >
              {user.verifiedExternalAccounts.map((acct: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-1 text-sm whitespace-nowrap"
                >
                  <img
                    src={`/${acct.provider}.svg`}
                    alt={acct.provider}
                    className="w-5 h-5 object-contain flex-shrink-0"
                  />
                  <span className="truncate">
                    {acct.provider[0].toUpperCase() +
                      acct.provider.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {updateProfilePicture && (
        <ProfilePictureUpdateModal
          open={updateProfilePicture}
          onOpenChange={setUpdateProfilePicture}
        />
      )}
      {passwordReset && (
        <PasswordResetModal
          open={passwordReset}
          onOpenChange={setPasswordReset}
        />
      )}
    </>
  );
}
