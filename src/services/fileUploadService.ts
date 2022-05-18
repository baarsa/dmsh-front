import {api} from "./__api";

export const fileUploadService = {
  uploadPupils(data: FormData) {
    return api.postFormData('pupil/upload', data);
  },
  uploadTeachers(data: FormData) {
    return api.postFormData('teacher/upload', data);
  },
};
