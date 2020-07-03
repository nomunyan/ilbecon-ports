import React, { useEffect, useState } from "react";
import {
  Stack,
  IStackProps,
  PrimaryButton,
  ProgressIndicator,
} from "@fluentui/react";
import Provider, { ProviderResult, ImgData } from "../Provider";
import { ipcRenderer } from "electron";
import { UploadResult } from "../";

const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: "100%" } },
};

interface UploadingPageProps {
  url: string;
  onCancel(): void;
  onSuccess(result: ProviderResult, errors: UploadResult[]): void;
  provider: Provider;
}
export default function UploadingPage(props: UploadingPageProps): JSX.Element {
  const [pos, setPos] = useState<number>(-1);
  const [data, setData] = useState<ProviderResult>();

  useEffect(() => {
    ipcRenderer.send("resize", 130);
  }, []);

  useEffect(() => {
    async function uploadData(uploadData: ProviderResult): Promise<void> {
      const imgList: ImgData[] = [];
      const errors: UploadResult[] = [];
      let position = 0;
      ipcRenderer.on("upload-reply", (_event, res: UploadResult) => {
        if (!res.error) {
          imgList.push({
            filename: res.fileName,
            url: `https://www.ilbe.com${res.url}`,
          });
        } else {
          res.fileName = uploadData.images[position].filename;
          errors.push(res);
        }
        if (++position < uploadData.images.length) setPos(position);
        else {
          ipcRenderer.removeAllListeners("upload-reply");
          position = 0;
          props.onSuccess({ ...uploadData, images: imgList }, errors);
          return;
        }
        ipcRenderer.send("upload", uploadData.images[position]);
      });
      setPos(position);
      ipcRenderer.send("upload", uploadData.images[position]);
    }

    async function fetchData(): Promise<void> {
      const fetchData = await props.provider.getData(props.url);
      setData(fetchData);
      await uploadData(fetchData);
    }

    fetchData();
  }, []);

  return (
    <Stack {...columnProps}>
      <ProgressIndicator
        label={`진행도 ${(data && pos !== -1
          ? ((pos + 1) / data.images.length) * 100
          : 0
        ).toFixed(0)}%`}
        percentComplete={
          data && pos !== -1 ? (pos + 1) / data.images.length : 0
        }
        description={`처리: ${
          data?.images[pos]?.filename || data?.images[pos]?.url || "준비중..."
        }`}
      />
      <PrimaryButton
        text="중지"
        onClick={(): void => {
          ipcRenderer.removeAllListeners("upload-reply");
          props.onCancel();
        }}
      />
    </Stack>
  );
}
