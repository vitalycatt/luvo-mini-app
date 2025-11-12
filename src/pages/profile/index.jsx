import { useEffect } from "react";
import { Spinner, ProfileForm } from "@/components";
import { useUser, useUserPhotos, useUpdateUser } from "@/api/user";
// import { ABOUT_PLACEHOLDER } from "@/constants";

// const schema = yup.object({
//   about: yup.string().optional(),
//   birthdate: yup.date().optional(),
//   first_name: yup.string().required("Имя обязательно"),
//   instagram_username: yup.string().required("Введите имя пользователя"),
// });

// const getRandomAboutPlaceholder = () => {
//   return ABOUT_PLACEHOLDER[
//     Math.floor(Math.random() * ABOUT_PLACEHOLDER.length)
//   ];
// };

export const ProfilePage = () => {
  // const [aboutPlaceholder] = useState(getRandomAboutPlaceholder());
  // const [isLoading, setIsLoading] = useState(false);
  // const [genericError, setGenericError] = useState("");

  // const { setUser } = useTelegramInitData();
  // const { mutateAsync } = useUpdateUser();
  const { data: userData, isLoading: userIsLoading } = useUser();
  const { data: userPhotosData, isLoading: userPhotosIsLoading } =
    useUserPhotos();

  // const {
  //   reset,
  //   control,
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(schema),
  //   defaultValues: {
  //     about: "",
  //     birthdate: "",
  //     first_name: "",
  //     instagram_username: "",
  //   },
  // });

  // const onSubmit = async (data) => {
  //   try {
  //     setIsLoading(true);

  //     const formData = new FormData();
  //     Object.entries(data).forEach(([key, value]) => {
  //       if (key === "birthdate" && value instanceof Date) {
  //         formData.append(key, value.toISOString().split("T")[0]);
  //       } else {
  //         formData.append(key, value);
  //       }
  //     });
  //     formData.append("gender", "male");

  //     const { exp, user_id, has_profile, access_token } = await mutateAsync(
  //       formData
  //     );

  //     if (access_token) {
  //       setUser({
  //         id: user_id,
  //         exp: exp,
  //         isRegister: has_profile,
  //         accessToken: access_token,
  //       });
  //     }

  //     setGenericError("");
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.error("Ошибка создания профиля", err);
  //     setGenericError(err?.response?.data?.detail || "Что-то пошло не так");
  //   }
  // };

  // useEffect(() => {
  //   if (userPhotosData?.length) {
  //     userPhotosData.forEach((photo) => {
  //       const img = new Image();
  //       img.src = photo.url;
  //     });
  //   }
  // }, [userPhotosData]);

  // useEffect(() => {
  //   if (userData) {
  //     reset({
  //       about: userData.about || "",
  //       birthdate: userData.birthdate ? new Date(userData.birthdate) : null,
  //       first_name: userData.first_name || "",
  //       instagram_username: userData.instagram_username || "",
  //     });
  //   }
  // }, [userData, reset]);

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
