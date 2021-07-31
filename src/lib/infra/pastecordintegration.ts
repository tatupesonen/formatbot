import axios, { AxiosResponse } from 'axios';

interface PastecordResponse {
  key: string;
}

export const UploadToPastecord = async (
  code: string,
  languageKey?: string
): Promise<string | void> => {
  const URL = 'https://pastecord.com/documents';

  const { data }: AxiosResponse<PastecordResponse> = await axios.post(
    URL,
    code
  );
  const urlEnd = languageKey ? `.${languageKey}` : '';
  return `https://pastecord.com/${data.key}${urlEnd}`;
};
