import React, { useState } from "react";
import Provider, { getProvider, ProviderResult } from "../Provider";
import FirstPage from "./FirstPage";
import UploadingPage from "./UploadingPage";
import { UploadResult } from "../";
import SuccessPage from "./SuccessPage";
import LocalProvider from "../Provider/LocalProvider";

export default function App(): JSX.Element {
  const [page, setPage] = useState<number>(0);
  const [provider, setProvider] = useState<Provider>(undefined);
  const [url, setUrl] = useState<string>();
  const [result, setResult] = useState<ProviderResult>(undefined);

  const change = (value?: string): void => {
    const provider = getProvider(value);
    setProvider(undefined);
    if (provider) {
      setUrl(value);
      setProvider(provider);
    }
  };
  const cancel = (): void => {
    setPage(0);
    setProvider(undefined);
    setResult(undefined);
  };
  const uploadSuccess = (
    result: ProviderResult,
    errors: UploadResult[]
  ): void => {
    setResult(result);
    setPage(2);
    if (errors.length > 0) {
      alert(
        `다음파일은 업로드되지 않았습니다.\n${errors
          .map((e) => `${e.fileName}: ${e.error.message}`)
          .join("\n")}`
      );
    }
  };
  const uploadStart = (): void => {
    alert("저작권 조심해라 게이야~");
    setPage(1);
  };
  const onSelectDir = (path: string): void => {
    setUrl(path);
    setProvider(LocalProvider);
    uploadStart();
  };

  switch (page) {
    case 0:
      return (
        <FirstPage
          provider={provider}
          onChange={change}
          onSelDir={onSelectDir}
          onNext={uploadStart}
        />
      );
    case 1:
      return (
        <UploadingPage
          provider={provider}
          url={url}
          onCancel={cancel}
          onSuccess={uploadSuccess}
        />
      );
    case 2:
      return <SuccessPage {...result} onBack={cancel} />;
  }
}
