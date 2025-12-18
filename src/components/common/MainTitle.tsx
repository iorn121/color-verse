type MainTitleProps = {
  title: string;
};

export default function MainTitle({ title }: MainTitleProps) {
  return <h1 className="gradient-text text-center bold">{title}</h1>;
}
