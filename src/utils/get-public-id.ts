const getPublicIdFile = (url: string) => {
    const arr = url?.split("/");
    const publicId = arr[arr?.length - 1]?.split(".")[0];
    return publicId;
};

export default getPublicIdFile;
