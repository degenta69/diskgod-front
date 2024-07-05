// import ApiMethods from "../Models/ApiMethods";
import ApiMethods from "../Models/ApiMethods.ts";
import instance from "./axios";

interface ApiRequestHandlerParams<T> {
  url: string;
  method: ApiMethods;
  requestBody?: T;
  fnSuccessCallback?: (response: any) => void;
  fnErrorCallback?: (error: any) => void;
}

export const ApiRequestHandler = async <T>({
  url,
  method,
  requestBody,
  fnSuccessCallback,
  fnErrorCallback
}: ApiRequestHandlerParams<T>): Promise<void> => {
  let response;

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
      // Add other methods if needed
      default:
        return;
    }
    fnSuccessCallback && fnSuccessCallback(response);
  } catch (e) {
    console.error(e.response, 'error');
    fnErrorCallback && fnErrorCallback(e.response);
  }
};
