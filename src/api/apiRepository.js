import ApiMethods from "../Models/ApiMethods";
import instance from "./axios";

export const ApiRequestHandler = async (
  url,
  method,
  requestBody,
  fnSuccessCallback,
  fnErrorCallback
) => {
  let response;
  // const headers = await authheader();

  try {
    switch (method) {
      case ApiMethods.GET:
        response = await instance.get(url);
        break;
      case ApiMethods.PUT:
        response = await instance.put(url, requestBody);
        break;
      case ApiMethods.POST:
        response = await instance.post(url, requestBody);
        break;
      case ApiMethods.DELETE:
        response = await instance.delete(url);
        break;
      default:
        return;
    }
    fnSuccessCallback && (await fnSuccessCallback(response));
  } catch (e) {
    fnErrorCallback && (await fnErrorCallback(e.response));
  }
};