import React, { useEffect, useState } from "react";
import {
  Stack,
  IStackProps,
  PrimaryButton,
  TextField,
  TagPicker,
  ITag,
  Label,
} from "@fluentui/react";
import { ImgData } from "../Provider";
import { ipcRenderer } from "electron";

const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: "100%" } },
};

interface SuccessPageProps {
  title: string;
  author: string;
  tags: string[];
  source: string;
  images: ImgData[];
  onBack(): void;
}
export default function SuccessPage(props: SuccessPageProps): JSX.Element {
  const [title, setTitle] = useState<string>(props.title);
  const [author, setAuthor] = useState<string>(props.author);
  const [source, setSource] = useState<string>(props.source);
  const [tags, setTags] = useState<string[]>(props.tags);
  const markdown = `
| 제목 | 제작자 | 태그 | 출처 |
|--------|-------|-----|-----|
|${title}|${author}|${JSON.stringify(tags)}|${source}|

${props.images.map((img) => `- ${img.url}`).join("\n")}
  `.trim();

  useEffect(() => {
    ipcRenderer.send("resize", 600);
  }, []);

  return (
    <Stack {...columnProps}>
      <TextField
        label="제목"
        value={title}
        onChange={(_e, value): void => setTitle(value)}
      />
      <TextField
        label="제작자"
        value={author}
        onChange={(_e, value): void => setAuthor(value)}
      />
      <Stack>
        <Label>태그</Label>
        <TagPicker
          onResolveSuggestions={(filterText): ITag[] => [
            { key: 0, name: filterText },
          ]}
          selectedItems={tags.map<ITag>((tag, idx) => ({
            key: idx,
            name: tag,
          }))}
          onChange={(items): void => setTags(items.map((item) => item.name))}
        />
      </Stack>
      <TextField
        label="출처"
        value={source}
        onChange={(_e, value): void => setSource(value)}
      />
      <TextField
        value={markdown}
        label="다음 코드를 복사해서 올려주세요."
        readOnly
        multiline
        resizable={false}
        rows={10}
        onFocus={(e): void => e.target.select()}
      />
      <PrimaryButton text="처음으로" onClick={(): void => props.onBack()} />
    </Stack>
  );
}
