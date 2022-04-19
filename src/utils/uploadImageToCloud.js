import axios from "axios";

const uploadImageToCloud = async (file) => {
    if(file){
      let formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      formData.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
  try {

          const res = await axios.post(
              process.env.REACT_APP_CLOUDINARY_URL,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      );
      const url = await res.data.secure_url?res.data.secure_url:res.data.url;
      // console.log(url);
      
      return url;
    } catch (error) {
        return null;
    }
}else{
    return null
}
};

export default uploadImageToCloud;
