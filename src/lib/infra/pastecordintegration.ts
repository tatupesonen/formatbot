import axios, { AxiosResponse } from 'axios';
import { IUploader } from '../interfaces/IUploader';

interface PastecordResponse {
  key: string;
}

export class PastecordImplementation implements IUploader {
  constructor(private readonly url = 'https://pastecord.com') {}
  async upload(content: string, languageKey?: string): Promise<string> {
    const { data }: AxiosResponse<PastecordResponse> = await axios.post(
      this.url + '/documents',
      content
    );
    const urlEnd = languageKey ? `.${languageKey}` : '';
    return `${this.url}/${data.key}${urlEnd}`;
  }
}
