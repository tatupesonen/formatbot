import axios, { AxiosResponse } from 'axios';

interface PastecordResponse {
  key: string;
}

export const UploadToPastecord = async (
  code: string
): Promise<string | void> => {
  const URL = 'https://pastecord.com/documents';

  const { data }: AxiosResponse<PastecordResponse> = await axios.post(
    URL,
    code
  );

  return `https://pastecord.com/${data.key}`;
};
