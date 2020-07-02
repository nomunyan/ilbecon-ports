import React from "react";
import {
  Stack,
  TextField,
  IStackProps,
  PrimaryButton,
  DefaultButton,
  Separator,
  mergeStyles,
  Label,
} from "@fluentui/react";
import { Text } from "office-ui-fabric-react/lib/Text";
import Provider from "../Provider";

const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: "100%" } },
};
const verticalStyle = mergeStyles({
  height: "80px",
});

interface FirstPageProps {
  provider: Provider;
  onChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void;
  onNext(): void;
}
export default function FirstPage(props: FirstPageProps): JSX.Element {
  return (
    <Stack {...columnProps}>
      <Stack horizontal {...columnProps} verticalAlign="center">
        <Stack.Item grow={2}>
          <TextField
            label="링크 입력"
            errorMessage={!props.provider && "올바르지 않은 링크입니다."}
            description={props.provider && props.provider.name}
            onChange={props.onChange}
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
      <PrimaryButton
        text="시작"
        onClick={props.onNext}
        disabled={props.provider === undefined}
      />
    </Stack>
  );
}
