"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import ProfilePictureUpdateModal from "./ProfilePictureUpdateModal";
import PasswordResetModal from "./PasswordResetModal";

export default function ProfilePage() {
  const { user } = useUser() as any;
  const [passwordReset, setPasswordReset] = useState(false);
  const [updateProfilePicture, setUpdateProfilePicture] = useState(false);

  return (
    <>
      <div className="grid grid-cols-3 px-3 py-4 gap-x-6 gap-y-6 items-center w-full">

        <div className="text-sm text-gray-600">Profile</div>
        <div className="flex items-center gap-2 truncate">
          <img
            src={user?.imageUrl || "/user.svg"}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="font-medium text-sm text-black truncate">{user?.fullName}</p>
        </div>
        <Button
          size="sm"
          className="w-36 justify-self-end whitespace-nowrap flex items-center gap-1 bg-black text-white hover:bg-[#113663]"
          onClick={() => setUpdateProfilePicture(true)}
        >
          <Pencil className="w-3 h-3" />
          Update profile
        </Button>

        <div className="text-sm text-gray-600">Email</div>
        <div className="truncate text-sm">{user?.primaryEmailAddress?.emailAddress}</div>
        <div></div>

        <div className="text-sm text-gray-600">Password</div>
        <div className="text-sm"></div>
        <Button
          size="sm"
          className="w-36 justify-self-end whitespace-nowrap flex items-center gap-1 bg-black text-white hover:bg-[#113663]"
          onClick={() => setPasswordReset(true)}
        >
          Reset password
        </Button>

        {user?.verifiedExternalAccounts?.length > 0 && (
          <>
            <div className="text-sm text-gray-600">Connected Accounts</div>
            <div className="flex items-center gap-3">
              {user.verifiedExternalAccounts.map((account: any, idx: number) => (
                <div className="flex items-center gap-1" key={idx}>
                  <img
                    src={`/${account.provider}.svg`}
                    alt={account.provider}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span>
                    {account.provider.charAt(0).toUpperCase() + account.provider.slice(1)}
                  </span>
                </div>
              ))}
            </div>
            <div></div>
          </>
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
