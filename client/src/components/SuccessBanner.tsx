interface SuccessBannerProps {
  message: string;
}

export default function SuccessBanner({ message }: SuccessBannerProps) {
  return <div className="banner-success">{message}</div>;
}