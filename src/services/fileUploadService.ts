
export const fileUploadService = {
    uploadPupils(data: FormData) {
        return new Promise<void>((res) => {
            setTimeout(() => {
                res();
            }, 500);
        });
    },
    uploadTeachers(data: FormData) {
        return new Promise<void>((res) => {
            setTimeout(() => {
                res();
            }, 500);
        });
    }
}