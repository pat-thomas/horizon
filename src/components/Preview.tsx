import { FunctionComponent } from 'react';

type PreviewProps = {
  previewState: string
};

const Preview: FunctionComponent<PreviewProps> = ({ previewState }: PreviewProps) => {
  return (
    <div>
      <p>{previewState}</p>
    </div>
  )
};

export default Preview
