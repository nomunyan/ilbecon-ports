import React, { useState } from "react";
import {
  Stack,
  TextField,
  IStackProps,
  PrimaryButton,
  ProgressIndicator,
  DefaultButton,
  Separator,
  mergeStyles,
  Label,
} from "@fluentui/react";
import { Text } from "office-ui-fabric-react/lib/Text";

import Provider, { getProvider } from "../Provider";

const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: "100%" } },
};
const verticalStyle = mergeStyles({
  height: "80px",
});

export default function App(): JSX.Element {
  const [page, setPage] = useState<number>(0);
  const [provider, setProvider] = useState<Provider>();

  const change = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    const provider = getProvider(newValue);
    setProvider(undefined);
    if (provider) setProvider(provider);
  };

  switch (page) {
    case 0:
      return (
        <Stack {...columnProps}>
          <Stack horizontal {...columnProps} verticalAlign="center">
            <Stack.Item grow={2}>
              <TextField
                label="링크 입력"
                errorMessage={!provider && "올바르지 않은 링크입니다."}
                description={provider && provider.name}
                onChange={change}
              />
            </Stack.Item>
            <Stack.Item className={verticalStyle}>
              <Separator vertical>Or</Separator>
            </Stack.Item>
            <Stack.Item grow>
              <Stack tokens={{ childrenGap: 3 }}>
                <Label>로컬에서 가져오기</Label>
                <DefaultButton text="폴더 선택" />
                <Text variant="small">이미지가 들어있는 폴더에서 가져옴</Text>
              </Stack>
            </Stack.Item>
          </Stack>
          <PrimaryButton text="시작" onClick={(): void => setPage(1)} />
        </Stack>
      );
    case 1:
      return (
        <Stack {...columnProps}>
          <ProgressIndicator label="진행도" percentComplete={0.5} />
          <PrimaryButton text="중지" onClick={(): void => setPage(0)} />
        </Stack>
      );
  }
}
