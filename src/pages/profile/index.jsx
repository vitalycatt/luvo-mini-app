import { Spinner, ProfileForm } from "@/components";
import { useUser, useUserPhotos } from "@/api/user";

export const ProfilePage = () => {
  const { data: userData, isLoading: userIsLoading } = useUser();
  const { data: userPhotosData, isLoading: userPhotosIsLoading } =
    useUserPhotos();

  if (userIsLoading || userPhotosIsLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <ProfileForm userData={userData} userPhotosData={userPhotosData} />
    </div>
  );
};
