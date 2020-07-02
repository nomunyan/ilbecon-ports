import React, { useEffect, useState } from "react";
import {
  Stack,
  IStackProps,
  PrimaryButton,
  ProgressIndicator,
} from "@fluentui/react";
import Provider, { ProviderResult, ImgData } from "../Provider";
import { ipcRenderer } from "electron";

const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: "100%" } },
};

interface UploadingPageProps {
  url: string;
  onCancel(): void;
  onSuccess(result: ProviderResult): void;
  provider: Provider;
}
export default function UploadingPage(props: UploadingPageProps): JSX.Element {
  const [pos, setPos] = useState<number>(-1);
  const [data, setData] = useState<ProviderResult>();
  let canceled = false;

  useEffect(() => {
    async function uploadData(uploadData: ProviderResult): Promise<void> {
      if (canceled) return;
      const imgList: ImgData[] = [];
      let position = 35;
      ipcRenderer.on("upload-from-url-reply", (_event, res: ImgData) => {
        console.log(res);
        if (res) {
          imgList.push({
            filename: res.filename,
            url: `https://www.ilbe.com${res.url}`,
          });
        }
        if (++position < uploadData.images.length) setPos(position);
        else {
          console.log(position);
          props.onSuccess({ ...uploadData, images: imgList });
          return;
        }
        ipcRenderer.send("upload-from-url", uploadData.images[position]);
      });
      ipcRenderer.send("upload-from-url", uploadData.images[position]);
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
        label={`진행도 ${data ? (pos / (data.images.length - 1)) * 100 : 0}%`}
        percentComplete={data ? pos / (data.images.length - 1) : 0}
        description={`처리: ${
          data?.images[pos]?.filename || data?.images[pos]?.url || "준비중..."
        }`}
      />
      <PrimaryButton
        text="중지"
        onClick={(): void => {
          canceled = true;
          props.onCancel;
        }}
      />
    </Stack>
  );
}
